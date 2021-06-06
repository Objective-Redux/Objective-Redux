// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import * as React from 'react';
import { Unsubscribe } from 'redux';
import { Controller, ModelConstructor } from '../controllers/controller';
import { ObjectiveStoreProviderContext } from '../context';
import { ObjectiveStore } from '../store/objective-store';
import { StateController } from '../controllers/state-controller';
import { deepEquals } from '../helpers/deep-equals';

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
  public connect(): React.ComponentClass<any> {
    const {
      controllers,
      stateSelectors,
      component: Component,
    } = this;

    const connected = class extends React.Component {
      public static override contextType = ObjectiveStoreProviderContext;

      public unsubscribe: Unsubscribe|null = null;

      private mounted: boolean;

      private existingState: any;

      public static displayName: string = 'ComponentConnector';

      public constructor(props: any) {
        super(props);
        this.unsubscribe = null;
        this.mounted = false;
        this.existingState = null;
      }

      public override render(): JSX.Element|null {
        // Render can be called even though the component is unmounted.
        // In that case, return null so that nothing is rendered.
        if (!this.unsubscribe && this.mounted) {
          return null;
        }

        const objectiveStore: ObjectiveStore = this.context;

        // This will happen on this initial render of the component
        /* istanbul ignore else */
        if (this.existingState === null) {
          this.existingState = this.getState();
        }

        return (
          <Component
            {...this.existingState}
            {...this.props}
            {...{ objectiveStore }}
          />
        );
      }

      private getState(): any {
        const { context } = this;
        /* istanbul ignore next */
        const state = context?.getState();
        let selectedState = {};
        for (let i = 0; i < controllers.length; i++) {
          const slice = (controllers[i].controller as any).getInstance(this.context).getStateSlice();
          selectedState = {
            ...selectedState,
            ...controllers[i].selector(slice),
          };
        }
        for (let i = 0; i < stateSelectors.length; i++) {
          selectedState = {
            ...selectedState,
            ...stateSelectors[i](state),
          };
        }
        return selectedState;
      }

      public override componentDidMount(): void {
        const objectiveStore: ObjectiveStore = this.context;
        this.unsubscribe = objectiveStore.subscribe(this.handleChange.bind(this));
        this.mounted = true;
      }

      public override componentWillUnmount(): void {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      }

      public handleChange(): void {
        if (this.unsubscribe) {
          const newState = this.getState();
          if (!deepEquals(this.existingState, newState)) {
            this.existingState = newState;
            this.forceUpdate();
          }
        }
      }
    };

    /* istanbul ignore next */
    return connected;
  }
}
