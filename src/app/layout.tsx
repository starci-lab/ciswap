import type { Metadata } from "next"
import "./globals.css"
import React from "react"
import { WrappedLayout } from "./WrappedLayout"
import { Open_Sans } from "next/font/google"

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
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