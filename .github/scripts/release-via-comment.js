// @ts-check

/**
 * @typedef {import("@actions/github/lib/context").Context} Context
 * @typedef {import("@actions/core")} Core
 * @typedef {import("@actions/exec")} Exec
 * @typedef {ReturnType<import("@actions/github").getOctokit>} Octokit
 * @typedef {Awaited<ReturnType<Octokit["rest"]["pulls"]["get"]>>["data"]} PullRequest
 * @typedef {import("@octokit/types")
 * 	.Endpoints["GET /repos/{owner}/{repo}/rules/branches/{branch}"]["response"]
 * } BranchRules
 * @typedef {NonNullable<
 * 	Parameters<Octokit["rest"]["reactions"]["createForIssue"]>[0]>["content"]
 * } Reaction
 */

/**
 * @typedef ScriptProps
 * @property {Context} context
 * @property {Core} core
 * @property {Exec} exec
 * @property {Octokit} github
 */

const releaseBranch = "main";
const prereleaseBranch = "canary";

let execLogs = "";

/**
 * @type {import("@actions/exec").ExecOptions}
 */
const execOptions = {
	listeners: {
		stdout: (data) => {
			execLogs += data.toString();
		},
		stderr: (data) => {
			execLogs += data.toString();
		}
	}
};

/**
 * @param {(args: string[]) => Promise<number>} execGit
 * @param {object} props
 * @param {PullRequest} props.pr
 */
const fastForward = async (execGit, { pr }) => {
	const {
		USER_NAME = "github-actions[bot]",
		USER_EMAIL = "github-actions[bot]@users.noreply.github.com"
	} = process.env;

	const isDownstream =
		pr.base.repo.fork &&
		pr.head.repo != null &&
		pr.base.repo.clone_url !== pr.head.repo.clone_url;

	// prefix head branch name with `origin/` which ensures branch names
	// containing `/` work properly
	const headOriginRef = pr.head.ref.startsWith("origin/")
		? pr.head.ref
		: `origin/${pr.head.ref}`;

	await execGit(["config", "--local", "user.name", USER_NAME]);
	await execGit(["config", "--local", "user.email", USER_EMAIL]);
	await execGit(["fetch", "--all"]);
	await execGit(["checkout", pr.base.ref]);
	await execGit(["fetch", ".", `${headOriginRef}:${pr.head.ref}`]);

	if (isDownstream) {
		console.log(
			`Pulling & merging changes from downstream fork ${pr.head.repo?.clone_url}#${pr.head.label}`
		);

		await execGit([
			"pull",
			"--ff-only",
			pr.head.repo?.clone_url || "<unknown head>",
			pr.head.ref
		]);
	} else {
		await execGit(["merge", "--ff-only", headOriginRef]);
	}

	await execGit(["push", "origin", `${pr.base.ref}`]);
};

/**
 *
 * @param {object} props
 * @param {Context} props.context
 * @param {Octokit} props.github
 * @param {PullRequest} props.pr
 * @returns {Promise<{ isOk: boolean, message: string }>}
 */
const verifyCheckSuccess = async ({ context, github, pr }) => {
	console.log(
		`Verifying checks (current workflow run: ${context.runId} #${context.runNumber})`
	);

	const scope = {
		owner: pr.base.repo.owner.login,
		repo: pr.base.repo.name
	};

	const ref = pr.head.sha;

	// get the current check suite ID so we can exclude it below, or the current
	// workflow run considers itself a pending check and the process will fail
	const {
		data: { check_suite_id: currentCheckSuiteId }
	} = await github.rest.actions.getWorkflowRun({
		...scope,
		run_id: context.runId
	});

	if (currentCheckSuiteId != null) {
		console.log(`Current workflow is check suite ID ${currentCheckSuiteId}`);
	}

	const {
		data: { check_suites: checkSuites }
	} = await github.rest.checks.listSuitesForRef({ ...scope, ref });

	// if `latest_check_runs_count == 0`, the suite does not apply

	const pending = checkSuites.filter(
		({ latest_check_runs_count: count, id, status }) =>
			count > 0 && status !== "completed" && id !== currentCheckSuiteId
	);

	if (pending.length > 0) {
		const jsonSummary = formatSummary(JSON.stringify(pending, undefined, "\t"));
		return {
			isOk: false,
			message: `
while workflows for \`${pr.head.label}\` are still in progress.

${jsonSummary}
`.trim()
		};
	}

	/**
	 * @type {BranchRules}
	 */
	const { data: branchRules } = await github.rest.repos.getBranchRules({
		...scope,
		branch: pr.base.ref
	});

	console.log(
		`Branch rules:\n\n${JSON.stringify(branchRules, undefined, "\t")}`
	);

	const foundChecks = branchRules.find(
		({ type }) => type === "required_status_checks"
	);

	const requiredStatusChecks =
		foundChecks?.type === "required_status_checks"
			? (foundChecks.parameters?.required_status_checks ?? [])
			: [];

	const requiredChecksResults = await Promise.all(
		requiredStatusChecks.map(({ context: checkName }) =>
			github.rest.checks.listForRef({
				...scope,
				ref,
				check_name: checkName
			})
		)
	);

	const checkRuns = requiredChecksResults.flatMap(
		({ data: { check_runs: checkRuns } }) => checkRuns
	);

	for (const { name, status, conclusion } of checkRuns) {
		if (status !== "completed" || conclusion !== "success") {
			console.log(`Check failed: ${name}`);

			return {
				isOk: false,
				message: `because required status check \`${name}\` did not succeed.`
			};
		}

		console.log(`Check passed: ${name}`);
	}

	return {
		isOk: true,
		message: ""
	};
};

