import { Eip1193Bridge } from "@ethersproject/experimental/lib/eip1193-bridge";
import { E2ESetup } from "../";

export {};

declare global {
  interface Window {
    ethereum?: Eip1193Bridge;
    WEB3?: {
      init: ({ privateKey, rpcUrl, chainId }: E2ESetup) => void;
    };
  }
}
