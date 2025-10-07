/* tslint:disable */
/* eslint-disable */
/**
* Creates a method handler with the given client options.
* @param {string} options
* @returns {Promise<ClientMethodHandler>}
*/
export function createClient(options: string): Promise<ClientMethodHandler>;
/**
* Necessary for compatibility with the node.js bindings.
* @param {ClientMethodHandler} method_handler
* @returns {Promise<void>}
*/
export function destroyClient(method_handler: ClientMethodHandler): Promise<void>;
/**
* Handles a method, returns the response as a JSON-encoded string.
*
* Returns an error if the response itself is an error or panic.
* @param {ClientMethodHandler} method_handler
* @param {string} method
* @returns {Promise<string>}
*/
export function callClientMethod(method_handler: ClientMethodHandler, method: string): Promise<string>;
/**
* MQTT is not supported for WebAssembly bindings.
*
* Throws an error if called, only included for compatibility
* with the Node.js bindings TypeScript definitions.
* @param {string[]} _topics
* @param {Function} _callback
* @returns {Promise<void>}
*/
export function listenMqtt(_topics: string[], _callback: Function): Promise<void>;
/**
* Creates a method handler with the given secret_manager options.
* @param {string} options
* @returns {SecretManagerMethodHandler}
*/
export function createSecretManager(options: string): SecretManagerMethodHandler;
/**
* Handles a method, returns the response as a JSON-encoded string.
*
* Returns an error if the response itself is an error or panic.
* @param {SecretManagerMethodHandler} method_handler
* @param {string} method
* @returns {Promise<string>}
*/
export function callSecretManagerMethod(method_handler: SecretManagerMethodHandler, method: string): Promise<string>;
/**
* Stronghold snapshot migration is not supported for WebAssembly bindings.
*
* Throws an error if called, only included for compatibility
* with the Node.js bindings TypeScript definitions.
* @param {string} _current_path
* @param {string} _current_password
* @param {string} _salt
* @param {number} _rounds
* @param {string | undefined} [_new_path]
* @param {string | undefined} [_new_password]
*/
export function migrateStrongholdSnapshotV2ToV3(_current_path: string, _current_password: string, _salt: string, _rounds: number, _new_path?: string, _new_password?: string): void;
/**
* Handles a method, returns the response as a JSON-encoded string.
*
* Returns an error if the response itself is an error or panic.
* @param {string} method
* @returns {string}
*/
export function callUtilsMethodRust(method: string): string;
/**
* Creates a method handler with the given options.
* @param {string} options
* @returns {Promise<WalletMethodHandler>}
*/
export function createWallet(options: string): Promise<WalletMethodHandler>;
/**
* @param {WalletMethodHandler} method_handler
* @returns {Promise<void>}
*/
export function destroyWallet(method_handler: WalletMethodHandler): Promise<void>;
/**
* @param {WalletMethodHandler} method_handler
* @returns {Promise<ClientMethodHandler>}
*/
export function getClient(method_handler: WalletMethodHandler): Promise<ClientMethodHandler>;
/**
* @param {WalletMethodHandler} method_handler
* @returns {Promise<SecretManagerMethodHandler>}
*/
export function getSecretManager(method_handler: WalletMethodHandler): Promise<SecretManagerMethodHandler>;
/**
* Handles a method, returns the response as a JSON-encoded string.
*
* Returns an error if the response itself is an error or panic.
* @param {WalletMethodHandler} method_handler
* @param {string} method
* @returns {Promise<string>}
*/
export function callWalletMethod(method_handler: WalletMethodHandler, method: string): Promise<string>;
/**
* It takes a list of event types, registers a callback function, and then listens for events of those
* types
*
* Arguments:
*
* * `vec`: An array of strings that represent the event types you want to listen to.
* * `callback`: A JavaScript function that will be called when a wallet event occurs.
* * `method_handler`: This is the same method handler that we used in the previous section.
* @param {WalletMethodHandler} method_handler
* @param {Array<any>} vec
* @param {Function} callback
* @returns {Promise<any>}
*/
export function listenWallet(method_handler: WalletMethodHandler, vec: Array<any>, callback: Function): Promise<any>;
/**
* Initializes the console error panic hook for better panic messages.
* Gets automatically called when using wasm
*/
export function start(): void;
/**
* The Wasm bindings do not support internal logging configuration yet.
*
* Calling this will enable all rust logs to be show
* @param {string} _config
* @returns {Promise<void>}
*/
export function initLogger(_config: string): Promise<void>;
/**
* The Client method handler.
*/
export class ClientMethodHandler {
  free(): void;
}
/**
* The SecretManager method handler.
*/
export class SecretManagerMethodHandler {
  free(): void;
}
/**
* The Wallet method handler.
*/
export class WalletMethodHandler {
  free(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_clientmethodhandler_free: (a: number) => void;
  readonly createClient: (a: number, b: number) => number;
  readonly destroyClient: (a: number) => number;
  readonly callClientMethod: (a: number, b: number, c: number) => number;
  readonly listenMqtt: (a: number, b: number) => number;
  readonly __wbg_secretmanagermethodhandler_free: (a: number) => void;
  readonly createSecretManager: (a: number, b: number, c: number) => void;
  readonly callSecretManagerMethod: (a: number, b: number, c: number) => number;
  readonly migrateStrongholdSnapshotV2ToV3: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => void;
  readonly callUtilsMethodRust: (a: number, b: number, c: number) => void;
  readonly __wbg_walletmethodhandler_free: (a: number) => void;
  readonly createWallet: (a: number, b: number) => number;
  readonly destroyWallet: (a: number) => number;
  readonly getClient: (a: number) => number;
  readonly getSecretManager: (a: number) => number;
  readonly callWalletMethod: (a: number, b: number, c: number) => number;
  readonly listenWallet: (a: number, b: number, c: number) => number;
  readonly start: () => void;
  readonly initLogger: (a: number, b: number) => number;
  readonly __wbindgen_export_0: (a: number, b: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_export_3: (a: number, b: number) => void;
  readonly __wbindgen_export_4: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export_5: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_6: (a: number) => void;
  readonly __wbindgen_export_7: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

/**
* Loads the Wasm file so the lib can be used, relative path to Wasm file
*
* @param {string | undefined} path
*/
export function init(path?: string): Promise<void>;