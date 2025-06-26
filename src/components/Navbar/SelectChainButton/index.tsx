import React from "react"
import { Button, Image, useDisclosure } from "@heroui/react"
import { useAppSelector } from "@/redux"
import { chains } from "@/constants"
import { SELECT_CHAIN_MODAL, useSingletonHook } from "@/singleton"

export const SelectChainButton = () => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const chain = chains.find((chain) => chain.key === chainKey)
    const { onOpen } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(SELECT_CHAIN_MODAL)
    return (
        <Button
            variant="flat"
            onPress={onOpen}
            startContent={
                <Image
                    src={chain?.imageUrl ?? ""}
                    alt={chain?.name ?? ""}
                    className="w-5 h-5 min-w-5 min-h-5"
                />
            }
        >
            {chain?.name}
        </Button>
    )
}
