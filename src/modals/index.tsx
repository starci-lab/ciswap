import React from "react"
import { ConnectWalletsModal } from "./ConnectWalletsModal"
import { SelectChainModal } from "./SelectChainModal"
import { SelectTokenModal } from "./SelectTokenModal"
import { SelectTokenSwapModal } from "./SelectTokenSwapModal"
import { MobileMenuModal } from "./MobileMenuModal"

const Modals = () => {
    return (
        <div>
            <ConnectWalletsModal />
            <SelectChainModal />
            <SelectTokenModal />
            <SelectTokenSwapModal />
            <MobileMenuModal />
        </div>
    )
}   

export default Modals

export * from "./MobileMenuModal"