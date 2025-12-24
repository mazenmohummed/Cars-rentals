"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit } from "lucide-react"

export function ServiceForm({ service }: { service?: { id: string; name: string; price: number } }) {
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
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Submit error", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {service ? <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button> : <Button><Plus className="mr-2 h-4 w-4" /> Add Service</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{service ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Service Name" defaultValue={service?.name} required />
          <Input name="price" type="number" placeholder="Price" defaultValue={service?.price} required />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}