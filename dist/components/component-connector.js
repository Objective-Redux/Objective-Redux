"use strict";
// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentConnector = void 0;
var React = require("react");
var context_1 = require("../context");
var deep_equals_1 = require("../helpers/deep-equals");
/**
 * Builder that connections a React component to the Objective Redux store, allowing the component to use the states
 * and dispatch events.
 *
 * This provides the React component with an `objectiveStore` prop, which is an instance of the ObjectiveStore
 * connected to the components closest provided ancestor. It also provides props from the states that were added.
 *
 * As an alternative for functional components, the useObjectiveStore hook can be used to get the ObjectiveStore.
 *
 * @example
 * ```typescript
 * export default ComponentConnector
 *   .addPropsTo(MyReactComponent)
 *   .fromController(MyStateControllerOne)
 *   .fromController(MyStateControllerTwo, slice => ({ a: slice.a }))
 *   .connect();
 * ```
 */
var ComponentConnector = /** @class */ (function () {
    function ComponentConnector(component) {
        this.component = component;
        this.controllers = [];
        this.stateSelectors = [];
    }
    /**
     * Starts the builder for a React component.
     *
     * @param component The React component to which the props will be added.
     * @returns An instance of the ComponentConnector builder.
     */
    ComponentConnector.addPropsTo = function (component) {
        return new ComponentConnector(component);
    };
    /**
     * Gets parameters from the specified StateController and injects them into the properties of the component.
     *
     * @template C The state controller class being connected. Will be inferred from the first parameter.
     * @param controller The state controller from which properties will be extracted.
     * @param selector An optional mapping function.
     * @returns An instance of the ComponentConnector builder.
     */
    ComponentConnector.prototype.fromController = function (controller, selector) {
        if (selector === void 0) { selector = null; }
        this.controllers.push({
            controller: controller,
            selector: selector || (function (state) { return state; }),
        });
        return this;
    };
    /**
     * Adds a selection of the state to as props to the component.
     *
     * This method is provided for backward compatibility purposes. For flexibility and performance reasons, it is
     * encouraged that fromController method be used instead of this method when possible.
     *
     * @param selectorFn A function that maps the state to a selected part of the state.
     * @returns An instance of the ComponentConnector builder.
     */
    ComponentConnector.prototype.fromState = function (selectorFn) {
        this.stateSelectors.push(selectorFn);
        return this;
    };
    /**
     * Finishes the builder and provides the connected component.
     *
     * @returns The connected React component.
     */
    ComponentConnector.prototype.connect = function () {
        var _a;
        var _b = this, controllers = _b.controllers, stateSelectors = _b.stateSelectors, Component = _b.component;
        var connected = (_a = /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1(props) {
                    var _this = _super.call(this, props) || this;
                    _this.unsubscribe = null;
                    _this.unsubscribe = null;
                    _this.mounted = false;
                    _this.existingState = null;
                    return _this;
                }
                class_1.prototype.render = function () {
                    // Render can be called even though the component is unmounted.
                    // In that case, return null so that nothing is rendered.
                    if (!this.unsubscribe && this.mounted) {
                        return null;
                    }
                    var objectiveStore = this.context;
                    // This will happen on this initial render of the component
                    /* istanbul ignore else */
                    if (this.existingState === null) {
                        this.existingState = this.getState();
                    }
                    return (React.createElement(Component, __assign({}, this.existingState, this.props, { objectiveStore: objectiveStore })));
                };
                class_1.prototype.getState = function () {
                    var _a;
                    /* istanbul ignore next */
                    var state = (_a = this.context) === null || _a === void 0 ? void 0 : _a.getState();
                    var selectedState = {};
                    for (var i = 0; i < controllers.length; i++) {
                        var slice = controllers[i].controller.getInstance(this.context).getStateSlice();
                        selectedState = __assign(__assign({}, selectedState), controllers[i].selector(slice));
                    }
                    for (var i = 0; i < stateSelectors.length; i++) {
                        selectedState = __assign(__assign({}, selectedState), stateSelectors[i](state));
                    }
                    return selectedState;
                };
                class_1.prototype.componentDidMount = function () {
                    var objectiveStore = this.context;
                    this.unsubscribe = objectiveStore.subscribe(this.handleChange.bind(this));
                    this.mounted = true;
                };
                class_1.prototype.componentWillUnmount = function () {
                    if (this.unsubscribe) {
                        this.unsubscribe();
                        this.unsubscribe = null;
                    }
                };
                class_1.prototype.handleChange = function () {
                    if (this.unsubscribe) {
                        var newState = this.getState();
                        if (!deep_equals_1.deepEquals(this.existingState, newState)) {
                            this.existingState = newState;
                            this.forceUpdate();
                        }
                    }
                };
                return class_1;
            }(React.Component)),
            _a.contextType = context_1.ObjectiveStoreProviderContext,
            _a.displayName = 'ComponentConnector',
            _a);
        /* istanbul ignore next */
        return connected;
    };
    return ComponentConnector;
}());
exports.ComponentConnector = ComponentConnector;
