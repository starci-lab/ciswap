import { addToast } from "@heroui/react"

export const addErrorToast = (error: Error) => {
    return addToast({
        title: "Error",
        description: error.message,
        variant: "flat",
        color: "danger",
    })
}
