import { createContext, useContext, useState, ReactNode } from "react";

// Temporary local types until shared package is properly linked
interface AppConfig {
	clockFormat: "12h" | "24h";
	clockStyle: "analog" | "digital";
	theme: "light" | "dark";
	backgroundImageUrl?: string;
	skrimOpacity: number;
}

interface ConfigContextType {
	config: AppConfig;
	updateConfig: (updates: Partial<AppConfig>) => void;
	loading: boolean;
}

const defaultConfig: AppConfig = {
	clockFormat: "12h",
	clockStyle: "analog",
	theme: "dark",
	skrimOpacity: 0.7,
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
	children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
	const [config, setConfig] = useState<AppConfig>(defaultConfig);
	const [loading, setLoading] = useState(false);

	const updateConfig = (updates: Partial<AppConfig>) => {
		setConfig((prev) => ({ ...prev, ...updates }));
	};

	const value = {
		config,
		updateConfig,
		loading,
	};

	return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
	const context = useContext(ConfigContext);
	if (context === undefined) {
		throw new Error("useConfig must be used within a ConfigProvider");
	}
	return context;
}
