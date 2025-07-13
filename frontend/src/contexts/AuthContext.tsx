import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Temporary local User type until shared package is properly linked
interface User {
	id: string;
	email: string;
	name: string;
	picture?: string;
	role: "admin" | "user";
	schoolId?: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (googleToken: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for existing session
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const token = localStorage.getItem("auth_token");
			if (token) {
				// Verify token with backend
				const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
				const response = await fetch(`${apiUrl}/auth/verify`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.ok) {
					const userData = await response.json();
					setUser(userData.data);
				} else {
					localStorage.removeItem("auth_token");
				}
			}
		} catch (error) {
			console.error("Auth check failed:", error);
			localStorage.removeItem("auth_token");
		} finally {
			setLoading(false);
		}
	};

	const login = async (googleToken: string) => {
		try {
			const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
			const response = await fetch(`${apiUrl}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ googleToken }),
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("auth_token", data.data.token);
				setUser(data.data.user);
			} else {
				throw new Error("Login failed");
			}
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem("auth_token");
		setUser(null);
	};

	const value = {
		user,
		loading,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
