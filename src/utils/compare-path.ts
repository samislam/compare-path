import { cleanPath } from './clean-path'
import { ExtractRouteParams } from '../type-helpers/extract-route-params'

/**
 * The comparePath function returns either a matching tuple [true, params] or [false, null] if the
 * URL does not match the shape. The generic signature leverages the ExtractRouteParams type.
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

  // Check if shape contains a wildcard segment "**"
  const wildcardIndex = shapeParts.indexOf('**')

  if (wildcardIndex === -1) {
    // No wildcard → the segments must match in count.
    if (shapeParts.length !== pathParts.length) return [false, null]

    for (let i = 0; i < shapeParts.length; i++) {
      const shapeSegment = shapeParts[i]
      const pathSegment = pathParts[i]

      if (shapeSegment.startsWith(':')) {
        // Parameter segment: capture it.
        const paramName = shapeSegment.slice(1)
        params[paramName] = pathSegment
      } else if (shapeSegment !== pathSegment) {
        // Static segment mismatch.
        return [false, null]
      }
    }
    return [true, params as ExtractRouteParams<T>]
  } else {
    // Wildcard exists.
    // Split into pre-wildcard and post-wildcard segments.
    const preParts = shapeParts.slice(0, wildcardIndex)
    const postParts = shapeParts.slice(wildcardIndex + 1)

    // The URL must have at least as many segments as preParts + postParts.
    if (pathParts.length < preParts.length + postParts.length) {
      return [false, null]
    }

    // Match the pre-wildcard segments.
    for (let i = 0; i < preParts.length; i++) {
      const shapeSegment = preParts[i]
      const pathSegment = pathParts[i]
      if (shapeSegment.startsWith(':')) {
        const paramName = shapeSegment.slice(1)
        params[paramName] = pathSegment
      } else if (shapeSegment !== pathSegment) {
        return [false, null]
      }
    }

    // Match the post-wildcard segments from the end.
    for (let i = 0; i < postParts.length; i++) {
      const shapeSegment = postParts[postParts.length - 1 - i]
      const pathSegment = pathParts[pathParts.length - 1 - i]
      if (shapeSegment.startsWith(':')) {
        const paramName = shapeSegment.slice(1)
        params[paramName] = pathSegment
      } else if (shapeSegment !== pathSegment) {
        return [false, null]
      }
    }

    // The wildcard ("**") captures the middle segments.
    const restStart = preParts.length
    const restEnd = pathParts.length - postParts.length
    params['rest'] = pathParts.slice(restStart, restEnd)

    return [true, params as ExtractRouteParams<T>]
  }
}
