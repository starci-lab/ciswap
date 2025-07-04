import { configureStore } from "@reduxjs/toolkit"
import { chainReducer, homeReducer, modalReducer, stateReducer } from "./slices"
export const store = configureStore({
    reducer: {
        homeReducer,
        modalReducer,
        chainReducer,
        stateReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;