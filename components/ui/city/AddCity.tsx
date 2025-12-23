"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Use textarea for description
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "react-hot-toast";
import { citySchema } from "@/lib/validators/city";
import { useRouter } from "next/navigation";

export function AddCity() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transFee, setTransFee] = useState<number | "">("")
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setErrors({});

    const result = citySchema.safeParse({
      name,
      description,
      image,
      transFee,
    });

 if (!result.success) {
  // Use flatten() to see a clean map of errors in your console
  console.log("Validation Errors:", result.error.flatten().fieldErrors);

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

      const res = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create city");
      }

      toast.success("City added successfully 🏙️");
      setOpen(false);

      // Reset Form
      setName("");
      setDescription("");
      setImage("");
      setTransFee("");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Add City</Button>
      </SheetTrigger>
      <SheetContent className="flex h-screen flex-col">
        <div className="flex-1 overflow-y-auto px-4">
          <ScrollArea className="h-full">
            <SheetHeader>
              <SheetTitle>New City</SheetTitle>
              <SheetDescription>
                Add a new service city here.
              </SheetDescription>
            </SheetHeader>

            <div className="grid flex-1 auto-rows-min gap-6 py-6">
              {/* Name Input */}
              <div className="grid gap-3">
                <Label htmlFor="city-name">City Name</Label>
                <Input
                  id="city-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hurghada"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Description Input */}
              <div className="grid gap-3">
                <Label htmlFor="city-description">Description</Label>
                <Textarea
                  id="city-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the city or coverage area..."
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="grid gap-3">
                <Label>City Image</Label>
                {image && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <UploadDropzone
                  endpoint="carImage" // Reusing your endpoint or use 'cityImage' if defined
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      setImage(res[0].ufsUrl);
                      toast.success("Image uploaded!");
                    }
                  }}
                  onUploadError={(err) => {
                    toast.error(err.message || "Upload error");
                  }}
                />
                {errors.image && (
                  <p className="text-sm text-red-500">{errors.image}</p>
                )}
              </div>
              {/* Transportation fees */}
              <div>
                <label className="block font-medium mb-1">Transportation fees</label>
                <input
                  type="number"
                  value={transFee}
                  onChange={(e) => setTransFee( e.target.value === "" ? "" : Number(e.target.value))}
                  className="border px-2 py-1 rounded-md w-full"
                  min={0}
                  required
                />
                {errors.pricePerDay && (
                  <p className="text-red-500 text-sm">{errors.pricePerDay}</p>
                )}
              </div>
            </div>

            <SheetFooter className="mt-6">
              <Button 
                type="button" 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Saving..." : "Save City"}
              </Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}