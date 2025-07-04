"use client"
import { Title } from "@/components"
import {
    computeDenomination,
    getPercentageString,
    truncateString,
} from "@/utils"
import {
    Chip,
    Card,
    CardBody,
    CardHeader,
    Link,
    Spacer,
    CardFooter,
    Button,
} from "@heroui/react"
import React from "react"
import numeral from "numeral"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux"

export interface Fees {
  feeX: string;
  feeY: string;
  feeDebtX: string;
  feeDebtY: string;
}

export const Positions = () => {
    const positions = useAppSelector((state) => state.stateReducer.positions)
    const tokenPairMetadata = useAppSelector((state) => state.stateReducer.tokenPairMetadata)
    const router = useRouter()
    const poolId = useAppSelector((state) => state.homeReducer.poolId)

    return (
        <div className="flex flex-col gap-4">
            {positions.map((position) => {
                return (
                    <Card key={position.nftAddress}>
                        <CardHeader>
                            <div className="flex justify-between gap-2 w-full">
                                <div>{position.name}</div>
                                <Link
                                    href=""
                                    showAnchorIcon
                                    color="secondary"
                                    underline="always"
                                    size="sm"
                                >
                                    {truncateString(position.nftAddress)}
                                </Link>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="flex justify-between gap-2 w-full">
                                <Title text="Liquidity" />
                                <div className="flex items-center gap-2 text-sm">
                                    {numeral(computeDenomination(position.kSqrtAdded, 8)).format(
                                        "0.[00]a"
                                    )}
                                    <Chip color="secondary" variant="flat">
                                        {getPercentageString(
                                            position.kSqrtAdded /
                        (tokenPairMetadata?.kSqrtAdded || 1)
                                        )}
                                    </Chip>
                                </div>
                            </div>
                            <Spacer y={4} />
                            <div className="flex justify-between gap-2 w-full items-center">
                                <Title text="Earnings" />
                                <div className="flex items-center gap-2 text-sm">$0</div>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <Button fullWidth variant="flat" onPress={() => {
                                router.push(`/positions/${poolId}/${position.nftAddress}`)
                            }}>
                Manage
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
