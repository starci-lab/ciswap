import { addToast } from "@heroui/react"

export const addErrorToast = (error: Error) => {
    return addToast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "flat",
        color: "danger",
    })
}
