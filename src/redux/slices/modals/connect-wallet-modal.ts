
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { PlatformKey } from "@/types"

export interface ConnectWalletModalSlice {
  selectedPlatform?: PlatformKey;
}

const initialState: ConnectWalletModalSlice = {}

export const connectWalletModalSlice = createSlice({
    name: "connectWalletModal",
    initialState,
    reducers: {
        setSelectedPlatform: (
            state,
            action: PayloadAction<PlatformKey | undefined>
        ) => {
            state.selectedPlatform = action.payload
        },
    },
})

export const connectWalletModalReducer =
  connectWalletModalSlice.reducer
export const {
    setSelectedPlatform,
} = connectWalletModalSlice.actions
