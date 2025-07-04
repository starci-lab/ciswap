import { createSlice } from "@reduxjs/toolkit"
import { Position, SwapInfo, TokenMetadatas, TokenPairMetadata, TokenPairReserve } from "@/modules/blockchain"

export interface StateSlice {
    positions: Array<Position>
    swapInfo?: SwapInfo
    tokenPairMetadata?: TokenPairMetadata
    tokenMetadatas?: TokenMetadatas
    tokenPairReserve?: TokenPairReserve
}

const initialState: StateSlice = {
    positions: [],
}

export const stateSlice = createSlice({
    name: "state",
    initialState,
    reducers: {
        setPositions: (state, action) => {
            state.positions = action.payload
        },
        setSwapInfo: (state, action) => {
            state.swapInfo = action.payload
        },
        setTokenPairMetadata: (state, action) => {  
            state.tokenPairMetadata = action.payload
        },
        setTokenMetadatas: (state, action) => {
            state.tokenMetadatas = action.payload
        },
        setTokenPairReserve: (state, action) => {
            state.tokenPairReserve = action.payload 
        },
    },
})

export const stateReducer = stateSlice.reducer
export const {
    setPositions,
    setSwapInfo,
    setTokenPairMetadata,
    setTokenMetadatas,
    setTokenPairReserve,
} = stateSlice.actions
