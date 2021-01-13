// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const registerMock = {};

const useContext = jest.fn(() => registerMock);

jest.mock('react', () => ({
  useContext,
  createContext: jest.fn(),
}));

const subscribe = jest.fn();
const unsubscribe = jest.fn();

jest.mock('../../src/hook-subscriber', () => ({
  HookSubscriber: jest.fn().mockImplementation(() => ({
    subscribe,
    unsubscribe,
  })),
}));

import { useObjectiveStore } from '../../src';

describe('use-objective-store', () => {
  describe('hook', () => {
    it('should get the ObjectiveStore instance', () => {
      const objectiveStore = useObjectiveStore();
      expect(objectiveStore).toBe(registerMock);
    });
  });
});
