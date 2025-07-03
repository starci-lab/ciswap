"use client"
import React, { useEffect } from "react"
import {
    Button,
    Input,
    Spacer,
    Spinner,
    Tab,
    Tabs,
} from "@heroui/react"
import {
    ADD_LIQUIDITY_FORMIK,
    GET_POOL_INFO_SWR,
    GET_POOL_METADATA_SWR,
    useAddLiquidityFormik,
    useGetPoolInfoSwr,
    useGetPoolMetadataSwr,
    useSingletonHook,
    useSingletonHook2,
} from "@/singleton"
import { Title } from "../Title"
import { TokenType } from "@/modules/blockchain/pool/info"
import { isAptosLegacyType } from "@/utils"
import { AddLiquidityTab, setAddLiquidityTab, useAppDispatch, useAppSelector } from "@/redux"
import { Deposit } from "./Deposit"
import { Positions } from "./Positions"

export const AddLiquidity = () => {
    const formik =
    useSingletonHook2<ReturnType<typeof useAddLiquidityFormik>>(
        ADD_LIQUIDITY_FORMIK
    )
    const { swrMutation } =
    useSingletonHook<ReturnType<typeof useGetPoolInfoSwr>>(GET_POOL_INFO_SWR)
    const { swr: poolMetadataSwr } = useSingletonHook<
    ReturnType<typeof useGetPoolMetadataSwr>
  >(GET_POOL_METADATA_SWR)

    useEffect(() => {
        if (swrMutation.data?.tokenAddresses[TokenType.Token0]) {
            formik.setFieldValue(
                "token0Address",
                swrMutation.data?.tokenAddresses[TokenType.Token0].tokenAddress
            )
            formik.setFieldValue(
                "isToken0Legacy",
                isAptosLegacyType(
                    swrMutation.data?.tokenAddresses[TokenType.Token0].tokenAddress || ""
                )
            )
        }
    }, [swrMutation.data?.tokenAddresses[TokenType.Token0]])

    useEffect(() => {
        if (swrMutation.data?.tokenAddresses[TokenType.Token1]) {
            formik.setFieldValue(
                "token1Address",
                swrMutation.data?.tokenAddresses[TokenType.Token1].tokenAddress
            )
            formik.setFieldValue(
                "isToken1Legacy",
                isAptosLegacyType(
                    swrMutation.data?.tokenAddresses[TokenType.Token1].tokenAddress || ""
                )
            )
        }
    }, [swrMutation.data?.tokenAddresses[TokenType.Token1]])
    const addLiquidityTab = useAppSelector(state => state.homeReducer.addLiquidityTab)
    const renderTab = () => {
        switch (addLiquidityTab) {
        case AddLiquidityTab.Deposit:
            return <Deposit />
        case AddLiquidityTab.Position:
            return <Positions />
        }
    }
    const dispatch = useAppDispatch()
    return (
        <div>
            <Title text="Select pool" />
            <Spacer y={1.5} />
            <Input
                errorMessage={formik.errors.poolId}
                isInvalid={!!formik.errors.poolId}
                label=""
                min={0}
                description={`Pool ID available range: 0 - ${
                    poolMetadataSwr.data?.nextPoolId
                        ? poolMetadataSwr.data.nextPoolId - 1
                        : 0
                }`}
                max={
                    poolMetadataSwr.data?.nextPoolId
                        ? poolMetadataSwr.data.nextPoolId - 1
                        : 0
                }
                labelPlacement="outside"
                value={formik.values.poolId?.toString() || ""}
                onValueChange={(value) => formik.setFieldValue("poolId", Number(value))}
            />
            <Spacer y={4} />
            <Tabs
                color="secondary"
                selectedKey={addLiquidityTab}
                onSelectionChange={(key) => dispatch(setAddLiquidityTab(key as AddLiquidityTab))}
            >
                <Tab key={AddLiquidityTab.Deposit} title="Deposit" />
                <Tab key={AddLiquidityTab.Position} title="Positions" />
            </Tabs>
            <Spacer y={4} />
            {swrMutation.isMutating && (
                <div className="flex items-center gap-2">
                    <Spinner variant="wave" />
                </div>
            )}
            {swrMutation.data?.loaded && !swrMutation.isMutating ? (
                renderTab()
            ) : null}
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
