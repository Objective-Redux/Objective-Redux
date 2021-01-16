import { SagaFn } from '../store/objective-store';
export interface DebounceTakeConfig {
    /**
     * The time debounce time in milliseconds.
     */
    debounceTime: number;
}
/**
 * The pattern that for which to watch.
 */
export interface TakeConfig {
    pattern?: string | string[] | ((action: any) => boolean);
}
/**
 * @internal
 */
interface SagaEffectConfig {
    name: string;
    sagaFn: SagaFn<any>;
}
/**
 * @internal
 */
export interface EffectBuilder {
    (config: SagaEffectConfig): () => Generator;
}
/**
 * Returns a function that will create a takeLatest saga watcher. This can be used with the SagaBuilder::withEffect()
 * method.
 *
 * @returns A function that creates a takeLatest watching function.
 * @example
 * ```typescript
 * configureTakeLatest();
 * ```
 */
export declare function configureTakeLatest(): EffectBuilder;
/**
 * Returns a function that will create a takeEvery saga watcher. This can be used with the SagaBuilder::withEffect()
 * method.
 *
 * @returns A function that creates a takeEvery watching function.
 * @example
 * ```typescript
 * configureTakeEvery();
 * ```
 */
export declare function configureTakeEvery(): EffectBuilder;
/**
 * Returns a function that will create a takeLeading saga watcher. This can be used with the SagaBuilder::withEffect()
 * method.
 *
 * @returns A function that creates a takeLeading watching function.
 * @example
 * ```typescript
 * configureTakeLeading();
 * ```
 */
export declare function configureTakeLeading(): EffectBuilder;
/**
 * Returns a function that will create a debounce saga watcher. This can be used with the SagaBuilder::withEffect()
 * method.
 *
 * @param debounceConfig The configuration for the watcher.
 * @returns A function that creates a debounce watching function.
 * @example
 * ```typescript
 * configureDebounce({ debounceTime: 1000 });
 * ```
 */
export declare function configureDebounce(debounceConfig: DebounceTakeConfig): EffectBuilder;
/**
 * Returns a function that will create a take saga watcher. This can be used with the SagaBuilder::withEffect()
 * method.
 *
 * @param takeConfig The configuration for the watcher.
 * @returns A function that creates a take watching function.
 * @example
 * ```typescript
 * configureTake({ pattern: 'REQUEST' });
 * ```
 */
export declare function configureTake(takeConfig: TakeConfig): EffectBuilder;
export {};
//# sourceMappingURL=effect-type.d.ts.map