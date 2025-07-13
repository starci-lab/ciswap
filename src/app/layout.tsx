import type { Metadata } from "next"
import "./globals.css"
import "katex/dist/katex.min.css"
import React from "react"
import { WrappedLayout } from "./WrappedLayout"
import { Open_Sans } from "next/font/google"

export const metadata: Metadata = {
    title: "CiSwap",
    description: "A new primitive for capital-efficient trading using synthetic liquidity on Aptos.",
}

const font = Open_Sans({
    subsets: ["latin"],
})

const Layout = ({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    return (
        <html lang="en">
            <body
                className={`${font.className} antialiased`}
            >
                <WrappedLayout>{children}</WrappedLayout>
            </body>
        </html>
    )
}

export default Layout