import { combineReducers } from "@reduxjs/toolkit"
import { connectWalletModalReducer } from "./connect-wallet-modal"
import { selectTokenModalReducer } from "./select-token-modal"
import { selectTokenAddLiquidityModalReducer } from "./select-token-add-liqudity-modal"
import { selectTokenSwapModalReducer } from "./select-token-swap-modal"

// export all the modals
export * from "./connect-wallet-modal"
export * from "./select-token-modal"
export * from "./select-token-add-liqudity-modal"
export * from "./select-token-swap-modal"
export * from "./types"

// combine all the modals
const modalReducer = combineReducers({
    connectWalletModal: connectWalletModalReducer,
    selectTokenModal: selectTokenModalReducer,
    selectTokenAddLiquidityModal: selectTokenAddLiquidityModalReducer,
    selectTokenSwapModal: selectTokenSwapModalReducer,
})

export { modalReducer }