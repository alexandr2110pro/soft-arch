export type EnumPrefixed<
  TPrefix extends string,
  TName extends readonly string[],
> = {
  readonly [K in TName[number]]: `${TPrefix}/${K}`;
};

export function enumPrefixed<
  TPrefix extends string,
  TName extends readonly string[],
>(prefix: TPrefix, names: TName): EnumPrefixed<TPrefix, TName> {
  return Object.freeze(
    names.reduce(
      (res, key) => Object.assign(res, { [key]: `${prefix}/${key}` }),
      {} as EnumPrefixed<TPrefix, TName>,
    ),
  );
}
