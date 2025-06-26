import React from "react"
import { CONNECT_WALLETS_DISCLOSURE, useSingletonHook } from "@/singleton"
import {
    Modal,
    ModalContent,
    useDisclosure,
} from "@heroui/react"
import { useAppSelector } from "@/redux"
import { BaseContent } from "./BaseContent"
import { PlatformKey } from "@/types"
import { AptosContent } from "./AptosContent"

export const ConnectWalletsModal = () => {
    const { isOpen, onOpenChange } = useSingletonHook<
    ReturnType<typeof useDisclosure>
  >(CONNECT_WALLETS_DISCLOSURE)
    const { selectedPlatform } = useAppSelector(
        (state) => state.modalReducer.connectWalletModal
    )
    const renderContent = () => {
        if (selectedPlatform === PlatformKey.Aptos) {
            return <AptosContent />
        }
        return <BaseContent />
    }
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {renderContent()}
            </ModalContent>
        </Modal>
    )
}
