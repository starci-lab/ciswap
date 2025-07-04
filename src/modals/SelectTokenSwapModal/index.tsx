import React, { useRef } from "react"
import {
    Modal,
    ModalHeader,
    ModalContent,
    useDisclosure,
    ModalBody,
    ModalFooter,
    Button,
    Autocomplete,
    AutocompleteItem,
    Alert,
} from "@heroui/react"
import {
    useSingletonHook,
    useSingletonHook2,
    useGetTokenMetadataSwrMutation,
    GET_TOKEN_METADATA_SWR_MUTATION,
    useSwapFormik,
    SWAP_FORMIK,
    SELECT_TOKEN_SWAP_MODAL,
} from "@/singleton"
import { PlatformKey, chainKeyToPlatformKey } from "@/types"
import { useAppSelector } from "@/redux"
import { SelectTokenModalKey } from "@/redux"
import { useAsyncList } from "@react-stately/data"
import { TokenMetadata } from "@/modules/blockchain"
import { TokenImage } from "@/components"

export const SelectTokenSwapModal = () => {
    const selectedChainKey = useAppSelector(
        (state) => state.chainReducer.chainKey
    )
    const tokenKey = useAppSelector(
        (state) => state.modalReducer.selectTokenSwapModal.selectedToken
    )
    const { isOpen, onOpenChange, onClose } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(SELECT_TOKEN_SWAP_MODAL)

    const warningText = {
        [PlatformKey.Aptos]:
      "For Aptos, token address is like 0x1::aptos_coin::AptosCoin",
        [PlatformKey.Solana]:
      "For Solana, token address is a base58 string like Hs1...2oFZ",
        [PlatformKey.Sui]: "For Sui, token address is like 0x2::sui::SUI",
        [PlatformKey.Evm]:
      "For Evm, token address is like 0x1234567890123456789012345678901234567890",
    }

    const formik =
    useSingletonHook2<ReturnType<typeof useSwapFormik>>(
        SWAP_FORMIK
    )

    const { swrMutation } = useSingletonHook<
    ReturnType<typeof useGetTokenMetadataSwrMutation>
  >(GET_TOKEN_METADATA_SWR_MUTATION)

    const platformKey = chainKeyToPlatformKey[selectedChainKey]

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const list = useAsyncList<TokenMetadata>({
        async load({ signal, filterText }) {
            if (!filterText) return {
                items: [],
            }
            // Clear timeout cũ nếu có
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            // Trả về một Promise để chờ debounce
            return await new Promise((resolve) => {
                timeoutRef.current = setTimeout(async () => {
                    try {
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
                }, 1000) // debounce 1 giây
            })
        },
    })

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>
          Select Token {tokenKey === SelectTokenModalKey.TokenX ? "X" : "Y"}
                </ModalHeader>
                <ModalBody>
                    <Autocomplete
                        value={
                            tokenKey === SelectTokenModalKey.TokenX
                                ? formik.values.tokenXTyped
                                : formik.values.tokenYTyped
                        }
                        onValueChange={(value) => {
                            if (tokenKey === SelectTokenModalKey.TokenX) {
                                formik.setFieldValue("tokenXTyped", value)
                            } else {
                                formik.setFieldValue("tokenYTyped", value)
                            }
                        }}
                        onInputChange={list.setFilterText}
                        labelPlacement="outside"
                        items={list.items}
                        placeholder="Search a token"
                    >
                        {list.items.map((item) => {
                            return (
                                <AutocompleteItem
                                    key={item.name}
                                    startContent={
                                        <TokenImage
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    }
                                >
                                    {item.name}
                                </AutocompleteItem>
                            )
                        })}
                    </Autocomplete>
                    <Alert color="secondary" variant="flat">
                        {warningText[platformKey]}
                    </Alert>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        fullWidth
                        onPress={() => {
                            formik.setFieldValue(
                                tokenKey === SelectTokenModalKey.TokenX ? "tokenX" : "tokenY",
                                tokenKey === SelectTokenModalKey.TokenX
                                    ? formik.values.tokenXTyped
                                    : formik.values.tokenYTyped
                            )
                            formik.setFieldValue(
                                tokenKey === SelectTokenModalKey.TokenX ? "tokenXMetadata" : "tokenYMetadata",
                                list.items[0] || null
                            )
                            onClose()
                        }}
                    >
            Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
