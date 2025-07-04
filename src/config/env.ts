import { Network } from "@/types"

export const envConfig = {
    aptosApiKey: {
        [Network.Mainnet]: process.env.NEXT_PUBLIC_APTOS_MAINNET_API_KEY,
        [Network.Testnet]: process.env.NEXT_PUBLIC_APTOS_TESTNET_API_KEY,
    }
}