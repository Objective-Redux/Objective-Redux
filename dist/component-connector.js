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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
var context_1 = require("./context");
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
var ComponentConnector = /** @class */ (function () {
    function ComponentConnector(component) {
        this.component = component;
        this.controllers = [];
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
    ComponentConnector.prototype.from = function (controller, selector) {
        if (selector === void 0) { selector = null; }
        this.controllers.push({
            controller: controller,
            selector: selector || (function (state) { return state; }),
        });
        return this;
    };
    /**
     * Finishes the builder and provides the connected component.
     *
     * @returns The connected React component.
     */
    ComponentConnector.prototype.connect = function () {
        var _a;
        var Component = this.component;
        var controllers = this.controllers;
        var connected = (_a = /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1(props, context) {
                    var _this = _super.call(this, props, context) || this;
                    _this.unsubscribe = null;
                    _this.unsubscribe = null;
                    _this.mounted = false;
                    return _this;
                }
                class_1.prototype.shouldComponentUpdate = function () {
                    return false;
                };
                class_1.prototype.render = function () {
                    if (!this.unsubscribe && this.mounted) {
                        return null;
                    }
                    this.mounted = true;
                    var register = this.context;
                    var state = {};
                    for (var i = 0; i < controllers.length; i++) {
                        var slice = controllers[i].controller.getInstance(register).getStateSlice();
                        state = __assign(__assign({}, state), controllers[i].selector(slice));
                    }
                    return (React.createElement(Component, __assign({}, this.props, state, { register: register })));
                };
                class_1.prototype.componentDidMount = function () {
                    var register = this.context;
                    this.unsubscribe = register.subscribe(this.handleChange.bind(this));
                };
                class_1.prototype.componentWillUnmount = function () {
                    if (this.unsubscribe) {
                        this.unsubscribe();
                        this.unsubscribe = null;
                    }
                };
                class_1.prototype.handleChange = function () {
                    if (this.unsubscribe) {
                        this.forceUpdate();
                    }
                };
                return class_1;
            }(React.Component)),
            _a.contextType = context_1.RegisterProviderContext,
            _a.displayName = 'ComponentConnector',
            _a);
        return connected;
    };
    return ComponentConnector;
}());
exports.ComponentConnector = ComponentConnector;
