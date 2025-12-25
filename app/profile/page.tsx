"use client";

import * as React from "react"
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Mail, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
  });

  // Fetch initial data from your DB via API or pass it as initial props
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/me"); // Create this simple GET route
        const data = await response.json();
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          telephone: data.telephone || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Failed to load user data");
      }
    };
    if (isLoaded) fetchUserData();
  }, [isLoaded]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast.success("Profile updated!");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader className="items-center text-center">
            <Avatar className="w-20 h-20 mb-2">
              <AvatarImage src={clerkUser?.imageUrl} />
              <AvatarFallback>{formData.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <CardTitle>{formData.firstName} {formData.lastName}</CardTitle>
            <CardDescription>{formData.email}</CardDescription>
          </CardHeader>
          <div className="flex mx-auto flex-col gap-2 pt-6">
          <Link href="profile/reservations" >
          <Button>Manege Reservations</Button>
          </Link>
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input 
                    value={formData.firstName} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input 
                    value={formData.lastName} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={formData.email} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  value={formData.telephone} 
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})} 
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}