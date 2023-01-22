// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import {
  ObjectiveStore,
  ObjectiveStoreProvider,
  createAction,
  getActionNameForController,
  useActionToLoadComponent,
} from 'objective-redux';

// Action in the lazy-loaded bundle we want to target
//
// Note that the, when the page loads, the controller for this action is not present, yet.
// Objective Redux will see that the bundle needs to be loaded before the action can be
// fired and handle the loading and setup.
const lazyLoadedComponentAction = getActionNameForController('lazy', 'test');

// Setup the ObjectiveStore
const objectiveStore = new ObjectiveStore();

// Setup a function to fire our action in the lazy-loaded bundle
//
// This will fire an action that cannot be resolved until the lazy-loaded bundle has
// been loaded and setup. When Objective Redux sees this action fired, it will download
// the bundle, setup the controllers, resolve the React.lazy component, and fire the
// action.
const action = createAction(lazyLoadedComponentAction);
const load = () => {
  objectiveStore.dispatch(action());
};

// Our initially rendered components
const MainComponent = () => {
  // The hook to setup lazy loading
  const LazyComponent = useActionToLoadComponent(
    lazyLoadedComponentAction,
    () => import(/* webpackChunkName: "lazy" */ './lazy-module')
  );

  return (
    <>
      <Suspense fallback={<div>Click the button</div>}>
        <LazyComponent />
      </Suspense>
      <button onClick={load} id="load-bundle">Click Me</button>
    </>
  );
};

// Output the page
const applicationRoot = document.createElement('div');
applicationRoot.id = 'appMain';
document.body.appendChild(applicationRoot);
ReactDOM.render(
  <ObjectiveStoreProvider objectiveStore={objectiveStore}>
    <MainComponent />
  </ObjectiveStoreProvider>,
  applicationRoot
);
