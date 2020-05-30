// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
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
