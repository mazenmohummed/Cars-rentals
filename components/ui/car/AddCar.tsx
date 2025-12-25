"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CarType } from "./CarType"
import { IntInput } from "../IntInput"
import { useState } from "react"
import { ItemContent, ItemTitle } from "../item"
import { Switch } from "../switch"
import { ImageUpload } from "../ImageUpload"
import { UploadDropzone } from "@/lib/uploadthing";
import { AddMileagePlan } from "../mileage/AddMileagePlan"
import { ScrollArea } from "@/components/ui/scroll-area"
import {toast, } from "react-hot-toast"
import { carSchema } from "@/lib/validators/car";


export function AddCar() {
    const [images, setImages] = useState<string[]>([]);
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [doors, setDoors] = useState<number | null>(null);
    const [seats, setSeats] = useState<number | null>(null)
    const [bags, setBags] = useState<number | null>(null)
    const [gearbox, setGearbox] = useState(false)
    const [isActive, setIsActive] = useState(true)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setErrors({});

    const result = carSchema.safeParse({
      name,
      type,
      doors,
      seats,
      bags,
      gearbox,
      images,
      isActive,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) fieldErrors[field as string] = issue.message;
      });

      setErrors(fieldErrors);
      toast.error("Please fix the errors");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        throw new Error("Failed to create car");
      }

      toast.success("Car added successfully 🚗");
      setOpen(false); // Close Sheet

      // Optional: reset form
      setName("");
      setType("");
      setDoors(null);
      setSeats(null);
      setBags(null);
      setGearbox(false);
      setIsActive(true);
      setImages([]);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>

    <Sheet  open={open} onOpenChange={setOpen}>
       
      <SheetTrigger asChild>
        <Button type="button" className="w-40">Add Car</Button>
      </SheetTrigger>
      <SheetContent className="flex h-screen flex-col">
        <div className="flex-1 overflow-y-auto px-4">
      <ScrollArea className=" ">
        <SheetHeader>
          <SheetTitle>New Car</SheetTitle>
          <SheetDescription>
            Add a new car here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
             <Label htmlFor="sheet-demo-name">Name</Label>
             <Input
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="Car Name"
             />
             {errors.name && (
               <p className="text-sm text-red-500">{errors.name}</p>
             )}

          </div>
          <div className="grid gap-3">
          <Label htmlFor="sheet-demo-name">Type</Label>
          <CarType onChange={setType} value={type} />
           {errors.type && (
                  <p className="text-sm text-red-500">{errors.type}</p>
                )}
          </div>
          <IntInput label="Doors" value={doors} onChange={setDoors}/>
          {errors.doors && (
             <p className="text-sm text-red-500">{errors.doors}</p>
           )}
          <IntInput label="Seats" value={seats} onChange={setSeats}/>
          {errors.seats && (
             <p className="text-sm text-red-500">{errors.doors}</p>
           )}
          <IntInput label="bags" value={bags } onChange={setBags} />
          {errors.bags && (
             <p className="text-sm text-red-500">{errors.doors}</p>
           )}
          <ItemContent>
          <ItemTitle className="text-2xl">gearbox</ItemTitle>
          <div className="flex justify-between">
          <Label htmlFor="sheet-demo-name">Automatic</Label>
          <Switch id="gearbox" checked={gearbox} onCheckedChange={setGearbox} />
          </div>
          </ItemContent>
          {/* 
          if you need to add multiple photos add conect this with car images
          <ImageUpload
             value={images}
             onChange={setImages}
             maxImages={5}
           /> */}
             <Label>Car Image</Label>
             {images && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <img 
                      src={images[0]} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
           <UploadDropzone
              endpoint="carImage"
              onClientUploadComplete={(res) => {
                if (res.length === 0) {
                  toast.error("Upload failed!");
                  return;
                }
                setImages(res.map((f) => f.ufsUrl));
              }}
              onUploadError={(err) => {
                toast.error(err.message || "Upload error");
              }}
            />
            {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}
            <ItemContent> 
                <div className="flex justify-between">
                  <ItemTitle className="text-2xl">Is Active</ItemTitle>
                  <Switch id="IsActive" checked={isActive} onCheckedChange={setIsActive} />
                </div>   
          </ItemContent>
        </div>
        <SheetFooter>
          <Button type="button" onClick={handleSubmit}  disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
    </>
  )
}
