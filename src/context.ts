// ================================================================================================
//                                          Objective Redux
//                 (c) Copyright 2020 by Jason Mace (jmace01). All rights reserved.
//
// This code is provided under the terms of the [object Object] license. See the LICENSE file for
// terms.
// ================================================================================================
import * as React from 'react';
import { ReduxRegister } from './';

/**
 * @internal
 */
export const RegisterProviderContext = React.createContext<ReduxRegister|null>(null);
