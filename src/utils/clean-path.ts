/**
 * Remove any leading/trailing whitespace and slashes adn remove multiple consecutive slashes (/)
 * anywhere in the path.
 */
export const cleanPath = (path: string): string =>
  path
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/{2,}/g, '/')
