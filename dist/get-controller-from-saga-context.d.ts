import { Controller, ModelConstructor } from './controller';
/**
 * Gets a controller instance from the saga context.
 *
 * @template C The type of controller that will be returned. This type is inferred and does not need to be specified in
 * TypeScript.
 * @param controller The controller class of which an instance should be retrieved.
 * @returns A generator that yields an instance of the provided controller or null if there is no ObjectiveStore
 * instance in the saga's context.
 *
 * @example
 * ```typescript
 * // Also works with a StateController
 * class MyController extends StatelessController {
 *   // ...
 * }
 *
 * function* foo(): any {
 *   const myController = yield getControllerFromSagaContext(MyController);
 * }
 * ```
 */
export declare function getControllerFromSagaContext<C extends Controller>(controller: typeof Controller & ModelConstructor<C>): Generator<any, C | null, C>;
//# sourceMappingURL=get-controller-from-saga-context.d.ts.map