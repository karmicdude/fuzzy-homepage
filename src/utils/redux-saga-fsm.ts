import { Saga } from 'redux-saga';
import { call, put, select, fork, take } from 'redux-saga/effects';
import { callSafe } from './redux-saga';
import { Action, ActionCreator, getType } from 'typesafe-actions';

interface FsmActionData {
  nextState?: string; // next state name
  nextStateFn?: Saga; // next state name getter
  callback?: Saga; // post processing callback
}

type Nullable<T> = T | null;

type FsmActionDataGetter = (...args: any[]) => Generator<any, Nullable<FsmActionData>, any>;
function isActionDataGetter(
  d: Nullable<FsmActionData | FsmActionDataGetter>
): d is FsmActionDataGetter {
  return typeof d === 'function';
}

function isActionCreator(a: string | ActionCreator): a is ActionCreator {
  return typeof a === 'function';
}

interface FsmStateData {
  [index: string]: FsmActionData | FsmActionDataGetter;
}

interface FsmData {
  [index: string]: FsmStateData;
}

interface StateGetter {
  (state: any): string;
}

const INIT_STATE = '__init_state__';
const INIT_ACTION = '__init_action__';

export class SagaFsm {
  fsmData: FsmData = {};

  protected stateContext: Nullable<string> = null;
  protected actionContext: Nullable<string> = null;
  protected stateGetter?: StateGetter;
  protected stateSetter?: ActionCreator;

  /**
   * Set the state setter function.
   */
  setter(setterFn: ActionCreator): this {
    this.stateSetter = setterFn;
    return this;
  }

  /**
   * Set the state getter function.
   */
  getter(getterFn: StateGetter): this {
    this.stateGetter = getterFn;
    return this;
  }

  /**
   * Set state and action context to define initial
   * state and action.
   */
  init(): this {
    this.in(INIT_STATE);
    this.on(INIT_ACTION);
    return this;
  }

  /**
   * Set current state context.
   */
  in(state: string): this {
    this.stateContext = state;
    this.actionContext = null;

    if (!this.fsmData[this.stateContext]) {
      this.fsmData[this.stateContext] = {};
    }

    return this;
  }

  /**
   * Set current action context.
   */
  on(action: string | ActionCreator): this {
    if (!this.stateContext) throw new Error('Not in STATE context');

    if (isActionCreator(action)) {
      action = getType(action);
    }

    this.actionContext = action;
    this.fsmData[this.stateContext][this.actionContext] = {};
    return this;
  }

  /**
   * Update action data for current state and action context.
   */
  protected updateAction(data: FsmActionData | FsmActionDataGetter) {
    if (!this.stateContext) throw new Error('Not in STATE context');
    if (!this.actionContext) throw new Error('Not in ACTION context');

    const s: string = this.stateContext;
    const a: string = this.actionContext;

    if (isActionDataGetter(data)) {
      this.fsmData[s][a] = data;
    } else {
      this.fsmData[s][a] = {
        ...this.fsmData[s][a],
        ...data,
      };
    }
  }

  /**
   * Set next state for current state and action context.
   */
  goto(nextState: string | Saga): this {
    if (typeof nextState === 'function') {
      this.updateAction({ nextStateFn: nextState });
    } else {
      this.updateAction({ nextState: nextState });
    }
    return this;
  }

  /**
   * Set callback for current state and action context.
   * It will be called after state change.
   */
  cb(callback: Saga): this {
    if (typeof callback !== 'function') return this;
    this.updateAction({ callback });
    return this;
  }

  /**
   * Get action data from given function and set it
   * for current state and action context.
   */
  do(fn: FsmActionDataGetter): this {
    if (typeof fn !== 'function') return this;
    this.updateAction(fn);
    return this;
  }

  show() {
    console.log('SHOW:', this.fsmData);
  }

  /**
   * Return the loop generator bound to 'this'.
   */
  loop() {
    return this.loopFn.bind(this);
  }

  // protected *getActionData(state: string, action: string): Generator<any, Nullable<FsmActionData>, any> {
  protected *getActionData(state: string, action: string): Generator<any, any, any> {
    if (!this.fsmData[state]) return null;
    if (!this.fsmData[state][action]) return null;

    let actionData: Nullable<FsmActionData | FsmActionDataGetter> = this.fsmData[state][action];
    if (actionData && isActionDataGetter(actionData)) {
      actionData = yield* callSafe(actionData as FsmActionDataGetter);
    }
    return actionData as FsmActionData;
  }

  /**
   * Wait for actions and call the processing
   */
  protected *loopFn() {
    if (typeof this.stateGetter !== 'function') throw new Error('State getter was not set');
    if (typeof this.stateSetter !== 'function') throw new Error('State setter was not set');

    const actionData = yield* callSafe(this.getActionData.bind(this), INIT_STATE, INIT_ACTION);
    if (actionData) {
      yield* this.process(actionData);
    }

    while (true) {
      const state = this.stateGetter(yield select());
      const possibleActions = [...Object.keys(this.fsmData[state] || {})];

      if (!possibleActions || !possibleActions.length) {
        return;
      }

      const action: Action = yield take(possibleActions);
      const actionData = yield* callSafe(this.getActionData.bind(this), state, action.type);
      if (actionData) {
        yield* this.process(actionData, action);
      }
    }
  }

  /**
   * Calls next state setter and callback.
   */
  protected *process(actionData: FsmActionData, action?: Action) {
    let nextState: Nullable<string> = actionData.nextState || null;
    if (!nextState && typeof actionData.nextStateFn === 'function') {
      nextState = yield call(actionData.nextStateFn, action);
    }

    if (nextState && typeof this.stateSetter === 'function') {
      yield put(this.stateSetter(nextState));
    }

    if (typeof actionData.callback === 'function') {
      yield fork(actionData.callback, action);
    }
  }
}
