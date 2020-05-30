import * as React from 'react';
import { StateController } from "./";
import { Unsubscribe } from 'redux';
import { RegisterProviderContext } from './context';

/**
 * @internal
 */
export type Class<T> = { new (...args: any[]): T; };

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
  private component: React.ComponentClass;

  private controllers: { controller: Class<StateController<any>>, selector: StateSelectorFn<any> }[];

  /**
   * Starts the builder for a React component.
   * @param component the React component to which the props will be added.
   * @returns an instance of the ComponentConnector builder.
   */
  public static addPropsTo(component: React.ComponentClass): ComponentConnector {
    return new ComponentConnector(component);
  }

  private constructor(component: React.ComponentClass) {
    this.component = component;
    this.controllers = [];
  }

  /**
   * @template C the state controller class being connected. Will be inferred from the first parameter.
   * @param controller the state controller from which properties will be extracted.
   * @param selector an optional mapping function.
   * @returns an instance of the ComponentConnector builder.
   */
  public from<C extends StateController<any>>(controller: Class<C>, selector: StateSelectorFn<C>): ComponentConnector {
    this.controllers.push({
      controller,
      selector: selector || ((state: C) => state),
    });
    return this;
  }

  /**
   * Finishes the builder and provides the connected component.
   * @returns the connected React component.
   */
  public connect(): React.ComponentClass {
    const Component = this.component;
    const controllers = this.controllers;

    return class extends React.Component {
      static contextType = RegisterProviderContext;

      public unsubscribe: Unsubscribe|null = null;

      public constructor(props: any, context?: any) {
        super(props, context);
        this.unsubscribe = null;
      }

      render() {
        const register = this.context;
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

      componentDidMount() {
        this.unsubscribe = this.context.getStore().subscribe(this.handleChange.bind(this))
      }
      
      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      }
    
      handleChange() {
        this.forceUpdate();
      }
    };
  }
}
