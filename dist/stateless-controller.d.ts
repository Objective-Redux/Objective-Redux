import { ReduxRegister, SagaFn } from './redux-register';
import { ActionFn } from './action';
import { Controller } from './controller';
import { TakeBuilder } from './take-type';
/**
 * @internal
 */
interface SagaConfig {
    name: string | null;
    takeBuilder: TakeBuilder | null;
    sagaFn: SagaFn<any>;
}
/**
 * Builder that is returned by the [[StatelessController]] to create and register a saga.
 *
 * @template Payload The payload that the action and the saga will use.
 */
export declare class SagaBuilder<Payload> {
    private readonly registerFn;
    private name;
    private takeBuilder;
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
     * @param takeBuilder The builder function for the saga watcher. This can be generating using one of the configure
     * functions, such as configureTakeLatest or configureDebounce.
     * @returns An instance of the SagaBuilder.
     */
    withTake(takeBuilder: TakeBuilder): SagaBuilder<Payload>;
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
 *    .withTake(configureTakeLatest())
 *    .register(
 *      function* () {
 *        const controller = yield getControllerFromSagaContext(SwitchStateController);
 *        yield controller.toggleSwitchValue();
 *        yield controller.incrementCount();
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
}
export {};
//# sourceMappingURL=stateless-controller.d.ts.map