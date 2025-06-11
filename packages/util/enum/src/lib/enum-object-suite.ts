import type { PropValues } from '@space-architects/util-ts';

import { enumObject } from './enum-object.js';

export function enumObjectSuite<TValues extends readonly string[]>(
  values: TValues,
) {
  const enumObj = enumObject<TValues>(values);

  const set = new Set(values);
  const is = (val: unknown): val is PropValues<typeof enumObj> => {
    return typeof val === 'string' && set.has(val as string);
  };

  return [enumObj, values, is] as const;
}
