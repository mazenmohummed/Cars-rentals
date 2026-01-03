"use client";


import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useEffect, useTransition } from "react"; //
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTryAgain = () => {
    startTransition(() => {
      router.refresh(); // Forces a server-side data re-fetch
      reset();          // Attempts to re-render the segment
    });
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-600" />
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Something went wrong!
      </h1>
      
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected engine stall. This has been reported, and we are working to get the route clear.
      </p>

      <div className="flex gap-4">
        <Button 
            onClick={handleTryAgain} 
            disabled={isPending}
            variant="default"
            className="gap-2"
            >
          {isPending ? (
        <RefreshCcw size={18} className="animate-spin" />
      ) : (
        <RefreshCcw size={18} />
      )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/'}
        >
          Return Home
        </Button>
      </div>
      
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-8 p-4 bg-muted rounded-lg text-xs text-left overflow-auto max-w-full">
          {error.message}
        </pre>
      )}
    </div>
  );
}