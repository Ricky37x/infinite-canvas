"use client";

import React from "react";
import DepthTunnel from "@/components/gallery/v3/DepthTunnel";
import type { TileContent } from "@/components/gallery/v1/galleryData";

const SAMPLE_ITEMS: TileContent[] = [
  { id: "1", title: "Architectural Lines", category: "Architecture", image: "https://picsum.photos/id/10/800/1000" },
  { id: "2", title: "Coastal Drift", category: "Nature", image: "https://picsum.photos/id/12/1000/600" },
  { id: "3", title: "Urban Monolith", category: "Architecture", image: "https://picsum.photos/id/15/800/800" },
  { id: "4", title: "Forest Canopy", category: "Nature", image: "https://picsum.photos/id/28/800/1100" },
  { id: "5", title: "Minimal Geometry", category: "Abstract", image: "https://picsum.photos/id/36/800/1000" },
  { id: "6", title: "Mountain Horizon", category: "Nature", image: "https://picsum.photos/id/42/1200/700" },
  { id: "7", title: "Monochrome Texture", category: "Abstract", image: "https://picsum.photos/id/48/800/800" },
  { id: "8", title: "Valley Fog", category: "Nature", image: "https://picsum.photos/id/54/800/1100" },
];

export default function V3Page() {
  return <DepthTunnel items={SAMPLE_ITEMS} />;
}