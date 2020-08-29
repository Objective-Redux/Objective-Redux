import { ReduxRegister } from './redux-register';
declare type UpdateFn = (() => void);
/**
 * @internal
 */
export declare class HookSubscriber {
    private readonly register;
    private readonly updateFn;
    private unsubscribeFn;
    constructor(register: ReduxRegister | null, updateFn: UpdateFn);
    subscribe(): void;
    unsubscribe(): void;
}
export {};
//# sourceMappingURL=hook-subscriber.d.ts.map