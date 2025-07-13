import React, { useRef } from "react"
import {
    Modal,
    ModalHeader,
    ModalContent,
    useDisclosure,
    ModalBody,
    Input,
    Spacer,
} from "@heroui/react"
import {
    useSingletonHook,
    SELECT_TOKEN_MODAL,
    useSingletonHook2,
    useGetTokenMetadataSwrMutation,
    GET_TOKEN_METADATA_SWR_MUTATION,
} from "@/singleton"
import { useAppSelector } from "@/redux"
import { CREATE_PAIR_FORMIK, useCreatePairFormik } from "@/singleton"
import { SelectTokenModalKey } from "@/redux"
import { useAsyncList } from "@react-stately/data"
import { TokenMetadata } from "@/modules/blockchain"
import { tokenMap } from "@/config"
import { TokenSelect } from "@/components/TokenSelect"
import { useTheme } from "next-themes"
import { getHeroUITheme } from "@/utils"

export const SelectTokenModal = () => {
    const tokenKey = useAppSelector(
        (state) => state.modalReducer.selectTokenModal.selectedToken
    )
    const { isOpen, onOpenChange, onClose } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(SELECT_TOKEN_MODAL)
    const formik =
    useSingletonHook2<ReturnType<typeof useCreatePairFormik>>(
        CREATE_PAIR_FORMIK
    )
    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useGetTokenMetadataSwrMutation>
  >(GET_TOKEN_METADATA_SWR_MUTATION)
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const network = useAppSelector((state) => state.chainReducer.network)
    const { theme } = useTheme()
    const _theme = getHeroUITheme(theme)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const list = useAsyncList<TokenMetadata>({
        async load({ signal, filterText }) {
            if (!filterText) filterText = ""
            // Clear old timeout if exists
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            // Return a Promise to wait for debounce
            return await new Promise((resolve) => {
                timeoutRef.current = setTimeout(async () => {
                    try {
                        const items = tokenMap[chainKey][network]
                        const filteredResults = items
                            .filter((token) => {
                                return (
                                    token.name.toLowerCase().includes(filterText.toLowerCase()) ||
                  token.symbol
                      .toLowerCase()
                      .includes(filterText.toLowerCase()) ||
                  (filterText.length > 5 &&
                    token.address
                        .toLowerCase()
                        .includes(filterText.toLowerCase()))
                                )
                            })
                            // .filter(
                            //     (token) =>
                            //         token.address !== formik.values.tokenX &&
                            //         token.address !== formik.values.tokenY
                            // )
                            
                        if (filteredResults.length > 0) {
                            resolve({
                                items: filteredResults,
                            })
                            return
                        }
                        const data = await swrMutation.trigger({
                            tokenAddress: filterText || "",
                            signal,
                        })
                        resolve({
                            items: data ? [data] : [],
                        })
                    } catch (error) {
                        console.error(error)
                        resolve({
                            items: [],
                        })
                    }
                }, 500) // debounce 1 second
            })
        },
    })
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Select Token</ModalHeader>
                <ModalBody>
                    <div>
                        <Input
                            value={list.filterText}
                            onValueChange={(value) => {
                                list.setFilterText(value)
                            }}
                            labelPlacement="outside"
                            placeholder="Search name / address"
                        />
                        <Spacer y={4} />
                        <div>
                            <div className="flex flex-col gap-2">
                                {list.items.map((item) => {
                                    return (
                                        <TokenSelect
                                            key={item.address}
                                            metadata={item}
                                            theme={_theme}
                                            onPress={() => {
                                                formik.setFieldValue(
                                                    tokenKey === SelectTokenModalKey.TokenX
                                                        ? "tokenX"
                                                        : "tokenY",
                                                    item.address
                                                )
                                                formik.setFieldValue(
                                                    tokenKey === SelectTokenModalKey.TokenX
                                                        ? "tokenXMetadata"
                                                        : "tokenYMetadata",
                                                    item
                                                )
                                                onClose()
                                            }}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
