import { TokenImage } from "@/components"
import { SelectTokenModalKey, setSelectedToken } from "@/redux"
import { useAppDispatch } from "@/redux"
import {
    CREATE_PAIR_FORMIK,
    SELECT_TOKEN_MODAL,
    useCreatePairFormik,
    useSingletonHook,
    useSingletonHook2,
} from "@/singleton"
import { Button, useDisclosure } from "@heroui/react"
import React from "react"
import { APTOS_COIN_ADDRESS } from "@/constants"

export interface SelectTokenButtonProps {
  tokenKey: SelectTokenModalKey;
}

export const SelectTokenButton = ({ tokenKey }: SelectTokenButtonProps) => {
    const dispatch = useAppDispatch()
    const formik =
    useSingletonHook2<ReturnType<typeof useCreatePairFormik>>(
        CREATE_PAIR_FORMIK
    )
    const { onOpen } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(SELECT_TOKEN_MODAL)
    const metadata = tokenKey === SelectTokenModalKey.TokenX
        ? formik.values.tokenXMetadata
        : formik.values.tokenYMetadata
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
                    isAptos={metadata?.tokenAddress === APTOS_COIN_ADDRESS}
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
