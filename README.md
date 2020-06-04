<div style="text-align: center; border: 1px solid; border-radius: 10px; margin: 80px; padding: 30px;">
  <h1 style="border-bottom: 1px dotted; margin-bottom: 0; padding-bottom: 8px; width: 300px; margin:auto;">Objective Redux</h1>
  <h2 style="padding: 0; margin-bottom: 0;">Redux made better, objectively.</h2>
  <p style="margin-top: 5px;">Object-oriented, light-weight, and TypeScript compatible.</p>
  <p>
    <a href="https://www.npmjs.com/package/objective-redux"><img src="https://img.shields.io/npm/v/objective-redux" alt="NPM Version" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
    <a href="https://github.com/Objective-Redux/Objective-Redux/actions"><img src="https://github.com/Objective-Redux/Objective-Redux/workflows/Build/badge.svg" alt="build status" /></a>
  </p>
</div>

# Meet your new Redux API
## Example Slice
```javascript
import { StateController } from 'objective-redux';

export class SwitchStateController extends StateController {
  constructor(stateName) {
    super(stateName, initialState);
  }

  toggleSwitch = this.registerAction(
    (state) => ({ isOn: !state.isOn })
  );

  setSwitch = this.registerAction(
    (state, isOn) => ({ isOn })
  );
}
```
```javascript
SwitchOneController.getInstance(register).toggleSwitch();
```

<br />

<br />

# Start using it now

Can't wait to get started?

You can read the full documentation here:

https://objective-redux.github.io/Objective-Redux/

<br />

<br />

# Why use Objective-Redux?

<br />

## Drop the boilerplate code

### Actions are a thing of the past.

Among other things.

Object-Redux largely removes the need for action names, actions, switch-statement-reducers, selectors, and dispatching. You just need to write the mutating function. Objective-Redux can take it from there.

```typescript
  // Define your mutation and forget about the rest.
  myAction = this.registerAction(
    (state, payload) => ({
      ...state,
      value: payload.value,
    })
  );
```

<br />

## Organize your state

<div style="overflow: auto;">
  <img src="./statics/organize.png" alt="organize reducing function into a single class that represents a slice" style="height: 200px; float: right;" />
  <h3>The logic for your slice, together at last.</h3>
  <p>Each controller class represents a slice, giving an intuitive way for developers to look at and conceptualize the state.</p>
  <p>A slice of state never needs to know about what other slices are doing or how they're organized.</p>
</div>

<br />

## Easy Debugging

### No more global searches for action names.

Using Objective-Redux, your editor knows exactly where to find everything. That means you get intellisense, jump to definition, and more. Plus, your actions and reducer will never get out-of-sync.

<p style="text-align: center;">
  <img src="./statics/debugging.png" alt="Debugging in VS Code" style="height: 500px;" />
</p>

<br />

## Un-wired, lazy-loaded data

### Get the pieces of state you need, when you need them.

Stop registering your reducers and sagas. Objective-Redux will take care of it for you, and it will do it on demand, dynamically, at runtime. Your store no longer needs to know about what's in it, leaving you free to move parts around as needed.

<img src="./statics/lazy.png" alt="organize reducing function into a single class that represents a slice" style="height: 200px;" />