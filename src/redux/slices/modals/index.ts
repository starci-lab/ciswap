import { combineReducers } from "@reduxjs/toolkit"
import { connectWalletModalReducer } from "./connect-wallet-modal"

// export all the modals
export * from "./connect-wallet-modal"

// combine all the modals
const modalReducer = combineReducers({
    connectWalletModal: connectWalletModalReducer,
})

export { modalReducer }