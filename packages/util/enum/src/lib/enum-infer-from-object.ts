import type { PropValues } from '@space-arch/util-ts';

export type EnumInferFromObject<TEnumObject extends Record<string, string>> =
  PropValues<TEnumObject>;
