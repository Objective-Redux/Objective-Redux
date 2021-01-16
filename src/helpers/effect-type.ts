// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { SagaFn } from '../store/objective-store';
import { getReduxSagaEffects } from './get-redux-saga-module';

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
export function configureTakeLatest(): EffectBuilder {
  const effects = getReduxSagaEffects();
  return function TAKE_LATEST(config: SagaEffectConfig): (() => Generator) {
    return function* (): any {
      yield effects.takeLatest(config.name, config.sagaFn);
    };
  };
}

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
export function configureTakeEvery(): EffectBuilder {
  const effects = getReduxSagaEffects();
  return function TAKE_EVERY(config: SagaEffectConfig): (() => Generator) {
    return function* (): any {
      yield effects.takeEvery(config.name, config.sagaFn);
    };
  };
}

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
export function configureTakeLeading(): EffectBuilder {
  const effects = getReduxSagaEffects();
  return function TAKE_LEADING(config: SagaEffectConfig): (() => Generator) {
    return function* (): any {
      yield effects.takeLeading(config.name, config.sagaFn);
    };
  };
}

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
export function configureDebounce(debounceConfig: DebounceTakeConfig): EffectBuilder {
  const effects = getReduxSagaEffects();
  return function DEBOUNCE(config: SagaEffectConfig): (() => Generator) {
    return function* (): any {
      yield effects.debounce(debounceConfig?.debounceTime || 0, config.name, config.sagaFn);
    };
  };
}

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
export function configureTake(takeConfig?: TakeConfig): EffectBuilder {
  const effects = getReduxSagaEffects();
  return function TAKE(config: SagaEffectConfig): (() => Generator) {
    return function* (): any {
      while (true) {
        // Match the action if the assigned name is matched (e.g. if the controller function is called) or if
        // the provided pattern is a match.
        const patternFn = (action: any): boolean => action.type === config.name
            || (typeof takeConfig?.pattern === 'string' && action.type === takeConfig.pattern)
            || (typeof takeConfig?.pattern === 'object' && takeConfig.pattern.indexOf(action.type) >= 0)
            || (typeof takeConfig?.pattern === 'function' && takeConfig.pattern(action));

        const payload = yield effects.take(patternFn);
        yield effects.fork(config.sagaFn, payload);
      }
    };
  };
}
