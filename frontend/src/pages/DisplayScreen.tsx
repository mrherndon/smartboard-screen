import { useState } from "react";
import { useConfig } from "../contexts/ConfigContext";
import { GearIcon } from "../components/Settings/GearIcon";
import { DraggableClock } from "../components/Clock/DraggableClock";
import { DraggableMessage } from "../components/Message/DraggableMessage";
import { DraggableCountdownTimer } from "../components/Timer/DraggableCountdownTimer";
import { SettingsOverlay } from "../components/Settings/SettingsOverlay";

// Simple display screen for now - will expand with components later
export default function DisplayScreen() {
	const { config, updateMessage, updateCountdownTimer, updateClock } = useConfig();
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

			<div className="display-overlay">
				{/* The clock is rendered outside the main grid now */}
				{config.components.message.isActive && (
					<DraggableMessage
						size={config.components.message.size}
						position={config.components.message.position}
						onPositionChange={(position) => updateMessage({ position })}
						onSizeChange={(size) => updateMessage({ size })}
						text={config.components.message.text}
					/>
				)}
				{config.components.countdownTimer.isActive && (
					<DraggableCountdownTimer
						size={config.components.countdownTimer.size}
						position={config.components.countdownTimer.position}
						onPositionChange={(position) => updateCountdownTimer({ position })}
						onSizeChange={(size) => updateCountdownTimer({ size })}
					/>
				)}
				{config.components.clock.isActive && (
					<DraggableClock
						position={config.components.clock.position}
						size={config.components.clock.size.width}
						onPositionChange={(position) => updateClock({ position })}
						onSizeChange={(size) => updateClock({ size: { width: size, height: size } })}
					/>
				)}
			</div>

			{/* Settings overlay */}
			<SettingsOverlay isOpen={showSettings} onClose={() => setShowSettings(false)} />
		</div>
	);
}
