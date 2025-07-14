import { DigitalClock } from "./DigitalClock";
import { AnalogClock } from "./AnalogClock";
import { useConfig } from "../../contexts/ConfigContext";

export function Clock() {
	const { config } = useConfig();

	if (!config.components.clock.isActive) return null;
	return config.components.clock.type === "analog" ? <AnalogClock /> : <DigitalClock />;
}
