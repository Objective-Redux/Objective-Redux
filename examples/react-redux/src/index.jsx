// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ObjectiveStoreProvider, ObjectiveStore } from 'objective-redux';
import ConnectedComponent from './connected-component';
import ConnectedStateComponent from './connected-state-component';
import HookComponent from './hook-component';
import HookStateComponent from './hook-state-component';
import ReactReduxComponent from './react-redux-component';
import { SwitchStateController } from './store/switch-state-controller';
import { SwitchStateSagas } from './store/switch-state-sagas';

export const objectiveStore = new ObjectiveStore({
  sagaContext: {
    test: 'Some Value',
  },
});

const removeStateController = () => SwitchStateController.removeInstance(objectiveStore);
const removeStatelessController = () => SwitchStateSagas.removeInstance(objectiveStore);

ReactDOM.render(
  <React.StrictMode>
    <ObjectiveStoreProvider objectiveStore={objectiveStore}>
      <Provider store={objectiveStore}>
        <ConnectedComponent />
        <HookComponent />
        <ReactReduxComponent />
        <ConnectedStateComponent />
        <HookStateComponent />
        <button id="removeStateController" onClick={removeStateController}>Remove StateController</button>
        <br />
        <button id="removeStatelessController" onClick={removeStatelessController}>Remove StatelessController</button>
        <br />
        <p id="statelessConstructorCount" />
      </Provider>
    </ObjectiveStoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
