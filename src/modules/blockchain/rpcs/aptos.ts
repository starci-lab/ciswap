import {
    Network as AptosNetwork,
    Aptos,
    AptosConfig,
} from "@aptos-labs/ts-sdk"
import { Network } from "@/types"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { envConfig } from "@/config"

export const createAptosClient = (network?: Network) => {
    const _network =
    network === Network.Mainnet ? AptosNetwork.MAINNET : AptosNetwork.TESTNET
    return new Aptos(
        new AptosConfig({
            network: _network,
            clientConfig: {
                API_KEY: "AG-B4TUGAXCWBWRTYN7JCPI8FDKS9PVVFP1Z",
            },
        })
    )
}

const APTOS_INDEXER_MAINNET_URL =
  "https://indexer.mainnet.aptoslabs.com/v1/graphql"
const APTOS_INDEXER_TESTNET_URL =
  "https://testnet.aptoslabs.com/v1/graphql"

export const createAptosIndexerApolloClient = (network?: Network) => {
    return new ApolloClient({
        uri:
      network === Network.Mainnet
          ? APTOS_INDEXER_MAINNET_URL
          : APTOS_INDEXER_TESTNET_URL,
        cache: new InMemoryCache(),
        headers: {
            Authorization: `Bearer ${
                envConfig.aptosApiKey[network ?? Network.Testnet]
            }`,
        },
        defaultOptions: {
            query: {
                fetchPolicy: "no-cache", // no cache
            },
            watchQuery: {
                fetchPolicy: "no-cache", // no cache
            },
        },
    })
}
