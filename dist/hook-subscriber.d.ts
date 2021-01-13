import { ObjectiveStore } from './objective-store';
declare type UpdateFn = (() => void);
/**
 * @internal
 */
export declare class HookSubscriber {
    private readonly objectiveStore;
    private readonly getSlice;
    private readonly updateFn;
    private unsubscribeFn;
    private previousSlice;
    constructor(objectiveStore: ObjectiveStore | null, getSlice: () => any, updateFn: UpdateFn);
    subscribe(): void;
    unsubscribe(): void;
}
export {};
//# sourceMappingURL=hook-subscriber.d.ts.map