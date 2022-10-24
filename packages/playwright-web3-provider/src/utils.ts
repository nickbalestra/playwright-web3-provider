import { Eip1193Bridge } from "@ethersproject/experimental/lib/eip1193-bridge";
import { E2ESetup } from ".";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractArgs(args: Array<any>) {
  const isCallbackForm =
    typeof args[0] === "object" && typeof args[1] === "function";
  let callback;
  let method;
  let params;
  if (isCallbackForm) {
    callback = args[1];
    method = args[0].method;
    params = args[0].params;
  } else {
    method = args[0];
    params = args[1];
  }
  return {
    callback,
    method,
    params,
  };
}

export function injectBridge(bridge: Eip1193Bridge) {
  window.ethereum = bridge;
}

export function injectSetup(
  initalizer: ({ privateKey, rpcUrl, chainId }: E2ESetup) => void
) {
  window.WEB3 = { ...window.WEB3, init: initalizer };
}
