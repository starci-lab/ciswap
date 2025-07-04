import { SWAP_FORMIK, useGetBalanceSwrMutation, useSingletonHook2 } from "@/singleton"
import { useSwapFormik } from "@/singleton/formiks"
import { useActiveAddress } from "@/hooks"
import { useEffect } from "react"

export const useEffects = () => {
    const formik = useSingletonHook2<ReturnType<typeof useSwapFormik>>(
        SWAP_FORMIK
    )
    const { swrMutation: getBalanceSwrMutation } = useGetBalanceSwrMutation()
    const accountAddress = useActiveAddress()
    useEffect(() => {
        if (!accountAddress || !formik.values.tokenX) return
        const handleEffect = async () => {
            const { balance } = await getBalanceSwrMutation.trigger({
                accountAddress: accountAddress || "",
                tokenAddress: formik.values.tokenX,
                isTypeTag: true
            })
            formik.setFieldValue("balanceIn", balance || 0)
        }
        handleEffect()
    }, [accountAddress, formik.values.tokenX])
}   