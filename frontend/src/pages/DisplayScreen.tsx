import { useState } from "react";
import { useConfig } from "../contexts/ConfigContext";
import { GearIcon } from "../components/Settings/GearIcon";
import { DraggableClock } from "../components/Clock/DraggableClock";
import { SettingsOverlay } from "../components/Settings/SettingsOverlay";

// Simple display screen for now - will expand with components later
export default function DisplayScreen() {
	const { config } = useConfig();
	const backgroundUrl = config.backgroundImageUrl || "/backgrounds/default.jpg";
	const [showSettings, setShowSettings] = useState(false);

	return (
		<div className="display-screen">
			<div className="background-container">
				<img src={backgroundUrl} alt="Background" className="background-image" draggable={false} />
			</div>

			{/* Settings gear icon in top-right */}
			<div
				style={{
					position: "absolute",
					top: 16,
					right: 16,
					zIndex: 10,
				}}
			>
				<GearIcon onClick={() => setShowSettings(true)} aria-label="Settings" />
			</div>

			<div className="display-overlay">{config.components.clock.isActive && <DraggableClock />}</div>

			{/* Settings overlay */}
			<SettingsOverlay isOpen={showSettings} onClose={() => setShowSettings(false)} />
		</div>
	);
}
