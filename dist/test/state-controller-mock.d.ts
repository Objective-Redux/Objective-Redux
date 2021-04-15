import { StateController, ReducerFn } from '../controllers/state-controller';
import { SagaConfig } from '../controllers/stateless-controller';
import { ActionExtendFn } from '../helpers/action';
/**
 * @internal
 */
export declare class StateControllerMock<State> extends StateController<State> {
    protected createReducingAction<Payload>(fn: ReducerFn<State, Payload>): ActionExtendFn<Payload>;
    protected internalBuildSaga<Payload>(config: SagaConfig): any;
}
//# sourceMappingURL=state-controller-mock.d.ts.map