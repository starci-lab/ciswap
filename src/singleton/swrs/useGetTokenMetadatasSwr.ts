import { setTokenMetadatas, useAppDispatch, useAppSelector } from "@/redux"
import { getTokenMetadatas, TokenMetadatas } from "@/modules/blockchain"
import { UseSWR } from "./types"
import useSWR from "swr"

export const useGetTokenMetadatasSwr = (): UseSWR<TokenMetadatas> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const network = useAppSelector((state) => state.chainReducer.network)
    const poolId = useAppSelector((state) => state.homeReducer.poolId)
    const dispatch = useAppDispatch()
    const swr = useSWR(["TOKEN_METADATAS", poolId], async () => {
        const tokenMetadatas = await getTokenMetadatas({ chainKey, network, poolId })
        dispatch(setTokenMetadatas(tokenMetadatas))
        return tokenMetadatas
    })

    return {
        swr,
    }
}
