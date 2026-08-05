"use client";

import React, { useState, useEffect, useRef } from "react";

const COLS = 6;
const ROWS = 5;
const TOTAL_CELLS = COLS * ROWS;
const TILE_WIDTH = 220;
const TILE_HEIGHT = 160;
const GAP_X = 32;
const GAP_Y = 32;

interface TileData {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface GridCell extends TileData {
  slotId: number;
  instanceId: string;
}

const SAMPLE_ASSETS: TileData[] = [
  { id: "1", title: "Cyberpunk Vehicle", category: "3D MODEL", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
  { id: "2", title: "Toy Character", category: "SKETCH", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80" },
  { id: "3", title: "Isometric Tower", category: "BLENDER", image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80" },
  { id: "4", title: "Neon Energy Orb", category: "VFX", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80" },
  { id: "5", title: "Dark Avatars", category: "CHARACTERS", image: "https://images.unsplash.com/photo-1614036417651-efe5912149d8?auto=format&fit=crop&w=600&q=80" },
  { id: "6", title: "Low Poly World", category: "GAME DEV", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80" },
  { id: "7", title: "Low Poly Llama", category: "3D ASSET", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80" },
  { id: "8", title: "White House", category: "ARCHITECTURE", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" },
  { id: "9", title: "Hot Air Balloons", category: "CONCEPT", image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=600&q=80" },
  { id: "10", title: "3D Cat Head", category: "SCULPT", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80" },
  { id: "11", title: "Stylized Penguin", category: "3D MODEL", image: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=600&q=80" },
  { id: "12", title: "Cybernetic Mask", category: "SHADERS", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80" },
  { id: "13", title: "Pixel Paw", category: "PIXEL ART", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80" },
  { id: "14", title: "Silhouette Dog", category: "VECTOR", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80" },
];

export default function MatrixSwapGrid() {
  const [gridData, setGridData] = useState<GridCell[]>(() =>
    Array.from({ length: TOTAL_CELLS }, (_, i) => {
      const asset = SAMPLE_ASSETS[i % SAMPLE_ASSETS.length];
      return {
        slotId: i,
        ...asset,
        instanceId: `${asset.id}-${i}-${Date.now()}`,
      };
    })
  );

  const [selectedItem, setSelectedItem] = useState<GridCell | null>(null);

  // Motion physics using continuous ref smoothing (lerp)
  const targetPanX = useRef(0);
  const targetPanY = useRef(0);
  const currentPanX = useRef(0);
  const currentPanY = useRef(0);

  const velocityX = useRef(0);
  const velocityY = useRef(0);

  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const gridWidth = COLS * (TILE_WIDTH + GAP_X);
  const gridHeight = ROWS * (TILE_HEIGHT + GAP_Y);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Smooth Lerp Animation Loop to eliminate micro-stutters
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      if (!isDragging.current) {
        targetPanX.current += 0.5 + velocityX.current;
        targetPanY.current -= 0.7 + velocityY.current;

        velocityX.current *= 0.94;
        velocityY.current *= 0.94;
      }

      // Linear Interpolation (Lerp) for butter-smooth movement
      currentPanX.current += (targetPanX.current - currentPanX.current) * 0.12;
      currentPanY.current += (targetPanY.current - currentPanY.current) * 0.12;

      if (gridContainerRef.current) {
        const modX = ((currentPanX.current % gridWidth) + gridWidth) % gridWidth;
        const modY = ((currentPanY.current % gridHeight) + gridHeight) % gridHeight;

        const vx = velocityX.current;
        const vy = velocityY.current;

        // Controlled "Collar Pull" Fabric Stretch
        const speed = Math.hypot(vx, vy);
        const stretch = isDragging.current ? Math.min(1.12, 1 + speed * 0.008) : 1;
        const rotX = Math.min(15, Math.max(-15, -vy * 0.4));
        const rotY = Math.min(15, Math.max(-15, vx * 0.4));
        const skewX = Math.min(10, Math.max(-10, vx * 0.2));

        gridContainerRef.current.style.transform = `
          translate3d(${modX - gridWidth}px, ${modY - gridHeight}px, 0)
          perspective(1000px)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
          skewX(${skewX}deg)
          scale(${stretch})
        `;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [gridWidth, gridHeight]);

  // Handle Mouse Wheel smoothly
  const handleWheel = (e: React.WheelEvent) => {
    velocityX.current += e.deltaX * 0.03;
    velocityY.current += e.deltaY * 0.03;
  };

  // Subtle Content Swaps
  useEffect(() => {
    const interval = setInterval(() => {
      setGridData((prevGrid) => {
        const targetSlot = Math.floor(Math.random() * TOTAL_CELLS);
        const newAsset = SAMPLE_ASSETS[Math.floor(Math.random() * SAMPLE_ASSETS.length)];

        const newGrid = [...prevGrid];
        newGrid[targetSlot] = {
          ...newAsset,
          slotId: targetSlot,
          instanceId: `${newAsset.id}-${Date.now()}`,
        };

        return newGrid;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    velocityX.current = 0;
    velocityY.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    targetPanX.current += dx;
    targetPanY.current += dy;

    velocityX.current = dx;
    velocityY.current = dy;

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const offsets = [-1, 0, 1];

  return (
    <main
      className="relative w-screen h-screen bg-black text-white font-sans overflow-hidden select-none cursor-grab active:cursor-grabbing flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Infinite Canvas Layer */}
      <div
        ref={gridContainerRef}
        className="absolute pointer-events-none will-change-transform"
        style={{
          width: `${gridWidth}px`,
          height: `${gridHeight}px`,
        }}
      >
        {offsets.map((ox) =>
          offsets.map((oy) => (
            <div
              key={`${ox}-${oy}`}
              className="absolute top-0 left-0"
              style={{
                transform: `translate3d(${ox * gridWidth}px, ${oy * gridHeight}px, 0)`,
                width: `${gridWidth}px`,
                height: `${gridHeight}px`,
              }}
            >
              {gridData.map((item) => {
                const col = item.slotId % COLS;
                const row = Math.floor(item.slotId / COLS);
                const posX = col * (TILE_WIDTH + GAP_X);
                const posY = row * (TILE_HEIGHT + GAP_Y);

                return (
                  <div
                    key={`${item.slotId}-${ox}-${oy}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                    className="group absolute rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-emerald-400 transition-colors duration-200 pointer-events-auto cursor-pointer shadow-2xl"
                    style={{
                      width: `${TILE_WIDTH}px`,
                      height: `${TILE_HEIGHT}px`,
                      transform: `translate3d(${posX}px, ${posY}px, 0)`,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl cursor-default"
          >
            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className="w-full h-[75vh] object-contain bg-black"
            />
            <div className="p-4 bg-zinc-950 flex justify-between items-center border-t border-zinc-800">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                {selectedItem.title}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 bg-zinc-800 text-xs font-mono rounded hover:bg-zinc-700"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}