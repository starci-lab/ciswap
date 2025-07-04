"use client"
import React from "react"
import { Button, Input, Spacer, Tab, Tabs } from "@heroui/react"
import { Title } from "../../../components/Title"
import {
    AddLiquidityTab,
    refreshAddLiquidity,
    setAddLiquidityTab,
    setPoolId,
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import { Deposit } from "./Deposit"
import { Positions } from "./Positions"
import { useEffects } from "./useEffects"
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react"

export const AddLiquidity = () => {
    const swapInfoMetadata = useAppSelector((state) => state.stateReducer.swapInfo)

    const addLiquidityTab = useAppSelector(
        (state) => state.homeReducer.addLiquidityTab
    )

    const dispatch = useAppDispatch()
    const poolId = useAppSelector((state) => state.homeReducer.poolId)
    useEffects()

    const renderTab = () => {
        switch (addLiquidityTab) {
        case AddLiquidityTab.Deposit:
            return <Deposit />
        case AddLiquidityTab.Position:
            return <Positions />
        }
    }
    return (
        <div aria-label="add-liquidity">
            <Title text="Select pool" />
            <Spacer y={1.5} />
            <Input
                errorMessage={poolId?.toString()}
                isInvalid={!!poolId}
                label=""
                min={0}
                description={`Pool ID available range: 0 - ${
                    swapInfoMetadata?.nextPoolId ? swapInfoMetadata.nextPoolId - 1 : 0
                }`}
                max={swapInfoMetadata?.nextPoolId ? swapInfoMetadata.nextPoolId - 1 : 0}
                labelPlacement="outside"
                value={poolId?.toString() || ""}
                onValueChange={(value) => dispatch(setPoolId(Number(value)))}
            />
            <Spacer y={4} />
            <div className="flex justify-between">
                <Tabs
                    color="secondary"
                    selectedKey={addLiquidityTab}
                    onSelectionChange={(key) =>
                        dispatch(setAddLiquidityTab(key as AddLiquidityTab))
                    }
                >
                    <Tab key={AddLiquidityTab.Deposit} title="Deposit" />
                    <Tab key={AddLiquidityTab.Position} title="Positions" />
                </Tabs>
                <Button variant="flat" isIconOnly onPress={
                    () => {
                        dispatch(refreshAddLiquidity())
                    }
                }>
                    <ArrowCounterClockwiseIcon />
                </Button>
            </div>
            <Spacer y={4} />
            {
                renderTab()
            }
        </div>
    )
}
