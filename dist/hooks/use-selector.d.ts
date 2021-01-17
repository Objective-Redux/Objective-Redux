/**
 * Gets a selection of the state from the store.
 *
 * @param selectorFn A selector/mapping function used to select values out of the state.
 * @returns The selected piece of state from the store.
 *
 * @example
 * ```typescript
 * import React from 'react';
 * import { useSelector } from 'objective-redux';
 *
 * export function MyFunctionalComponent() {
 *   const { isOn } = useSelector(state => ({ isOn: state.switch.isOn }));
 *
 *   return <p>Switch is { isOn ? 'On' : 'Off' }</p>;
 * }
 * ```
 */
export declare const useSelector: <T>(selectorFn: (state: any) => T) => any;
//# sourceMappingURL=use-selector.d.ts.map