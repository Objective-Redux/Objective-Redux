// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import * as React from 'react';
import { Controller, ModelConstructor } from '../controllers/controller';
import { StateController } from '../controllers/state-controller';
import { useController } from '../hooks/use-controller';
import { useObjectiveStore } from '../hooks/use-objective-store';
import { useSelector } from '../hooks/use-selector';

/**
 * @internal
 */
export interface Class<T> { new (...parameters: any[]): T }

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
export class ComponentConnector {
  private readonly component: React.ComponentClass;

  private readonly controllers: {
    controller: typeof Controller & ModelConstructor<StateController<any>>;
    selector: StateSelectorFn<any>;
  }[];

  private readonly stateSelectors: StateSelectorFn<any>[];

  /**
   * Starts the builder for a React component.
   *
   * @param component The React component to which the props will be added.
   * @returns An instance of the ComponentConnector builder.
   */
  public static addPropsTo(component: React.ComponentClass): ComponentConnector {
    return new ComponentConnector(component);
  }

  private constructor(component: React.ComponentClass) {
    this.component = component;
    this.controllers = [];
    this.stateSelectors = [];
  }

  /**
   * Gets parameters from the specified StateController and injects them into the properties of the component.
   *
   * @template C The state controller class being connected. Will be inferred from the first parameter.
   * @param controller The state controller from which properties will be extracted.
   * @param selector An optional mapping function.
   * @returns An instance of the ComponentConnector builder.
   */
  public fromController<StateType, C extends StateController<StateType>>(
    controller: typeof Controller & ModelConstructor<StateController<StateType>>,
    selector: StateSelectorFn<ReturnType<C['getStateSlice']>>|null = null
  ): ComponentConnector {
    this.controllers.push({
      controller,
      selector: selector || ((state: C): C => state),
    });
    return this;
  }

  /**
   * Adds a selection of the state to as props to the component.
   *
   * This method is provided for backward compatibility purposes. For flexibility and performance reasons, it is
   * encouraged that fromController method be used instead of this method when possible.
   *
   * @param selectorFn A function that maps the state to a selected part of the state.
   * @returns An instance of the ComponentConnector builder.
   */
  public fromState(selectorFn: StateSelectorFn<any>): ComponentConnector {
    this.stateSelectors.push(selectorFn);
    return this;
  }

  /**
   * Finishes the builder and provides the connected component.
   *
   * @returns The connected React component.
   */
  public connect(): any {
    const {
      controllers,
      stateSelectors,
      component: Component,
    } = this;

    const connected = (props: any, ...otherParams: any): React.ReactElement => {
      const {
        children,
        ...restOfProps
      } = props;
      let state = {};
      const objectiveStore = useObjectiveStore();

      controllers.forEach(controller => {
        const instance = useController(controller.controller);
        if (instance) {
          state = {
            ...state,
            ...controller.selector(instance.getStateSlice()),
          };
        }
      });

      stateSelectors.forEach(selector => {
        state = {
          ...state,
          ...useSelector(selector),
        };
      });

      const finalState = {
        ...state,
        ...restOfProps,
        ...otherParams,
        ...{ objectiveStore },
      };

      return (
        <Component {...finalState}>
          {children}
        </Component>
      );
    };

    /* istanbul ignore next */
    return connected;
  }
}
