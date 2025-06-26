"use client";
import { useEffect, useState } from "react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import HeadlessModal from "@/components/HeadlessModal";
import { SiTether, SiBnbchain } from "react-icons/si";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

  
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
};


export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [prices, setPrices] = useState<any>(null);
  const [openModal, setOpenModal] = useState<"deposit" | "withdraw" | null>(null);

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
    alert("Failed to load dashboard data");
  }
}

  useEffect(() => {
    load();
    const iv = setInterval(() => fetch("/api/crypto-price").then(r => r.json()).then(setPrices), 30000);
    return () => clearInterval(iv);
  }, []);

  if (!user || !prices)
    return <p className="text-center mt-10 text-white">Loading...</p>;

  const coins = [
    { label: "USDT", key: "tether", balance: user.usdtBalance },
    { label: "BTC", key: "bitcoin", balance: user.btcBalance },
    { label: "ETH", key: "ethereum", balance: user.ethBalance },
    { label: "BNB", key: "binancecoin", balance: user.bnbBalance },
  ];


const coinColors: Record<string, string> = {
  BTC: "#f7931a",
  ETH: "#627eea",
  USDT: "#26a17b",
  BNB: "#f0b90b",
};

const pieData = {
  labels: coins.map(c => c.label),
  datasets: [{
    data: coins.map(c => {
      const price = prices[c.key]?.usd ?? 0;
      const balance = parseFloat(c.balance ?? "0");
      return price * balance;
    }),
    backgroundColor: coins.map(c => coinColors[c.label]),
  }],
};

  const totalValue = coins.reduce((acc, c) => {
  const price = prices[c.key]?.usd ?? 0;
  const balance = parseFloat(c.balance ?? "0");
  return acc + (price * balance);
}, 0);


  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">
        Welcome, {user.fullName.split(" ")[0]}👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {coins.map(({ label, key, balance }) => {
  const price = prices[key]?.usd ?? 0; // fallback if undefined
  const change = prices[key]?.usd_24h_change ?? 0;
  const positive = change > 0;
  const numericBalance = parseFloat(balance ?? "0"); // safely parse string

  return (
    <div
      key={key}
      className="bg-[#1b1f2a] p-5 rounded-xl text-white shadow flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] min-w-[280px] sm:min-w-xs md:min-w-[280px] lg:min-w-lg"
    >
      <div className="flex justify-start items-center mb-2 space-x-5">
        <span className="w-5 h-5 text-primary text-2xl">{icons[label]}</span>
        <span className="text-md text-gray-400">{label} Balance</span>
      </div>
      {/* Display crypto balance (with up to 8 decimal places) */}
<span
  title={`${numericBalance} ${label}`} className="text-sm text-gray-300 py-3">
  {numericBalance.toFixed(8)} {label}
</span>
      <div className="text-2xl font-semibold mb-2">
        {(numericBalance * price).toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}
      </div>
      <div className="flex items-center text-sm py-2">
        {positive ? (
          <ArrowUpRight className="w-4 h-4 text-green-400 animate-pulse" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-400 animate-pulse" />
        )}
        <span className={`ml-1 ${positive ? "text-green-400" : "text-red-400"}`}>
          {change.toFixed(2)}% 24h
        </span>
      </div>
    </div>
  );
})}

      </div>
      <div className="bg-[#1b1f2a] text-white rounded-xl p-4 mb-6 shadow">
  <h2 className="text-lg font-bold mb-3">Total Portfolio Value</h2>
  <p className="text-2xl font-semibold mb-4">
    {totalValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    })}
  </p>
  {pieData.datasets[0].data.every(val => val === 0) ? (
  <p className="text-center text-gray-400">No portfolio data to display</p>
) : (
  <Pie data={pieData} className="max-w-xs mx-auto" />
)}
  {/* <Pie data={pieData} className="max-w-xs mx-auto" /> */}
</div>
      <div className="flex space-x-4 mb-5">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          onClick={() => setOpenModal("deposit")}
        >
          Deposit
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          onClick={() => setOpenModal("withdraw")}
        >
          Withdraw
        </button>
      </div>

      {/* Modal */}
      {openModal && (
        <HeadlessModal onClose={() => setOpenModal(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget as HTMLFormElement);
              await fetch(`/api/${openModal}`, {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(form)),
                headers: { "Content-Type": "application/json" },
              });
              setOpenModal(null);
            }}
          >
            <h2 className="text-xl mb-4 capitalize">{openModal} funds</h2>
            <select name="token" required className="mb-2 w-full p-2 rounded border">
              {coins.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              name="amount"
              type="number"
              step="0.0001"
              placeholder="Amount"
              required
              className="mb-4 w-full p-2 rounded border"
            />
            <button
              type="submit"
              className={`w-full px-4 py-2 rounded ${
                openModal === "deposit"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white transition`}
            >
              Submit {openModal}
            </button>
          </form>
        </HeadlessModal>
      )}
    </div>
  );
}
