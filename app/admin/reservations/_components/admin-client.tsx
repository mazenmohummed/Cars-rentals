"use client";

import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { 
  CreditCard, Loader2, MoreHorizontal, Trash2, 
  Eye, Search, Filter, RefreshCcw, ShieldCheck,
  X
} from "lucide-react";
import { ReservationStatus, PaymentStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Ensure you have this component installed
import { format, startOfDay } from "date-fns"; // Added startOfDay


export default function AdminReservationsClient() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const fetchAll = async () => {
    try {
      const res = await fetch("/api/admin/reservations");
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const onUpdate = async (id: string, status: ReservationStatus, payStatus: PaymentStatus | undefined) => {
  // 1. Defend against undefined status which crashes Prisma
  const paymentStatusToSend = payStatus || "PENDING";

  const promise = fetch(`/api/admin/reservations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    // 2. Ensure keys match what the API expects (paymentStatus)
    body: JSON.stringify({ 
      status, 
      paymentStatus: paymentStatusToSend 
    }),
  }).then(async (res) => {
    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg || "Failed to update");
    }
    fetchAll();
  });

  toast.promise(promise, {
    loading: 'Updating...',
    success: 'Update successful!',
    error: (err) => err.message || 'Update failed.',
  });
};

const onDelete = async (id: string) => {
  if (!confirm("Are you sure? This action cannot be undone.")) return;

  const promise = fetch(`/api/admin/reservations/${id}`, { 
    method: "DELETE" 
  }).then(async (res) => {
    if (!res.ok) throw new Error("Failed to delete");
    fetchAll();
  });

  toast.promise(promise, {
    loading: 'Deleting reservation...',
    success: 'Reservation deleted',
    error: 'Delete failed.',
  });
};

// 2. Updated Filter Logic
const filtered = reservations.filter((res: any) => {
  const fullName = `${res.user?.firstName || ""} ${res.user?.lastName || ""}`.toLowerCase();
  const carName = (res.car?.name || "").toLowerCase();
  const phone = res.user?.telephone || "";
  const searchTerm = search.toLowerCase();

  const matchesSearch = 
    fullName.includes(searchTerm) || 
    carName.includes(searchTerm) || 
    phone.includes(searchTerm);

  const matchesStatus = statusFilter === "ALL" || res.status === statusFilter;
  const matchesPayment = paymentFilter === "ALL" || (res.payment?.status || "PENDING") === paymentFilter;

  // DATE RANGE LOGIC
  let matchesDateRange = true;
  if (filterStartDate || filterEndDate) {
    const resStart = startOfDay(new Date(res.startDate));
    const resEnd = startOfDay(new Date(res.endDate));
    
    const afterStart = filterStartDate 
      ? resEnd >= startOfDay(new Date(filterStartDate)) 
      : true;
      
    const beforeEnd = filterEndDate 
      ? resStart <= startOfDay(new Date(filterEndDate)) 
      : true;

    matchesDateRange = afterStart && beforeEnd;
  }

  return matchesSearch && matchesStatus && matchesPayment && matchesDateRange;
});

// 3. Update resetFilters to clear dates
const resetFilters = () => {
  setSearch("");
  setStatusFilter("ALL");
  setPaymentFilter("ALL");
  setFilterStartDate("");
  setFilterEndDate("");
};

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="space-y-4">
    <div className="flex flex-col gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col lg:flex-row w-full gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search name, car, or phone..." 
              className="pl-10 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Date Range Inputs */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs font-bold text-muted-foreground uppercase">From</span>
              <Input 
                type="date" 
                className="bg-background w-full md:w-[150px]"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs font-bold text-muted-foreground uppercase">To</span>
              <Input 
                type="date" 
                className="bg-background w-full md:w-[150px]"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t pt-3">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(ReservationStatus).map(s => (
                <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Payment Filter */}
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Payments</SelectItem>
              <SelectItem value="PAID">PAID</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          {(search || statusFilter !== "ALL" || paymentFilter !== "ALL" || filterStartDate || filterEndDate) && (
            <Button variant="ghost" onClick={resetFilters} className="h-10 px-2 lg:px-3 text-destructive hover:text-destructive">
              <X className="h-4 w-4 mr-2" /> Reset All Filters
            </Button>
          )}
        </div>
      </div>
      {/* TABLE SECTION */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          {/* ... (Keep TableHeader and TableBody content) */}
        </Table>
        
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No reservations found matching these filters.
          </div>
        )}
      </div>
    

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Customer & Car</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((res: any) => (
              <TableRow key={res.id} className="hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{res.user.firstName} {res.user.lastName}</span>
                    <span className="text-xs font-mono text-primary flex items-center gap-1">
                    {res.user.telephone || "No phone provided"}
                    </span>
                    <span className="text-xs text-muted-foreground">{res.car.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                   {format(new Date(res.startDate), "MMM dd")} - {format(new Date(res.endDate), "MMM dd")}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="uppercase text-[10px] font-bold tracking-wider">
                    {res.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={res.payment?.status === "PAID" ? "outline" : "destructive"}
                    className={res.payment?.status === "PAID" ? "border-green-500 text-green-600 dark:text-green-400" : ""}
                  >
                    {res.payment?.status || "PENDING"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Manage Reservation</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => window.location.href = `/profile/reservations/${res.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Full Details
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />

                      {/* --- RESERVATION STATUS SUB-MENU --- */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <RefreshCcw className="mr-2 h-4 w-4" /> Change Status
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {Object.values(ReservationStatus).map((status) => (
                              <DropdownMenuItem 
                                key={status}
                                onClick={() => onUpdate(res.id, status, res.payment?.status)}
                                className={res.status === status ? "bg-muted font-bold" : ""}
                              >
                                {status.replace("_", " ")}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>

                      {/* --- PAYMENT STATUS SUB-MENU --- */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <ShieldCheck className="mr-2 h-4 w-4" /> Update Payment
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {Object.values(PaymentStatus).map((pStatus) => (
                              <DropdownMenuItem 
                                key={pStatus}
                                onClick={() => onUpdate(res.id, res.status, pStatus)}
                                className={res.payment?.status === pStatus ? "bg-muted font-bold" : ""}
                              >
                                {pStatus}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(res.id)} className="text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Reservation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}