import { enumMerge } from './enum-merge.js';
import { enumObject } from './enum-object.js';
import { enumPick } from './enum-pick.js';
import { enumPrefixed } from './enum-prefixed.js';
import { enumSuiteObject, enumSuiteTuple } from './enum-suite.js';
import { enumValues } from './enum-values.js';

test('enum suite tuple with enumObject', () => {
  const [MY_ENUM, MY_ENUM_VALUES, isMyEnum] = enumSuiteTuple(
    enumObject(['FOO', 'BAR']),
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
    enumPrefixed('MY', ['FOO', 'BAR']),
  );

  expect(MY_ENUM).toEqual({
    MY_FOO: 'MY/FOO',
    MY_BAR: 'MY/BAR',
  });
  expect(MY_ENUM_VALUES).toEqual(['MY/FOO', 'MY/BAR']);
  expect(isMyEnum('MY/FOO')).toBe(true);
  expect(isMyEnum('MY/BAR')).toBe(true);
  expect(isMyEnum('MY/BAZ')).toBe(false);
});

test('enum suite tuple with custom enum-like object', () => {
  const [MY_ENUM, MY_ENUM_VALUES, isMyEnum] = enumSuiteTuple({
    one: 'one',
    two: 'two',
  } as const);

  expect(MY_ENUM).toEqual({
    one: 'one',
    two: 'two',
  });
  expect(MY_ENUM_VALUES).toEqual(['one', 'two']);
  expect(isMyEnum('one')).toBe(true);
  expect(isMyEnum('two')).toBe(true);
  expect(isMyEnum('three')).toBe(false);
});

test('enum suite object with enumObject', () => {
  const MY_ENUM_SUITE = enumSuiteObject(enumObject(['FOO', 'BAR']));

  expect(MY_ENUM_SUITE.enum).toEqual({
    FOO: 'FOO',
    BAR: 'BAR',
  });
  expect(Object.isFrozen(MY_ENUM_SUITE.enum)).toBe(true);

  expect(MY_ENUM_SUITE.values).toEqual(['FOO', 'BAR']);
  expect(MY_ENUM_SUITE.hasValue('FOO')).toBe(true);
  expect(MY_ENUM_SUITE.hasValue('BAR')).toBe(true);
  expect(MY_ENUM_SUITE.hasValue('BAZ')).toBe(false);
});

test('from READOME.MD', () => {
  const ACTIONS = enumObject(['WRITE', 'READ']);
  const VIEWER_ACTIONS = enumPick(ACTIONS, ['READ']);

  const USER_READ_ACTIONS = enumPrefixed('USER', enumValues(VIEWER_ACTIONS));
  const POST_READ_ACTIONS = enumPrefixed('POST', enumValues(VIEWER_ACTIONS));
  const COMMENT_READ_ACTIONS = enumPrefixed(
    'COMMENT',
    enumValues(VIEWER_ACTIONS),
  );

  const VIEWER_PERMISSIONS = enumSuiteObject(
    enumMerge(USER_READ_ACTIONS, COMMENT_READ_ACTIONS, POST_READ_ACTIONS),
  );

  expect(VIEWER_PERMISSIONS.enum).toEqual({
    COMMENT_READ: 'COMMENT/READ',
    POST_READ: 'POST/READ',
    USER_READ: 'USER/READ',
  });
  expect(VIEWER_PERMISSIONS.values).toEqual([
    'USER/READ',
    'COMMENT/READ',
    'POST/READ',
  ]);

  // typesafe checks
  const someValue = 'smth' as string;

  if (VIEWER_PERMISSIONS.hasValue(someValue)) {
    switch (someValue) {
      case VIEWER_PERMISSIONS.enum.COMMENT_READ:
        // do something
        break;
      case VIEWER_PERMISSIONS.enum.POST_READ:
        // do something
        break;
      case VIEWER_PERMISSIONS.enum.USER_READ:
        // do something
        break;

      default:
        throw new Error('should not happen', {
          // exhaustiveness check
          cause: someValue satisfies never,
        });
    }
  }
});
