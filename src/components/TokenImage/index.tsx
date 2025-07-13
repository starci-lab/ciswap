import React from "react"
import { cn, Image } from "@heroui/react"
import { QuestionIcon } from "@phosphor-icons/react"
import { HeroUITheme } from "@/types"

export interface TokenImageProps {
    iconUrls?: Partial<Record<HeroUITheme, string>> 
    theme: HeroUITheme
    className?: string
}
export const TokenImage = ({
    iconUrls,
    theme,
    className,
}: TokenImageProps) => {
    if (iconUrls?.[theme]) {
        return (
            <Image
                src={iconUrls[theme]}
                className={cn("w-10 h-10 rounded-full", className)}
            />
        )
    }
    return <QuestionIcon className={cn("w-10 h-10", className)} />
}
