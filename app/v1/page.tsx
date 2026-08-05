"use client";

import React from "react";
import Link from "next/link";
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
    <main className="relative w-screen h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Single Back Button */}
      <Link 
        href="/"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 rounded-full text-xs font-mono text-zinc-300 hover:text-white transition-all shadow-lg backdrop-blur-sm"
      >
        <span>←</span>
        <span>Back</span>
      </Link>

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