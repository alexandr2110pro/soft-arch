import type { EnumInferFromObject } from './enum-infer-from-object.js';

export function enumValues<T extends Record<string, string>>(enumObj: T) {
  return Object.values(enumObj) as EnumInferFromObject<T>[];
}
