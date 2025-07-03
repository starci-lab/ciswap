import { ChainKey, Network, TokenKey } from "@/types"
import { createAptosClient } from "../rpcs"
import { computeDenomination } from "@/utils"

export interface GetAptosTokenBalanceParams {
  chainKey: ChainKey;
  tokenAddress: string;
  tokenKey?: TokenKey;
  accountAddress: string;
  network?: Network;
  isTypeTag?: boolean;
}

export interface TokenBalance {
    balance: number
}

export const getAptosTokenBalance = async ({
    tokenAddress,
    network,
    isTypeTag,
    accountAddress,
}: GetAptosTokenBalanceParams): Promise<TokenBalance> => {
    try {
        if (!tokenAddress)
            throw new Error("Cannot find token metadata without token address")
        const aptosClient = createAptosClient(network)
        let balance: number
        if (isTypeTag) {
            const { amount } = (await aptosClient.getCurrentFungibleAssetBalances({ 
                options: {
                    where: {
                        asset_type: {
                            _eq: tokenAddress,
                        },
                        owner_address: {
                            _eq: accountAddress,
                        },
                    }
                }
            }))[0]
            balance = computeDenomination(amount, 8)
        } else {
            const amount = await aptosClient.view({
                payload: {
                    function: "0x1::primary_fungible_store::balance",
                    functionArguments: [
                        accountAddress,
                        tokenAddress,
                    ],
                    typeArguments: ["0x1::object::ObjectCore"],
                },
            })
            balance = computeDenomination(amount[0] as number, 8)
        }
        return {
            balance,
        }
    } catch (error) {
        console.error(error)
        return {
            balance: 0,
        }
    }
}

export const getTokenBalance = (params: GetAptosTokenBalanceParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return getAptosTokenBalance(params)
    }
    throw new Error("Invalid chain key")
}