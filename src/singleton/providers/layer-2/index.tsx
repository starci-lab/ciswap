import React, { PropsWithChildren } from "react"
import { BaseSingletonHook2Provider } from "../../core"
import { useAddLiquidityFormik, useCreatePairFormik, useCreateTokenFormik, useSwapFormik } from "../../formiks"
import { ADD_LIQUIDITY_FORMIK, CREATE_PAIR_FORMIK, CREATE_TOKEN_FORMIK, SWAP_FORMIK } from "../../keys"

export const SingletonHook2Provider = ({ children }: PropsWithChildren) => (
    <BaseSingletonHook2Provider
        hooks={{
            // disclosures
            [CREATE_PAIR_FORMIK]: useCreatePairFormik(),
            [ADD_LIQUIDITY_FORMIK]: useAddLiquidityFormik(),
            [SWAP_FORMIK]: useSwapFormik(),
            [CREATE_TOKEN_FORMIK]: useCreateTokenFormik(),
        }}
    >
        {children}
    </BaseSingletonHook2Provider>
)