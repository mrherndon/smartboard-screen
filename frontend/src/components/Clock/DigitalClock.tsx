import { useEffect, useState } from "react";

export function DigitalClock() {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="digital-clock">
			{now.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			})}
		</div>
	);
}
