// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const registerStateController = jest.fn();
const registerMock = {
  registerStateController,
};

const useRegister = jest.fn();

jest.mock('../src/use-register', () => ({
  useRegister,
}));

import { useController, StatelessController } from '../src';

class TestController extends StatelessController {
  // eslint-disable-next-line no-useless-constructor
  public constructor(register: any) {
    super(register);
  }

  public static getName(): string {
    return 'TestController';
  }
}

describe('use-controller', () => {
  it('returns an instance of the controller when there is a register', () => {
    useRegister.mockReturnValue(registerMock);
    const controller = useController(TestController);
    expect(controller).toBeInstanceOf(TestController);
  });

  it('returns null when there is not a register', () => {
    useRegister.mockReturnValue(null);
    const controller = useController(TestController);
    expect(controller).toBeNull();
  });
});
