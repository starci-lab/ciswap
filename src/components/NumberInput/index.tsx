import React from "react"
import { Input, InputProps } from "@heroui/react"
import { sanitizeNumericInput } from "@/utils"

export const NumberInput = (props: InputProps) => {
    const onValueChange = (value: string) => {
        const sanitizeInput = sanitizeNumericInput(value)
        if (sanitizeInput != null) {
            props.onValueChange?.(sanitizeInput)
        }
    }

    return (
        <Input
            {...props}
            onValueChange={onValueChange}
        />
    )
}