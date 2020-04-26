import { SagaReturnType } from 'redux-saga/effects';
import { call } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';

export function createSagaInjector(runSaga, rootSaga?) {
  const injectedSagas = new Map();
  const isInjected = (key: string): boolean => injectedSagas.has(key);
  const injectSaga = (key: string, saga): void => {
    if (isInjected(key)) return;
    const task = runSaga(saga);
    injectedSagas.set(key, task);
  };
  if (rootSaga) injectSaga('root', rootSaga);
  return injectSaga;
}

export function* callSafe<Fn extends (...args: any[]) => Generator>(
  fn: Fn,
  ...args: Parameters<Fn>
) {
  const result = yield call(fn, ...args);
  return result as Parameters<ReturnType<Fn>['return']>[0];
}

export function* callPromise<Fn extends (...args: any[]) => Promise<SagaReturnType<Fn>>>(
  fn: Fn,
  ...args: Parameters<Fn>
) {
  const result = yield call(fn, ...args);
  return result as SagaReturnType<Fn>;
}

interface ApiResponse<T extends AxiosResponse> {
  ok: boolean;
  status: number | null;
  data: T['data'] | null;
  networkError: boolean;
}

export function* callApi<Fn extends (...args: any[]) => Promise<SagaReturnType<Fn>>>(
  fn: Fn,
  ...args: Parameters<Fn>
) {
  let result: ApiResponse<SagaReturnType<Fn>> = {
    ok: false,
    status: null,
    data: null,
    networkError: false,
  };

  try {
    const res = yield call(fn, ...args);
    result = { ...result, ok: true, data: res.data, status: res.status };
  } catch (err) {
    if (err && err.response) {
      const res = err.response;
      result = { ...result, status: res.status };
    } else {
      // // // // // // // // // // // // // // //
      // TODO: dispatch network error here!!!
      // // // // // // // // // // // // // // //

      result = { ...result, networkError: true };
    }
  }
  return result as ApiResponse<SagaReturnType<Fn>>;
}
