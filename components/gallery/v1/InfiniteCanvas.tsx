"use client";

import React, { useEffect, useRef } from "react";
import { getTileContent, type TileContent } from "./galleryData";

interface InfiniteCanvasProps {
  items: string[];
  cardWidth: number;
  cardHeight: number;
  gap: number;
  onOpenTile: (x: number, y: number, content: TileContent) => void;
  showHint: boolean;
  setShowHint: (show: boolean) => void;
}

export default function InfiniteCanvas({
  items,
  cardWidth,
  cardHeight,
  gap,
  onOpenTile,
  showHint,
  setShowHint,
}: InfiniteCanvasProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tileContainerRef = useRef<HTMLDivElement>(null);

  // AUTOMATION SPEED CONTROLLER
  const AUTO_ORBIT_SPEED = 0.0012; 

  const stateRef = useRef({
    globalAngle: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    dragDistance: 0,
    vAngle: 0, // Inertial speed tracking
    lastMoveT: 0,
    loopFrame: null as number | null,
  });

  const applyPositions = () => {
  if (!stageRef.current || !tileContainerRef.current || !items.length) return;

  const { globalAngle } = stateRef.current;
  const tiles = tileContainerRef.current.children;

  for (let i = 0; i < tiles.length; i++) {
    const tileEl = tiles[i] as HTMLDivElement;

    const baseAngle = parseFloat(tileEl.dataset.baseAngle || "0");
    const radius = parseFloat(tileEl.dataset.radius || "300");
    const ringIndex = parseInt(tileEl.dataset.ring || "0", 10);

    const directionMultiplier = ringIndex % 2 === 0 ? 1 : -1;
    const currentAngle = baseAngle + (globalAngle * directionMultiplier);

    const posX = Math.cos(currentAngle) * radius;
    const posY = Math.sin(currentAngle) * radius;

    const depthFactor = (Math.sin(currentAngle) + 1) / 2;
    const scale = 0.75 + depthFactor * 0.25; 
    const opacity = 0.3 + depthFactor * 0.7;
    const zIndex = Math.floor(depthFactor * 100);

    // --- APPLY THIS CHANGE ---
    // We combine the radial position with the centering offset (-50% of the element's own size)
    tileEl.style.transform = `translate3d(calc(-50% + ${posX}px), calc(-50% + ${posY}px), 0) scale(${scale})`;
    // -------------------------

    tileEl.style.opacity = opacity.toString();
    tileEl.style.zIndex = zIndex.toString();
    tileEl.style.pointerEvents = depthFactor > 0.35 ? "auto" : "none";
  }
};

  // PERSISTENT TICK SYSTEM ENGINE
  useEffect(() => {
    const tick = () => {
      if (!stateRef.current.dragging) {
        // Slow down user flick velocity smoothly down to base cruise values
        if (Math.abs(stateRef.current.vAngle) > 0.0001) {
          stateRef.current.vAngle *= 0.95;
          stateRef.current.globalAngle += stateRef.current.vAngle;

          if (Math.abs(stateRef.current.vAngle) < AUTO_ORBIT_SPEED) {
            stateRef.current.vAngle = 0;
          }
        } else {
          stateRef.current.globalAngle += AUTO_ORBIT_SPEED;
        }
        applyPositions();
      }
      stateRef.current.loopFrame = requestAnimationFrame(tick);
    };

    stateRef.current.loopFrame = requestAnimationFrame(tick);
    return () => {
      if (stateRef.current.loopFrame) cancelAnimationFrame(stateRef.current.loopFrame);
    };
  }, [items]);

  // MOUNT INITIALIZATION COMPILER: Assigns coordinates cleanly
  useEffect(() => {
    if (!stageRef.current || !tileContainerRef.current || !items.length) return;

    tileContainerRef.current.innerHTML = "";

    const totalRings = 3;
    const itemsPerRing = Math.max(6, items.length);

    for (let ring = 0; ring < totalRings; ring++) {
      // Step radius settings cleanly outward per ring iteration
      const radius = 260 + ring * (cardHeight * 0.55 + gap);

      for (let i = 0; i < itemsPerRing; i++) {
        const dataIndex = (i + ring * 2) % items.length;
        const content = getTileContent(dataIndex, 0, items);

        const el = document.createElement("div");
        // FIX: Rebuilt class list establishes safe absolute center points inside the layout tree
        el.className = "gallery-loop-grid-tile cursor-grab active:cursor-grabbing rounded-xl overflow-hidden shadow-2xl absolute left-1/2 top-1/2 will-change-transform";
        el.style.width = `${cardWidth}px`;
        el.style.height = `${cardHeight}px`;

        // Distribute element angles evenly around the ring circumference
        const baseAngle = (i * (Math.PI * 2)) / itemsPerRing;

        el.dataset.baseAngle = baseAngle.toString();
        el.dataset.radius = radius.toString();
        el.dataset.ring = ring.toString();
        
        el.style.backgroundImage = `url(${content.image})`;

        const shine = document.createElement("div");
        shine.className = "gallery-tile-shine";
        el.appendChild(shine);

        el.addEventListener("click", () => {
          if (stateRef.current.dragDistance > 6) return;
          onOpenTile(dataIndex, 0, content);
        });

        tileContainerRef.current.appendChild(el);
      }
    }

    applyPositions();
  }, [items, cardWidth, cardHeight, gap]);

  // UNIFIED USER GESTURE LISTENERS
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handlePointerDown = (e: PointerEvent) => {
      stateRef.current.dragging = true;
      stateRef.current.dragDistance = 0;
      stage.classList.add("dragging");
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;
      stateRef.current.lastMoveT = performance.now();
      stateRef.current.vAngle = 0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!stateRef.current.dragging) return;

      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Extract rotation direction angles relative to stage center points
      const angleNow = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const angleLast = Math.atan2(stateRef.current.lastY - centerY, stateRef.current.lastX - centerX);
      
      let deltaAngle = angleNow - angleLast;

      // Check boundary crossings to keep angle tracking perfectly sequential
      if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
      if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

      const now = performance.now();
      const dt = Math.max(now - stateRef.current.lastMoveT, 1);

      // Scale speed inputs straight into rotation acceleration variables
      stateRef.current.vAngle = (deltaAngle / dt) * 16;
      stateRef.current.lastMoveT = now;

      stateRef.current.globalAngle += deltaAngle;
      stateRef.current.dragDistance += Math.hypot(e.clientX - stateRef.current.lastX, e.clientY - stateRef.current.lastY);

      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;

      applyPositions();
      if (stateRef.current.dragDistance > 6 && showHint) setShowHint(false);
    };

    const handlePointerUp = () => {
      stateRef.current.dragging = false;
      stage.classList.remove("dragging");
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Pipe mouse scroll track distances straight into spin momentum variables
      stateRef.current.vAngle += (e.deltaY || e.deltaX) * 0.00006;
    };

    stage.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    stage.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      stage.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      stage.removeEventListener("wheel", handleWheel);
    };
  }, [showHint, setShowHint]);

  return (
    // FIX: Using full h-screen with absolute bounds isolates the center axis perfectly below your navbar
    <div ref={stageRef} className="gallery-canvas-stage w-full h-screen absolute inset-0 block overflow-hidden select-none bg-transparent">
      <div ref={tileContainerRef} className="w-full h-full absolute inset-0 left-0 top-0" />
    </div>
  );
}