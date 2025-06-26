import { setSelectedPlatform, useAppDispatch } from "@/redux"
import { PlatformKey } from "@/types"
import { CardBody, Card, ModalBody, ModalHeader, Image, Snippet } from "@heroui/react"
import React from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { truncateString } from "@/utils"

export enum Status {
  Ready = "ready",
  ComingSoon = "coming-soon",
}
export const platforms = [
    {
        key: PlatformKey.Aptos,
        name: "Aptos",
        image: "/aptos.svg",
        status: Status.Ready,
    },
    {
        key: PlatformKey.Solana,
        name: "Solana",
        image: "/solana.svg",
        status: Status.ComingSoon,
    },
    {
        key: PlatformKey.Sui,
        name: "Sui",
        image: "/sui.svg",
        status: Status.ComingSoon,
    },
]
export const BaseContent = () => {
    const dispatch = useAppDispatch()
    const { wallet: selectedWallet } = useWallet()

    const getAddress = (platformKey: PlatformKey) => {
        if (platformKey === PlatformKey.Aptos) {
            return selectedWallet?.accounts[0].address ?? ""
        }
        return ""
    }
    const renderAddress = (platformKey: PlatformKey) => {
        return (
            <div className="text-xs text-foreground-500">
                {truncateString(getAddress(platformKey), 6, 4)}
            </div>
        )
    }

    return (
        <>
            <ModalHeader>Connect Wallets</ModalHeader>
            <ModalBody>
                {platforms.map((platform) => (
                    <Card
                        key={platform.key}
                        isPressable={platform.status === Status.Ready}
                        onPress={() => dispatch(setSelectedPlatform(platform.key))}
                    >
                        <CardBody className="w-full">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={platform.image}
                                        alt={platform.name}
                                        className="w-10 h-10"
                                    />
                                    <div>
                                        <div className="text-sm">{platform.name}</div>
                                        {renderAddress(platform.key)}
                                        {platform.status === Status.ComingSoon && (
                                            <div className="text-xs text-foreground-500">
                      Coming Soon
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {
                                    getAddress(platform.key) && (
                                        <Snippet hideSymbol classNames={{
                                            base: "bg-transparent p-0 gap-0"
                                        }} codeString={getAddress(platform.key)}/>
                                    )
                                }
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </ModalBody>
        </>
    )
}
