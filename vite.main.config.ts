import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
	build: {
		rollupOptions: {
			external: ["win-version-info", "node:process"],
			output: {
				externalLiveBindings: false /* incredibly important */,
			},
		},
	},
});
