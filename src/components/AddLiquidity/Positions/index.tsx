import { Title, TokenImage } from "@/components"
import {
    GET_LP_NFT_SWR,
    GET_POOL_INFO_SWR_MUTATION,
    useGetLPNFTSwr,
    useGetPoolInfoSwrMutation,
    useSingletonHook,
} from "@/singleton"
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
    Divider,
    Spacer,
    CardFooter,
    Button,
} from "@heroui/react"
import React from "react"
import numeral from "numeral"
import { Position, TokenType } from "@/modules/blockchain"

export interface Fees {
  feeX: string;
  feeY: string;
  feeDebtX: string;
  feeDebtY: string;
}

export const Positions = () => {
    const { swrMutation } =
    useSingletonHook<ReturnType<typeof useGetLPNFTSwr>>(GET_LP_NFT_SWR)
    const { swrMutation: poolInfoSwrMutation } = useSingletonHook<
    ReturnType<typeof useGetPoolInfoSwrMutation>
  >(GET_POOL_INFO_SWR_MUTATION)

    const computeFees = (position: Position) => {
        return {
            feeX:
        Number(((poolInfoSwrMutation.data?.globalXFeeGrowthX128 || BigInt(0)) * BigInt(10000) -
          position.feeGrowthInsideX128) / BigInt("18446744073709551616")) / 10000,
            feeY:
        Number(((poolInfoSwrMutation.data?.globalYFeeGrowthX128 || BigInt(0)) * BigInt(100000) -
          position.feeGrowthInsideY128) / BigInt("18446744073709551616")) / 10000,
            feeDebtX:
        Number(((poolInfoSwrMutation.data?.globalDebtXFeeGrowthX128 || BigInt(0)) * BigInt(10000) -
          position.feeGrowthInsideDebtX128) / BigInt("18446744073709551616")) / 10000,
            feeDebtY:
        Number(((poolInfoSwrMutation.data?.globalDebtYFeeGrowthX128 || BigInt(0)) * BigInt(10000) -
          position.feeGrowthInsideDebtY128) / BigInt("18446744073709551616")) / 10000,
        }
    }

    return swrMutation.data?.positions.map((position) => {
        const fees = computeFees(position)
        return (
            <Card key={position.tokenId}>
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
                            {truncateString(position.tokenId)}
                        </Link>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="flex justify-between gap-2 w-full">
                        <Title text="Liquidity" />
                        <div className="flex items-center gap-2">
                            {numeral(computeDenomination(position.kSqrtAdded, 8)).format(
                                "0.[00]a"
                            )}
                            <Chip size="sm">
                                {getPercentageString(
                                    position.kSqrtAdded /
                  (poolInfoSwrMutation.data?.kSqrtAdded || 1)
                                )}
                            </Chip>
                        </div>
                    </div>
                    <Spacer y={2} />
                    <Divider />
                    <Spacer y={2} />
                    <div className="flex justify-between gap-2 w-full items-center">
                        <Title text="Fees" />
                        <Button variant="flat" className="w-fit">
                            Collect
                        </Button>
                    </div>
                    <Spacer y={2} />
                    <div className="flex justify-between gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                src={
                                    poolInfoSwrMutation.data?.tokenAddresses[TokenType.Token0]
                                        ?.imageUrl
                                }
                                className="w-5 h-5"
                            />
                            <div>
                                {
                                    poolInfoSwrMutation.data?.tokenAddresses[TokenType.Token0]
                                        ?.symbol
                                }
                            </div>
                        </div>
                        <div>
                            {fees.feeX}
                        </div>
                    </div>
                    <Spacer y={2} />
                    <div className="flex justify-between gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                src={
                                    poolInfoSwrMutation.data?.tokenAddresses[TokenType.Token1]
                                        ?.imageUrl
                                }
                                className="w-5 h-5"
                            />
                            <div>
                                {
                                    poolInfoSwrMutation.data?.tokenAddresses[TokenType.Token1]
                                        ?.symbol
                                }
                            </div>
                        </div>
                        <div>
                            {fees.feeY}
                        </div>
                    </div>
                    <Spacer y={2} />
                    <div className="flex justify-between gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                src={
                                    poolInfoSwrMutation.data?.tokenAddresses[TokenType.TokenDebt0]
                                        ?.imageUrl
                                }
                                className="w-5 h-5"
                            />
                            <div>
                                {
                                    poolInfoSwrMutation.data?.tokenAddresses[TokenType.TokenDebt0]
                                        ?.symbol
                                }
                            </div>
                        </div>
                        <div>
                            {fees.feeDebtX}
                        </div>
                    </div>
                    <Spacer y={2} />
                    <div className="flex justify-between gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                src={
                                    poolInfoSwrMutation.data?.tokenAddresses[TokenType.TokenDebt0]
                                        ?.imageUrl
                                }
                                className="w-5 h-5"
                            />
                            <div>
                                {
                                    poolInfoSwrMutation.data?.tokenAddresses[TokenType.TokenDebt0]
                                        ?.symbol
                                }
                            </div>
                        </div>
                        <div>
                            {fees.feeDebtY}
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="flex gap-2">
                    <Button color="primary" variant="flat">
                        Increase
                    </Button>
                    <Button color="danger" variant="flat">
                        Remove
                    </Button>
                </CardFooter>
            </Card>
        )
    })
}
