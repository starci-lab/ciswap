/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react"
import {
    BaseSingletonHook2Context,
    BaseSingletonHook3Context,
    BaseSingletonHookContext,
} from "./Provider"

export type HookReturnType = any;
export type HookReturnMap = Record<string, HookReturnType>;
export type HookFn<HRT extends HookReturnType = any> = (
  ...params: Array<any>
) => HRT;
export const useSingletonHook = <HRT extends HookReturnType>(
    name: string
): HRT => {
    const { singletonHookRegistry } = useContext(BaseSingletonHookContext)!
    return singletonHookRegistry[name]
}

export const useSingletonHook2 = <HRT extends HookReturnType>(
    name: string
): HRT => {
    const { singletonHookRegistry } = useContext(BaseSingletonHook2Context)!
    return singletonHookRegistry[name]
}

export const useSingletonHook3 = <HRT extends HookReturnType>(
    name: string
): HRT => {
    const { singletonHookRegistry } = useContext(BaseSingletonHook3Context)!
    return singletonHookRegistry[name]
}
