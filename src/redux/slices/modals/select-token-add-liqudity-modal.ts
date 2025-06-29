
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SelectTokenModalKey } from "./types"


export interface SelectTokenAddLiquidityModalSlice {
  selectedToken?: SelectTokenModalKey;
}

const initialState: SelectTokenAddLiquidityModalSlice = {}

export const selectTokenAddLiquidityModalSlice = createSlice({
    name: "selectTokenAddLiquidityModal",
    initialState,
    reducers: {
        setSelectedTokenAddLiquidity: (
            state,
            action: PayloadAction<SelectTokenModalKey | undefined>
        ) => {
            state.selectedToken = action.payload
        },
    },
})

export const selectTokenAddLiquidityModalReducer =
  selectTokenAddLiquidityModalSlice.reducer
export const {
    setSelectedTokenAddLiquidity,
} = selectTokenAddLiquidityModalSlice.actions
