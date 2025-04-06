/**
 * Type-level extraction of route params from a shape string. It recursively goes through each
 * segment:
 *
 * - If a segment is like ":param", then it adds { param: string }.
 * - If a segment is exactly "**", then it adds { rest: string[] }.
 */
export type ExtractRouteParams<S extends string> = S extends `/${infer Segment}/${infer Rest}`
  ? (Segment extends `:${infer Param}`
      ? { [K in Param]: string }
      : Segment extends '**'
        ? { rest: string[] }
        : {}) &
      ExtractRouteParams<`/${Rest}`>
  : S extends `/${infer Segment}`
    ? Segment extends `:${infer Param}`
      ? { [K in Param]: string }
      : Segment extends '**'
        ? { rest: string[] }
        : {}
    : {}
