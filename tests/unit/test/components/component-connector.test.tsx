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
import { render, screen } from '../../utils';
import {
  ObjectiveStoreProvider,
  ComponentConnector,
  ObjectiveStore,
  StateController,
  ReducerInjector,
} from '../../../../src';

class ConnectedTest extends React.Component {
  public override render(): React.ReactChild {
    const content = JSON.stringify(
      this.props,
      Object.keys(this.props).sort()
    );

    return (
      <div>
        {content}
      </div>
    );
  }
}

class SliceOne extends StateController<any> {
  protected constructor() {
    super({
      a: 'A',
      b: 'B1',
      c: 'C1',
    });
  }
}

class SliceTwo extends StateController<any> {
  protected constructor() {
    super({
      b: 'B2',
      c: 'C2',
    });
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

    const injector = new ReducerInjector();
    injector.getReducerCreationFn()(({ T: () => 'test' }));

    const objectiveStore = new ObjectiveStore({
      injector,
    });

    render(
      <ObjectiveStoreProvider objectiveStore={objectiveStore}>
        <Connected />
      </ObjectiveStoreProvider>
    );

    const expectedObj = {
      objectiveStore: objectiveStore,
      a: 'A',
      b: 'B2',
      c: 'C1',
      foo: 'C2',
      T: 'test',
    };

    screen.findByText(
      JSON.stringify(
        expectedObj,
        Object.keys(expectedObj).sort()
      )
    );
  });

  it('Ignores connection with no store', () => {
    const Connected = ComponentConnector
      .addPropsTo(ConnectedTest)
      .fromController(SliceOne as any)
      .fromController(SliceTwo as any, (slice: any) => ({ b: slice.b, foo: slice.c }))
      .fromState(state => ({ T: state.T }))
      .connect();

    render(
      <Connected />
    );

    const expectedObj = {};

    screen.findByText(
      JSON.stringify(
        expectedObj,
        Object.keys(expectedObj).sort()
      )
    );
  });
});
