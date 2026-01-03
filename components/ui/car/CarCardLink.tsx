"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface CarCardLinkProps {
  href: string;
  children: React.ReactNode;
}

export function CarCardLink({ href, children }: CarCardLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePush = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <div className="relative group cursor-pointer" onClick={handlePush}>
      {/* The actual Card Content */}
      <div className={`${isPending ? "opacity-40 grayscale-[0.5]" : ""} transition-all duration-300`}>
        {children}
      </div>

      {/* The Spinner Overlay */}
      {isPending && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[2px] rounded-xl">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="mt-2 text-sm font-bold text-primary animate-pulse">Preparing your car...</span>
        </div>
      )}
    </div>
  );
}