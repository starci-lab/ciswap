import { Button, ModalHeader } from "@heroui/react"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import React from "react"

export interface ModalHeaderWithBackProps {
  title: string;
  onBackPress: () => void;
}
export const ModalHeaderWithBack = ({
    title,
    onBackPress,
}: ModalHeaderWithBackProps) => {
    return (
        <ModalHeader>
            <div className="flex items-center gap-2">
                <Button variant="light" isIconOnly onPress={onBackPress}>
                    <ArrowLeftIcon />
                </Button>
                <div>{title}</div>
            </div>
        </ModalHeader>
    )
}
