import { enumObject } from './enum-object.js';
import { enumPrefixed } from './enum-prefixed.js';
import { enumSuiteObject, enumSuiteTuple } from './enum-suite.js';

test('enum suite tuple with enumObject', () => {
  const [MY_ENUM, MY_ENUM_VALUES, isMyEnum] = enumSuiteTuple(
    enumObject(['FOO', 'BAR'] as const),
  );

  expect(MY_ENUM).toEqual({
    FOO: 'FOO',
    BAR: 'BAR',
  });
  expect(Object.isFrozen(MY_ENUM)).toBe(true);
  expect(MY_ENUM_VALUES).toEqual(['FOO', 'BAR']);
  expect(isMyEnum('FOO')).toBe(true);
  expect(isMyEnum('BAR')).toBe(true);
  expect(isMyEnum('BAZ')).toBe(false);
});

test('enum suite tuple with enumPrefixedObject', () => {
  const [MY_ENUM, MY_ENUM_VALUES, isMyEnum] = enumSuiteTuple(
    enumPrefixed('MY', ['FOO', 'BAR'] as const),
  );

  expect(MY_ENUM).toEqual({
    FOO: 'MY/FOO',
    BAR: 'MY/BAR',
  });
  expect(MY_ENUM_VALUES).toEqual(['MY/FOO', 'MY/BAR']);
  expect(isMyEnum('MY/FOO')).toBe(true);
  expect(isMyEnum('MY/BAR')).toBe(true);
  expect(isMyEnum('MY/BAZ')).toBe(false);
});

test('enum suite tuple with custom enum-like object', () => {
  const [MY_ENUM, MY_ENUM_VALUES, isMyEnum] = enumSuiteTuple({
    one: 'valone',
    two: 'valtwo',
  } as const);

  expect(MY_ENUM).toEqual({
    one: 'valone',
    two: 'valtwo',
  });
  expect(MY_ENUM_VALUES).toEqual(['valone', 'valtwo']);
  expect(isMyEnum('valone')).toBe(true);
  expect(isMyEnum('valtwo')).toBe(true);
  expect(isMyEnum('valthree')).toBe(false);
});

test('enum suite object with enumObject', () => {
  const MY_ENUM_SUITE = enumSuiteObject(enumObject(['FOO', 'BAR'] as const));

  expect(MY_ENUM_SUITE.enum).toEqual({
    FOO: 'FOO',
    BAR: 'BAR',
  });
  expect(Object.isFrozen(MY_ENUM_SUITE.enum)).toBe(true);
  expect(MY_ENUM_SUITE.values).toEqual(['FOO', 'BAR']);
  expect(MY_ENUM_SUITE.is('FOO')).toBe(true);
  expect(MY_ENUM_SUITE.is('BAR')).toBe(true);
  expect(MY_ENUM_SUITE.is('BAZ')).toBe(false);
});
