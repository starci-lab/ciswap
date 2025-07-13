import { Card, CardBody } from "@heroui/react"
import React from "react"
import { TokenImage } from "../TokenImage"
import { TokenMetadata } from "@/modules/blockchain"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { HeroUITheme } from "@/types"

export interface TokenSelectProps {
    metadata: TokenMetadata
    onPress: () => void | Promise<void>
    theme: HeroUITheme
}
export const TokenSelect = ({ metadata, onPress, theme }: TokenSelectProps) => {
    return (
        <Card isPressable onPress={onPress}>
            <CardBody className="flex justify-between items-center w-full flex-row">
                <div className="flex items-center gap-2">
                    <TokenImage iconUrls={metadata.iconUris} theme={theme} />  
                    <div className="flex flex-col">
                        <div className="text-sm">{metadata.name}</div>
                        <div className="text-xs text-foreground-500">{metadata.symbol}</div>
                    </div>
                </div>
                <ArrowRightIcon/>
            </CardBody>
        </Card>
    )
}