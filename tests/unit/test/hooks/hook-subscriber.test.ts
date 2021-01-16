// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { HookSubscriber } from '../../../../src/hooks/hook-subscriber';

const subscribe = jest.fn<() => void, [() => void]>(() => (): void => {});
const mockObjectiveStore: any = {
  subscribe,
};

describe('HookSubscriber', () => {
  describe('subscribe', () => {
    it('subscribes once to the ObjectiveStore instance', () => {
      const subscriber = new HookSubscriber(mockObjectiveStore, () => {}, () => {});
      subscriber.subscribe();
      subscriber.subscribe();
      subscriber.subscribe();
      expect(subscribe).toBeCalledTimes(1);
    });

    it('does nothing when there is no ObjectiveStore instance', () => {
      const subscriber = new HookSubscriber(null, () => {}, () => {});
      expect(subscriber).toBeInstanceOf(HookSubscriber);
      expect(subscribe).toBeCalledTimes(0);
    });
  });

  describe('unsubscribe', () => {
    it('calls the unsubscribe function once when it is set', () => {
      const subscriber: any = new HookSubscriber(null, () => {}, () => {});
      const unsubscribeFn = jest.fn();
      subscriber.unsubscribeFn = unsubscribeFn;
      subscriber.unsubscribe();
      subscriber.unsubscribe();
      subscriber.unsubscribe();
      expect(unsubscribeFn).toBeCalledTimes(1);
      expect(subscriber.unsubscribeFn).toBeNull();
    });

    it('does nothing when the unsubscribe function is not set', () => {
      const subscriber: any = new HookSubscriber(null, () => {}, () => {});
      subscriber.unsubscribe();
      expect(subscriber.unsubscribeFn).toBeNull();
    });
  });

  describe('event handling', () => {
    it('ignores unnecessary events', () => {
      let i = 0;
      const stateFn = jest.fn(() => i);
      const updateFn = jest.fn();
      const subscriber = new HookSubscriber(mockObjectiveStore, stateFn, updateFn);
      subscriber.subscribe();
      const { mock: { calls: [[fn]] } } = subscribe;
      i++;
      fn();
      fn();
      expect(updateFn).toHaveBeenCalledTimes(1);
      i++;
      fn();
      expect(updateFn).toHaveBeenCalledTimes(2);
    });
  });
});
