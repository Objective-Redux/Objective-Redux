import { ReduxRegister } from "./";

export interface Action<T> {
  type: string;
  payload?: T;
}

export interface ActionFn<Payload> {
  (payload: Payload): Action<Payload>;
}

export interface ActionExtendFn<Payload> extends ActionFn<Payload> {
  withAddressableName?: (name: string) => ActionFn<Payload>;
}

/**
 * Returns a function that generates a Redux action of the form { type, payload }
 * @param type the name of the action being sent
 * @returns the action generating function
 */
export function createAction<Payload>(type: string): (payload: Payload) => Action<Payload> {
  return (payload: Payload): Action<Payload> => ({
    type,
    payload,
  });
}

/**
 * Returns a function that generates a Redux action of the form { type, payload }
 * @param type the name of the action being sent
 * @returns the action generating function
 */
export function createConnectedAction<Payload>(type: string, register: ReduxRegister): (payload: Payload) => Action<Payload> {
  return (payload: Payload) => register.getStore().dispatch({
    type,
    payload,
  });
}
