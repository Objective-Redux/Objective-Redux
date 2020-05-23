import { Store, combineReducers } from 'redux';
import { SagaMiddleware } from 'redux-saga';

type Reducer<S, A> = (prevState: S, action: A) => S

interface ReducerMap {
  [reducer: string]: Reducer<any, any>;
}

export interface SagaFn<Payload> {
  (payload: Payload): any;
}

export class ReduxRegister {
  private static store: Store;

  private static sagaMiddleware: SagaMiddleware<object>;

  private static readonly registeredReducers: ReducerMap = {};

  private static readonly registeredSagas: SagaFn<void>[] = [];

  public static setStore(store: Store): void {
    ReduxRegister.store = store;
    ReduxRegister.updateReducers();
  }

  public static getStore(): Store {
    return ReduxRegister.store;
  }

  public static setSagaMiddleware(sagaMiddleware: SagaMiddleware<object>): void {
    ReduxRegister.sagaMiddleware = sagaMiddleware;
    ReduxRegister.registeredSagas.forEach(sagaFn => ReduxRegister.runSaga(sagaFn));
  }

  private static updateReducers(): void
  {
    if (ReduxRegister.store) {
      ReduxRegister.store.replaceReducer(combineReducers(
        ReduxRegister.getReducers()
      ));
    }
  }

  private static runSaga(sagaFn: SagaFn<void>): void {
    if (ReduxRegister.sagaMiddleware) {
      ReduxRegister.sagaMiddleware.run(sagaFn);
    }
  }

  public static registerReducer(name: string, reducerFn: Reducer<any, any>): void {
    ReduxRegister.registeredReducers[name] = reducerFn;
    ReduxRegister.updateReducers();
  }

  private static getReducers(): ReducerMap {
    return ReduxRegister.registeredReducers;
  }

  public static registerSaga(sagaFn: SagaFn<void>): void {
    ReduxRegister.registeredSagas.push(sagaFn);
    this.runSaga(sagaFn);
  }
}
