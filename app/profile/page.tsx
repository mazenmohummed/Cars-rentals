"use client";

import * as React from "react"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {  Loader2, X } from "lucide-react"; 
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs"; 
import { ModeToggleSelect } from "@/components/HeadBar/ModeToggle";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const router = useRouter();
  const { userId, isLoaded: isAuthLoaded } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
  });  
  const { signOut } = useClerk();

  useEffect(() => {
    if (isAuthLoaded && !userId) {
      // toast.error("Please sign in to access your profile");
      
      // Redirect to sign-up and return here afterwards
      const currentPath = window.location.pathname;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthLoaded, userId, router]);



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

  

  if (!userId) return null;

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

          <ModeToggleSelect/>

          <div className="flex mx-auto flex-col gap-2 pt-6">
          <Link href="profile/reservations" >
          <Button className="text-white">Manege Reservations</Button>
          </Link>
          </div>
          {/* 3. New Sign Out Button */}
            <Button 
              variant="destructive" 
              className="flex mx-auto gap-2"
              onClick={() => signOut({ redirectUrl: "/" })} // Redirect to home after logout
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2">
          <CardHeader className="flex justify-between flex-row">
            <CardTitle>Settings</CardTitle>
              <Button 
            variant="ghost" 
            size="icon" 
            className="flex right-4 top-4 text-muted-foreground"
            onClick={() => router.back()}
          >
            <X className="h-4 w-4" />
          </Button>
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

              

              <Button type="submit" disabled={loading} className="w-full text-white md:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()} 
                className="w-full md:mx-6 lg:mx-6 xl:mx-6 md:w-auto"
              >
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}