import { useActiveAddress } from "@/hooks"
import { useAppSelector } from "@/redux"
import {
    useAddLiquidityFormik,
    ADD_LIQUIDITY_FORMIK,
    useSingletonHook2,
    GET_TOKEN_BALANCE_SWR_MUTATION,
    useGetBalanceSwrMutation,
    useSingletonHook,
    useGetTokenMetadatasSwr,
    GET_TOKEN_METADATAS_SWR,
} from "@/singleton"
import { isAptosLegacyType } from "@/utils"
import { useEffect } from "react"

// use Effect, call when the component is mounted
export const useEffects = () => {
    const formik =
    useSingletonHook2<ReturnType<typeof useAddLiquidityFormik>>(
        ADD_LIQUIDITY_FORMIK
    )
    const accountAddress = useActiveAddress()
    const { swrMutation: getBalanceSwrMutation } = useSingletonHook<
    ReturnType<typeof useGetBalanceSwrMutation>
  >(GET_TOKEN_BALANCE_SWR_MUTATION)

    const { swr: tokenMetadatasSwr } = useSingletonHook<
    ReturnType<typeof useGetTokenMetadatasSwr>
  >(GET_TOKEN_METADATAS_SWR)
  
    const addLiquidityRefreshKey = useAppSelector((state) => state.homeReducer.addLiquidityRefreshKey)
    useEffect(() => {
        if (!formik.values.tokenXAddress || !accountAddress) {
            return
        }
        const handleEffect = async () => {
            const { balance } = await getBalanceSwrMutation.trigger({
                tokenAddress: formik.values.tokenXAddress,
                accountAddress,
                isTypeTag: formik.values.isTokenXLegacy,
            })
            formik.setFieldValue("balanceX", balance)
        }
        handleEffect()
    }, [formik.values.tokenXAddress, accountAddress, addLiquidityRefreshKey])
    useEffect(() => {
        if (!formik.values.tokenYAddress || !accountAddress) {
            return
        }
        const handleEffect = async () => {
            const { balance } = await getBalanceSwrMutation.trigger({
                tokenAddress: formik.values.tokenYAddress,
                accountAddress,
                isTypeTag: formik.values.isTokenYLegacy,
            })
            console.log(balance)
            formik.setFieldValue("balanceY", balance)
        }
        handleEffect()
    }, [formik.values.tokenYAddress, accountAddress, addLiquidityRefreshKey])

    useEffect(() => {
        if (tokenMetadatasSwr.data?.tokenXMetadata) {
            formik.setFieldValue(
                "tokenXAddress",
                tokenMetadatasSwr.data?.tokenXMetadata.tokenAddress
            )
            formik.setFieldValue(
                "isTokenXLegacy",
                isAptosLegacyType(
                    tokenMetadatasSwr.data?.tokenXMetadata.tokenAddress || ""
                )
            )
        }
    }, [tokenMetadatasSwr.data?.tokenXMetadata])

    useEffect(() => {
        if (tokenMetadatasSwr.data?.tokenYMetadata) {
            formik.setFieldValue(
                "tokenYAddress",
                tokenMetadatasSwr.data?.tokenYMetadata.tokenAddress
            )
            formik.setFieldValue(
                "isTokenYLegacy",
                isAptosLegacyType(
                    tokenMetadatasSwr.data?.tokenYMetadata.tokenAddress || ""
                )
            )
        }
    }, [tokenMetadatasSwr.data?.tokenYMetadata])
}
