"use strict";
// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentConnector = void 0;
const React = require("react");
const context_1 = require("./context");
/**
 * Builder that connections a React component to the Objective Redux register, allowing the component to use the states
 * and dispatch events.
 *
 * This provides the React component with a `register` prop, which is an instance of the ReduxRegister connected to the
 * components closest provided ancestor. It also provides props from the states that were added.
 *
 * As an alternative for functional components, the useRegister hook can be used to get the ReduxRegister.
 *
 * @example
 * ```typescript
 * export default ComponentConnector
 *   .addPropsTo(MyReactComponent)
 *   .from(MyStateControllerOne)
 *   .from(MyStateControllerTwo, slice => ({ a: slice.a }))
 *   .connect();
 * ```
 */
class ComponentConnector {
    constructor(component) {
        this.component = component;
        this.controllers = [];
    }
    /**
     * Starts the builder for a React component.
     *
     * @param component The React component to which the props will be added.
     * @returns An instance of the ComponentConnector builder.
     */
    static addPropsTo(component) {
        return new ComponentConnector(component);
    }
    /**
     * Gets parameters from the specified StateController and injects them into the properties of the component.
     *
     * @template C The state controller class being connected. Will be inferred from the first parameter.
     * @param controller The state controller from which properties will be extracted.
     * @param selector An optional mapping function.
     * @returns An instance of the ComponentConnector builder.
     */
    from(controller, selector = null) {
        this.controllers.push({
            controller,
            selector: selector || ((state) => state),
        });
        return this;
    }
    /**
     * Finishes the builder and provides the connected component.
     *
     * @returns The connected React component.
     */
    connect() {
        var _a;
        const Component = this.component;
        const { controllers } = this;
        const connected = (_a = class extends React.Component {
                constructor(props, context) {
                    super(props, context);
                    this.unsubscribe = null;
                    this.unsubscribe = null;
                    this.mounted = false;
                }
                shouldComponentUpdate() {
                    return false;
                }
                render() {
                    if (!this.unsubscribe && this.mounted) {
                        return null;
                    }
                    this.mounted = true;
                    const register = this.context;
                    let state = {};
                    for (let i = 0; i < controllers.length; i++) {
                        const slice = controllers[i].controller.getInstance(register).getStateSlice();
                        state = Object.assign(Object.assign({}, state), controllers[i].selector(slice));
                    }
                    return (React.createElement(Component, Object.assign({}, this.props, state, { register })));
                }
                componentDidMount() {
                    const register = this.context;
                    this.unsubscribe = register.subscribe(this.handleChange.bind(this));
                }
                componentWillUnmount() {
                    if (this.unsubscribe) {
                        this.unsubscribe();
                        this.unsubscribe = null;
                    }
                }
                handleChange() {
                    if (this.unsubscribe) {
                        this.forceUpdate();
                    }
                }
            },
            _a.contextType = context_1.RegisterProviderContext,
            _a.displayName = 'ComponentConnector',
            _a);
        return connected;
    }
}
exports.ComponentConnector = ComponentConnector;
