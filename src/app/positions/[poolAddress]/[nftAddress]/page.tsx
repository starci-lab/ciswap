"use client"
import { Title, TokenImage } from "@/components"
import { useAppSelector } from "@/redux"
import {
    computeDenomination,
    getFee,
    getPercentageString,
    truncateString,
    getHeroUITheme,
} from "@/utils"
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Link,
    NumberInput,
    Progress,
    Spacer,
    Tab,
    Tabs,
} from "@heroui/react"
import { useParams } from "next/navigation"
import React from "react"
import numeral from "numeral"
import {
    ArrowCounterClockwiseIcon,
    ArrowLeftIcon,
} from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useCollectFeesSwrMutation, useSingletonHook } from "@/singleton"
import { COLLECT_FEES_SWR_MUTATION } from "@/singleton/keys"
import { useActiveAddress } from "@/hooks"
import { addTxToast } from "@/toasts"
import { useTheme } from "next-themes"

const Page = () => {
    const params = useParams()
    const poolAddress = params.poolAddress
    const nftAddress = params.nftAddress
    const positions = useAppSelector((state) => state.stateReducer.positions)
    const position = positions.find(
        (position) => position.nftAddress === nftAddress
    )
    const tokenMetadatas = useAppSelector(
        (state) => state.stateReducer.tokenMetadatas
    )
    const tokenPairMetadata = useAppSelector(
        (state) => state.stateReducer.tokenPairMetadata
    )
    const router = useRouter()
    const { swrMutation: collectFeesSwrMutation } = useSingletonHook<
    ReturnType<typeof useCollectFeesSwrMutation>
  >(COLLECT_FEES_SWR_MUTATION)
    const accountAddress = useActiveAddress()
    const network = useAppSelector((state) => state.chainReducer.network)
    const { theme } = useTheme()
    const _theme = getHeroUITheme(theme)
    if (!position) return
    return (
        <div className="max-w-[500px] mx-auto">
            <div className="flex justify-between items-center">
                <Button variant="flat" isIconOnly onPress={() => router.back()}>
                    <ArrowLeftIcon />
                </Button>
                <Button variant="flat" isIconOnly>
                    <ArrowCounterClockwiseIcon />
                </Button>
            </div>
            <Spacer y={4} />
            <div className="text-2xl font-bold">{position?.name}</div>
            <Spacer y={2} />
            <Link
                href={`/positions/${poolAddress}`}
                showAnchorIcon
                underline="always"
                color="secondary"
            >
                {truncateString(position?.nftAddress ?? "", 10)}
            </Link>
            <Spacer y={6} />
            <Card>
                <CardHeader>
                    <Tabs fullWidth>
                        <Tab key="increase" title="Increase" />
                        <Tab key="decrease" title="Decrease" />
                    </Tabs>
                </CardHeader>
                <CardBody>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <TokenImage 
                                    theme={_theme}
                                    className="w-5 h-5"
                                    iconUrls={tokenMetadatas?.tokenXMetadata?.iconUris}
                                />
                                <div className="text-sm">
                                    {tokenMetadatas?.tokenXMetadata?.name}
                                </div>
                            </div>
                            <div className="text-sm text-foreground-500">Balance: 0</div>
                        </div>
                        <Spacer y={1.5} />
                        <NumberInput
                            classNames={{
                                inputWrapper: "w-full",
                            }}
                            isDisabled={!tokenMetadatas?.tokenXMetadata?.symbol}
                            endContent={
                                <div className="text-xs text-foreground-500">{`${tokenMetadatas?.tokenXMetadata?.symbol}`}</div>
                            }
                            hideStepper
                            labelPlacement="outside"
                        />
                    </div>
                    <Spacer y={4} />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <TokenImage
                                    theme={_theme}
                                    className="w-5 h-5"
                                    iconUrls={tokenMetadatas?.tokenYMetadata?.iconUris}
                                />
                                <div className="text-sm">
                                    {tokenMetadatas?.tokenYMetadata?.name}
                                </div>
                            </div>
                            <div className="text-sm text-foreground-500">Balance: 0</div>
                        </div>
                        <Spacer y={1.5} />
                        <NumberInput
                            isDisabled={!tokenMetadatas?.tokenYMetadata?.symbol}
                            classNames={{
                                inputWrapper: "w-full",
                            }}
                            endContent={
                                <div className="text-sm text-foreground-500">{`${tokenMetadatas?.tokenYMetadata?.symbol}`}</div>
                            }
                            className="flex-1"
                            hideStepper
                            labelPlacement="outside"
                        />
                    </div>
                </CardBody>
                <CardFooter>
                    <Button color="primary" fullWidth>
            Increase
                    </Button>
                </CardFooter>
            </Card>
            <Spacer y={6} />
            <Card>
                <CardHeader>
                    <div className="flex justify-between gap-2 w-full items-center">
                        <Title text="Liquidity" />
                        <div className="flex items-center gap-2 text-sm">
                            {numeral(
                                computeDenomination(position?.kSqrtAdded ?? 0, 8)
                            ).format("0.[00]a")}
                            <Chip color="secondary" variant="flat">
                                {getPercentageString(
                                    (position?.kSqrtAdded ?? 0) /
                    (tokenPairMetadata?.kSqrtAdded || 1)
                                )}
                            </Chip>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="flex justify-between gap-2 w-full items-center">
                        <div className="flex items-center gap-1">
                            <div className="text-sm whitespace-nowrap">
                                {tokenMetadatas?.tokenXMetadata?.symbol} +{" "}
                                {tokenMetadatas?.tokenDebtXMetadata?.symbol}
                            </div>
                            <Chip color="primary" variant="flat">
                                {getPercentageString(0.5)}
                            </Chip>
                        </div>
                        <Progress
                            value={50}
                            color="primary"
                            classNames={{
                                indicator: "bg-primary",
                            }}
                        />
                        <div className="flex items-center gap-1">
                            <Chip color="secondary" variant="flat">
                                {getPercentageString(0.5)}
                            </Chip>
                            <div className="text-sm whitespace-nowrap">
                                {tokenMetadatas?.tokenYMetadata?.symbol} +{" "}
                                {tokenMetadatas?.tokenDebtYMetadata?.symbol}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Spacer y={6} />
            <Card>
                <CardHeader>
                    <div className="flex justify-between gap-2 w-full items-center">
                        <Title text="Pending yield" />
                        <Button
                            color="primary"
                            onPress={
                                async () =>
                                {
                                    const { hash } = await collectFeesSwrMutation.trigger({
                                        nftAddress: nftAddress as string,
                                        recipientAddress: accountAddress || "",
                                    })
                                    addTxToast({
                                        txHash: hash,
                                        network
                                    })
                                }
                            }
                        >
              Claim
                        </Button>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="flex justify-between gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                theme={_theme}
                                iconUrls={tokenMetadatas?.tokenXMetadata?.iconUris}
                                className="w-4 h-4"
                            />
                            <div className="text-sm">
                                {tokenMetadatas?.tokenXMetadata?.symbol}
                            </div>
                        </div>
                        <div className="text-sm">
                            {getFee({
                                globalFeeGrowthX128: BigInt(
                                    tokenPairMetadata?.globalXFeeGrowthX128 || 0
                                ),
                                feeGrowthInsideX128: BigInt(
                                    position?.xFeeGrowthInsideX128 || 0
                                ),
                                decimals: tokenMetadatas?.tokenXMetadata?.decimals || 8,
                                kSqrtAdded: position?.kSqrtAdded || 0,
                            })}{" "}
                            {tokenMetadatas?.tokenXMetadata?.symbol}
                        </div>
                    </div>
                    <Spacer y={2} />
                    <div className="flex justify-between gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                theme={_theme}
                                iconUrls={tokenMetadatas?.tokenYMetadata?.iconUris}
                                className="w-4 h-4"
                            />
                            <div className="text-sm">
                                {tokenMetadatas?.tokenYMetadata?.symbol}
                            </div>
                        </div>
                        <div className="text-sm">
                            {getFee({
                                globalFeeGrowthX128: BigInt(
                                    tokenPairMetadata?.globalYFeeGrowthX128 || 0
                                ),
                                feeGrowthInsideX128: BigInt(
                                    position?.yFeeGrowthInsideX128 || 0
                                ),
                                decimals: tokenMetadatas?.tokenYMetadata?.decimals || 8,
                                kSqrtAdded: position?.kSqrtAdded || 0,
                            })}{" "}
                            {tokenMetadatas?.tokenYMetadata?.symbol}
                        </div>
                    </div>
                    <Spacer y={2} />
                    <div className="flex justify-between gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                theme={_theme}
                                iconUrls={tokenMetadatas?.tokenDebtXMetadata?.iconUris}
                                className="w-4 h-4"
                            />
                            <div className="text-sm">
                                {tokenMetadatas?.tokenDebtXMetadata?.symbol}
                            </div>
                        </div>
                        <div className="text-sm">
                            {getFee({
                                globalFeeGrowthX128: BigInt(
                                    tokenPairMetadata?.globalDebtXFeeGrowthX128 || 0
                                ),
                                feeGrowthInsideX128: BigInt(
                                    position?.debtXFeeGrowthInsideX128 || 0
                                ),
                                decimals: tokenMetadatas?.tokenDebtXMetadata?.decimals || 8,
                                kSqrtAdded: position?.kSqrtAdded || 0,
                            })}{" "}
                            {tokenMetadatas?.tokenDebtXMetadata?.symbol}
                        </div>
                    </div>
                    <Spacer y={2} />
                    <div className="flex justify-between gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <TokenImage
                                theme={_theme}
                                iconUrls={tokenMetadatas?.tokenDebtYMetadata?.iconUris}
                                className="w-4 h-4"
                            />
                            <div className="text-sm">
                                {tokenMetadatas?.tokenDebtYMetadata?.symbol}
                            </div>
                        </div>
                        <div className="text-sm">
                            {getFee({
                                globalFeeGrowthX128: BigInt(
                                    tokenPairMetadata?.globalDebtYFeeGrowthX128 || 0
                                ),
                                feeGrowthInsideX128: BigInt(
                                    position?.debtYFeeGrowthInsideX128 || 0
                                ),
                                decimals: tokenMetadatas?.tokenDebtYMetadata?.decimals || 8,
                                kSqrtAdded: position?.kSqrtAdded || 0,
                            })}{" "}
                            {tokenMetadatas?.tokenDebtYMetadata?.symbol}
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Spacer y={6} />
        </div>
    )
}

export default Page
