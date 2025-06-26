import { ChainKey } from "@/types"

export interface Chain {
    imageUrl: string
    key: ChainKey
    name: string
}

export const chains = [
    {
        imageUrl: "/aptos.svg",
        key: ChainKey.Aptos,
        name: "Aptos",
    },
    {
        imageUrl: "/solana.svg",
        key: ChainKey.Solana,
        name: "Solana",
    },
    {
        imageUrl: "/sui.svg",
        key: ChainKey.Sui,
        name: "Sui",
    },
]