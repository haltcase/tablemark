"use strict";

const { resolve } = require("node:path");

module.exports = {
	extends: [resolve(__dirname, "../.eslintrc.cjs")],
	overrides: [
		{
			files: ["**/*.{ts,tsx}"],
			parserOptions: {
				project: resolve(__dirname, "tsconfig.json")
			}
		}
	]
};
