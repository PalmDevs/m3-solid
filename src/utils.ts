/**
 * Merges multiple class names into a single string, filtering out undefined/empty values.
 * @param classes - Class names to merge (can include undefined, null, false, or 0)
 * @returns A single string with all valid class names joined by spaces
 */
export function mergeClasses(
	...classes: Array<string | undefined | null | false | 0>
): string {
	return classes.filter(Boolean).join(' ')
}
