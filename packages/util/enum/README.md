# @space-arch/util-enum

A comprehensive TypeScript utility library for creating, manipulating, and working with enum-like objects. This package provides type-safe utilities for common enum operations with full TypeScript support.

## Installation

```bash
npm install @space-arch/util-enum
# or
pnpm add @space-arch/util-enum
# or
yarn add @space-arch/util-enum
```

## Features

- 🔒 **Type-safe**: Full TypeScript support with strict typing
- 🚀 **Zero dependencies**: Lightweight with minimal footprint (depends only on `@space-arch/util-ts`)
- 📦 **Tree-shakable**: Import only what you need
- 🎯 **Focused**: Specialized utilities for enum-like operations
- 🧪 **Well-tested**: Comprehensive test coverage
- ❄️ **Immutable**: All enum objects are frozen with `Object.freeze()` for runtime safety

## Overview

```typescript
const ACTIONS = enumObject(['WRITE', 'READ']);
// ^? Readonly<{ WRITE: 'WRITE', READ: 'READ' }>

const VIEWER_ACTIONS = enumPick(ACTIONS, ['READ']);
// ^? Readonly<{ READ: 'READ' }>

const USER_READ_ACTIONS = enumPrefixed('USER', enumValues(VIEWER_ACTIONS));
// ^? Readonly<{ USER_READ: 'USER/READ' }>
const POST_READ_ACTIONS = enumPrefixed('POST', enumValues(VIEWER_ACTIONS));
const COMMENT_READ_ACTIONS = enumPrefixed(
  'COMMENT',
  enumValues(VIEWER_ACTIONS),
);

const VIEWER_PERMISSIONS = enumSuiteObject(
  enumMerge(USER_READ_ACTIONS, COMMENT_READ_ACTIONS, POST_READ_ACTIONS),
);

type ViewerPermission = typeof VIEWER_PERMISSIONS.$type;
// ^? [ 'USER/READ', 'COMMENT/READ', 'POST/READ' ]

assert.equal(VIEWER_PERMISSIONS.enum, {
  COMMENT_READ: 'COMMENT/READ',
  POST_READ: 'POST/READ',
  USER_READ: 'USER/READ',
});
assert.equal(VIEWER_PERMISSIONS.values, [
  'USER/READ',
  'COMMENT/READ',
  'POST/READ',
]);

// typesafe checks
const maybePermission = 'smth' as string;

if (VIEWER_PERMISSIONS.hasValue(maybePermission)) {
  switch (maybePermission) {
    case VIEWER_PERMISSIONS.enum.COMMENT_READ:
      // do something
      break;
    case VIEWER_PERMISSIONS.enum.POST_READ:
      // do something
      break;
    case VIEWER_PERMISSIONS.enum.USER_READ:
      // do something
      break;

    default:
      throw new Error('should not happen', {
        // exhaustiveness check
        cause: maybePermission satisfies never,
      });
  }
}
```

## API Reference

### `enumObject`

Creates an enum-like object where keys and values are identical.

```typescript
import { enumObject, type EnumInferFromObject } from '@space-arch/util-enum';

const Status = enumObject(['pending', 'approved', 'rejected']);
// ^? Readonly<{ pending: 'pending', approved: 'approved', rejected: 'rejected' }>

// Type-safe usage
type StatusType = typeof Status[keyof typeof Status];
// ^? 'pending' | 'approved' | 'rejected'

// Same as above
type StatusType = EnumInferFromObject<typeof Status>
```

### `enumMerge`

Merges any number of enum objects into a single enum object.

```typescript
import { enumMerge, enumObject } from '@space-arch/util-enum';

const Colors = enumObject(['green', 'red']);
const Sizes = enumObject(['small', 'large']);
const Status = enumObject(['active', 'inactive']);

const Combined = enumMerge(Colors, Sizes, Status);
// Result: { green: 'green', red: 'red', small: 'small', large: 'large', active: 'active', inactive: 'inactive' }
```

### `enumPick`

Creates a new enum object by picking specific keys from an existing enum.

```typescript
import { enumPick } from '@space-arch/util-enum';

const AllStatus = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected'
} as const;

const ActiveStatus = enumPick(
  AllStatus,
  ['pending', 'approved']
);
// Result: { pending: 'pending', approved: 'approved' }
```

### `enumPrefixed`

Creates an enum object with prefixed keys and values.

```typescript
import { enumPrefixed } from '@space-arch/util-enum';

const Actions = enumPrefixed('user', ['create', 'update', 'delete'] as const);
// Result: { user_create: 'user/create', user_update: 'user/update', user_delete: 'user/delete' }
```

### `enumValues`

Extracts the values from an enum object as a strongly-typed array.

```typescript
import { enumValues, enumObject } from '@space-arch/util-enum';

const Status = enumObject(['pending', 'approved', 'rejected'] as const);
const statusValues = enumValues(Status);
// Result: ['pending', 'approved', 'rejected']
// Type: ('pending' | 'approved' | 'rejected')[]
```

### `enumSuiteObject` and `enumSuiteTuple`

Creates a complete enum suite with the enum object, values array, and type guard function. `enumSuiteTuple` returns a tuple for destructuring, while `enumSuiteObject` returns an object with named properties.

```typescript
import { enumSuiteObject, enumSuiteTuple, enumObject } from '@space-arch/util-enum';

// Using enumSuiteTuple
const [StatusEnum, STATUS_ENUM_VALUES, isStatusEnum] = enumSuiteTuple(
  enumObject(['pending', 'approved', 'rejected'])
);

console.log(StatusEnum.pending); // 'pending'
console.log(STATUS_ENUM_VALUES); // ['pending', 'approved', 'rejected']
console.log(isStatusEnum('pending')); // true
console.log(isStatusEnum('invalid')); // false

// Using enumSuiteObjec
const StatusEnumSuite = enumSuiteObject(
  enumObject(['pending', 'approved', 'rejected'])
);

console.log(StatusEnumSuite.enum.pending); // 'pending'
console.log(StatusEnumSuite.values); // ['pending', 'approved', 'rejected']
console.log(StatusEnumSuite.hasValue('pending')); // true
console.log(StatusEnumSuite.hasValue('invalid')); // false
```

### Type Utilities

#### `EnumInferFromValues`

Infers union type from an array of string values.

```typescript
import type { EnumInferFromValues } from '@space-arch/util-enum';

type Status = EnumInferFromValues<['pending', 'approved', 'rejected']>;
// Result: 'pending' | 'approved' | 'rejected'
```

#### `EnumInferFromObject`

Infers union type from an enum object's values.

```typescript
import type { EnumInferFromObject } from '@space-arch/util-enum';
import { enumObject } from '@space-arch/util-enum';

const Status = enumObject(['pending', 'approved', 'rejected'] as const);
type StatusType = EnumInferFromObject<typeof Status>;
// Result: 'pending' | 'approved' | 'rejected'
```

## Dependencies

- `@space-arch/util-ts`: Provides utility types like `Simplify` and `PropValues`

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

- 🐛 [Report bugs](https://github.com/alexandr2110pro/space-arch/issues)
- 💡 [Request features](https://github.com/alexandr2110pro/space-arch/issues)
- 📖 [Documentation](https://github.com/alexandr2110pro/space-arch#readme)
