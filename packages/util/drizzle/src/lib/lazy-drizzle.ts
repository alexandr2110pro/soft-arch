// TODO: constrain the T to be of some base form of drizzle

/**
 * Create lazily initialized drizzle proxy
 *
 * Allows for configuring the connection before creating the instance.
 * For example, in Lambda, you might want to resolve the connection url secret and set
 * it to the env before accessing the db.
 *
 * @example
 * ```ts
 * // drizzle is not initialized here
 * const db = lazyDrizzle(drizzle, () => process.env.DATABASE_URL);
 *
 * process.env['DATABASE_URL'] = await getConnectionUrl();
 *
 * // drizzle will be initialized only here:
 * const [user] = await db.select().from(users).where(eq(users.id, 1));
 * ```
 *
 * @param drizzleFactory - A function that creates a drizzle instance
 * @param connectionUrl - A function that returns the connection url
 */
export const lazyDrizzle = <T extends object>(
  drizzleFactory: (connectionUrl: string) => T,
  connectionUrl: () => string,
) => {
  let _db: T | null = null;

  const getDb = () => {
    if (!_db) {
      _db = drizzleFactory(connectionUrl());
    }
    return _db;
  };

  return new Proxy({} as T, {
    get(_, prop) {
      const db = getDb();
      const value = (db as any)[prop as keyof T];
      return typeof value === 'function' ? value.bind(db) : value;
    },
  });
};
