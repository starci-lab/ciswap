
import numeral from "numeral"
import dayjs from "dayjs"

export const NUMBER_PATTERN_1 = "0.00000a"
export const NUMBER_PATTERN_2 = "0.0a"

export enum NumberPattern {
  First = NUMBER_PATTERN_1,
  Second = NUMBER_PATTERN_2,
}

export const formatNumber = (
    value: number,
    pattern: NumberPattern = NumberPattern.First
) => {
    return numeral(value).format(pattern)
} 

export const DAY_PATTERN_1 = "HH:mm:ss DD/MM/YYYY"

export enum DayPattern {
  First = DAY_PATTERN_1,
}

export const formatDay = (
    value?: string | Date,
    pattern: DayPattern = DayPattern.First
) => dayjs(value).format(pattern)

export const truncateString = (
    address: string,
    start: number = 6,
    end: number = 4
) => {
    if (!address) return ""
    if (address.length < start + end) {
        return address
    }
    if (end === 0) return `${address.slice(0, start)}...`
    return `${address.slice(0, start)}...${address.slice(-end)}`
}

export const replace = (
    str: string,
    search: string,
    replace: string
): string => {
    return str.split(search).join(replace)
}

export type WithKey<K extends string, T> = T & { key: K }

export const valuesWithKey = <K extends string, T extends object>(
    object: Partial<Record<K, T>>
): Array<WithKey<K, T>> => {
    return Object.entries(object).map(([key, value]) => ({ ...(value as T), key: key as K }))
}

export const toMB = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2)
}

export const getPercentageString = (value: number) => {
    return `${formatNumber(value * 100, NumberPattern.Second)}%`
}
