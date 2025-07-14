// Modern ESLint config for React + TypeScript (ESLint v9+)
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
	js.config({
		extends: ["eslint:recommended"],
	}),
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: "./tsconfig.json",
				sourceType: "module",
				ecmaVersion: 2020,
				ecmaFeatures: { jsx: true },
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
		},
		rules: {
			...tseslint.configs.recommended.rules,
			...tseslint.configs["recommended-type-checked"].rules,
		},
	},
	{
		files: ["**/*.tsx", "**/*.jsx"],
		rules: {
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
		},
		plugins: {
			"react-hooks": require.resolve("eslint-plugin-react-hooks"),
		},
	},
];
