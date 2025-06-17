import { is } from 'drizzle-orm/entity';
import { MySqlDatabase } from 'drizzle-orm/mysql-core';
import { PgDatabase } from 'drizzle-orm/pg-core';
import { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { describe, expect, it, vi } from 'vitest';

import { lazyDrizzle } from './lazy-drizzle.js';

// Mock the actual database constructors since we don't want real connections
vi.mock('drizzle-orm/node-postgres');
vi.mock('drizzle-orm/mysql2');
vi.mock('drizzle-orm/better-sqlite3');

// Test helpers
const createMockDb = (
  entityKind: string,
  prototype: any,
  extraMethods: Record<string, any> = {},
) => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    [Symbol.for('drizzle:entityKind')]: entityKind,
    ...extraMethods,
  };
  Object.setPrototypeOf(mockDb, prototype);
  return mockDb;
};

const createTestSetup = (
  mockDb: any,
  connectionUrl = 'test://localhost/test',
) => {
  const mockDrizzleFactory = vi.fn().mockReturnValue(mockDb);
  const mockConnectionUrl = vi.fn().mockReturnValue(connectionUrl);
  const lazyDb = lazyDrizzle(mockDrizzleFactory, mockConnectionUrl);

  return { mockDrizzleFactory, mockConnectionUrl, lazyDb };
};

const DB_CONFIGS = {
  postgres: {
    entityKind: 'PgDatabase',
    prototype: PgDatabase.prototype,
    connectionUrl: 'postgresql://localhost/test',
    dbClass: PgDatabase,
  },
  mysql: {
    entityKind: 'MySqlDatabase',
    prototype: MySqlDatabase.prototype,
    connectionUrl: 'mysql://localhost/test',
    dbClass: MySqlDatabase,
  },
  sqlite: {
    entityKind: 'BaseSQLiteDatabase',
    prototype: BaseSQLiteDatabase.prototype,
    connectionUrl: '/path/to/db.sqlite',
    dbClass: BaseSQLiteDatabase,
  },
} as const;

describe('lazyDrizzle', () => {
  describe('entity type checking with is() function', () => {
    it.each([
      ['PostgreSQL', 'postgres'],
      ['MySQL', 'mysql'],
      ['SQLite', 'sqlite'],
    ] as const)(
      'should pass %s type check when using lazy drizzle',
      (dbName, dbKey) => {
        const config = DB_CONFIGS[dbKey];
        const mockDb = createMockDb(config.entityKind, config.prototype);
        const { mockDrizzleFactory, lazyDb } = createTestSetup(
          mockDb,
          config.connectionUrl,
        );

        expect(is(lazyDb, config.dbClass)).toBe(true);
        expect(mockDrizzleFactory).toHaveBeenCalledWith(config.connectionUrl);
      },
    );

    it('should only initialize once even with multiple accesses', () => {
      const config = DB_CONFIGS.postgres;
      const mockDb = createMockDb(config.entityKind, config.prototype);
      const { mockDrizzleFactory, lazyDb } = createTestSetup(
        mockDb,
        config.connectionUrl,
      );

      // Multiple type checks and method accesses
      is(lazyDb, PgDatabase);
      is(lazyDb, PgDatabase);
      expect(lazyDb.select).toBeDefined();
      expect(lazyDb.select).toBeDefined();

      expect(mockDrizzleFactory).toHaveBeenCalledTimes(1);
    });

    it('should work with drizzle-seed style type detection', () => {
      const config = DB_CONFIGS.postgres;
      const mockDb = createMockDb(config.entityKind, config.prototype);
      const { lazyDb } = createTestSetup(mockDb, config.connectionUrl);

      // Simulate drizzle-seed's type detection logic
      let dbType: string;
      if (is(lazyDb, PgDatabase)) {
        dbType = 'postgres';
      } else if (is(lazyDb, MySqlDatabase)) {
        dbType = 'mysql';
      } else if (is(lazyDb, BaseSQLiteDatabase)) {
        dbType = 'sqlite';
      } else {
        throw new Error('Unsupported database type');
      }

      expect(dbType).toBe('postgres');
    });
  });

  describe('lazy initialization behavior', () => {
    it('should not call drizzle factory until first access', () => {
      const mockDrizzleFactory = vi.fn();
      const mockConnectionUrl = vi
        .fn()
        .mockReturnValue('test://localhost/test');

      lazyDrizzle(mockDrizzleFactory, mockConnectionUrl);

      expect(mockDrizzleFactory).not.toHaveBeenCalled();
    });

    it('should call connection URL function when initializing', () => {
      const config = DB_CONFIGS.postgres;
      const mockDb = createMockDb(config.entityKind, config.prototype);
      const { mockDrizzleFactory, mockConnectionUrl, lazyDb } = createTestSetup(
        mockDb,
        config.connectionUrl,
      );

      // Trigger initialization
      expect(lazyDb.select).toBeDefined();

      expect(mockConnectionUrl).toHaveBeenCalledTimes(1);
      expect(mockDrizzleFactory).toHaveBeenCalledWith(config.connectionUrl);
    });

    it('should properly bind methods to the actual db instance', () => {
      const mockSelect = vi.fn().mockReturnValue({ from: vi.fn() });
      const config = DB_CONFIGS.postgres;
      const mockDb = createMockDb(config.entityKind, config.prototype, {
        select: mockSelect,
        someProperty: 'test-value',
      });
      const { lazyDb } = createTestSetup(mockDb, config.connectionUrl);

      // Access a method
      const selectMethod = lazyDb.select;
      expect(typeof selectMethod).toBe('function');

      // Access a property
      expect(lazyDb.someProperty).toBe('test-value');

      // Call the method - should be properly bound
      selectMethod();
      expect(mockSelect).toHaveBeenCalled();
    });
  });
});
