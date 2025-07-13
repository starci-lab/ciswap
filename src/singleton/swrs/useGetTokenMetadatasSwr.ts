import { setTokenMetadatas, useAppDispatch, useAppSelector } from "@/redux"
import { getTokenMetadatas, TokenMetadatas } from "@/modules/blockchain"
import { UseSWR } from "./types"
import useSWR from "swr"
import { useEffect } from "react"

export const useGetTokenMetadatasSwr = (): UseSWR<TokenMetadatas> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const network = useAppSelector((state) => state.chainReducer.network)
    const poolId = useAppSelector((state) => state.homeReducer.poolId)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        ["TOKEN_METADATAS", poolId, chainKey, network],
        async () => {
            const tokenMetadatas = await getTokenMetadatas({
                chainKey,
                network,
                poolId,
            })
            return tokenMetadatas
        }
    )
    useEffect(() => {
        if (swr.data) {
            dispatch(setTokenMetadatas(swr.data))
        }
    }, [swr.data])

    return {
        swr,
    }
}
