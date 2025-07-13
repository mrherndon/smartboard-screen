import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Pages
import DisplayScreen from "./pages/DisplayScreen";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import ScheduleManager from "./pages/ScheduleManager";
import ImageManager from "./pages/ImageManager";
import Settings from "./pages/Settings";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
	const { user, loading } = useAuth();

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="app">
			<Routes>
				{/* Public display route */}
				<Route path="/" element={<DisplayScreen />} />
				<Route path="/display" element={<DisplayScreen />} />

				{/* Public settings route */}
				<Route path="/settings" element={<Settings />} />

				{/* Auth route */}
				<Route path="/login" element={<LoginPage />} />

				{/* Protected admin routes */}
				<Route
					path="/admin"
					element={
						<ProtectedRoute>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/schedule"
					element={
						<ProtectedRoute>
							<ScheduleManager />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/images"
					element={
						<ProtectedRoute>
							<ImageManager />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/settings"
					element={
						<ProtectedRoute>
							<Settings />
						</ProtectedRoute>
					}
				/>

				{/* Fallback */}
				<Route path="*" element={<DisplayScreen />} />
			</Routes>
		</div>
	);
}

export default App;
