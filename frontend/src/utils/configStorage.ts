import { AppConfig } from "../../../shared/src/types";

const STORAGE_KEY = "smartboard-config";

export const configStorage = {
	save: (config: AppConfig) => {
		try {
			const configToSave = {
				...config,
				updatedAt: new Date().toISOString(),
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
		} catch (error) {
			console.warn("Failed to save config to localStorage:", error);
		}
	},

	load: (): AppConfig | null => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) return null;

			const parsed = JSON.parse(stored);
			// Basic validation - ensure it has the required structure
			if (parsed && typeof parsed === "object" && parsed.id && parsed.components) {
				return parsed as AppConfig;
			}
		} catch (error) {
			console.warn("Failed to load config from localStorage:", error);
		}
		return null;
	},

	clear: () => {
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.warn("Failed to clear config from localStorage:", error);
		}
	},

	// Check if localStorage is available (useful for SSR environments)
	isAvailable: (): boolean => {
		try {
			const test = "__localStorage_test__";
			localStorage.setItem(test, test);
			localStorage.removeItem(test);
			return true;
		} catch {
			return false;
		}
	},
};
