import React from "react"
export interface TitleProps {
    text: string
}
export const Title = ({ text }: TitleProps) => {
    return <div className="text-sm text-secondary">{text}</div>
}