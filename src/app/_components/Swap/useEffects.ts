import {
    GET_TOKEN_METADATA_SWR_MUTATION,
    SWAP_FORMIK,
    useGetBalanceSwrMutation,
    useGetTokenMetadataSwrMutation,
    useSingletonHook,
    useSingletonHook2,
} from "@/singleton"
import { useSwapFormik } from "@/singleton/formiks"
import { useActiveAddress } from "@/hooks"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { isAptosLegacyType } from "@/utils"
import { tokenMap } from "@/config"
import { useAppSelector } from "@/redux"

export const useEffects = () => {
    const chainKey = useAppSelector(state => state.chainReducer.chainKey)
    const network = useAppSelector(state => state.chainReducer.network)
    const formik =
    useSingletonHook2<ReturnType<typeof useSwapFormik>>(SWAP_FORMIK)
    const { swrMutation: getTokenMetadataSwrMutation } = useSingletonHook<
    ReturnType<typeof useGetTokenMetadataSwrMutation>
  >(GET_TOKEN_METADATA_SWR_MUTATION)
    const { swrMutation: getBalanceSwrMutation } = useGetBalanceSwrMutation()
    const accountAddress = useActiveAddress()

    useEffect(() => {
        if (!accountAddress || !formik.values.tokenX) return
        const handleEffect = async () => {
            const { balance } = await getBalanceSwrMutation.trigger({
                accountAddress: accountAddress || "",
                tokenAddress: formik.values.tokenX,
                isTypeTag: isAptosLegacyType(formik.values.tokenX),
            })
            formik.setFieldValue("balanceIn", balance || 0)
        }
        handleEffect()
    }, [accountAddress, formik.values.tokenX])

    const router = useRouter()
    // build the search params if formik change
    const searchParams = useSearchParams()
    useEffect(() => {
        const tokenX = searchParams.get("tokenX") || "0x1::aptos_coin::AptosCoin"
        const tokenY =
      searchParams.get("tokenY") ||
      "0xffbd7560161ea26468a482555669eec1f28f7fb1d985aa44e0a58413b267ce78"
        const zeroForOne = Boolean(searchParams.get("zeroForOne") || "true")
        formik.setFieldValue("tokenX", tokenX)
        formik.setFieldValue("tokenY", tokenY)
        formik.setFieldValue("zeroForOne", zeroForOne)
    }, [])

    useEffect(() => {
        if (!formik.values.tokenX) return
        if (formik.values.tokenXMetadata) return
        const handleEffect = async () => {
            const token = tokenMap[chainKey][network].find(token => token.address === formik.values.tokenX)
            if (token) {
                formik.setFieldValue("tokenXMetadata", token)
                return
            }
            const data = await getTokenMetadataSwrMutation.trigger({
                tokenAddress: formik.values.tokenX,
                isTypeTag: isAptosLegacyType(formik.values.tokenX),
            })
            formik.setFieldValue("tokenXMetadata", data)

        }
        handleEffect()
    }, [formik.values.tokenX, formik.values.tokenXMetadata])

    useEffect(() => {
        if (!formik.values.tokenY) return
        if (formik.values.tokenYMetadata) return
        const handleEffect = async () => {
            const token = tokenMap[chainKey][network].find(token => token.address === formik.values.tokenY)
            if (token) {
                formik.setFieldValue("tokenYMetadata", token)
                return
            }
            const data = await getTokenMetadataSwrMutation.trigger({
                tokenAddress: formik.values.tokenY,
                isTypeTag: isAptosLegacyType(formik.values.tokenY),
            })
            formik.setFieldValue("tokenYMetadata", data)
        }
        handleEffect()
    }, [formik.values.tokenY, formik.values.tokenYMetadata])

    useEffect(() => {
        const params = new URLSearchParams()
        if (formik.values.tokenX) {
            params.set("tokenX", formik.values.tokenX)
        }
        if (formik.values.tokenY) { 
            params.set("tokenY", formik.values.tokenY)
        }
        if (formik.values.zeroForOne) {
            params.set("zeroForOne", formik.values.zeroForOne.toString())
        }
        router.push(`?${params.toString()}`)
    }, [formik.values.tokenX, formik.values.tokenY, formik.values.zeroForOne])
}
