import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Firework } from './fireworksParticles';
import { MoveLeft } from 'lucide-react';
import useSettingStore from '@/store/useSettingStore';

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let fireworks: any = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function createFirework(event: any) {
      console.log('event', event);
      const x = event.offsetX;
      const y = event.offsetY;
      fireworks.push(new Firework(x, y, canvasRef.current, ctx));
    }
    canvas.addEventListener('click', createFirework);

    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height / 1.5),
      radius: Math.random() * 1.5,
      alpha: Math.random(), // 闪烁透明度
      delta: Math.random() * 0.01 // 闪烁变化速度
    }));
    function drawStars() {
      stars.forEach(star => {
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        // 闪烁
        star.alpha += star.delta;
        if (star.alpha > 1 || star.alpha < 0) star.delta *= -1;
      });
      ctx.globalAlpha = 1;
    }

    function rederCanvasBg() {
      // 创建线性渐变
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      // 添加颜色停点
      gradient.addColorStop(0, '#0f101a');
      gradient.addColorStop(0.85, '#1a1c38');
      gradient.addColorStop(0.95, '#2a3068');
      gradient.addColorStop(0.99, '#3a4298');
      gradient.addColorStop(1, '#4a54c8');
      // 填充背景
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawStars();
    }

    function animate() {
      rederCanvasBg();

      fireworks = fireworks?.filter((f: any) => !f.exploded || f.particles.length > 0);
      fireworks.forEach((f: any) => {
        f.update();
        f.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', createFirework);
      // clearInterval(loop);
    };
  }, []);

  const setShowSky = useSettingStore(s => s.setShowSky);

  return (
    <div className="w-full h-full fixed border">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>

      <AnimatePresence>
        <motion.div
          className="absolute bottom-10 left-10 "
          animate={{
            x: [0, 10, 0], // 左右移动
            opacity: [0.8, 0.5, 0.8] // 同步透明度变化
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <MoveLeft
            size={24}
            className="text-white cursor-pointer"
            onClick={() => {
              setShowSky(false);
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Fireworks;
