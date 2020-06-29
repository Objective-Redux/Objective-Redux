import { SagaFn } from './redux-register';
/**
 * @internal
 */
export interface DebounceTakeConfig {
    debounceTime: number;
}
/**
 * @internal
 */
interface TakeSagaConfig {
    name: string;
    sagaFn: SagaFn<any>;
}
/**
 * @internal
 */
export interface TakeBuilder {
    (config: TakeSagaConfig): () => Generator;
}
/**
 * Returns a function that will create a takeLatest saga watcher. This can be used with the SagaBuilder::withTake()
 * method.
 *
 * @returns A function that creates a takeLatest watching function.
 * @example
 * ```typescript
 * configureTakeLatest();
 * ```
 */
export declare function configureTakeLatest(): TakeBuilder;
/**
 * Returns a function that will create a takeEvery saga watcher. This can be used with the SagaBuilder::withTake()
 * method.
 *
 * @returns A function that creates a takeEvery watching function.
 * @example
 * ```typescript
 * configureTakeEvery();
 * ```
 */
export declare function configureTakeEvery(): TakeBuilder;
/**
 * Returns a function that will create a takeLeading saga watcher. This can be used with the SagaBuilder::withTake()
 * method.
 *
 * @returns A function that creates a takeLeading watching function.
 * @example
 * ```typescript
 * configureTakeLeading();
 * ```
 */
export declare function configureTakeLeading(): TakeBuilder;
/**
 * Returns a function that will create a debounce saga watcher. This can be used with the SagaBuilder::withTake()
 * method.
 *
 * @param debounceConfig The configuration for the watcher.
 * @returns A function that creates a debounce watching function.
 * @example
 * ```typescript
 * configureDebounce({ debounceTime: 1000 });
 * ```
 */
export declare function configureDebounce(debounceConfig: DebounceTakeConfig): TakeBuilder;
export {};
//# sourceMappingURL=take-type.d.ts.map