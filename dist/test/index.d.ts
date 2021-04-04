import { ObjectiveStore } from '../store/objective-store';
import { ReducerInjector } from '../store/reducer-injector';
import { StateController } from '../controllers/state-controller';
import { StatelessController } from '../controllers/stateless-controller';
import { createAction, getActionNameForController } from '../helpers/action';
import { ObjectiveStoreProvider } from '../components/objective-store-provider';
import { ComponentConnector } from '../components/component-connector';
import { getObjectiveStoreFromSagaContext } from '../hooks/get-objective-store-from-saga-context';
import { getControllerFromSagaContext } from '../hooks/get-controller-from-saga-context';
import { StatelessControllerMock } from './stateless-controller-mock';
import { StateControllerMock } from './state-controller-mock';
export { configureTakeLatest, configureTakeEvery, configureTakeLeading, configureDebounce, configureTake, } from '../helpers/effect-type';
export declare const actual: {
    ObjectiveStore: typeof ObjectiveStore;
    ReducerInjector: typeof ReducerInjector;
    StateController: typeof StateController;
    StatelessController: typeof StatelessController;
    createAction: typeof createAction;
    getActionNameForController: typeof getActionNameForController;
    ObjectiveStoreProvider: typeof ObjectiveStoreProvider;
    ComponentConnector: typeof ComponentConnector;
    getObjectiveStoreFromSagaContext: typeof getObjectiveStoreFromSagaContext;
    getControllerFromSagaContext: typeof getControllerFromSagaContext;
    useObjectiveStore: () => ObjectiveStore | null;
    useController: <C extends import("../controllers/controller").Controller>(controller: typeof import("../controllers/controller").Controller & import("../controllers/controller").ModelConstructor<C>, selectorFn?: (state: any) => any) => C | null;
    useSelector: <T>(selectorFn: (state: any) => T) => any;
};
export declare const mocked: {
    StatelessController: typeof StatelessControllerMock;
    StateController: typeof StateControllerMock;
};
//# sourceMappingURL=index.d.ts.map