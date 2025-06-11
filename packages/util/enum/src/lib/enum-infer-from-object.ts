import type { PropValues } from '@space-architects/util-ts';

import type { EnumObject } from './enum-object.js';

export type EnumInferFromObject<TEnumObject extends EnumObject<any>> =
  PropValues<TEnumObject>;
