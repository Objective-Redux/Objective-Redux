import { AnyAction } from 'redux';
import { Controller } from './controller';
/**
 * @internal
 */
export declare class LazyLoader {
    private static readonly registeredControllers;
    static registerController(controller: typeof Controller): void;
    static getControllerForAction(action: AnyAction): typeof Controller | null;
}
//# sourceMappingURL=lazy-loader.d.ts.map