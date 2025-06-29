import { useAppSelector } from "@/redux"
import { getPoolMetadata, GetPoolMetadataParams, PoolMetadata } from "@/modules/blockchain"
import { UseSWR } from "./types"
import useSWR from "swr"


export const useGetPoolMetadataSwr =
  (): UseSWR<PoolMetadata, GetPoolMetadataParams> => {
      const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
      const network = useAppSelector((state) => state.chainReducer.network)
      const swr = useSWR(
          "GET_POOL_METADATA",
          async () => getPoolMetadata({ chainKey, network })
      )
      return {
          swr,
      }
  }
