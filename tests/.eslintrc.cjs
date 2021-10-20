"use strict"

const { resolve } = require("path")

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
}
