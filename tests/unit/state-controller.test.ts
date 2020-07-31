// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const dispatch = jest.fn();
const reduxRegisterMock: any = {
  dispatch,
  getState: (): any => ({
    TestSlice: true,
    NAMESPACE: {
      TestSlice: false,
    },
  }),
};

const registerController = jest.fn();
const getController = jest.fn((register, CClass) => new CClass(register));

jest.mock('../../src/lazy-loader', () => ({
  LazyLoader: {
    registerController,
    getController,
  },
}));

import { StateController } from '../../src';

class TestController extends StateController<boolean> {
  public constructor(register: any) {
    super(false, register);
  }

  public static getName(): string {
    return 'TestSlice';
  }

  public readonly unnamedAction = this.registerAction<boolean>(
    (state, payload) => payload
  );

  public readonly namedAction = this.registerAction<boolean>(
    (state, payload) => payload
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
    it('should register the reducer', () => {
      const instance = new TestController(reduxRegisterMock);
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
    it('should create one instance for each register', () => {
      const instance = TestController.getInstance(reduxRegisterMock);
      expect(getController).toBeCalledTimes(1);
      expect(instance).toBeInstanceOf(TestController);
    });
  });

  describe('registerAction', () => {
    const instance = NamespacedTestController.getInstance(reduxRegisterMock);
    instance.unnamedAction(true);
    expect(dispatch).toHaveBeenCalledWith({ type: 'OBJECTIVE-REDUX-ACTION/NAMESPACE::TestSlice/0', payload: true });

    instance.namedAction(true);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'OBJECTIVE-REDUX-ACTION/NAMESPACE::TestSlice/NAME',
      payload: true,
    });
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      const instance = TestController.getInstance(reduxRegisterMock);
      const reduced = instance.reducerHandle();
      instance.reducerHandle();
      expect(reduced).toEqual(false);
    });

    it('should call unnamed mutation', () => {
      const instance = TestController.getInstance(reduxRegisterMock);
      instance.unnamedAction(true);
      const { mock: { calls: [[action]] } } = dispatch;
      const reduced = instance.reducerHandle(false, action);
      expect(reduced).toEqual(true);
    });

    it('should call named mutation', () => {
      const instance = TestController.getInstance(reduxRegisterMock);
      const reduced = instance.reducerHandle(
        false,
        { type: 'OBJECTIVE-REDUX-ACTION/::TestSlice/NAME', payload: true }
      );
      expect(reduced).toEqual(true);
    });
  });

  describe('getStateSlice', () => {
    it('returns the state slice with no namespace', () => {
      const instance = TestController.getInstance(reduxRegisterMock);
      const slice = instance.getStateSlice();
      expect(slice).toEqual(true);
    });

    it('returns the state slice with a namespace', () => {
      const instance = NamespacedTestController.getInstance(reduxRegisterMock);
      const slice = instance.getStateSlice();
      expect(slice).toEqual(false);
    });
  });

  describe('initializeOnExternalAction', () => {
    it('should register the controller for lazy-loading', () => {
      TestController.initializeOnExternalAction();
      expect(registerController).toHaveBeenCalledWith(TestController);
    });
  });
});
