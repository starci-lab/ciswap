import { useAppSelector } from "@/redux"
import { createAptosClient } from "@/modules/blockchain"
import { UseSWRMutation } from "./types"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import useSWRMutation from "swr/mutation"
import { Aptos } from "@aptos-labs/ts-sdk"

// retrieve all the types from the aptos sdk
export type AllInputData = Parameters<
  Aptos["transaction"]["build"]["simple"]
>["0"]["data"];
export type InputEntryFunctionData = Extract<
  AllInputData,
  { function: string }
>;
export type FunctionArguments = Parameters<
  Aptos["transaction"]["build"]["simple"]
>["0"]["data"]["functionArguments"];
export type Function = InputEntryFunctionData["function"];
export type TypeArguments = Parameters<
  Aptos["transaction"]["build"]["simple"]
>["0"]["data"]["typeArguments"];

export interface UseAptosMoveCallSwrMutationParams {
  function: Function;
  functionArguments: FunctionArguments;
  typeArguments: TypeArguments;
}

export interface UseAptosMoveCallSwrMutationResponse {
  hash: string;
}

export const useAptosMoveCallSwrMutation =
  (): UseSWRMutation<UseAptosMoveCallSwrMutationResponse, UseAptosMoveCallSwrMutationParams> => {
      const network = useAppSelector((state) => state.chainReducer.network)
      const { account, signAndSubmitTransaction } = useWallet()
      const swrMutation = useSWRMutation(
          "APTOS_MOVE_CALL",
          async (_, { arg }: { arg: UseAptosMoveCallSwrMutationParams }) => {
              const aptosClient = createAptosClient(network)
              const { hash } = await signAndSubmitTransaction({
                  sender: account?.address || "",
                  data: {
                      function: arg.function,
                      functionArguments: arg.functionArguments,
                      typeArguments: arg.typeArguments,
                  },
              })
              // wait for the transaction to be confirmed
              await aptosClient.waitForTransaction({ transactionHash: hash })
              return {
                  hash,
              }
          }
      )
      return {
          swrMutation,
      }
  }
