import React, { PropsWithChildren } from "react"
import { BaseSingletonHook2Provider } from "../../core"
import { useCreatePairFormik } from "../../formiks"
import { CREATE_PAIR_FORMIK } from "../../keys/formiks"

export const SingletonHook2Provider = ({ children }: PropsWithChildren) => (
    <BaseSingletonHook2Provider
        hooks={{
            // disclosures
            [CREATE_PAIR_FORMIK]: useCreatePairFormik(),
        }}
    >
        {children}
    </BaseSingletonHook2Provider>
)