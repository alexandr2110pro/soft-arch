import type { PropValues } from '@space-architects/util-ts';

export type EnumInferFromObject<TEnumObject extends Record<string, string>> =
  PropValues<TEnumObject>;
