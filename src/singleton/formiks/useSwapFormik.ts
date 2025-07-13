
import { TokenMetadata } from "@/modules/blockchain"
import { FormikProps, useFormik } from "formik"
import * as Yup from "yup" // Import Yup
import { APTOS_MOVE_CALL_SWR_MUTATION } from "../keys"
import { useSingletonHook } from "../core"
import { useAptosMoveCallSwrMutation } from "../swrs"
import { buildAptosFQN } from "@/config"
import { computeRaw } from "@/utils"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { addErrorToast, addTxToast } from "@/toasts"
import { useAppSelector } from "@/redux"
import { chainKeyToPlatformKey, PlatformKey } from "@/types"

export interface SwapFormikValues {
    tokenX: string
    tokenY: string
    tokenXMetadata?: TokenMetadata
    tokenYMetadata?: TokenMetadata
    expectedAmountOut: number
    expectedAmountDebtOut: number
    zeroForOne: boolean
    amountOutLoaded: boolean
    amountInString: string
    balanceIn: number
}

export const useSwapFormik = (): FormikProps<SwapFormikValues> => {
    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useAptosMoveCallSwrMutation>
  >(APTOS_MOVE_CALL_SWR_MUTATION)
    const initialValues: SwapFormikValues = {
        tokenX: "",
        tokenY: "",
        amountInString: "",
        expectedAmountOut: 0,
        expectedAmountDebtOut: 0,
        zeroForOne: true,
        amountOutLoaded: false,
        balanceIn: 0,
    }
    // Yup validation schema
    const validationSchema = Yup.object({
        tokenX: Yup.string().required("Token X is required"),
        tokenY: Yup.string().required("Token Y is required"),
        amountInString: Yup.string().required("Amount in is required"),
    })

    const { account } = useWallet()
    const network = useAppSelector(state => state.chainReducer.network)
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const formik = useFormik({
        initialValues,
        validationSchema, // Pass Yup validation schema directly
        onSubmit: async ({ amountInString, zeroForOne }) => {
            try {
            // onpen the sign transaction moda
                switch (chainKeyToPlatformKey[chainKey]) {
                case PlatformKey.Aptos: {
                    const data = await swrMutation.trigger({
                        function: buildAptosFQN({
                            network,
                            moduleName: "router",
                            functionNameOrResourceType: "swap",
                        }),
                        functionArguments: [
                            0, // use pool 0, tech debt, will change later if smart router is implemented
                            computeRaw(Number.parseFloat(amountInString ?? "0")), 
                            zeroForOne,
                            account?.address,
                            0,
                            0
                        ],
                        typeArguments: [],
                    })
                    addTxToast({
                        txHash: data.hash,
                        network
                    })
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
