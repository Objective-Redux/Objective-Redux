// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { LazyLoader } from '../../src/lazy-loader';

const mockController: any = {
  getName: () => 'TEST-CONTROLLER',
  getNamespace: () => null,
};

const namespacedMockController: any = {
  getName: () => 'TEST-CONTROLLER',
  getNamespace: () => 'NAMESPACE',
};

LazyLoader.registerController(mockController);
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
      expect(controller).toEqual(mockController);
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

        public reducer(): any {}
      }

      class TestControllerTwo {
        public static getName(): string {
          return 'B';
        }

        public static getNamespace(): string|null {
          return 'MY_NAMESPACE';
        }
      }

      const mockRegister: any = {};
      const registerReducerFn = jest.fn();

      LazyLoader.addRegister(mockRegister, registerReducerFn);

      const instanceOneA = LazyLoader.getController(mockRegister, TestControllerOne as any);
      const instanceOneB = LazyLoader.getController(mockRegister, TestControllerOne as any);
      expect(instanceOneA).toBeInstanceOf(TestControllerOne);
      expect(instanceOneB).toBe(instanceOneA);

      const instanceTwoA = LazyLoader.getController(mockRegister, TestControllerTwo as any);
      const instanceTwoB = LazyLoader.getController(mockRegister, TestControllerTwo as any);
      expect(instanceTwoA).toBeInstanceOf(TestControllerTwo);
      expect(instanceTwoB).toBe(instanceTwoA);

      expect(registerReducerFn).toBeCalledTimes(1);
    });
  });
});
