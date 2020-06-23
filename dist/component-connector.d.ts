import * as React from 'react';
import { StateController } from './';
/**
 * @internal
 */
export interface Class<T> {
    new (...parameters: any[]): T;
}
/**
 * @internal
 */
interface StateSelectorFn<T> {
    (state: T): any;
}
/**
 * Builder that connections a React component to the Objective Redux register, allowing the component to use the states
 * and dispatch events.
 *
 * This provides the React component with a `register` prop, which is an instance of the ReduxRegister connected to the
 * components closest provided ancestor. It also provides props from the states that were added.
 *
 * As an alternative for functional components, the useRegisterFromReactContext hook can be used to get
 * the ReduxRegister.
 *
 * @example
 * ```typescript
 * export default ComponentConnector
 *   .addPropsTo(MyReactComponent)
 *   .from(MyStateControllerOne)
 *   .from(MyStateControllerTwo, slice => ({ a: slice.a }))
 *   .connect();
 * ```
 */
export declare class ComponentConnector {
    private readonly component;
    private readonly controllers;
    /**
     * Starts the builder for a React component.
     *
     * @param component The React component to which the props will be added.
     * @returns An instance of the ComponentConnector builder.
     */
    static addPropsTo(component: React.ComponentClass): ComponentConnector;
    private constructor();
    /**
     * Gets parameters from the specified StateController and injects them into the properties of the component.
     *
     * @template C The state controller class being connected. Will be inferred from the first parameter.
     * @param controller The state controller from which properties will be extracted.
     * @param selector An optional mapping function.
     * @returns An instance of the ComponentConnector builder.
     */
    from<C extends StateController<any>>(controller: Class<C>, selector?: StateSelectorFn<C> | null): ComponentConnector;
    /**
     * Finishes the builder and provides the connected component.
     *
     * @returns The connected React component.
     */
    connect(): React.ComponentClass;
}
export {};
//# sourceMappingURL=component-connector.d.ts.map