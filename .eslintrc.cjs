"use strict";

const { resolve } = require("node:path");

const project = [
	resolve(__dirname, "tsconfig.json"),
	resolve(__dirname, "./tests/tsconfig.json")
];

module.exports = {
	env: {
		node: true,
		es2023: true
	},
	extends: [
		require.resolve("@haltcase/style/eslint/node"),
		require.resolve("@haltcase/style/eslint/typescript")
	],
	parserOptions: {
		ecmaVersion: 2023,
		project: true
	},
	settings: {
		"import/resolver": {
			typescript: {
				project
			}
		}
	}
};
