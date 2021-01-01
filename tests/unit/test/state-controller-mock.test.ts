// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { StateController } from '../../../src/test/index';

const testMutationOne = (): any => {};
const testMutationTwo = (): any => {};
const testName = 'SAMPLE_NAME';

class TestController extends StateController<any> {
  public constructor() {
    super(null, {} as any);
  }

  public myAction = this.registerAction(testMutationOne);

  public myActionWithName = this.registerAction(testMutationTwo)
    .withAddressableName(testName);
}

describe('StateControllerMock', () => {
  describe('registerAction', () => {
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
