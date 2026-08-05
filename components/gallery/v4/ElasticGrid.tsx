"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { TileContent } from "../v1/galleryData";

const PHYSICS = {
  stiffness: 0.08,
  dampening: 0.85,
  cursorRadius: 280,
  cursorPushStrength: 12,
};

const COLS = 5;

export default function ElasticGrid({ items }: { items: TileContent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rows = Math.ceil(items.length / COLS);

  const [gridItems, setGridItems] = useState(() =>
    items.map((item, idx) => ({
      ...item,
      col: idx % COLS,
      row: Math.floor(idx / COLS),
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    }))
  );

  const mousePos = useRef({ x: -1000, y: -1000 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Tighter padding lets the grid occupy more vertical space
  const paddingX = 24;
  const paddingY = 16;
  const gap = 16;

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const layout = useMemo(() => {
    if (!dimensions.width || !dimensions.height) {
      return { tileW: 0, tileH: 0 };
    }

    const availW = dimensions.width - paddingX * 2 - gap * (COLS - 1);
    const availH = dimensions.height - paddingY * 2 - gap * (rows - 1);

    return {
      tileW: availW / COLS,
      tileH: availH / rows,
    };
  }, [dimensions, rows]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePos.current = { x: -1000, y: -1000 };
  }, []);

  useEffect(() => {
    if (!layout.tileW || !layout.tileH) return;

    let animationFrameId: number;

    const simulatePhysics = () => {
      setGridItems((prevItems) =>
        prevItems.map((item) => {
          const screenBaseX = paddingX + item.col * (layout.tileW + gap) + layout.tileW / 2;
          const screenBaseY = paddingY + item.row * (layout.tileH + gap) + layout.tileH / 2;

          const distMouseX = mousePos.current.x - (screenBaseX + item.x);
          const distMouseY = mousePos.current.y - (screenBaseY + item.y);
          const mouseDist = Math.sqrt(distMouseX * distMouseX + distMouseY * distMouseY);

          let pushX = 0;
          let pushY = 0;

          if (mouseDist < PHYSICS.cursorRadius && mouseDist > 10) {
            const force = (PHYSICS.cursorRadius - mouseDist) / PHYSICS.cursorRadius;
            pushX = (distMouseX / mouseDist) * force * -PHYSICS.cursorPushStrength;
            pushY = (distMouseY / mouseDist) * force * -PHYSICS.cursorPushStrength;
          }

          const springX = item.x * PHYSICS.stiffness;
          const springY = item.y * PHYSICS.stiffness;

          const ax = pushX - springX;
          const ay = pushY - springY;

          const newVx = (item.vx + ax) * PHYSICS.dampening;
          const newVy = (item.vy + ay) * PHYSICS.dampening;

          return {
            ...item,
            vx: newVx,
            vy: newVy,
            x: item.x + newVx,
            y: item.y + newVy,
          };
        })
      );
      animationFrameId = requestAnimationFrame(simulatePhysics);
    };

    animationFrameId = requestAnimationFrame(simulatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [layout]);

  return (
    <main className="relative w-screen min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col items-center justify-between p-4 md:p-6 gap-3 select-none overflow-hidden">
      {/* Header Bar */}
      <div className="w-full max-w-[94vw] flex items-center justify-between z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-all shadow-xl backdrop-blur-md"
        >
          <span>←</span>
          <span>Back</span>
        </Link>
        <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800/80 backdrop-blur-md">
          
        </span>
      </div>

      {/* Grid Frame Container expanded to 90vh */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[94vw] h-[90vh] rounded-3xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden shadow-2xl backdrop-blur-sm"
      >
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300 opacity-20"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.current.x}px ${mousePos.current.y}px, rgba(16,185,129,0.15), transparent 80%)`,
          }}
        />

        {layout.tileW > 0 && (
          <div
            className="absolute inset-0 z-10"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            {gridItems.map((item, idx) => {
              const screenBaseX = paddingX + item.col * (layout.tileW + gap) + layout.tileW / 2;
              const screenBaseY = paddingY + item.row * (layout.tileH + gap) + layout.tileH / 2;

              const translateX = screenBaseX + item.x - layout.tileW / 2;
              const translateY = screenBaseY + item.y - layout.tileH / 2;

              const rotateY = item.vx * -0.5;
              const rotateX = item.vy * 0.5;
              const translateZ = (Math.abs(item.vx) + Math.abs(item.vy)) * 0.8;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="group absolute rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-emerald-500/80 cursor-pointer overflow-hidden shadow-lg transition-colors duration-300"
                  style={{
                    width: `${layout.tileW}px`,
                    height: `${layout.tileH}px`,
                    transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
                    zIndex: Math.floor(Math.abs(item.x) + Math.abs(item.y)) + 1,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent opacity-80 group-hover:opacity-30 transition-opacity" />

                  <div className="absolute inset-x-3 bottom-3 p-2.5 bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block mb-0.5">
                      {item.category || "Interactive Node"}
                    </span>
                    <h3 className="text-xs font-medium text-zinc-100 truncate">
                      {item.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}