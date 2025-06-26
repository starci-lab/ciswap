import React from "react"
import { ConnectWalletsModal } from "./ConnectWalletsModal"
import { SelectChainModal } from "./SelectChainModal"

const Modals = () => {
    return (
        <div>
            <ConnectWalletsModal />
            <SelectChainModal />
        </div>
    )
}   

export default Modals