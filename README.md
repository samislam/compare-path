# 🛣️ compare-path

An easy-to-use TypeScript utility to determine if two URL paths match based on a route shape pattern. Supports route parameters like `:id` and `[id]`, plus catch-all wildcards (`**`, `[...slug]`) for flexible path matching.

## ✨ Features

🔍 Match dynamic segments like `/user/:id` and `/user/[id]`
🌟 Support for catch-all segments with `**` and `[...slug]` (e.g., `/docs/**/edit`, `/docs/[...slug]`)
🧼 Automatic path normalization (//foo//bar/ → foo/bar)
💡 Type-safe route parameter extraction using TypeScript
📦 Tiny and framework-agnostic

# 📦 Installation

With **npm**

```sh
npm install compare-path
```

Or with **yarn**:

```sh
yarn add compare-path
```

Or with **pnpm**:

```sh
pnpm add compare-path
```

Or with **bun**

```sh
bun add compare-path
```

# 🧠 Usage

```ts
import { comparePath } from 'compare-path'

const [matched, params] = comparePath('/user/:id', '/user/42')

if (matched) {
  console.log('Matched!', params) // { id: '42' }
} else {
  console.log('Not matched.')
}
```

Bracket param syntax works too:

```ts
const [matched, params] = comparePath('/user/[id]', '/user/42')
// matched: true
// params: { id: '42' }
```

# Wildcard Example

```ts
const [matched, params] = comparePath('/docs/**/edit', '/docs/api/v1/intro/edit')

if (matched) {
  console.log(params.rest) // ['api', 'v1', 'intro']
}
```

Named catch-all syntax is supported too:

```ts
const [matched, params] = comparePath('/docs/[...slug]', '/docs/api/v1/intro')
// matched: true
// params: { slug: ['api', 'v1', 'intro'] }
```

# 🧼 Path Cleaning

Paths are automatically cleaned:

```ts
cleanPath('///foo//bar///') // → 'foo/bar'
```

# 🧩 Type Safety

Leverages TypeScript to infer expected route parameters from the shape:

```ts
const [matched, params] = comparePath('/post/:postId/comment/:commentId', '/post/123/comment/456')
// params: { postId: string; commentId: string }
```

# 📚 API

### `comparePath<T extends string, U extends string>(shape: T, path: U)`

Returns:

- `[true, ExtractRouteParams<T>]` // if matched
- [false, null] // if not matched

Supported shape syntax:

- Dynamic segment: `:id` or `[id]`
- Catch-all segment: `**` (returned as `params.rest`) or `[...slug]` (returned as `params.slug`)

### `cleanPath(path: string): string`

Cleans a path by:

- Trimming whitespace.
- Removing leading/trailing slashes.
- Collapsing multiple slashes.

# 🔧 Type Helpers

### `ExtractRouteParams<Shape>`

Infers the expected parameter names and types from a given shape string at compile time.

# 🧪 Example Matches

| Shape                | Path                    | Params Result                            |
| -------------------- | ----------------------- | ---------------------------------------- |
| /user/:id            | /user/42                | { id: '42' }                             |
| /user/[id]           | /user/42                | { id: '42' }                             |
| /docs/\*\*/edit      | /docs/api/v1/intro/edit | { rest: ['api', 'v1', 'intro'] }         |
| /docs/[...slug]      | /docs/api/v1/intro      | { slug: ['api', 'v1', 'intro'] }         |
| /a/:x/\*\*/b/:y      | /a/1/foo/bar/b/2        | { x: '1', y: '2', rest: ['foo', 'bar'] } |
| /a/:x/[...slug]/b/:y | /a/1/foo/bar/b/2        | { x: '1', slug: ['foo', 'bar'], y: '2' } |

# 📝 License

MIT — feel free to use, contribute, and share.
