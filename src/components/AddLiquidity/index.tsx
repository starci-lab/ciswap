"use client"
import React, { useEffect } from "react"
import {
    Input,
    Spacer,
    Spinner,
    Tab,
    Tabs,
} from "@heroui/react"
import {
    ADD_LIQUIDITY_FORMIK,
    GET_LP_NFT_SWR,
    GET_POOL_INFO_SWR_MUTATION,
    GET_POOL_METADATA_SWR,
    GET_TOKEN_BALANCE_SWR,
    useAddLiquidityFormik,
    useGetBalanceSwrMutation,
    useGetLPNFTSwr,
    useGetPoolInfoSwrMutation,
    useGetPoolMetadataSwr,
    useSingletonHook,
    useSingletonHook2,
} from "@/singleton"
import { Title } from "../Title"
import { TokenType } from "@/modules/blockchain/pool/info"
import { isAptosLegacyType } from "@/utils"
import { AddLiquidityTab, setAddLiquidityTab, setPoolId, useAppDispatch, useAppSelector } from "@/redux"
import { Deposit } from "./Deposit"
import { Positions } from "./Positions"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

export const AddLiquidity = () => {
    const formik =
    useSingletonHook2<ReturnType<typeof useAddLiquidityFormik>>(
        ADD_LIQUIDITY_FORMIK
    )
    const { swrMutation } =
    useSingletonHook<ReturnType<typeof useGetPoolInfoSwrMutation>>(GET_POOL_INFO_SWR_MUTATION)
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
    const poolId = useAppSelector((state) => state.homeReducer.poolId)

    const { swrMutation: lpNftSwrMutation } =
    useSingletonHook<ReturnType<typeof useGetLPNFTSwr>>(GET_LP_NFT_SWR)
    useEffect(() => {
        if (poolId === undefined) return 
        const handleEffect = async () => {
            await lpNftSwrMutation.trigger({ poolId })
        }
        handleEffect()
    }, [poolId])

    const { account } = useWallet()
    const { swrMutation: getBalanceSwrMutation } =
    useSingletonHook<ReturnType<typeof useGetBalanceSwrMutation>>(GET_TOKEN_BALANCE_SWR)
    useEffect(() => {
        if (poolId === undefined) { 
            return
        }
        const handleEffect = async () => {
            await swrMutation.trigger({
                poolId,
            })
        }
        handleEffect()
    }, [poolId])

    useEffect(() => {
        if (formik.values.token0Address && account?.address) {
            const handleEffect = async () => {
                const { balance } = await getBalanceSwrMutation.trigger({
                    tokenAddress: formik.values.token0Address,
                    accountAddress: account?.address.toString(),
                    isTypeTag: formik.values.isToken0Legacy,
                })
                formik.setFieldValue("balance0", balance)
            }
            handleEffect()
        }
    }, [formik.values.token0Address])

    useEffect(() => {
        if (formik.values.token1Address && account?.address) {
            const handleEffect = async () => {
                const { balance } = await getBalanceSwrMutation.trigger({
                    tokenAddress: formik.values.token1Address,
                    accountAddress: account?.address.toString(),
                    isTypeTag: formik.values.isToken1Legacy,
                })
                formik.setFieldValue("balance1", balance)
            }
            handleEffect()
        }
    }, [formik.values.token1Address])

    return (
        <div>
            <Title text="Select pool" />
            <Spacer y={1.5} />
            <Input
                errorMessage={poolId?.toString()}
                isInvalid={!!poolId}
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
                value={poolId?.toString() || ""}
                onValueChange={(value) => dispatch(setPoolId(Number(value)))}
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
        </div>
    )
}
