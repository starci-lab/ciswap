import { TokenMetadata } from "@/modules/blockchain"
import { FormikProps, useFormik } from "formik"
import * as Yup from "yup" // Import Yup
import { APTOS_MOVE_CALL_SWR_MUTATION } from "../keys"
import { useSingletonHook } from "../core"
import {
    useAptosMoveCallSwrMutation,
    UseAptosMoveCallSwrMutationResponse,
} from "../swrs"
import { computeRaw, isAptosLegacyType } from "@/utils"
import { addErrorToast, addTxToast } from "@/toasts"
import { useAppSelector } from "@/redux"
import { buildAptosFQN } from "@/config"
import { chainKeyToPlatformKey, PlatformKey } from "@/types"

export interface CreatePairFormikValues {
  tokenX: string;
  tokenY: string;
  tokenXMetadata?: TokenMetadata;
  tokenYMetadata?: TokenMetadata;
  amountX: number;
  amountY: number;
}

export const useCreatePairFormik = (): FormikProps<CreatePairFormikValues> => {
    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useAptosMoveCallSwrMutation>
  >(APTOS_MOVE_CALL_SWR_MUTATION)
    const initialValues: CreatePairFormikValues = {
        tokenX: "",
        tokenY: "",
        amountX: 10000,
        amountY: 10000,
    }
    // Yup validation schema
    const validationSchema = Yup.object({
        tokenX: Yup.string().required("Token X is required"),
        tokenY: Yup.string().required("Token Y is required"),
        amountX: Yup.number().required("Amount X is required"),
        amountY: Yup.number().required("Amount Y is required"),
    })

    const network = useAppSelector((state) => state.chainReducer.network)
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)

    const formik = useFormik({
        initialValues,
        validationSchema, // Pass Yup validation schema directly
        onSubmit: async ({
            tokenX,
            tokenY,
            amountX,
            amountY,
        }) => {
            try {
            // onpen the sign transaction moda
                let data: UseAptosMoveCallSwrMutationResponse
                switch (chainKeyToPlatformKey[chainKey]) {
                case PlatformKey.Aptos: {
                    const isTokenXLegacy = isAptosLegacyType(tokenX)
                    const isTokenYLegacy = isAptosLegacyType(tokenY)
                    const numLegacies = [isTokenXLegacy, isTokenYLegacy].filter(
                        Boolean
                    ).length
                    switch (numLegacies) {
                    case 0:
                        {
                            data = await swrMutation.trigger({
                                function: buildAptosFQN({
                                    network,
                                    moduleName: "router",
                                    functionNameOrResourceType: "create_pair",
                                }),
                                functionArguments: [
                                    tokenX,
                                    tokenY,
                                    computeRaw(amountX),
                                    computeRaw(amountY),
                                ],
                                typeArguments: [],
                            })
                        }
                        break
                    case 1: {
                        const typeArg = isTokenXLegacy ? tokenX : tokenY
                        const funcArg = isTokenXLegacy ? tokenY : tokenX
                        data = await swrMutation.trigger({
                            function: buildAptosFQN({
                                network,
                                moduleName: "router",
                                functionNameOrResourceType: "create_pair_with_one_coin",
                            }),
                            functionArguments: [
                                funcArg,
                                computeRaw(amountX),
                                computeRaw(amountY),
                            ],
                            typeArguments: [typeArg],
                        })
                        break
                    }
                    default: {
                        data = await swrMutation.trigger({
                            function: buildAptosFQN({
                                network,
                                moduleName: "router",
                                functionNameOrResourceType: "create_pair_with_dual_coins",
                            }),
                            functionArguments: [computeRaw(amountX), computeRaw(amountY)],
                            typeArguments: [tokenX, tokenY],
                        })
                        break
                    }
                    }
                    addTxToast({ txHash: data.hash, network })
                    break
                }
                default:
                    throw new Error("Unsupported chain")
                }  
            } catch (error) {
                addErrorToast(error as Error)
            }
        },
    })
    return formik
}
