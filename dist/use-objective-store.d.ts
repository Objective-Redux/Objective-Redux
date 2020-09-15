import { ObjectiveStore } from '.';
/**
 * Gets the ObjectiveStore from the React context for use in a functional component.
 *
 * As an alternative (for example, in class components where hooks cannot be used), the ComponentConnector may be used
 * instead.
 *
 * @returns An instance of the ObjectiveStore, if one exists.
 *
 * @example
 * ```typescript
 * import React from 'react';
 * import { useObjectiveStore } from 'objective-redux';
 * import { MyStateController } from './store/my-state-controller';
 *
 * export default function() {
 *   const objectiveStore = useObjectiveStore();
 *   const { value } = MyStateController.getInstance(objectiveStore).getStateSlice();
 *
 *   return <p>{ value }</p>;
 * }
 * ```
 */
export declare const useObjectiveStore: () => ObjectiveStore | null;
//# sourceMappingURL=use-objective-store.d.ts.map