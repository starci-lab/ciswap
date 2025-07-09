import React from "react"
import {
    Modal,
    ModalHeader,
    ModalContent,
    useDisclosure,
    ModalBody,
    Image,
    Card,
    CardBody
} from "@heroui/react"
import { useSingletonHook, SELECT_CHAIN_MODAL } from "@/singleton"
import { useAppSelector, setChainKey } from "@/redux"
import { useAppDispatch } from "@/redux"
import { chains } from "@/constants"
import { useTheme } from "next-themes"

export const SelectChainModal = () => {
    const { isOpen, onOpenChange } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(SELECT_CHAIN_MODAL)
    const { chainKey } = useAppSelector((state) => state.chainReducer)
    const dispatch = useAppDispatch()
    const { theme } = useTheme()
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Select Chain</ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-3 gap-2">
                        {chains.map((chain) => (
                            <Card
                                disableAnimation={true}
                                key={chain.key}
                                isDisabled={chain.key === chainKey}
                                isPressable={chain.key !== chainKey}
                                onPress={() => dispatch(setChainKey(chain.key))}
                            >
                                <CardBody>
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={
                                                theme === "dark"
                                                    ? chain.imageUrl.dark
                                                    : chain.imageUrl.light
                                            }
                                            alt={chain.name}
                                            className="w-10 h-10"
                                        />
                                        <div>
                                            <div className="text-sm text-foreground-500">
                                                {chain.name}
                                            </div>
                                            {chain.key === chainKey && (
                                                <div className="text-xs text-success">
                          Connected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
