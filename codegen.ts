import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "http://localhost:3006/graphql",
	documents: ["src/**/*.{ts,tsx}"],
	generates: {
		"./src/common/gql/": {
			preset: "client",
			presetConfig: {
				gqlTagName: "gql",
			},
		},
	},
};
export default config;
