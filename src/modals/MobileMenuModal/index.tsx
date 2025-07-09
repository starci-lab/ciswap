import React from "react"
import {
    Modal,
    ModalContent,
    useDisclosure,
    ModalBody,
    ModalHeader,
    Divider,
} from "@heroui/react"
import {
    useSingletonHook,
    MOBILE_MENU_MODAL,
} from "@/singleton"    
import { SelectChainButton } from "./SelectChainButton"
import { ConnectWalletsButton } from "./ConnectWalletsButton"
import { ThemeSwitch } from "./ThemeSwitch"
import { Title } from "@/components"

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
                    <Divider/>
                    <div className="flex items-center justify-between">
                        <Title text="Mode"/>
                        <ThemeSwitch/>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
export * from "./ConnectWalletsButton"
export * from "./SelectChainButton"
export * from "./ThemeSwitch"