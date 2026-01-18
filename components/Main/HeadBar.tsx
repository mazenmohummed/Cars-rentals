"use client";

import { useEffect, useState } from "react"; // Added hooks
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
import Image from "next/image";
import logoDark from "../logo/logoDark.png"
import logoLight from "../logo/logoLight.png"

export function HeadBar() {
  const { user: clerkUser } = useUser();
  const [logo, setLogo] = useState<string | null>(null);

  // Fetch logo from database
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await fetch("/api/settings/homepage");
        const data = await res.json();
        if (data?.logo) setLogo(data.logo);
      } catch (error) {
        console.error("Failed to load logo", error);
      }
    };
    fetchBranding();
  }, []);

  return (
    <div>
      <nav className="flex pt-6 justify-center">
        <div className="flex items-center justify-between px-6 w-full">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {logoLight && logoDark ? (
                <div className="relative h-10 w-60">
                  {/* Light Mode Logo: Hidden when parent or root has .dark */}
                  <Image
                    src={logoLight}
                    alt="Logo"
                    fill
                    priority
                    className="object-contain dark:hidden"
                    sizes="(max-width: 768px) 100px, 150px"
                  />
                  {/* Dark Mode Logo: Hidden by default, shown when .dark is present */}
                  <Image
                    src={logoDark}
                    alt="Logo"
                    fill
                    priority
                    className="hidden object-contain dark:block"
                    sizes="(max-width: 768px) 100px, 150px"
                  />
                </div>
              ) : (
                <h2 className="text-xl font-bold">Hurghadians</h2>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* <Globe className="cursor-pointer" /> */}

            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium hover:underline">Sign In</button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="bg-primary rounded-md text-secondary text-sm h-9 px-4 font-medium">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

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