import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

interface Star {
  x: number; y: number; size: number; opacity: number;
  color: string; twinkleSpeed: number; twinkleOffset: number;
}

interface ShootingStar {
  active: boolean; startTime: number; duration: number;
  startX: number; startY: number; endX: number; endY: number;
  tailLength: number; width: number;
}

@Component({
  selector: 'app-starfield',
  standalone: true,
  template: '<canvas #canvas aria-hidden="true"></canvas>',
  styles: [`:host canvas {
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: -1; pointer-events: none;
  }`]
})
export class StarfieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private stars: Star[] = [];
  private shootingStars: ShootingStar[] = [];
  private lastSpawn = 0;
  private resizeHandler = this.debounce(() => this.resize(), 200);

  private clusters = [
    { x: 0.85, y: 0.12, r: 0.18 },
    { x: 0.10, y: 0.45, r: 0.20 },
    { x: 0.80, y: 0.78, r: 0.15 },
    { x: 0.45, y: 0.72, r: 0.17 },
  ];

  private nebulas = [
    { x: 0.82, y: 0.10, rx: 0.22, ry: 0.16, angle: 0.3,
      colors: [[212, 165, 116], [180, 140, 90], [155, 120, 80]] },
    { x: 0.08, y: 0.40, rx: 0.18, ry: 0.25, angle: -0.4,
      colors: [[80, 140, 200], [60, 120, 180], [100, 160, 210]] },
    { x: 0.78, y: 0.80, rx: 0.15, ry: 0.12, angle: 0.6,
      colors: [[160, 100, 200], [140, 80, 180], [180, 120, 210]] },
    { x: 0.42, y: 0.75, rx: 0.20, ry: 0.13, angle: -0.2,
      colors: [[200, 100, 130], [180, 80, 120], [170, 110, 140]] },
    { x: 0.20, y: 0.15, rx: 0.14, ry: 0.10, angle: 0.5,
      colors: [[80, 180, 140], [60, 160, 120], [100, 190, 150]] },
    { x: 0.92, y: 0.50, rx: 0.12, ry: 0.18, angle: -0.3,
      colors: [[80, 170, 210], [60, 150, 200], [100, 185, 220]] },
  ];

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.resizeHandler);
    this.generateStars();
    this.animationId = requestAnimationFrame((t) => this.draw(t));
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resizeHandler);
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private generateStars(): void {
    const total = 800;
    for (let i = 0; i < total; i++) {
      let x: number, y: number, size: number, opacity: number, color: string;

      if (i < total * 0.4) {
        const cluster = this.clusters[Math.floor(Math.random() * this.clusters.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * Math.random() * cluster.r;
        x = cluster.x + Math.cos(angle) * dist;
        y = cluster.y + Math.sin(angle) * dist;
        const blue = 200 + Math.floor(Math.random() * 55);
        const green = 180 + Math.floor(Math.random() * 40);
        color = `rgba(${150 + Math.floor(Math.random() * 40)}, ${green}, ${blue}, `;
        size = Math.random() < 0.15 ? 1.5 + Math.random() : 0.5 + Math.random() * 0.8;
        opacity = 0.5 + Math.random() * 0.5;
      } else {
        x = Math.random();
        y = Math.random();
        color = `rgba(255, 255, 255, `;
        size = Math.random() < 0.08 ? 1.2 + Math.random() : 0.3 + Math.random() * 0.7;
        opacity = 0.2 + Math.random() * 0.6;
      }

      this.stars.push({
        x, y, size, opacity, color,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  private draw(time: number): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw nebulas
    this.nebulas.forEach(neb => {
      const cx = neb.x * canvas.width;
      const cy = neb.y * canvas.height;
      const rx = neb.rx * canvas.width;
      const ry = neb.ry * canvas.height;
      const r = Math.max(rx, ry);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(neb.angle);
      ctx.scale(rx / r, ry / r);

      neb.colors.forEach((col, i) => {
        const layerR = r * (1.2 - i * 0.25);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, layerR);
        const alpha = 0.07 - i * 0.015;
        grad.addColorStop(0, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha})`);
        grad.addColorStop(0.3, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha * 0.6})`);
        grad.addColorStop(0.6, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${alpha * 0.2})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(-layerR, -layerR, layerR * 2, layerR * 2);
      });

      ctx.restore();
    });

    // Draw stars
    const t = time * 0.001;
    this.stars.forEach(star => {
      const twinkle = 0.6 + 0.4 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
      const alpha = star.opacity * twinkle;
      ctx.beginPath();
      ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color + alpha + ')';
      ctx.fill();
    });

    // Shooting stars
    this.updateShootingStars(time);
    this.shootingStars.forEach(s => {
      if (!s.active) return;
      const progress = (time - s.startTime) / s.duration;
      if (progress > 1) { s.active = false; return; }

      const x = s.startX + (s.endX - s.startX) * progress;
      const y = s.startY + (s.endY - s.startY) * progress;
      const fade = progress < 0.1 ? progress / 0.1 : progress > 0.6 ? (1 - progress) / 0.4 : 1;
      const angle = Math.atan2(s.endY - s.startY, s.endX - s.startX);
      const tailX = x - Math.cos(angle) * s.tailLength;
      const tailY = y - Math.sin(angle) * s.tailLength;

      const grad = ctx.createLinearGradient(tailX, tailY, x, y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.7, `rgba(200, 220, 255, ${0.3 * fade})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${0.9 * fade})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, s.width * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * fade})`;
      ctx.fill();
    });

    this.animationId = requestAnimationFrame((t) => this.draw(t));
  }

  private updateShootingStars(time: number): void {
    if (time - this.lastSpawn > 2000 + Math.random() * 3000) {
      const count = Math.random() < 0.2 ? 2 + Math.floor(Math.random() * 2) : 1;
      for (let i = 0; i < count; i++) this.spawnShootingStar(time + i * 200);
      this.lastSpawn = time;
    }
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      if (!this.shootingStars[i].active) this.shootingStars.splice(i, 1);
    }
  }

  private spawnShootingStar(time: number): void {
    const canvas = this.canvasRef.nativeElement;
    const angle = (Math.PI / 6) + Math.random() * (Math.PI / 4);
    const speed = 200 + Math.random() * 300;
    const duration = 600 + Math.random() * 800;
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height * 0.5;

    this.shootingStars.push({
      active: true, startTime: time, duration, startX, startY,
      endX: startX + Math.cos(angle) * speed,
      endY: startY + Math.sin(angle) * speed,
      tailLength: 60 + Math.random() * 100,
      width: 0.8 + Math.random() * 1.2,
    });
  }

  private debounce(fn: () => void, ms: number): () => void {
    let timeout: any;
    return () => { clearTimeout(timeout); timeout = setTimeout(fn, ms); };
  }
}
