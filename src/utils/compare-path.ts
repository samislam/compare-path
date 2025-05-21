import { cleanPath } from './clean-path'
import { ExtractRouteParams } from '../type-helpers/extract-route-params'

/**
 * Compares a given URL path to a defined shape and extracts matching parameters.
 *
 * Supports:
 *
 * - Dynamic segments via `:param` or `[param]`
 * - Catch-all segments via `**`
 *
 * @example
 *   comparePath('/users/:id', '/users/123') // [true, { id: '123' }]
 *   comparePath('/docs/**', '/docs/foo/bar') // [true, { rest: ['foo', 'bar'] }]
 *
 * @template T - Route shape string (e.g., '/users/:id' or '/users/[id]')
 * @template U - Actual URL path string to compare
 * @param shape - The route definition with dynamic/wildcard segments
 * @param path - The current URL path to match against the shape
 * @returns A tuple:
 *
 *   - [true, params] if the path matches, with extracted parameters
 *   - [false, null] if the path does not match
 */
export function comparePath<T extends string, U extends string>(
  shape: T,
  path: U
): [true, ExtractRouteParams<T>] | [false, null] {
  const cleanedShape = cleanPath(shape)
  const cleanedPath = cleanPath(path)

  const shapeParts = cleanedShape.split('/')
  const pathParts = cleanedPath.split('/')

  let params: Record<string, any> = {}

  const wildcardIndex = shapeParts.indexOf('**')

  /** Checks if a segment is a dynamic param (either :param or [param]) */
  const isParam = (segment: string): boolean =>
    segment.startsWith(':') || (segment.startsWith('[') && segment.endsWith(']'))

  /**
   * Extracts the param name from a segment
   *
   * @example
   *   ':id' -> 'id', '[id]' -> 'id'
   */
  const extractParamName = (segment: string): string =>
    segment.startsWith(':') ? segment.slice(1) : segment.slice(1, -1)

  if (wildcardIndex === -1) {
    if (shapeParts.length !== pathParts.length) return [false, null]

    for (let i = 0; i < shapeParts.length; i++) {
      const shapeSegment = shapeParts[i]
      const pathSegment = pathParts[i]

      if (isParam(shapeSegment)) {
        const paramName = extractParamName(shapeSegment)
        params[paramName] = pathSegment
      } else if (shapeSegment !== pathSegment) {
        return [false, null]
      }
    }

    return [true, params as ExtractRouteParams<T>]
  } else {
    const preParts = shapeParts.slice(0, wildcardIndex)
    const postParts = shapeParts.slice(wildcardIndex + 1)

    if (pathParts.length < preParts.length + postParts.length) {
      return [false, null]
    }

    for (let i = 0; i < preParts.length; i++) {
      const shapeSegment = preParts[i]
      const pathSegment = pathParts[i]
      if (isParam(shapeSegment)) {
        const paramName = extractParamName(shapeSegment)
        params[paramName] = pathSegment
      } else if (shapeSegment !== pathSegment) {
        return [false, null]
      }
    }

    for (let i = 0; i < postParts.length; i++) {
      const shapeSegment = postParts[postParts.length - 1 - i]
      const pathSegment = pathParts[pathParts.length - 1 - i]
      if (isParam(shapeSegment)) {
        const paramName = extractParamName(shapeSegment)
        params[paramName] = pathSegment
      } else if (shapeSegment !== pathSegment) {
        return [false, null]
      }
    }

    const restStart = preParts.length
    const restEnd = pathParts.length - postParts.length
    params['rest'] = pathParts.slice(restStart, restEnd)

    return [true, params as ExtractRouteParams<T>]
  }
}
