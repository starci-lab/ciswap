"use client"
import React from "react"
import { Card, CardBody, Tab, Tabs } from "@heroui/react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { HomeTab, setHomeTab } from "@/redux/slices"
import { Spacer } from "@heroui/react"
import { AddLiquidity, Swap, CreatePair } from "../_components"

const Page = () => {
    const dispatch = useAppDispatch()
    const homeTab = useAppSelector((state) => state.homeReducer.homeTab)
    const renderContent = () => {
        switch (homeTab) {
        case HomeTab.Swap:
            return <Swap />
        case HomeTab.CreatePair:
            return <CreatePair />
        case HomeTab.AddLiquidity:
            return <AddLiquidity />
        }
    }
    
    return (
        <div className="p-4">
            <div className="w-full grid place-items-center">
                <Tabs
                    className="max-w-[500px] mx-auto"
                    selectedKey={homeTab}
                    onSelectionChange={(value) => dispatch(setHomeTab(value as HomeTab))}
                >
                    <Tab key={HomeTab.Swap} title="Swap" />
                    <Tab key={HomeTab.CreatePair} title="Create Pair" />
                    <Tab key={HomeTab.AddLiquidity} title="Add Liquidity" />
                </Tabs>
            </div>
            <Spacer y={4} />
            <Card className="max-w-[500px] mx-auto">
                <CardBody>
                    {renderContent()}
                </CardBody>
            </Card>
        </div>
    )
}

export default Page
