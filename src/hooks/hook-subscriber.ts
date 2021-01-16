// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { deepEquals } from '../helpers/deep-equals';
import { ObjectiveStore } from '../store/objective-store';

type UpdateFn = (() => void);

/**
 * @internal
 */
export class HookSubscriber {
  private readonly objectiveStore: ObjectiveStore|null;

  private readonly getSlice: () => any;

  private readonly updateFn: UpdateFn;

  private unsubscribeFn: UpdateFn|null;

  private previousSlice: any;

  // eslint-disable-next-line max-params
  public constructor(
    objectiveStore: ObjectiveStore|null,
    getSlice: () => any,
    updateFn: UpdateFn
  ) {
    this.objectiveStore = objectiveStore;
    this.getSlice = getSlice;
    this.updateFn = updateFn;
    this.unsubscribeFn = null;
    this.previousSlice = this.getSlice();
  }

  public subscribe(): void {
    if (!this.unsubscribeFn && this.objectiveStore) {
      this.unsubscribeFn = this.objectiveStore.subscribe(() => {
        const slice = this.getSlice();
        if (!deepEquals(this.previousSlice, slice)) {
          this.previousSlice = slice;
          this.updateFn();
        }
      });
    }
  }

  public unsubscribe(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
      this.unsubscribeFn = null;
    }
  }
}
