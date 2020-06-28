// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import * as React from 'react';
import { Unsubscribe } from 'redux';
import { RegisterProviderContext } from './context';
import { StateController, ReduxRegister } from './';

/**
 * @internal
 */
export interface Class<T> { new (...parameters: any[]): T }

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
 * As an alternative for functional components, the useRegister hook can be used to get the ReduxRegister.
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
export class ComponentConnector {
  private readonly component: React.ComponentClass;

  private readonly controllers: { controller: Class<StateController<any>>; selector: StateSelectorFn<any> }[];

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
  }

  /**
   * Gets parameters from the specified StateController and injects them into the properties of the component.
   *
   * @template C The state controller class being connected. Will be inferred from the first parameter.
   * @param controller The state controller from which properties will be extracted.
   * @param selector An optional mapping function.
   * @returns An instance of the ComponentConnector builder.
   */
  public from<C extends StateController<any>>(
    controller: Class<C>,
    selector: StateSelectorFn<C>|null = null
  ): ComponentConnector {
    this.controllers.push({
      controller,
      selector: selector || ((state: C): C => state),
    });
    return this;
  }

  /**
   * Finishes the builder and provides the connected component.
   *
   * @returns The connected React component.
   */
  public connect(): React.ComponentClass {
    const Component = this.component;
    const { controllers } = this;

    const connected = class extends React.Component {
      public static contextType = RegisterProviderContext;

      public unsubscribe: Unsubscribe|null = null;

      public static displayName: string = 'ObjectiveReduxConnector';

      public constructor(props: any, context?: any) {
        super(props, context);
        this.unsubscribe = null;
      }

      public render(): JSX.Element {
        const register: ReduxRegister = this.context;
        let state = {};
        for (let i = 0; i < controllers.length; i++) {
          const slice = (controllers[i].controller as any).getInstance(register).getStateSlice();
          state = {
            ...state,
            ...controllers[i].selector(slice),
          };
        }
        return (
          <Component
            {...this.props}
            {...state}
            {...{ register }}
          />
        );
      }

      public componentDidMount(): void {
        const register: ReduxRegister = this.context;
        this.unsubscribe = register.subscribe(this.handleChange.bind(this));
      }

      public componentWillUnmount(): void {
        /* istanbul ignore else */
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      }

      public handleChange(): void {
        this.forceUpdate();
      }
    };

    return connected;
  }
}
