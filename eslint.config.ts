import { getEslintConfig } from "@haltcase/style/eslint";
import oxlint from "eslint-plugin-oxlint";

export default [
	{
		ignores: ["dist", "tests/__snapshots__"]
	},

	...getEslintConfig({
		nextjs: true,
		node: true,
		typescriptProject: ["tsconfig.json", "tests/tsconfig.json"]
	}),

	...oxlint.configs["flat/recommended"]
];
