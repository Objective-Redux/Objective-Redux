import { StateController, ReducerFn } from '../state-controller';
import { ActionExtendFn } from '../action';
/**
 * @internal
 */
export declare class StateControllerMock<State> extends StateController<State> {
    protected registerAction<Payload>(fn: ReducerFn<State, Payload>): ActionExtendFn<Payload>;
}
//# sourceMappingURL=state-controller-mock.d.ts.map