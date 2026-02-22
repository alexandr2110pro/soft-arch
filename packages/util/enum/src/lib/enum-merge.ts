import type { TupleMerge } from '@soft-arch/util-ts';

export type EnumMerge<T extends Readonly<Record<string, string>[]>> = Readonly<
  TupleMerge<T>
>;

export function enumMerge<
  U extends Record<string, string>,
  T extends readonly U[],
>(...enums: T): EnumMerge<T> {
  return Object.freeze(Object.assign({}, ...enums)) as EnumMerge<T>;
}
