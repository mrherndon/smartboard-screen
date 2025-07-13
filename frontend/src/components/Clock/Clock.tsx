import { DigitalClock } from "./DigitalClock";
import { AnalogClock } from "./AnalogClock";

// TODO: Replace with context/config props
export interface ClockProps {
	type?: "digital" | "analog";
	active?: boolean;
}

export function Clock({ type = "digital", active = true }: ClockProps) {
	if (!active) return null;
	return type === "analog" ? <AnalogClock /> : <DigitalClock />;
}
