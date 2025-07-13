import { APTOS_COIN_ADDRESS } from "@/constants"
import { Network } from "@/types"

// smart router is the module to define best pool route
export interface QuoteBestRouteParams {
  tokenXAddress: string;
  tokenYAddress: string;
  amount: string;
  xForY: boolean;
  network: Network;
}

export const quoteBestRoute = async ({
    tokenXAddress,
    tokenYAddress,
}: QuoteBestRouteParams) => {
    const APTOS_ADDRESS = APTOS_COIN_ADDRESS
    const USDC_ADDRESS = "0xdb941eb2ea04d875a05c07b20f2584473276a86ada1a5f7fc8c7a54c0f2c4767"
    const USDT_ADDRESS = "0x86ba8bdfef29fd502f883614e5964290e074393e92e774c8dd144ec3c28f444f"
    const SCALLOP_ADDRESS = "0xffbd7560161ea26468a482555669eec1f28f7fb1d985aa44e0a58413b267ce78"
    // scallop & apt
    if (
        tokenXAddress === APTOS_ADDRESS && 
        tokenYAddress === SCALLOP_ADDRESS
        ||
        tokenYAddress === SCALLOP_ADDRESS &&
        tokenXAddress === APTOS_ADDRESS
    ) {
        return [0]
    }
    // usdc & usdt
    if (
        tokenXAddress === USDC_ADDRESS &&
        tokenYAddress === USDT_ADDRESS
    ) {
        return [1]
    }
    // usdc & scallop   
    if (
        tokenXAddress === USDC_ADDRESS &&
        tokenYAddress === SCALLOP_ADDRESS
    ) {
        return [2]
    }
    // usdt & apt
    if (
        tokenXAddress === USDT_ADDRESS &&
        tokenYAddress === APTOS_ADDRESS
    ) {
        return [3]
    }
}
