declare global {
  interface Window {
    process?: object;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
  Reducer,
  StoreEnhancer,
  Action,
  Store,
} from 'redux';
import { lazyReducerEnhancer, LazyStore } from 'pwa-helpers/lazy-reducer-enhancer';
import createSagaMiddleware from 'redux-saga';
import { createSagaInjector } from 'utils/redux-saga';

const devCompose: <Ext0, Ext1, StateExt0, StateExt1>(
  f1: StoreEnhancer<Ext0, StateExt0>,
  f2: StoreEnhancer<Ext1, StateExt1>
) => StoreEnhancer<Ext0 & Ext1, StateExt0 & StateExt1> =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export interface RootState {
  app?: object;
}

const sagaMiddleware = createSagaMiddleware();

// state => state as Reducer<RootState, Action<any>>,

function* rootSaga() {
  //
}

interface LazySagaStore {
  injectSaga: (key: string, saga: any) => void;
}
type TotalLazyStore = Store & LazyStore & LazySagaStore;

export const store = (function(): TotalLazyStore {
  const store: Partial<Store & LazySagaStore> = createStore(
    state => state as Reducer,
    devCompose(lazyReducerEnhancer(combineReducers), applyMiddleware(sagaMiddleware))
  );
  (store as LazySagaStore).injectSaga = createSagaInjector(sagaMiddleware.run);
  return store as TotalLazyStore;
})();

// import * as auth from 'components/auth'
// store.addReducers({ [auth.NAME]: auth.reducer })
// store.injectSaga(auth.NAME, auth.saga)
