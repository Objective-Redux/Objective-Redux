import { ObjectiveStore, SagaFn } from './objective-store';
import { ActionFn } from './action';
import { Controller } from './controller';
import { EffectBuilder } from './effect-type';
/**
 * @internal
 */
interface SagaConfig {
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
    private name;
    private effectBuilder;
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
     * @param effectBuilder The builder function for the saga watcher. This can be generating using one of the configure
     * functions, such as configureTakeLatest or configureDebounce.
     * @returns An instance of the SagaBuilder.
     */
    withEffect(effectBuilder: EffectBuilder): SagaBuilder<Payload>;
    /**
     * Completes the builder and adds the saga to the objectiveStore.
     *
     * @param sagaFn The saga function to add to the ObjectiveStore.
     * @returns An action for calling the saga.
     */
    register(sagaFn: SagaFn<Payload>): ActionFn<Payload>;
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
 *  toggleSwitch = this.createSaga()
 *    .withEffect(configureTakeLatest())
 *    .register(
 *      function* () {
 *        const controller = yield getControllerFromSagaContext(SwitchStateController);
 *        yield controller.toggleSwitchValue();
 *        yield controller.incrementCount();
 *      }
 *    );
 * }
 *
 * const instance = SwitchStateSagas.getInstance(objectiveStore);
 * instance.toggleSwitch();
 * ```
 */
export declare abstract class StatelessController extends Controller {
    /**
     * ObjectiveStores and starts the sagas.
     *
     * _WARNING: While the constructor can be called directly, state controllers are meant to be initialized with the
     * [[getInstance]] method. Creating instances directly can lead to having more than one instance at a time, which may
     * have adverse affects on the application._.
     *
     * @param objectiveStore The ObjectiveStore instance to which the controller will be connected.
     * @returns An instance of the StatelessController.
     */
    constructor(objectiveStore: ObjectiveStore);
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