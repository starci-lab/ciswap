"use client"
import React, { PropsWithChildren } from "react"
import { HeroUIProvider } from "@heroui/react"

export const WrappedLayout = ({ children }: PropsWithChildren) => {
    return <HeroUIProvider>{children}</HeroUIProvider>
}
    