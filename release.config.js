/**
 * @type {import("semantic-release").GlobalConfig}
 */
export default {
	branches: [
		"+([0-9])?(.{+([0-9]),x}).x",
		"master",
		"main",
		"next",
		"next-major",
		{ name: "beta", prerelease: true },
		{ name: "alpha", prerelease: true },
		{ name: "canary", prerelease: true }
	],
	plugins: [
		[
			"@semantic-release/commit-analyzer",
			{
				preset: "conventionalcommits"
			}
		],
		[
			"@semantic-release/release-notes-generator",
			{
				preset: "conventionalcommits"
			}
		],
		"@semantic-release/npm",
		"@semantic-release/github"
	]
};
