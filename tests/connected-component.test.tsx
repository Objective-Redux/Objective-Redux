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
import { configure, mount } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { RegisterProvider, ComponentConnector } from '../src';

configure({ adapter: new Adapter() });

const unsubscribe = jest.fn();
const subscribe = jest.fn(() => unsubscribe);

const registerMock: any = {
  getStore: () => ({
    subscribe,
  }),
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
  it('should create a connected element', () => {
    const Connected = ComponentConnector
      .addPropsTo(ConnectedTest)
      .from(SliceOne as any)
      .from(SliceTwo as any, (slice: any) => ({ b: slice.b, foo: slice.c }))
      .connect();

    const wrapper = mount(
      <RegisterProvider register={registerMock}>
        <Connected />
      </RegisterProvider>
    );

    expect(wrapper.find('div')).toHaveLength(1);

    const connectedComponent = wrapper.find('ConnectedTest');
    expect(connectedComponent).toHaveLength(1);
    expect(connectedComponent.props()).toEqual({
      register: registerMock,
      a: 'A',
      b: 'B2',
      c: 'C1',
      foo: 'C2',
    });

    expect(subscribe).toHaveBeenCalled();
    (subscribe.mock.calls as any)[0][0]();

    wrapper.unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
