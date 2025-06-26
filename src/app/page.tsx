"use client"
import React from "react"
import { Navbar, Swap, CreatePair } from "../components"
import { Card, CardBody, Tab, Tabs } from "@heroui/react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { HomeTab, setHomeTab } from "@/redux/slices"

const Page = () => {
    const dispatch = useAppDispatch()
    const homeTab = useAppSelector((state) => state.homeReducer.homeTab)
    
    const renderContent = () => {
        switch (homeTab) {
        case HomeTab.Swap:
            return <Swap />
        case HomeTab.CreatePair:
            return <CreatePair />
        case HomeTab.Earn:
            return <div />
        }
    }

    return (
        <div>
            <Navbar />
            <Tabs
                selectedKey={homeTab}
                onSelectionChange={(value) => dispatch(setHomeTab(value as HomeTab))}
            >
                <Tab key={HomeTab.Swap} title="Swap" />
                <Tab key={HomeTab.CreatePair} title="Create Pair" />
                <Tab key={HomeTab.Earn} title="Earn" />
            </Tabs>
            <Card>
                <CardBody>
                    {renderContent()}
                </CardBody>
            </Card>
        </div>
    )
}

export default Page
