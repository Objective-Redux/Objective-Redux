// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { createAction } from '../../src';
import { createConnectedAction, getActionNameForController } from '../../src/action';

const type = 'MY_ACTION';
const payload = 10;

describe('action', () => {
  describe('getActionNameForController', () => {
    it('should generate the correctly formatted action name', () => {
      expect(getActionNameForController('controller/name', 'action-name'))
        .toEqual('OBJECTIVE-REDUX-ACTION/::controller-name/action-name');
    });

    it('should generate the correctly formatted action name', () => {
      expect(getActionNameForController('controller/name', 'action-name', 'NAMESPACE'))
        .toEqual('OBJECTIVE-REDUX-ACTION/NAMESPACE::controller-name/action-name');
    });
  });

  describe('createAction', () => {
    it('should return function that creates action', () => {
      const action = createAction<number>(type);
      expect(action(payload)).toEqual({ type, payload });
    });
  });

  describe('createConnectedAction', () => {
    it('should return function that dispatches an action', () => {
      const objectiveStore: any = {
        dispatch: jest.fn(),
      };
      createConnectedAction<number>(type, objectiveStore)(payload);
      expect(objectiveStore.dispatch).toBeCalledWith({ type, payload });
    });
  });
});
