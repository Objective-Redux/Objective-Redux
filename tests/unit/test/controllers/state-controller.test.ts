// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const dispatch = jest.fn();
const objectiveStoreMock: any = {
  dispatch,
  getState: (): any => ({
    TestSlice: true,
    NAMESPACE: {
      TestSlice: false,
    },
  }),
};

const registerController = jest.fn();
const getController = jest.fn((objectiveStore, CClass) => {
  const instance = new CClass();
  instance.setObjectiveStore(objectiveStore);
  return instance;
});
const removeController = jest.fn();

jest.mock('../../../../src/store/lazy-loader', () => ({
  LazyLoader: {
    registerController,
    getController,
    removeController,
  },
}));

import { StateController } from '../../../../src';

class TestController extends StateController<boolean> {
  public constructor() {
    super(false);
  }

  public static getName(): string {
    return 'TestSlice';
  }

  public readonly unnamedAction = this.registerAction(
    (state, payload: boolean) => payload
  );

  public readonly namedAction = this.registerAction(
    (state, payload: boolean) => payload
  ).withAddressableName('NAME');

  public readonly reducerHandle = this.reducer.bind(this);
}

class NamespacedTestController extends TestController {
  public static getNamespace(): string {
    return 'NAMESPACE';
  }
}

describe('state-controller', () => {
  describe('constructor', () => {
    it('should store the reducer', () => {
      const instance = new TestController();
      expect(instance).toBeInstanceOf(TestController);
    });
  });

  describe('getName', () => {
    it('defaults to the class name', () => {
      expect(StateController.getName()).toEqual('StateController');
    });
  });

  describe('getNamespace', () => {
    it('defaults to null', () => {
      expect(StateController.getNamespace()).toBeNull();
    });
  });

  describe('getInstance', () => {
    it('should create one instance for each ObjectiveStore instance', () => {
      const instance = TestController.getInstance(objectiveStoreMock);
      expect(getController).toBeCalledTimes(1);
      expect(instance).toBeInstanceOf(TestController);
    });
  });

  describe('removeInstance', () => {
    it('removes instance from ObjectiveStore', () => {
      TestController.removeInstance(objectiveStoreMock);
      expect(removeController).toBeCalledTimes(1);
    });
  });

  describe('registerAction', () => {
    it('creates the action', () => {
      const instance = NamespacedTestController.getInstance(objectiveStoreMock);
      instance.unnamedAction(true);
      expect(dispatch).toHaveBeenCalledWith({ type: 'OBJECTIVE-REDUX-ACTION/NAMESPACE::TestSlice/1', payload: true });

      instance.namedAction(true);
      expect(dispatch).toHaveBeenCalledWith({
        type: 'OBJECTIVE-REDUX-ACTION/NAMESPACE::TestSlice/NAME',
        payload: true,
      });
    });
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      const instance = TestController.getInstance(objectiveStoreMock);
      const reduced = instance.reducerHandle();
      instance.reducerHandle();
      expect(reduced).toEqual(false);
    });

    it('should call unnamed mutation', () => {
      const instance = TestController.getInstance(objectiveStoreMock);
      instance.unnamedAction(true);
      const { mock: { calls: [[action]] } } = dispatch;
      const reduced = instance.reducerHandle(false, action);
      expect(reduced).toEqual(true);
    });

    it('should call named mutation', () => {
      const instance = TestController.getInstance(objectiveStoreMock);
      const reduced = instance.reducerHandle(
        false,
        { type: 'OBJECTIVE-REDUX-ACTION/::TestSlice/NAME', payload: true }
      );
      expect(reduced).toEqual(true);
    });
  });

  describe('getStateSlice', () => {
    it('returns the state slice with no namespace', () => {
      const instance = TestController.getInstance(objectiveStoreMock);
      const slice = instance.getStateSlice();
      expect(slice).toEqual(true);
    });

    it('returns the state slice with a namespace', () => {
      const instance = NamespacedTestController.getInstance(objectiveStoreMock);
      const slice = instance.getStateSlice();
      expect(slice).toEqual(false);
    });
  });

  describe('initializeOnExternalAction', () => {
    it('should store the controller for lazy-loading', () => {
      TestController.initializeOnExternalAction();
      expect(registerController).toHaveBeenCalledWith(TestController);
    });
  });

  describe('reset', () => {
    it('sets the state back to the initial state', () => {
      const instance: any = TestController.getInstance(objectiveStoreMock);
      instance.reset();
      const { mock: { calls: [[action]] } } = dispatch;
      const reducingFn = instance.reducerMap[action.type];
      expect(reducingFn()).toEqual(instance.initialState);
    });
  });
});
