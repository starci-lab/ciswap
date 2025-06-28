"use client"
import React from "react"
import { Button, useDisclosure } from "@heroui/react"
import { CREATE_PAIR_FORMIK, SELECT_TOKEN_MODAL, useCreatePairFormik, useSingletonHook, useSingletonHook2 } from "@/singleton"
import { setSelectedToken, useAppDispatch } from "@/redux"
import { SelectTokenModalKey } from "@/redux"
import { Image } from "@heroui/react"
export const CreatePair = () => {
    const { onOpen } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(SELECT_TOKEN_MODAL)
    const dispatch = useAppDispatch()
    const formik = useSingletonHook2<ReturnType<typeof useCreatePairFormik>>(CREATE_PAIR_FORMIK)
    return (
        <div>
            <div>Token A</div>
            <Button
                onPress={() => {
                    dispatch(setSelectedToken(SelectTokenModalKey.TokenA))
                    onOpen()
                }}
                variant="flat"
                startContent={<Image src={formik.values.token0Metadata?.imageUrl} alt={formik.values.token0Metadata?.name} className="w-10 h-10 rounded-full" />}
            >
                {formik.values.token0Metadata?.name}
            </Button>
            <div>Token B</div>
            <Button
                variant="flat"
                onPress={() => {
                    dispatch(setSelectedToken(SelectTokenModalKey.TokenB))
                    onOpen()
                }}
                startContent={<Image src={formik.values.token1Metadata?.imageUrl} alt={formik.values.token1Metadata?.name} className="w-10 h-10 rounded-full" />}
            >
                {formik.values.token1Metadata?.name}
            </Button>
            <Button fullWidth onPress={() => formik.handleSubmit()} isLoading={formik.isSubmitting}>Create Pair</Button>
        </div>
    )
}
