"use strict"

const [, , error] = ["off", "warn", "error"]

module.exports = {
  extends: ["./node_modules/ts-standardx/.eslintrc.js"],
  ignorePatterns: ["dist"],
  rules: {
    "no-unused-vars": [
      error,
      {
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }
    ],
    quotes: [error, "double"],

    "prettier/prettier": [
      error,
      {
        semi: false,
        singleQuote: false,
        trailingComma: "none",
        bracketSameLine: true,
        arrowParens: "avoid"
      }
    ]
  },
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/quotes": [error, "double"]
      }
    }
  ]
}
