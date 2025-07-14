import { createContext, useContext, useState, ReactNode } from "react";
import { AppConfig, ComponentConfig, ClockConfig, DEFAULT_CONFIG } from "../../../shared/src/types";

type ComponentName = keyof AppConfig["components"];

interface ConfigContextType {
	config: AppConfig;
	updateConfig: (updates: Partial<AppConfig>) => void;
	updateComponent: (name: ComponentName, updates: Partial<ComponentConfig | ClockConfig>) => void;
	updateClock: (updates: Partial<ClockConfig>) => void; // Keep for convenience
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
	const [config, setConfig] = useState<AppConfig>({
		// This would eventually be loaded from a user's profile or API
		id: "user-default",
		userId: "guest",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		...DEFAULT_CONFIG,
	});

	const updateConfig = (updates: Partial<AppConfig>) => {
		setConfig((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
	};

	const updateComponent = (name: ComponentName, updates: Partial<ComponentConfig | ClockConfig>) => {
		setConfig((prev) => ({
			...prev,
			components: {
				...prev.components,
				[name]: {
					...prev.components[name],
					...updates,
				},
			},
			updatedAt: new Date().toISOString(),
		}));
	};

	// For backward compatibility and ease of use in the clock component
	const updateClock = (updates: Partial<ClockConfig>) => {
		updateComponent("clock", updates);
	};

	return (
		<ConfigContext.Provider value={{ config, updateConfig, updateComponent, updateClock }}>
			{children}
		</ConfigContext.Provider>
	);
}

export function useConfig() {
	const context = useContext(ConfigContext);
	if (!context) {
		throw new Error("useConfig must be used within a ConfigProvider");
	}
	return context;
}
