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
import { ReducerInjector } from './reducer-injector';
import { StateController } from './state-controller';
import { StatelessController } from './stateless-controller';
import { createAction, getActionNameForController } from './action';
import { RegisterProvider } from './register-provider';
import { ComponentConnector } from './component-connector';
import { getRegisterFromSagaContext } from './get-register-from-saga-context';
import { getControllerFromSagaContext } from './get-controller-from-saga-context';
import { useRegister } from './use-register';
import { useController } from './use-controller';
import {
  configureTakeLatest,
  configureTakeEvery,
  configureTakeLeading,
  configureDebounce,
} from './take-type';
import { ControllerNameNotDefined } from './controllernamenotdefined';

export {
  ReduxRegister,
  ReducerInjector,
  StateController,
  StatelessController,
  createAction,
  RegisterProvider,
  ComponentConnector,
  getRegisterFromSagaContext,
  getControllerFromSagaContext,
  useRegister,
  useController,
  getActionNameForController,
  configureTakeLatest,
  configureTakeEvery,
  configureTakeLeading,
  configureDebounce,
  ControllerNameNotDefined,
};
