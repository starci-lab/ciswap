"use client"
import { Button, NumberInput, Spacer } from "@heroui/react"
import { TokenImage } from "@/components"
import {
    ADD_LIQUIDITY_FORMIK,
    useAddLiquidityFormik,
    useSingletonHook2,
} from "@/singleton"
import React from "react"
import { useAppSelector } from "@/redux"
import { APTOS_COIN_ADDRESS } from "@/constants"

export const Deposit = () => {
    const formik =
    useSingletonHook2<ReturnType<typeof useAddLiquidityFormik>>(
        ADD_LIQUIDITY_FORMIK
    )
    const tokenMetadatas = useAppSelector((state) => state.stateReducer.tokenMetadatas)
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                isAptos={tokenMetadatas?.tokenXMetadata.tokenAddress === APTOS_COIN_ADDRESS}
                                className="w-5 h-5"
                                src={tokenMetadatas?.tokenXMetadata.imageUrl}
                                alt={tokenMetadatas?.tokenXMetadata.name}
                            />
                            <div className="text-sm">
                                {tokenMetadatas?.tokenXMetadata.name}
                            </div>
                        </div>
                        <div className="text-sm text-foreground-500">
              Balance: {formik.values.balanceX}
                        </div>
                    </div>
                    <Spacer y={1.5} />
                    <NumberInput
                        classNames={{
                            inputWrapper: "w-full",
                        }}
                        onBlur={() => formik.setFieldTouched("amountX", true)}
                        isDisabled={!tokenMetadatas?.tokenXMetadata.symbol}
                        value={
                            tokenMetadatas?.tokenXMetadata.symbol
                                ? formik.values.amountX
                                : 0
                        }
                        errorMessage={formik.touched.amountX && formik.errors.amountX}
                        isInvalid={!!(formik.touched.amountX && formik.errors.amountX)}
                        endContent={
                            <div className="text-xs text-foreground-500">{`${tokenMetadatas?.tokenXMetadata.symbol}`}</div>
                        }
                        onValueChange={(value) => formik.setFieldValue("amountX", value)}
                        hideStepper
                        labelPlacement="outside"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                isAptos={tokenMetadatas?.tokenYMetadata.tokenAddress === APTOS_COIN_ADDRESS}
                                className="w-5 h-5"
                                src={tokenMetadatas?.tokenYMetadata.imageUrl}
                                alt={tokenMetadatas?.tokenYMetadata.name}
                            />
                            <div className="text-sm">
                                {tokenMetadatas?.tokenYMetadata.name}
                            </div>
                        </div>
                        <div className="text-sm text-foreground-500">
              Balance: {formik.values.balanceY}
                        </div>
                    </div>
                    <Spacer y={1.5} />
                    <NumberInput
                        isDisabled={!tokenMetadatas?.tokenYMetadata.symbol}
                        value={
                            tokenMetadatas?.tokenYMetadata.symbol
                                ? formik.values.amountY
                                : 0
                        }
                        classNames={{
                            inputWrapper: "w-full",
                        }}
                        endContent={
                            <div className="text-sm text-foreground-500">{`${tokenMetadatas?.tokenYMetadata.symbol}`}</div>
                        }
                        onBlur={() => formik.setFieldTouched("amountY", true)}
                        errorMessage={formik.touched.amountY && formik.errors.amountY}
                        isInvalid={!!(formik.touched.amountY && formik.errors.amountY)}
                        className="flex-1"
                        onValueChange={(value) => formik.setFieldValue("amountY", value)}
                        hideStepper
                        labelPlacement="outside"
                    />
                </div>
            </div>
            <Spacer y={4} />
            <Button
                color="primary"
                fullWidth
                onPress={() => formik.handleSubmit()}
                isLoading={formik.isSubmitting}
            >
        Add Liquidity
            </Button>
        </>
    )
}
