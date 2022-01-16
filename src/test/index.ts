// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

/* istanbul ignore file */

import { ObjectiveStore } from '../store/objective-store';
import { ReducerInjector } from '../store/reducer-injector';
import { StateController } from '../controllers/state-controller';
import { StatelessController } from '../controllers/stateless-controller';
import { createAction, getActionNameForController } from '../helpers/action';
import { ObjectiveStoreProvider } from '../components/objective-store-provider';
import { ComponentConnector } from '../components/component-connector';
import { getObjectiveStoreFromSagaContext } from '../hooks/get-objective-store-from-saga-context';
import { getControllerFromSagaContext } from '../hooks/get-controller-from-saga-context';
import { useObjectiveStore } from '../hooks/use-objective-store';
import { useController } from '../hooks/use-controller';
import { useSelector } from '../hooks/use-selector';
import {
  configureTakeLatest,
  configureTakeEvery,
  configureTakeLeading,
  configureDebounce,
  configureTake,
} from '../helpers/effect-type';
import { StatelessControllerMock } from './stateless-controller-mock';
import { StateControllerMock } from './state-controller-mock';

export const actual = {
  ObjectiveStore,
  ReducerInjector,
  StateController,
  StatelessController,
  createAction,
  getActionNameForController,
  ObjectiveStoreProvider,
  ComponentConnector,
  getObjectiveStoreFromSagaContext,
  getControllerFromSagaContext,
  useObjectiveStore,
  useController,
  useSelector,
  configureTakeLatest,
  configureTakeEvery,
  configureTakeLeading,
  configureDebounce,
  configureTake,
};

export const mocked = {
  StatelessController: StatelessControllerMock,
  StateController: StateControllerMock,
};
