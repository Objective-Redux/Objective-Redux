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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureDebounce = exports.configureTakeLeading = exports.configureTakeEvery = exports.configureTakeLatest = void 0;
var get_redux_saga_module_1 = require("./get-redux-saga-module");
/**
 * Returns a function that will create a takeLatest saga watcher. This can be used with the SagaBuilder::withEffect()
 * method.
 *
 * @returns A function that creates a takeLatest watching function.
 * @example
 * ```typescript
 * configureTakeLatest();
 * ```
 */
function configureTakeLatest() {
    var effects = get_redux_saga_module_1.getReduxSagaEffects();
    return function (config) { return function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects.takeLatest(config.name, config.sagaFn)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }; };
}
exports.configureTakeLatest = configureTakeLatest;
/**
 * Returns a function that will create a takeEvery saga watcher. This can be used with the SagaBuilder::withEffect()
 * method.
 *
 * @returns A function that creates a takeEvery watching function.
 * @example
 * ```typescript
 * configureTakeEvery();
 * ```
 */
function configureTakeEvery() {
    var effects = get_redux_saga_module_1.getReduxSagaEffects();
    return function (config) { return function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects.takeEvery(config.name, config.sagaFn)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }; };
}
exports.configureTakeEvery = configureTakeEvery;
/**
 * Returns a function that will create a takeLeading saga watcher. This can be used with the SagaBuilder::withEffect()
 * method.
 *
 * @returns A function that creates a takeLeading watching function.
 * @example
 * ```typescript
 * configureTakeLeading();
 * ```
 */
function configureTakeLeading() {
    var effects = get_redux_saga_module_1.getReduxSagaEffects();
    return function (config) { return function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects.takeLeading(config.name, config.sagaFn)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }; };
}
exports.configureTakeLeading = configureTakeLeading;
/**
 * Returns a function that will create a debounce saga watcher. This can be used with the SagaBuilder::withEffect()
 * method.
 *
 * @param debounceConfig The configuration for the watcher.
 * @returns A function that creates a debounce watching function.
 * @example
 * ```typescript
 * configureDebounce({ debounceTime: 1000 });
 * ```
 */
function configureDebounce(debounceConfig) {
    var effects = get_redux_saga_module_1.getReduxSagaEffects();
    return function (config) { return function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, effects.debounce((debounceConfig === null || debounceConfig === void 0 ? void 0 : debounceConfig.debounceTime) || 0, config.name, config.sagaFn)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }; };
}
exports.configureDebounce = configureDebounce;
// export function configureTake(): TakeBuilder {
//   //
// }
