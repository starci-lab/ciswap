import { Network as AptosNetwork, Aptos, AptosConfig } from "@aptos-labs/ts-sdk"
import { Network } from "@/types"

export const createAptosClient = (network?: Network) => {
    const _network =
    network === Network.Mainnet ? AptosNetwork.MAINNET : AptosNetwork.DEVNET
    return new Aptos(new AptosConfig({
        network: _network,
        clientConfig: {
            API_KEY: "AG-LORERGHT6C2QGIJFA7FD8GH4PTYRHMBAB"
        }
    }))
}
