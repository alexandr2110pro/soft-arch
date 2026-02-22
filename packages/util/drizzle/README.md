# @soft-arch/util-drizzle

Utility functions for Drizzle ORM.

## Installation

```bash
npm install @soft-arch/util-drizzle
# or
pnpm add @soft-arch/util-drizzle
```

## Features

- 🐻 **Lazy Initialization**: Create Drizzle instances only when needed
- 🆔 **UUIDv7 Support**: Built-in column types for UUIDv7 with automatic generation

## Usage

### Lazy Drizzle

Create a lazily initialized Drizzle instance. Useful for serverless environments where you need to resolve connection details at runtime.

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { lazyDrizzle } from '@soft-arch/util-drizzle';

const db = lazyDrizzle(
  (url) => drizzle(postgres(url)),
  () => process.env.DATABASE_URL
);

// Before using the db:
process.env['DATABASE_URL'] = await resolveConnectionString();

// Connection is established only when first query is executed
const users = await db.select().from(usersTable);
```

### UUIDv7 Column Types

Drizzle column types for UUIDv7 with automatic generation.

```typescript
import { pgTable } from 'drizzle-orm/pg-core';
import { uuidV7, uuidV7Nullable } from '@soft-arch/util-drizzle';

const users = pgTable('users', {
  id: uuidV7('id').primaryKey(),
  parentId: uuidV7Nullable('parent_id')
});
```

- `uuidV7()` - Not null with automatic default value generation
- `uuidV7Nullable()` - Nullable without default value

## Contributing

This package is part of the [SoftArch monorepo](../../README.md).
