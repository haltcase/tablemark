// @ts-check

// oxlint-disable check-tag-names -- false positive on TSDoc import
/**
 * @import { Context } from "@actions/github/lib/context"
 * @typedef {ReturnType<import("@actions/github").getOctokit>} Octokit
 */
// oxlint-enable check-tag-names

/**
 * @param {object} props
 * @param {Context} props.context
 * @param {Octokit} props.github
 * @returns
 */
export const commentOnNewPr = async ({ context, github }) => {
	const login = context.payload.pull_request?.user.login;
	const mention = login ? `@${login}` : "there";
	const contributingUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/blob/-/CONTRIBUTING.md`;

	const isMaintainer =
		login === "dependabot[bot]" ||
		["OWNER", "MEMBER", "COLLABORATOR"].includes(
			context.payload.pull_request?.author_association
		);

	const greeting = isMaintainer
		? `Thanks for your contribution.`
		: `Hey ${mention}, thanks for contributing!`;

	await github.rest.issues.createComment({
		owner: context.repo.owner,
		repo: context.repo.repo,
		issue_number: context.issue.number,
		body: `
${greeting} If you haven't read the contributing \
guide that outlines the process, you can do so [here](${contributingUrl}).

Maintainers: once checks have passed, comment \`!release this\` and I'll begin \
merging this for you.
`.trim()
	});
};
