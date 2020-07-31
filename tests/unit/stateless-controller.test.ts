// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

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

const getController = jest.fn((register, CClass) => new CClass(register));
jest.mock('../../src/lazy-loader', () => ({
  LazyLoader: {
    getController,
  },
}));

import { SagaBuilder } from '../../src/stateless-controller';
import {
  StatelessController,
  configureTakeLatest,
  configureTakeEvery,
  configureTakeLeading,
  configureDebounce,
} from '../../src';
import { EffectBuilder } from '../../src/effect-type';

class TestController extends StatelessController {
  // eslint-disable-next-line no-useless-constructor
  public constructor(register: any) {
    super(register);
  }

  public static getName(): string {
    return 'test-saga';
  }

  public static getNamespace(): string {
    return 'MyNamespace';
  }

  public createSagaHandle<T>(): SagaBuilder<T> {
    return this.createSaga();
  }
}

function* testSaga(): Generator {
  //
}

describe('stateless-controller', () => {
  describe('getName', () => {
    it('defaults to the class name', () => {
      expect(StatelessController.getName()).toEqual('StatelessController');
    });
  });

  describe('getNamespace', () => {
    it('defaults to null', () => {
      expect(StatelessController.getNamespace()).toBeNull();
    });
  });

  describe('getInstance', () => {
    it('should create only one instance per register', () => {
      const reduxRegisterMock: any = { registerSaga };
      const instance = TestController.getInstance(reduxRegisterMock);
      expect(getController).toBeCalledTimes(1);
      expect(instance).toBeInstanceOf(TestController);
    });
  });

  describe('createSaga', () => {
    function checkSaga(effectBuilder: EffectBuilder, verify: () => void): void {
      const reduxRegisterMock: any = { registerSaga };
      const instance = TestController.getInstance(reduxRegisterMock);
      instance.createSagaHandle()
        .withEffect(effectBuilder)
        .register(testSaga);

      expect(registerSaga).toHaveBeenCalled();

      const { mock: { calls: [[saga]] } } = registerSaga;
      saga().next();

      verify();
    }

    it('should create saga with takeLatest', () => {
      checkSaga(
        configureTakeLatest(),
        () => expect(takeLatest).toHaveBeenCalledWith('OBJECTIVE-REDUX-ACTION/MyNamespace::test-saga/0', testSaga)
      );
    });

    it('should create saga with takeEvery', () => {
      checkSaga(
        configureTakeEvery(),
        () => expect(takeEvery).toHaveBeenCalledWith('OBJECTIVE-REDUX-ACTION/MyNamespace::test-saga/0', testSaga)
      );
    });

    it('should create saga with takeLeading', () => {
      checkSaga(
        configureTakeLeading(),
        () => expect(takeLeading).toHaveBeenCalledWith('OBJECTIVE-REDUX-ACTION/MyNamespace::test-saga/0', testSaga)
      );
    });

    it('should create saga with debounce', () => {
      const debounceTime = 1000;
      checkSaga(
        configureDebounce({ debounceTime }),
        () => expect(debounce).toHaveBeenCalledWith(
          debounceTime,
          'OBJECTIVE-REDUX-ACTION/MyNamespace::test-saga/0',
          testSaga
        )
      );
    });

    it('should create saga with debounce and no config', () => {
      const debounceTime = 0;
      checkSaga(
        configureDebounce({} as any),
        () => expect(debounce).toHaveBeenCalledWith(
          debounceTime,
          'OBJECTIVE-REDUX-ACTION/MyNamespace::test-saga/0',
          testSaga
        )
      );
    });

    it('should create saga with debounce and empty config', () => {
      const debounceTime = 0;
      checkSaga(
        configureDebounce(null as any),
        () => expect(debounce).toHaveBeenCalledWith(
          debounceTime,
          'OBJECTIVE-REDUX-ACTION/MyNamespace::test-saga/0',
          testSaga
        )
      );
    });

    it('should name actions', () => {
      const reduxRegisterMock: any = { registerSaga };
      const instance = TestController.getInstance(reduxRegisterMock);
      instance.createSagaHandle()
        .withEffect(configureTakeLeading())
        .withAddressableName('NAME')
        .register(testSaga);
      const { mock: { calls: [[saga]] } } = registerSaga;
      saga().next();
      expect(takeLeading).toHaveBeenCalledWith('OBJECTIVE-REDUX-ACTION/MyNamespace::test-saga/NAME', testSaga);
    });

    it('should create saga without effect', () => {
      const reduxRegisterMock: any = { registerSaga };
      const instance = TestController.getInstance(reduxRegisterMock);
      instance.createSagaHandle()
        .register(testSaga);
      expect(registerSaga).toHaveBeenCalledWith(testSaga);
    });
  });
});
