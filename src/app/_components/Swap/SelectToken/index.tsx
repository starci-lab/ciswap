import { SelectTokenModalKey, useAppDispatch } from "@/redux"
import { Button, useDisclosure } from "@heroui/react"
import React from "react"
import { TokenImage } from "../../../../components/TokenImage"
import {
    SELECT_TOKEN_SWAP_MODAL,
    useSingletonHook,
    useSingletonHook2,
} from "@/singleton"
import { useSwapFormik, SWAP_FORMIK } from "@/singleton"
import { setSelectedTokenSwap } from "@/redux"
import { getHeroUITheme } from "@/utils"
import { useTheme } from "next-themes"

export interface SelectTokenProps {
  tokenKey: SelectTokenModalKey;
}
export const SelectToken = ({ tokenKey }: SelectTokenProps) => {
    const formik =
    useSingletonHook2<ReturnType<typeof useSwapFormik>>(SWAP_FORMIK)
    const metadata =
    tokenKey === SelectTokenModalKey.TokenX
        ? formik.values.tokenXMetadata
        : formik.values.tokenYMetadata

    const dispatch = useAppDispatch()

    const { onOpen } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        SELECT_TOKEN_SWAP_MODAL
    )
    const { theme } = useTheme()

    return (
        <Button
            variant="bordered"
            onPress={() => {
                dispatch(setSelectedTokenSwap(tokenKey))
                onOpen()
            }}
            className="text-start pl-0.5 pr-4 rounded-full"
        >
            <TokenImage
                iconUrls={metadata?.iconUris || {}}
                theme={getHeroUITheme(theme)}
                className="min-w-8 min-h-8 w-8 h-8"
            />
            <div className="flex flex-col">
                <div className="text-sm font-bold">{metadata?.symbol}</div>
                <div className="text-xs text-foreground-500">{metadata?.name}</div>
            </div>
        </Button>
    )
}
