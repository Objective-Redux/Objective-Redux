import * as React from 'react';
import { StateController, ReduxRegister } from ".";
import { Unsubscribe } from 'redux';

interface StateSelectorFn {
  (state: any): any;
}

export class ComponentConnector {
  private component: React.ComponentClass;

  private controllers: { controller: StateController<any>, selector: StateSelectorFn }[];

  public static component(component: React.ComponentClass): ComponentConnector {
    return new ComponentConnector(component);
  }

  private constructor(component: React.ComponentClass) {
    this.component = component;
    this.controllers = [];
  }

  public to(controller: StateController<any>, selector: StateSelectorFn): ComponentConnector {
    this.controllers.push({
      controller,
      selector: selector || (state => state),
    });
    return this;
  }

  public connect(register: ReduxRegister): React.ComponentClass {
    const Component = this.component;
    const controllers = this.controllers;

    return class extends React.Component {
      public unsubscribe: Unsubscribe|null = null;

      public constructor(props: any, context?: any) {
        super(props, context);
        this.unsubscribe = null;
      }

      render() {
        let state = {};
        for (let i = 0; i < controllers.length; i++) {
          const slice = controllers[i].controller.getStateSlice();
          state = {
            ...state,
            ...controllers[i].selector(slice),
          };
        }
        return (
          <Component
            {...this.props}
            {...state}
          />
        );
      }

      componentDidMount() {
        this.unsubscribe = register.getStore().subscribe(this.handleChange.bind(this))
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
