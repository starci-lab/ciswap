import { Network } from "@/types"

export const APTOS_SWAP_RESOURCE_TESTNET_ACCOUNT =
  "0x6b47a820e52fde2df5a33d454614b5f94702a6c75b0b01e4a94394e01c41b72e"
export const APTOS_SWAP_RESOURCE_MAINNET_ACCOUNT =
  "0x6b47a820e52fde2df5a33d454614b5f94702a6c75b0b01e4a94394e01c41b72e"

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
