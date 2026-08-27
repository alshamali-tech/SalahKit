/**
 * Conditional class joiner (lib/utils/classnames.ts). Pure.
 */

/** A value that may contribute a class name. */
export type ClassValue = string | number | null | false | undefined;

/**
 * Joins truthy class fragments with single spaces.
 * @param values - Class fragments; falsy values are dropped.
 * @returns A single space-joined class string.
 */
export function cx(...values: readonly ClassValue[]): string {
  return values.filter((v): v is string | number => Boolean(v)).join(' ');
}
