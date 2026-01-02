import { prisma } from "@/lib/prisma"
import { ServiceForm } from "@/components/ui/services/ServiceForm"
import { ServiceControls } from "@/components/ui/services/ServiceControls"
import { Settings2 } from "lucide-react"
import { requireAdmin } from "@/lib/auth"

export default async function ManageServicesPage() {
  await requireAdmin() 

  const services = await prisma.extraService.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Extra Services</h1>
        <ServiceForm />
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col items-center justify-between p-4 border rounded-xl bg-card shadow-sm">
            <div className="flex items-center gap-4">
              <Settings2 className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-bold">{service.name}</h3>
                <p className="text-sm text-muted-foreground">${service.price}</p>
                <p className="text-sm text-muted-foregroun wrap-break-word" >{service?.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ServiceForm service={service} />
              <ServiceControls id={service.id} isActive={service.isActive} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}