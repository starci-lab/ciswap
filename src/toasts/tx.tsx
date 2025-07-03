import { ChainKey, Network } from "@/types"
import { truncateString } from "@/utils"
import { addToast, Link } from "@heroui/react"
import React from "react"

export interface AddTxToastParams {
  txHash: string;
  network: Network;
}

export const addTxToast = ({ txHash, network }: AddTxToastParams) => {
    const networks: Partial<Record<ChainKey, Partial<Record<Network, string>>>> =
    {
        [ChainKey.Aptos]: {
            [Network.Mainnet]: "mainnet",
            [Network.Testnet]: "devnet",
        },
    }
    return addToast({
        title: "Tx Receipt",
        description: (
            <Link
                href={`https://explorer.aptoslabs.com/txn/${txHash}?network=${
                    networks[ChainKey.Aptos]?.[network]
                }`}
                target="_blank"
                color="foreground"
                showAnchorIcon
                size="sm"
            >
                {truncateString(txHash)}
            </Link>
        ),
        variant: "flat",
        color: "success",
    })
}
