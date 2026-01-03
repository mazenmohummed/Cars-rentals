"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function Vision({ data }: { data: any }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  // 1. Better safety check: Ensure visionImg is an array and has items
  if (!data || !data.visionImg || !Array.isArray(data.visionImg) || data.visionImg.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-12">
        
        {/* LEFT SIDE: TEXT CONTENT */}
        <div className="flex-1 w-full space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary break-words">
            {data.vision}
          </h2>
          <div className="w-20 h-1.5 bg-primary rounded-full" />
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed break-words">
            {data.visionText}
          </p>
        </div>

        {/* RIGHT SIDE: AUTOMATIC CAROUSEL */}
        <div className="flex-1 w-full max-w-xl">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={() => plugin.current.stop()}
            onMouseLeave={() => plugin.current.play()}
          >
            <CarouselContent>
              {data.visionImg.map((url: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-none shadow-none bg-transparent">
                      {/* 2. Added 'relative' to CardContent - REQUIRED for 'fill' to work */}
                      <CardContent className="relative flex aspect-square items-center justify-center p-0 overflow-hidden rounded-3xl shadow-2xl bg-muted">
                        <Image
                          src={url}
                          alt={`Vision Slide ${index}`}
                          fill
                          priority={index === 0} 
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          // 3. Adjusted sizes for better performance
                          sizes="(max-width: 768px) 100vw, 500px"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}