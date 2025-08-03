export {};

declare global {
  interface Window {
    ic?: {
      plug?: Plug;
    };
  }

  interface Plug {
    requestConnect(): Promise<void>;
    isConnected(): Promise<boolean>;
    isWalletLocked: boolean;
    requestBalance(): Promise<PlugBalance[]>;
    agent: {
      getPrincipal(): Promise<Principal>;
    };
  }

  interface Principal {
    toText(): string;
  }

  interface PlugBalance {
    amount: number;
    canisterId: string;
    decimals: number;
    name: string;
    standard: string;
    symbol: string;
  }
}
