"use client";

// GalleryTile.tsx
// One job: render a single image card at a given pixel position and size.
// It doesn't read config itself — InfiniteCanvas already resolved the
// pixel geometry, so this stays a dumb, easily-memoized leaf component.

import React from "react";
import type { TileContent } from "./v1/galleryData";

type Props = {
  xPx: number;
  yPx: number;
  width: number;
  height: number;
  content: TileContent;
  onOpen: (content: TileContent) => void;
};

function GalleryTile({ xPx, yPx, width, height, content, onOpen }: Props) {
  return (
    <div
      className="gallery-tile"
      style={{
        width,
        height,
        transform: `translate(${xPx}px, ${yPx}px)`,
        backgroundImage: `url(${content.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => onOpen(content)}
    >
      <div className="gallery-tile-grain" />
    </div>
  );
}

export default React.memo(GalleryTile);