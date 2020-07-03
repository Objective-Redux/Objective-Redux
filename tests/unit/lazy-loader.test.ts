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
};

LazyLoader.registerController(mockController);

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
        type: 'OBJECTIVE-REDUX-ACTION/TEST-CONTROLLER/SOME-ACTION',
      });
      expect(controller).toEqual(mockController);
    });
  });

  describe('getController', () => {
    it('created one instance of each controller', () => {
      class TestControllerOne {
        public reducer(): any {}

        public static getName(): string {
          return 'A';
        }
      }

      class TestControllerTwo {
        public static getName(): string {
          return 'B';
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
