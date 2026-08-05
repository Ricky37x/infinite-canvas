"use client";

import React, { useRef, useState, useMemo } from "react";
import Link from "next/link";
import type { TileContent } from "../v1/galleryData";

export interface PerspectiveGridProps {
  items: TileContent[];
  gridCols?: number;
}

export default function PerspectiveGrid({ items, gridCols = 4 }: PerspectiveGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rawX: 0, rawY: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = event;
    const rect = containerRef.current.getBoundingClientRect();

    const x = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (clientY - rect.top - rect.height / 2) / (rect.height / 2);

    setMousePos({ x, y, rawX: clientX, rawY: clientY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0, rawX: 0, rawY: 0 });
  };

  const transformStyle = useMemo(() => {
    const maxTilt = 12;
    const rotateY = mousePos.x * maxTilt;
    const rotateX = -mousePos.y * maxTilt;

    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    };
  }, [mousePos.x, mousePos.y]);

  // Distribute items across grid columns
  const columnsData = useMemo(() => {
    const cols: TileContent[][] = Array.from({ length: gridCols }, () => []);
    items.forEach((item, index) => {
      cols[index % gridCols].push(item);
    });
    return cols;
  }, [items, gridCols]);

  return (
    <main
      className="relative w-screen h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden flex items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Keyframe Animations for Infinite Moving Columns */}
      <style jsx global>{`
        @keyframes scrollUp {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
        .animate-scroll-up {
          animation: scrollUp 28s linear infinite;
        }
        .animate-scroll-down {
          animation: scrollDown 28s linear infinite;
        }
        .animate-scroll-up:hover,
        .animate-scroll-down:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Dynamic Cursor Spotlight Beam */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.rawX}px ${mousePos.rawY}px, rgba(255,255,255,0.03), transparent 80%)`,
        }}
      />

      {/* Header Bar */}
      <div className="fixed top-6 inset-x-6 z-50 flex items-center justify-between max-w-6xl mx-auto pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-4 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-all shadow-xl backdrop-blur-md"
        >
          <span>←</span>
          <span>Back</span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800/50 backdrop-blur-md">
          
        </span>
      </div>

      {/* 3D Transform Scene Container */}
      <div
        className="w-full max-w-6xl h-[85vh] overflow-hidden transition-transform duration-200 ease-out z-10"
        style={{
          ...transformStyle,
          transformStyle: "preserve-3d",
        }}
        ref={containerRef}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-full">
          {columnsData.map((colItems, colIdx) => {
            // Duplicate column array to make seamless loop
            const duplicatedItems = [...colItems, ...colItems, ...colItems];
            const isEven = colIdx % 2 === 0;

            return (
              <div key={colIdx} className="overflow-hidden h-full">
                <div
                  className={`flex flex-col gap-6 ${
                    isEven ? "animate-scroll-up" : "animate-scroll-down"
                  }`}
                >
                  {duplicatedItems.map((item, itemIdx) => (
                    <div
                      key={`${item.id}-${itemIdx}`}
                      className="group relative aspect-[3/4] w-full rounded-2xl bg-zinc-900/80 border border-zinc-800/80 transition-all duration-300 ease-out hover:border-zinc-500/80 cursor-pointer flex-shrink-0"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Glow Backdrop */}
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-zinc-500/20 to-zinc-200/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />

                      {/* Card Container with Z-Pop */}
                      <div className="relative w-full h-full rounded-2xl overflow-hidden transition-transform duration-500 ease-out group-hover:[transform:translateZ(40px)] shadow-2xl group-hover:shadow-black/90">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/80 via-transparent to-white/10 opacity-60 group-hover:opacity-20 transition-opacity pointer-events-none" />

                        <div className="absolute inset-x-3 bottom-3 p-3 bg-zinc-950/70 backdrop-blur-md border border-white/10 rounded-xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block mb-0.5">
                            {item.category || "Asset"}
                          </span>
                          <h3 className="text-xs font-medium text-zinc-100 truncate">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}