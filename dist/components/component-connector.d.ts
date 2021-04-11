import * as React from 'react';
import { Controller, ModelConstructor } from '../controllers/controller';
import { StateController } from '../controllers/state-controller';
/**
 * @internal
 */
export interface Class<T> {
    new (...parameters: any[]): T;
}
/**
 * @internal
 */
export interface StateSelectorFn<T> {
    (state: T): any;
}
/**
 * Builder that connections a React component to the Objective Redux store, allowing the component to use the states
 * and dispatch events.
 *
 * This provides the React component with an `objectiveStore` prop, which is an instance of the ObjectiveStore
 * connected to the components closest provided ancestor. It also provides props from the states that were added.
 *
 * As an alternative for functional components, the useObjectiveStore hook can be used to get the ObjectiveStore.
 *
 * @example
 * ```typescript
 * export default ComponentConnector
 *   .addPropsTo(MyReactComponent)
 *   .fromController(MyStateControllerOne)
 *   .fromController(MyStateControllerTwo, slice => ({ a: slice.a }))
 *   .connect();
 * ```
 */
export declare class ComponentConnector {
    private readonly component;
    private readonly controllers;
    private readonly stateSelectors;
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
    fromController<StateType, C extends StateController<StateType>>(controller: typeof Controller & ModelConstructor<StateController<StateType>>, selector?: StateSelectorFn<ReturnType<C['getStateSlice']>> | null): ComponentConnector;
    /**
     * Adds a selection of the state to as props to the component.
     *
     * This method is provided for backward compatibility purposes. For flexibility and performance reasons, it is
     * encouraged that fromController method be used instead of this method when possible.
     *
     * @param selectorFn A function that maps the state to a selected part of the state.
     * @returns An instance of the ComponentConnector builder.
     */
    fromState(selectorFn: StateSelectorFn<any>): ComponentConnector;
    /**
     * Finishes the builder and provides the connected component.
     *
     * @returns The connected React component.
     */
    connect(): React.MemoExoticComponent<any>;
}
//# sourceMappingURL=component-connector.d.ts.map