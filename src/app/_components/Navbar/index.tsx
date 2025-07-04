import React from "react"
import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@heroui/react"    
import { ConnectWalletsButton } from "./ConnectWalletsButton"
import { SelectChainButton } from "./SelectChainButton"
export const Navbar = () => {
    return <HeroNavbar>
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
            <NavbarItem >
                <SelectChainButton />
            </NavbarItem>
            <NavbarItem>
                <ConnectWalletsButton />
            </NavbarItem>
        </NavbarContent>
    </HeroNavbar>
}