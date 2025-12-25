"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
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
  Eye, Search, Filter, RefreshCcw, ShieldCheck
} from "lucide-react";
import { ReservationStatus, PaymentStatus } from "@prisma/client";

export default function AdminReservationsClient() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

  const onUpdate = async (id: string, status: ReservationStatus, payStatus: PaymentStatus) => {
    const promise = fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentStatus: payStatus }),
    }).then(async (res) => {
      if (!res.ok) throw new Error();
      fetchAll();
    });

    toast.promise(promise, {
      loading: 'Updating...',
      success: 'Update successful!',
      error: 'Update failed.',
    });
  };

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted");
        fetchAll();
      }
    } catch (err) { toast.error("Delete failed"); }
  };

  const filtered = reservations.filter((res: any) => 
    res.user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    res.car.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search bookings..." 
            className="pl-10 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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