import { Store, combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

type Reducer<S, A> = (prevState: S, action: A) => S

interface ReducerMap {
  [reducer: string]: Reducer<any, any>;
}

export interface SagaFn<Payload> {
  (payload: Payload): any;
}

export class ReduxRegister {
  private store: Store;

  private sagaMiddleware: SagaMiddleware<object>;

  private readonly registeredReducers: ReducerMap = {};

  private readonly registeredSagas: SagaFn<void>[] = [];

  public constructor() {
    this.sagaMiddleware = createSagaMiddleware();
    this.store = createStore(
      () => {},
      applyMiddleware(this.sagaMiddleware)
    );
  }

  public getStore(): Store {
    return this.store;
  }

  private updateReducers(): void
  {
    if (this.store) {
      this.store.replaceReducer(combineReducers(
        this.registeredReducers
      ));
    }
  }

  private runSaga(sagaFn: SagaFn<void>): void {
    if (this.sagaMiddleware) {
      this.sagaMiddleware.run(sagaFn);
    }
  }

  public registerReducer(name: string, reducerFn: Reducer<any, any>): void {
    this.registeredReducers[name] = reducerFn;
    this.updateReducers();
  }

  public registerSaga(sagaFn: SagaFn<void>): void {
    this.registeredSagas.push(sagaFn);
    this.runSaga(sagaFn);
  }
}
