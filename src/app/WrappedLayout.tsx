"use client"
import React, { PropsWithChildren } from "react"
import { HeroUIProvider } from "@heroui/react"
import { Provider as ReduxProvider } from "react-redux"
import { store, useAppSelector } from "@/redux"
import dynamic from "next/dynamic"
import { SingletonHook2Provider, SingletonHookProvider } from "@/singleton"
import { IconContext } from "@phosphor-icons/react"
import {
    AptosWalletAdapterProvider,
} from "@aptos-labs/wallet-adapter-react"
import { Network as AptosNetwork } from "@aptos-labs/ts-sdk"
import { Network } from "@/types"

export const ContentLayout = ({ children }: PropsWithChildren) => {
    const network = useAppSelector((state) => state.chainReducer.network)
    const _network =
    network === Network.Mainnet ? AptosNetwork.MAINNET : AptosNetwork.DEVNET
    return (
        <AptosWalletAdapterProvider
            autoConnect={true}
            dappConfig={{ network: _network }}
            onError={(error) => {
                console.log("error", error)
            }}
        >
            <HeroUIProvider>
                <SingletonHookProvider>
                    <SingletonHook2Provider>
                        <IconContext.Provider
                            value={{
                                size: 20,
                            }}
                        >
                            {children}
                        </IconContext.Provider>
                    </SingletonHook2Provider>
                </SingletonHookProvider>
            </HeroUIProvider>
        </AptosWalletAdapterProvider>
    )
}
export const WrappedLayout = ({ children }: PropsWithChildren) => {
    const Modals = dynamic(() => import("@/modals"), { ssr: false })
    return (
        <ReduxProvider store={store}>
            <ContentLayout>
                {children}
                <Modals />
            </ContentLayout>
        </ReduxProvider>
    )
}
