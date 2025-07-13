import { FormikProps, useFormik } from "formik"
import * as Yup from "yup" // Import Yup
import { addErrorToast, addTxToast } from "@/toasts"
import { useAppSelector } from "@/redux"
import { AptosFQNModule, buildAptosFQN } from "@/config"
import { chainKeyToPlatformKey, PlatformKey } from "@/types"
import { useSingletonHook } from "../core"
import { APTOS_MOVE_CALL_SWR_MUTATION } from "../keys"
import { useAptosMoveCallSwrMutation } from "../swrs"
import { useActiveAddress } from "@/hooks"
import { v4 } from "uuid"
import { computeRaw } from "@/utils"

export interface CreateTokenFormikValues {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  iconUri: string;
  projectUri: string;
}

export const useCreateTokenFormik =
  (): FormikProps<CreateTokenFormikValues> => {
      const { swrMutation } = useSingletonHook<
        ReturnType<typeof useAptosMoveCallSwrMutation>
      >(APTOS_MOVE_CALL_SWR_MUTATION)

      const initialValues: CreateTokenFormikValues = {
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
          totalSupply: 1000000000,
          iconUri: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042194",
          projectUri: "https://www.circle.com/usdc",
      }
      // Yup validation schema
      const validationSchema = Yup.object({
          name: Yup.string().required("Name is required"),
          symbol: Yup.string().required("Symbol is required"),
          decimals: Yup.number().required("Decimals is required"),
          totalSupply: Yup.number().required("Total supply is required"),
          iconUri: Yup.string().required("Image URL is required"),
          projectUri: Yup.string().required("Project ID is required"),
      })
      const accountAddress = useActiveAddress()
      const network = useAppSelector((state) => state.chainReducer.network)
      const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
      const formik = useFormik({
          initialValues,
          validationSchema, // Pass Yup validation schema directly
          onSubmit: async ({ name, symbol, decimals, totalSupply, iconUri, projectUri }) => {
              try {
                  switch (chainKeyToPlatformKey[chainKey]) {
                  case PlatformKey.Aptos: {
                      // onpen the sign transaction moda
                      const data = await swrMutation.trigger({
                          function: buildAptosFQN({
                              functionNameOrResourceType: "create_then_mint",
                              moduleName: "core",
                              module: AptosFQNModule.FaFactory
                          }),
                          functionArguments: [
                              v4(),
                              name,
                              symbol,
                              decimals,
                              computeRaw(totalSupply, decimals),
                              iconUri,
                              projectUri,
                              accountAddress,
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
