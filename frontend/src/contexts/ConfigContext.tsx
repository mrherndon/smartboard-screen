import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
	AppConfig,
	ComponentConfig,
	ClockConfig,
	MessageConfig,
	CountdownTimerConfig,
	DEFAULT_CONFIG,
} from "../../../shared/src/types";
import { configStorage } from "../utils/configStorage";

type ComponentName = keyof AppConfig["components"];

interface ConfigContextType {
	config: AppConfig;
	updateConfig: (updates: Partial<AppConfig>) => void;
	updateComponent: (name: ComponentName, updates: Partial<ComponentConfig | ClockConfig>) => void;
	updateClock: (updates: Partial<ClockConfig>) => void; // Keep for convenience
	updateMessage: (updates: Partial<MessageConfig>) => void;
	updateCountdownTimer: (updates: Partial<CountdownTimerConfig>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
	const [config, setConfig] = useState<AppConfig>(() => {
		// Try to load from localStorage first
		if (configStorage.isAvailable()) {
			const stored = configStorage.load();
			if (stored) {
				return stored;
			}
		}

		// Fall back to default config
		return {
			id: "user-default",
			userId: "guest",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			...DEFAULT_CONFIG,
		};
	});

	// Save to localStorage whenever config changes
	useEffect(() => {
		if (configStorage.isAvailable()) {
			configStorage.save(config);
		}
	}, [config]);

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

	const updateMessage = (updates: Partial<MessageConfig>) => {
		updateComponent("message", updates);
	};

	const updateCountdownTimer = (updates: Partial<CountdownTimerConfig>) => {
		updateComponent("countdownTimer", updates);
	};

	return (
		<ConfigContext.Provider
			value={{
				config,
				updateConfig,
				updateComponent,
				updateClock,
				updateMessage,
				updateCountdownTimer,
			}}
		>
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
