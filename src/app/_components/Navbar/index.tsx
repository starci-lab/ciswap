import React from "react"
import {
    Navbar as HeroNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    useDisclosure,
} from "@heroui/react"
import { ConnectWalletsButton, SelectChainButton } from "@/modals"
import { ListIcon } from "@phosphor-icons/react"
import { useSingletonHook, MOBILE_MENU_MODAL } from "@/singleton"
import { useIsMobile } from "@/hooks"

export const Navbar = () => {
    const isMobile = useIsMobile()
    const { onOpen } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(MOBILE_MENU_MODAL)
    return (
        <HeroNavbar>
            <NavbarBrand>
                <p className="font-bold text-inherit">CiSwap</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
            Trade
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link aria-current="page" href="#">
            Earn
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
            Bridge
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {isMobile ? (
                    <NavbarItem>
                        <Button isIconOnly variant="light" onPress={onOpen}>
                            <ListIcon />
                        </Button>
                    </NavbarItem>
                ) : (
                    <>
                        <NavbarItem>
                            <SelectChainButton />
                        </NavbarItem>
                        <NavbarItem>
                            <ConnectWalletsButton />
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>
        </HeroNavbar>
    )
}
