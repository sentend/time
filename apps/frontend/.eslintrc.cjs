module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"plugin:storybook/recommended",
		"plugin:@tanstack/eslint-plugin-query/recommended",
		"@feature-sliced/eslint-config/rules/public-api",
		"@feature-sliced/eslint-config/rules/layers-slices",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh", "@tanstack/query"],
	rules: {
		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		"@tanstack/query/exhaustive-deps": "error",
		"@tanstack/query/prefer-query-object-syntax": "error",
		"@typescript-eslint/no-unused-vars": "warn",
	},
};
