import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface WaveCanvasProps {
  className?: string;
}

/**
 * WaveCanvas component
 * 
 * Adapted from the provided raw JS snippet.
 * Changes made for React integration:
 * 1. Encapsulated logic inside useEffect to prevent global scope pollution.
 * 2. Used useRef for DOM access instead of document.getElementById.
 * 3. Added proper cleanup to remove event listeners and cancel animation frames.
 * 4. Added explicit types for clarity where possible (keeping @ts-ignore for the complex prototype patching from original snippet).
 */
export const WaveCanvas: React.FC<WaveCanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Original Logic Start (Scoped) ---

    // Configuration
    const E = {
      debug: true,
      friction: 0.5,
      trails: 20, // Reduced slightly for performance
      size: 50,
      dampening: 0.025,
      tension: 0.98,
    };

    let f: any;
    const pos: { x: number; y: number } = { x: 0, y: 0 };
    let lines: any[] = [];
    let animationFrameId: number;
    let running = true;

    // Oscillator
    // @ts-ignore
    function n(e) {
        // @ts-ignore
      this.init(e || {});
    }
    n.prototype = {
        // @ts-ignore
      init: function (e) {
        this.phase = e.phase || 0;
        this.offset = e.offset || 0;
        this.frequency = e.frequency || 0.001;
        this.amplitude = e.amplitude || 1;
      },
      update: function () {
        this.phase += this.frequency;
        return this.offset + Math.sin(this.phase) * this.amplitude;
      },
    };

    // Node
    function Node() {
        // @ts-ignore
      this.x = 0;
      // @ts-ignore
      this.y = 0;
      // @ts-ignore
      this.vy = 0;
      // @ts-ignore
      this.vx = 0;
    }

    // Line
    // @ts-ignore
    function Line(e) {
        // @ts-ignore
      this.init(e || {});
    }
    Line.prototype = {
        // @ts-ignore
      init: function (e) {
        this.spring = e.spring + 0.1 * Math.random() - 0.05;
        this.friction = E.friction + 0.01 * Math.random() - 0.005;
        this.nodes = [];
        for (let n = 0; n < E.size; n++) {
          const t = new (Node as any)();
          t.x = pos.x;
          t.y = pos.y;
          this.nodes.push(t);
        }
      },
      update: function () {
        let e = this.spring;
        let t = this.nodes[0];
        
        t.vx += (pos.x - t.x) * e;
        t.vy += (pos.y - t.y) * e;

        for (let i = 0, a = this.nodes.length; i < a; i++) {
          t = this.nodes[i];
          if (i > 0) {
            const n = this.nodes[i - 1];
            t.vx += (n.x - t.x) * e;
            t.vy += (n.y - t.y) * e;
            t.vx += n.vx * E.dampening;
            t.vy += n.vy * E.dampening;
          }
          t.vx *= this.friction;
          t.vy *= this.friction;
          t.x += t.vx;
          t.y += t.vy;
          e *= E.tension;
        }
      },
      draw: function () {
        let e, t;
        let n = this.nodes[0].x;
        let i = this.nodes[0].y;
        
        // @ts-ignore
        ctx.beginPath();
        // @ts-ignore
        ctx.moveTo(n, i);
        
        let a;
        for (a = 1; a < this.nodes.length - 2; a++) {
          e = this.nodes[a];
          t = this.nodes[a + 1];
          n = 0.5 * (e.x + t.x);
          i = 0.5 * (e.y + t.y);
          // @ts-ignore
          ctx.quadraticCurveTo(e.x, e.y, n, i);
        }
        e = this.nodes[a];
        t = this.nodes[a + 1];
        // @ts-ignore
        ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
        // @ts-ignore
        ctx.stroke();
        // @ts-ignore
        ctx.closePath();
      },
    };

    function onMousemove(e: MouseEvent | TouchEvent) {
      function o() {
        lines = [];
        for (let i = 0; i < E.trails; i++) {
          lines.push(new (Line as any)({ spring: 0.45 + (i / E.trails) * 0.025 }));
        }
      }
      
      if ('touches' in e) {
          pos.x = e.touches[0].pageX;
          pos.y = e.touches[0].pageY;
      } else {
        // Adjust for canvas position relative to viewport if needed, 
        // but the original script assumes full screen absolute mostly.
        // Using clientX/Y is safer for fixed backgrounds
        pos.x = (e as MouseEvent).clientX;
        pos.y = (e as MouseEvent).clientY;
      }
      
      // Re-initialize lines on movement (gives the "respawn" effect) or just update pos?
      // The original script calls o() inside mousemove, which resets the lines. 
      // This creates that "following trail" effect that catches up.
      if (lines.length === 0) {
           o(); 
      }
    }

    function render() {
      if (!running || !ctx || !canvas) return;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      
      if (f) {
        ctx.strokeStyle = "hsla(" + Math.round(f.update()) + ",100%,50%,0.15)"; // Increased opacity for visibility
      }
      
      ctx.lineWidth = 1;

      for (let t = 0; t < E.trails; t++) {
        if (lines[t]) {
            lines[t].update();
            lines[t].draw();
        }
      }
      
      animationFrameId = window.requestAnimationFrame(render);
    }

    function resizeCanvas() {
       if (canvas) {
           canvas.width = window.innerWidth;
           canvas.height = window.innerHeight;
       }
    }

    // Initialization
    f = new (n as any)({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });
    
    // Initial lines
    lines = [];
    for (let i = 0; i < E.trails; i++) {
        lines.push(new (Line as any)({ spring: 0.45 + (i / E.trails) * 0.025 }));
    }

    // Initial Resize
    resizeCanvas();
    
    // Event Listeners
    document.addEventListener("mousemove", onMousemove);
    document.addEventListener("touchstart", onMousemove);
    window.addEventListener("resize", resizeCanvas);
    
    // Start Loop
    render();

    // Cleanup
    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener("mousemove", onMousemove);
      document.removeEventListener("touchstart", onMousemove);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none fixed inset-0 z-0 h-full w-full bg-transparent", className)}
      id="canvas"
    />
  );
};
