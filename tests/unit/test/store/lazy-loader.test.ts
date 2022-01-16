// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { LazyLoader } from '../../../../src/store/lazy-loader';

const mockControllerWithReducer: any = {
  getName: () => 'TEST-CONTROLLER',
  getNamespace: () => null,
  reducer: {},
};

const mockControllerWithSaga: any = {
  getName: () => 'TEST-CONTROLLER-SAGA',
  getNamespace: () => null,
};

const namespacedMockController: any = {
  getName: () => 'TEST-CONTROLLER',
  getNamespace: () => 'NAMESPACE',
};

LazyLoader.registerController(mockControllerWithReducer);
LazyLoader.registerController(mockControllerWithSaga);
LazyLoader.registerController(namespacedMockController);

describe('LazyLoader', () => {
  describe('getControllerForAction', () => {
    it('should handle null actions', () => {
      const controller = LazyLoader.getControllerForAction(null as any);
      expect(controller).toBeNull();
    });

    it('should handle non-matching actions', () => {
      const controller = LazyLoader.getControllerForAction({
        type: 'My-Type',
      });
      expect(controller).toBeNull();
    });

    it('should return matching controller', () => {
      const controller = LazyLoader.getControllerForAction({
        type: 'OBJECTIVE-REDUX-ACTION/::TEST-CONTROLLER/SOME-ACTION',
      });
      expect(controller).toEqual(mockControllerWithReducer);
    });

    it('should return matching namespaced controller', () => {
      const controller = LazyLoader.getControllerForAction({
        type: 'OBJECTIVE-REDUX-ACTION/NAMESPACE::TEST-CONTROLLER/SOME-ACTION',
      });
      expect(controller).toEqual(namespacedMockController);
    });
  });

  describe('getController', () => {
    it('creates one instance of each controller', () => {
      class TestControllerOne {
        public static getName(): string {
          return 'A';
        }

        public static getNamespace(): string|null {
          return null;
        }

        public setObjectiveStore(): void {}

        public reducer(): any {}
      }

      class TestControllerTwo {
        public static getName(): string {
          return 'B';
        }

        public static getNamespace(): string|null {
          return 'MY_NAMESPACE';
        }

        public setObjectiveStore(): void {}
      }

      const mockObjectiveStore: any = {};
      const registerReducerFn = jest.fn();
      const unregisterReducerFn = jest.fn();
      const cancelSagasForController = jest.fn();

      LazyLoader.addObjectiveStore(
        mockObjectiveStore,
        {
          registerReducerFn,
          unregisterReducerFn,
          cancelSagasForController,
        }
      );

      const instanceOneA = LazyLoader.getController(mockObjectiveStore, TestControllerOne as any);
      const instanceOneB = LazyLoader.getController(mockObjectiveStore, TestControllerOne as any);
      expect(instanceOneA).toBeInstanceOf(TestControllerOne);
      expect(instanceOneB).toBe(instanceOneA);

      const instanceTwoA = LazyLoader.getController(mockObjectiveStore, TestControllerTwo as any);
      const instanceTwoB = LazyLoader.getController(mockObjectiveStore, TestControllerTwo as any);
      expect(instanceTwoA).toBeInstanceOf(TestControllerTwo);
      expect(instanceTwoB).toBe(instanceTwoA);

      expect(registerReducerFn).toBeCalledTimes(1);
      expect(unregisterReducerFn).toBeCalledTimes(0);
      expect(cancelSagasForController).toBeCalledTimes(0);
    });
  });

  describe('removeController', () => {
    it('removes a controller with a reducer', () => {
      const mockObjectiveStore: any = {};
      const registerReducerFn = jest.fn();
      const unregisterReducerFn = jest.fn();
      const cancelSagasForController = jest.fn();

      LazyLoader.addObjectiveStore(
        mockObjectiveStore,
        {
          registerReducerFn,
          unregisterReducerFn,
          cancelSagasForController,
        }
      );

      const map = {
        '': {
          'TEST-CONTROLLER': mockControllerWithReducer,
        },
      };
      (LazyLoader as any).controllers.set(mockObjectiveStore, map);

      LazyLoader.removeController(mockObjectiveStore, mockControllerWithReducer);
      expect(unregisterReducerFn).toBeCalledWith(mockControllerWithReducer);
    });

    it('removes a controller with a saga', () => {
      const mockObjectiveStore: any = {};
      const registerReducerFn = jest.fn();
      const unregisterReducerFn = jest.fn();
      const cancelSagasForController = jest.fn();

      LazyLoader.addObjectiveStore(
        mockObjectiveStore,
        {
          registerReducerFn,
          unregisterReducerFn,
          cancelSagasForController,
        }
      );

      const map = {
        '': {
          'TEST-CONTROLLER-SAGA': mockControllerWithSaga,
        },
      };
      (LazyLoader as any).controllers.set(mockObjectiveStore, map);

      LazyLoader.removeController(mockObjectiveStore, mockControllerWithSaga);
      expect(cancelSagasForController).toBeCalledWith(mockControllerWithSaga);
    });

    it('does nothing when the store is not found', () => {
      const mockObjectiveStore: any = {};
      LazyLoader.removeController(mockObjectiveStore, mockControllerWithSaga);
    });

    it('does nothing when the controller is not found', () => {
      const mockObjectiveStore: any = {};
      const registerReducerFn = jest.fn();
      const unregisterReducerFn = jest.fn();
      const cancelSagasForController = jest.fn();

      LazyLoader.addObjectiveStore(
        mockObjectiveStore,
        {
          registerReducerFn,
          unregisterReducerFn,
          cancelSagasForController,
        }
      );

      const map = {};
      (LazyLoader as any).controllers.set(mockObjectiveStore, map);

      LazyLoader.removeController(mockObjectiveStore, mockControllerWithSaga);
      expect(unregisterReducerFn).toBeCalledTimes(0);
      expect(cancelSagasForController).toBeCalledTimes(0);
    });
  });
});
