import { ObjectiveStore } from './objective-store';
/**
 * Gets the ObjectiveStore instance from the saga's context.
 *
 * @returns A generator that yields an instance of the ObjectiveStore.
 * @example
 * ```typescript
 * function* () {
 *   const objectiveStore = yield getObjectiveStoreFromSagaContext();
 * }
 * ```
 */
export declare function getObjectiveStoreFromSagaContext(): Generator<any, ObjectiveStore, ObjectiveStore>;
//# sourceMappingURL=get-objective-store-from-saga-context.d.ts.map