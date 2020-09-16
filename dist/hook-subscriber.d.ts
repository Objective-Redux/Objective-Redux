import { ObjectiveStore } from './objective-store';
declare type UpdateFn = (() => void);
/**
 * @internal
 */
export declare class HookSubscriber {
    private readonly objectiveStore;
    private readonly updateFn;
    private unsubscribeFn;
    constructor(objectiveStore: ObjectiveStore | null, updateFn: UpdateFn);
    subscribe(): void;
    unsubscribe(): void;
}
export {};
//# sourceMappingURL=hook-subscriber.d.ts.map