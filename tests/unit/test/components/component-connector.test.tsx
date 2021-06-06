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
import { configure, mount } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { ObjectiveStoreProvider, ComponentConnector } from '../../../../src';

configure({ adapter: new Adapter() });

const mockState = { T: 'test' };
const unsubscribe = jest.fn();
const subscribe = jest.fn(() => unsubscribe);
const getState = jest.fn(() => mockState);

const objectiveStoreMock: any = {
  subscribe,
  getState,
};

class ConnectedTest extends React.Component {
  public render(): React.ReactChild {
    return <div />;
  }
}

class SliceOne {
  public static getInstance(): any {
    return new SliceOne();
  }

  public getStateSlice(): any {
    return {
      a: 'A',
      b: 'B1',
      c: 'C1',
    };
  }
}

class SliceTwo {
  public static getInstance(): any {
    return new SliceTwo();
  }

  public getStateSlice(): any {
    return {
      b: 'B2',
      c: 'C2',
    };
  }
}

describe('component-connector', () => {
  it('creates a connected element', () => {
    const Connected = ComponentConnector
      .addPropsTo(ConnectedTest)
      .fromController(SliceOne as any)
      .fromController(SliceTwo as any, (slice: any) => ({ b: slice.b, foo: slice.c }))
      .fromState(state => ({ T: state.T }))
      .connect();

    const wrapper = mount(
      <ObjectiveStoreProvider objectiveStore={objectiveStoreMock}>
        <Connected />
      </ObjectiveStoreProvider>
    );

    expect(wrapper.find('div')).toHaveLength(1);

    const connectedComponent = wrapper.find('ConnectedTest');
    expect(connectedComponent).toHaveLength(1);
    expect(connectedComponent.props()).toEqual({
      objectiveStore: objectiveStoreMock,
      a: 'A',
      b: 'B2',
      c: 'C1',
      foo: 'C2',
      T: 'test',
    });

    expect(subscribe).toHaveBeenCalled();
    (subscribe.mock.calls as any)[0][0]();
  });

  it('unmounts properly', () => {
    const Connected = ComponentConnector
      .addPropsTo(ConnectedTest)
      .connect();

    const wrapper = mount(
      <ObjectiveStoreProvider objectiveStore={objectiveStoreMock}>
        <Connected />
      </ObjectiveStoreProvider>
    );

    wrapper.unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it('does not update unless forced', () => {
    const Connected: any = ComponentConnector
      .addPropsTo(ConnectedTest)
      .connect();

    const instance: any = new Connected({ foo: 'bar' });
    instance.unsubscribe = null;
    instance.mounted = true;
    instance.forceUpdate = null;

    instance.handleChange();
    instance.componentWillUnmount();

    expect(instance.render()).toBeNull();
  });

  it('handleChange triggers only when state data has changed', () => {
    const Connected: any = ComponentConnector
      .addPropsTo(ConnectedTest)
      .connect();

    const instance: any = new Connected({ foo: 'bar' });
    instance.unsubscribe = jest.fn();
    instance.mounted = true;
    instance.forceUpdate = jest.fn();
    instance.getState = (): any => ({ a: 1 });

    instance.handleChange();

    expect(instance.forceUpdate).toBeCalledTimes(1);
  });
});
