import { NumberInput, Spacer } from "@heroui/react"
import { TokenImage } from "@/components/TokenImage"
import { ADD_LIQUIDITY_FORMIK, GET_POOL_INFO_SWR, useAddLiquidityFormik, useGetPoolInfoSwr, useSingletonHook2 } from "@/singleton"
import { useSingletonHook } from "@/singleton"
import React from "react"
import { TokenType } from "@/modules/blockchain"

export const Deposit = () => {
    const formik = useSingletonHook2<
    ReturnType<typeof useAddLiquidityFormik>
    >(ADD_LIQUIDITY_FORMIK)
    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useGetPoolInfoSwr>
    >(GET_POOL_INFO_SWR)
    
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                className="w-5 h-5"
                                src={
                                    swrMutation.data?.tokenAddresses[TokenType.Token0]
                                        ?.imageUrl
                                }
                                alt={
                                    swrMutation.data?.tokenAddresses[TokenType.Token0]
                                        ?.name
                                }
                            />
                            <div className="text-sm">
                                {
                                    swrMutation.data?.tokenAddresses[TokenType.Token0]
                                        ?.name
                                }
                            </div>
                        </div>
                        <div className="text-sm text-foreground-500">
          Balance: {formik.values.balance0}
                        </div>
                    </div>
                    <Spacer y={1.5} />
                    <NumberInput
                        classNames={{
                            inputWrapper: "w-full",
                        }}
                        onBlur={() => formik.setFieldTouched("amount0", true)}
                        isDisabled={
                            !swrMutation.data?.tokenAddresses[TokenType.Token0]
                                ?.symbol
                        }
                        value={
                            swrMutation.data?.tokenAddresses[TokenType.Token0]?.symbol
                                ? formik.values.amount0
                                : 0
                        }
                        errorMessage={
                            formik.touched.amount0 && formik.errors.amount0
                        }
                        isInvalid={
                            !!(formik.touched.amount0 && formik.errors.amount0)
                        }
                        endContent={
                            <div className="text-xs text-foreground-500">{`${
                                swrMutation.data?.tokenAddresses[TokenType.Token0]
                                    ?.symbol
                            }`}</div>
                        }
                        onValueChange={(value) =>
                            formik.setFieldValue("amount0", value)
                        }
                        hideStepper
                        labelPlacement="outside"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                className="w-5 h-5"
                                src={
                                    swrMutation.data?.tokenAddresses[TokenType.Token1]
                                        ?.imageUrl
                                }
                                alt={
                                    swrMutation.data?.tokenAddresses[TokenType.Token1]
                                        ?.name
                                }
                            />
                            <div className="text-sm">
                                {
                                    swrMutation.data?.tokenAddresses[TokenType.Token1]
                                        ?.name
                                }
                            </div>
                        </div>
                        <div className="text-sm text-foreground-500">
          Balance: {formik.values.balance1}
                        </div>
                    </div>
                    <Spacer y={1.5} />
                    <NumberInput
                        isDisabled={
                            !swrMutation.data?.tokenAddresses[TokenType.Token1]
                                ?.symbol
                        }
                        value={
                            swrMutation.data?.tokenAddresses[TokenType.Token1]?.symbol
                                ? formik.values.amount1
                                : 0
                        }
                        classNames={{
                            inputWrapper: "w-full",
                        }}
                        endContent={
                            <div className="text-sm text-foreground-500">{`${
                                swrMutation.data?.tokenAddresses[TokenType.Token1]
                                    ?.symbol
                            }`}</div>
                        }
                        onBlur={() => formik.setFieldTouched("amount1", true)}
                        errorMessage={
                            formik.touched.amount1 && formik.errors.amount1
                        }
                        isInvalid={
                            !!(formik.touched.amount1 && formik.errors.amount1)
                        }
                        className="flex-1"
                        onValueChange={(value) =>
                            formik.setFieldValue("amount1", value)
                        }
                        hideStepper
                        labelPlacement="outside"
                    />
                </div>
            </div>
        </>
    )
}