"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export interface ICityData {
  id: string;
  name: string;
  description: string;
  image: string;
  transFee: number;
}

export interface UpdateCityProps {
  cityId: string;
  initialData: ICityData;
}

export function UpdateCity({ cityId, initialData }: UpdateCityProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [image, setImage] = useState(initialData.image);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transFee, setTransFee] = useState<number | "">(initialData.transFee)
  const [open, setOpen] = useState(false);

  // Sync state if initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setImage(initialData.image);
      setTransFee(initialData.transFee)
    }
  }, [initialData]);

  const handleUpdate = async () => {
    setErrors({});

    const result = citySchema.safeParse({ name, description, image , transFee });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) fieldErrors[field as string] = issue.message;
      });
      setErrors(fieldErrors);
      return toast.error("Please fix the errors");
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/cities/${cityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error("Failed to update city");

      toast.success("City updated successfully 🏙️");
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this city?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/cities/${cityId}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete city");

      toast.success("City deleted");
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Could not delete city");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Edit</Button>
      </SheetTrigger>
      <SheetContent className="flex h-screen flex-col">
        <div className="flex-1 overflow-y-auto px-4">
          <ScrollArea className="h-full">
            <SheetHeader>
              <SheetTitle>Update City</SheetTitle>
              <SheetDescription>Edit city details or remove it.</SheetDescription>
            </SheetHeader>

            <div className="grid gap-6 py-6">
              <div className="grid gap-3">
                <Label htmlFor="edit-city-name">City Name</Label>
                <Input
                  id="edit-city-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="edit-city-description">Description</Label>
                <Textarea
                  id="edit-city-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="grid gap-3">
                <Label>City Image</Label>
                {image && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <img src={image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <UploadDropzone
                  endpoint="carImage"
                  onClientUploadComplete={(res) => {
                    if (res) {
                      setImage(res[0].ufsUrl);
                      toast.success("New image uploaded!");
                    }
                  }}
                  onUploadError={(err) => {toast.error(err.message)}}
                />
              </div>
                {/* Transportation fees */}
              <div>
                <label className="block font-medium mb-1">Transportation fees</label>
                <input
                  type="number"
                  step="0.01"
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

            <SheetFooter className="mt-6 flex-col gap-2">
              <Button onClick={handleUpdate} disabled={loading} className="w-full">
                {loading ? "Updating..." : "Update City"}
              </Button>
              <Button onClick={handleDelete} variant="destructive" disabled={loading} className="w-full">
                Delete City
              </Button>
              <SheetClose asChild>
                <Button variant="ghost" className="w-full">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}