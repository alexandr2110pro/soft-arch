export type EnumPrefixed<
  TPrefix extends string,
  TName extends readonly string[],
> = Readonly<{
  [K in TName[number] as `${TPrefix}_${K}`]: `${TPrefix}/${K}`;
}>;

export function enumPrefixed<
  TPrefix extends string,
  U extends string,
  TName extends readonly U[],
>(prefix: TPrefix, names: TName): EnumPrefixed<TPrefix, TName> {
  return Object.freeze(
    names.reduce(
      (res, key) =>
        Object.assign(res, {
          [`${prefix}_${key}` as `${TPrefix}_${TName[number]}`]: `${prefix}/${key}`,
        }),
      {} as EnumPrefixed<TPrefix, TName>,
    ),
  );
}
