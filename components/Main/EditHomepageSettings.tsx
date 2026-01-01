"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "react-hot-toast";
import { Settings, Loader2, X } from "lucide-react";

export function EditHomepageSettings({ initialData }: { initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    logo: initialData?.logo || "",
    title1: initialData?.title1 || "",
    description1: initialData?.description1 || "",
    title2: initialData?.title2 || "",
    description2: initialData?.description2 || "",
    title3: initialData?.title3 || "",
    description3: initialData?.description3 || "",
    mainImg: initialData?.mainImg || "",
    vision: initialData?.vision || "",
    visionText: initialData?.visionText || "",
    visionImg: initialData?.visionImg || [], // Array for multiple images
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      toast.success("Homepage updated!");
      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2"><Settings className="h-4 w-4" /> Edit Home</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>Homepage Settings</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-4">
          <div className="flex-1 overflow-y-auto px-4">
            {/* LOGO SECTION */}
            <div className="space-y-2">
              <Label>Logo</Label>
              {formData.logo && <img src={formData.logo} className="h-10 object-contain mb-2" />}
              <UploadDropzone   
              appearance={{
              label: "text-black dark:text-white", // Changes "Choose file(s) or drag and drop"
              allowedContent: "text-black dark:text-white", // Changes "Images up to 4MB, max 5"
              button: "bg-black p-2 dark:bg-white text-white dark:text-black", // Optional: style the button
            }}
             endpoint="carImage" onClientUploadComplete={(res) => setFormData({...formData, logo: res[0].ufsUrl})} />
            </div>

            {/* HERO SECTION - ALL 3 TITLES */}
            <div className="space-y-6 border-t pt-6">
              <h3 className="font-bold text-lg">Hero & Main Content</h3>
              
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                <p className="text-sm font-semibold text-primary">Primary Heading (Hero)</p>
                <div>
                  <Label>Title 1</Label>
                  <Input name="title1" value={formData.title1} onChange={handleChange} placeholder="Main Catchy Title" />
                </div>
                <div>
                  <Label>Description 1</Label>
                  <Textarea name="description1" value={formData.description1} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-primary">Secondary Info</p>
                  <div>
                    <Label>Title 2</Label>
                    <Input name="title2" value={formData.title2} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>Description 2</Label>
                    <Textarea name="description2" value={formData.description2} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-primary">Tertiary Info</p>
                  <div>
                    <Label>Title 3</Label>
                    <Input name="title3" value={formData.title3} onChange={handleChange} />
                  </div>
                  <div>
                    <Label>Description 3</Label>
                    <Textarea name="description3" value={formData.description3} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hero Main Image</Label>
                {formData.mainImg && <img src={formData.mainImg} className="h-40 w-full object-cover rounded-md mb-2" />}
                <UploadDropzone
                appearance={{
                    label: "text-black dark:text-white", // Changes "Choose file(s) or drag and drop"
                    allowedContent: "text-black dark:text-white", // Changes "Images up to 4MB, max 5"
                    button: "bg-black p-2 dark:bg-white text-white dark:text-black", // Optional: style the button
                  }}
                  endpoint="carImage" onClientUploadComplete={(res) => setFormData({...formData, mainImg: res[0].ufsUrl})} />
              </div>
            </div>

            {/* VISION SECTION */}
            <div className="grid gap-4 border-t pt-4">
              <h3 className="font-bold text-lg">Vision Section</h3>
              <div>
                <Label>Vision Heading</Label>
                <Input name="vision" value={formData.vision} onChange={handleChange} />
              </div>
              <div>
                <Label>Vision Body Text</Label>
                <Textarea name="visionText" value={formData.visionText} onChange={handleChange} />
              </div>
              <div>
                <Label>Vision Gallery (Multiple Images)</Label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {formData.visionImg.map((url: string, i: number) => (
                    <div key={i} className="relative group">
                      <img src={url} className="h-20 w-full object-cover rounded" />
                      <button onClick={() => setFormData({...formData, visionImg: formData.visionImg.filter((_: string, index: number) => index !== i)})} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"><X size={12}/></button>
                    </div>
                  ))}
                </div>
                <UploadDropzone 
                  appearance={{
                    label: "text-black dark:text-white", // Changes "Choose file(s) or drag and drop"
                    allowedContent: "text-black dark:text-white", // Changes "Images up to 4MB, max 5"
                    button: "bg-black p-2 dark:bg-white text-white dark:text-black", // Optional: style the button
                  }}
                  endpoint="carImage" onClientUploadComplete={(res) => setFormData({...formData, visionImg: [...formData.visionImg, ...res.map(f => f.ufsUrl)]})} />
              </div>
            </div>

            <Button onClick={handleUpdate} disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : "Save All Changes"}
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}