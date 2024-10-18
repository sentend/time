/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

module.exports = {
	darkMode: ["class"],
	content: [
		"./src/app/**/*.{ts,tsx}",
		"./src/pages/**/*.{ts,tsx}",
		"./src/widgets/**/*.{ts,tsx}",
		"./src/features/**/*.{ts,tsx}",
		"./src/entities/**/*.{ts,tsx}",
		"./src/shared/ui/**/*.{ts,tsx}",
		"./src/shared/config/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},

		extend: {
			gridTemplateColumns: {
				auto: "auto 1fr",
			},
			width: {
				sidebar: "185px",
				dialog: "760px",
			},
			maxWidth: {
				dialog: "760px",
			},
			fontFamily: {
				sans: ["Inter"],
			},
			fontSize: {
				xs: ["10px", "16px"],
				sm: ["12px", "18px"],
				base: ["14px", "20px"],
				md: ["16px", "22px"],
			},
			colors: {
				main: "#FAFAFA",
				"tm-color-0": "#B348E9",
				"tm-color-1": "#E12392",
				"tm-color-2": "#EB1753",
				"tm-color-3": "#FF9500",
				"tm-color-4": "#FFCC00",
				"tm-color-5": "#28CD5F",
				"tm-color-6": "#55BEF0",
				"tm-color-7": "#008CF6",
				"tm-color-8": "#605EEA",
				"tm-color-9": "#B385F8",
				"tm-color-10": "#FF73C4",
				"tm-color-11": "#FF8084",
				"tm-color-12": "#A2845E",
				"tm-color-13": "#9CD824",
				"tm-color-14": "#39E68C",
				"tm-color-15": "#2BCAD0",
				"tm-color-16": "#7FC8EC",
				"tm-color-17": "#7D8EFA",
				"gray-4": "#EBEBEB",
				"gray-6": "#0000000F",
				"gray-10": "#0000001A",
				"gray-20": "#00000033",
				"gray-30": "#0000004D",
				"gray-50": "#00000080",
				"gray-70": "#000000B3",
				"gray-90": "#000000E5",
				"accent-1": "#00E4E4",
				primary: "#000000E5",
				"semi-primary": "#000000A6",
				secondary: "#00000080",
				tertiary: "#00000042",
				quaternary: "#0000001F",
				"global-green": "#14AD4D",

				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",

				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
