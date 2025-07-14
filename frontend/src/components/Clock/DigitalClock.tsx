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
			hour: "numeric", // No leading zero
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
	};

	const timeString = formatTime(time);
	const timeParts = timeString.split(" ");
	const timeOnly = timeParts[0]; // "8:46:19"
	const amPm = timeParts[1]; // "PM"

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: `${size}px`,
				height: `${Math.max(60, size * 0.4)}px`,
				color: "white",
				textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
				textAlign: "center",
				gap: "4px",
			}}
			aria-label="Digital clock"
		>
			{/* Time Display */}
			<div
				style={{
					fontSize: `${Math.max(24, size * 0.2)}px`,
					fontWeight: "300",
					fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
					letterSpacing: "0.05em",
					lineHeight: 1,
				}}
			>
				{timeOnly}

				{/* AM/PM Display */}
				<span>{amPm}</span>
			</div>
		</div>
	);
}
