"use client";

import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { MoreHorizontal, UserCog, Trash2, Search, Loader2, Phone } from "lucide-react";
import { UserRole } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

export default function UserManagementClient() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateRole = async (id: string, role: UserRole) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        toast.success("Role updated");
        fetchUsers();
      }
    } catch (err) { toast.error("Update failed"); }
  };

  const filteredUsers = users.filter((u) => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const onDelete = async (id: string, name: string, clerkId: string) => {
    if (clerkId === currentUser?.id) {
      toast.error("You cannot delete your own admin account.");
      return;
    }
    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (!confirmDelete) return;

    const promise = fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        fetchUsers();
      });

    toast.promise(promise, {
      loading: 'Deleting...',
      success: 'User deleted',
      error: (err) => err.message,
    });
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Search Bar optimized for mobile */}
      <div className="px-1">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-10 h-11 sm:h-9 text-base" // Bigger touch target for mobile
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto "> {/* Critical for mobile scrolling */}
          <Table className="min-w-[600px] rounded-xl"> {/* Prevents columns from squishing */}
            <TableHeader className="bg-muted/50 rounded-xl">
              <TableRow>
                <TableHead className="w-[200px]">User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Bookings</TableHead>
                <TableHead className="text-right px-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm truncate max-w-[150px]">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <Phone size={12} className="text-muted-foreground" />
                      {user.telephone || "---"}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "outline"} className="text-[10px] uppercase">
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center font-medium">
                    {user._count?.reservations || 0}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        {Object.values(UserRole).map((role) => (
                          <DropdownMenuItem 
                            key={role} 
                            onClick={() => updateRole(user.id, role)}
                            disabled={user.role === role}
                            className="text-sm"
                          >
                            <UserCog className="mr-2 h-4 w-4" /> Set as {role}
                          </DropdownMenuItem>
                        ))}
                         <DropdownMenuItem 
                          onClick={() => onDelete(user.id, `${user.firstName} ${user.lastName}`, user.clerkId)} 
                          disabled={user.clerkId === currentUser?.id}
                          className="text-destructive focus:bg-destructive/10 disabled:opacity-50 text-sm"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> 
                          Delete
                        </DropdownMenuItem>           
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  
                </TableRow>
              ))}
               {/* Mobile Swipe Hint */}
                <div className="sm:hidden p-2 text-[12px] text-center text-muted-foreground">
                  Swipe left to see more details
                </div>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}