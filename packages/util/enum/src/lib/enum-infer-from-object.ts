import type { PropValues } from '@soft-arch/util-ts';

export type EnumInferFromObject<TEnumObject extends Record<string, string>> =
  PropValues<TEnumObject>;
