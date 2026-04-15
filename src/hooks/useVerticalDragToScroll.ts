import React, { useRef } from "react";

export function useVerticalDragToScroll() {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const startDragging = (pageY: number, currentTarget: HTMLElement) => {
    isDragging.current = true;
    startY.current = pageY - currentTarget.offsetTop;
    scrollTop.current = currentTarget.scrollTop;
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  const moveDragging = (pageY: number, currentTarget: HTMLElement, e: any) => {
    if (!isDragging.current) return;
    if (e.cancelable) e.preventDefault();
    const y = pageY - currentTarget.offsetTop;
    const walk = (y - startY.current) * 1.5;
    currentTarget.scrollTop = scrollTop.current - walk;
  };

  return {
    onMouseDown: (e: React.MouseEvent) =>
      startDragging(e.pageY, e.currentTarget as HTMLElement),
    onMouseLeave: stopDragging,
    onMouseUp: stopDragging,
    onMouseMove: (e: React.MouseEvent) =>
      moveDragging(e.pageY, e.currentTarget as HTMLElement, e),
    onTouchStart: (e: React.TouchEvent) =>
      startDragging(e.touches[0].pageY, e.currentTarget as HTMLElement),
    onTouchEnd: stopDragging,
    onTouchMove: (e: React.TouchEvent) =>
      moveDragging(e.touches[0].pageY, e.currentTarget as HTMLElement, e),
  };
}
