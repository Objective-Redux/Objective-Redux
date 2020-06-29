import { ReduxRegister } from './';
/**
 * Gets the register from the saga's context.
 *
 * @example
 * ```typescript
 * function* () {
 *   const register = yield getRegisterFromSagaContext();
 * }
 * ```
 * @returns A generator that yields an instance of the ReduxRegister.
 */
export declare function getRegisterFromSagaContext(): Generator<any, ReduxRegister, ReduxRegister>;
//# sourceMappingURL=get-register-from-saga-context.d.ts.map