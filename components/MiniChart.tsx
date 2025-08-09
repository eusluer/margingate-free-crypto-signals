"use client";
import React, { useEffect, useRef } from "react";

interface MiniChartProps {
  data: Array<{ close: number; time: number }>;
  color: string;
  positive?: boolean;
}

export default function MiniChart({ data, color, positive = true }: MiniChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const prices = data.map(d => d.close);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - ((d.close - minPrice) / priceRange) * height
    }));

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (positive) {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, color + "40");
      gradient.addColorStop(1, color + "00");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, height);
      points.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.lineTo(points[points.length - 1].x, height);
      ctx.closePath();
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.stroke();

    points.forEach((point, i) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      
      if (i === points.length - 1) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.strokeStyle = color + "60";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

  }, [data, color, positive]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={60}
      className="w-full h-full"
      style={{ maxWidth: "120px", maxHeight: "60px" }}
    />
  );
}