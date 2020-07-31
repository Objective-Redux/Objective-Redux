import { ReduxRegister } from './';
/**
 * @internal
 */
export declare type ModelConstructor<T> = new (register: ReduxRegister) => T;
/**
 * @internal
 */
export declare abstract class Controller {
    private count;
    /**
     * The ReduxController to which the controller belongs.
     */
    protected register: ReduxRegister;
    protected constructor(register: ReduxRegister);
    /**
     * Gets the unique name of the controller. By default, the name of the class.
     *
     * The name of the controller should be globally unique for all Objective-Redux controllers in the application.
     *
     * @returns The name of the state slice.
     */
    static getName(): string;
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
     * @param register An instance of the ReduxRegister from which to get the controller.
     * @returns An instance of the controller.
     *
     * @example
     * ```typescript
     * const instance = MyController.getInstance(register);
     * ```
     */
    static getInstance<T extends Controller>(this: typeof Controller & ModelConstructor<T>, register: ReduxRegister): T;
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
     *   action = this.registerAction(
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
     * register.dispatch(myAction);
     * ```
     */
    static initializeOnExternalAction<T extends typeof Controller>(this: T): void;
}
//# sourceMappingURL=controller.d.ts.map