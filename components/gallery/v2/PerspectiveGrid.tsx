"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import type { TileContent } from "../v1/galleryData"; // Assuming you reuse v1's data structure

interface PerspectiveGridProps {
  items: TileContent[];
  gridCols?: number; // Number of columns in the grid
}

export default function PerspectiveGrid({ items, gridCols = 4 }: PerspectiveGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse state: track X and Y position, relative to the center of the container
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Track Hover State (could add depth effect here)
  const [hoveredTileId, setHoveredTileId] = useState<string | null>(null);

  // Mouse Move Handler: Updates mouse position relative to the container center
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = event;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    
    setMousePos({ x, y });
  };
  
  // Reset mouse position
  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Memoize the final transform string based on mouse position
  // The perspective() value defines how "strong" the 3D effect is.
  const perspectiveTransform = useMemo(() => {
    const tiltAmount = 15; // Max tilt angle in degrees
    const { x, y } = mousePos;
    
    if (!containerRef.current) return "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Normalize values between -1 and 1
    const rotateY = (x / width) * tiltAmount;
    const rotateX = -(y / height) * tiltAmount;
    
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, [mousePos]);

  return (
    <main
      className="relative w-screen h-screen bg-slate-950 text-white font-sans overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Container: This is the div that actually gets tilted */}
      <div
        ref={containerRef}
        className="w-[90vw] h-[80vh] grid gap-6 p-10 bg-slate-900 border border-slate-800 rounded-3xl transition-transform duration-100 ease-linear shadow-xl shadow-black/30"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          transform: perspectiveTransform,
          willChange: "transform",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-[4/5] bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg shadow-black/20 hover:border-blue-500 transition-all duration-300"
            onMouseEnter={() => setHoveredTileId(item.id)}
            onMouseLeave={() => setHoveredTileId(null)}
          >
            {/* Tile Image */}
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Hover Glare Overlay (simple gradient) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Title & Category (Optional) */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">{item.category}</p>
              <h3 className="text-sm font-semibold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Debug Info (Optional) */}
      <div className="absolute bottom-4 left-4 text-xs font-mono text-slate-600">
        Mouse Relative: {Math.round(mousePos.x)}, {Math.round(mousePos.y)}
      </div>
    </main>
  );
}