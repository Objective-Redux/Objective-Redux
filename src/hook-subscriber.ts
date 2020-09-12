// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { ObjectiveStore } from './objective-store';

type UpdateFn = (() => void);

/**
 * @internal
 */
export class HookSubscriber {
  private readonly store: ObjectiveStore|null;

  private readonly updateFn: UpdateFn;

  private unsubscribeFn: UpdateFn|null;

  public constructor(store: ObjectiveStore|null, updateFn: UpdateFn) {
    this.store = store;
    this.updateFn = updateFn;
    this.unsubscribeFn = null;
  }

  public subscribe(): void {
    if (!this.unsubscribeFn && this.store) {
      this.unsubscribeFn = this.store.subscribe(this.updateFn);
    }
  }

  public unsubscribe(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
      this.unsubscribeFn = null;
    }
  }
}
