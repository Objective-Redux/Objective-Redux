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
const registerSaga = jest.fn((fn): Generator => fn());
const takeLatest = jest.fn();
const takeEvery = jest.fn();
const takeLeading = jest.fn();
const debounce = jest.fn();

jest.mock('redux-saga/effects', () => ({
  takeLatest,
  takeEvery,
  takeLeading,
  debounce,
}));

import { SagaBuilder, TakeConfig } from '../src/stateless-controller';
import { TakeType, StatelessController } from '../src';

class TestController extends StatelessController {
  public constructor(register: any) {
    super(register);
    counter();
  }

  public createSagaHandle<T>(): SagaBuilder<T> {
    return this.createSaga();
  }
}

function* testSaga(): Generator {
  //
}

describe('stateless-controller', () => {
  describe('getInstance', () => {
    it('should create only one instance per register', () => {
      const reduxRegisterMock1: any = {};
      const reduxRegisterMock2: any = {};

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

  describe('createSaga', () => {
    // eslint-disable-next-line max-params
    function checkSaga(type: TakeType, mock: jest.Mock, config: TakeConfig|null = null): void {
      const reduxRegisterMock: any = { registerSaga };
      const instance = TestController.getInstance(reduxRegisterMock);
      instance.createSagaHandle()
        .withTake(type, config)
        .register(testSaga);

      expect(registerSaga).toHaveBeenCalled();

      const { mock: { calls: [[saga]] } } = registerSaga;
      saga().next();

      if (config && config.debounceTime) {
        expect(mock).toHaveBeenCalledWith(config.debounceTime, 'SAGA/0', testSaga);
      } else if (type === TakeType.DEBOUNCE) {
        expect(mock).toHaveBeenCalledWith(0, 'SAGA/0', testSaga);
      } else {
        expect(mock).toHaveBeenCalledWith('SAGA/0', testSaga);
      }
    }

    it('should create saga with takeLatest', () => {
      checkSaga(TakeType.TAKE_LATEST, takeLatest);
    });

    it('should create saga with takeEvery', () => {
      checkSaga(TakeType.TAKE_EVERY, takeEvery);
    });

    it('should create saga with takeLeading', () => {
      checkSaga(TakeType.TAKE_LEADING, takeLeading);
    });

    it('should create saga with debounce', () => {
      checkSaga(TakeType.DEBOUNCE, debounce, { debounceTime: 1000 });
    });

    it('should create saga with debounce and no config', () => {
      checkSaga(TakeType.DEBOUNCE, debounce);
    });

    it('should create saga with debounce and empty config', () => {
      checkSaga(TakeType.DEBOUNCE, debounce, {} as any);
    });

    it('should throw an exception on invalid take type', () => {
      const reduxRegisterMock: any = { registerSaga };
      const instance = TestController.getInstance(reduxRegisterMock);

      try {
        instance.createSagaHandle()
          .withTake(99)
          .register(testSaga);
        expect(false).toEqual(true);
      } catch (e) {
        //
      }
    });

    it('should name actions', () => {
      const reduxRegisterMock: any = { registerSaga };
      const instance = TestController.getInstance(reduxRegisterMock);
      instance.createSagaHandle()
        .withTake(TakeType.TAKE_LEADING)
        .withAddressableName('NAME')
        .register(testSaga);
      const { mock: { calls: [[saga]] } } = registerSaga;
      saga().next();
      expect(takeLeading).toHaveBeenCalledWith('NAME', testSaga);
    });

    it('should create saga without take', () => {
      const reduxRegisterMock: any = { registerSaga };
      const instance = TestController.getInstance(reduxRegisterMock);
      instance.createSagaHandle()
        .register(testSaga);
      expect(registerSaga).toHaveBeenCalledWith(testSaga);
    });
  });
});
