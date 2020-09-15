import { ObjectiveStore } from './objective-store';
declare type UpdateFn = (() => void);
/**
 * @internal
 */
export declare class HookSubscriber {
    private readonly store;
    private readonly updateFn;
    private unsubscribeFn;
    constructor(store: ObjectiveStore | null, updateFn: UpdateFn);
    subscribe(): void;
    unsubscribe(): void;
}
export {};
//# sourceMappingURL=hook-subscriber.d.ts.map