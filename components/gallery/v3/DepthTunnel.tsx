"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { TileContent } from "../v1/galleryData";

interface TunnelItem extends TileContent {
  virtualId: string;
  zPos: number;
  angle: number;
  radius: number;
  color: string;
}

const COLOR_PALETTES = [
  "#3b82f6", // Blue
  "#06b6d4", // Cyan
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#10b981", // Emerald
];

export default function DepthTunnel({ items }: { items: TileContent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction & Camera states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zOffset, setZOffset] = useState(0);
  const [tunnelRotation, setTunnelRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TileContent | null>(null);

  // Reactive Color Theme & Particles
  const [activeThemeColor, setActiveThemeColor] = useState<string>("#06b6d4");

  const particles = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 1600,
      z: -Math.random() * 4000,
      size: Math.random() * 2.5 + 1,
    }));
  }, []);

  // Motion Loop: Continuous forward speed & slow revolving rotation
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (!isPaused && !selectedItem) {
        setZOffset((prev) => prev + 2.2);
        setTunnelRotation((prev) => prev + 0.12);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, selectedItem]);

  // Wheel acceleration
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZOffset((prev) => prev + e.deltaY * 1.8);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePos({ x, y });
  };

  // Tunnel Geometry
  const totalRings = 10;
  const itemsPerRing = 8;
  const ringSpacing = 550; 
  const totalTunnelLength = totalRings * ringSpacing;
  const tunnelRadius = 720;

  const tunnelItems: TunnelItem[] = useMemo(() => {
    const result: TunnelItem[] = [];

    for (let ring = 0; ring < totalRings; ring++) {
      for (let i = 0; i < itemsPerRing; i++) {
        // Unique global index for each slot
        const slotIndex = ring * itemsPerRing + i;

        // Scrambles image selection so images don't line up vertically in columns
        const pseudoRandomIndex = (slotIndex * 7 + ring * 3) % items.length;
        const item = items[pseudoRandomIndex];

        const angle = (i / itemsPerRing) * Math.PI * 2;
        const color = COLOR_PALETTES[slotIndex % COLOR_PALETTES.length];

        result.push({
          ...item,
          virtualId: `ring-${ring}-slot-${i}-${item.id}-${slotIndex}`,
          zPos: -ring * ringSpacing,
          angle,
          radius: tunnelRadius,
          color,
        });
      }
    }
    return result;
  }, [items, totalRings, itemsPerRing, ringSpacing, tunnelRadius]);

  const wireframeRings = useMemo(() => {
    return Array.from({ length: totalRings }, (_, i) => -i * ringSpacing);
  }, [totalRings, ringSpacing]);

  return (
    <main
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden flex items-center justify-center select-none"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out z-0 opacity-20"
        style={{
          background: `radial-gradient(1000px circle at ${
            50 + mousePos.x * 25
          }% ${50 + mousePos.y * 25}%, ${activeThemeColor}, transparent 80%)`,
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

      {/* 3D Scene Viewport */}
      <div
        className="relative w-full h-full flex items-center justify-center z-10"
        style={{
          perspective: "900px",
          perspectiveOrigin: `${50 + mousePos.x * 15}% ${50 + mousePos.y * 15}%`,
        }}
      >
        <div
          className="relative w-0 h-0 transition-transform duration-100"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateZ(${tunnelRotation}deg)`,
          }}
        >
          {/* Deep Portal Core */}
          <div
            className="absolute -ml-32 -mt-32 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500"
            style={{
              transform: `translateZ(-4500px)`,
              backgroundColor: activeThemeColor,
              opacity: 0.25,
            }}
          />

          {/* Floating Particles */}
          {particles.map((p) => {
            let pZ = (p.z + zOffset) % 4000;
            if (pZ > 200) pZ -= 4000;
            return (
              <div
                key={p.id}
                className="absolute rounded-full bg-cyan-200/50 pointer-events-none"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  transform: `translate3d(${p.x + mousePos.x * 40}px, ${
                    p.y + mousePos.y * 40
                  }px, ${pZ}px)`,
                  opacity: Math.max(0, 1 - Math.abs(pZ) / 3500),
                }}
              />
            );
          })}

          {/* Wireframe Rings */}
          {wireframeRings.map((baseZ, idx) => {
            let calculatedZ = (baseZ + zOffset) % totalTunnelLength;
            if (calculatedZ > 300) calculatedZ -= totalTunnelLength;

            const distance = Math.abs(calculatedZ);
            const opacity = Math.max(0, 1 - distance / 3500) * 0.15;

            return (
              <div
                key={idx}
                className="absolute rounded-full border border-dashed pointer-events-none transition-colors duration-500"
                style={{
                  width: `${tunnelRadius * 2}px`,
                  height: `${tunnelRadius * 2}px`,
                  marginLeft: `-${tunnelRadius}px`,
                  marginTop: `-${tunnelRadius}px`,
                  transform: `translateZ(${calculatedZ}px)`,
                  borderColor: activeThemeColor,
                  opacity,
                }}
              />
            );
          })}

          {/* Tunnel Image Cards */}
          {tunnelItems.map((item) => {
            let calculatedZ = (item.zPos + zOffset) % totalTunnelLength;
            if (calculatedZ > 300) calculatedZ -= totalTunnelLength;

            const x = Math.cos(item.angle) * item.radius;
            const y = Math.sin(item.angle) * item.radius;

            const distance = Math.abs(calculatedZ);
            let opacity = 1;
            if (calculatedZ > 0) {
              opacity = Math.max(0, 1 - calculatedZ / 300);
            } else {
              opacity = Math.max(0, 1 - distance / (totalTunnelLength * 0.7));
            }

            const brightness = Math.min(1.2, Math.max(0.45, 1 - distance / 3000));

            return (
              <div
                key={item.virtualId}
                onMouseEnter={() => {
                  setIsPaused(true);
                  setActiveThemeColor(item.color);
                }}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => setSelectedItem(item)}
                className="group absolute w-72 h-88 -ml-36 -mt-44 rounded-2xl bg-zinc-900/90 border border-zinc-700/40 hover:border-cyan-400 transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl"
                style={{
                  transform: `translate3d(${x}px, ${y}px, ${calculatedZ}px) rotateZ(${
                    (item.angle * 180) / Math.PI
                  }deg) rotateY(90deg)`,
                  opacity,
                  filter: `blur(${Math.min(5, distance / 900)}px) brightness(${brightness})`,
                  pointerEvents:
                    calculatedZ > 100 || calculatedZ < -3000 ? "none" : "auto",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none group-hover:border-cyan-400/80 transition-colors" />

                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-70 group-hover:opacity-20 transition-opacity" />

                <div className="absolute inset-x-3 bottom-3 p-3 bg-zinc-950/85 backdrop-blur-md border border-white/10 rounded-xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span
                    className="text-[9px] font-mono uppercase tracking-widest block mb-0.5"
                    style={{ color: item.color }}
                  >
                    {item.category || "Tunnel Node"}
                  </span>
                  <h3 className="text-xs font-medium text-zinc-100 truncate">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[65vh] bg-zinc-950 flex items-center justify-center">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-5 bg-zinc-900 flex items-center justify-between border-t border-zinc-800/80">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  {selectedItem.category || "Gallery Asset"}
                </span>
                <h2 className="text-base font-medium text-zinc-100">
                  {selectedItem.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-mono transition"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}