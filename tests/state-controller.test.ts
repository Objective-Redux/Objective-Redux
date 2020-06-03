// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const counter = jest.fn();
const registerReducer: any = jest.fn();
const dispatch = jest.fn();
const storeMock = {
  dispatch,
  getState: (): any => ({ TestSlice: true }),
};
const reduxRegisterMock: any = {
  registerReducer,
  getStore: () => storeMock,
};

import { StateController } from '../src';

class TestController extends StateController<boolean> {
  public constructor(register: any) {
    super('TestSlice', false, register);
    counter();
  }

  public readonly unnamedAction = this.registerAction<boolean>(
    (state, payload) => payload
  );

  public readonly namedAction = this.registerAction<boolean>(
    (state, payload) => payload
  ).withAddressableName('NAME');

  public readonly reducerHandle = this.reducer.bind(this);
}

describe('state-controller', () => {
  describe('constructor', () => {
    it('should register the reducer', () => {
      const instance = new TestController(reduxRegisterMock);
      expect(instance).toBeInstanceOf(TestController);
      expect(registerReducer).toHaveBeenCalled();
    });
  });

  describe('getInstance', () => {
    it('should create one instance for each register', () => {
      const reduxRegisterMock1: any = {
        registerReducer,
      };

      const reduxRegisterMock2: any = {
        registerReducer,
      };

      TestController.getInstance(reduxRegisterMock1);
      expect(counter).toBeCalledTimes(1);

      TestController.getInstance(reduxRegisterMock1);
      expect(counter).toBeCalledTimes(1);

      TestController.getInstance(reduxRegisterMock2);
      expect(counter).toBeCalledTimes(2);

      TestController.getInstance(reduxRegisterMock2);
      expect(counter).toBeCalledTimes(2);
    });
  });

  describe('registerAction', () => {
    const instance = TestController.getInstance(reduxRegisterMock);
    instance.unnamedAction(true);
    expect(dispatch).toHaveBeenCalledWith({ type: 'ACTIONS/TestSlice/0', payload: true });

    instance.namedAction(true);
    expect(dispatch).toHaveBeenCalledWith({ type: 'NAME', payload: true });
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
      const reduced = instance.reducerHandle(false, { type: 'NAME', payload: true });
      expect(reduced).toEqual(true);
    });
  });

  describe('getStateSlice', () => {
    it('should return the state slice', () => {
      const instance = TestController.getInstance(reduxRegisterMock);
      const slice = instance.getStateSlice();
      expect(slice).toBeTruthy();
    });
  });
});
