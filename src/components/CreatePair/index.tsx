"use client"
import React from "react"
import { Button, Input, NumberInput, Spacer } from "@heroui/react"
import {
    CREATE_PAIR_FORMIK,
    GET_POOL_METADATA_SWR,
    useCreatePairFormik,
    useGetPoolMetadataSwr,
    useSingletonHook,
    useSingletonHook2,
} from "@/singleton"
import { SelectTokenModalKey } from "@/redux"
import { PlusIcon } from "@phosphor-icons/react"
import { SelectTokenButton } from "./SelectTokenButton"
import { Title } from "../Title"
export const CreatePair = () => {
    const formik =
    useSingletonHook2<ReturnType<typeof useCreatePairFormik>>(
        CREATE_PAIR_FORMIK
    )
    const { swr } = useSingletonHook<ReturnType<typeof useGetPoolMetadataSwr>>(
        GET_POOL_METADATA_SWR
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
            <Title text="Provide debt tokens" />
            <Spacer y={1.5} />
            <div className="flex items-center gap-2">
                <NumberInput
                    isDisabled={!formik.values.token0Metadata?.symbol}
                    value={formik.values.token0Metadata?.symbol ? formik.values.amount0 : 0}
                    onValueChange={(value) => formik.setFieldValue("amount0", value)}
                    label=""
                    hideStepper
                    labelPlacement="outside"
                    endContent={
                        formik.values.token0Metadata && <div className="text-sm text-foreground-500">{`ci${formik.values.token0Metadata?.symbol}`}</div>
                    }
                />
                <PlusIcon className="w-10 h-10" />
                <NumberInput
                    isDisabled={!formik.values.token1Metadata?.symbol}
                    value={formik.values.token1Metadata?.symbol ? formik.values.amount1 : 0}
                    onValueChange={(value) => formik.setFieldValue("amount1", value)}
                    label=""
                    hideStepper
                    labelPlacement="outside"
                    endContent={
                        formik.values.token1Metadata && <div className="text-sm text-foreground-500">{`ci${formik.values.token1Metadata?.symbol}`}</div>
                    }
                />
            </div>
            <Spacer y={4} />
            <Title text="Pool id" />
            <Spacer y={1.5} />
            <Input readOnly isDisabled value={swr.data?.nextPoolId.toString()}/>
            <Spacer y={4} />
            <div className="flex items-center justify-between">
                <Title text="Creation fee" />
                <div className="text-sm text-foreground-500">{`${swr.data?.poolCreationFee} APT`}</div>
            </div>
            <Spacer y={4} />
            <Button
                color="primary"
                fullWidth
                isDisabled={!formik.isValid}
                onPress={() => formik.handleSubmit()}
                isLoading={formik.isSubmitting}
            >
        Create Pair
            </Button>
        </div>
    )
}
