import { useState } from "react";
import { useConfig } from "../../contexts/ConfigContext";
import { ToggleSwitch } from "./ToggleSwitch";
import { DATE_FORMAT_EXAMPLES } from "../../utils/dateFormat";

interface ClockSettingsMenuProps {
	onClose: () => void;
}

export function ClockSettingsMenu({ onClose }: ClockSettingsMenuProps) {
	const { config, updateClock } = useConfig();
	const clockConfig = config.components.clock;
	const [showDateFormats, setShowDateFormats] = useState(false);

	return (
		<div className="settings-submenu">
			<button onClick={onClose} className="back-button">
				&larr; Back to Main Settings
			</button>
			<h2 className="submenu-title">Clock Configuration</h2>

			<div className="setting-item">
				<ToggleSwitch
					label="Show Date"
					isOn={clockConfig.showDate}
					onToggle={() => updateClock({ showDate: !clockConfig.showDate })}
				/>
			</div>

			<div className="setting-item">
				<span className="text-white font-medium">Clock Style</span>
				<div className="select-container">
					<select
						value={clockConfig.type}
						onChange={(e) => updateClock({ type: e.target.value as "analog" | "digital" })}
						className="glass-select"
					>
						<option value="digital">Digital</option>
						<option value="analog">Analog</option>
					</select>
				</div>
			</div>

			{/* Date Format Selection - only show if date is enabled */}
			{clockConfig.showDate && (
				<div className="setting-item">
					<div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
						<span className="text-white font-medium">Date Format</span>
						<button
							onClick={() => setShowDateFormats(!showDateFormats)}
							style={{
								background: "rgba(255, 255, 255, 0.2)",
								border: "1px solid rgba(255, 255, 255, 0.3)",
								borderRadius: "50%",
								width: "20px",
								height: "20px",
								color: "white",
								fontSize: "12px",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
							title="Show format examples"
						>
							?
						</button>
					</div>
					<input
						type="text"
						value={clockConfig.dateFormat}
						onChange={(e) => updateClock({ dateFormat: e.target.value })}
						placeholder="Enter date format pattern"
						style={{
							width: "100%",
							padding: "8px 12px",
							background: "rgba(255, 255, 255, 0.1)",
							border: "1px solid rgba(255, 255, 255, 0.3)",
							borderRadius: "8px",
							color: "white",
							fontSize: "14px",
						}}
					/>
					{showDateFormats && (
						<div
							style={{
								marginTop: "12px",
								padding: "12px",
								background: "rgba(0, 0, 0, 0.3)",
								borderRadius: "8px",
								fontSize: "12px",
							}}
						>
							<div style={{ fontWeight: "500", marginBottom: "8px", color: "white" }}>Common Date Formats:</div>
							{DATE_FORMAT_EXAMPLES.map((format, index) => (
								<div
									key={index}
									style={{
										display: "flex",
										justifyContent: "space-between",
										marginBottom: "4px",
										cursor: "pointer",
										padding: "4px",
										borderRadius: "4px",
										transition: "background 0.2s",
									}}
									onClick={() => {
										updateClock({ dateFormat: format.pattern });
										setShowDateFormats(false);
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.background = "transparent";
									}}
								>
									<span style={{ fontFamily: "monospace", color: "#a0a0a0" }}>{format.pattern}</span>
									<span style={{ color: "white" }}>{format.example}</span>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			<div className="setting-item">
				<label htmlFor="clockSize" className="text-white font-medium">
					Clock Size: {clockConfig.size.width}px
				</label>
				<input
					id="clockSize"
					type="range"
					min="100"
					max="800"
					step="10"
					value={clockConfig.size.width}
					onChange={(e) => {
						const newSize = parseInt(e.target.value, 10);
						updateClock({ size: { width: newSize, height: newSize } });
					}}
					className="w-full"
				/>
			</div>
			{/* Clock Controls Tips */}
			<section style={{ marginBottom: "32px" }}>
				<h2 style={{ marginBottom: "16px", fontWeight: 500 }}>Clock Controls</h2>
				<div style={{ fontSize: "14px", opacity: 0.8, lineHeight: 1.5 }}>
					<p style={{ marginBottom: "8px" }}>• Drag the clock to move it around the screen</p>
					<p>• Double-click the clock to show resize handles</p>
				</div>
			</section>
		</div>
	);
}
