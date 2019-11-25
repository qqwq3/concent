import { Component, ReactNode } from 'react';

export interface IAnyObj { [key: string]: any }
export interface IAnyFn {
  (...args: any): any;
}
export interface IAnyFnInObj { [key: string]: IAnyFn }

interface IComputedFnDesc {
  fn: typeof computedFn;
  compare?: boolean;
  depKeys?: string[];
}
interface IReducerFn {
  (payload: any, moduleState: any, actionCtx: IActionCtx): any;
}

// !!!use infer
export type ArrItemsType<T extends any[]> = T extends Array<infer E> ? E : never;

export type ComputeValType<T> = {
  readonly [K in keyof T]: T[K] extends IAnyFn ? ReturnType<T[K]> : (T[K] extends IComputedFnDesc ? ReturnType<T[K]['fn']> : unknown);
}
export type ReducerType<T> = {
  // readonly [K in keyof T]: T[K] extends IAnyFn ? (payload: Parameters<T[K]>[0]) => Promise<ReturnType<T[K]>> : unknown;
  readonly [K in keyof T]: T[K] extends IAnyFn ?
  (payload: Parameters<T[K]>[0] extends undefined ? void : Parameters<T[K]>[0]) =>
    ReturnType<T[K]> extends Promise<any> ? ReturnType<T[K]> : Promise<ReturnType<T[K]>>
  : unknown;
}

export interface EvMapBase {
  [key: string]: any[];
}

export type TStar = '*';

// type EvSyncReturn = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type TSyncReturn = (val: any) => void;
type SyncReturn = TSyncReturn;



type OnCallBack<EventCbArgs extends any[]> = (...args: EventCbArgs) => void;

type RefComputedFn<FnCtx extends IFnCtxBase, FnReturnType> = (
  oldVal: any,
  newVal: any,
  fnCtx: FnCtx,//user decide it is FnCtx or FnCtxConnect
) => FnReturnType;
type RefComputedValFn<FnCtx extends IFnCtxBase, FnReturnType, Val> = (
  oldVal: Val,
  newVal: Val,
  fnCtx: FnCtx,//user decide it is FnCtx or FnCtxConnect
) => FnReturnType;

declare function computedFn<FnCtx extends IFnCtxBase>(
  oldVal: any,
  newVal: any,
  fnCtx: FnCtx,//user decide it is FnCtx or FnCtxConnect
): any;
declare function computedFn<Val, FnCtx extends IFnCtxBase>(
  oldVal: Val,
  newVal: Val,
  fnCtx: FnCtx,//user decide it is FnCtx or FnCtxConnect
): any;



interface IDefaultBase {
  $$global: any,
  $$default: any,
  $$cc?: any,
  [customizedKey: string]: any;
}
export interface DefaultState extends IDefaultBase {
}
// default computed
interface DefaultCu extends IDefaultBase {
}
// default reducer
interface DefaultRd extends IDefaultBase {
}


// export function dodo<TA, TB, keyof TA extends keyof TB>(a: TA, b: TB): void; 
type MyPick<RootState extends DefaultState, ConnectedModules extends keyof DefaultState> = Pick<RootState, ConnectedModules>;

type Super<T> = T extends infer U ? U : object;

/**
 * 
 * @param eventName 
 * @param cb 
 * suggest use conditional type to maitain EventCbArgsType
 * 
    // or type EventCbArgsType<EventName>
    type ET<EventName> = 
      EventName extends 'foo' ? [string, number] :
      EventName extends 'bar' ? [string, boolean] :
      [];
 */
declare function refCtxOn<EventCbArgs extends any[]>(eventName: string, cb: OnCallBack<EventCbArgs>): void;
declare function refCtxOn<EventCbArgs extends any[]>(eventDesc: [string, string?], cb: OnCallBack<EventCbArgs>): void;
declare function refCtxOn<EventCbArgs extends any[]>(eventDesc: { name: string, identity?: string }, cb: OnCallBack<EventCbArgs>): void;

