// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
import * as React from 'react';
import { ObjectiveStore } from './objective-store';

/**
 * @internal
 */
export const ObjectiveStoreProviderContext = React.createContext<ObjectiveStore|null>(null);
