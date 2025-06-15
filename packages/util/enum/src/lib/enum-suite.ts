import type { EnumInferFromObject } from './enum-infer-from-object.js';

export type IsEnumObjectPropValueFn<TEnum extends Record<string, string>> = (
  val: unknown,
) => val is EnumInferFromObject<TEnum>;

export type EnumSuiteTuple<TEnum extends Record<string, string>> = readonly [
  TEnum,
  EnumInferFromObject<TEnum>[],
  (val: unknown) => val is EnumInferFromObject<TEnum>,
];

export type EnumSuiteObject<TEnum extends Record<string, string>> = {
  readonly enum: TEnum;
  readonly values: EnumInferFromObject<TEnum>[];
  readonly is: IsEnumObjectPropValueFn<TEnum>;
};

export function enumSuiteObject<TEnum extends Record<string, string>>(
  enumObj: TEnum,
): EnumSuiteObject<TEnum> {
  const values = Object.values(enumObj) as EnumInferFromObject<TEnum>[];
  const set = new Set(values);

  const is = (val: unknown): val is EnumInferFromObject<TEnum> => {
    if (typeof val !== 'string') return false;
    return set.has(val as EnumInferFromObject<TEnum>);
  };

  return {
    enum: enumObj,
    values: values,
    is,
  };
}

export function enumSuiteTuple<TEnum extends Record<string, string>>(
  enumObj: TEnum,
): EnumSuiteTuple<TEnum> {
  const { values, is } = enumSuiteObject(enumObj);
  return [enumObj, values, is];
}
