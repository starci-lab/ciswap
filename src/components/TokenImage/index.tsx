import React from "react"
import { cn, Image, ImageProps } from "@heroui/react"
import { QuestionIcon } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

export interface TokenImageProps extends ImageProps {
  isAptos?: boolean;
}
export const TokenImage = ({
    src,
    alt,
    className,
    isAptos = false,
    ...props
}: TokenImageProps) => {
    const { theme } = useTheme()
    if (isAptos) {
        return (
            <Image
                src={theme === "dark" ? "/aptos-dark.svg" : "/aptos-light.svg"}
                alt={alt}
                className={cn("w-10 h-10 rounded-full", className)}
                {...props}
            />
        )
    }
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
