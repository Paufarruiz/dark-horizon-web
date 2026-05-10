import { useEffect, useRef } from "react";

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let stars = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = Array.from({ length: 180 }, () => ({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        r:       Math.random() * 1.2 + 0.2,
        alpha:   Math.random(),
        speed:   Math.random() * 0.003 + 0.001,
        drift:   (Math.random() - 0.5) * 0.08,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.twinkle += s.speed;
        s.x       += s.drift;
        const brightness = 0.3 + 0.7 * Math.abs(Math.sin(s.twinkle));

        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,234,242,${brightness * s.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="starfield">
      <canvas ref={canvasRef} />
    </div>
  );
}