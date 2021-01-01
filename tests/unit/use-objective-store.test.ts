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

const forceUpdate = jest.fn();
const useContext = jest.fn(() => registerMock);
const useReducer = jest.fn(() => [null, forceUpdate]);
const useMemo = jest.fn((fn: any) => fn());
const useEffect = jest.fn();

jest.mock('react', () => ({
  useContext,
  useReducer,
  createContext: jest.fn(),
  useMemo,
  useEffect,
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
import { HookSubscriber } from '../../src/hook-subscriber';

describe('use-objective-store', () => {
  describe('hook', () => {
    it('should get the ObjectiveStore instance and re-render', () => {
      const objectiveStore = useObjectiveStore();
      expect(objectiveStore).toBe(registerMock);

      const { mock: { calls: [[reducingFn]] } } = useReducer as any;
      const { mock: { calls: [[unmountFn, watchParams]] } } = useEffect as any;
      expect(reducingFn(0)).toEqual(1);
      expect(subscribe).toBeCalled();
      expect(watchParams).toEqual([registerMock]);

      unmountFn()();
      expect(unsubscribe).toBeCalled();

      const { mock: { calls: [[, update]] } } = HookSubscriber as any;
      update();
      expect(forceUpdate).toHaveBeenCalled();
    });
  });
});
