"use client"
import { useSingletonHook2 } from "@/singleton"
import { useCreateTokenFormik } from "@/singleton/formiks"
import { Button, Input, NumberInput, Spacer } from "@heroui/react"
import React from "react"
import { CREATE_TOKEN_FORMIK } from "@/singleton/keys"
import { Title } from "@/components"

const Page = () => {
    const formik =
    useSingletonHook2<ReturnType<typeof useCreateTokenFormik>>(
        CREATE_TOKEN_FORMIK
    )
    return (
        <div className="max-w-[500px] mx-auto px-6">
            <div className="text-2xl font-bold">Create Token</div>
            <Spacer y={6} />
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Title text="Name" tooltip="Token name" />
                    <Input
                        label=""
                        placeholder="USD Coin"
                        labelPlacement="outside"
                        onValueChange={(value) => {
                            formik.setFieldValue("name", value)
                        }}
                        value={formik.values.name}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Title text="Symbol" tooltip="Token symbol" />
                    <Input
                        label=""
                        placeholder="USDC"
                        labelPlacement="outside"
                        onValueChange={(value) => {
                            formik.setFieldValue("symbol", value)
                        }}
                        value={formik.values.symbol}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Title text="Decimals" tooltip="Token decimals" />
                    <NumberInput
                        label=""
                        placeholder="6"
                        labelPlacement="outside"
                        onValueChange={(value) => {
                            formik.setFieldValue("decimals", Number(value))
                        }}
                        value={formik.values.decimals}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Title text="Total Supply" tooltip="Token total supply" />
                    <NumberInput
                        label=""
                        placeholder="1000000000"
                        labelPlacement="outside"
                        onValueChange={(value) => {
                            formik.setFieldValue("totalSupply", Number(value))
                        }}
                        value={formik.values.totalSupply}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Title text="Icon URI" tooltip="Public URL to your token's logo" />
                    <Input
                        label=""
                        placeholder="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042194"
                        labelPlacement="outside"
                        onValueChange={(value) => {
                            formik.setFieldValue("iconUri", value)
                        }}
                        value={formik.values.iconUri}
                    />
                    <div className="text-sm text-foreground-500">
            Enter a direct image link to your token&apos;s logo. Ensure it
            allows CORS access.
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Title text="Project URI" tooltip="Token project URI" />
                    <Input
                        label=""
                        placeholder="https://www.circle.com/usdc"
                        labelPlacement="outside"
                        onValueChange={(value) => {
                            formik.setFieldValue("projectUri", value)
                        }}
                        value={formik.values.projectUri}
                    />
                </div>
            </div>
            <Spacer y={4} />
            <Button
                color="primary"
                isLoading={formik.isSubmitting}
                onPress={() => formik.handleSubmit()}
            >
        Create Token
            </Button>
        </div>
    )
}

export default Page
