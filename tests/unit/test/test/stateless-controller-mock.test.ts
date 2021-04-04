// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { mocked } from '../../../../src/test/index';
import { configureTakeEvery } from '../../../../dist';

describe('StatelessControllerMock', () => {
  describe('buildSaga', () => {
    it('returns full data', () => {
      const controller: any = new mocked.StatelessController();
      const sagaFn = (): any => {};
      const mockFn = controller.buildSaga({
        name: 'TEST',
        effectBuilder: configureTakeEvery(),
        sagaFn,
      });
      expect(mockFn.actionName).toEqual('TEST');
      expect(mockFn.effectType).toEqual('TAKE_EVERY');
      expect(mockFn).toEqual(sagaFn);
    });

    it('returns partial data', () => {
      const controller: any = new mocked.StatelessController();
      const sagaFn = (): any => {};
      const mockFn = controller.buildSaga({
        sagaFn,
      });
      expect(mockFn.actionName).toBeUndefined();
      expect(mockFn.effectType).toBeUndefined();
      expect(mockFn).toEqual(sagaFn);
    });
  });
});
