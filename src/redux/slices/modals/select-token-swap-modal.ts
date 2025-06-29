
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SelectTokenModalKey } from "./types"

export interface SelectTokenSwapModalSlice {
  selectedToken?: SelectTokenModalKey;
}

const initialState: SelectTokenSwapModalSlice = {}

export const selectTokenSwapModalSlice = createSlice({
    name: "selectTokenSwapModal",
    initialState,
    reducers: {
        setSelectedTokenSwap: (
            state,
            action: PayloadAction<SelectTokenModalKey | undefined>
        ) => {
            state.selectedToken = action.payload
        },
    },
})

export const selectTokenSwapModalReducer =
  selectTokenSwapModalSlice.reducer
export const {
    setSelectedTokenSwap,
} = selectTokenSwapModalSlice.actions
