// ================================================================================================
//                                          Objective Redux
//                 (c) Copyright 2020 by Jason Mace (jmace01). All rights reserved.
//
// This code is provided under the terms of the [object Object] license. See the LICENSE file for
// terms.
// ================================================================================================
import { ReduxRegister } from './';

/**
 * @internal
 */
export interface Action<T> {
  type: string;
  payload?: T;
}

/**
 * @internal
 */
export interface ActionFn<Payload> {
  (payload: Payload): Action<Payload>;
}

/**
 * @internal
 */
export interface ActionExtendFn<Payload> extends ActionFn<Payload> {
  withAddressableName?: (name: string) => ActionFn<Payload>;
}

/**
 * Returns a function that generates a Redux action of the form { type, payload }.
 *
 * @param type The name of the action being sent.
 * @returns The action generating function.
 */
export function createAction<Payload>(type: string): (payload: Payload) => Action<Payload> {
  return (payload: Payload): Action<Payload> => ({
    type,
    payload,
  });
}

/**
 * Returns a function that generates a Redux action of the form { type, payload }.
 *
 * @param type The name of the action being sent.
 * @param register The ReduxRegister instance to which to connect.
 * @returns The action generating function.
 * @internal
 */
export function createConnectedAction<Payload>(type: string, register: ReduxRegister):
  (payload: Payload) => Action<Payload> {
  return (payload: Payload): Action<Payload> => register.getStore().dispatch({
    type,
    payload,
  });
}
