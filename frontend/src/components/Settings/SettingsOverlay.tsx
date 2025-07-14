import { useState } from "react";
import { useConfig } from "../../contexts/ConfigContext";
import { ToggleSwitch } from "./ToggleSwitch";
import { ClockSettingsMenu } from "./ClockSettingsMenu";

interface SettingsOverlayProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SettingsOverlay({ isOpen, onClose }: SettingsOverlayProps) {
	const { config, updateClock } = useConfig();
	const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

	if (!isOpen) return null;

	return (
		<div className="settings-overlay">
			{/* Backdrop */}
			<div
				className="settings-backdrop"
				onClick={onClose}
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0, 0, 0, 0.3)",
					backdropFilter: "blur(8px)",
					zIndex: 1000,
				}}
			/>

			{/* Settings Panel */}
			<div
				className="settings-panel"
				style={{
					position: "fixed",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "min(600px, 90vw)",
					maxHeight: "80vh",
					backgroundColor: "rgba(255, 255, 255, 0.15)",
					backdropFilter: "blur(20px)",
					borderRadius: "20px",
					border: "1px solid rgba(255, 255, 255, 0.2)",
					boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
					padding: "32px",
					zIndex: 1001,
					color: "white",
					overflow: "auto",
					animation: "settingsSlideIn 0.3s ease-out",
				}}
			>
				{/* Close button */}
				<button
					onClick={onClose}
					style={{
						position: "absolute",
						top: "16px",
						right: "16px",
						width: "40px",
						height: "40px",
						borderRadius: "50%",
						border: "1px solid rgba(255, 255, 255, 0.3)",
						backgroundColor: "rgba(255, 255, 255, 0.1)",
						color: "white",
						fontSize: "24px",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						transition: "all 0.2s",
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
					}}
					aria-label="Close settings"
				>
					×
				</button>

				<h1 style={{ marginBottom: "32px", fontWeight: 600 }}>Settings</h1>

				{/* Main Settings or Submenu */}
				{activeSubmenu === "clock" ? (
					<ClockSettingsMenu onClose={() => setActiveSubmenu(null)} />
				) : (
					<div className="settings-main">
						{/* Clock Component Section */}
						<section style={{ marginBottom: "32px" }}>
							<h2 style={{ marginBottom: "16px", fontWeight: 500 }}>Components</h2>

							<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
								{/* Clock Active Toggle */}
								<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
									<ToggleSwitch
										label="Clock"
										isOn={config.components.clock.isActive}
										onToggle={() => updateClock({ isActive: !config.components.clock.isActive })}
									/>
									{config.components.clock.isActive && (
										<button
											onClick={() => setActiveSubmenu("clock")}
											className="submenu-button"
											style={{
												background: "rgba(255, 255, 255, 0.1)",
												border: "1px solid rgba(255, 255, 255, 0.3)",
												borderRadius: "8px",
												padding: "8px 16px",
												color: "white",
												fontSize: "14px",
												cursor: "pointer",
												transition: "all 0.2s",
											}}
											onMouseOver={(e) => {
												e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
											}}
											onMouseOut={(e) => {
												e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
											}}
										>
											Configure →
										</button>
									)}
								</div>
							</div>
						</section>
					</div>
				)}
			</div>
		</div>
	);
}
