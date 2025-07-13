export default function LoginPage() {
	return (
		<div className="admin-container">
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
				}}
			>
				<div className="skim-background" style={{ padding: "3rem", maxWidth: "400px", width: "100%" }}>
					<h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Smartboard Admin</h1>
					<p style={{ textAlign: "center", marginBottom: "2rem", opacity: 0.8 }}>
						Sign in with Google to manage your smartboard
					</p>
					<button
						className="btn btn-primary"
						style={{ width: "100%", padding: "1rem" }}
						onClick={() => {
							// TODO: Implement Google OAuth
							alert("Google OAuth will be implemented here");
						}}
					>
						Sign in with Google
					</button>
				</div>
			</div>
		</div>
	);
}
