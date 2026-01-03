"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export function OdometerForm({ 
  reservationId, 
  initialStart, 
  initialEnd 
}: { 
  reservationId: string; 
  initialStart: number; 
  initialEnd: number; 
}) {
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (end > 0 && end < start) {
      return toast.error("End odometer cannot be less than start");
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/reservations/${reservationId}/odometer`, {
        method: "PATCH",
        body: JSON.stringify({ start, end }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Odometer updated");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 mx-4">
      <div className="flex flex-col gap-4">
        {/* Start Odometer Group */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Start (Km)</label>
          <Input 
            type="number" 
            value={start} 
            onChange={(e) => setStart(Number(e.target.value))} 
            className="focus-visible:ring-primary"
          />
          <p className="text-[11px] text-muted-foreground px-1">
            Current in DB: <span className="font-mono font-bold text-primary">{initialStart} km</span>
          </p>
        </div>

        {/* End Odometer Group */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">End (Km)</label>
          <Input 
            type="number" 
            value={end} 
            onChange={(e) => setEnd(Number(e.target.value))} 
            className="focus-visible:ring-primary"
          />
          <p className="text-[11px] text-muted-foreground px-1">
            Current in DB: <span className="font-mono font-bold text-primary">{initialEnd} km</span>
          </p>
        </div>
      </div>

      <Button 
        onClick={handleUpdate} 
        disabled={loading} 
        className="flex w-full bg-primary hover:bg-primary/90 "
      >
        {loading ? <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>: "Save & Recalculate Fees"}
      </Button>
    </div>
  );
}