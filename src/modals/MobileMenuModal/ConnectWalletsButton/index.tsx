import React from "react"
import { Button, useDisclosure } from "@heroui/react"
import { CONNECT_WALLETS_DISCLOSURE, useSingletonHook } from "@/singleton"

export const ConnectWalletsButton = () => {
    const { onOpen } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        CONNECT_WALLETS_DISCLOSURE
    )
    return (
        <Button color="primary" onPress={onOpen}>
      Connect Wallets
        </Button>
    )
}
