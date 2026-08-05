"use client";

// GalleryOverlay.tsx
// One job: the fullscreen image breakout for a clicked tile. Purely
// presentational — Gallery.tsx owns open/closed state and which tile it is.

import React, { useEffect } from "react";
import type { TileContent } from "./galleryData";

export type SelectedTile = TileContent & { x: number; y: number };

type Props = {
  open: boolean;
  content: SelectedTile | null;
  onClose: () => void;
};

export default function GalleryOverlay({ open, content, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`gallery-overlay${open ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {content && (
        <div className="gallery-detail">
          <div
            className="gallery-detail-panel"
            style={{
              backgroundImage: `url(${content.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      )}
    </div>
  );
}