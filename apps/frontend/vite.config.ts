import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = "3000";

export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return defineConfig({
		plugins: [
			react(),
			svgr({
				exportAsDefault: false,
				svgrOptions: {
					icon: true,
				},
			}),
		],
		server: {
			host: process.env.VITE_HOST || DEFAULT_HOST,
			port: parseInt(process.env.VITE_PORT || DEFAULT_PORT),
			strictPort: true,
			proxy: {
				"/api": {
					target: `${process.env.VITE_API_URL}`,
					changeOrigin: true,
					rewrite: (path) => {
						console.log(path);
						return path.replace(/^\/api/, "");
					},
				},
			},
		},

		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"~": __dirname,
			},
		},
	});
};
