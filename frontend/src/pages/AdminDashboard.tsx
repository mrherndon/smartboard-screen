export default function AdminDashboard() {
	return (
		<div className="admin-container">
			<div className="admin-header">
				<h1>Admin Dashboard</h1>
				<p>Manage your smartboard settings</p>
			</div>
			<div className="admin-content">
				<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
					<div className="skim-background" style={{ padding: "2rem" }}>
						<h2>Schedule Manager</h2>
						<p>Create and manage class schedules</p>
						<a href="/admin/schedule" className="btn btn-primary">
							Manage Schedules
						</a>
					</div>

					<div className="skim-background" style={{ padding: "2rem" }}>
						<h2>Background Images</h2>
						<p>Upload and organize background images</p>
						<a href="/admin/images" className="btn btn-primary">
							Manage Images
						</a>
					</div>

					<div className="skim-background" style={{ padding: "2rem" }}>
						<h2>Display Settings</h2>
						<p>Configure clock, theme, and display options</p>
						<a href="/admin/settings" className="btn btn-primary">
							Settings
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
