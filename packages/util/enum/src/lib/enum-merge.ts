import { Simplify } from '@space-architects/util-ts';

export type EnumMerge<
  A extends Record<string, string>,
  B extends Record<string, string>,
> = Readonly<Simplify<A & B>>;

export function enumMerge<
  A extends Record<string, string>,
  B extends Record<string, string>,
>(a: A, b: B): EnumMerge<A, B> {
  return Object.freeze(Object.assign({}, a, b)) as EnumMerge<A, B>;
}
