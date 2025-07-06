import { describe, expect, test } from "vitest";

import { tablemark } from "../src/index.js";
import { snapshotFile } from "./helpers.js";

describe("column-level overrides", () => {
	test("`align`", async () => {
		const input = [
			{ name: "Bob", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(input, {
				columns: [{ align: "left" }, { align: "right" }, { align: "center" }]
			})
		).toMatchFileSnapshot(snapshotFile("column-align"));
	});

	test("`name`", async () => {
		const input = [
			{ name: "Bob", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(input, {
				columns: [{ name: "word" }, { name: "number" }, { name: "boolean" }]
			})
		).toMatchFileSnapshot(snapshotFile("column-name"));
	});

	test("`width` (with root `maxWidth`)", async () => {
		const input = [
			{ date: "2038-01-19", activity: "🤺 fencing", mood: "🙄" },
			{ date: "2038-01-19", activity: "🏈 football", mood: "🤔" },
			{ date: "2038-01-19", activity: "🎮 gaming", mood: "😎" }
		];

		await expect(
			tablemark(input, {
				maxWidth: 6,
				columns: [{ width: 20 }, { width: 16 }, { width: 12 }]
			})
		).toMatchFileSnapshot(snapshotFile("column-width-root-maxWidth"));
	});

	test("`width` (without root `maxWidth`)", async () => {
		const input = [
			{ date: "2038-01-19", activity: "🤺 fencing", mood: "🙄" },
			{ date: "2038-01-19", activity: "🏈 football", mood: "🤔" },
			{ date: "2038-01-19", activity: "🎮 gaming", mood: "😎" }
		];

		await expect(
			tablemark(input, {
				columns: [{ width: 20 }, { width: 16 }, { width: 12 }]
			})
		).toMatchFileSnapshot(snapshotFile("column-width-no-root-maxWidth"));
	});

	test("`width` with internal cell wrapping (root `overflowStrategy: 'wrap'`)", async () => {
		const input = [
			{ date: "1970-01-01 00:00:00", activity: "🤺 fencing", mood: "🙄" },
			{ date: "2000-01-01 00:00:00", activity: "🏈 football", mood: "🤔" },
			{ date: "2038-01-19 03:14:08", activity: "🎮 gaming", mood: "😎" }
		];

		await expect(
			tablemark(input, {
				overflowStrategy: "wrap",
				columns: [{ width: 12 }, { width: 16 }, { width: 12 }]
			})
		).toMatchFileSnapshot(snapshotFile("column-width-root-wrap"));
	});

	test("`width` with internal cell wrapping (column `overflowStrategy: 'wrap'`)", async () => {
		const input = [
			{ date: "1970-01-01 00:00:00", activity: "🤺 fencing", mood: "🙄" },
			{ date: "2000-01-01 00:00:00", activity: "🏈 football", mood: "🤔" },
			{ date: "2038-01-19 03:14:08", activity: "🎮 gaming", mood: "😎" }
		];

		await expect(
			tablemark(input, {
				columns: [
					{ overflowStrategy: "wrap", width: 12 },
					{ width: 16 },
					{ width: 12 }
				]
			})
		).toMatchFileSnapshot(snapshotFile("column-width-overflowStrategy-wrap"));
	});

	test("`width` with cell truncation (column `overflowStrategy: 'truncateEnd')", async () => {
		const input = [
			{ date: "1970-01-01 00:00:00", activity: "🤺 fencing", mood: "🙄" },
			{ date: "2000-01-01 00:00:00", activity: "🏈 football", mood: "🤔" },
			{ date: "2038-01-19 03:14:08", activity: "🎮 gaming", mood: "😎" }
		];

		await expect(
			tablemark(input, {
				overflowStrategy: "wrap",
				columns: [
					{ overflowStrategy: "truncateEnd", width: 12 },
					{ width: 16 },
					{ width: 12 }
				]
			})
		).toMatchFileSnapshot(
			snapshotFile("column-width-overflowStrategy-truncateEnd")
		);
	});

	test("`width` with cell truncation (column `overflowStrategy: 'truncateStart')", async () => {
		const input = [
			{ date: "1970-01-01 00:00:00", activity: "🤺 fencing", mood: "🙄" },
			{ date: "2000-01-01 00:00:00", activity: "🏈 football", mood: "🤔" },
			{ date: "2038-01-19 03:14:08", activity: "🎮 gaming", mood: "😎" }
		];

		await expect(
			tablemark(input, {
				overflowStrategy: "wrap",
				columns: [
					{ overflowStrategy: "truncateStart", width: 12 },
					{ width: 16 },
					{ width: 12 }
				]
			})
		).toMatchFileSnapshot(
			snapshotFile("column-width-overflowStrategy-truncateStart")
		);
	});

	test("`width` with header cell truncation (column `overflowHeaderStrategy: 'truncateEnd')", async () => {
		const input = [
			{
				date: "1970-01-01 00:00:00",
				activity: "🤺 fencing",
				moodDuringTheActivity: "🙄"
			},
			{
				date: "2000-01-01 00:00:00",
				activity: "🏈 football",
				moodDuringTheActivity: "🤔"
			},
			{
				date: "2038-01-19 03:14:08",
				activity: "🎮 gaming",
				moodDuringTheActivity: "😎"
			}
		];

		await expect(
			tablemark(input, {
				overflowStrategy: "wrap",
				columns: [
					{ width: 22 },
					{ width: 16 },
					{ width: 12, overflowHeaderStrategy: "truncateEnd" }
				]
			})
		).toMatchFileSnapshot(
			snapshotFile("column-width-overflowHeaderStrategy-truncateEnd")
		);
	});

	test("`width` with header cell truncation (column `overflowHeaderStrategy: 'truncateStart')", async () => {
		const input = [
			{
				date: "1970-01-01 00:00:00",
				activity: "🤺 fencing",
				moodDuringTheActivity: "🙄"
			},
			{
				date: "2000-01-01 00:00:00",
				activity: "🏈 football",
				moodDuringTheActivity: "🤔"
			},
			{
				date: "2038-01-19 03:14:08",
				activity: "🎮 gaming",
				moodDuringTheActivity: "😎"
			}
		];

		await expect(
			tablemark(input, {
				overflowStrategy: "wrap",
				columns: [
					{ width: 22 },
					{ width: 16 },
					{ width: 12, overflowHeaderStrategy: "truncateStart" }
				]
			})
		).toMatchFileSnapshot(
			snapshotFile("column-width-overflowHeaderStrategy-truncateStart")
		);
	});
});
