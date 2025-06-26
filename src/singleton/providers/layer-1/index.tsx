import { useDisclosure } from "@heroui/react"
import React, { PropsWithChildren } from "react"
import { BaseSingletonHookProvider } from "../../core"
import { CONNECT_WALLETS_DISCLOSURE } from "../../keys"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => (
    <BaseSingletonHookProvider
        hooks={{
            // disclosures
            [CONNECT_WALLETS_DISCLOSURE]: useDisclosure(),
        }}
    >
        {children}
    </BaseSingletonHookProvider>
)