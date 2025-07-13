import { useEffect, useRef } from "react";

export function AnalogClock() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const drawClock = () => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			const radius = canvas.width / 2;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			ctx.translate(radius, radius);
			ctx.beginPath();
			ctx.arc(0, 0, radius - 2, 0, 2 * Math.PI);
			ctx.fillStyle = "rgba(255,255,255,0.7)";
			ctx.fill();
			ctx.strokeStyle = "#333";
			ctx.lineWidth = 2;
			ctx.stroke();
			// Draw hour marks
			for (let i = 0; i < 12; i++) {
				ctx.save();
				ctx.rotate((i * Math.PI) / 6);
				ctx.beginPath();
				ctx.moveTo(0, -radius + 8);
				ctx.lineTo(0, -radius + 20);
				ctx.strokeStyle = "#333";
				ctx.lineWidth = 3;
				ctx.stroke();
				ctx.restore();
			}
			// Draw minute marks
			for (let i = 0; i < 60; i++) {
				if (i % 5 !== 0) {
					ctx.save();
					ctx.rotate((i * Math.PI) / 30);
					ctx.beginPath();
					ctx.moveTo(0, -radius + 14);
					ctx.lineTo(0, -radius + 20);
					ctx.strokeStyle = "#888";
					ctx.lineWidth = 1;
					ctx.stroke();
					ctx.restore();
				}
			}
			// Draw hands
			const now = new Date();
			let hour = now.getHours();
			hour = hour % 12;
			const minute = now.getMinutes();
			const second = now.getSeconds();
			// Hour hand
			ctx.save();
			ctx.rotate(((hour + minute / 60) * Math.PI) / 6);
			ctx.beginPath();
			ctx.moveTo(0, 8);
			ctx.lineTo(0, -radius + 40);
			ctx.strokeStyle = "#222";
			ctx.lineWidth = 6;
			ctx.lineCap = "round";
			ctx.stroke();
			ctx.restore();
			// Minute hand
			ctx.save();
			ctx.rotate(((minute + second / 60) * Math.PI) / 30);
			ctx.beginPath();
			ctx.moveTo(0, 16);
			ctx.lineTo(0, -radius + 24);
			ctx.strokeStyle = "#222";
			ctx.lineWidth = 4;
			ctx.stroke();
			ctx.restore();
			// Second hand
			ctx.save();
			ctx.rotate((second * Math.PI) / 30);
			ctx.beginPath();
			ctx.moveTo(0, 20);
			ctx.lineTo(0, -radius + 18);
			ctx.strokeStyle = "#e11d48";
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.restore();
			ctx.restore();
		};
		drawClock();
		const interval = setInterval(drawClock, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			width={120}
			height={120}
			style={{ display: "block", background: "none" }}
			aria-label="Analog clock"
		/>
	);
}
