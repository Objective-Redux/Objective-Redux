// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import React, { Profiler } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ObjectiveStoreProvider, ObjectiveStore, StateController } from 'objective-redux';
import ConnectedComponentMaker from './connected-component';
import makeHookComponent from './hook-component';
import ReactReduxComponentMaker from './react-redux-component';
import makeReactReduxHookComponent from './react-redux-hook-component';
import { metrics } from './metrics';

const USE_OBJECTIVE_REDUX = true;
const USE_HOOKS = false;
const TOP_LEVEL_ELEMENTS = 112;
const NESTED_ELEMENT_DEPTH = 7;
const SPLIT_ELEMENTS_BY = 2;
const TOTAL_ACTIONS_TO_FIRE = 100;
const NUM_CONTROLLERS = 50;

let totalElements = 0;

export const objectiveStore = new ObjectiveStore();

const makeController = name => {
  const initialState = {
    incValue: 0,
    // START FILLER VALUES
    some: {
      other: {
        dataValues: {
          goes: {
            in: {
              here: {
                in: {
                  a: {
                    nested: {
                      way: '',
                    },
                  },
                },
              },
            },
          },
          and: {
            also: {
              goes: {
                in: {
                  here: {
                    as: {
                      well: {
                        for: {
                          good: {
                            measure: '',
                          },
                        },
                      },
                    },
                  },
                  and: {
                    also: {
                      in: {
                        here: {
                          to: {
                            make: {
                              the: {
                                state: {
                                  bigger: '',
                                },
                              },
                            },
                          },
                        },
                        and: {
                          here: '',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // END FILLER VALUES
    },
  };
  const controller = class extends StateController {
    constructor() {
      super(initialState);
    }

    static getName() {
      return name;
    }

    increment = this.createReducingAction(
      state => ({
        ...state,
        incValue: state.incValue + 1,
      })
    );
  };

  controller.initializeOnExternalAction();
  return controller;
};

const controllers = [];
for (let i = 0; i < NUM_CONTROLLERS; i++) {
  controllers.push(makeController(`controller-${i}`));
}

let componentMaker = null;

if (USE_HOOKS) {
  componentMaker = USE_OBJECTIVE_REDUX
    ? makeHookComponent
    : makeReactReduxHookComponent;
} else {
  componentMaker = USE_OBJECTIVE_REDUX
    ? ConnectedComponentMaker
    : ReactReduxComponentMaker;
}

const buttonRefs = [];

function round(num) {
  return Math.round(num * 100) / 100;
}

let firstPass = true;
let renderingRound = 0;
// eslint-disable-next-line max-statements, max-params
const callback = (id, phase, actualTime, baseTime) => {
  document.getElementById('paints').innerHTML = metrics.renders;

  if (firstPass) {
    firstPass = false;
  } else {
    metrics.paintPasses += 1;
    metrics.actualPaintTime += actualTime;
    metrics.basePaintTime += baseTime;
    document.getElementById('round').innerHTML = renderingRound;
    document.getElementById('passes').innerHTML = metrics.paintPasses;
    document.getElementById('avgPaintTime').innerHTML = `${round(metrics.actualPaintTime / metrics.paintPasses)} ms`;
    document.getElementById('avgBasePaintTime').innerHTML = `${round(metrics.basePaintTime / metrics.paintPasses)} ms`;
    document.getElementById('totalPaintTime').innerHTML = `${round(metrics.actualPaintTime)} ms`;
    document.getElementById('totalBasePaintTime').innerHTML = `${round(metrics.basePaintTime)} ms`;
  }

  if (renderingRound++ < TOTAL_ACTIONS_TO_FIRE) {
    const i = renderingRound - 1;
    setTimeout(() => buttonRefs[i % buttonRefs.length].current.click(), 0);
  } else {
    renderingRound = TOTAL_ACTIONS_TO_FIRE;
  }
};

// eslint-disable-next-line max-params
const createNestedRecursively = (current, parentNum, depth) => {
  if (current >= depth) {
    return null;
  }

  const items = [];
  for (let div = 0; div < SPLIT_ELEMENTS_BY; div++) {
    const controller = controllers[totalElements % controllers.length];
    const ComponentToRender = componentMaker(controller);
    totalElements++;
    items.push(
      <ComponentToRender key={`c:${parentNum}:${current}:${div}`}>
        {createNestedRecursively(current + 1, parentNum, depth)}
      </ComponentToRender>
    );
  }

  return items;
};

const items = [];
for (let i = 0; i < TOP_LEVEL_ELEMENTS; i++) {
  items.push(
    <div style={{ float: 'left', border: '1px solid #000', width: '100px' }}>
      {createNestedRecursively(0, i, NESTED_ELEMENT_DEPTH)}
    </div>
  );
}

const buttons = [];
for (let i = 0; i < controllers.length; i++) {
  const controller = controllers[i].getInstance(objectiveStore);
  const ref = React.createRef();
  buttonRefs.push(ref);
  buttons.push(
    <button
      onClick={() => {
        controller.increment();
      }}
      key={`btn:${i}`}
      ref={ref}
    >
      Increment Controller&nbsp;
      {i + 1}
    </button>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ObjectiveStoreProvider objectiveStore={objectiveStore}>
    <Provider store={objectiveStore}>
      <h1>Load Testing Tool</h1>
      <div style={{ border: '1px solid #000', margin: '75px', padding: '75px 50px' }}>
        <h2>
          {USE_OBJECTIVE_REDUX ? 'Objective Redux' : 'React-Redux'}
          :&nbsp;
          {USE_HOOKS ? 'Hook Components' : 'Connected Components'}
        </h2>
        <p>
          Total Connected Elements:&nbsp;
          {totalElements}
        </p>
        <p>
          Number of Controllers:&nbsp;
          {NUM_CONTROLLERS}
        </p>
        <p>
          Elements Rendered:&nbsp;
          <span id="paints">0</span>
        </p>
        <p><br /></p>
        <p>
          Initial Paint Time:&nbsp;
          <span id="initialPaint">Loading</span>
        </p>
        <p><br /></p>
        <p>
          Round of Rendering:&nbsp;
          <span id="round">0</span>
          /
          {TOTAL_ACTIONS_TO_FIRE}
        </p>
        <p><br /></p>
        <p>
          Passes:&nbsp;
          <span id="passes">No additional Renders</span>
        </p>
        <p>
          Average Paint Time:&nbsp;
          <span id="avgPaintTime">No additional Renders</span>
        </p>
        <p>
          Average Base Paint Time:&nbsp;
          <span id="avgBasePaintTime">No additional Renders</span>
        </p>
        <p><br /></p>
        <p>
          Total Paint Time:&nbsp;
          <span id="totalPaintTime">No additional Renders</span>
        </p>
        <p>
          Total Base Paint Time:&nbsp;
          <span id="totalBasePaintTime">No additional Renders</span>
        </p>
      </div>
      {buttons}
      <Profiler id="content" onRender={callback}>
        <div
          style={{
            overflow: 'auto',
            height: '95vh',
            border: '5px solid #000',
            padding: '10px',
            fontSize: '10px',
          }}
        >
          {items}
        </div>
      </Profiler>
    </Provider>
  </ObjectiveStoreProvider>
);

new Promise((resolve, reject) => {
  const observer = new PerformanceObserver(list => {
    resolve(list);
  });
  observer.observe({
    entryTypes: ['paint'],
  });
}).then(list => {
  document.getElementById('initialPaint').innerHTML = round(list.getEntries()[0].startTime);
});
