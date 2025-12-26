"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Added Textarea
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit } from "lucide-react"
import { toast } from "react-hot-toast"

// Updated interface to include description
interface Service {
  id: string;
  name: string;
  price: number;
  description?: string | null; 
}

export function ServiceForm({ service }: { service?: Service }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      description: formData.get("description"), // Collect description
    }

    const url = service ? `/api/services/${service.id}` : "/api/services"
    const method = service ? "PATCH" : "POST"

    try {
      const res = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        toast.success(service ? "Service updated" : "Service added")
        setOpen(false)
        router.refresh()
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.error("Submit error", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {service ? (
          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
        ) : (
          <Button><Plus className="mr-2 h-4 w-4" /> Add Service</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add Service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Name</label>
            <Input name="name" placeholder="e.g., GPS Navigation" defaultValue={service?.name} required />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Daily Price (EGP)</label>
            <Input name="price" type="number" placeholder="Price" defaultValue={service?.price} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              name="description" 
              placeholder="Briefly explain what this service includes..." 
              defaultValue={service?.description ?? ""}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Service"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}