export enum ChainKey {
  Aptos = "aptos",
  Solana = "solana",
  Sui = "sui",
  Base = "base",
}

export enum PlatformKey {
  Aptos = "aptos",
  Solana = "solana",
  Sui = "sui",
  Evm = "evm",
}

export enum Network {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export enum TokenKey {
  Native = "native",
}

export const chainKeyToPlatformKey: Record<ChainKey, PlatformKey> = {
    [ChainKey.Aptos]: PlatformKey.Aptos,
    [ChainKey.Solana]: PlatformKey.Solana,
    [ChainKey.Sui]: PlatformKey.Sui,
    [ChainKey.Base]: PlatformKey.Evm,
}

export const platformKeyToChainKey = Object.fromEntries(
    Object.entries(chainKeyToPlatformKey).map(([chainKey, platformKey]) => [
        platformKey,
        chainKey,
    ])
)

export interface AptosMoveTableHandle {
  handle: string
}

export interface AptosMoveObject {
  inner: string
}