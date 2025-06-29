import { TokenImage } from "@/components"
import { SelectTokenModalKey, setSelectedToken } from "@/redux"
import { useAppDispatch } from "@/redux"
import {
    ADD_LIQUIDITY_FORMIK,
    SELECT_TOKEN_ADD_LIQUIDITY_MODAL,
    useAddLiquidityFormik,
    useSingletonHook,
    useSingletonHook2,
} from "@/singleton"
import { Button, useDisclosure } from "@heroui/react"
import React from "react"

export interface SelectTokenButtonProps {
  tokenKey: SelectTokenModalKey;
}

export const SelectTokenButton = ({ tokenKey }: SelectTokenButtonProps) => {
    const dispatch = useAppDispatch()
    const formik =
    useSingletonHook2<ReturnType<typeof useAddLiquidityFormik>>(
        ADD_LIQUIDITY_FORMIK
    )
    const { onOpen } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(SELECT_TOKEN_ADD_LIQUIDITY_MODAL)
    const metadata = tokenKey === SelectTokenModalKey.TokenA
        ? formik.values.token0Metadata
        : formik.values.token1Metadata
    if (!metadata)
        return (
            <Button
                onPress={() => {
                    dispatch(setSelectedToken(tokenKey))
                    onOpen()
                }}
                variant="flat"
                className="flex-1 justify-start"
            >
        Select Token
            </Button>
        )
    return (
        <Button
            variant="flat"
            className="flex-1 justify-start"
            onPress={() => {
                dispatch(setSelectedToken(tokenKey))
                onOpen()
            }}
            startContent={
                <TokenImage
                    src={metadata?.imageUrl}
                    alt={metadata?.name}
                    className="w-5 h-5 rounded-full"
                />
            }
        >
            {metadata?.name}
        </Button>
    )
}
