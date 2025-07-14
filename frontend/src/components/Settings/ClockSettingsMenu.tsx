import { useConfig } from "../../contexts/ConfigContext";
import { ToggleSwitch } from "./ToggleSwitch";

interface ClockSettingsMenuProps {
	onClose: () => void;
}

export function ClockSettingsMenu({ onClose }: ClockSettingsMenuProps) {
	const { config, updateClock } = useConfig();
	const clockConfig = config.components.clock;

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
