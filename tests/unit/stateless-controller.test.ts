// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
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

const getController = jest.fn((objectiveStore, CClass) => {
  const instance = new CClass();
  instance.setObjectiveStore(objectiveStore);
  return instance;
});
const removeController = jest.fn();

jest.mock('../../src/lazy-loader', () => ({
  LazyLoader: {
    getController,
    removeController,
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
  public constructor() {
    super();
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
    it('should create only one instance per ObjectiveStore instance', () => {
      const objectiveStoreMock: any = { registerSaga };
      const instance = TestController.getInstance(objectiveStoreMock);
      expect(getController).toBeCalledTimes(1);
      expect(instance).toBeInstanceOf(TestController);
    });
  });

  describe('removeInstance', () => {
    it('removes instance from ObjectiveStore', () => {
      const objectiveStoreMock: any = { };
      TestController.removeInstance(objectiveStoreMock);
      expect(removeController).toBeCalledTimes(1);
    });
  });

  describe('createSaga', () => {
    function checkSaga(effectBuilder: EffectBuilder, verify: () => void): void {
      const objectiveStoreMock: any = { registerSaga };
      const instance = TestController.getInstance(objectiveStoreMock);
      instance.createSagaHandle()
        .withEffect(effectBuilder)
        .register(testSaga);
      // Calling this to force the saga to be registered/started.
      // Normally, this happens when the object is initialized; but because we are adding the saga
      // dynamically after initialization, we have to manually call this to complete the setup.
      instance.setObjectiveStore(objectiveStoreMock);

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
      const objectiveStoreMock: any = { registerSaga, dispatch: jest.fn() };
      const instance = TestController.getInstance(objectiveStoreMock);
      const action = instance.createSagaHandle<void>()
        .withEffect(configureTakeLeading())
        .withAddressableName('NAME')
        .register(testSaga);
      // Manually calling. See previous comment.
      instance.setObjectiveStore(objectiveStoreMock);
      const { mock: { calls: [[saga]] } } = registerSaga;
      saga().next();
      expect(takeLeading).toHaveBeenCalledWith('OBJECTIVE-REDUX-ACTION/MyNamespace::test-saga/NAME', testSaga);
      action();
      expect(objectiveStoreMock.dispatch).toBeCalled();
    });

    it('should create saga without effect', () => {
      const objectiveStoreMock: any = { registerSaga };
      const instance = TestController.getInstance(objectiveStoreMock);
      instance.createSagaHandle()
        .register(testSaga);
      // Manually calling. See previous comment.
      instance.setObjectiveStore(objectiveStoreMock);
      expect(registerSaga).toHaveBeenCalledWith(testSaga, instance);
    });
  });
});
