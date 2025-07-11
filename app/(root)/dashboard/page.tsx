"use client";
import { Fragment, useEffect, useState } from "react";
import {
  FaBitcoin,
  FaCoins,
  FaDog,
  FaDollarSign,
  FaEthereum,
} from "react-icons/fa";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import HeadlessModal from "@/components/HeadlessModal";
import {
  SiTether,
  SiBnbchain,
  SiRipple,
  SiPolygon,
  SiPolkadot,
  SiSolana,
  SiLitecoin,
} from "react-icons/si";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useWalletAddress } from "@/hooks/useWalletAddresses";
import QRCode from "react-qr-code";
import { toast } from "sonner";

ChartJS.register(ArcElement, Tooltip, Legend);

interface UserDashboardData {
  fullName: string;
  usdtBalance: string;
  btcBalance: string;
  ethBalance: string;
  bnbBalance: string;
}

interface Prices {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}
const icons = {
  USDT: <SiTether />,
  BTC: <FaBitcoin />,
  ETH: <FaEthereum />,
  BNB: <SiBnbchain />,
  DOT: <SiPolkadot />,
  SOL: <SiSolana />,
  DOGE: <FaDog />,
  TRX: <FaCoins />,
  XRP: <SiRipple />,
  USDC: <FaDollarSign />,
  LTC: <SiLitecoin />,
  MATIC: <SiPolygon />,
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [prices, setPrices] = useState<any>(null);
  const [openModal, setOpenModal] = useState<"deposit" | "withdraw" | null>(
    null
  );
  const [selectedToken, setSelectedToken] = useState("USDT-TRC20");
  const { address, loading } = useWalletAddress(selectedToken);

  async function load() {
    try {
      const [uRes, pRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/crypto-price"),
      ]);

      if (!uRes.ok || !pRes.ok) throw new Error("Failed to load data");

      setUser(await uRes.json());
      setPrices(await pRes.json());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    }
  }

  useEffect(() => {
    load();
    const iv = setInterval(
      () =>
        fetch("/api/crypto-price")
          .then((r) => r.json())
          .then(setPrices),
      30000
    );
    return () => clearInterval(iv);
  }, []);

  if (!user || !prices)
    return <p className="text-center mt-10 text-white">Loading...</p>;

  const coins = [
    { label: "BTC", key: "bitcoin", balance: user.btcBalance },
    { label: "ETH", key: "ethereum", balance: user.ethBalance },
    { label: "BNB", key: "binancecoin", balance: user.bnbBalance },
    { label: "USDT", key: "tether", balance: user.usdtBalance },
    { label: "TRX", key: "tron", balance: user.trxBalance },
    { label: "USDC", key: "usd-coin", balance: user.usdcBalance },
    { label: "DOT", key: "polkadot", balance: user.dotBalance },
    { label: "SOL", key: "solana", balance: user.solBalance },
    { label: "DOGE", key: "dogecoin", balance: user.dogeBalance },
    { label: "XRP", key: "ripple", balance: user.xrpBalance },
    { label: "LTC", key: "litecoin", balance: user.ltcBalance },
    { label: "MATIC", key: "matic-network", balance: user.maticBalance },
  ];

  const DEPOSIT_TOKENS = [
    { token: "BTC", networks: ["MAINNET"] },
    { token: "ETH", networks: ["ERC20", "TRC20", "BEP20"] },
    { token: "BNB", networks: ["BEP20"] },
    { token: "USDT", networks: ["ERC20", "TRC20", "BEP20"] },
    { token: "USDC", networks: ["ERC20", "TRC20", "BEP20"] },
    { token: "TRX", networks: ["TRC20"] },
    { token: "DOT", networks: ["MAINNET"] },
    { token: "SOL", networks: ["MAINNET"] },
    { token: "DOGE", networks: ["MAINNET"] },
    { token: "XRP", networks: ["MAINNET"] },
    { token: "LTC", networks: ["MAINNET"] },
    { token: "MATIC", networks: ["MAINNET"] },
  ];

  const coinColors: Record<string, string> = {
    BTC: "#f7931a",
    ETH: "#627eea",
    USDT: "#26a17b",
    BNB: "#f0b90b",
    DOT: "#e6007a",
    DOGE: "#c2a633",
    TRX: "#ef0027",
    XRP: "#25a768",
    USDC: "#2775ca",
    LTC: "#345c9c",
    MATIC: "#8247e5",
  };

  const pieData = {
    labels: coins.map((c) => c.label),
    datasets: [
      {
        data: coins.map((c) => {
          const price = prices[c.key]?.usd ?? 0;
          const balance = parseFloat(c.balance ?? "0");
          return price * balance;
        }),
        backgroundColor: coins.map((c) => coinColors[c.label]),
      },
    ],
  };

  const totalValue = coins.reduce((acc, c) => {
    const price = prices[c.key]?.usd ?? 0;
    const balance = parseFloat(c.balance ?? "0");
    return acc + price * balance;
  }, 0);

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">
        Welcome, {user.fullName.split(" ")[0]}👋
      </h1>

      <div className="bg-[#1b1f2a] text-white rounded-xl p-1 md:p-4 mb-6 shadow">
        <h2 className="text-lg font-bold mb-3">Total Portfolio Value</h2>
        <p className="text-2xl font-semibold mb-4">
          {totalValue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          })}
        </p>
        {pieData.datasets[0].data.every((val) => val === 0) ? (
          <p className="text-center text-gray-400">
            No portfolio data to display
          </p>
        ) : (
          <Pie data={pieData} className="max-w-xs mx-auto text-white" />
        )}
        {/* <Pie data={pieData} className="max-w-xs mx-auto" /> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {coins.map(({ label, key, balance }) => {
          const price = prices[key]?.usd ?? 0; // fallback if undefined
          const change = prices[key]?.usd_24h_change ?? 0;
          const positive = change > 0;
          const numericBalance = parseFloat(balance ?? "0"); // safely parse string

          return (
            <div
              key={key}
              className="bg-[#1b1f2a] py-2 px-2 md:px-4 rounded-xl text-white shadow flex flex-row justify-between space-x-5 items-center transition-transform duration-300 hover:scale-[1.02] min-w-[280px] sm:min-w-xs md:min-w-[280px] lg:min-w-lg"
            >
              <div className="flex items-center space-x-2 md:space-x-4">
                <div
                  className="w-10 h-10 text-3xl"
                  style={{ color: coinColors[label] }}
                >
                  {icons[label as keyof typeof icons]}
                </div>
                <div className="">
                  <span className="text-md font-bold text-gray-400 capitalize">
                    {key}
                  </span>
                  <div className="text-sm font-semibold">
                    {(numericBalance * price).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="text-gray-300">
                      {price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    {positive ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400 animate-pulse ml-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400 animate-pulse ml-1" />
                    )}
                    <span
                      className={`ml-1 ${
                        positive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {change.toFixed(2)}% 24h
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row  items-center space-x-5">
                <div className="">
                  <span
                    title={`${numericBalance} ${label}`}
                    className="text-md text-gray-300 py-3"
                  >
                    {numericBalance.toFixed(2)} {label}
                  </span>
                </div>
                {/* Display crypto balance (with up to 8 decimal places) */}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex space-x-4 mb-5">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
          onClick={() => setOpenModal("deposit")}
        >
          Deposit
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition cursor-pointer"
          onClick={() => setOpenModal("withdraw")}
        >
          Withdraw
        </button>
      </div>

      {/* Modal */}
      {openModal && (
        <HeadlessModal onClose={() => setOpenModal(null)}>
          {openModal === "deposit" ? (
            <div className="text-white space-y-4">
              <h2 className="text-xl mb-2 font-semibold text-black">
                DEPOSIT {selectedToken}
              </h2>
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full p-2 rounded border mb-2 text-black"
              >
                {DEPOSIT_TOKENS.map(({ token, networks }) =>
                  networks.map((network) => (
                    <option
                      key={`${token}-${network}`}
                      value={`${token}-${network}`}
                    >
                      {token} ({network})
                    </option>
                  ))
                )}
              </select>

              {loading ? (
                <p className="text-black">Fetching addresses...</p>
              ) : address && address.address ? (
                <div key={address.network} className="mb-6">
                  <p className="text-sm text-gray-400 mb-1">
                    Send to {address.network} Address:
                  </p>
                  <p className="text-black bg-pr/10 shadow-lg p-2 rounded break-all font-mono">
                    {address.address}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(address.address);
                      toast.success(
                        `${address.network} address copied to clipboard`
                      );
                    }}
                    className="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-sm rounded cursor-pointer"
                  >
                    Copy {address.network} Address
                  </button>
                  <div className="mt-4 flex justify-center">
                    <QRCode value={address.address} />
                  </div>
                </div>
              ) : (
                <p className="text-red-500">
                  No address found for {selectedToken}
                </p>
              )}
            </div>
          ) : (
            // 🔽 Withdraw Form
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget as HTMLFormElement);
                await fetch(`/api/${openModal}`, {
                  method: "POST",
                  body: JSON.stringify(Object.fromEntries(form)),
                  headers: { "Content-Type": "application/json" },
                });
                toast.success("withdrawal request sent");
                await load();
                setOpenModal(null);
              }}
            >
              <h2 className="text-xl mb-4 capitalize">{openModal} funds</h2>
              <select
                name="token"
                required
                className="mb-2 w-full p-2 rounded border"
              >
                {DEPOSIT_TOKENS.map(({ token, networks }) =>
                  networks.map((network) => {
                    const value = `${token}-${network}`;
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })
                )}
              </select>
              <input
                name="amount"
                type="number"
                step="0.0001"
                placeholder="Amount"
                required
                className="mb-4 w-full p-2 rounded border"
              />
              <input
                name="withdrawalWallet"
                type="text"
                placeholder="Your wallet address"
                required
                className="mb-4 w-full p-2 rounded border"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
              >
                Submit withdraw
              </button>
            </form>
          )}
        </HeadlessModal>
      )}
    </div>
  );
}
