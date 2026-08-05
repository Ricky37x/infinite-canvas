"use client";

import React from "react";
import PerspectiveGrid from "@/components/gallery/v2/PerspectiveGrid";
import type { TileContent } from "@/components/gallery/v1/galleryData"; // Assuming this type is available

// Replace with actual image URLs.
const MY_PORTFOLIO: TileContent[] = [
  { id: "1", title: "Branding Case Study", category: "BRANDING", image: "https://picsum.photos/id/10/400/500" },
  { id: "2", title: "Next.js Dashboard", category: "UI/UX DESIGN", image: "https://picsum.photos/id/22/400/500" },
  { id: "3", title: "Creative Poster Design", category: "GRAPHIC DESIGN", image: "https://picsum.photos/id/32/400/500" },
  { id: "4", title: "Mobile App Concept", category: "APP DEVELOPMENT", image: "https://picsum.photos/id/42/400/500" },
  { id: "5", title: "Digital Illustration", category: "ART DIRECTION", image: "https://picsum.photos/id/52/400/500" },
  { id: "6", title: "Social Media Campaign", category: "MARKETING", image: "https://picsum.photos/id/62/400/500" },
  { id: "7", title: "E-Commerce Frontend", category: "WEB DEV", image: "https://picsum.photos/id/72/400/500" },
  { id: "8", title: "Architectural Rendering", category: "3D MODELING", image: "https://picsum.photos/id/82/400/500" },
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