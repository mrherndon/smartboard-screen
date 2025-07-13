// Simple display screen for now - will expand with components later
export default function DisplayScreen() {
	return (
		<div className="display-screen">
			<div className="background-container">
				<div
					style={{
						width: "100%",
						height: "100%",
						background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					}}
				/>
			</div>

			<div className="display-overlay">
				<div className="clock-container">
					<div className="skim-background">
						<div className="digital-clock">
							{new Date().toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
								hour12: true,
							})}
						</div>
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
		</div>
	);
}
