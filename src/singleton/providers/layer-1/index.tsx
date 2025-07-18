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
    GET_TOKEN_BALANCE_SWR_MUTATION,
    GET_SWAP_INFO_METADATA_SWR,
    GET_TOKEN_PAIR_RESERVE_SWR,
    GET_TOKEN_PAIR_METADATA_SWR,
    GET_POSITIONS_SWR,
    GET_TOKEN_METADATAS_SWR,
    COLLECT_FEES_SWR_MUTATION,
    MOBILE_MENU_MODAL,
} from "../../keys"
import {
    useGetTokenMetadataSwrMutation,
    useAptosMoveCallSwrMutation,
    useQuotePriceOutSwrMutation,
    useGetBalanceSwrMutation,
    useGetPositionsSwr,
    useGetSwapInfoMetadataSwr,
    useGetTokenPairMetadataSwr,
    useGetTokenPairReserveSwr,
    useGetTokenMetadatasSwr,
    useCollectFeesSwrMutation,
} from "../../swrs"
import {
    GET_TOKEN_METADATA_SWR_MUTATION,
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
            [MOBILE_MENU_MODAL]: useDisclosure(),
            //swrs
            [GET_TOKEN_METADATA_SWR_MUTATION]: useGetTokenMetadataSwrMutation(),
            [APTOS_MOVE_CALL_SWR_MUTATION]: useAptosMoveCallSwrMutation(),
            [QUOTE_PRICE_OUT_SWR_MUTATION]: useQuotePriceOutSwrMutation(),
            [GET_TOKEN_BALANCE_SWR_MUTATION]: useGetBalanceSwrMutation(),
            [GET_SWAP_INFO_METADATA_SWR]: useGetSwapInfoMetadataSwr(),
            [GET_TOKEN_PAIR_RESERVE_SWR]: useGetTokenPairReserveSwr(),
            [GET_TOKEN_PAIR_METADATA_SWR]: useGetTokenPairMetadataSwr(),
            [GET_POSITIONS_SWR]: useGetPositionsSwr(),
            [GET_TOKEN_METADATAS_SWR]: useGetTokenMetadatasSwr(),
            [COLLECT_FEES_SWR_MUTATION]: useCollectFeesSwrMutation(),
        }}

    >
        {children}
    </BaseSingletonHookProvider>
)
