import { ObjectiveStore } from '../store/objective-store';
/**
 * @internal
 */
export declare type ModelConstructor<T> = new (objectiveStore: ObjectiveStore) => T;
/**
 * @internal
 */
export declare abstract class Controller {
    private count;
    /**
     * The ReduxController to which the controller belongs.
     */
    protected objectiveStore: ObjectiveStore | null;
    protected constructor();
    /**
     * Gets the unique name of the controller. By default, the name of the class.
     *
     * The name of the controller should be globally unique for all Objective-Redux controllers in the application.
     *
     * @returns The name of the state slice.
     */
    static getName(): string;
    /**
     * Creates groupings of controllers and state slices. This helps prevent naming collisions, because names only need
     * to be unique within a namespace.
     *
     * In addition, for StateControllers, the slice of state in the store is also saved into an object of the namespace
     * name.
     *
     * Note that falsy values like null and '' will evaluate to the same empty namespace.
     *
     * @returns Null if the state is not namespaced.
     *
     * @example
     * ```typescript
     * // For StateControllers, the namespace also groups slices in the store.
     *
     * class MyFirstController extends StateController {
     *   // ...
     *
     *   static getName() {
     *     return 'MY_FIRST_CONTROLLER';
     *   }
     *
     *   static getNamespace() {
     *     return 'MY_NAMESPACE';
     *   }
     *
     *   // ...
     * }
     *
     * class MySecondController extends StateController {
     *   // ...
     *
     *   static getName() {
     *     return 'MY_SECOND_CONTROLLER';
     *   }
     *
     *   static getNamespace() {
     *     return 'MY_NAMESPACE';
     *   }
     *
     *   // ...
     * }
     *
     * // Creates a state of the form:
     * //
     * // {
     * //   MY_NAMESPACE: {
     * //     MY_FIRST_CONTROLLER: {
     * //       // ...
     * //     },
     * //     MY_SECOND_CONTROLLER: {
     * //       // ...
     * //     },
     * //   },
     * // }
     * ```
     */
    static getNamespace(): string | null;
    /**
     * Sets the objective store for the controller.
     *
     * @param objectiveStore The objective store the controller should use.
     *
     * @internal
     */
    setObjectiveStore(objectiveStore: ObjectiveStore): void;
    /**
     * Generates a unique, default action name.
     *
     * @param name The name of the action or null to generate a unique, default action name.
     * @returns An action name.
     */
    protected createActionName(name?: string | null): string;
    /**
     * Gets an instance of the class, creating one if it does not yet exist.
     *
     * This should be used as the method of instantiating controllers.
     *
     * @template T the controller type. Will be inferred from the class instance and does not need to be provided.
     * @param this Implicit "this" for internal use. When calling, this parameter should be ignored/skipped.
     * @param objectiveStore An instance of the ObjectiveStore from which to get the controller.
     * @returns An instance of the controller.
     *
     * @example
     * ```typescript
     * const instance = MyController.getInstance(objectiveStore);
     * ```
     */
    static getInstance<T extends Controller>(this: typeof Controller & ModelConstructor<T>, objectiveStore: ObjectiveStore): T;
    /**
     * Removes the instance of the controller from the store. This will unregister reducers any stop saga associated with
     * the controller.
     *
     * @param this Implicit "this" for internal use. When calling, this parameter should be ignored/skipped.
     * @param objectiveStore An instance of the ObjectiveStore from which to get the controller.
     *
     * @example
     * ```typescript
     * MyController.removeInstance(objectiveStore);
     * ```
     */
    static removeInstance<T extends Controller>(this: typeof Controller & ModelConstructor<T>, objectiveStore: ObjectiveStore): void;
    /**
     * Allows the controller to be lazy loaded by actions triggered outside of Objective-Redux.
     *
     * In order for calls to be routed to the controller without using the controller directly, and thus to lazy-load
     * without using the controller directly, this needs to be used in conjunction with the method
     * [[withAddressableName]].
     *
     * @param this Implicit "this" parameter, which does not need to be supplied.
     * @example
     * ```typescript
     * class MyController extends StateController<MySliceType> {
     *   public static getName() {
     *     return 'MY_CONTROLLER';
     *   }
     *
     *   action = this.createReducingAction(
     *     (state, payload) => ({
     *       ...state,
     *       ...payload,
     *     })
     *   ).withAddressableName('MY_ACTION'); // <-- also required
     * }
     *
     * MyController.initializeOnExternalAction();
     *
     * export MyController;
     *
     * // ... elsewhere ...
     *
     * // By firing this action, the controller will now be instantiated (if it hasn't been).
     * const myAction = createAction(getActionNameForController('MY_CONTROLLER', 'MY_ACTION'));
     * objectiveStore.dispatch(myAction);
     * ```
     */
    static initializeOnExternalAction<T extends typeof Controller>(this: T): void;
}
//# sourceMappingURL=controller.d.ts.map