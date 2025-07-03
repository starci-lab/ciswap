import { TokenMetadata } from "@/modules/blockchain"
import { FormikProps, useFormik } from "formik"
import * as Yup from "yup" // Import Yup
import { APTOS_MOVE_CALL_SWR_MUTATION } from "../keys"
import { useSingletonHook } from "../core"
import {
    useAptosMoveCallSwrMutation,
    UseAptosMoveCallSwrMutationResponse,
} from "../swrs"
import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
import { computeRaw } from "@/utils"
import { addErrorToast, addTxToast } from "@/toasts"
import { useAppSelector } from "@/redux"

export interface CreatePairFormikValues {
  token0: string;
  token0Typed: string;
  isToken0Legacy: boolean;
  token1: string;
  token1Typed: string;
  isToken1Legacy: boolean;
  token0Metadata?: TokenMetadata;
  token1Metadata?: TokenMetadata;
  amount0: number;
  amount1: number;
}

export const useCreatePairFormik = (): FormikProps<CreatePairFormikValues> => {
    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useAptosMoveCallSwrMutation>
  >(APTOS_MOVE_CALL_SWR_MUTATION)
    const initialValues: CreatePairFormikValues = {
        token0: "",
        token0Typed: "",
        isToken0Legacy: true,
        token1: "",
        token1Typed: "",
        isToken1Legacy: true,
        amount0: 10000,
        amount1: 10000,
    }
    // Yup validation schema
    const validationSchema = Yup.object({
        token0: Yup.string().required("Token 0 is required"),
        token0Typed: Yup.string().required("Token 0 type is required"),
        token1: Yup.string().required("Token 1 is required"),
        token1Typed: Yup.string().required("Token 1 type is required"),
        amount0: Yup.number().required("Amount 0 is required"),
        amount1: Yup.number().required("Amount 1 is required"),
    })

    const network = useAppSelector((state) => state.chainReducer.network)

    const formik = useFormik({
        initialValues,
        validationSchema, // Pass Yup validation schema directly
        onSubmit: async ({
            token0,
            token1,
            amount0,
            amount1,
            isToken0Legacy,
            isToken1Legacy,
        }) => {
            try {
            // onpen the sign transaction moda
                let data: UseAptosMoveCallSwrMutationResponse
                const numLegacies = [isToken0Legacy, isToken1Legacy].filter(
                    Boolean
                ).length

                switch (numLegacies) {
                case 0:
                    {
                        data = await swrMutation.trigger({
                            function: `${APTOS_SWAP_RESOURCE_ACCOUNT}::router::create_pair`,
                            functionArguments: [
                                token0,
                                token1,
                                computeRaw(amount0),
                                computeRaw(amount1),
                            ],
                            typeArguments: [],
                        })
                    }
                    break
                case 1: {
                    const typeArg = isToken0Legacy ? token0 : token1
                    const funcArg = isToken0Legacy ? token1 : token0
                    data = await swrMutation.trigger({
                        function: `${APTOS_SWAP_RESOURCE_ACCOUNT}::router::create_pair_with_one_coin`,
                        functionArguments: [
                            funcArg,
                            computeRaw(amount0),
                            computeRaw(amount1),
                        ],
                        typeArguments: [typeArg],
                    })
                    break
                }
                default: {
                    data = await swrMutation.trigger({
                        function: `${APTOS_SWAP_RESOURCE_ACCOUNT}::router::create_pair_with_dual_coins`,
                        functionArguments: [computeRaw(amount0), computeRaw(amount1)],
                        typeArguments: [token0, token1],
                    })
                    break
                }
                }
                addTxToast({ txHash: data.hash, network })
            } catch (error) {
                addErrorToast(error as Error)
            }
        },
    })

    return formik
}
