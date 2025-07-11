import { Button, Input, Spacer, Spinner, Tooltip } from "@heroui/react"
import { ArrowDownIcon, PencilIcon } from "@phosphor-icons/react"
import React, { useEffect } from "react"
import { SelectToken } from "./SelectToken"
import { SelectTokenModalKey } from "@/redux"
import {
    GET_TOKEN_METADATA_SWR_MUTATION,
    QUOTE_PRICE_OUT_SWR_MUTATION,
    SWAP_FORMIK,
    useGetTokenMetadataSwrMutation,
    useQuotePriceOutSwrMutation,
    useSingletonHook,
    useSingletonHook2,
    useSwapFormik,
} from "@/singleton"
import { NumberInput } from "../../../components/NumberInput"
import { useSearchParams } from "next/navigation"
import { isAptosLegacyType, roundNumber } from "@/utils"
import { useEffects } from "./useEffects"

export const Swap = () => {
    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useQuotePriceOutSwrMutation>
  >(QUOTE_PRICE_OUT_SWR_MUTATION)

    const formik =
    useSingletonHook2<ReturnType<typeof useSwapFormik>>(SWAP_FORMIK)

    const searchParams = useSearchParams()
    const tokenX = searchParams.get("tokenX") || "0x1::aptos_coin::AptosCoin"
    const tokenY =
    searchParams.get("tokenY") ||
    "0xffbd7560161ea26468a482555669eec1f28f7fb1d985aa44e0a58413b267ce78"
    const zeroForOne = Boolean(searchParams.get("zeroForOne") || "true")

    const { swrMutation: getTokenMetadataSwrMutation } = useSingletonHook<
    ReturnType<typeof useGetTokenMetadataSwrMutation>
  >(GET_TOKEN_METADATA_SWR_MUTATION)
    useEffect(() => {
        const handleEffect = async () => {
            const data = await getTokenMetadataSwrMutation.trigger({
                tokenAddress: tokenX,
                isTypeTag: isAptosLegacyType(tokenX),
            })
            formik.setFieldValue("tokenXMetadata", data)
            formik.setFieldValue("tokenX", data.tokenAddress)
        }
        handleEffect()
    }, [tokenX])
    useEffect(() => {
        const handleEffect = async () => {
            const data = await getTokenMetadataSwrMutation.trigger({
                tokenAddress: tokenY,
                isTypeTag: isAptosLegacyType(tokenY),
            })
            formik.setFieldValue("tokenYMetadata", data)
            formik.setFieldValue("tokenY", data.tokenAddress)
        }
        handleEffect()
    }, [tokenY])
    useEffect(() => {
        formik.setFieldValue("zeroForOne", zeroForOne)
    }, [zeroForOne])

    useEffects()

    useEffect(() => {
        if (
            !formik.values.tokenX ||
      !formik.values.tokenY ||
      !formik.values.amountInString
        )
            return
        const handleEffect = async () => {
            try {
                const data = await swrMutation.trigger({
                    amountIn: Number.parseFloat(formik.values.amountInString ?? "0"),
                    poolId: 0,
                    zeroForOne: formik.values.zeroForOne,
                })
                formik.setFieldValue("expectedAmountOut", data.amountOut)
                formik.setFieldValue("expectedAmountDebtOut", data.amountVirtualOut)
                console.log(data)
            } catch (error) {
                console.error(error)
                formik.setFieldValue("expectedAmountOut", 0)
                formik.setFieldValue("expectedAmountDebtOut", 0)
            } finally {
                formik.setFieldValue("amountOutLoaded", true)
            }
        }
        const delay = setTimeout(() => {
            handleEffect()
        }, 1000)
        return () => clearTimeout(delay)
    }, [
        formik.values.tokenX,
        formik.values.tokenY,
        formik.values.amountInString,
        formik.values.zeroForOne,
    ])

    return (
        <div>
            <div className="flex flex-col gap-4 items-center">
                <div className="w-full">
                    <NumberInput
                        startContent={
                            <div>
                                <SelectToken tokenKey={SelectTokenModalKey.TokenX} />
                            </div>
                        }
                        classNames={{
                            input: "text-right rtl",
                            inputWrapper: "h-16",
                        }}
                        placeholder="0.0"
                        value={formik.values.amountInString}
                        onValueChange={(value) => {
                            formik.setFieldValue("amountInString", value)
                        }}
                    />
                    <Spacer y={1.5} />
                    <div className="flex flex-row-reverse">
                        <div className="text-xs text-foreground-500">
              Balance: {formik.values.balanceIn.toString()}{" "}
                            {formik.values.tokenXMetadata?.symbol}
                        </div>
                    </div>
                </div>
                <Button
                    className="w-10 h-10"
                    isIconOnly
                    variant="flat"
                    radius="full"
                    onPress={() => {
                        formik.setFieldValue("tokenX", formik.values.tokenY)
                        formik.setFieldValue("tokenY", formik.values.tokenX)
                        formik.setFieldValue(
                            "tokenXMetadata",
                            formik.values.tokenYMetadata
                        )
                        formik.setFieldValue(
                            "tokenYMetadata",
                            formik.values.tokenXMetadata
                        )
                        formik.setFieldValue("zeroForOne", !formik.values.zeroForOne)
                    }}
                >
                    <ArrowDownIcon className="w-5 h-5" />
                </Button>
                <Input
                    startContent={
                        <div>
                            <SelectToken tokenKey={SelectTokenModalKey.TokenY} />
                        </div>
                    }
                    classNames={{
                        input: "text-right rtl",
                        inputWrapper: "h-16",
                    }}
                    isReadOnly
                    endContent={
                        formik.values.amountOutLoaded && (
                            <div className="flex gap-2 items-center">
                                <div className="flex flex-col gap-2 items-end">
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm">
                                            {formik.values.expectedAmountOut.toString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formik.values.tokenYMetadata?.symbol}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm">
                                            {formik.values.expectedAmountDebtOut.toString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {`ci${formik.values.tokenYMetadata?.symbol}`}
                                        </div>
                                    </div>
                                </div>
                                {swrMutation.isMutating && (
                                    <Spinner color="secondary" size="sm" />
                                )}
                            </div>
                        )
                    }
                />
            </div>
            <Spacer y={6} />
            <Button
                fullWidth
                isDisabled={!formik.isValid}
                color="primary"
                isLoading={formik.isSubmitting}
                onPress={() => formik.handleSubmit()}
            >
        Swap
            </Button>
            <Spacer y={4} />
            <div>
                <div className="flex justify-between items-center w-full">
                    <Tooltip
                        content={
                            <div className="max-w-[200px]">
                            Amount you are guaranteed to receive.
                            </div>
                        }
                    >
                        <div className="text-sm">Minimun Received</div>
                    </Tooltip>
                    <div className="flex flex-col items-end">
                        <div className="text-sm flex items-center gap-2">
                            <div>
                                {roundNumber(formik.values.expectedAmountOut * 0.95)}
                            </div>
                            <div className="text-gray-500">
                                {formik.values.tokenYMetadata?.symbol}
                            </div>
                        </div>  
                        <div className="text-sm flex items-center gap-2">
                            <div>
                                {roundNumber(formik.values.expectedAmountDebtOut * 0.95)}
                            </div>
                            <div className="text-gray-500">
                                {`ci${formik.values.tokenYMetadata?.symbol}`}
                            </div>
                        </div>
                    </div>
                </div>
                <Spacer y={2} />
                <div className="flex justify-between items-center w-full">
                    <Tooltip
                        content={
                            <div className="max-w-[200px]">
                Permissible price deviation (%) between quoted and execution
                price of swap. For cross-chain swaps, this applies separately to
                both source and destination chains.
                            </div>
                        }
                    >
                        <div className="text-sm">Slippage Tolerance</div>
                    </Tooltip>
                    <Button
                        endContent={<PencilIcon />}
                        size="sm"
                        className="text-sm"
                        variant="flat"
                        color="secondary"
                    >
            Auto: 0.5%
                    </Button>
                </div>
                <Spacer y={2}/>
                <div className="flex justify-between items-center w-full">
                    <Tooltip
                        content={
                            <div className="max-w-[200px]">
                            Trading fee varies by pool fee tier.
                            </div>
                        }
                    >
                        <div className="text-sm">Trading Fees</div>
                    </Tooltip>
                    <div className="flex flex-col items-end">
                        <div className="text-sm flex items-center gap-2">
                            <div>
                                {roundNumber(formik.values.expectedAmountOut * 0.03)}
                            </div>
                            <div className="text-gray-500">
                                {formik.values.tokenYMetadata?.symbol}
                            </div>
                        </div>
                        <div className="text-sm flex items-center gap-2">
                            <div>
                                {roundNumber(formik.values.expectedAmountDebtOut * 0.03)}
                            </div>
                            <div className="text-gray-500">
                                {`ci${formik.values.tokenYMetadata?.symbol}`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
