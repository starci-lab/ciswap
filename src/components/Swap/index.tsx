import { Button, Input, Spacer, Spinner } from "@heroui/react"
import { ArrowDownIcon } from "@phosphor-icons/react"
import React, { useEffect } from "react"
import { SelectToken } from "./SelectToken"
import { SelectTokenModalKey } from "@/redux"
import {
    QUOTE_PRICE_OUT_SWR_MUTATION,
    SWAP_FORMIK,
    useQuotePriceOutSwrMutation,
    useSingletonHook,
    useSingletonHook2,
    useSwapFormik,
} from "@/singleton"
import { NumberInput } from "../NumberInput"

export const Swap = () => {
    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useQuotePriceOutSwrMutation>
  >(QUOTE_PRICE_OUT_SWR_MUTATION)

    const formik =
    useSingletonHook2<ReturnType<typeof useSwapFormik>>(SWAP_FORMIK)

    useEffect(() => {
        if (
            !formik.values.token0 ||
      !formik.values.token1 ||
      !formik.values.amountInString
        )
            return
        const handleEffect = async () => {
            try {
                const data = await swrMutation.trigger({
                    token0: formik.values.token0,
                    token1: formik.values.token1,
                    amountIn: Number.parseFloat(formik.values.amountInString ?? "0"),
                    poolAddress:
            "0x5db4ea10cf9a35dfa26d4642625239a579a1666cf2046d7ec44221adf9fb2956",
                    zeroForOne: formik.values.zeroForOne,
                })
                formik.setFieldValue("expectedAmountOut", data.amountOut)
                formik.setFieldValue("expectedAmountVirtualOut", data.amountVirtualOut)
                console.log(data)
            } catch (error) {
                console.error(error)
                formik.setFieldValue("expectedAmountOut", 0)
                formik.setFieldValue("expectedAmountVirtualOut", 0)
            } finally {
                formik.setFieldValue("amountOutLoaded", true)
            }
        }
        const delay = setTimeout(() => {
            handleEffect()
        }, 1000)
        return () => clearTimeout(delay)
    }, [
        formik.values.token0,
        formik.values.token1,
        formik.values.amountInString,
        formik.values.zeroForOne,
    ])

    console.log(formik.errors)
    return (
        <div>
            <div className="flex flex-col gap-4 items-center">
                <NumberInput
                    startContent={<SelectToken tokenKey={SelectTokenModalKey.TokenA} />}
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
                <Button className="w-10 h-10" isIconOnly variant="flat" radius="full">
                    <ArrowDownIcon className="w-5 h-5" />
                </Button>
                <Input
                    startContent={<SelectToken tokenKey={SelectTokenModalKey.TokenB} />}
                    classNames={{
                        input: "text-right rtl",
                        inputWrapper: "h-16",
                    }}
                    isReadOnly
                    endContent={
                        formik.values.amountOutLoaded && (
                            <div className="flex gap-2 items-center">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm w-16">
                                            {formik.values.expectedAmountOut.toString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formik.values.token1Metadata?.symbol}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm w-16">
                                            {formik.values.expectedAmountVirtualOut.toString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {`ci${formik.values.token1Metadata?.symbol}`}
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
                color="primary"
                isLoading={formik.isSubmitting}
                onPress={() => formik.handleSubmit()}
            >
        Swap
            </Button>
        </div>
    )
}
