import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfig } from "../contexts/ConfigContext";
import { ToggleSwitch } from "../components/Settings/ToggleSwitch";
import { ClockSettingsMenu } from "../components/Settings/ClockSettingsMenu";

export default function Settings() {
	const { config, updateComponent } = useConfig();
	const [activeSubmenu, setActiveSubmenu] = useState<"clock" | null>(null);
	const navigate = useNavigate();

	const handleClose = () => {
		if (activeSubmenu) {
			setActiveSubmenu(null);
		} else {
			navigate("/");
		}
	};

	return (
		<div className="settings-overlay">
			{/* Backdrop blur */}
			<div
				className="settings-backdrop"
				onClick={handleClose}
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
				}}
			>
				{/* Close button */}
				<button
					onClick={handleClose}
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
					{!activeSubmenu && (
						<>
							<h1 style={{ marginBottom: "32px", fontSize: "28px", fontWeight: "600" }}>Display Settings</h1>

							<section style={{ marginBottom: 32 }}>
								<h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "500" }}>Component Visibility</h2>
								<div className="flex flex-col gap-4">
									<ToggleSwitch
										label="Show Clock"
										isOn={config.components.clock.isActive}
										onToggle={() => updateComponent("clock", { isActive: !config.components.clock.isActive })}
									/>
									{config.components.clock.isActive && (
										<button onClick={() => setActiveSubmenu("clock")} className="submenu-button">
											Configure Clock &rarr;
										</button>
									)}
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
						</>
					)}

					{activeSubmenu === "clock" && <ClockSettingsMenu onClose={() => setActiveSubmenu(null)} />}
				</div>
			</div>
		</div>
	);
}
