import { GetContextEffect } from 'redux-saga/effects';
import { ReduxRegister } from '.';
/**
 * Gets the register from the saga's context.
 *
 * @example
 * ```typescript
 * function* () {
 *   const register = yield getRegisterFromContext();
 * }
 * ```
 * @returns A generator that yields an instance of the ReduxRegister.
 */
export declare function getRegisterFromContext(): Generator<GetContextEffect, ReduxRegister, ReduxRegister>;
//# sourceMappingURL=get-registry.d.ts.map