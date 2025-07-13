import React from "react"
import {
    Navbar as HeroNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    useDisclosure,
    Chip,
} from "@heroui/react"
import { ConnectWalletsButton, SelectChainButton, ThemeSwitch } from "@/modals"
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
                <div className="flex gap-2 items-center">
                    <div className="font-bold text-inherit">CiSwap</div>
                    <Chip variant="flat" color="warning">
                        Testnet
                    </Chip>
                </div>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive>
                    <Link color="primary" href="/swap">
            Swap
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/">
            Bridge
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/create-token">
            Create Token
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
                            <ThemeSwitch />
                        </NavbarItem>
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
