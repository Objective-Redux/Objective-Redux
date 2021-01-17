// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const forceUpdate = jest.fn();
const useReducer = jest.fn(() => [null, forceUpdate]);
const useMemo = jest.fn((fn: any) => fn());
const useEffect = jest.fn();

jest.mock('react', () => ({
  useReducer,
  useMemo,
  useEffect,
  createContext: jest.fn(),
}));

const getState = (): any => ({ foo: { bar: 'baz' } });
const objectiveStoreMock = {
  getState,
};

const useObjectiveStore = jest.fn();

jest.mock('../../../../src/hooks/use-objective-store', () => ({
  useObjectiveStore,
}));

const subscribe = jest.fn();
const unsubscribe = jest.fn();

jest.mock('../../../../src/hooks/hook-subscriber', () => ({
  HookSubscriber: jest.fn().mockImplementation(() => ({
    subscribe,
    unsubscribe,
  })),
}));

import { useSelector } from '../../../../src';
import { HookSubscriber } from '../../../../src/hooks/hook-subscriber';

describe('use-selector', () => {
  it('returns null when there is not a ObjectiveStore instance', () => {
    useObjectiveStore.mockReturnValue(null);
    const controller = useSelector(() => {});
    expect(controller).toBeNull();
  });

  it('returns the selected state', () => {
    useObjectiveStore.mockReturnValue(objectiveStoreMock);
    const state = useSelector(s => ({ bar: s.foo.bar }));

    const { mock: { calls: [[reducingFn]] } } = useReducer as any;
    const { mock: { calls: [[unmountFn, watchParams]] } } = useEffect as any;
    expect(reducingFn(0)).toEqual(1);
    expect(subscribe).toBeCalled();
    expect(watchParams).toEqual([objectiveStoreMock]);

    unmountFn()();
    expect(unsubscribe).toBeCalled();

    const { mock: { calls: [[, getSlice, update]] } } = HookSubscriber as any;

    expect(state).toEqual({ bar: 'baz' });
    expect(getSlice()).toEqual({ bar: 'baz' });

    update();
    expect(forceUpdate).toHaveBeenCalled();
  });
});
