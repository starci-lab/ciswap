import { FormikProps, useFormik } from "formik"
import * as Yup from "yup" // Import Yup
import { APTOS_MOVE_CALL_SWR_MUTATION } from "../keys"
import { useSingletonHook } from "../core"
import { useAptosMoveCallSwrMutation } from "../swrs"
import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
import { computeRaw } from "@/utils"
import { addErrorToast, addTxToast } from "@/toasts"
import { useAppSelector } from "@/redux"

export interface AddLiquidityFormikValues {
  amount0: number;
  amount1: number;
  balance0: number;
  balance1: number;
  token0Address: string;
  token1Address: string;
  isToken0Legacy: boolean;
  isToken1Legacy: boolean;
}

export const useAddLiquidityFormik =
  (): FormikProps<AddLiquidityFormikValues> => {
      const { swrMutation } = useSingletonHook<
      ReturnType<typeof useAptosMoveCallSwrMutation>
    >(APTOS_MOVE_CALL_SWR_MUTATION)
      const initialValues: AddLiquidityFormikValues = {
          amount0: 100,
          amount1: 100,
          isToken0Legacy: true,
          isToken1Legacy: true,
          balance0: 0,
          balance1: 0,
          token0Address: "",
          token1Address: "",
      }
      // Yup validation schema
      const validationSchema = Yup.object({
          balance0: Yup.number()
              .required("Balance is required")
              .positive("Balance must be greater than 0"),
          amount0: Yup.number()
              .required("Amount is required")
              .test("lte-balance0", "Amount exceeds balance", function (value) {
                  return value === undefined || value <= this.parent.balance0
              }),
          balance1: Yup.number()
              .required("Balance is required")
              .positive("Balance must be greater than 0"),
          amount1: Yup.number()
              .required("Amount is required")
              .test("lte-balance1", "Amount exceeds balance", function (value) {
                  return value === undefined || value <= this.parent.balance1
              })
      })
      const network = useAppSelector((state) => state.chainReducer.network)
      const poolId = useAppSelector((state) => state.homeReducer.poolId)
      const formik = useFormik({
          initialValues,
          validationSchema, // Pass Yup validation schema directly
          onSubmit: async ({ amount0, amount1 }) => {
              try {
                  // onpen the sign transaction moda
                  const data = await swrMutation.trigger({
                      function: `${APTOS_SWAP_RESOURCE_ACCOUNT}::router::add_liquidity`,
                      functionArguments: [
                          poolId,
                          computeRaw(amount0),
                          computeRaw(amount1),
                      ],
                      typeArguments: [],
                  })
                  addTxToast({ txHash: data.hash, network })
              } catch (error) {
                  addErrorToast(error as Error)
              }
          },
      })

      return formik
  }
