// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const context = 'foo';
const getContext = jest.fn(() => context);

jest.mock('redux-saga/effects', () => ({
  getContext,
  GetContextEffect: {},
}));

import { getObjectiveStoreFromSagaContext } from '../../src';

describe('get-objective-store-from-saga-context', () => {
  it('should get the ObjectiveStore instance from the ObjectiveStore context', () => {
    const generator = getObjectiveStoreFromSagaContext();
    const resultingContext = generator.next().value;
    expect(resultingContext).toEqual(context);
  });
});
