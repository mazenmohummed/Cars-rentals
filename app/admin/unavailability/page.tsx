"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { CalendarX, Loader2, Trash2, Plus, Pencil } from "lucide-react";

interface Car {
  id: string;
  name: string;
}

interface UnavailabilityEntry {
  id: string;
  carId: string; // Added carId for editing
  startDate: string;
  endDate: string;
  reason: string | null;
  car: {
    name: string;
  };
}

export default function UnavailabilityPage() {
  const [data, setData] = useState<UnavailabilityEntry[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const fetchData = async () => {
    try {
      const [resData, resCars] = await Promise.all([
        fetch("/api/admin/unavailability").then(r => r.json()),
        fetch("/api/cars").then(r => r.json())
      ]);
      setData(resData);
      setCars(resCars);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Open Dialog for Editing
  const handleEditOpen = (entry: UnavailabilityEntry) => {
    setEditId(entry.id);
    setSelectedCar(entry.carId);
    setStartDate(format(new Date(entry.startDate), "yyyy-MM-dd"));
    setEndDate(format(new Date(entry.endDate), "yyyy-MM-dd"));
    setReason(entry.reason || "");
    setIsDialogOpen(true);
  };

  // Reset form when closing dialog
  const resetForm = () => {
    setEditId(null);
    setSelectedCar("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setIsDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedCar || !startDate || !endDate) return toast.error("Missing fields");

    const method = editId ? "PATCH" : "POST";
    const url = editId ? `/api/admin/unavailability/${editId}` : "/api/admin/unavailability";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        carId: selectedCar,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason
      })
    });

    if (res.ok) {
      toast.success(editId ? "Entry updated" : "Car blocked successfully");
      resetForm();
      fetchData();
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    const res = await fetch(`/api/admin/unavailability/${id}`, { method: "DELETE" });

    if (res.ok) {
      toast.success("Entry deleted");
      fetchData();
    } else {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarX className="h-6 w-6" /> Car Unavailability
        </h1>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if(!open) resetForm(); setIsDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditId(null)}><Plus className="mr-2 h-4 w-4" /> Block Dates</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Period" : "Add Unavailability Period"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
              >
                <option value="">Select a Car</option>
                {cars.map(car => <option key={car.id} value={car.id}>{car.name}</option>)}
              </select>
              <Input 
                placeholder="Reason (e.g. Engine Maintenance)" 
                value={reason} 
                onChange={e => setReason(e.target.value)} 
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Start</label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">End</label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editId ? "Update Changes" : "Save Block"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.car.name}</TableCell>
                <TableCell>{format(new Date(item.startDate), "PPP")}</TableCell>
                <TableCell>{format(new Date(item.endDate), "PPP")}</TableCell>
                <TableCell className="text-muted-foreground italic">{item.reason || "No reason provided"}</TableCell>
                <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditOpen(item)}
                    >
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}