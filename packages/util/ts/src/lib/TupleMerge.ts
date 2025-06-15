import type { Simplify } from './Simplify.js';

type _TupleMerge<T extends Readonly<unknown[]>> = T extends readonly [
  infer Head,
  ...infer Tail,
]
  ? Tail extends Readonly<[unknown, ...unknown[]]> // tail not empty
    ? Head & _TupleMerge<Tail>
    : Head
  : never;

export type TupleMerge<T extends Readonly<unknown[]>> = Simplify<
  _TupleMerge<T>
>;
