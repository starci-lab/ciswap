import { useAppDispatch, useAppSelector } from "@/redux"
import { getPositions, GetPositionsResponse } from "@/modules/blockchain"
import { UseSWR } from "./types"
import useSWR from "swr"
import { useActiveAddress } from "@/hooks"
import { setPositions } from "@/redux"

export const useGetPositionsSwr = (): UseSWR<
  GetPositionsResponse
> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const accountAddress = useActiveAddress()
    const poolId = useAppSelector((state) => state.homeReducer.poolId)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        accountAddress ? [
            "POSITIONS", 
            accountAddress, 
            poolId
        ] : null,
        async () => {
            if (!accountAddress) {
                throw new Error("Account address is required")
            }
            const positions = await getPositions({
                chainKey,
                poolId,
                accountAddress,
            })
            dispatch(setPositions(positions.positions))
            return positions    
        }
    )
    console.log("render positions")
    return {
        swr,
    }
}
