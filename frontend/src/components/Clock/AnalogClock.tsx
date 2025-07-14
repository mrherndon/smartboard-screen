import { useEffect, useRef } from "react";

interface AnalogClockProps {
	size?: number;
}

export function AnalogClock({ size = 200 }: AnalogClockProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const drawClock = () => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			const radius = (canvas.width - 8) / 2; // Account for internal padding

			// Clear canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			ctx.translate(canvas.width / 2, canvas.height / 2); // Center on the padded canvas

			// Draw outer circle border only (no background fill)
			ctx.beginPath();
			ctx.arc(0, 0, radius - 4, 0, 2 * Math.PI);
			ctx.strokeStyle = "white";
			ctx.lineWidth = Math.max(2, size * 0.02);
			ctx.stroke();

			// Draw hour marks (thicker white lines)
			for (let i = 0; i < 12; i++) {
				ctx.save();
				ctx.rotate((i * Math.PI) / 6);
				ctx.beginPath();
				ctx.moveTo(0, -radius + size * 0.04);
				ctx.lineTo(0, -radius + size * 0.125);
				ctx.strokeStyle = "white";
				ctx.lineWidth = Math.max(2, size * 0.02);
				ctx.stroke();
				ctx.restore();
			}

			// Draw minute marks (thinner white lines)
			for (let i = 0; i < 60; i++) {
				if (i % 5 !== 0) {
					ctx.save();
					ctx.rotate((i * Math.PI) / 30);
					ctx.beginPath();
					ctx.moveTo(0, -radius + size * 0.06);
					ctx.lineTo(0, -radius + size * 0.1);
					ctx.strokeStyle = "white";
					ctx.lineWidth = Math.max(1, size * 0.01);
					ctx.stroke();
					ctx.restore();
				}
			}

			// Get current time
			const now = new Date();
			let hour = now.getHours();
			hour = hour % 12;
			const minute = now.getMinutes();
			const second = now.getSeconds();

			// Draw hour hand (thick with dark outline for visibility)
			ctx.save();
			ctx.rotate(((hour + minute / 60) * Math.PI) / 6);
			ctx.beginPath();
			ctx.moveTo(0, size * 0.05);
			ctx.lineTo(0, -radius + size * 0.25);
			// Draw dark outline first
			ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
			ctx.lineWidth = Math.max(6, size * 0.05);
			ctx.lineCap = "round";
			ctx.stroke();
			// Draw white center
			ctx.strokeStyle = "white";
			ctx.lineWidth = Math.max(3, size * 0.03);
			ctx.stroke();
			ctx.restore();

			// Draw minute hand (medium with dark outline)
			ctx.save();
			ctx.rotate(((minute + second / 60) * Math.PI) / 30);
			ctx.beginPath();
			ctx.moveTo(0, size * 0.075);
			ctx.lineTo(0, -radius + size * 0.15);
			// Draw dark outline first
			ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
			ctx.lineWidth = Math.max(4, size * 0.035);
			ctx.lineCap = "round";
			ctx.stroke();
			// Draw white center
			ctx.strokeStyle = "white";
			ctx.lineWidth = Math.max(2, size * 0.015);
			ctx.stroke();
			ctx.restore();

			// Draw second hand (thin red)
			ctx.save();
			ctx.rotate((second * Math.PI) / 30);
			ctx.beginPath();
			ctx.moveTo(0, size * 0.1);
			ctx.lineTo(0, -radius + size * 0.125);
			ctx.strokeStyle = "#ff0000";
			ctx.lineWidth = Math.max(1, size * 0.01);
			ctx.lineCap = "round";
			ctx.stroke();
			ctx.restore();

			// Draw numbers (1-12) positioned closer to center to avoid collision
			ctx.fillStyle = "white";
			ctx.font = `bold ${Math.max(12, size * 0.12)}px Arial`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			// Add text shadow for better visibility
			ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
			ctx.shadowBlur = Math.max(2, size * 0.015);
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;

			for (let i = 1; i <= 12; i++) {
				const angle = (i * Math.PI) / 6 - Math.PI / 2;
				const x = Math.cos(angle) * (radius - size * 0.225);
				const y = Math.sin(angle) * (radius - size * 0.225);
				ctx.fillText(i.toString(), x, y);
			}

			// Reset shadow for center dot
			ctx.shadowColor = "transparent";
			ctx.shadowBlur = 0;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;

			// Draw center dot
			ctx.beginPath();
			ctx.arc(0, 0, Math.max(4, size * 0.04), 0, 2 * Math.PI);
			ctx.fillStyle = "white";
			ctx.fill();

			ctx.restore();
		};

		drawClock();
		const interval = setInterval(drawClock, 1000);
		return () => clearInterval(interval);
	}, [size]);

	return (
		<canvas
			ref={canvasRef}
			width={size + 8} // Add 8px internal padding to prevent clipping
			height={size + 8} // Add 8px internal padding to prevent clipping
			style={{
				display: "block",
				background: "none",
				width: `${size}px`,
				height: `${size}px`,
			}}
			aria-label="Analog clock"
		/>
	);
}
