# @space-architects/util-enum

A comprehensive TypeScript utility library for creating, manipulating, and working with enum-like objects. This package provides type-safe utilities for common enum operations with full TypeScript support.

## Installation

```bash
npm install @space-architects/util-enum
# or
pnpm add @space-architects/util-enum
# or
yarn add @space-architects/util-enum
```

## Features

- 🔒 **Type-safe**: Full TypeScript support with strict typing
- 🚀 **Zero dependencies**: Lightweight with minimal footprint (depends only on `@space-architects/util-ts`)
- 📦 **Tree-shakable**: Import only what you need
- 🎯 **Focused**: Specialized utilities for enum-like operations
- 🧪 **Well-tested**: Comprehensive test coverage
- ❄️ **Immutable**: All enum objects are frozen with `Object.freeze()` for runtime safety

## API Reference

### `enumObject`

Creates an enum-like object where keys and values are identical.

```typescript
import { enumObject, type EnumInferFromObject } from '@space-architects/util-enum';

const Status = enumObject(['pending', 'approved', 'rejected'] as const);
// ^? Readonly<{ pending: 'pending', approved: 'approved', rejected: 'rejected' }>

// Type-safe usage
type StatusType = typeof Status[keyof typeof Status];
// ^? 'pending' | 'approved' | 'rejected'

// Same as above
type StatusType = EnumInferFromObject<typeof Status>
```

### `enumMerge`

Merges two enum objects into a single enum object.

```typescript
import { enumMerge, enumObject } from '@space-architects/util-enum';

const Colors = enumObject(['green', 'red'] as const);
const Sizes = { small: 'small', large: 'large' } as const;

const Combined = enumMerge(Colors, Sizes);
// Result: { red: 'red', blue: 'blue', small: 'small', large: 'large' }
```

### `enumPickKeys`

Creates a new enum object by picking specific keys from an existing enum.

```typescript
import { enumPickKeys } from '@space-architects/util-enum';

const AllStatus = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected'
} as const;

const ActiveStatus = enumPickKeys(
  AllStatus,
  ['pending', 'approved'] as const
);
// Result: { pending: 'pending', approved: 'approved' }
```

### `enumPrefixed`

Creates an enum object with prefixed values.

```typescript
import { enumPrefixed } from '@space-architects/util-enum';

const Actions = enumPrefixed('user', ['create', 'update', 'delete'] as const);
// Result: { create: 'user/create', update: 'user/update', delete: 'user/delete' }
```

### `enumSuiteObject` and `enumSuiteTuple`

Creates a complete enum suite with the enum object, values array, and type guard function. `enumSuiteTuple` returns a tuple for destructuring, while `enumSuiteObject` returns an object with named properties.

```typescript
import { enumSuiteObject, enumSuiteTuple, enumObject } from '@space-architects/util-enum';

// Using enumSuiteTuple
const [StatusEnum, STATUS_ENUM_VALUES, isStatusEnum] = enumSuiteTuple(
  enumObject(['pending', 'approved', 'rejected'] as const)
);

console.log(StatusEnum.pending); // 'pending'
console.log(STATUS_ENUM_VALUES); // ['pending', 'approved', 'rejected']
console.log(isStatusEnum('pending')); // true
console.log(isStatusEnum('invalid')); // false

// Using enumSuiteObjec
const StatusEnumSuite = enumSuiteObject(
  enumObject(['pending', 'approved', 'rejected'] as const)
);

console.log(StatusEnumSuite.enum.pending); // 'pending'
console.log(StatusEnumSuite.values); // ['pending', 'approved', 'rejected']
console.log(StatusEnumSuite.is('pending')); // true
console.log(StatusEnumSuite.is('invalid')); // false
```

### Type Utilities

#### `EnumInferFromValues`

Infers union type from an array of string values.

```typescript
import type { EnumInferFromValues } from '@space-architects/util-enum';

type Status = EnumInferFromValues<['pending', 'approved', 'rejected']>;
// Result: 'pending' | 'approved' | 'rejected'
```

#### `EnumInferFromObject`

Infers union type from an enum object's values.

```typescript
import type { EnumInferFromObject } from '@space-architects/util-enum';
import { enumObject } from '@space-architects/util-enum';

const Status = enumObject(['pending', 'approved', 'rejected'] as const);
type StatusType = EnumInferFromObject<typeof Status>;
// Result: 'pending' | 'approved' | 'rejected'
```

## Common Patterns

### Creating a Status Enum

**with tuple**
```typescript
const [OrderStatus, OrderStatusValues, isOrderStatus] = enumSuiteTuple(
  enumObject(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const)
);
```
**with object**
```typescript
const OrderStatusEnum = enumSuiteObject(
  enumObject(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const)
);
OrderStatusEnum.enum.pending // 'pending'
OrderStatusEnum.is('irrelevant') // false
OrderStatusEnum.values 
// ^? ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
```

### Filtering Enum Values

```typescript
import { enumObject, enumPickKeys } from '@space-architects/util-enum';

const AllPermissions = enumObject([
  'read',
  'write',
  'delete',
  'admin',
  'super_admin'
] as const);

// Create a subset for regular users
const UserPermissions = enumPickKeys(AllPermissions, ['read', 'write'] as const);

// Create a subset for moderators
const ModeratorPermissions = enumPickKeys(AllPermissions, ['read', 'write', 'delete'] as const);
```


## Dependencies

- `@space-architects/util-ts`: Provides utility types like `Simplify` and `PropValues`

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

- 🐛 [Report bugs](https://github.com/space-architects/space-architects/issues)
- 💡 [Request features](https://github.com/space-architects/space-architects/issues)
- 📖 [Documentation](https://github.com/space-architects/space-architects#readme)