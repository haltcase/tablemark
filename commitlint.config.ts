import type { UserConfig } from "@commitlint/types";

export default {
	extends: ["@commitlint/config-conventional"],
	// remove this if we can ever get dependabot to follow the rules
	// https://github.com/dependabot/dependabot-core/issues/2445
	ignores: [(message) => message.includes("Signed-off-by: dependabot[bot]")],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				// Change that affects the build system or dependencies
				"build",
				// Change to project metadata or tooling
				"chore",
				// Change to CI workflows
				"ci",
				// Change that only affects documentation
				"docs",
				// New feature
				"feat",
				// Bug fix
				"fix",
				// Code change that improves performance
				"perf",
				// Code change that neither fixes a bug nor adds a feature
				"refactor",
				// Commit that reverts a previous commit
				"revert",
				// Change that does not affect the meaning of the code
				"style",
				// Addition of missing tests or corrections for existing tests
				"test"
			]
		]
	}
} satisfies UserConfig;
