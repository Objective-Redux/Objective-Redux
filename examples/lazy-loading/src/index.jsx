// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import {
  ReduxRegister,
  RegisterProvider,
  createAction,
  getActionNameForController,
} from 'objective-redux';

const applicationRoot= document.createElement('div');
applicationRoot.id = 'appMain';
document.body.appendChild(applicationRoot);

const lazyLoadAction = getActionNameForController('lazy', 'test');

let resolve = null;
const LazyComponent = React.lazy(() => new Promise(
  rs => { resolve = rs; }
));

const preDispatchHook = action => {
  switch (action?.type) {
    case lazyLoadAction:
      return import(/* webpackChunkName: "lazy" */ './lazy-module').then(imported => resolve(imported));
    default:
      return null;
  }
};

const register = new ReduxRegister({
  preDispatchHook,
});

const action = createAction(lazyLoadAction);

const load = () => {
  register.dispatch(action());
};

ReactDOM.render(
  <RegisterProvider register={register}>
    <Suspense fallback={<div>Click the button</div>}>
      <LazyComponent />
    </Suspense>
    <button onClick={load} id="load-bundle">Click Me</button>
  </RegisterProvider>,
  applicationRoot
);
