// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import React, { Profiler } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ObjectiveStoreProvider, ObjectiveStore } from 'objective-redux';
import ConnectedComponentMaker from './connected-component';
import ReactReduxComponentMaker from './react-redux-component';
import { CountStateControllerOne } from './store/count-state-controller-one';
import { CountStateControllerTwo } from './store/count-state-controller-two';
import { CountStateControllerThree } from './store/count-state-controller-three';
import { CountStateControllerFour } from './store/count-state-controller-four';
import { CountStateControllerFive } from './store/count-state-controller-five';
import { metrics } from './metrics';

const USE_OBJECTIVE_REDUX = true;
const TOP_LEVEL_ELEMENTS = 100;
const NESTED_ELEMENT_DEPTH = 5;
const SPLIT_ELEMENTS_BY = 2;
const TOTAL_ACTIONS_TO_FIRE = 40;

let totalElements = 0;

export const objectiveStore = new ObjectiveStore();

const controllers = [
  CountStateControllerOne,
  CountStateControllerTwo,
  CountStateControllerThree,
  CountStateControllerFour,
  CountStateControllerFive,
];

const componentMaker = USE_OBJECTIVE_REDUX
  ? ConnectedComponentMaker
  : ReactReduxComponentMaker;

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
    document.getElementById('avgPaintTime').innerHTML = round(metrics.actualPaintTime / metrics.paintPasses);
    document.getElementById('avgBasePaintTime').innerHTML = round(metrics.basePaintTime / metrics.paintPasses);
    document.getElementById('totalPaintTime').innerHTML = round(metrics.actualPaintTime);
    document.getElementById('totalBasePaintTime').innerHTML = round(metrics.basePaintTime);
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
  items.push(createNestedRecursively(0, i, NESTED_ELEMENT_DEPTH));
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

ReactDOM.render(
  <React.StrictMode>
    <ObjectiveStoreProvider objectiveStore={objectiveStore}>
      <Provider store={objectiveStore}>
        <h1>Load Testing Tool</h1>
        <div style={{ border: '1px solid #000', margin: '100px', padding: '100px 50px' }}>
          <h2>
            {USE_OBJECTIVE_REDUX ? 'Objective-Redux' : 'React-Redux'}
          </h2>
          <p>
            Total Connected Elements:&nbsp;
            {totalElements}
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
          <div style={{ overflow: 'auto', height: '300px', border: '5px solid #000', padding: '10px' }}>
            <h2>Elements being rendered</h2>
            {items}
          </div>
        </Profiler>
      </Provider>
    </ObjectiveStoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
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
