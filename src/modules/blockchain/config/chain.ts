import { ChainKey } from "@/types"

export interface ChainConfig {
    decimals: number
    symbol: string
    name: string
    imageUrl: string
}

export const chainConfigs: Record<ChainKey, ChainConfig> = {
    [ChainKey.Aptos]: {
        decimals: 8,
        symbol: "APT",
        name: "Aptos",
        imageUrl: "/aptos.svg",
    },
    [ChainKey.Solana]: {
        decimals: 9,
        symbol: "SOL",
        name: "Solana",
        imageUrl: "/solana.svg",
    },
    [ChainKey.Sui]: {
        decimals: 9,
        symbol: "SUI",
        name: "Sui",
        imageUrl: "/sui.svg",
    },
    [ChainKey.Base]: {
        decimals: 18,
        symbol: "BaseETH",
        name: "Base",
        imageUrl: "/base.svg",
    },
}