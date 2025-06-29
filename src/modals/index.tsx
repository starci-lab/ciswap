import React from "react"
import { ConnectWalletsModal } from "./ConnectWalletsModal"
import { SelectChainModal } from "./SelectChainModal"
import { SelectTokenModal } from "./SelectTokenModal"
import { SelectTokenAddLiquidityModal } from "./SelectTokenAddLiqudityModal"
import { SelectTokenSwapModal } from "./SelectTokenSwapModal"

const Modals = () => {
    return (
        <div>
            <ConnectWalletsModal />
            <SelectChainModal />
            <SelectTokenAddLiquidityModal />
            <SelectTokenModal />
            <SelectTokenSwapModal />
        </div>
    )
}   

export default Modals