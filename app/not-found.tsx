import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, ChevronLeft, PhoneCall } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Container matches your layout's 5/6 width logic */}
      <main className="flex-grow flex items-center justify-center px-6 py-24 mx-auto w-full md:w-5/6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE: Optimized Image */}
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <Image
              src="/hero-car.jpg" // Use your existing hero image or a 404-specific car image
              alt="404 - Car Not Found"
              fill
              priority
              className="object-cover rounded-3xl grayscale opacity-50 transition-all duration-700 hover:grayscale-0 hover:opacity-100"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          {/* RIGHT SIDE: Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-8xl font-black text-primary/20 leading-none">
              404
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Lost in the garage?
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
              We couldn&apos;t find the vehicle or page you were looking for. 
              The engine might have stalled or the route was moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/">
                <Button size="lg" className="gap-2 px-8">
                  <Home size={18} />
                  Back to Showroom
                </Button>
              </Link>
              
                <Link className="flex items-center " 
           href="https://wa.me/qr/QOO46YVL7TW5G1"  
           target="_blank"
           rel="noopener noreferrer"
           >
            <Button variant="default" className="gap-2 w-full sm:w-auto">
              <PhoneCall size={18} />
              Contact for Support
            </Button>
          </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}