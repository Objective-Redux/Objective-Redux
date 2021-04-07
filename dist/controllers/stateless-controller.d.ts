import { ObjectiveStore, SagaFn } from '../store/objective-store';
import { ActionFn } from '../helpers/action';
import { EffectBuilder } from '../helpers/effect-type';
import { Controller } from './controller';
/**
 * @internal
 */
export interface SagaConfig {
    name: string | null;
    effectBuilder: EffectBuilder | null;
    sagaFn: SagaFn<any>;
}
/**
 * Builder that is returned by the [[StatelessController]] to create and store a saga.
 *
 * @template Payload The payload that the action and the saga will use.
 */
export declare class SagaBuilder<Payload> {
    private readonly registerFn;
    private readonly sagaFn;
    private name;
    private effectBuilder;
    /**
     * @internal
     */
    constructor(sagaFn: SagaFn<Payload>, registerFn: (config: SagaConfig) => ActionFn<Payload>);
    /**
     * Adds a specific name to the saga so that it can be addressed without calling the specific action returned by this
     * builder.
     *
     * @param name The name/type of the action.
     * @returns An instance of the SagaBuilder.
     */
    withAddressableName(name: string): SagaBuilder<Payload>;
    /**
     * Adds a watcher to the saga.
     *
     * Objective-Redux provides some build in configurations, or custom one can be built by using the below paradigm.
     *
     * @example
     * ```typescript
     * // Example of a customer configuration
     * export function configureExample(configurationParameters) {
     *   // provides
     *   //   config.name the which is the action name targeting the saga
     *   //   config.sagaFn the saga function being wrapped
     *   return function EXAMPLE(config) {
     *     return function* () {
     *       yield exampleEffect(config.name, config.sagaFn);
     *     };
     *   };
     *  }
     * ```
     *
     * @param effectBuilder The builder function for the saga watcher. This can be generating using one of the configure
     * functions, such as configureTakeLatest or configureDebounce.
     * @returns An instance of the SagaBuilder.
     */
    withEffect(effectBuilder: EffectBuilder): SagaBuilder<Payload>;
    /**
     * Completes the builder and adds the saga to the objectiveStore.
     *
     * @returns An action for calling the saga.
     */
    register(): ActionFn<Payload>;
}
/**
 * Create and manage sagas that are associated with an objectiveStore.
 *
 * @example
 * ```typescript
 * class SwitchStateSagas extends StatelessController {
 *  getName() {
 *    return 'switch-sagas';
 *  }
 *
 *  toggleSwitch = this.createSaga(
 *    function* () {
 *      const controller = yield getControllerFromSagaContext(SwitchStateController);
 *      yield controller.toggleSwitchValue();
 *      yield controller.incrementCount();
 *    }
 *  )
 *    .withEffect(configureTakeLatest())
 *    .register();
 * }
 *
 * const instance = SwitchStateSagas.getInstance(objectiveStore);
 * instance.toggleSwitch();
 * ```
 */
export declare abstract class StatelessController extends Controller {
    private readonly sagasToRegister;
    /**
     * ObjectiveStores and starts the sagas.
     *
     * WARNING: While the constructor can be called directly, controllers are meant to be initialized with the
     * [[getInstance]] method. Creating instances directly can lead to having more than one instance at a time, which may
     * have adverse affects on the application.
     *
     * @returns An instance of the StatelessController.
     */
    constructor();
    /**
     * Creates an instance of a [[SagaBuilder]] that will be registered when the builder finishes.
     *
     * @param sagaFn The saga function to add to the ObjectiveStore.
     * @template Payload the payload the action and the saga will take. If void, no action is expected.
     * This template variable is optional.
     * @returns A builder that registers the saga.
     */
    protected createSaga<Payload = void>(sagaFn: SagaFn<Payload>): SagaBuilder<Payload>;
    protected buildSaga<Payload>(config: SagaConfig): ActionFn<Payload>;
    setObjectiveStore(objectiveStore: ObjectiveStore): void;
}
//# sourceMappingURL=stateless-controller.d.ts.map