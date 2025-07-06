import getAnsiRegex from "ansi-regex";

const ansiRegex = getAnsiRegex();

const splitAnsi = (string: string): string[] => {
	const parts = string.match(ansiRegex);

	if (!parts) {
		return [string];
	}

	const result = [];
	let offset = 0;
	let pointer = 0;

	for (const part of parts) {
		offset = string.indexOf(part, offset);

		if (offset === -1) {
			throw new Error("Could not split string");
		}

		if (pointer !== offset) {
			result.push(string.slice(pointer, offset));
		}

		if (pointer === offset && result.length > 0) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, unicorn/prefer-at
			result[result.length - 1]! += part;
		} else {
			if (offset === 0) {
				result.push("");
			}

			result.push(part);
		}

		pointer = offset + part.length;
	}

	result.push(string.slice(pointer));
	return result;
};

export const transformAnsiString = (
	string: string,
	transform: (string: string) => string
) =>
	splitAnsi(string)
		.map((part, index) => {
			if (index % 2 !== 0) {
				return part;
			}

			return transform(part);
		})
		.join("");
