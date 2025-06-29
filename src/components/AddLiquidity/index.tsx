"use client"
import React from "react"
import { Button, Input, NumberInput, Spacer } from "@heroui/react"
import {
    ADD_LIQUIDITY_FORMIK,
    useAddLiquidityFormik,
    useSingletonHook2,
} from "@/singleton"
import { SelectTokenModalKey } from "@/redux"
import { PlusIcon } from "@phosphor-icons/react"
import { Title } from "../Title"
import { SelectTokenButton } from "./SelectTokenButton"
export const AddLiquidity = () => {
    const formik =
    useSingletonHook2<ReturnType<typeof useAddLiquidityFormik>>(
        ADD_LIQUIDITY_FORMIK
    )
    return (
        <div>
            <Title text="Select tokens" />
            <Spacer y={1.5} />
            <div className="flex items-center gap-2">
                <SelectTokenButton tokenKey={SelectTokenModalKey.TokenA} />
                <PlusIcon className="w-5 h-5" />
                <SelectTokenButton tokenKey={SelectTokenModalKey.TokenB} />
            </div>
            <Spacer y={4} />
            <Title text="Select pool" />
            <Spacer y={1.5} />
            <Input
                errorMessage={formik.errors.poolAddress}
                isInvalid={!!formik.errors.poolAddress}
                label=""
                labelPlacement="outside"
                value={formik.values.poolAddress}
                onValueChange={(value) => formik.setFieldValue("poolAddress", value)}
            />
            <Spacer y={4} />
            <Title text="Provide amount of tokens" />
            <Spacer y={1.5} />
            <div className="flex items-center gap-2">
                <NumberInput
                    isDisabled={!formik.values.token0Metadata?.symbol}
                    value={
                        formik.values.token0Metadata?.symbol ? formik.values.amount0 : 0
                    }
                    onValueChange={(value) => formik.setFieldValue("amount0", value)}
                    label=""
                    labelPlacement="outside"
                    endContent={
                        formik.values.token0Metadata && (
                            <div className="text-sm text-foreground-500">{`${formik.values.token0Metadata?.symbol}`}</div>
                        )
                    }
                />
                <PlusIcon className="w-10 h-10" />
                <NumberInput
                    isDisabled={!formik.values.token1Metadata?.symbol}
                    value={
                        formik.values.token1Metadata?.symbol ? formik.values.amount1 : 0
                    }
                    onValueChange={(value) => formik.setFieldValue("amount1", value)}
                    label=""
                    labelPlacement="outside"
                    endContent={
                        formik.values.token1Metadata && (
                            <div className="text-sm text-foreground-500">{`${formik.values.token1Metadata?.symbol}`}</div>
                        )
                    }
                />
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
        </div>
    )
}
