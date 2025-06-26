
import React from "react"
import { Divider, ScrollShadow  , cn } from "@heroui/react"
export interface ListProps<TItem extends string | object> {
  items: Array<TItem>;
  contentCallback: (item: TItem) => React.ReactNode;
  enableScroll?: boolean;
  vertical?: boolean;
  emptyMessage?: string;
  showSeparator?: boolean;
  classNames?: {
    container?: string;
  }
}

export const List = <TItem extends string | object>({
    items,
    contentCallback,
    enableScroll = true,
    emptyMessage = "No items found",
    vertical = false,
    showSeparator = true,
    classNames = {},
}: ListProps<TItem>) => {
    const content = (<div className={cn("overflow-hidden flex flex-col rounded-lg", classNames?.container)}>
        {items.map((item, index) => {
            const last = index === items.length - 1
            return (
                <React.Fragment key={index}>
                    {contentCallback(item)}
                    {!last && showSeparator && <Divider />}
                </React.Fragment>
            )
        })}
    </div>)
    return (
        <div className="border rounded-medium overflow-hidden">  
            {
                items.length > 0 ? (
                    enableScroll ? (
                        <ScrollShadow className={cn("h-[300px] relative -top-4 -left-4 p-4 w-[calc(100%+32px)]", vertical ? "flex flex-col h-fit" : "")}>
                            {content}
                        </ScrollShadow>
                    ) : (
                        content
                    )
                ) : (
                    <div className="text-muted-foreground">{emptyMessage}</div>
                )
            }
        </div>
    )
}
