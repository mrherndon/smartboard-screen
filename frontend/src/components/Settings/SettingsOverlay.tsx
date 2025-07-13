import { useConfig } from "../../contexts/ConfigContext";

interface SettingsOverlayProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SettingsOverlay({ isOpen, onClose }: SettingsOverlayProps) {
	const { config, updateClock } = useConfig();

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

				{/* Clock Settings */}
				<section style={{ marginBottom: "32px" }}>
					<h2 style={{ marginBottom: "16px", fontWeight: 500 }}>Clock</h2>

					<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
						{/* Active Toggle */}
						<label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
							<input
								type="checkbox"
								checked={config.clock.active}
								onChange={(e) => updateClock({ active: e.target.checked })}
								style={{ transform: "scale(1.2)" }}
							/>
							Active
						</label>

						{/* Type Selection */}
						<div>
							<label style={{ display: "block", marginBottom: "8px" }}>Type:</label>
							<select
								value={config.clock.type}
								onChange={(e) => updateClock({ type: e.target.value as "analog" | "digital" })}
								style={{
									background: "rgba(255, 255, 255, 0.1)",
									border: "1px solid rgba(255, 255, 255, 0.3)",
									borderRadius: "8px",
									padding: "8px 12px",
									color: "white",
									fontSize: "16px",
								}}
							>
								<option value="analog">Analog</option>
								<option value="digital">Digital</option>
							</select>
						</div>

						{/* Show Date Toggle */}
						<label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
							<input
								type="checkbox"
								checked={config.clock.showDate}
								onChange={(e) => updateClock({ showDate: e.target.checked })}
								style={{ transform: "scale(1.2)" }}
							/>
							Show Date
						</label>
					</div>
				</section>

				{/* Instructions */}
				<section style={{ marginBottom: "32px" }}>
					<h2 style={{ marginBottom: "16px", fontWeight: 500 }}>Clock Controls</h2>
					<div style={{ fontSize: "14px", opacity: 0.8, lineHeight: 1.5 }}>
						<p style={{ marginBottom: "8px" }}>• Drag the clock to move it around the screen</p>
						<p>• Double-click the clock to show resize handles</p>
					</div>
				</section>
			</div>
		</div>
	);
}
