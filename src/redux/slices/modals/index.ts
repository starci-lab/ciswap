import { combineReducers } from "@reduxjs/toolkit"
import { connectWalletModalReducer } from "./connect-wallet-modal"
import { selectTokenModalReducer } from "./select-token-modal"

// export all the modals
export * from "./connect-wallet-modal"
export * from "./select-token-modal"

// combine all the modals
const modalReducer = combineReducers({
    connectWalletModal: connectWalletModalReducer,
    selectTokenModal: selectTokenModalReducer,
})

export { modalReducer }