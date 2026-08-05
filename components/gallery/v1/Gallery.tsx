"use client";

import React, { useState, useCallback } from "react";
import InfiniteCanvas from "./InfiniteCanvas";
import GalleryOverlay, { type SelectedTile } from "./GalleryOverlay";
import type { TileContent } from "./galleryData";

interface GalleryProps {
  items: string[];
  cardWidth: number;
  cardHeight: number;
  gap: number;
}

export default function Gallery({ items, cardWidth, cardHeight, gap }: GalleryProps) {
  const [selected, setSelected] = useState<SelectedTile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const handleOpenTile = useCallback((x: number, y: number, content: TileContent) => {
    setSelected({ ...content, x, y });
    setIsOpen(true);
    setShowHint(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="gallery-root w-full h-full relative overflow-hidden bg-transparent">
      <style jsx global>{`
        /* Replace your global style block inside Gallery.tsx with this premium panoramic configuration: */

/* Update your CSS variables inside Gallery.tsx to style this premium infinite grid layout */

.gallery-loop-grid-tile {
  --mouse-x: 50%;
  --mouse-y: 50%;
  border-radius: 20px;
  background-color: #12151e;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.03);
  cursor: grab;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
}

.gallery-loop-grid-tile:active {
  cursor: grabbing;
}

.gallery-canvas-stage:not(.dragging) .gallery-loop-grid-tile:hover {
  z-index: 99999 !important;
  transform: scale(1.05) translateZ(0) !important;
  border-color: rgba(96, 165, 254, 0.5);
  box-shadow: 0 35px 70px rgba(0, 0, 0, 0.85), 0 0 30px rgba(96, 165, 254, 0.15);
}

.gallery-tile-shine {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.07), transparent 80%);
}

.gallery-tile-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  background-size: cover;
  mix-blend-mode: overlay;
}
        }
      `}</style>

      <InfiniteCanvas
        items={items}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        gap={gap}
        onOpenTile={handleOpenTile}
        showHint={showHint}
        setShowHint={setShowHint}
      />

      <GalleryOverlay open={isOpen} content={selected} onClose={handleClose} />
    </div>
  );
}