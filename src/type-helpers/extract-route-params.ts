/**
 * Type-level extraction of route parameters from a path shape string.
 *
 * Supports:
 *
 * - `:param` for dynamic segments (e.g., /user/:id)
 * - `[param]` for dynamic segments (e.g., /user/[id])
 * - `**` wildcard for catch-all segments (e.g., /files/**)
 *
 * Returns a mapped type of parameters with `string` values or `{ rest: string[] }` for wildcards.
 */
export type ExtractRouteParams<S extends string> = S extends `/${infer Segment}/${infer Rest}`
  ? (Segment extends `:${infer Param}` | `[${infer Param}]`
      ? { [K in Param]: string }
      : Segment extends '**'
        ? { rest: string[] }
        : {}) &
      ExtractRouteParams<`/${Rest}`>
  : S extends `/${infer Segment}`
    ? Segment extends `:${infer Param}` | `[${infer Param}]`
      ? { [K in Param]: string }
      : Segment extends '**'
        ? { rest: string[] }
        : {}
    : {}
