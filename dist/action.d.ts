import { ObjectiveStore } from './';
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
    withAddressableName: (name: string) => ActionFn<Payload>;
}
/**
 * Gets an action name that can be used to fire a controller's action without using the controller.
 *
 * This can be used along with [[createAction]] to create an action.
 *
 * @param controllerName The name of the controller the action should target.
 * @param actionName The name of the registered action the action should target.
 * @param namespace The namespace of the controller. Defaults to a non-namespaced controller.
 * @returns The generated action name.
 *
 * @example
 * ```typescript
 * const action = createAction(getActionNameForController('myControllerName', 'myActionName'));
 * ```
 */
export declare function getActionNameForController(controllerName: string, actionName: string, namespace?: string): string;
/**
 * Returns a function that generates a Redux action of the form { type, payload }.
 *
 * This is particularly useful for code-splitting or for firing actions to non-Objective-Redux reducers.
 *
 * @param type The name of the action being sent.
 * @returns The action generating function.
 *
 * @example
 * ```typescript
 * // To fire an action to a reducer not managed by Objective-Redux
 * const action = createAction('myAction');
 *
 * // To fire an action to an Objective-Redux controller without using the controller
 * const action = createAction(getActionNameForController('myControllerName', 'myActionName'));
 * ```
 */
export declare function createAction<Payload>(type: string): (payload: Payload) => Action<Payload>;
/**
 * Returns a function that generates a Redux action of the form { type, payload }.
 *
 * @param type The name of the action being sent.
 * @param store The ObjectiveStore instance to which to connect.
 * @returns The action generating function.
 * @internal
 */
export declare function createConnectedAction<Payload>(type: string, store: ObjectiveStore): (payload: Payload) => Action<Payload>;
//# sourceMappingURL=action.d.ts.map