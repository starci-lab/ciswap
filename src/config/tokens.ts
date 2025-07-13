import { APTOS_COIN_ADDRESS } from "@/constants"
import { ChainKey, HeroUITheme, Network, TokenMetadata } from "@/types"

export interface Token extends TokenMetadata {
    key: string
    totalSupply: number
    projectUri: string
}

export type TokenMap = Record<ChainKey, Record<Network, Array<Token>>>

export const tokenMap: TokenMap = {
    [ChainKey.Aptos]: {
        [Network.Testnet]: [
            {
                key: "Aptos",
                address: APTOS_COIN_ADDRESS,
                name: "Aptos",
                symbol: "APT",
                decimals: 6,
                totalSupply: 1000000000,
                iconUris: {
                    [HeroUITheme.Light]: "/aptos-light.svg",
                    [HeroUITheme.Dark]: "/aptos-dark.svg",
                },
                projectUri: "https://aptosfoundation.org/",
            },
            {
                key: "USD Coin",
                address: "0xdb941eb2ea04d875a05c07b20f2584473276a86ada1a5f7fc8c7a54c0f2c4767",
                name: "USD Coin",
                symbol: "USDC",
                decimals: 6,
                totalSupply: 1000000000,
                iconUris: {
                    [HeroUITheme.Light]: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042194",
                    [HeroUITheme.Dark]: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042194",
                },
                projectUri: "https://www.circle.com/usdc",
            },
            {
                key: "Scallop",
                address: "0xffbd7560161ea26468a482555669eec1f28f7fb1d985aa44e0a58413b267ce78",
                name: "Scallop",
                symbol: "SCA",
                decimals: 6,
                totalSupply: 1000000000,
                iconUris: {
                    [HeroUITheme.Light]: "https://s2.coinmarketcap.com/static/img/coins/64x64/29679.png",
                    [HeroUITheme.Dark]: "https://s2.coinmarketcap.com/static/img/coins/64x64/29679.png",
                },
                projectUri: "https://scallop.io/",
            },
            {
                key: "USD Tether",
                address: "0x86ba8bdfef29fd502f883614e5964290e074393e92e774c8dd144ec3c28f444f",
                name: "USD Tether",
                symbol: "USDT",
                decimals: 6,
                totalSupply: 1000000000,
                iconUris: {
                    [HeroUITheme.Light]: "https://cdn.worldvectorlogo.com/logos/tether.svg",
                    [HeroUITheme.Dark]: "https://cdn.worldvectorlogo.com/logos/tether.svg",
                },
                projectUri: "https://www.tether.to",
            },
        ],
        [Network.Mainnet]: []
    },
    [ChainKey.Solana]: {
        [Network.Mainnet]: [],
        [Network.Testnet]: []
    },
    [ChainKey.Sui]: {
        [Network.Mainnet]: [],
        [Network.Testnet]: []
    },
    [ChainKey.Base]: {
        [Network.Mainnet]: [],
        [Network.Testnet]: []
    }   
}