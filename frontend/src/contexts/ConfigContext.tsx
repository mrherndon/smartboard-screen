import { createContext, useContext, useState, ReactNode } from "react";

interface ClockConfig {
	active: boolean;
	type: "analog" | "digital";
	showDate: boolean;
	position: { x: number; y: number };
	size: { width: number; height: number };
}

interface AppConfig {
	backgroundImageUrl?: string;
	clock: ClockConfig;
}

interface ConfigContextType {
	config: AppConfig;
	updateConfig: (updates: Partial<AppConfig>) => void;
	updateClock: (updates: Partial<ClockConfig>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
	const [config, setConfig] = useState<AppConfig>({
		backgroundImageUrl: "/backgrounds/default.jpg",
		clock: {
			active: true,
			type: "analog",
			showDate: true,
			position: { x: 50, y: 50 }, // Center by default (percentage)
			size: { width: 200, height: 200 },
		},
	});

	const updateConfig = (updates: Partial<AppConfig>) => {
		setConfig((prev) => ({ ...prev, ...updates }));
	};

	const updateClock = (updates: Partial<ClockConfig>) => {
		setConfig((prev) => ({
			...prev,
			clock: { ...prev.clock, ...updates },
		}));
	};

	return <ConfigContext.Provider value={{ config, updateConfig, updateClock }}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
	const context = useContext(ConfigContext);
	if (!context) {
		throw new Error("useConfig must be used within a ConfigProvider");
	}
	return context;
}
