"use client"
import React, { PropsWithChildren, Suspense } from "react"
import { HeroUIProvider, Spacer, ToastProvider } from "@heroui/react"
import { Provider as ReduxProvider } from "react-redux"
import { store, useAppSelector } from "@/redux"
import { Navbar } from "./_components"
import dynamic from "next/dynamic"
import { SingletonHook2Provider, SingletonHookProvider } from "@/singleton"
import { IconContext } from "@phosphor-icons/react"
import {
    AptosWalletAdapterProvider,
} from "@aptos-labs/wallet-adapter-react"
import { Network as AptosNetwork } from "@aptos-labs/ts-sdk"
import { Network } from "@/types"
import { SWRConfig } from "swr"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export const ContentLayout = ({ children }: PropsWithChildren) => {
    const network = useAppSelector((state) => state.chainReducer.network)
    const _network =
    network === Network.Mainnet ? AptosNetwork.MAINNET : AptosNetwork.TESTNET
    return (
        <AptosWalletAdapterProvider
            autoConnect={true}
            dappConfig={{ network: _network, aptosApiKeys: {
                [Network.Testnet]: "AG-B4TUGAXCWBWRTYN7JCPI8FDKS9PVVFP1Z",
            }}}
            onError={(error) => {
                console.log("error", error)
            }}
        >
            <SWRConfig value={{
                provider: () => new Map(),
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
                revalidateIfStale: false,
            }}>
                <HeroUIProvider>
                    <NextThemesProvider attribute="class" defaultTheme="dark">
                        <SingletonHookProvider>
                            <SingletonHook2Provider>
                                <IconContext.Provider
                                    value={{
                                        size: 20,
                                    }}
                                >
                                    <Navbar />
                                    <Spacer y={6} />
                                    {children}
                                    <ToastProvider />
                                </IconContext.Provider>
                            </SingletonHook2Provider>
                        </SingletonHookProvider>
                    </NextThemesProvider>
                </HeroUIProvider>
            </SWRConfig>
        </AptosWalletAdapterProvider>
    )
}
export const WrappedLayout = ({ children }: PropsWithChildren) => {
    const Modals = dynamic(() => import("@/modals"), { ssr: false })
    return (
        <Suspense>
            <ReduxProvider store={store}>
                <ContentLayout>
                    {children}
                    <Modals />
                </ContentLayout>
            </ReduxProvider>
        </Suspense>
    )
}
