"use client"
import React from "react"
import { Swap } from "./_components"
import {
    Spacer,
    Image,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Button,
    Link,
} from "@heroui/react"
import { motion } from "framer-motion"
import { BlockMath } from "react-katex"

const Page = () => {
    const coins = [
        { src: "/ci-aptos.png", label: "ciAPT" },
        { src: "/ci-usdc.png", label: "ciUSDC" },
    ]
    return (
        <>
            <div className="max-w-[1024px] mx-auto px-6">
                <Spacer y={24} />
                <div className="grid sm:grid-cols-2 gap-12 items-center">
                    <motion.div
                        className="font-bold flex-1"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="text-[48px] text-secondary text-center sm:text-left">
              Reimagining DEXes
                        </div>
                        <div className="text-xl text-foreground-500 text-center sm:text-left">
              Powered by debt tokens and optimized for capital-efficient virtual
              liquidity on Aptos
                        </div>
                    </motion.div>
                    <motion.div
                        className="flex-1 grid place-items-center px-4"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} // delay để xuất hiện sau text chút
                    >
                        <Swap showGetStarted className="w-full max-w-[400px]" />
                    </motion.div>
                </div>
                <Spacer y={24} />
                <motion.div
                    className="flex flex-col items-center text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }} // delay nếu muốn xuất hiện sau phần trên
                >
                    <div className="text-2xl font-bold text-center">
            Virtualized TVL — A New Liquidity Primitive
                    </div>
                    <Spacer y={12} />
                    <div className="grid grid-cols-2 gap-12">
                        {coins.map((coin, index) => (
                            <motion.div
                                key={coin.label}
                                className="flex flex-col items-center gap-1.5"
                                animate={{
                                    y: [0, -8, 0], // Lắc nhẹ lên xuống
                                    scale: [1, 1.03, 1], // Phồng nhẹ
                                }}
                                transition={{
                                    duration: 2.5, // Di chuyển chậm, nhẹ nhàng
                                    repeat: Infinity,
                                    delay: index * 0.3, // Xen kẽ nhẹ
                                    ease: "easeInOut",
                                }}
                            >
                                <Image
                                    src={coin.src}
                                    alt={coin.label}
                                    width={120}
                                    height={120}
                                />
                                <div className="text-2xl">{coin.label}</div>
                            </motion.div>
                        ))}
                    </div>
                    <Spacer y={12} />
                    <div className="text-foreground-500 text-md mt-2 max-w-[600px]">
            Instead of locking real assets, CiSwap mints synthetic liquidity
            using debt tokens. This allows for high capital efficiency and
            scalable trading without requiring massive upfront deposits.
                    </div>
                </motion.div>
                <Spacer y={24} />
                <motion.div
                    className="flex flex-col items-center text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                >
                    <div className="text-2xl font-bold">
            Rethinking DEXs from the Ground Up
                    </div>
                    <Spacer y={8} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                        {/* CARD 1 */}
                        <Card>
                            <CardHeader className="font-bold text-lg text-start">
                Bootstrapping Liquidity without Capital
                            </CardHeader>
                            <CardBody>
                                <p className="text-sm text-foreground-500">
                  Traditional DEXs require real token deposits to launch pairs.
                  CiSwap introduces virtual liquidity via debt tokens
                  (ciTokens), allowing anyone to create trading pools instantly
                  — with zero upfront capital.
                                </p>
                            </CardBody>
                            <CardFooter>
                                <Button>Learn more</Button>
                            </CardFooter>
                        </Card>

                        {/* CARD 2 */}
                        <Card>
                            <CardHeader className="text-start font-bold text-lg">
                Trade Using Synthetic Depth
                            </CardHeader>
                            <CardBody>
                                <p className="text-sm text-foreground-500">
                  CiSwap simulates liquidity using internal balances: (X + ciX)
                  * (Y + ciY) = k. This enables smooth, low-slippage trading
                  even when real token reserves are limited — perfect for
                  early-stage or low-liquidity markets.
                                </p>
                            </CardBody>
                            <CardFooter>
                                <Button>Learn more</Button>
                            </CardFooter>
                        </Card>

                        {/* CARD 3 */}
                        <Card>
                            <CardHeader className="text-start font-bold text-lg">
                ciTokens: Debt with Utility
                            </CardHeader>
                            <CardBody>
                                <p className="text-sm text-foreground-500">
                  When liquidity is missing, CiSwap issues ciTokens — synthetic
                  IOUs representing future redemption value. These can be
                  staked, lent, or used in DeFi strategies — turning debt into
                  programmable, yield-bearing capital.
                                </p>
                            </CardBody>
                            <CardFooter>
                                <Button>Learn more</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </motion.div>
                <Spacer y={24} />
                <motion.div
                    className="flex flex-col items-center text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                >
                    <div className="text-2xl font-bold text-center">Pricing Formula</div>
                    <Spacer y={6} />

                    <div className="max-w-2xl text-sm text-foreground-500 text-center">
            CiSwap modifies the classic AMM pricing curve to incorporate virtual
            balances:
                    </div>
                    <Spacer y={4} />
                    <div className="flex justify-center text-4xl">
                        <BlockMath math="(X + ciX) \cdot (Y + ciY) = k" />
                    </div>
                    <Spacer y={4} />
                    <div className="text-sm text-foreground-500 max-w-xl flex flex-col gap-2">
                        <div>
                            <strong>X, Y</strong> = real token balances
                        </div>
                        <div>
                            <strong>ciX, ciY</strong> = internal debt token balances
                        </div>
                        <div>
                            <strong>k</strong> = virtual constant product
                        </div>
                    </div>
                </motion.div>
                <Spacer y={24} />
                <motion.div
                    className="flex flex-col items-center text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                >
                    <div className="text-2xl font-bold text-center">
            Who Is CiSwap For?
                    </div>
                    <Spacer y={8} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
                        <Card>
                            <CardHeader className="font-bold text-start">
                Token Creators
                            </CardHeader>
                            <CardBody>
                                <p className="text-sm text-foreground-500">
                  Launch trading pairs instantly without capital. No need to
                  raise seed liquidity — CiSwap handles it via synthetic depth.
                                </p>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader className="font-bold text-start">
                DeFi Traders
                            </CardHeader>
                            <CardBody>
                                <p className="text-sm text-foreground-500">
                  Trade in low-liquidity environments with confidence. Virtual
                  liquidity ensures low slippage and predictable execution.
                                </p>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader className="font-bold text-start">
                Protocol Builders
                            </CardHeader>
                            <CardBody>
                                <p className="text-sm text-foreground-500">
                  Build lending, yield, or synthetic protocols on top of
                  ciTokens — a composable, programmable layer for liquidity
                  logic.
                                </p>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader className="font-bold text-start">
                Liquidity Providers
                            </CardHeader>
                            <CardBody>
                                <p className="text-sm text-foreground-500">
                  Earn fees without impermanent loss. Supply one-sided
                  liquidity, stake debt tokens, and farm $CISWAP rewards.
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </motion.div>
            </div>

            <footer className="mt-24 bg-content1 pt-12 pb-6 text-sm text-foreground-500">
                <div className="max-w-[1024px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                    {/* Logo + Project Info */}
                    <div className="flex flex-col gap-2">
                        <div className="text-xl font-bold text-secondary">CiSwap</div>
                        <p className="max-w-[300px]">
              A new primitive for capital-efficient trading using synthetic
              liquidity on Aptos.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-foreground-400">
                        <Link
                            isExternal
                            color="foreground"
                            href="#"
                            className="text-foreground-500 transition-colors"
                        >
              Docs
                        </Link>
                        <Link
                            isExternal
                            color="foreground"
                            href="https://github.com/starci-lab/ciswap-contracts"
                            className="text-foreground-500 transition-colors"
                        >
              GitHub
                        </Link>
                        <Link
                            isExternal
                            color="foreground"
                            href="https://x.com/CiSwapvAMM"
                            className="text-foreground-500 transition-colors"
                        >
              Twitter
                        </Link>
                        <Link
                            isExternal
                            color="foreground"
                            href="#"
                            className="text-foreground-500 transition-colors"
                        >
              Discord
                        </Link>
                    </div>
                </div>
                {/* Bottom credit */}
                <div className="mt-8 text-center text-xs text-foreground-400">
          © {new Date().getFullYear()} CiSwap.
                </div>
            </footer>
        </>
    )
}

export default Page
