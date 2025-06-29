import React from "react"
import { cn, Image, ImageProps } from "@heroui/react"
import { QuestionIcon } from "@phosphor-icons/react"
export const TokenImage = ({ src, alt, className, ...props }: ImageProps) => {
    if (!src) return <QuestionIcon className={cn("w-10 h-10", className)} />
    return (
        <Image
            src={src}
            alt={alt}
            className={cn("w-10 h-10 rounded-full", className)}
            {...props}
        />
    )
}
