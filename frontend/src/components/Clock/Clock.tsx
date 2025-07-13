import { DigitalClock } from "./DigitalClock";
import { AnalogClock } from "./AnalogClock";
import { useConfig } from "../../contexts/ConfigContext";

export function Clock() {
	const { config } = useConfig();

	if (!config.clockActive) return null;
	return config.clockStyle === "analog" ? <AnalogClock /> : <DigitalClock />;
}
