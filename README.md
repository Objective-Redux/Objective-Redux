<div style="text-align: center; border: 1px solid; border-radius: 10px; margin: 80px; padding: 30px;">
  <h1 style="border-bottom: 1px dotted; margin-bottom: 0; padding-bottom: 8px; width: 250px; margin:auto;">Objective Redux</h1>
  <h2 style="padding: 0; margin-bottom: 0;">Redux made better, objectively.</h2>
  <p style="margin-top: 5px;">Object-oriented, light-weight, and TypeScript compatible.</p>
  <p>
    <img src="https://img.shields.io/npm/v/objective-redux" alt="NPM Version" />
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
  </p>
</div>

# Meet your new Redux API
## Example Slice
```javascript
import { StateController } from 'objective-redux';

class SwitchStateController extends StateController {
  constructor(stateName) {
    super(stateName, initialState);
  }

  toggleSwitch = this.registerAction(
    (state) => ({ isOn: !state.isOn })
  );

  setSwitch = this.registerAction(
    (state, isOn) => ({ isOn })
  );

  switchSelector(state, ownProps) { 
    const { isOn } = state[this.stateName];

    return {
      ...ownProps,
      switchIsOn: isOn,
    };
  }
}

// Creating a new instance is all it takes to wire up the new piece of state
export const switchOneController = new SwitchStateController('switch-number-one');
```
```javascript
SwitchOneController.getInstance(register).toggleSwitch();
```
## Features
* No boilerplate code
* No wiring-up pieces
* Built-in organization
* Easy debugging
* Support for Sagas


<br />

# Setup

## Installing Packages
In order to use Objective Redux in your project, you'll need to install it along with Redux. These should be saved as dependencies, since they will need to be run with the final application.
```
npm install --save redux objective-redux
```

If you want to use Redux-Saga, install it as well.
```
npm install --save redux-saga
```

## Connecting to Redux

First, a ReduxRegister needs to be created in order to connect state controllers.

```javascript
import { ReduxRegister } from "objective-redux";
export const register = new ReduxRegister();
```

In addition, for Reactjs, the following sets up a provider for components.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { RegisterProvider } from 'objective-redux';
import { register } from './store/register';
import App from './app';

ReactDOM.render(
  <RegisterProvider register={register}>
    <App />
  </RegisterProvider>,
  document.getElementById('root')
);

```

<br />

# Creating Slices

In Objective-Redux, a StateController handles the access and mutation of a slice of state. Every time you instantiate a StateController, the reducer associated with that state is added automatically to the `ReduxRegister`.

The `stateName` and the `initialState` are sent to the super constructor. The `stateName` will identify the piece of the state the controller is operating on and the `initialState` determines the starting configuration it.

Actions and their associated mutations are created by using the `registerAction` method. This method takes a function that, in turn, accepts the current state and the action payload as parameters and returns the new state.

Selectors and other methods can also be defined on the class as needed. The default `stateSelector` from the `StateController` parent class is also available as a selector.

Below is an example of a state controller that flips a switch on and off.

```javascript
import { StateController } from 'objective-redux';
import { register } from 'src/store/register';

const initialState = { isOn: false };

class SwitchStateController extends StateController {
  constructor(stateName, register) {        // The generated reducer is added
    super(                                  // to the ReduxRegister. No need
      stateName,                            // to wire it up manually.
      initialState,
      register
    );
  }

  toggleSwitch = this.registerAction(       // This creates a reducer and
    (state) => ({ isOn: !state.isOn })      // returns the associate action.
  );

  switchSelector(state, ownProps) {         // Optionally defined selector.
    const { isOn } = state[this.stateName]; // We could use the inherited 
                                            // stateSelector method instead
    return {                                // if we only want to flatten
      ...ownProps,                          // the object.
      switchIsOn: isOn,
    };
  }
}

// We export an instance of the class
export const switchStateController = new SwitchStateController('switch', register);
```

We export an instance of the class that can then be used directly by our components. Below is an example of how the above class would be used.

```javascript
SwitchStateController.getInstance(register).toggleSwitch();
//...
export default connect(
  (state, ownProps) => ({
    ...switchStateController.stateSelector(state, ownProps),
  })
)(MyComponent);
```

<br />

# Creating Sagas

Sagas can be created using the `StatelessController`. The `createSagaWithType` is passed a take type for the saga, defining how de-duplication of the events should be handled. Then, the `register` method is called and passed the generator function the saga will execute.

Below is an example of a Saga that will call the `toggleSwitch` method of our previously created `SwitchStateController`.

```javascript
import { StatelessController, TakeType } from "objective-redux";
import { SwitchStateController } from './switch-state-controller';
import { register } from './register';

export class SwitchStateSagas extends StatelessController {
  switchStateController = SwitchStateController.getInstance(this.register);

  toggleSwitch = this.createSagaWithTake(TakeType.TAKE_LATEST)
    .withAddressableName('SOME_NAME_HERE')
    .register(
      function* () {
        yield this.switchStateController.toggleSwitchValue();
      }.bind(this)
    );
}

export const switchStateSagas = new SwitchStateSagas(register);


```

<br />

# Code Splitting

If you need to call the action from outside your package, you can give the action a name using the `withAddressableName` method.

```javascript
  // For Reducers
  setSwitch = this.registerAction(
    (state, isOn) => ({ isOn })
  );
  .withAddressableName('SET_SWITCH_STATE');

  // For Sagas
  reset = this.createSagaWithTake(TakeType.TAKE_LATEST)
    .withAddressableName('SET_SWITCH_STATE')
    .register(
      function* (isOn) {
        yield put(switchStateController.setState(isOn));
      }
    );
```

Then, your reducer or saga can be called with
```javascript
const myAction = createAction('SET_SWITCH_STATE');
register.getStore().dispatch(createAction(isOn));
```

<br />

# TypeScript

Templating is available for projects using TypeScript. For example, if you create an action that will take a string as a parameter, it would look like the below example.

```typescript
class ThemeStateController extends StateController<ThemeState> {
  // ...

  public readonly setTheme = this.registerAction<string>(
    (state: ThemeState, theme: string) => ({
      ...state,
      theme,
    })
  );
}
```
```typescript
ThemeStateController.getInstance(register).setTheme('dark'));
```

You can also set the action template type to `<void>` to indicate that no parameter should be taken by the action.