/**
 *
 * @param {object} props
 * @param {PullRequest} props.pr
 * @returns
 */
const getIsMergeAllowed = async ({ pr }) => {
	if (pr.base.ref === releaseBranch) {
		// merging into `origin/main` is only allowed from `origin/canary`
		return (
			pr.head.repo?.clone_url === pr.base.repo.clone_url &&
			pr.head.ref === prereleaseBranch
		);
	}

	if (pr.base.ref === prereleaseBranch) {
		// merging into `origin/canary` is allowed from pretty much anywhere,
		// except from `origin/main`
		return pr.head.ref !== releaseBranch;
	}

	return false;
};

/**
 * @param {object} props
 * @param {Context} props.context
 * @param {Octokit} props.github
 * @param {Reaction} props.reaction
 * @returns {Promise<number | undefined>}
 */
const reactToComment = async ({ context, github, reaction }) => {
	if (context.payload.comment == null) {
		return;
	}

	try {
		const {
			data: { id }
		} = await github.rest.reactions.createForIssueComment({
			owner: context.repo.owner,
			repo: context.repo.repo,
			comment_id: context.payload.comment.id,
			content: reaction
		});

		return id;
	} catch {
		// disregard; we don't actually care much if this fails
	}
};

/**
 *
 * @param {Octokit} github
 * @param {{ owner: string, repo: string }} scope
 * @param {number} pullNumber
 * @returns {(body: string) => any}
 */
const createAddComment = (github, scope, pullNumber) => (body) =>
	github.rest.issues.createComment({
		...scope,
		issue_number: pullNumber,
		body: `<!-- ffrelease -->\n${body.trim()}`
	});

/**
 *
 * @param {string} message
 * @param {string} [title]
 * @returns
 */
const formatSummary = (message, title = "expand for details") =>
	`<details>
<summary>${title}</summary>

\`\`\`
${message}
\`\`\`
</details>`;

/**
 * @param {ScriptProps} props
 * @returns
 */
export const releaseViaComment = async ({ context, core, exec, github }) => {
	console.log(
		`Merging commits for release from ${context.repo.owner}/${context.repo.repo}#${context.issue.number}`
	);

	const beginReactionId = await reactToComment({
		context,
		github,
		reaction: "eyes"
	});

	const scope = {
		owner: context.repo.owner,
		repo: context.repo.repo
	};

	const { data: pr } = await github.rest.pulls.get({
		...scope,
		pull_number: context.issue.number
	});

	console.log(`Found associated pull request #${pr.number} ${pr.title}`);

	const addComment = createAddComment(github, scope, pr.number);

	if (pr.state !== "open" || pr.draft) {
		await addComment(`
❌ This pull request cannot be merged while it is closed or marked as a draft.
`);

		core.setFailed("Pull request is not in a merge-ready state.");
		return;
	}

	const isMergeAllowed = await getIsMergeAllowed({ pr });

	if (!isMergeAllowed) {
		await addComment(`
❌ A release cannot be triggered from \`${pr.head.label}\` → \`${pr.base.label}\`. You may only only trigger a release when:

* merging \`${prereleaseBranch}\` → \`${releaseBranch}\`
* merging a branch (e.g., \`feat/add-rule\`) → \`${prereleaseBranch}\`
* merging from a branch in a downstream fork → \`${prereleaseBranch}\`
`);

		core.setFailed(
			`Pull request base/head combination is invalid, got base '${pr.base.label}' and head '${pr.head.label}'`
		);

		return;
	}

	if (!pr.mergeable || !pr.merge_commit_sha) {
		await addComment(`
❌ This pull request cannot be merged. Please fix any conflicts, check logs, and try again.
`);

		core.setFailed("Pull request is not mergeable.");
		return;
	}

	const { isOk, message } = await verifyCheckSuccess({ context, github, pr });

	if (!isOk) {
		await addComment(`
❌ This pull request cannot be merged ${message}
`);

		core.setFailed(`Cannot merge ${message}`);
		return;
	}

	try {
		/**
		 * @param {string[]} args
		 * @returns {Promise<number>}
		 */
		const execGit = (args) => exec.exec("git", args, execOptions);

		await fastForward(execGit, {
			pr
		});

		try {
			if (context.payload.comment != null && beginReactionId != null) {
				await github.rest.reactions.deleteForIssueComment({
					...scope,
					comment_id: context.payload.comment.id,
					reaction_id: beginReactionId
				});
			}

			await reactToComment({ context, github, reaction: "rocket" });
		} catch {
			// disregard; we don't actually care much if this fails
		}
	} catch (error) {
		console.error(error);
		core.setFailed(execLogs);

		await addComment(`
❌ Fast-forward merge attempt was made, but it failed.

${formatSummary(execLogs)}
`);
	}
};
