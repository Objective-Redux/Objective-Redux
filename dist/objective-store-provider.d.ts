/// <reference types="react" />
import { ObjectiveStore } from './objective-store';
/**
 * Provides an ObjectiveStore to child React components.
 *
 * @param object The properties being passed to the component.
 * @param object.children The child components of the provider.
 * @param object.objectiveStore An instance of the ObjectiveStore.
 *
 * @example
 * ```typescript
 * export const objectiveStore = new ObjectiveStore();
 *
 * ReactDOM.render(
 *   <ObjectiveStoreProvider objectiveStore={objectiveStore}>
 *     <App />
 *   </ObjectiveStoreProvider>,
 *   document.getElementById('root')
 * );
 * ```
 *
 * @returns The provider that will render with its child components.
 */
export declare function ObjectiveStoreProvider({ objectiveStore, children }: {
    objectiveStore: ObjectiveStore;
    children: any;
}): JSX.Element;
//# sourceMappingURL=objective-store-provider.d.ts.map