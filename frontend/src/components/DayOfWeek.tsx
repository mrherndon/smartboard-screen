import { useState, useEffect } from "react";

interface DayOfWeekProps {
	size?: number;
	format?: "full" | "short" | "abbreviated"; // "Monday" | "Mon" | "M"
}

export function DayOfWeek({ size = 200, format = "full" }: DayOfWeekProps) {
	const [currentDay, setCurrentDay] = useState(new Date());

	useEffect(() => {
		const updateDay = () => {
			setCurrentDay(new Date());
		};

		// Update immediately
		updateDay();

		// Update at midnight each day
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);
		const msUntilMidnight = tomorrow.getTime() - now.getTime();

		const timeoutId = setTimeout(() => {
			updateDay();
			// Then update every 24 hours
			const intervalId = setInterval(updateDay, 24 * 60 * 60 * 1000);
			return () => clearInterval(intervalId);
		}, msUntilMidnight);

		return () => clearTimeout(timeoutId);
	}, []);

	const formatDay = (date: Date) => {
		const days = {
			full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			abbreviated: ["S", "M", "T", "W", "T", "F", "S"],
		};

		return days[format][date.getDay()];
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: `${size}px`,
				height: `${Math.max(60, size * 0.3)}px`,
				color: "white",
				textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
				textAlign: "center",
			}}
			aria-label={`Day of week: ${formatDay(currentDay)}`}
		>
			<div
				style={{
					fontSize: `${Math.max(20, size * 0.15)}px`,
					fontWeight: "500",
					fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
					letterSpacing: "0.05em",
					textTransform: "uppercase",
				}}
			>
				{formatDay(currentDay)}
			</div>
		</div>
	);
}
