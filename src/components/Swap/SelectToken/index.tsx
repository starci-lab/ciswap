import { SelectTokenModalKey, useAppDispatch } from "@/redux"
import { Button, useDisclosure } from "@heroui/react"
import React from "react"
import { TokenImage } from "../../TokenImage"
import {
    SELECT_TOKEN_SWAP_MODAL,
    useSingletonHook,
    useSingletonHook2,
} from "@/singleton"
import { useSwapFormik, SWAP_FORMIK } from "@/singleton"
import { setSelectedTokenSwap } from "@/redux"

export interface SelectTokenProps {
  tokenKey: SelectTokenModalKey;
}
export const SelectToken = ({ tokenKey }: SelectTokenProps) => {
    const formik =
    useSingletonHook2<ReturnType<typeof useSwapFormik>>(SWAP_FORMIK)
    const metadata =
    tokenKey === SelectTokenModalKey.TokenA
        ? formik.values.token0Metadata
        : formik.values.token1Metadata

    const dispatch = useAppDispatch()

    const { onOpen } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        SELECT_TOKEN_SWAP_MODAL
    )
    
    return (
        <Button
            variant="flat"
            onPress={() => {
                dispatch(setSelectedTokenSwap(tokenKey))
                onOpen()
            }}
            className="text-start"
        >
            <TokenImage src={metadata?.imageUrl} className="min-w-8 min-h-8" />
            <div className="flex flex-col">
                <div className="text-sm font-bold">{metadata?.symbol}</div>
                <div className="text-xs text-foreground-500">{metadata?.name}</div>
            </div>
        </Button>
    )
}
