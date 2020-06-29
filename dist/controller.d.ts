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
     * Gets the name of the state slice.
     *
     * If the controller will be used with lazy loading, the name of the controller must be globally unique.
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
    static getInstance<T extends Controller>(this: ModelConstructor<T> & typeof Controller, register: ReduxRegister): T;
    /**
     * Allows the controller to be lazy loaded by actions triggered outside of Objective-Redux.
     *
     * This can be used in conjunction with the method [[withAddressableName]].
     *
     * @param this Implicit "this" parameter, which does not need to be supplied.
     * @example
     * ```typescript
     * class MyController extends StateController<MySliceType> {
     *   // ...
     * }
     *
     * MyController.lazyLoadOnExternalAction();
     *
     * export MyController;
     * ```
     */
    static lazyLoadOnExternalAction<T extends typeof Controller>(this: T): void;
}
//# sourceMappingURL=controller.d.ts.map