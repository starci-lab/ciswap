import { configureStore } from "@reduxjs/toolkit"
import { chainReducer, homeReducer, modalReducer } from "./slices"
export const store = configureStore({
    reducer: {
        homeReducer,
        modalReducer,
        chainReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;