import { Network as AptosNetwork, Aptos, AptosConfig } from "@aptos-labs/ts-sdk"
import { Network } from "@/types"

export const createAptosClient = (network?: Network) => {
    const _network =
    network === Network.Mainnet ? AptosNetwork.MAINNET : AptosNetwork.TESTNET
    return new Aptos(new AptosConfig({
        network: _network,
        clientConfig: {
            API_KEY: "AG-B4TUGAXCWBWRTYN7JCPI8FDKS9PVVFP1Z"
        }
    }))
}
