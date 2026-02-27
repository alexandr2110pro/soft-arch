# @space-arch/util-ts

TypeScript utility functions and types for Space Architects projects.

## Installation

```bash
npm install @space-arch/util-ts
# or
pnpm add @space-arch/util-ts
```

## Usage

### Type Utilities

#### `Simplify<T>`
Flattens complex intersections and mapped types for better IDE display.

```typescript
import type { Simplify } from '@space-arch/util-ts';

// Before: { name: string } & { age: number } & { city: string }
// After: { name: string; age: number; city: string }
type User = Simplify<{ name: string } & { age: number } & { city: string }>;
```

#### `SimplifyDeep<T>`
Recursively simplifies nested object types.

```typescript
import type { SimplifyDeep } from '@space-arch/util-ts';

type DeepUser = SimplifyDeep<{
  profile: { name: string } & { age: number };
  settings: { theme: string } & { lang: string };
}>;
```

#### `PropValues<T>`
Extracts all possible values from an object's properties.

```typescript
import type { PropValues } from '@space-arch/util-ts';

const Status = { ACTIVE: 'active', INACTIVE: 'inactive' } as const;
type StatusValue = PropValues<typeof Status>; // 'active' | 'inactive'
```

#### `TupleMerge<T>`
Merges all types in a tuple into a single intersection type.

```typescript
import type { TupleMerge } from '@space-arch/util-ts';

type Merged = TupleMerge<[{ a: string }, { b: number }, { c: boolean }]>;
// Result: { a: string; b: number; c: boolean }
```

#### `PropTupleFromArray<T, K>`
Extracts property values from an array of objects as a strongly-typed tuple.

```typescript
import type { PropTupleFromArray } from '@space-arch/util-ts';

const users = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
] as const;

type UserNames = PropTupleFromArray<typeof users, 'name'>; // ['Alice', 'Bob']
```

### Runtime Functions

#### `propTupleFromArray(arr, key)`
Runtime function that extracts property values from an array of objects.

```typescript
import { propTupleFromArray } from '@space-arch/util-ts';

const users = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

const names = propTupleFromArray(users, 'name'); // ['Alice', 'Bob']
const ids = propTupleFromArray(users, 'id'); // ['1', '2']
```

## Contributing

This package is part of the [Space Architects monorepo](../../README.md).
