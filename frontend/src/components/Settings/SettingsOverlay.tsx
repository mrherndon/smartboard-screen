import { useState } from "react";

interface SettingsOverlayProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SettingsOverlay({ isOpen, onClose }: SettingsOverlayProps) {
	// These would come from config context or API in a real app
	const [clockActive, setClockActive] = useState(true);
	const [clockType, setClockType] = useState<"digital" | "analog">("digital");

	if (!isOpen) return null;

	return (
		<div className="settings-overlay">
			{/* Backdrop blur */}
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

			{/* Glass panel */}
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

				<div className="settings-content">
					<h1 style={{ marginBottom: "32px", fontSize: "28px", fontWeight: "600" }}>Display Settings</h1>

					<section style={{ marginBottom: 32 }}>
						<h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "500" }}>Clock Settings</h2>
						<div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
							<label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "16px" }}>
								<input
									type="checkbox"
									checked={clockActive}
									onChange={(e) => setClockActive(e.target.checked)}
									style={{ transform: "scale(1.2)" }}
								/>
								Active
							</label>
							<label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "16px" }}>
								<input
									type="radio"
									name="clockType"
									value="digital"
									checked={clockType === "digital"}
									onChange={() => setClockType("digital")}
									style={{ transform: "scale(1.2)" }}
								/>
								Digital
							</label>
							<label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "16px" }}>
								<input
									type="radio"
									name="clockType"
									value="analog"
									checked={clockType === "analog"}
									onChange={() => setClockType("analog")}
									style={{ transform: "scale(1.2)" }}
								/>
								Analog
							</label>
						</div>
					</section>

					{/* Placeholder for future settings */}
					<section style={{ marginBottom: 32 }}>
						<h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "500" }}>Schedule Settings</h2>
						<p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Coming soon...</p>
					</section>

					<section style={{ marginBottom: 32 }}>
						<h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "500" }}>Background Settings</h2>
						<p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Coming soon...</p>
					</section>
				</div>
			</div>

			<style>{`
        @keyframes settingsSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
		</div>
	);
}
