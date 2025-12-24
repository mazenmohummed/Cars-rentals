"use client"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ServiceControls({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();

  const toggleStatus = async (checked: boolean) => {
    await fetch(`/api/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: checked }),
    });
    router.refresh();
  };

  const removeService = async () => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Active</span>
        <Switch checked={isActive} onCheckedChange={toggleStatus} />
      </div>
      <Button variant="ghost" size="icon" onClick={removeService} className="text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}