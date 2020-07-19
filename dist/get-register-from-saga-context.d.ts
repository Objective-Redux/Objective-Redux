import { ReduxRegister } from './';
/**
 * Gets the register from the saga's context.
 *
 * @returns A generator that yields an instance of the ReduxRegister.
 * @example
 * ```typescript
 * function* () {
 *   const register = yield getRegisterFromSagaContext();
 * }
 * ```
 */
export declare function getRegisterFromSagaContext(): Generator<any, ReduxRegister, ReduxRegister>;
//# sourceMappingURL=get-register-from-saga-context.d.ts.map