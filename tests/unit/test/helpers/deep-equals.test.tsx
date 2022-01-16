// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { deepEquals } from '../../../../src/helpers/deep-equals';

describe('deep-equals', () => {
  it('compares objects correctly', () => {
    expect(deepEquals({ a: 1 }, { a: 1 })).toBeTruthy();
    expect(deepEquals({ a: { b: 1 } }, { a: { b: 1 } })).toBeTruthy();
    expect(deepEquals({ a: { b: 1 } }, { a: { b: 2 } })).toBeFalsy();
    expect(deepEquals({ a: { b: 1 } }, { a: { c: 2 } })).toBeFalsy();
    expect(deepEquals({ a: { b: 1 } }, { a: {} })).toBeFalsy();
    expect(deepEquals({ a: {} }, { a: { b: 1 } })).toBeFalsy();
    expect(deepEquals({ a: {} }, {})).toBeFalsy();
    expect(deepEquals({}, { a: {} })).toBeFalsy();
  });
});
