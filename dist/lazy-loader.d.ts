import { AnyAction } from 'redux';
import { Controller, ModelConstructor } from './controller';
import { ObjectiveStore } from './objective-store';
import { StatelessController } from './stateless-controller';
/**
 * @internal
 */
declare type ReducerHandlingFn = (controller: any) => void;
/**
 * @internal
 */
declare type SagaCancelingFn = (statelessController: StatelessController) => void;
/**
 * @internal
 */
interface StoreHandlingFns {
    registerReducerFn: ReducerHandlingFn;
    unregisterReducerFn: ReducerHandlingFn;
    cancelSagasForController: SagaCancelingFn;
}
/**
 * @internal
 */
export declare class LazyLoader {
    private static readonly loadableControllers;
    private static readonly storeFns;
    private static readonly controllers;
    static registerController(controller: typeof Controller): void;
    static getControllerForAction(action: AnyAction): typeof Controller | null;
    static addObjectiveStore(objectiveStore: ObjectiveStore, storeFns: StoreHandlingFns): void;
    static getController<T extends Controller>(objectiveStore: ObjectiveStore, ControllerClass: ModelConstructor<T> & typeof Controller): T;
    static removeController<T extends Controller>(objectiveStore: ObjectiveStore, ControllerClass: ModelConstructor<T> & typeof Controller): void;
}
export {};
//# sourceMappingURL=lazy-loader.d.ts.map