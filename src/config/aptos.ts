import { Network } from "@/types"

export const APTOS_SWAP_RESOURCE_TESTNET_ACCOUNT =
  "0x0328cfaf0b3ca022c27aec4c0de43faf3b93226a7327d81c78dfb8b8808cd041"
export const APTOS_SWAP_RESOURCE_MAINNET_ACCOUNT =
  "0x0328cfaf0b3ca022c27aec4c0de43faf3b93226a7327d81c78dfb8b8808cd041"

export const aptosSwapResourceAccounts = {
    [Network.Mainnet]: APTOS_SWAP_RESOURCE_MAINNET_ACCOUNT,
    [Network.Testnet]: APTOS_SWAP_RESOURCE_TESTNET_ACCOUNT,
}

export interface BuildAptosSwapFQNParams {
  network?: Network;
  moduleName: string;
  functionNameOrResourceType: string;
}

export type AptosFQN = `${string}::${string}::${string}`
export const buildAptosSwapFQN  = (
    params: BuildAptosSwapFQNParams
): AptosFQN => {
    const { network, moduleName, functionNameOrResourceType } = params
    return `${
        aptosSwapResourceAccounts[network ?? Network.Mainnet]
    }::${moduleName}::${functionNameOrResourceType}`
}
