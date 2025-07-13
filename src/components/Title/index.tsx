import { Tooltip } from "@heroui/react"
import { QuestionIcon } from "@phosphor-icons/react"
import React from "react"
export interface TitleProps {
  text: string;
  tooltip?: string;
}
export const Title = ({ text, tooltip }: TitleProps) => {
    return (
        <div className="flex gap-1 items-center">
            <div className="text-sm text-secondary">{text}</div>
            {tooltip && (
                <Tooltip content={tooltip}>
                    <QuestionIcon className="text-secondary" />
                </Tooltip>
            )}
        </div>
    )
}
