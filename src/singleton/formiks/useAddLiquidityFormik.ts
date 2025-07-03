import { FormikProps, useFormik } from "formik"
import * as Yup from "yup" // Import Yup
import { APTOS_MOVE_CALL_SWR_MUTATION, GET_TOKEN_BALANCE_SWR } from "../keys"
import { useSingletonHook } from "../core"
import { useAptosMoveCallSwrMutation, useGetBalanceSwrMutation } from "../swrs"
import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
import { computeRaw } from "@/utils"
import { addErrorToast, addTxToast } from "@/toasts"
import { useAppSelector } from "@/redux"
import { GET_POOL_INFO_SWR } from "../keys"
import { useGetPoolInfoSwr } from "../swrs"
import { useEffect } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

export interface AddLiquidityFormikValues {
  amount0: number;
  amount1: number;
  balance0: number;
  balance1: number;
  token0Address: string;
  token1Address: string;
  isToken0Legacy: boolean;
  isToken1Legacy: boolean;
  poolId?: number;
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
              }),
          poolId: Yup.number().required("Pool id is required"),
      })
      const network = useAppSelector((state) => state.chainReducer.network)

      const { swrMutation: getPoolInfoSwrMutation } =
      useSingletonHook<ReturnType<typeof useGetPoolInfoSwr>>(GET_POOL_INFO_SWR)

      const { swrMutation: getBalanceSwrMutation } = useSingletonHook<
      ReturnType<typeof useGetBalanceSwrMutation>
    >(GET_TOKEN_BALANCE_SWR)

      const { account } = useWallet()

      const formik = useFormik({
          initialValues,
          validationSchema, // Pass Yup validation schema directly
          onSubmit: async ({ amount0, amount1, poolId }) => {
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

      useEffect(() => {
          if (formik.values.poolId === undefined) { 
              return
          }
          const handleEffect = async () => {
              await getPoolInfoSwrMutation.trigger({
                  poolId: formik.values.poolId as number,
              })
          }
          handleEffect()
      }, [formik.values.poolId])

      useEffect(() => {
          if (formik.values.token0Address && account?.address) {
              const handleEffect = async () => {
                  const { balance } = await getBalanceSwrMutation.trigger({
                      tokenAddress: formik.values.token0Address,
                      accountAddress: account?.address.toString(),
                      isTypeTag: formik.values.isToken0Legacy,
                  })
                  formik.setFieldValue("balance0", balance)
              }
              handleEffect()
          }
      }, [formik.values.token0Address])

      useEffect(() => {
          if (formik.values.token1Address && account?.address) {
              const handleEffect = async () => {
                  const { balance } = await getBalanceSwrMutation.trigger({
                      tokenAddress: formik.values.token1Address,
                      accountAddress: account?.address.toString(),
                      isTypeTag: formik.values.isToken1Legacy,
                  })
                  formik.setFieldValue("balance1", balance)
              }
              handleEffect()
          }
      }, [formik.values.token1Address])

      return formik
  }
