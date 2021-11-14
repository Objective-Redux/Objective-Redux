# Lazy Loading example

This example waits for an action to be fired. When that happens:

 - a new webpack bundle is loaded
 - the component in the bundle is added to the DOM
 - the controller in the bundle is connected to the store
 - the store, recognizing the controller is being targeted, initialized the controller
 - the action is dispatched and reduced by the controller

 This is accomplished by using `React.lazy` and a `preDispatchHook` exposed by Objective Redux. See the [index.jsx file](./src/index.jsx).