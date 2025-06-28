import { useDisclosure } from "@heroui/react"
import React, { PropsWithChildren } from "react"
import { BaseSingletonHookProvider } from "../../core"
import { CONNECT_WALLETS_DISCLOSURE, SELECT_CHAIN_MODAL, SELECT_TOKEN_MODAL, USE_APTOS_MOVE_CALL_SWR_MUTATION } from "../../keys"
import { useGetTokenMetadataSwrMutation, USE_GET_TOKEN_METADATA_SWR_MUTATION, useAptosMoveCallSwrMutation } from "@/singleton"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => (
    <BaseSingletonHookProvider
        hooks={{
            // disclosures
            [CONNECT_WALLETS_DISCLOSURE]: useDisclosure(),
            [SELECT_CHAIN_MODAL]: useDisclosure(),
            [SELECT_TOKEN_MODAL]: useDisclosure(),
            //swrs
            [USE_GET_TOKEN_METADATA_SWR_MUTATION]: useGetTokenMetadataSwrMutation(),
            [USE_APTOS_MOVE_CALL_SWR_MUTATION]: useAptosMoveCallSwrMutation(),
        }}
    >
        {children}
    </BaseSingletonHookProvider>
)