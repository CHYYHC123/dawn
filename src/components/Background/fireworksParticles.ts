export class Firework {
  x: number;
  y: number;
  exploded: boolean; // 是否爆炸
  color: string;
  speed: number;
  size: number;
  particles: any[];
  canvas: any;
  ctx: any;

  constructor(x: number, y: number, canvas: any, ctx: any) {
    this.x = x;
    this.y = y;
    this.exploded = false;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.speed = Math.random() * 2 + 1;
    this.size = Math.random() * 3 + 2;
    this.particles = [];
    this.canvas = canvas;
    this.ctx = ctx;
  }
  update() {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.canvas.height * 0.3) {
        this.exploded = true;
        this.createParticles();
      }
    } else {
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.alpha > 0);
    }
  }
  createParticles() {
    const num = Math.floor(Math.random() * 100) + 50;
    for (let i = 0; i < num; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10;
      this.particles.push(new Particle(this.x, this.y, angle, speed, this.color, this.ctx));
    }
  }
  draw() {
    if (!this.exploded) {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    } else {
      this.particles.forEach(p => p.draw());
    }
  }
}

class Particle {
  x: number;
  y: number;
  angle: number;
  color: string;
  speed: number;
  size: number;
  alpha: number;
  gravity: number;
  friction: number;
  ctx: any;
  constructor(x: number, y: number, angle: number, speed: number, color: string, ctx: any) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.color = color;
    this.size = Math.random() * 2 + 1;
    this.alpha = 1;
    this.gravity = 0.1;
    this.friction = 0.98;
    this.ctx = ctx;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.speed *= this.friction;
    this.alpha -= 0.01;
  }
  draw() {
    this.ctx.globalAlpha = this.alpha;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
}
