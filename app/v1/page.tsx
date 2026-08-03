"use client";

import React from "react";
import Gallery from "@/components/gallery/v1/Gallery";

const MY_PORTFOLIO = [
  "https://picsum.photos/id/10/400/500",
  "https://picsum.photos/id/22/400/500",
  "https://picsum.photos/id/32/400/500",
  "https://picsum.photos/id/42/400/500",
  "https://picsum.photos/id/52/400/500",
  "https://picsum.photos/id/62/400/500",
  "https://picsum.photos/id/72/400/500",
  "https://picsum.photos/id/82/400/500",
  "https://picsum.photos/id/92/400/500",
];

export default function V1Page() {
  return (
    <main className="relative w-screen h-screen font-sans overflow-hidden bg-slate-950">
      <div className="absolute inset-0 w-full h-full">
        <Gallery
          items={MY_PORTFOLIO}
          cardWidth={280}
          cardHeight={350}
          gap={20}
        />
      </div>
    </main>
  );
}