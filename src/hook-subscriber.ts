// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { ReduxRegister } from './redux-register';

type UpdateFn = (() => void);

/**
 * @internal
 */
export class HookSubscriber {
  private readonly register: ReduxRegister|null;

  private readonly updateFn: UpdateFn;

  private unsubscribeFn: UpdateFn|null;

  public constructor(register: ReduxRegister|null, updateFn: UpdateFn) {
    this.register = register;
    this.updateFn = updateFn;
    this.unsubscribeFn = null;
  }

  public subscribe(): void {
    if (!this.unsubscribeFn && this.register) {
      this.unsubscribeFn = this.register.subscribe(this.updateFn);
    }
  }

  public unsubscribe(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
      this.unsubscribeFn = null;
    }
  }
}
