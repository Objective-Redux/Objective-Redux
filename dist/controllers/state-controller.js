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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateController = void 0;
var action_1 = require("../helpers/action");
var controller_1 = require("./controller");
/**
 * Creates and manages a slice of Redux state.
 *
 * @template State The interface to which the slice of state will adhere.
 *
 * @example JavaScript
 * ```javascript
 * class SwitchStateController extends StateController {
 *   constructor() {
 *     super({ isOn: false });
 *   }
 *
 *   public static getName() {
 *     return 'switch';
 *   }
 *
 *   action = this.createReducingAction(
 *     (state, payload) => ({
 *       ...state,
 *       ...payload,
 *     })
 *   ).withAddressableName('MY_ACTION');
 * }
 *
 * const objectiveStore = new ObjectiveStore();
 * const controller = SwitchStateController.getInstance(objectiveStore);
 * controller.action({ isOn: true });
 * const slice = controller.getStateSlice();
 * ```
 */
var StateController = /** @class */ (function (_super) {
    __extends(StateController, _super);
    /**
     * Registers the controller, sets up the reducer, and sets the initial state.
     *
     * WARNING: While the constructor can be called directly, controllers are meant to be initialized with the
     * [[getInstance]] method. Creating instances directly can lead to having more than one instance at a time, which may
     * have adverse affects on the application.
     *
     * @param initialState The initial value of the state slice in Redux.
     * @returns An instance of the controller.
     */
    function StateController(initialState) {
        var _this = _super.call(this) || this;
        /**
         * A map of the reducer action names to the data mutation functions.
         */
        _this.reducerMap = {};
        /**
         * Fires an action that resets the state back to the controller's initial state.
         *
         * @example
         * ```typescript
         * MyController.getInstance(objectiveStore).reset();
         * ```
         */
        _this.reset = _this.createReducingAction(function () { return _this.initialState; });
        _this.initialState = initialState;
        return _this;
    }
    /**
     * Registers a data mutator as part of the slice's reducer and returns the action for calling it.
     *
     * @template Payload The interface to which the payload of the action will adhere. If the type is void, no payload
     * will be accepted. Defaults to void when the template is not provided and the payload type is not specified.
     *
     * @param fn The mutating function to add to the reducer.
     *
     * The function should be in the form:
     * ```.
     * (state, payload?) => state
     * ```.
     *
     * @returns The action producing function for calling the mutating function.
     *
     * This action producing function also has a `withAddressableName` function that can be called to change the action
     * name. For example: `myAction.withAddressableName('MY_ACTION_NAME');`.
     */
    StateController.prototype.createReducingAction = function (fn) {
        var _this = this;
        var actionName = this.createActionName();
        this.reducerMap[actionName] = fn;
        var actionFn = action_1.createConnectedAction(actionName, function () { return _this.objectiveStore; });
        /**
         * Adds a specific name to the saga so that it can be addressed without calling the specific action returned by
         * this builder.
         *
         * @param name The name of the action.
         * @returns The action producing function for calling the mutating function.
         */
        actionFn.withAddressableName = function (name) {
            delete _this.reducerMap[actionName];
            var addressableActionName = _this.createActionName(name);
            _this.reducerMap[addressableActionName] = fn;
            return action_1.createConnectedAction(addressableActionName, function () { return _this.objectiveStore; });
        };
        return actionFn;
    };
    /**
     * The reducer, which handles mutations to the state slice.
     *
     * @param state The current state of the state slice.
     * @param action The action being performed on the state.
     * @returns The new state resulting from the action.
     */
    StateController.prototype.reducer = function (state, action) {
        if (state === void 0) { state = this.initialState; }
        if (action === void 0) { action = null; }
        var reducerFn = this.reducerMap[(action === null || action === void 0 ? void 0 : action.type) || ''];
        if (!reducerFn || !action) {
            return state;
        }
        return reducerFn(state, action.payload);
    };
    /**
     * Gets the current value for this slice of the Redux state.
     *
     * @returns The current slice of the state related to this controller.
     */
    StateController.prototype.getStateSlice = function () {
        var state = this.objectiveStore.getState();
        var namespace = this.constructor.getNamespace();
        state = state && namespace ? state[namespace] : state;
        return state && state[this.constructor.getName()];
    };
    return StateController;
}(controller_1.Controller));
exports.StateController = StateController;
