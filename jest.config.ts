const config = {
	roots: ["<rootDir>/src"],
	collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
	setupFiles: ["whatwg-fetch"],
	setupFilesAfterEnv: ["<rootDir>/src/content/setupTests.ts"],
	testMatch: [
		"<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
		"<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
	],
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
		"^.+\\.(js|jsx|mjs|cjs)$": "<rootDir>/config/jest/babelTransform.js",
		"^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
		"^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
			"<rootDir>/config/jest/fileTransform.js",
	},
	transformIgnorePatterns: [
		"/node_modules/(?!(chalk|ansi-styles|axios|@bundled-es-modules|node-fetch|data-uri-to-buffer|fetch-blob))",
		"^.+\\.module\\.(css|sass|scss)$",
	],
	modulePaths: [],
	moduleNameMapper: {
		"^react-native$": "react-native-web",
		"^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	moduleFileExtensions: [
		"web.js",
		"js",
		"web.ts",
		"ts",
		"web.tsx",
		"tsx",
		"json",
		"web.jsx",
		"jsx",
		"node",
	],
	// watchPlugins: [
	// 	"jest-watch-typeahead/filename",
	// 	"jest-watch-typeahead/testname",
	// ],
	resetMocks: true,
};
export default config;
