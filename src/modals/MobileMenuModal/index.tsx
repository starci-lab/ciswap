import React from "react"
import {
    Modal,
    ModalContent,
    useDisclosure,
    ModalBody,
    ModalHeader,
    Divider,
    Link,
} from "@heroui/react"
import {
    useSingletonHook,
    MOBILE_MENU_MODAL,
} from "@/singleton"    
import { SelectChainButton } from "./SelectChainButton"
import { ConnectWalletsButton } from "./ConnectWalletsButton"
import { ThemeSwitch } from "./ThemeSwitch"
import { useRouter } from "next/navigation"

export const MobileMenuModal = () => {
    const { isOpen, onOpenChange, onClose } =
        useSingletonHook<ReturnType<typeof useDisclosure>>(MOBILE_MENU_MODAL)
    const router = useRouter()
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>   
                    Menu
                </ModalHeader>
                <ModalBody> 
                    <div className="flex flex-col gap-2">
                        <Link onPress={() => {
                            router.push("/swap")
                            onClose()
                        }}>
                        Swap
                        </Link>
                        <Link color="foreground" className="text-foreground-500" onPress={() => {
                            router.push("/create-token")
                            onClose()
                        }}>
                        Create Token
                        </Link>
                        <Link color="foreground" className="text-foreground-500" onPress={() => {
                            router.push("/bridge")
                            onClose()
                        }}>
                        Bridge
                        </Link>
                    </div>
                    <ThemeSwitch/>
                    <Divider/>
                    <div className="grid grid-cols-2 gap-2">
                        <SelectChainButton/>
                        <ConnectWalletsButton/>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
export * from "./ConnectWalletsButton"
export * from "./SelectChainButton"
export * from "./ThemeSwitch"