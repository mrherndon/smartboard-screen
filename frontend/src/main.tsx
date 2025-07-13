import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import "./styles/globals.css";

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			cacheTime: 1000 * 60 * 10, // 10 minutes
			retry: 2,
			refetchOnWindowFocus: false,
		},
	},
});

// Remove loading screen
const loadingElement = document.getElementById("loading");
if (loadingElement) {
	loadingElement.remove();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<ConfigProvider>
						<App />
						<Toaster
							position="top-right"
							toastOptions={{
								duration: 4000,
								style: {
									background: "rgba(0, 0, 0, 0.8)",
									color: "#fff",
									backdropFilter: "blur(10px)",
								},
							}}
						/>
						{import.meta.env.VITE_ENABLE_DEVTOOLS === "true" && <ReactQueryDevtools initialIsOpen={false} />}
					</ConfigProvider>
				</AuthProvider>
			</QueryClientProvider>
		</BrowserRouter>
	</React.StrictMode>
);
