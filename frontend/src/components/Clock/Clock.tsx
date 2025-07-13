import { DigitalClock } from "./DigitalClock";
import { AnalogClock } from "./AnalogClock";
import { useConfig } from "../../contexts/ConfigContext";

export function Clock() {
	const { config } = useConfig();

	if (!config.clock.active) return null;
	return config.clock.type === "analog" ? <AnalogClock /> : <DigitalClock />;
}
