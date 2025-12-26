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
import { MoreHorizontal, ShieldAlert, UserCog, Trash2, Search, Loader2 } from "lucide-react";
import { UserRole } from "@prisma/client";
import { useUser } from "@clerk/nextjs"; // 1. Import useUser

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
    // 1. Safety confirmation
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

   const promise = fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    .then(async (res) => {
      if (!res.ok) {
        // This gets the text message we sent from the API (like "Cannot delete user...")
        const errorText = await res.text();
        throw new Error(errorText);
      }
      fetchUsers();
    });

    toast.promise(promise, {
      loading: 'Deleting user...',
      success: 'User deleted successfully',
      error: (err) => err.message,
    });
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search name or email..." 
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-mono">{user.telephone || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user._count?.reservations || 0}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {Object.values(UserRole).map((role) => (
                        <DropdownMenuItem 
                          key={role} 
                          onClick={() => updateRole(user.id, role)}
                          disabled={user.role === role}
                        >
                          <UserCog className="mr-2 h-4 w-4" /> Set as {role}
                        </DropdownMenuItem>
                      ))}
                       <DropdownMenuItem 
                        onClick={() => onDelete(user.id, `${user.firstName} ${user.lastName}`, user.clerkId)} 
                        disabled={user.clerkId === currentUser?.id}
                        className="text-destructive focus:bg-destructive/10 disabled:opacity-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> 
                        {user.clerkId === currentUser?.id ? "You (Current Admin)" : "Delete User"}
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