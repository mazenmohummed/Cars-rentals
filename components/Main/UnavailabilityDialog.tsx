"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { CalendarX, Loader2, Trash2, Plus, Pencil, X, Search, Filter } from "lucide-react";
import { format, startOfDay } from "date-fns";

interface Car {
  id: string;
  name: string;
}

interface UnavailabilityEntry {
  id: string;
  carId: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  car: {
    name: string;
  };
}

export default function UnavailabilityDialog() {
  const [data, setData] = useState<UnavailabilityEntry[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Toggle for mobile filters

  // Filter State
  const [searchCar, setSearchCar] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  
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

  const handleEditOpen = (entry: UnavailabilityEntry) => {
    setEditId(entry.id);
    setSelectedCar(entry.carId);
    setStartDate(format(new Date(entry.startDate), "yyyy-MM-dd"));
    setEndDate(format(new Date(entry.endDate), "yyyy-MM-dd"));
    setReason(entry.reason || "");
    setIsDialogOpen(true);
  };

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
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/admin/unavailability/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Entry deleted");
      fetchData();
    }
  };

  const filteredData = data.filter((item) => {
    const matchesCar = item.car.name.toLowerCase().includes(searchCar.toLowerCase());
    let matchesDateRange = true;
    if (filterStartDate || filterEndDate) {
      const itemStart = startOfDay(new Date(item.startDate));
      const itemEnd = startOfDay(new Date(item.endDate));
      const afterStart = filterStartDate ? itemEnd >= startOfDay(new Date(filterStartDate)) : true;
      const beforeEnd = filterEndDate ? itemStart <= startOfDay(new Date(filterEndDate)) : true;
      matchesDateRange = afterStart && beforeEnd;
    }
    return matchesCar && matchesDateRange;
  });

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-full overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <CalendarX className="h-5 w-5 md:h-6 md:w-6" /> Unavailability
        </h1>
        
        <div className="flex w-full sm:w-auto gap-2">
           <Button 
            variant="outline" 
            className="flex-1 sm:hidden"
            onClick={() => setShowFilters(!showFilters)}
           >
             <Filter className="mr-2 h-4 w-4" /> Filters
           </Button>

          <Dialog open={isDialogOpen} onOpenChange={(open) => { if(!open) resetForm(); setIsDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none" onClick={() => setEditId(null)}>
                <Plus className="mr-2 h-4 w-4" /> Block
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-[425px] rounded-lg">
              <DialogHeader>
                <DialogTitle>{editId ? "Edit Period" : "Add Unavailability"}</DialogTitle>
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
                  placeholder="Reason (e.g. Maintenance)" 
                  value={reason} 
                  onChange={e => setReason(e.target.value)} 
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Start Date</label>
                    <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">End Date</label>
                    <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full h-11">
                  {editId ? "Update Changes" : "Save Block"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* FILTER BAR - Responsive */}
      <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-col lg:flex-row gap-4 bg-muted/40 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search car..." 
            className="pl-10 bg-background h-10"
            value={searchCar}
            onChange={(e) => setSearchCar(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 lg:flex items-center gap-2">
          <Input 
            type="date" 
            className="bg-background text-xs"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
          <Input 
            type="date" 
            className="bg-background text-xs"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </div>

        {(searchCar || filterStartDate || filterEndDate) && (
          <Button variant="ghost" size="sm" onClick={() => { setSearchCar(""); setFilterStartDate(""); setFilterEndDate(""); }}>
            <X className="h-4 w-4 mr-2" /> Reset
          </Button>
        )}
      </div>

      {/* TABLE SECTION - Horizontal Scroll */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[700px]"> {/* Ensures table doesn't collapse */}
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Car Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold">{item.car.name}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{format(new Date(item.startDate), "MMM d, yyyy")}</span>
                        <span className="text-[10px] text-muted-foreground italic">to {format(new Date(item.endDate), "MMM d, yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {item.reason || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditOpen(item)}>
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-sm">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Mobile Swipe Hint */}
        <div className="sm:hidden p-2 bg-muted/20 border-t text-[10px] text-center text-muted-foreground">
          Swipe left to see more details
        </div>
      </div>
    </div>
  );
}