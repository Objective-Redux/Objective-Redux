// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const subscribe = jest.fn();
const registerMock = {
  subscribe,
};

const forceUpdate = jest.fn();
const useContext = jest.fn(() => registerMock);
const useReducer = jest.fn(() => [null, forceUpdate]);

jest.mock('react', () => ({
  useContext,
  useReducer,
  createContext: jest.fn(),
}));

import { useRegisterFromReactContext } from '../src';

describe('use-register-from-react-context', () => {
  describe('hook', () => {
    it('should get the register and re-render', () => {
      const register = useRegisterFromReactContext();
      expect(register).toBe(registerMock);

      const { mock: { calls: [[reducingFn]] } } = useReducer as any;
      expect(reducingFn(0)).toEqual(1);

      const { mock: { calls: [[update]] } } = subscribe;
      update();
      expect(forceUpdate).toHaveBeenCalled();
    });
  });
});
