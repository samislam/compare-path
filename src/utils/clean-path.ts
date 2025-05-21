/**
 * Cleans a URL path by:
 *
 * - Trimming leading and trailing whitespace
 * - Removing leading and trailing slashes
 * - Replacing multiple consecutive slashes with a single slash
 *
 * @param path - The raw path string (e.g., '///users//1///')
 * @returns The cleaned path (e.g., 'users/1')
 */
export const cleanPath = (path: string): string =>
  path
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/{2,}/g, '/')
