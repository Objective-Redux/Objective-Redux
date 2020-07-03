import { AnyAction } from 'redux';
import { Controller, ModelConstructor } from './controller';
import { ReduxRegister } from '.';
/**
 * @internal
 */
declare type ReduxRegisterFn = (controller: any) => void;
/**
 * @internal
 */
export declare class LazyLoader {
    private static readonly loadableControllers;
    private static readonly reducerFns;
    private static readonly controllers;
    static registerController(controller: typeof Controller): void;
    static getControllerForAction(action: AnyAction): typeof Controller | null;
    static addRegister(register: ReduxRegister, registerReducerFn: ReduxRegisterFn): void;
    static getController<T extends Controller>(register: ReduxRegister, ControllerClass: ModelConstructor<T> & typeof Controller): T;
}
export {};
//# sourceMappingURL=lazy-loader.d.ts.map