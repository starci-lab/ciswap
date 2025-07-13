import { Network } from "@/types"

export const APTOS_SWAP_RESOURCE_TESTNET_ACCOUNT =
  "0x0328cfaf0b3ca022c27aec4c0de43faf3b93226a7327d81c78dfb8b8808cd041"
export const APTOS_SWAP_RESOURCE_MAINNET_ACCOUNT =
  "0x0328cfaf0b3ca022c27aec4c0de43faf3b93226a7327d81c78dfb8b8808cd041"

export const APTOS_FA_FACTORY_RESOURCE_TESTNET_ACCOUNT =
  "0x52bd3d0e3da53c52cdd23cafd7709d6c9fe4345b9bda387708b470d0c555cb57"
export const APTOS_FA_FACTORY_RESOURCE_MAINNET_ACCOUNT =
  "0x52bd3d0e3da53c52cdd23cafd7709d6c9fe4345b9bda387708b470d0c555cb57"

export interface AptosAccounts {
  [Network.Mainnet]: string;
  [Network.Testnet]: string;
}
export const aptosSwapResourceAccounts: AptosAccounts = {
    [Network.Mainnet]: APTOS_SWAP_RESOURCE_MAINNET_ACCOUNT,
    [Network.Testnet]: APTOS_SWAP_RESOURCE_TESTNET_ACCOUNT,
}

export const aptosFaFactoryResourceAccounts: AptosAccounts = {
    [Network.Mainnet]: APTOS_FA_FACTORY_RESOURCE_MAINNET_ACCOUNT,
    [Network.Testnet]: APTOS_FA_FACTORY_RESOURCE_TESTNET_ACCOUNT,
}

export enum AptosFQNModule {
  FaFactory = "faFactory",
  Swap = "swap",
}

export interface BuildAptosFQNParams {
  network?: Network;
  moduleName: string;
  functionNameOrResourceType: string;
  module?: AptosFQNModule;
}

export type AptosFQN = `${string}::${string}::${string}`
export const buildAptosFQN  = (
    params: BuildAptosFQNParams
): AptosFQN => {
    const { network, moduleName, functionNameOrResourceType, module } = params
    
    let accounts: AptosAccounts
    switch (module) {
    case AptosFQNModule.FaFactory:
        accounts = aptosFaFactoryResourceAccounts
        break
    default:
        accounts = aptosSwapResourceAccounts
    }    
    return `${
        accounts[network ?? Network.Mainnet]
    }::${moduleName}::${functionNameOrResourceType}`
}
