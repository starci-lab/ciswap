import { ChainKey } from "@/types"

export interface ChainImage {
    light: string
    dark: string
}
export interface Chain {
    imageUrl: ChainImage
    key: ChainKey
    name: string
}

export const chains = [
    {
        imageUrl: {
            light: "/aptos-light.svg",
            dark: "/aptos-dark.svg",
        },
        key: ChainKey.Aptos,
        name: "Aptos",
    },
    {
        imageUrl: {
            light: "/solana.svg",
            dark: "/solana.svg",
        },
        key: ChainKey.Solana,
        name: "Solana",
    },
    {
        imageUrl: {
            light: "/sui.svg",
            dark: "/sui.svg",
        },
        key: ChainKey.Sui,
        name: "Sui",
    },
]

export const APTOS_COIN_ADDRESS = "0x1::aptos_coin::AptosCoin"