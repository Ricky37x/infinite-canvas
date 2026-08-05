"use client";

import React from "react";
import PerspectiveGrid from "@/components/gallery/v2/PerspectiveGrid";
import type { TileContent } from "@/components/gallery/v1/galleryData"; // Assuming this type is available

// Replace with actual image URLs.
const MY_PORTFOLIO: TileContent[] = [
  { id: "1", title: "Bra", category: "", image: "https://picsum.photos/id/10/400/500" },
  { id: "2", title: "d", category: "", image: "https://picsum.photos/id/22/400/500" },
  { id: "3", title: "gn", category: "", image: "https://picsum.photos/id/32/400/500" },
  { id: "4", title: "", category: "", image: "https://picsum.photos/id/42/400/500" },
  { id: "5", title: "", category: "", image: "https://picsum.photos/id/52/400/500" },
  { id: "6", title: "", category: "", image: "https://picsum.photos/id/62/400/500" },
  { id: "7", title: "", category: "", image: "https://picsum.photos/id/72/400/500" },
  { id: "8", title: "", category: "", image: "https://picsum.photos/id/82/400/500" },
];

export default function V2Page() {
  return (
    <main className="w-screen h-screen bg-slate-950">
      <PerspectiveGrid 
        items={MY_PORTFOLIO} 
        gridCols={4} // Default is 4 columns
      />
    </main>
  );
}