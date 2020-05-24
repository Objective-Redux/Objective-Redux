import * as React from 'react';
import { StateController } from "./";
import { Unsubscribe } from 'redux';
import { RegisterProviderContext } from './context';

export type Class<T> = { new (...args: any[]): T; };

interface StateSelectorFn {
  (state: any): any;
}

export class ComponentConnector {
  private component: React.ComponentClass;

  private controllers: { controller: Class<StateController<any>>, selector: StateSelectorFn }[];

  public static addPropsTo(component: React.ComponentClass): ComponentConnector {
    return new ComponentConnector(component);
  }

  private constructor(component: React.ComponentClass) {
    this.component = component;
    this.controllers = [];
  }

  public from<C extends StateController<any>>(controller: Class<C>, selector: StateSelectorFn): ComponentConnector {
    this.controllers.push({
      controller,
      selector: selector || (state => state),
    });
    return this;
  }

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
