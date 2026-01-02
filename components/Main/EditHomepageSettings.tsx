"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "react-hot-toast";
import { Settings, Loader2, X } from "lucide-react";

export function EditHomepageSettings({ initialData }: { initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
    visionImg: initialData?.visionImg || [],
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
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" /> Edit Home
        </Button>
      </SheetTrigger>
      
      {/* 1. Set sm:max-w-md but default to w-full for mobile */}
      <SheetContent className="w-full sm:max-w-[400px] p-0 flex flex-col">
        <div className=" overflow-y-auto">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>Homepage Settings</SheetTitle>
        </SheetHeader>
        
        {/* 2. ScrollArea takes available space without w-screen */}

          <div className="p-4 pb-24 space-y-8">
            
            {/* LOGO SECTION */}
            <div className="space-y-4">
              <Label className="font-bold">Company Logo</Label>
              {formData.logo && (
                <div className="border rounded-md p-2 w-fit bg-muted/50">
                  <img src={formData.logo} className="h-10 object-contain" />
                </div>
              )}
              <UploadDropzone 
                appearance={{
                  label: "text-black dark:text-white text-xs",
                  allowedContent: "text-black dark:text-white text-[10px]",
                  button: "bg-black dark:bg-white text-white dark:text-black text-xs px-4 py-2 h-auto",
                }}
                endpoint="carImage" 
                onClientUploadComplete={(res) => setFormData({...formData, logo: res[0].ufsUrl})} 
              />
            </div>

            {/* HERO SECTION */}
            <div className="space-y-6 border-t pt-6">
              <h3 className="font-bold text-lg">Hero & Main Content</h3>
              
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                <p className="text-sm font-semibold text-primary">Primary Heading (Hero)</p>
                <div className="space-y-2">
                  <Label>Title 1</Label>
                  <Input name="title1" value={formData.title1} onChange={handleChange} placeholder="Main Catchy Title" />
                </div>
                <div className="space-y-2">
                  <Label>Description 1</Label>
                  <Textarea name="description1" value={formData.description1} onChange={handleChange} className="min-h-[100px]" />
                </div>
              </div>

              {/* Grid: 1 column on mobile, 2 on larger screens */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                  <p className="text-sm font-semibold text-primary">Secondary Info</p>
                  <div className="space-y-2">
                    <Label>Title 2</Label>
                    <Input name="title2" value={formData.title2} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description 2</Label>
                    <Textarea name="description2" value={formData.description2} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                  <p className="text-sm font-semibold text-primary">Tertiary Info</p>
                  <div className="space-y-2">
                    <Label>Title 3</Label>
                    <Input name="title3" value={formData.title3} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description 3</Label>
                    <Textarea name="description3" value={formData.description3} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="font-bold">Hero Main Image</Label>
                {formData.mainImg && (
                  <img src={formData.mainImg} className="h-40 w-full object-cover rounded-md border" />
                )}
                <UploadDropzone
                  appearance={{
                    label: "text-black dark:text-white text-xs",
                    allowedContent: "text-black dark:text-white text-[10px]",
                    button: "bg-black dark:bg-white text-white dark:text-black text-xs px-4 py-2 h-auto",
                  }}
                  endpoint="carImage" 
                  onClientUploadComplete={(res) => setFormData({...formData, mainImg: res[0].ufsUrl})} 
                />
              </div>
            </div>

            {/* VISION SECTION */}
            <div className="space-y-6 border-t pt-6">
              <h3 className="font-bold text-lg">Vision Section</h3>
              <div className="space-y-2">
                <Label>Vision Heading</Label>
                <Input name="vision" value={formData.vision} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Vision Body Text</Label>
                <Textarea name="visionText" value={formData.visionText} onChange={handleChange} className="min-h-[120px]" />
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-sm flex justify-between">
                  Vision Gallery 
                  <span className="text-xs text-muted-foreground">{formData.visionImg.length} images</span>
                </Label>

                <div className="w-full overflow-hidden rounded-xl border bg-muted/20 p-2">
                  <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-thin scrollbar-thumb-gray-400">
                    <div className="flex flex-nowrap gap-3 min-w-max">
                      {formData.visionImg.map((url: string, i: number) => (
                        <div key={i} className="relative w-24 h-24 flex-shrink-0">
                          <img src={url} className="h-full w-full object-cover rounded-lg border bg-white" alt={`Preview ${i}`} />
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, visionImg: formData.visionImg.filter((_: string, index: number) => index !== i)})} 
                            className="absolute -top-1 -right-1   p-1  z-10"
                          >
                            <X size={12}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <UploadDropzone 
                  endpoint="carImage"
                  appearance={{
                  label: "text-black dark:text-white text-xs",
                  allowedContent: "text-black dark:text-white text-[10px]",
                  button: "bg-black dark:bg-white text-white dark:text-black text-xs px-4 py-2 h-auto",
                }} 
                  onClientUploadComplete={(res) => setFormData({...formData, visionImg: [...formData.visionImg, ...res.map(f => f.ufsUrl)]})} 
                />
              </div>
            </div>
          </div>

        {/* 3. Sticky Footer for Save Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
          <Button onClick={handleUpdate} disabled={loading} className="w-full h-12">
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Save All Changes"}
          </Button>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}