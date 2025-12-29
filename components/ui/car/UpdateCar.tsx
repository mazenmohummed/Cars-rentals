"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "react-hot-toast";
import { Switch } from "../switch";
import { UploadDropzone } from "@/lib/uploadthing";
import { IntInput } from "../IntInput";
import { CarType } from "./CarType";
import { ItemContent, ItemTitle } from "../item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";


export interface ICarData {
  id: string;
  name: string;
  type: string;
  doors: number | null;  // Changed from number to number | null
  seats: number | null;
  bags: number | null;
  gearbox: boolean | null;
  isActive: boolean;
  mainImage: string ;
}



interface UpdateCarProps {
  carId: string;
  initialData: ICarData;
}

export const UpdateCar = ({ carId,initialData }: UpdateCarProps) => {
  // Car Fields
  const [name, setName] = useState(initialData.name);
  const [carType, setCarType] = useState(initialData.type);
  const [doors, setDoors] = useState<number | null>(initialData.doors);
  const [seats, setSeats] = useState<number | null>(initialData.seats);
  const [bags, setBags] = useState<number | null>(initialData.bags);
  const [gearbox, setGearbox] = useState(initialData.gearbox ?? false);
  const [isActive, setIsActive] = useState(initialData.isActive);
  const [images, setImages] = useState<string>(initialData.mainImage || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);


 // delete car

 const deleteCar = async () => {
  setErrors({});
  if (!confirm("Are you sure you want to delete this car? This cannot be undone.")) return;

  try {
    const res = await fetch(`/api/cars/${carId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.error || "Failed to delete car");
    }

    toast.success("Car deleted successfully!");
    // Redirect after deletion
    window.location.href = "/admin/cars";
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Something went wrong while deleting the car.");
  }
};

  // -------- UPDATE CAR ----------

  useEffect(() => {
  if (initialData) {
    setName(initialData.name);
    setCarType(initialData.type);
    setDoors(initialData.doors);
    setSeats(initialData.seats);
    setBags(initialData.bags);
    setGearbox(initialData.gearbox ?? false);
    setIsActive(initialData.isActive);
    setImages(initialData.mainImage);
  }
}, [initialData]);

  

  const router = useRouter();

const updateCar = async () => {
  setErrors({});
  try {
    setLoading(true);

    const res = await fetch(`/api/cars/${carId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type: carType,
        doors,
        seats,
        bags,
        gearbox,
        isActive,
        mainImage: images, // Send the string
        images: [images],  // Send the array for Prisma String[]
      }),
    });

    if (!res.ok) throw new Error("Failed updating car");

    toast.success("Car Updated Successfully 🚗");
    setOpen(false);
    router.refresh();
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

 
  

  return (
   <>
     
      <Sheet  open={open} onOpenChange={setOpen}>
         
        <SheetTrigger className="w-full" asChild>
          <Button type="button" >Update Car</Button>
        </SheetTrigger>
        <SheetContent className="flex h-screen flex-col">
          <div className="flex-1 overflow-y-auto px-4">
        <ScrollArea className=" ">
          <SheetHeader>
            <SheetTitle>Update Car</SheetTitle>
            <SheetDescription>
              Update the car here. Click save when you&apos;re done.
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
            <CarType onChange={setCarType} value={carType} />
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
               <p className="text-sm text-red-500">{errors.seats}</p>
             )}
            <IntInput label="bags" value={bags } onChange={setBags} />
            {errors.bags && (
               <p className="text-sm text-red-500">{errors.bags}</p>
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
                      src={images} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
             
           <UploadDropzone
                  endpoint="carImage"
                   appearance={{
                    label: "text-black dark:text-white", // Changes "Choose file(s) or drag and drop"
                    allowedContent: "text-black dark:text-white", // Changes "Images up to 4MB, max 5"
                    button: "bg-black p-2 dark:bg-white text-white dark:text-black", // Optional: style the button
                  }}
                  onClientUploadComplete={(res) => {
                    if (!res || res.length === 0) {
                      toast.error("Upload failed!");
                      return;
                    }

                    
                    const uploadedUrl = res[0].ufsUrl;
                    
                    setImages(uploadedUrl); // Now it's string to string.
                    toast.success("Image uploaded!");
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
            <Button type="button" onClick={updateCar}  disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
            <Button variant="destructive" onClick={deleteCar}>
             Delete Car
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
      </>
  );
};
