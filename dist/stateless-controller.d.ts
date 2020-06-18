import { ReduxRegister, SagaFn } from './redux-register';
import { TakeType } from './take-type';
import { ActionFn } from './action';
import { Controller } from './controller';
/**
 * @internal
 */
interface SagaConfig {
    name: string | null;
    takeType: TakeType | null;
    takeConfig: TakeConfig | null;
    sagaFn: SagaFn<any>;
}
/**
 * @internal
 */
export interface TakeConfig {
    debounceTime: number;
}
/**
 * Builder that is returned by the [[StatelessController]] to create and register a saga.
 *
 * @template Payload the payload that the action and the saga will use.
 */
export declare class SagaBuilder<Payload> {
    private readonly registerFn;
    private name;
    private takeType;
    private takeConfig;
    /**
     * @internal
     */
    constructor(registerFn: (config: SagaConfig) => ActionFn<Payload>);
    /**
     * Adds a specific name to the saga so that it can be addressed without calling the specific action returned by this
     * builder.
     *
     * @param name The name/type of the action.
     * @returns An instance of the SagaBuilder.
     */
    withAddressableName(name: string): SagaBuilder<Payload>;
    /**
     * Adds a simple watcher to the saga.
     *
     * @param type The take type of the watching saga.
     * @param config The configuration of the take type.
     * @returns An instance of the SagaBuilder.
     */
    withTake(type: TakeType, config?: TakeConfig | null): SagaBuilder<Payload>;
    /**
     * Completes the builder and adds the saga to the register.
     *
     * @param sagaFn The saga function to add to the ReduxRegister.
     * @returns An action for calling the saga.
     */
    register(sagaFn: SagaFn<Payload>): ActionFn<Payload>;
}
/**
 * Create and manage sagas that are associated with a Redux store.
 *
 * @example
 * ```typescript
 * class SwitchStateSagas extends StatelessController {
 *  getName() {
 *    return 'switch-sagas';
 *  }
 *
 *  toggleSwitch = this.createSaga()
 *    .withTake(TakeType.TAKE_LATEST)
 *    .register(
 *      function* () {
 *        const register = yield getRegisterFromContext();
 *        yield SwitchStateController.getInstance(register).toggleSwitchValue();
 *        yield SwitchStateController.getInstance(register).incrementCount();
 *      }
 *    );
 * }
 *
 * const instance = SwitchStateSagas.getInstance(register);
 * instance.toggleSwitch();
 * ```
 */
export declare abstract class StatelessController extends Controller {
    /**
     * Registers and starts the sagas.
     *
     * _WARNING: While the constructor can be called directly, state controllers are meant to be initialized with the
     * [[getInstance]] method. Creating instances directly can lead to having more than one instance at a time, which may
     * have adverse affects on the application._.
     *
     * @param register Rhe ReduxRegister instance to which the controller will be connected.
     * @returns An instance of the StatelessController.
     */
    protected constructor(register: ReduxRegister);
    /**
     * Creates an instance of a [[SagaBuilder]] that will be registered when the builder finishes.
     *
     * @template Payload the payload the action and the saga will take.
     * @returns A builder that registers the saga.
     */
    protected createSaga<Payload>(): SagaBuilder<Payload>;
    private buildSaga;
    private createTakeSaga;
}
export {};
//# sourceMappingURL=stateless-controller.d.ts.map