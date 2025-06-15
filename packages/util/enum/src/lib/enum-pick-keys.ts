export type EnumPickKeys<
  E extends Record<string, string>,
  K extends readonly (keyof E)[],
> = { readonly [P in K[number]]: E[P] };

export function enumPickKeys<
  E extends Record<string, string>,
  K extends readonly (keyof E)[],
>(enumObject: E, keys: K): Readonly<EnumPickKeys<E, K>> {
  return Object.freeze(
    keys.reduce(
      (res, k) => {
        return Object.assign(res, { [k]: enumObject[k] });
      },
      {} as EnumPickKeys<E, K>,
    ),
  );
}
