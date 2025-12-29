"use client";

import { Globe, Menu } from "lucide-react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from '@clerk/nextjs'
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export function HeadBar() {
  const { user: clerkUser } = useUser();

  return (
    <div>
      <nav className="flex pt-6 justify-center">
        <div className="flex items-center justify-between px-6 w-full">
          <div className="flex items-center">
            <Link href="/">
              <h2 className="text-xl font-bold">Cars</h2>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Globe className="cursor-pointer" />

            {/* CASE 1: USER IS NOT LOGGED IN */}
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium hover:underline">Sign In</button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="bg-primary text-primary-foreground rounded-md text-sm h-9 px-4 font-medium">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

            {/* CASE 2: USER IS LOGGED IN */}
            <SignedIn>
              <Link href="/profile" className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border hover:opacity-80 transition">
                  <AvatarImage src={clerkUser?.imageUrl} alt="Profile" />
                  <AvatarFallback>
                    {clerkUser?.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>
    </div>
  )
}