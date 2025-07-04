"use client"
import React from "react"
import { Button, Input, NumberInput, Spacer } from "@heroui/react"
import {
    CREATE_PAIR_FORMIK,
    useCreatePairFormik,
    useSingletonHook2,
} from "@/singleton"
import { SelectTokenModalKey, useAppSelector } from "@/redux"
import { PlusIcon } from "@phosphor-icons/react"
import { SelectTokenButton } from "./SelectTokenButton"
import { Title } from "../../../components/Title"
import { chainConfigs } from "@/modules/blockchain"

export const CreatePair = () => {
    const formik =
    useSingletonHook2<ReturnType<typeof useCreatePairFormik>>(
        CREATE_PAIR_FORMIK
    )
    const swapInfoMetadata = useAppSelector((state) => state.stateReducer.swapInfo)
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    return (
        <div>
            <Title text="Select tokens" />
            <Spacer y={1.5} />
            <div className="flex items-center gap-2">
                <SelectTokenButton tokenKey={SelectTokenModalKey.TokenX} />
                <PlusIcon className="w-5 h-5" />
                <SelectTokenButton tokenKey={SelectTokenModalKey.TokenY} />
            </div>
            <Spacer y={4} />
            <Title text="Provide debt tokens" />
            <Spacer y={1.5} />
            <div className="flex items-center gap-2">
                <NumberInput
                    isDisabled={!formik.values.tokenXMetadata?.symbol}
                    value={
                        formik.values.tokenXMetadata?.symbol ? formik.values.amountX : 0
                    }
                    onValueChange={(value) => formik.setFieldValue("amountX", value)}
                    label=""
                    hideStepper
                    labelPlacement="outside"
                    endContent={
                        formik.values.tokenXMetadata && (
                            <div className="text-sm text-foreground-500">{`ci${formik.values.tokenXMetadata?.symbol}`}</div>
                        )
                    }
                />
                <PlusIcon className="w-10 h-10" />
                <NumberInput
                    isDisabled={!formik.values.tokenYMetadata?.symbol}
                    value={
                        formik.values.tokenYMetadata?.symbol ? formik.values.amountY : 0
                    }
                    onValueChange={(value) => formik.setFieldValue("amountY", value)}
                    label=""
                    hideStepper
                    labelPlacement="outside"
                    endContent={
                        formik.values.tokenYMetadata && (
                            <div className="text-sm text-foreground-500">{`ci${formik.values.tokenYMetadata?.symbol}`}</div>
                        )
                    }
                />
            </div>
            <Spacer y={4} />
            <Title text="Pool id" />
            <Spacer y={1.5} />
            <Input readOnly isDisabled value={swapInfoMetadata?.nextPoolId.toString()} />
            <Spacer y={4} />
            <div className="flex items-center justify-between">
                <Title text="Creation fee" />
                <div className="text-sm text-foreground-500">{`${swapInfoMetadata?.poolCreationFee} ${chainConfigs[chainKey].symbol}`}</div>
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
