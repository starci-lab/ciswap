import React from "react"
import { ConnectWalletsModal } from "./ConnectWalletsModal"
import { SelectChainModal } from "./SelectChainModal"
import { SelectTokenModal } from "./SelectTokenModal"

const Modals = () => {
    return (
        <div>
            <ConnectWalletsModal />
            <SelectChainModal />
            <SelectTokenModal />
        </div>
    )
}   

export default Modals