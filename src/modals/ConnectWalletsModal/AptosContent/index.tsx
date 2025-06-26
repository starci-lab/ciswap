import { setSelectedPlatform, useAppDispatch } from "@/redux"
import {
    Button,
    Card,
    CardBody,
    Image,
    ModalBody,
    ModalFooter,
} from "@heroui/react"
import React from "react"
import { ModalHeaderWithBack } from "@/components"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

export const AptosContent = () => {
    const dispatch = useAppDispatch()
    const { wallets, connect, disconnect, wallet: selectedWallet } = useWallet()
    return (
        <>
            <ModalHeaderWithBack
                title="Aptos"
                onBackPress={() => dispatch(setSelectedPlatform())}
            />
            <ModalBody>
                <div className="grid grid-cols-2 gap-2">
                    {wallets.map((wallet) => (
                        <Card
                            key={wallet.name}
                            isDisabled={!!selectedWallet?.name}
                            isPressable={!selectedWallet?.name}
                            onPress={() => connect(wallet.name)}
                        >
                            <CardBody>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={wallet.icon}
                                        alt={wallet.name}
                                        className="w-10 h-10"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <div>{wallet.name}</div>
                                        {selectedWallet?.name === wallet.name && (
                                            <div className="text-sm text-success">Connected</div>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    fullWidth
                    color="danger"
                    isDisabled={!selectedWallet?.name}
                    onPress={() => disconnect()}
                >
          Disconnect
                </Button>
            </ModalFooter>
        </>
    )
}
