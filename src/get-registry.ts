import { getContext, GetContextEffect } from "redux-saga/effects";
import { ReduxRegister } from ".";

/**
 * Gets the register from the saga's context.
 * 
 * @example
 * ```typescript
 * function* () {
 *   const register = yield getRegisterFromContext();
 * }
 * ```
 * @returns a generator that yields an instance of the ReduxRegister.
 */
export function* getRegisterFromContext(): Generator<GetContextEffect, ReduxRegister, ReduxRegister> {
  return yield getContext('register');
}
