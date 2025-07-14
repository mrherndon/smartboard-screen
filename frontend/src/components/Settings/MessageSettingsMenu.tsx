import { useState } from "react";
import { useConfig } from "../../contexts/ConfigContext";

interface MessageSettingsMenuProps {
	onClose: () => void;
}

export function MessageSettingsMenu({ onClose }: MessageSettingsMenuProps) {
	const { config, updateMessage } = useConfig();
	const [localText, setLocalText] = useState(config.components.message.text);

	const handleSave = () => {
		updateMessage({ text: localText });
		onClose();
	};

	return (
		<div className="submenu">
			{/* Back Button */}
			<button
				onClick={onClose}
				style={{
					background: "rgba(255, 255, 255, 0.1)",
					border: "1px solid rgba(255, 255, 255, 0.3)",
					borderRadius: "8px",
					padding: "8px 12px",
					color: "white",
					fontSize: "14px",
					cursor: "pointer",
					marginBottom: "24px",
					transition: "all 0.2s",
				}}
				onMouseOver={(e) => {
					e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
				}}
				onMouseOut={(e) => {
					e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
				}}
			>
				← Back to Settings
			</button>

			<h2 style={{ marginBottom: "24px", fontWeight: 500 }}>Message Settings</h2>

			{/* Message Text Input */}
			<div style={{ marginBottom: "24px" }}>
				<label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>Message Text</label>
				<textarea
					value={localText}
					onChange={(e) => setLocalText(e.target.value)}
					placeholder="Enter your message here..."
					style={{
						width: "100%",
						minHeight: "100px",
						padding: "12px",
						background: "rgba(255, 255, 255, 0.1)",
						border: "1px solid rgba(255, 255, 255, 0.3)",
						borderRadius: "8px",
						color: "white",
						fontSize: "14px",
						fontFamily: "inherit",
						resize: "vertical",
					}}
				/>
			</div>

			{/* Save Button */}
			<button
				onClick={handleSave}
				style={{
					background: "rgba(34, 197, 94, 0.3)",
					border: "1px solid rgba(34, 197, 94, 0.5)",
					borderRadius: "8px",
					padding: "12px 24px",
					color: "white",
					fontSize: "14px",
					cursor: "pointer",
					transition: "all 0.2s",
				}}
				onMouseOver={(e) => {
					e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.4)";
				}}
				onMouseOut={(e) => {
					e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.3)";
				}}
			>
				Save Changes
			</button>
		</div>
	);
}
