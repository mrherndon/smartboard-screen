import { useState, useEffect } from "react";

interface DigitalClockProps {
	size?: number;
}

export function DigitalClock({ size = 200 }: DigitalClockProps) {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: `${size}px`,
				height: `${size}px`,
				color: "white",
				fontSize: `${Math.max(16, size * 0.15)}px`,
				fontWeight: "bold",
				fontFamily: "monospace",
				textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
				textAlign: "center",
			}}
			aria-label="Digital clock"
		>
			{formatTime(time)}
		</div>
	);
}
