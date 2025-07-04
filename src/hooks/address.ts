import { useAppSelector } from "@/redux"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { chainKeyToPlatformKey, PlatformKey } from "@/types"

export const useActiveAddress = () => {
    const { account } = useWallet()
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    switch (chainKeyToPlatformKey[chainKey]) {
    case PlatformKey.Aptos:
        return account?.address.toString()
    default:
        return ""
    }
}