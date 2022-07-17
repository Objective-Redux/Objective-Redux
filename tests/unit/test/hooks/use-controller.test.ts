// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const forceUpdate = jest.fn();
const useReducer = jest.fn(() => [null, forceUpdate]);

jest.mock('react', () => ({
  useReducer,
  createContext: jest.fn(),
}));

const useSyncExternalStoreWithSelector = jest.fn();

jest.mock('use-sync-external-store/with-selector', () => ({
  useSyncExternalStoreWithSelector,
}));

const registerStateController = jest.fn();
const registerMock = {
  registerStateController,
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

const getController = jest.fn((objectiveStore, CClass) => new CClass(objectiveStore));

jest.mock('../../../../src/store/lazy-loader', () => ({
  LazyLoader: {
    getController,
  },
}));

import {
  useController,
  StateController,
  StatelessController,
} from '../../../../src';
import { HookSubscriber } from '../../../../src/hooks/hook-subscriber';

const stateValue = { some: 'value' };

class TestStateController extends StateController<any> {
  // eslint-disable-next-line no-useless-constructor
  public constructor() {
    super(stateValue);
  }

  public static override getName(): string {
    return 'TestController';
  }

  public override getStateSlice = (): any => stateValue;
}

class TestStatelessController extends StatelessController {
  // eslint-disable-next-line no-useless-constructor
  public constructor() {
    super();
  }

  public static override getName(): string {
    return 'TestController';
  }
}

describe('use-controller', () => {
  it('returns null when there is not a ObjectiveStore instance', () => {
    useObjectiveStore.mockReturnValue(null);
    const controller = useController(TestStateController);
    expect(controller).toBeNull();
  });

  it('returns an instance of a StateController when there is a ObjectiveStore instance', () => {
    useObjectiveStore.mockReturnValue(registerMock);
    const controller = useController(TestStateController);
    expect(controller).toBeInstanceOf(TestStateController);

    const { mock: { calls: [[reducingFn]] } } = useReducer as any;
    const {
      mock: {
        calls: [
          [
            subFn,
            getFn,
            serverGetFn,
            selectorFn,
          ],
        ],
      },
    } = useSyncExternalStoreWithSelector as any;

    const unsubFn = subFn();
    unsubFn();

    expect(reducingFn(0)).toEqual(1);
    expect(subscribe).toBeCalled();
    expect(unsubscribe).toBeCalled();

    const { mock: { calls: [[, getSlice, update]] } } = HookSubscriber as any;

    expect(getSlice()).toEqual(stateValue);
    expect(selectorFn((getFn()))).toEqual(stateValue);
    expect(selectorFn((serverGetFn()))).toEqual(stateValue);

    update();
    expect(forceUpdate).toHaveBeenCalled();
  });

  it('returns an instance of a StatelessController when there is a ObjectiveStore instance', () => {
    useObjectiveStore.mockReturnValue(registerMock);
    const controller = useController(TestStatelessController);
    expect(controller).toBeInstanceOf(TestStatelessController);

    const { mock: { calls: [[reducingFn]] } } = useReducer as any;
    const {
      mock: {
        calls: [
          [
            subFn,
            getFn,
            serverGetFn,
            selectorFn,
          ],
        ],
      },
    } = useSyncExternalStoreWithSelector as any;

    const unsubFn = subFn();
    unsubFn();

    expect(reducingFn(0)).toEqual(1);
    expect(subscribe).toBeCalled();
    expect(unsubscribe).toBeCalled();

    const { mock: { calls: [[, getSlice, update]] } } = HookSubscriber as any;

    expect(getSlice()).toEqual(0);
    expect(selectorFn((getFn()))).toEqual(0);
    expect(selectorFn((serverGetFn()))).toEqual(0);

    update();
    expect(forceUpdate).toHaveBeenCalled();
  });
});
