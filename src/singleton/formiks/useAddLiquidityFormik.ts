
import { TokenMetadata } from "@/modules/blockchain"
import { FormikProps, useFormik } from "formik"
import * as Yup from "yup" // Import Yup
import { APTOS_MOVE_CALL_SWR_MUTATION } from "../keys"
import { useSingletonHook } from "../core"
import { useAptosMoveCallSwrMutation } from "../swrs"
import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
import { computeRaw } from "@/utils"

export interface AddLiquidityFormikValues {
    token0: string
    token0Typed: string
    token1: string
    token1Typed: string
    token0Metadata?: TokenMetadata
    token1Metadata?: TokenMetadata
    amount0: number
    amount1: number
    poolAddress: string

}

export const useAddLiquidityFormik = (): FormikProps<AddLiquidityFormikValues> => {
    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useAptosMoveCallSwrMutation>
  >(APTOS_MOVE_CALL_SWR_MUTATION)
    const initialValues: AddLiquidityFormikValues = {
        token0: "",
        token0Typed: "",
        token1: "",
        token1Typed: "",
        amount0: 10,
        amount1: 10,
        poolAddress: "",
    }
    // Yup validation schema
    const validationSchema = Yup.object({
        token0: Yup.string().required("Token 0 is required"),
        token0Typed: Yup.string().required("Token 0 type is required"),
        token1: Yup.string().required("Token 1 is required"),
        token1Typed: Yup.string().required("Token 1 type is required"),
        amount0: Yup.number().required("Amount 0 is required"),
        amount1: Yup.number().required("Amount 1 is required"),
        poolAddress: Yup.string().required("Pool address is required"),
    })

    const formik = useFormik({
        initialValues,
        validationSchema, // Pass Yup validation schema directly
        onSubmit: async ({ token0, token1, amount0, amount1, poolAddress }) => {
            // onpen the sign transaction moda
            const data = await swrMutation.trigger({
                function: `${APTOS_SWAP_RESOURCE_ACCOUNT}::router::add_liquidity`,
                functionArguments: [poolAddress, computeRaw(amount0), computeRaw(amount1)],
                typeArguments: [token0, token1],
            })
            alert(data)
            open()
        },
    })

    return formik
}
