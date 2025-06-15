export type EnumPick<
  E extends Record<string, string>,
  K extends readonly (keyof E)[],
> = { readonly [P in K[number]]: E[P] };

export function enumPick<
  E extends Record<string, string>,
  K extends readonly (keyof E)[],
>(enumObject: E, keys: K): Readonly<EnumPick<E, K>> {
  return Object.freeze(
    keys.reduce(
      (res, k) => {
        return Object.assign(res, { [k]: enumObject[k] });
      },
      {} as EnumPick<E, K>,
    ),
  );
}
