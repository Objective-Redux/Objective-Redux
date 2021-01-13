import { Controller, ModelConstructor } from './controller';
/**
 * Gets a controller from the ObjectiveStore using hook.
 *
 * @template C The type of controller that will be returned. This type is inferred and does not need to be specified in
 * TypeScript.
 * @param controller The controller class of which an instance should be retrieved.
 * @param selectorFn A state mapping function used to determine if the component needs to re-render. Defaults to
 * (state: any): any => state.
 * @returns An instance of the provided controller or null if there is no ObjectiveStore instance in the components
 * context.
 *
 * @example
 * ```typescript
 * import React from 'react';
 * import { useController } from 'objective-redux';
 * import { SwitchStateController } from './switch-state-controller';
 *
 * export function MyFunctionalComponent() {
 *   const switchStateController = useController(SwitchStateController);
 *   const { isOn } = switchStateController.getStateSlice();
 *
 *   return <p>Switch is { isOn ? 'On' : 'Off' }</p>;
 * }
 * ```
 */
export declare const useController: <C extends Controller>(controller: typeof Controller & ModelConstructor<C>, selectorFn?: (state: any) => any) => C | null;
//# sourceMappingURL=use-controller.d.ts.map