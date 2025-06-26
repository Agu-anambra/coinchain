"use client";
import Image from "next/image";
// import { IonIcon } from '@ionic/react';
import useScrollReveal from "@/hooks/useScrollReveal";
import { Button } from "./ui/button";
import CoinCover from "./CoinCover";
import Link from "next/link";

export default function HomePage({ cover }: { cover: string }) {
  // 🔁 Initialize scroll animation
  useScrollReveal();

  return (
    <main className=" text-[#b0b8d1] font-sans">
      <section
        data-section
        className=" md:pb-28 pr-4 max-w-[1280px] mx-auto transition-all duration-3000 ease-out translate-y-12 opacity-0 [&.active]:translate-y-0 [&.active]:opacity-100 book-overview"
      >
        <div className="flex flex-1 flex-col gap-5">
          <h1 className="text-white text-3xl lg:text-6xl font-extrabold leading-tight">
            Buy & Sell Digital Assets In The Coinchain
          </h1>
          <p className="textt-xs lg:text-xl book-description">
            Coin Coinchain is a cryptocurrency exchange platform that allows the
            easiest, safest, and fastest way to buy & sell crypto asset
            exchange.
          </p>
          <Button className="relative capitalize text-white font-bold py-3 px-8 rounded-full overflow-hidden z-10 inline-block group book-overview_btn">
            <Link href="/dashboard" className="relative z-10">
            Get started now
            </Link>
            <span className="absolute inset-0 z-[-1] bg-gradient-to-r from-white/10 via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-transform duration-500"></span>
          </Button>
        </div>

        <div className="relative flex flex-1 justify-center">
          <div className="relative">
            <CoinCover
              variant="wide"
              className="z-10"
              coverImage={cover}
            />

            <div className="absolute left-16 top-10 rotate-270 opacity-10 max-sm:hidden">
              <CoinCover variant="wide" coverImage={cover} className=""/>
            </div>
          </div>
        </div>
      </section>

      {/* ======= Trend Section ======= */}
      <section
        data-section
        className="pr-2 md:pr-4 mt-10 md:mt-0 opacity-0 translate-y-12 transition-all duration-3000 ease-[var(--ease-fluid)] [&.active]:translate-y-0 [&.active]:opacity-100"
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-[#0a0b0d] border border-[#2a2d38] rounded-3xl p-6 shadow-xl">
            <ul className="flex flex-wrap border-b border-[#2a2d38] pb-4 mb-6 gap-2 text-white font-bold text-sm">
              {[
                "Crypto",
                "DeFi",
                "BSC",
                "NFT",
                "Metaverse",
                "Polkadot",
                "Solana",
                "Opensea",
                "Makersplace",
              ].map((label, i) => (
                <li key={i}>
                  <button
                    className={`px-4 py-2 rounded-full transition ${
                      i === 0 ? "bg-primary" : "hover:bg-primary"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: "Bitcoin",
                  pair: "BTC/USD",
                  value: "107,426.95",
                  change: "-0.79%",
                  logo: "coin-1",
                  badge: "red",
                },
                {
                  name: "Ethereum",
                  pair: "ETH/USD",
                  value: "3,480.04",
                  change: "+10.55%",
                  logo: "coin-2",
                  badge: "green",
                },
                {
                  name: "Tether",
                  pair: "USDT/USD",
                  value: "1.00",
                  change: "-0.01%",
                  logo: "coin-3",
                  badge: "red",
                },
                {
                  name: "BNB",
                  pair: "BNB/USD",
                  value: "443.56",
                  change: "-1.24%",
                  logo: "coin-4",
                  badge: "red",
                },
              ].map((coin, i) => (
                <div
                  key={i}
                  data-section
                  className="p-4 rounded-xl bg-[#111218] hover:bg-white/5 group opacity-0 translate-y-12 transition-all duration-3000 ease-[var(--ease-fluid)] [&.active]:translate-y-0 [&.active]:opacity-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Image
                      src={`/assets/images/${coin.logo}.svg`}
                      alt={`${coin.name} logo`}
                      width={24}
                      height={24}
                    />
                    <a
                      href="#"
                      className="font-bold text-white hover:text-primary/80"
                    >
                      {coin.name}{" "}
                      <span className="ml-1 text-[#b0b8d1]">{coin.pair}</span>
                    </a>
                  </div>
                  <div className="text-2xl text-white font-bold mb-2">
                    USD {coin.value}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white">36,641.20</span>
                    <div
                      className={`px-2 py-1 text-white rounded-full text-xs font-bold ${
                        coin.badge === "green" ? "bg-green-500" : "bg-red-600"
                      }`}
                    >
                      {coin.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======= Market Section ======= */}
      <section
        data-section
        className="hidden lg:block py-20 text-white  pr-4 transition-all duration-3000 ease-out translate-y-12 opacity-0 [&.active]:translate-y-0 [&.active]:opacity-100"
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-4xl font-bold">Market Update</h2>
            <a href="#" className="relative font-bold hover:text-primary">
              See All Coins
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gray-600 group-hover:bg-primary/90 transition-all duration-300"></span>
            </a>
          </div>

          <ul className="flex gap-4 overflow-x-auto mb-10 text-sm font-bold">
            {[
              "View All",
              "Metaverse",
              "Entertainment",
              "Energy",
              "NFT",
              "Gaming",
              "Music",
            ].map((item, i) => (
              <li key={i}>
                <button
                  className={`px-6 py-2 rounded-full whitespace-nowrap ${
                    i === 0
                      ? "bg-priamry text-white"
                      : "bg-transparent text-white hover:bg-primary"
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="border-b-2 border-white">
                  <th></th>
                  <th className="py-3">#</th>
                  <th className="py-3">Name</th>
                  <th className="py-3">Last Price</th>
                  <th className="py-3">24h %</th>
                  <th className="py-3">Market Cap</th>
                  <th className="py-3">Last 7 Days</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Bitcoin", "BTC", "green"],
                  ["Ethereum", "ETH", "red"],
                  ["Tether", "USDT/USD", "green"],
                  ["BNB", "BNB/USD", "red"],
                  ["Solana", "SOL", "green"],
                  ["XRP", "XRP", "red"],
                  ["Cardano", "ADA", "green"],
                  ["Avalanche", "AVAX", "green"],
                ].map(([name, ticker, changeColor], idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#2a2d38] hover:bg-white/5 transition"
                  >
                    <td className="py-4 px-2">
                      <button>
                        <span className="text-yellow-400">&#9734;</span>
                      </button>
                    </td>
                    <td className="py-4 font-bold">{idx + 1}</td>
                    <td className="py-4 flex items-center gap-2 min-w-[150px]">
                      <Image
                        src={`/assets/images/coin-${idx + 1}.svg`}
                        alt={name}
                        width={20}
                        height={20}
                      />
                      <a href="#" className="font-bold hover:text-primary/80">
                        {name}{" "}
                        <span className="ml-1 text-[#9fa6b2]">{ticker}</span>
                      </a>
                    </td>
                    <td className="py-4">$107,426.54</td>
                    <td
                      className={`py-4 font-bold ${
                        changeColor === "green"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {changeColor === "green" ? "+1.45%" : "-5.12%"}
                    </td>
                    <td className="py-4">$880,423,640,582</td>
                    <td className="py-4">
                      <Image
                        src={`/assets/images/chart-${
                          idx % 2 === 0 ? 1 : 2
                        }.svg`}
                        alt="chart"
                        width={100}
                        height={40}
                      />
                    </td>
                    <td className="py-4">
                      <button className="border-2 border-white px-4 py-1 rounded-full hover:bg-primary transition">
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ======= Instruction Section ======= */}
      <section
        data-section
        className="py-12 md:py-20 pr-4 text-center transition-all duration-3000 ease-out translate-y-12 opacity-0 [&.active]:translate-y-0 [&.active]:opacity-100"
      >
        <div className="max-w-full mx-auto">
          <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-4">How It Work</h2>
          <p className="text-[#b0b8d1] text-base md:text-lg mb-8 md:mb-12 text-center max-w-lg mx-auto px-3">
            Stacks is a production-ready library of stackable content blocks
            built in React Native.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-20">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="text-center">
                <Image
                  src={`/assets/images/instruction-${step}.png`}
                  alt={`Step ${step}`}
                  width={96}
                  height={96}
                  className="mx-auto mb-3"
                />
                <p className="uppercase text-sm text-white">Step {step}</p>
                <h3 className="text-xl font-bold text-white mb-2">
                  {
                    [
                      "Download",
                      "Connect Wallet",
                      "Start Trading",
                      "Earn Money",
                    ][step - 1]
                  }
                </h3>
                <p className="text-[#b0b8d1]">
                  Stacks Is A Production-Ready Library Of Stackable Content
                  Blocks Built In React Native.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= About Section ======= */}
      <section
        data-section
        className="py-15 md:py-20 pr-4 transition-all duration-3000 ease-out translate-y-12 opacity-0 [&.active]:translate-y-0 [&.active]:opacity-100"
      >
        <div className="max-w-full mx-auto grid lg:grid-cols-7 gap-10 items-center">
          <Image
            src="/assets/images/about-banner.png"
            alt="About banner"
            width={748}
            height={436}
            className="w-full lg:col-span-4"
          />
          <div className="lg:col-span-3">
            <h2 className="text-white text-2xl md:text-3xl lg:text-5xl font-bold mb-4">
              What Is Coinchain
            </h2>
            <p className="text-[#b0b8d1] mb-6 text-base lg:text-lg">
              Experience a variety of trading on Bitcost. You can use various
              types of coin transactions such as Spot Trade, Futures Trade, P2P,
              Staking, Mining, and margin.
            </p>
            <ul className="space-y-6">
              {[
                "View real-time cryptocurrency prices",
                "Buy and sell BTC, ETH, XRP, OKB, Etc...",
              ].map((title, idx) => (
                <li key={idx}>
                  <div className="flex gap-3 items-center">
                    <span className="text-black rounded-full bg-primary/80 px-1 text-sm">
                      &#10004;
                    </span>
                    <h3 className="text-white font-bold text-xl md:text-3xl">{title}</h3>
                  </div>
                  <p className="text-[#b0b8d1] mt-1">
                    Experience a variety of trading on Bitcost. You can use
                    various types of coin transactions such as Spot Trade,
                    Futures Trade, P2P, Staking, Mining, and margin.
                  </p>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="inline-block mt-6 bg-primary text-black font-bold py-3 px-6 rounded-full hover:bg-primary/80 transition"
            >
              Explore More
            </a>
          </div>
        </div>
      </section>

      {/* ======= App Section ======= */}
      {/* <section
        data-section
        className=" pr-4 transition-all duration-3000 ease-out translate-y-12 opacity-0 [&.active]:translate-y-0 [&.active]:opacity-100"
      >
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 items-start gap-12">
          <div>
            <h2 className="text-white text-2xl md:text-3xl lg:text-5xl font-bold mb-4 leading-tight">
              Free Your Money & Invest With Confident
            </h2>
            <p className="text-[#b0b8d1] mb-6 text-base md:text-lg max-w-lg">
              With Cryptor Trade, you can be sure your trading skills are
              matched
            </p>
            <ul className="space-y-6">
              {[
                [
                  "Buy, Sell, And Trade On The Go",
                  "Manage Your Holdings From Your Mobile Decive",
                ],
                [
                  "Take Control Of Your Wealth",
                  "Rest Assured You (And Only You) Have Access To Your Funds",
                ],
              ].map(([title, desc], idx) => (
                <li key={idx}>
                  <div className="flex items-center gap-3">
                    <span className="text-black text-sm px-1 rounded-4xl bg-primary/80">
                      &#10004;
                    </span>
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                  </div>
                  <p className="text-[#b0b8d1] mt-1">{desc}</p>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 mt-8">
              <Image
                src="/assets/images/googleplay.png"
                alt="Get it on Google Play"
                width={135}
                height={40}
              />
              <Image
                src="/assets/images/appstore.png"
                alt="Download on the App Store"
                width={120}
                height={40}
              />
            </div>
          </div>
          <div className="relative mt-10">
            <Image
              src="/assets/images/app-banner.png"
              alt="App banner"
              width={618}
              height={526}
              className="w-full"
            />
            <span className="absolute top-10 left-0 border-2 border-white text-white text-xs font-bold px-4 py-2 rounded-full">
              Scan To Download
            </span>
          </div>
        </div> 
        <hr className="-mx-8 md:-mx-15 xl:-mx-20 text-primary" /> *
      </section> */}
    </main>
  );
}
