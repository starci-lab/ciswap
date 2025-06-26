import { ChainKey, Network } from "@/types"
import { createSlice } from "@reduxjs/toolkit"


export interface ChainSlice {
    chainKey: ChainKey
    network: Network
}

const initialState: ChainSlice = {
    chainKey: ChainKey.Aptos,
    network: Network.Testnet,
}

export const chainSlice = createSlice({
    name: "chain",
    initialState,
    reducers: {
        setChainKey: (state, action) => {
            state.chainKey = action.payload
        },
        setNetwork: (state, action) => {
            state.network = action.payload
        },
    },
})

export const chainReducer = chainSlice.reducer
export const { setChainKey } = chainSlice.actions
