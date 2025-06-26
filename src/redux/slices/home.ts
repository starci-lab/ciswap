
import { createSlice } from "@reduxjs/toolkit"

export enum HomeTab {
    Swap = "swap",
    CreatePair = "create-pair",
    Earn = "earn"
}

export interface MainSlice {
    homeTab: HomeTab
}

const initialState: MainSlice = {
    homeTab: HomeTab.Swap,
}

export const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setHomeTab: (state, action) => {
            state.homeTab = action.payload
        },
    },
})

export const homeReducer = homeSlice.reducer
export const { setHomeTab } = homeSlice.actions
