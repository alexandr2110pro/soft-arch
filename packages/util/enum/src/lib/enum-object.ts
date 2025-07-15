export type EnumObject<TNamesTuple extends readonly string[]> = {
  readonly [K in TNamesTuple[number]]: K;
};

export function enumObject<U extends string, TNamesTuple extends readonly U[]>(
  names: TNamesTuple,
): EnumObject<TNamesTuple> {
  return Object.freeze(
    names.reduce(
      (res, key) => Object.assign(res, { [key]: key }),
      {} as EnumObject<TNamesTuple>,
    ),
  );
}
