// Date formatting utility using simple patterns
// Based on common date format patterns

export const formatDate = (date: Date, pattern: string): string => {
	const patterns: Record<string, string> = {
		// Year
		yyyy: date.getFullYear().toString(),
		yy: date.getFullYear().toString().slice(-2),

		// Month
		MMMM: date.toLocaleDateString("en-US", { month: "long" }),
		MMM: date.toLocaleDateString("en-US", { month: "short" }),
		MM: (date.getMonth() + 1).toString().padStart(2, "0"),
		M: (date.getMonth() + 1).toString(),

		// Day
		dd: date.getDate().toString().padStart(2, "0"),
		d: date.getDate().toString(),

		// Day of week
		EEEE: date.toLocaleDateString("en-US", { weekday: "long" }),
		EEE: date.toLocaleDateString("en-US", { weekday: "short" }),
		E: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
	};

	let result = pattern;

	// Replace patterns in order of longest first to avoid conflicts
	// Use word boundaries to prevent partial matches
	const sortedPatterns = Object.keys(patterns).sort((a, b) => b.length - a.length);

	for (const patternKey of sortedPatterns) {
		// Create a regex that matches the pattern but not as part of a longer word
		const regex = new RegExp(`(?<![A-Za-z])${patternKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z])`, "g");
		result = result.replace(regex, patterns[patternKey]);
	}

	return result;
};

export const DATE_FORMAT_EXAMPLES = [
	{ pattern: "EEEE, MMMM d", example: "Monday, January 15" },
	{ pattern: "MMM d, yyyy", example: "Jan 15, 2024" },
	{ pattern: "M/d/yyyy", example: "1/15/2024" },
	{ pattern: "dd/MM/yyyy", example: "15/01/2024" },
	{ pattern: "EEEE", example: "Monday" },
	{ pattern: "EEE, MMM d", example: "Mon, Jan 15" },
	{ pattern: "MMMM d, yyyy", example: "January 15, 2024" },
	{ pattern: "d MMM yyyy", example: "15 Jan 2024" },
];
