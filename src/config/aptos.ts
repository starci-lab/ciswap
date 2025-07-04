import { Network } from "@/types"

export const APTOS_SWAP_RESOURCE_TESTNET_ACCOUNT =
  "0xd0b061dfcd2e4141a3eafde747db8e5639df05eb88d0c4748d2e751be1612e15"
export const APTOS_SWAP_RESOURCE_MAINNET_ACCOUNT =
  "0xd0b061dfcd2e4141a3eafde747db8e5639df05eb88d0c4748d2e751be1612e15"

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
