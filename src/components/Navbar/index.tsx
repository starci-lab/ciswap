import React from "react"
import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@heroui/react"    
import { ConnectWalletsButton } from "./ConnectWalletsButton"
export const Navbar = () => {
    return <HeroNavbar>
        <NavbarBrand>
            <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
                <Link color="foreground" href="#">
          Features
                </Link>
            </NavbarItem>
            <NavbarItem isActive>
                <Link aria-current="page" href="#">
          Customers
                </Link>
            </NavbarItem>
            <NavbarItem>
                <Link color="foreground" href="#">
          Integrations
                </Link>
            </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
                <Link href="#">Login</Link>
            </NavbarItem>
            <NavbarItem>
                <ConnectWalletsButton />
            </NavbarItem>
        </NavbarContent>
    </HeroNavbar>
}