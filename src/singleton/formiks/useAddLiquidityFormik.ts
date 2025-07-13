import { FormikProps, useFormik } from "formik"
import * as Yup from "yup" // Import Yup
import { APTOS_MOVE_CALL_SWR_MUTATION } from "../keys"
import { useSingletonHook } from "../core"
import { useAptosMoveCallSwrMutation } from "../swrs"
import { computeRaw } from "@/utils"
import { addErrorToast, addTxToast } from "@/toasts"
import { useAppSelector } from "@/redux"
import { buildAptosFQN } from "@/config"
import { chainKeyToPlatformKey, PlatformKey } from "@/types"

export interface AddLiquidityFormikValues {
  amountX: number;
  amountY: number;
  balanceX: number;
  balanceY: number;
  tokenXAddress: string;
  tokenYAddress: string;
}

export const useAddLiquidityFormik =
  (): FormikProps<AddLiquidityFormikValues> => {
      const { swrMutation } = useSingletonHook<
      ReturnType<typeof useAptosMoveCallSwrMutation>
    >(APTOS_MOVE_CALL_SWR_MUTATION)
      const initialValues: AddLiquidityFormikValues = {
          amountX: 100,
          amountY: 100,
          balanceX: 0,
          balanceY: 0,
          tokenXAddress: "",
          tokenYAddress: "",
      }
      // Yup validation schema
      const validationSchema = Yup.object({
          balanceX: Yup.number()
              .required("Balance is required")
              .positive("Balance must be greater than 0"),
          amountX: Yup.number()
              .required("Amount is required")
              .test("lte-balanceX", "Amount exceeds balance", function (value) {
                  return value === undefined || value <= this.parent.balanceX
              }),
          balanceY: Yup.number()
              .required("Balance is required")
              .positive("Balance must be greater than 0"),
          amountY: Yup.number()
              .required("Amount is required")
              .test("lte-balanceY", "Amount exceeds balance", function (value) {
                  return value === undefined || value <= this.parent.balanceY
              })
      })
      const network = useAppSelector((state) => state.chainReducer.network)
      const poolId = useAppSelector((state) => state.homeReducer.poolId)
      const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
      const formik = useFormik({
          initialValues,
          validationSchema, // Pass Yup validation schema directly
          onSubmit: async ({ amountX, amountY }) => {
              try {
                  switch (chainKeyToPlatformKey[chainKey]) {
                  case PlatformKey.Aptos: {
                      // onpen the sign transaction moda
                      const data = await swrMutation.trigger({
                          function: buildAptosFQN({
                              network,
                              moduleName: "router",
                              functionNameOrResourceType: "add_liquidity",
                          }),
                          functionArguments: [
                              poolId,
                              computeRaw(amountX,),
                              computeRaw(amountY),
                          ],
                          typeArguments: [],
                      })
                      addTxToast({ txHash: data.hash, network })
                  }
                      break
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
