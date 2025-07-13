import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		host: true,
	},
	build: {
		outDir: "dist",
		sourcemap: true,
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"@shared": resolve(__dirname, "../shared/src"),
		},
	},
});
