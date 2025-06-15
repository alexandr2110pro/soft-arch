export type PropTupleFromArray<
  T extends readonly Record<PropertyKey, string>[],
  K extends keyof T[number] & PropertyKey,
> = {
  [I in keyof T]: T[I][K];
};

export function propTupleFromArray<
  T extends readonly Record<PropertyKey, string>[],
  K extends keyof T[number] & PropertyKey,
>(arr: T, key: K): PropTupleFromArray<T, K> {
  return arr.map(item => item[key]) as unknown as PropTupleFromArray<T, K>;
}
