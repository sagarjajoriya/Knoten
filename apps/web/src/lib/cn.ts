type ClassValue = string | false | null | undefined;

/**
 * Minimal class-name joiner. Filters out falsy values so conditional classes
 * read cleanly at call sites (`cn(base, isActive && activeClass)`).
 */
export function cn(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(' ');
}