// this way is better!!!
declare function refCtxOn<EvMap extends EvMapBase, EvName extends string>(eventName: EvName, cb: OnCallBack<EvMap[EvName]>): void;
declare function refCtxOn<EvMap extends EvMapBase, EvName extends string>(eventDesc: [string, string?], cb: OnCallBack<EvMap[EvName]>): void;
declare function refCtxOn<EvMap extends EvMapBase, EvName extends string>(eventDesc: { name: string, identity?: string }, cb: OnCallBack<EvMap[EvName]>): void;

declare function refCtxEmit<EventCbArgs extends any[]>(eventName: string, ...args: EventCbArgs): void;
declare function refCtxEmit<EventCbArgs extends any[]>(eventDesc: [string, string?], ...args: EventCbArgs): void;
declare function refCtxEmit<EventCbArgs extends any[]>(eventDesc: { name: string, identity?: string }, ...args: EventCbArgs): void;

declare function refCtxOff(eventName: string): void;
declare function refCtxOff(eventDesc: [string, string?]): void;
declare function refCtxOff(eventDesc: { name: string, identity?: string }): void;

/**
 * 
 * @param type 
 * @param payload 
 * @param renderKey 
 * @param delay 
 *  if first arg type is string, user should mannually make sure fnName an fn is mapped correctly, if you don not want to do so, you can write code like below
 * 
 *  function aaa(){}; function bbb(){};
    type reducerFnType<FnName> =
      FnName extends 'aaa' ? typeof aaa :
      FnName extends 'bbb' ? typeof bbb :
      null;

    type PayloadType<FnName extends string> = (Parameters<reducerFnType<FnName>>)[0];
    type reducerFnResultType<FnName extends string> = ReturnType<reducerFnType<FnName>>;
 */
