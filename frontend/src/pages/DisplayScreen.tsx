import { useState } from "react";
import { useConfig } from "../contexts/ConfigContext";
import { GearIcon } from "../components/Settings/GearIcon";
import { Clock } from "../components/Clock/Clock";
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

			<div className="display-overlay">
				<div className="clock-container">
					<div className="skim-background">
						<Clock />
					</div>
				</div>

				<div className="schedule-container">
					<div className="skim-background">
						<div className="current-class">
							<div className="class-title">Welcome to Smartboard</div>
							<div className="class-details">Setup in progress...</div>
						</div>
					</div>
				</div>

				<div className="footer-container">
					<div className="skim-background" style={{ padding: "0.5rem 1rem" }}>
						Admin Panel
					</div>
				</div>
			</div>

			{/* Settings overlay */}
			<SettingsOverlay isOpen={showSettings} onClose={() => setShowSettings(false)} />
		</div>
	);
}
