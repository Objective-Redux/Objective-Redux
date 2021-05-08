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

const testMutationOne = (): any => {};
const testMutationTwo = (): any => {};
const testName = 'SAMPLE_NAME';

class TestController extends mocked.StateController<any> {
  public constructor() {
    super(null);
  }

  public myAction = this.createReducingAction(testMutationOne);

  public myActionWithName = this.createReducingAction(testMutationTwo)
    .withAddressableName(testName);
}

describe('StateControllerMock', () => {
  describe('createReducingAction', () => {
    it('returns the mutation function when withAddressableName is not called', () => {
      const controller: any = new TestController();
      expect(controller.myAction).toEqual(testMutationOne);
      expect(controller.myAction.actionName).toBeUndefined();
    });

    it('returns the mutation function when withAddressableName is called', () => {
      const controller: any = new TestController();
      expect(controller.myActionWithName).toEqual(testMutationTwo);
      expect(controller.myActionWithName.actionName).toEqual(testName);
    });
  });
});
