import React from "react"
import {
    Modal,
    ModalContent,
    useDisclosure,
    ModalBody,
    ModalHeader,
} from "@heroui/react"
import {
    useSingletonHook,
    MOBILE_MENU_MODAL,
} from "@/singleton"    
import { SelectChainButton } from "./SelectChainButton"
import { ConnectWalletsButton } from "./ConnectWalletsButton"

export const MobileMenuModal = () => {
    const { isOpen, onOpenChange } =
        useSingletonHook<ReturnType<typeof useDisclosure>>(MOBILE_MENU_MODAL)

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>   
                    Menu
                </ModalHeader>
                <ModalBody>
                    <SelectChainButton/>
                    <ConnectWalletsButton/>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
export * from "./ConnectWalletsButton"
export * from "./SelectChainButton"