declare function refCtxDispatch<Fn extends IReducerFn>(type: string, payload: (Parameters<Fn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<Fn>>;
declare function refCtxDispatch<TypeAsFn extends IReducerFn>(type: TypeAsFn, payload: (Parameters<TypeAsFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<TypeAsFn>>;
declare function refCtxDispatch<TypeAsFn extends IReducerFn>(type: { module: string, fn: TypeAsFn }, payload: (Parameters<TypeAsFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<TypeAsFn>>;

declare function refCtxInvoke<UserFn extends IReducerFn>(fn: UserFn, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<UserFn>>;
declare function refCtxInvoke<UserFn extends IReducerFn>(fn: UserFn, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<UserFn>>;
declare function refCtxInvoke<UserFn extends IReducerFn>(fn: { module: string, fn: UserFn }, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<UserFn>>;

declare function refCtxSetState<FullState>(state: Partial<FullState>, cb?: (newFullState: FullState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetState<FullState>(moduleName: string, state: Partial<FullState>, cb?: (newFullState: FullState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetState(state: IAnyObj, cb?: (newFullState: IAnyObj) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetState(moduleName: string, state: IAnyObj, cb?: (newFullState: IAnyObj) => void, renderKey?: string, delay?: number): void;

declare function refCtxSetGlobalState<GlobalState>(state: Partial<GlobalState>, cb?: (newFullState: GlobalState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetGlobalState(state: IAnyObj, cb?: (newFullState: IAnyObj) => void, renderKey?: string, delay?: number): void;

declare function refCtxSetModuleState<ModuleState>(moduleName: string, state: Partial<ModuleState>, cb?: (newFullState: ModuleState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetModuleState(moduleName: string, state: IAnyObj, cb?: (newFullState: IAnyObj) => void, renderKey?: string, delay?: number): void;

declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType>(retKey: string, computedFn: RefComputedFn<IFnCtx, FnReturnType>): void;
declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType, ValType>(retKey: string, computedFn: RefComputedValFn<IFnCtx, FnReturnType, ValType>): void;

declare function syncCb(value: any, keyPath: string, syncContext: { moduleState: object, fullKeyPath: string, state: object, refCtx: object }): IAnyObj;
declare function syncCb<Val, ModuleState, RefCtx extends IRefCtxBase>(value: Val, keyPath: string, syncContext: { moduleState: ModuleState, fullKeyPath: string, state: ModuleState, refCtx: RefCtx }): IAnyObj;
// if module state is not equal full state, you need pass generic type FullState
declare function syncCb<Val, ModuleState, FullState, RefCtx extends IRefCtxBase>(value: Val, keyPath: string, syncContext: { moduleState: ModuleState, fullKeyPath: string, state: FullState, refCtx: RefCtx }): IAnyObj;

//////////////////////////////////////////
// exposed interface
//////////////////////////////////////////

/**
 * use this interface to match ctx type that component only defined belong module
 * 
 * concent will build ctx for every instance
 * for class get get like this: this.ctx
 * for function get get like this: const ctx = useConcent('foo');
 */
interface IRefCtxBase{
  module: '$$default' | string | any;
  // module: '$$default';
  reducerModule: string;
  ccKey: string;
  ccClassKey: string;
  ccUniqueKey: string;
  initTime: number;
  renderCount: number;
  storedKeys: string[] | TStar;
  watchedKeys: string[] | TStar;
  connect: { [key: string]: string[] | TStar };
  ccOptions: {
    persistStoredKeys?: string[];
    storedKeys?: string[];
  };

  state: IAnyObj;
  props: IAnyObj;
  moduleState: IAnyObj;
  globalState: IAnyObj;
  connectedState: IAnyObj;
  refComputed: IAnyObj;
  refConnectedComputed: IAnyObj;
  moduleComputed: IAnyObj;
  globalComputed: IAnyObj;
  connectedComputed: IAnyObj;
  computed: typeof refCtxComputed;

  moduleReducer: IAnyObj;
  moduleLazyReducer: IAnyObj;
  connectedReducer: IAnyObj;
  connectedLazyReducer: IAnyObj;
  reducer: IAnyObj;
  lazyReducer: IAnyObj;// to let MyPick works, here don't use IAnyFnInObj

  on: typeof refCtxOn;
  emit: typeof refCtxEmit;
  off: typeof refCtxOff;
  dispatch: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxDispatch;
  invoke: typeof refCtxInvoke;
  lazyInvoke: typeof refCtxInvoke;
  setState: typeof refCtxSetState;
  setGlobalState: typeof refCtxSetGlobalState;
  setModuleState: typeof refCtxSetModuleState;
  sync: (string: string, value?: typeof syncCb | any, renderKey?: string, delay?: string) => SyncReturn;
  syncBool: (string: string, renderKey?: string, delay?: string) => SyncReturn;
  syncInt: (string: string, renderKey?: string, delay?: string) => SyncReturn;
  set: (string: string, value: any, renderKey?: string, delay?: string) => void;
  setBool: (string: string, renderKey?: string, delay?: string) => void;
  settings: IAnyObj;
}

interface IRefCtxMBase<ModuleName extends (string | any) > extends IRefCtxBase{
  module: ModuleName;
}

//  ***********************************************************
//  ************ when module state equal ref state ************
//  ***********************************************************
export interface IRefCtx
  <
  RootState extends IDefaultBase,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase ,// let RootReducer[ModuleName] works
  Props,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxMBase<ModuleName> {
  globalState: RootState['$$global'];
  moduleState: RootState[ModuleName];
  moduleReducer: RootReducer[ModuleName];
  state: RootState[ModuleName];
  props: Props;
  settings: Settings;
  refConnectedComputed: Rccu;
}
/**
 * match ctx type: use belonged module computed
 */
export interface IRefCtxMcu
  <
  RootState extends IDefaultBase,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  Props,
  ModuleCu, // moduleComputed
  Settings extends IAnyObj,
  Rccu extends IAnyObj, // refConnectedComputed
  >
  extends
  IRefCtx<RootState, RootReducer, ModuleName, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules
 */
export interface IRefCtxMcuCon
  <
  RootState extends IDefaultBase,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  Props,
  ModuleCu,
  ConnectedModules extends keyof RootState,
  RootCu extends RootState,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends
  IRefCtx<RootState, RootReducer, ModuleName, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
  connectedState: Pick<RootState, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: use belonged module computed, define ref computed in setup
 */
export interface IRefCtxMcuRcu
  <
  RootState extends IDefaultBase,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  Props,
  ModuleCu,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtx<RootState, RootReducer, ModuleName, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
  refComputed: RefCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules, define ref computed in setup
 */
export interface IRefCtxMcuConRcu
  <
  RootState extends IDefaultBase,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  Props,
  ModuleCu,
  RootCu extends IDefaultBase,
  ConnectedModules extends keyof IDefaultBase,
  RefCu, Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxMcuRcu<RootState, RootReducer, ModuleName, Props, ModuleCu, RefCu, Settings, Rccu> {
  connectedState: MyPick<RootState, ConnectedModules>;
  connectedComputed: MyPick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules
 */
export interface IRefCtxCon
  <
  RootState extends IDefaultBase,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  Props,
  ConnectedModules extends keyof IDefaultBase,
  RootCu extends IDefaultBase,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtx<RootState, RootReducer, ModuleName, Props, Settings, Rccu> {
  // overwrite connectedState , connectedComputed
  connectedState: MyPick<RootState, ConnectedModules>;
  connectedComputed: MyPick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules, define ref computed in setup
 */
export interface IRefCtxConRcu
  <
  RootState extends IDefaultBase,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  Props,
  ConnectedModules extends keyof RootState,
  RootCu extends RootState,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtx<RootState, RootReducer, ModuleName, Props, Settings, Rccu> {
  connectedState: Pick<RootState, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
  refComputed: RefCu;
}
/**
 * match ctx type: define ref computed in setup
 */
export interface IRefCtxRcu
  <
  RootState extends IDefaultBase,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  Props,
  RefCu,
  Settings extends IAnyObj,
  >
  extends IRefCtx<RootState, RootReducer, ModuleName, Props, IAnyObj, IAnyObj> {
  refComputed: RefCu;
}

//  ***************************************************************
//  ************ when module state not equal ref state ************
//  ***************************************************************
export interface IRefCtxRs<
  RootState extends IDefaultBase,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  RefState,
  Props,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  > extends IRefCtxMBase<ModuleName> {
  globalState: RootState['$$global'];
  moduleState: RootState[ModuleName];
  moduleReducer: RootReducer[ModuleName];
  state: RefState;
  props: Props;
  settings: Settings;
  refConnectedComputed: Rccu;
}
/**
 * match ctx type: use belonged module computed
 */
export interface IRefCtxRsMcu
  <
  RootState extends DefaultState,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  RefState,
  Props,
  ModuleCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends
  IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules
 */
export interface IRefCtxRsMcuCon
  <
  RootState extends DefaultState,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  RefState,
  Props,
  ModuleCu,
  ConnectedModules extends keyof RootState,
  RootCu extends RootState,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends
  IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
  connectedState: Pick<RootState, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: use belonged module computed, define ref computed in setup
 */
export interface IRefCtxRsMcuRcu
  <
  RootState extends DefaultState,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  RefState,
  Props,
  ModuleCu,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
  refComputed: RefCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules, define ref computed in setup
 */
export interface IRefCtxRsMcuConRcu
  <
  RootState extends DefaultState,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  RefState,
  Props,
  ModuleCu,
  RootCu extends IDefaultBase,
  ConnectedModules extends keyof IDefaultBase,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxRsMcuRcu<RootState, RootReducer, ModuleName, RefState, Props, ModuleCu, RefCu, Settings, Rccu> {
  connectedState: MyPick<RootState, ConnectedModules>;
  connectedReducer: MyPick<RootReducer, ConnectedModules>;
  connectedComputed: MyPick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules
 */
export interface IRefCtxRsCon
  <
  RootState extends DefaultState,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  RefState,
  Props,
  ConnectedModules extends keyof IDefaultBase,
  RootCu extends IDefaultBase,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  // overwrite connectedState , connectedComputed
  connectedState: MyPick<RootState, ConnectedModules>;
  connectedComputed: MyPick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules, define ref computed in setup
 */
export interface IRefCtxRsConRcu
  <
  RootState extends DefaultState,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  RefState,
  Props,
  ConnectedModules extends keyof RootState,
  RootCu extends RootState,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  connectedState: Pick<RootState, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
  refComputed: RefCu;
}
/**
 * match ctx type: define ref computed in setup
 */
export interface IRefCtxRsRcu
  <
  RootState extends DefaultState,
  RootReducer extends IDefaultBase,
  ModuleName extends keyof IDefaultBase,
  RefState,
  Props,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  refComputed: RefCu;
}

export interface IFnCtxBase {
  retKey: string;
  setted: string[];
  changed: string[];
  stateModule: string;
  refModule: string;
  oldState: IAnyObj;
  committedState: IAnyObj;
  refCtx: IRefCtxBase;
}
export interface IFnCtxMBase<ModuleName> {
  retKey: string;
  setted: string[];
  changed: string[];
  stateModule: string;
  refModule: string;
  oldState: IAnyObj;
  committedState: IAnyObj;
  refCtx: IRefCtxMBase<ModuleName>;
}
export interface IFnCtx<RefCtx extends IRefCtxBase> extends IFnCtxBase {
  refCtx: RefCtx;
}
export interface IFnCtxComm<RefCtx extends IRefCtxBase, FullState> extends IFnCtxBase {
  oldState: FullState;
  committedState: Partial<FullState>;
  refCtx: RefCtx;
}
export interface IFnCtxM<ModuleName, RefCtx extends IRefCtxMBase<ModuleName>> extends IFnCtxMBase<ModuleName> {
  refCtx: RefCtx;
}
export interface IFnCtxMComm<ModuleName, RefCtx extends IRefCtxMBase<ModuleName>, FullState> extends IFnCtxMBase<ModuleName> {
  oldState: FullState;
  committedState: Partial<FullState>;
  refCtx: RefCtx;
}

declare class ConcentComponent extends Component {
}

interface RegisterOptions<RootState, ModuleState, RefState> {
  module?: string;// default '$$default'
  watchedKeys?: (keyof ModuleState)[];
  storedKeys?: (Exclude<keyof RefState, keyof ModuleState>)[];
  connect?: (keyof RootState | '$$global' | '$$default')[] |
  // currently I do not know how to pass ${moduleName} to evaluate target type
  // something like (keyof RootState[moduleName] )[] but it is wrong writing
  { [moduleName in (keyof RootState | '$$global' | '$$default')]?: TStar | string[] };
  tag?: string;
  persistStoredKeys?: Boolean;
  lite?: 1 | 2 | 3 | 4;
  reducerModule?: string;// defuault equal ${module}
  isPropsProxy?: Boolean;// default false
  isSingle?: Boolean; //default false
  renderKeyClasses?: string[];
  compareProps?: Boolean;//default true
  setup?: IAnyObj;
}

interface FnRegisterOptions<RootState, ModuleState, RefState> extends RegisterOptions<RootState, ModuleState, RefState> {
  state?: IAnyFn | RefState;
}


type WatchFn = <RootState, ModuleState>(
  oldVal: any,
  newVal: any,
  fnCtx: IFnCtxBase,//user decide it is FnCtx or FnCtxConnect
) => void;
type WatchFnDesc = {
  fn: WatchFn,
  compare?: boolean,
  immediate?: boolean,
  depKeys?: string[],
}

type TypeDesc = {
  module?: string;
  reducerModule?: string;
  type: string;
  cb?: Function;
};

type ModuleConfig = {
  state: Object;
  reducer?: {
    [fnName: string]: IReducerFn;
  };
  computed?: {
    [retKey: string]: typeof computedFn | IComputedFnDesc;
  };
  watch?: {
    [retKey: string]: WatchFn | WatchFnDesc;
  };
  init?: <ModuleState>() => Partial<ModuleState>
}

interface StoreConfig {
  [moduleName: string]: ModuleConfig;
}

type StateInfo = {
  committedState: object, sharedState: object, module: string,
  type: string, ccUniqueKey: string, renderKey: string,
};
type PluginOn = (sig: string | string[], callback: (data: { sig: string, payload: any }) => void) => void;
interface Plugin {
  install: (on: PluginOn) => { name: string };
}
interface RunOptions {
  middlewares: ((stateInfo: StateInfo, next: Function) => void)[];
  plugins: Plugin[];
}

interface IActionCtxBase {
  targetModule: string;
  invoke: typeof refCtxInvoke;
  lazyInvoke: typeof refCtxInvoke;
  dispatch: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxDispatch;
  setState: (obj: IAnyObj) => Promise<IAnyObj>;
}
export interface IActionCtx extends IActionCtxBase {
  refCtx: {};
}
// constraint RefCtx must be an implement of IRefCtxBase
export interface IActionCtxRef<RefCtx extends IRefCtxBase> extends IActionCtxBase {
  refCtx: RefCtx;
}

//////////////////////////////////////////
// exposed top api
//////////////////////////////////////////

/**
 * 
 * @param clearAll default false
 * @param warningErrForClearAll 
 */
export function clearContextIfHot(clearAll: boolean, warningErrForClearAll?: string): void;

export function run(storeConfig?: StoreConfig | null, runOptions?: RunOptions): void;

export function register<RootState, ModuleState>(
  registerOptions: String | RegisterOptions<RootState, ModuleState, ModuleState>,
  ccClassKey?: string,
): (ReactCompType: typeof Component) => typeof ConcentComponent;
export function register<RootState, ModuleState, RefState>(
  registerOptions: String | RegisterOptions<RootState, ModuleState, RefState>,
  ccClassKey?: string,
): (ReactCompType: typeof Component) => typeof ConcentComponent;

//use decide it is RefCtx or RefCtxConnect
export function registerDumb<RootState, ModuleState, RefCtxBase>(
  registerOptions: String | FnRegisterOptions<RootState, ModuleState, ModuleState>,
  ccClassKey?: string,
): (renderFn: (props: RefCtxBase | any) => ReactNode) => typeof Component;
export function registerDumb<RootState, ModuleState, RefState, RefCtxBase>(
  registerOptions: String | FnRegisterOptions<RootState, ModuleState, RefState>,
  ccClassKey?: string,
): (renderFn: (props: RefCtxBase | any) => ReactNode) => typeof Component;

//use decide it is RefCtx or RefCtxConnect
export function useConcent<RootState extends DefaultState, ModuleState, RefState, RefCtx extends IRefCtxBase>(
  registerOptions: String | FnRegisterOptions<RootState, RootState, RefState>,
  ccClassKey?: string,
): RefCtx;
// when moduleState equal refState
export function useConcent<RootState extends DefaultState, ModuleState, RefCtx extends IRefCtxBase>(
  registerOptions: String | FnRegisterOptions<RootState, RootState, ModuleState>,
  ccClassKey?: string,
): RefCtx;

export function configure(moduleName: string, moduleConfig: ModuleConfig): void;

export function cloneModule(newModule: string, existingModule: string, overwriteModuleConfig?: ModuleConfig): void;

export function setState<RootState, moduleState>(moduleName: keyof RootState, state: Partial<moduleState>, renderKey?: string, delay?: number): void;

export function setGlobalState<GlobalState>(state: Partial<GlobalState>): void;

export function getState<RootState>(moduleName?: keyof RootState): object;

export function getGlobalState<RootState extends IDefaultBase>(): RootState['$$global'];

export function getConnectedState<RootState>(ccClassKey: string): Partial<RootState>;

export function getComputed<T>(moduleName?: string): T;

export function getGlobalComputed<T>(): T;

export function set(keyPath: string, value: any, renderKey?: string, delay?: number): void;

export function dispatch<T>(type: string | TypeDesc, payload?: any, renderKey?: string, delay?: number): Promise<T>;

export function lazyDispatch<T>(type: string | TypeDesc, payload?: any, renderKey?: string, delay?: number): Promise<T>;

/**
 * user specify detail type when use
 * 
 * import {reducer} from 'concent';
 * import { RootReducer } from 'types';
 * 
 * const typedReducer = reducer as RootReducer;
 */
export declare const reducer: any;
export declare const lazyReducer: any;

declare type DefaultExport = {
  clearContextIfHot: typeof clearContextIfHot,
  run: typeof run,
  register: typeof register,
  registerDumb: typeof registerDumb,
  useConcent: typeof useConcent,
  configure: typeof configure,
  cloneModule: typeof cloneModule,
  setState: typeof setState,
  setGlobalState: typeof setGlobalState,
  getState: typeof getState,
  getGlobalState: typeof getGlobalState,
  getConnectedState: typeof getConnectedState,
  getComputed: typeof getComputed,
  getGlobalComputed: typeof getGlobalComputed,
  set: typeof set,
  dispatch: typeof dispatch,
  lazyDispatch: typeof lazyDispatch,
  reducer: typeof reducer,
  lazyReducer: typeof lazyReducer,
}

declare let defaultExport: DefaultExport;
export default defaultExport;

export as namespace cc;