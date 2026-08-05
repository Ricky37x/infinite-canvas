"use client";

import React from "react";
import ElasticGrid from "@/components/gallery/v4/ElasticGrid";
import type { TileContent } from "@/components/gallery/v1/galleryData";

const SAMPLE_ITEMS: TileContent[] = [
  { id: "e1", title: "Parametric Distortion", category: "Interactive", image: "https://picsum.photos/id/20/1200/900" },
  { id: "e2", title: "Physics Interaction", category: "Physics", image: "https://picsum.photos/id/22/1000/700" },
  { id: "e3", title: "Subtle Elasticity", category: "Physics", image: "https://picsum.photos/id/24/1000/1000" },
  { id: "e4", title: "Radial Waveform", category: "Interactive", image: "https://picsum.photos/id/26/800/1100" },
  { id: "e5", title: "Continuous Flow", category: "Interactive", image: "https://picsum.photos/id/30/1200/900" },
  { id: "e6", title: "Organic Recoil", category: "Physics", image: "https://picsum.photos/id/32/1000/700" },
  { id: "e7", title: "Reactive Mesh", category: "Interactive", image: "https://picsum.photos/id/34/1000/1000" },
  { id: "e8", title: "Surface Tension", category: "Physics", image: "https://picsum.photos/id/36/800/1100" },
  { id: "e9", title: "Recursive Nodes", category: "Physics", image: "https://picsum.photos/id/38/1200/900" },
  { id: "e10", title: "Dampening Response", category: "Interactive", image: "https://picsum.photos/id/40/1000/700" },
  { id: "e11", title: "Elastic Recoil v2", category: "Interactive", image: "https://picsum.photos/id/42/1000/1000" },
  { id: "e12", title: "Wave Ripple 04", category: "Physics", image: "https://picsum.photos/id/44/800/1100" },
  { id: "e13", title: "Magnetic Distortion", category: "Interactive", image: "https://picsum.photos/id/46/1200/900" },
  { id: "e14", title: "Parametric Grid Structure", category: "Interactive", image: "https://picsum.photos/id/48/1000/700" },
  { id: "e15", title: "Recoil Dynamics", category: "Physics", image: "https://picsum.photos/id/50/1000/1000" },
  { id: "e16", title: "Kinetic Geometry", category: "Physics", image: "https://picsum.photos/id/52/800/1100" },
  { id: "e17", title: "Elastic Interface Design", category: "Interactive", image: "https://picsum.photos/id/54/1200/900" },
  { id: "e18", title: "Force-Reactive Tiles", category: "Physics", image: "https://picsum.photos/id/56/1000/700" },
  { id: "e19", title: "Subtle Distortion Loop", category: "Physics", image: "https://picsum.photos/id/58/1000/1000" },
  { id: "e20", title: "Physical Micro-Interactions", category: "Interactive", image: "https://picsum.photos/id/60/800/1100" },
];

export default function V4Page() {
  return <ElasticGrid items={SAMPLE_ITEMS} />;
}