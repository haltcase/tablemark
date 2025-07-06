import { resolve } from "node:path";

const snapshotDirectory = resolve(import.meta.dirname, "__snapshots__");

export const snapshotFile = (
	fileName: string,
	extension: `.${string}` = ".md"
): string => resolve(snapshotDirectory, `${fileName}${extension}`);
