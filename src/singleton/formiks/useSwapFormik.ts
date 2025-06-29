
import { TokenMetadata } from "@/modules/blockchain"
import { FormikProps, useFormik } from "formik"
import * as Yup from "yup" // Import Yup
import { APTOS_MOVE_CALL_SWR_MUTATION } from "../keys"
import { useSingletonHook } from "../core"
import { useAptosMoveCallSwrMutation } from "../swrs"
import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
import { computeRaw } from "@/utils"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

export interface SwapFormikValues {
    token0: string
    token0Typed: string
    token1: string
    token1Typed: string
    token0Metadata?: TokenMetadata
    token1Metadata?: TokenMetadata
    expectedAmountOut: number
    expectedAmountVirtualOut: number
    zeroForOne: boolean
    amountOutLoaded: boolean
    amountInString: string
}

export const useSwapFormik = (): FormikProps<SwapFormikValues> => {
    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useAptosMoveCallSwrMutation>
  >(APTOS_MOVE_CALL_SWR_MUTATION)
    const initialValues: SwapFormikValues = {
        token0: "",
        token0Typed: "",
        token1: "",
        token1Typed: "",
        amountInString: "",
        expectedAmountOut: 0,
        expectedAmountVirtualOut: 0,
        zeroForOne: true,
        amountOutLoaded: false,
    }
    // Yup validation schema
    const validationSchema = Yup.object({
        token0: Yup.string().required("Token 0 is required"),
        token0Typed: Yup.string().required("Token 0 type is required"),
        token1: Yup.string().required("Token 1 is required"),
        token1Typed: Yup.string().required("Token 1 type is required"),
        poolAddress: Yup.string().optional(),
    })

    const { account } = useWallet()

    const formik = useFormik({
        initialValues,
        validationSchema, // Pass Yup validation schema directly
        onSubmit: async ({ token0, token1, amountInString, zeroForOne }) => {
            // onpen the sign transaction moda
            const data = await swrMutation.trigger({
                function: `${APTOS_SWAP_RESOURCE_ACCOUNT}::router::swap`,
                functionArguments: [
                    "0x5db4ea10cf9a35dfa26d4642625239a579a1666cf2046d7ec44221adf9fb2956",
                    computeRaw(Number.parseFloat(amountInString ?? "0")), 
                    zeroForOne,
                    account?.address,
                    0
                ],
                typeArguments: [token0, token1],
            })
            alert(data)
            open()
        },
    })

    return formik
}
