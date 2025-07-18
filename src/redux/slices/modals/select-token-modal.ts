
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SelectTokenModalKey } from "./types"

export interface SelectTokenModalSlice {
  selectedToken?: SelectTokenModalKey;
}

const initialState: SelectTokenModalSlice = {}

export const selectTokenModalSlice = createSlice({
    name: "selectTokenModal",
    initialState,
    reducers: {
        setSelectedToken: (
            state,
            action: PayloadAction<SelectTokenModalKey | undefined>
        ) => {
            state.selectedToken = action.payload
        },
    },
})

export const selectTokenModalReducer =
  selectTokenModalSlice.reducer
export const {
    setSelectedToken,
} = selectTokenModalSlice.actions
