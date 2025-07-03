import { useDisclosure } from "@heroui/react"
import React, { PropsWithChildren } from "react"
import { BaseSingletonHookProvider } from "../../core"
import {
    CONNECT_WALLETS_DISCLOSURE,
    SELECT_CHAIN_MODAL,
    SELECT_TOKEN_ADD_LIQUIDITY_MODAL,
    SELECT_TOKEN_MODAL,
    SELECT_TOKEN_SWAP_MODAL,
    APTOS_MOVE_CALL_SWR_MUTATION,
    QUOTE_PRICE_OUT_SWR_MUTATION,
    GET_POOL_INFO_SWR,
    GET_TOKEN_BALANCE_SWR,
} from "../../keys"
import {
    useGetPoolMetadataSwr,
    useGetTokenMetadataSwrMutation,
    useAptosMoveCallSwrMutation,
    useQuotePriceOutSwrMutation,
    useGetPoolInfoSwr,
    useGetBalanceSwrMutation,
} from "../../swrs"
import {
    GET_TOKEN_METADATA_SWR_MUTATION,
    GET_POOL_METADATA_SWR,
} from "../../keys"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => (
    <BaseSingletonHookProvider
        hooks={{
            // disclosures
            [CONNECT_WALLETS_DISCLOSURE]: useDisclosure(),
            [SELECT_CHAIN_MODAL]: useDisclosure(),
            [SELECT_TOKEN_MODAL]: useDisclosure(),
            [SELECT_TOKEN_ADD_LIQUIDITY_MODAL]: useDisclosure(),
            [SELECT_TOKEN_SWAP_MODAL]: useDisclosure(),
            //swrs
            [GET_TOKEN_METADATA_SWR_MUTATION]: useGetTokenMetadataSwrMutation(),
            [APTOS_MOVE_CALL_SWR_MUTATION]: useAptosMoveCallSwrMutation(),
            [GET_POOL_METADATA_SWR]: useGetPoolMetadataSwr(),
            [QUOTE_PRICE_OUT_SWR_MUTATION]: useQuotePriceOutSwrMutation(),
            [GET_POOL_INFO_SWR]: useGetPoolInfoSwr(),
            [GET_TOKEN_BALANCE_SWR]: useGetBalanceSwrMutation(),
        }}
    >
        {children}
    </BaseSingletonHookProvider>
)
