# `createAction`

Used to create an action generating function. The returned function can be used to manually dispatch actions through Redux.

### Template

> `Payload`
>
> The type of input that the action function will take and the type of the payload sent in the action.

### Parameters

> `type: string`
>
>The action type that will be dispatch

### Returns

> `(payload: Payload) => Action<Payload>`
>
> A function that creates an action that can be dispatched Actions are of the type `{type, payload}`.

### Examples

JavaScript
```javascript
const myActionFn = createAction('MY_ACTION_TYPE');
console.log(myActionFn('Hello world!'));
```
TypeScript
```typescript
const myActionFn = createAction<string>('MY_ACTION_TYPE');
console.log(myActionFn('Hello world!'));
```
Output
```javascript
{ type: 'MY_ACTION_TYPE', payload: 'Hello world!' }
```

<br />

<br />

<br />

<br />

<br />

<br />

# `ComponentConnector`

Builder that connections a React component to the Objective Redux register, allowing the component to use the states and dispatch events.

<br />

<br />

## Static `addPropsTo`

Starts the builder process for a given React component.

### Parameters

> `component: React.ComponentClass`
>
> The React component to which the state values and the register will be added as props.

### Returns

> `ComponentConnector`
>
> An instance of the ComponentConnector builder.

<br />

<br />

## `from`

Adds data from a state controller to the React component as a property.

### Parameters

> `controller: StateController`
>
> The state controller from which to connect properties.

> `selector: StateSelectorFn` (optional)
>
> A function that takes in the state slice from the controller and returns the properties to add to the component.
>
> Used for complex mapping and/or resolving conflicts between state controllers.

### Returns

> `ComponentConnector`
>
> An instance of the ComponentConnector builder.

<br />

<br />

## `connect`

Finishes the builder and provides the connected component.

### Returns

> `React.ComponentClass`
>
> A component connected to the register and provided with the props from the state controllers.



## Examples

JavaScript and TypeScript
```typescript
export default ComponentConnector
  .addPropsTo(MyReactComponent)
  .from(MyStateControllerOne)
  .from(MyStateControllerTwo, slice => ({ a: slice.a }))
  .connect();
```

<br />

<br />

<br />

<br />

<br />

<br />

# `getRegisterFromContext`

Used in Sagas to get the register instance.

### Returns

> `ReduxRegister`
>
> An instance of the ReduxRegister that is associated with the Redux store in which the saga is running.

### Examples

JavaScript or TypeScript
```typescript
function* () {
    const register = yield getRegisterFromContext();
}
```

<br />

<br />

<br />

<br />

<br />

<br />

# `ReduxRegister`

The ReduxRegister handles the connection of controllers, reducers, and sagas to Redux. Each ReduxRegister has its own Redux store that it manages.

<br />

<br />

## `constructor`

Instantiates the ReduxRegister object

### Returns

> `ReduxRegister`
>
> The ReduxRegister object that was instantiated

### Examples

JavaScript and TypeScript
```typescript
const register = new ReduxRegister();
```

<br />

<br />

## `getStore`

Returns the Redux store that is managed by the register instance.

WARNING: Do not attempt to connect reducers, sagas, or other components (including middleware) to the store directly. The register instance will override the values any time new controllers are connected.

### Returns

> `Store`
>
> An instance of the Redux store that the register instance manages.

### Examples

JavaScript and TypeScript
```typescript
const register = new ReduxRegister();
register.getStore().dispatch(myAction());
```

<br />

<br />

## `registerReducer`

Adds a reducer to the register's Redux store.

### Parameters

> `name: string`
>
> The name of the reducer/the name of the state slice.

> `reducerFn: Reducer`
>
> The reducer that is being registered.

### Examples

JavaScript and TypeScript
```typescript
const reducer = (state = { isOn: false }, action) {
  switch (action.type) {
    case 'MY_ACTION':
      return {
        ...state,
        isOn: !state.isOn,
      };
    default:
      return state;
  }
};

const register = new ReduxRegister();
register.registerReducer('switch', reducer);
```

<br />

<br />

## `registerSaga`

Adds and and begins running a saga as part in the context of the store that the register manages.

### Parameters

> `sagaFn: SagaFn`
>
> The saga to add to the register.

### Examples

JavaScript and TypeScript
```typescript
function* sagaFn() {
  yield console.log('Hello, world!');
}

const register = new ReduxRegister();
register.registerSaga(sagaFn);
```

<br />

<br />

<br />

<br />

<br />

<br />

# abstract `StateController`

Creates and manages a slice of Redux state.

<br />

<br />

## Static `getInstance`

Gets an instance of the class, creating one if it does not yet exist.

### Parameters

> `register: ReduxRegister`
>
> A ReduxRegister instance from which to get the controller.

### Returns

> `StateController`
>
> An instance of the controller.

<br />

<br />

## protected `constructor`

Registers the controller, sets up the reducer, and sets the initial state.

WARNING: While the constructor can be called directly, state controllers are meant to be initialized with the `getInstance` method. Creating instances directly can lead to having more than one instance at a time, which may have adverse affects on the application.

### Template

> `State`
>
> The type or interface of state slice for which the controller will be managing.

### Parameters

> `stateName: string`
>
> The name of the reducer/slice of state in the Redux store.

> `initialState: State`
>
> The initial value of the state slice in Redux.

> `register: RedixRegister`
>
> The ReduxRegister instance to which the controller will be connected.

### Returns

> `StateController`
>
> An instance of the state controller.

<br />

<br />

## protected `registerAction`

...

### Template

> `Payload`
>
> The type of payload that will be passed into the action and sent to the reducer.

### Parameters

> ``
>
> 

### Returns

> 

### `withAddressableName`
...

<br />

<br />

## protected `reducer`

...

### Parameters

> ``
>
> 

### Returns

> 

<br />

<br />

## `getStateSlice`

...

### Returns

> 




## Examples

JavaScript
```javascript
class SwitchStateController extends StateController {
  constructor(register) {
    super('switch', { isOn: false }, register);
  }

  action = this.registerAction(
    (state, payload) => ({
      ...state,
      ...payload,
    })
  ).withAddressableName('MY_ACTION');
}

const register = new ReduxRegister();
const controller = SwitchStateController.getInstance(register);
const slice = controller.getStateSlice();
```
TypeScript
```typescript
interface SwitchState {
  isOn: boolean;
}

class SwitchStateController extends StateController<SwitchState> {
  constructor(register: ReduxRegister) {
    super('switch', { isOn: false }, register);
  }

  const readonly action = this.registerAction<SwitchState>(
    (state, payload) => ({
      ...state,
      ...payload,
    })
  ).withAddressableName('MY_ACTION');
}

const register = new ReduxRegister();
const controller = SwitchStateController.getInstance(register);
const slice = controller.getStateSlice();
```

<br />

<br />

<br />

<br />

<br />

<br />

# abstract `StatelessController`

<br />

<br />

<br />

<br />

<br />

<br />

# `TakeType`



## Static ``

Starts the builder process for a given React component.

### Template

> ``
>
> 

### Parameters

> ``
>
> 

### Returns

> 

### Examples

JavaScript
```javascript

```
TypeScript
```typescript

```
Output
```javascript

```
