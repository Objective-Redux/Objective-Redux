// ================================================================================================
//                                          Objective Redux
//                 (c) Copyright 2020 by Jason Mace (jmace01). All rights reserved.
//
// This code is provided under the terms of the [object Object] license. See the LICENSE file for
// terms.
// ================================================================================================
export enum TakeType {
  /**
   * Represents a takeLatest watcher.
   */
  TAKE_LATEST,
  /**
   * Represents a takeEvery watcher.
   */
  TAKE_EVERY,
  /**
   * Represents a takeLeading watcher.
   */
  TAKE_LEADING,
  /**
   * Represents a debounce watcher.
   */
  DEBOUNCE,
}
