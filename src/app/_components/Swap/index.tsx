import { Button, Input, Link, Spacer, Spinner, Tooltip, useDisclosure } from "@heroui/react"
import { ArrowDownIcon, PencilIcon } from "@phosphor-icons/react"
import React, { useEffect } from "react"
import { SelectToken } from "./SelectToken"
import { SelectTokenModalKey } from "@/redux"
import { useActiveAddress } from "@/hooks"
import {
    CONNECT_WALLETS_DISCLOSURE,
    QUOTE_PRICE_OUT_SWR_MUTATION,
    SWAP_FORMIK,
    useQuotePriceOutSwrMutation,
    useSingletonHook,
    useSingletonHook2,
    useSwapFormik,
} from "@/singleton"
import { NumberInput } from "../../../components/NumberInput"
import { roundNumber } from "@/utils"
import { useEffects } from "./useEffects"
import { useRouter } from "next/navigation"

export interface SwapProps {
    showGetStarted?: boolean
    className?: string
}

export const Swap = ({ showGetStarted = false, className }: SwapProps) => {
    const router = useRouter()
    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useQuotePriceOutSwrMutation>
  >(QUOTE_PRICE_OUT_SWR_MUTATION)

    const formik =
    useSingletonHook2<ReturnType<typeof useSwapFormik>>(SWAP_FORMIK)

    useEffect(() => {
        formik.setFieldValue("xForY", formik.values.xForY)
    }, [formik.values.xForY])

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
                    xForY: formik.values.xForY,
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
        formik.values.xForY,
    ])

    useEffects({ showGetStarted })
    const accountAddress = useActiveAddress()
    const { onOpen } = useSingletonHook<ReturnType<typeof useDisclosure>>(CONNECT_WALLETS_DISCLOSURE)
    return (
        <div className={className}>
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
                    {
                        !showGetStarted && (
                            <>
                                <Spacer y={1.5} />
                                <div className="flex flex-row-reverse">
                                    <div className="text-xs text-foreground-500">
              Balance: {formik.values.balanceIn.toString()}{" "}
                                        {formik.values.tokenXMetadata?.symbol}
                                    </div>
                                </div>
                            </>
                        )
                    }
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
                        formik.setFieldValue("xForY", !formik.values.xForY)
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
            {
                showGetStarted ? (
                    <Button
                        fullWidth
                        color="primary"
                        onPress={() => {
                            router.push("/swap")
                        }}
                    >
                        Get Started
                    </Button>
                )
                    : (
                        <> 
                            {
                                accountAddress ? 
                                    <Button
                                        fullWidth
                                        isDisabled={!formik.isValid}
                                        color="primary"
                                        isLoading={formik.isSubmitting}
                                        onPress={() => formik.handleSubmit()}
                                    >
        Swap
                                    </Button> :
                                    <Button
                                        fullWidth
                                        color="primary"
                                        onPress={() => onOpen()}
                                    >
                            Connect Wallet
                                    </Button>
                            }
                            <Spacer y={4} />
                            <div>
                                <div className="flex justify-between items-center w-full">
                                    <Tooltip
                                        content={
                                            <div className="max-w-[200px]">
                            Pool route
                                            </div>
                                        }
                                    >
                                        <div className="text-sm">Route</div>
                                    </Tooltip>
                                    <div className="flex flex-col items-end">
                                        {
                                            formik.values.pools.map((pool, index) => (
                                                <Link color="secondary" underline="always" key={index}>
                                    Pool {pool}
                                                </Link>
                                            ))
                                        }
                                    </div>
                                </div>
                                <Spacer y={2} />
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
                        </>
                    )}
        </div> 
    )
}
