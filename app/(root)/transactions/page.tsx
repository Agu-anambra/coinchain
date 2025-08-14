"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Transaction = {
  id: string;
  token: string;
  amount: number;
  status: "FAILED" | "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  note?: string | null;
};

const statusOptions = ["ALL", "FAILED", "PENDING", "APPROVED", "REJECTED"];
const tokenOptions = [
  "ALL", "BTC", "ETH", "BNB", "USDT", "USDC", "TRX", "DOT", "SOL", "DOGE", "XRP", "LTC", "MATIC"
];
const ITEMS_PER_PAGE = 10;

export default function TransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const status = searchParams.get("status") || "ALL";
  const token = searchParams.get("token") || "ALL";
  const sort = (searchParams.get("sort") as "asc" | "desc") || "desc";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Filtered + Sorted Transactions (memoized)
  const filteredTransactions = allTransactions
    // .filter(tx => (status === "ALL" ? true : tx.status === status))
    // .filter(tx => (token === "ALL" ? true : tx.token === token))
    .filter(tx => {
      if (status !== "ALL" && tx.status !== status) return false;

      if (token !== "ALL") {
        // Normalize both for comparison
        const tokenName = tx.token.toUpperCase();
        if (!tokenName.startsWith(token.toUpperCase())) return false;
      }

      return true;
    })
    .sort((a, b) =>
      sort === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const currentPageData = filteredTransactions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions`); // Fetch all once
      const data = await res.json();
      setAllTransactions(data.transactions || []);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuery = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      params.set(key, value);
    });
    router.push(`/transactions?${params.toString()}`);
  };

  const goToPage = (newPage: number) => {
    updateQuery({ page: newPage.toString() });
  };

  return (
    <div className="md:p-6">
      <h1 className="md:text-2xl font-bold md:mb-4 mb-2 text-white  text-lg">My Transactions History</h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center md:mb-6 mb-1 md:space-x-60">
        <div className="flex flex-wrap md:gap-4 text-xs">
          <select
            className="border rounded px-2 py-1 bg-white"
            value={status}
            onChange={(e) => updateQuery({ status: e.target.value, page: "1" })}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-2 py-1 bg-white"
            value={token}
            onChange={(e) => updateQuery({ token: e.target.value, page: "1" })}
          >
            {tokenOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-2 py-1 bg-white"
            value={sort}
            onChange={(e) => updateQuery({ sort: e.target.value, page: "1" })}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
        <div className="text-gray-100 font-medium text-sm">
          Total transactions: {filteredTransactions.length}
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : currentPageData.length === 0 ? (
        <p className="text-white">No transactions found</p>
      ) : (
        <div>
          {/* Mobile view */}
          < div className="grid md:gap-4 gap-2 md:hidden text-xs">
            {currentPageData.map((tx) => (
              <div key={tx.id} className="border rounded p-3 bg-gray-800 text-white">
                <div className="flex justify-between">
                  <span className="font-semibold">{tx.token}</span>
                  <span
                    className={
                      tx.status === "APPROVED"
                        ? "text-green-400 font-bold"
                        : tx.status === "PENDING"
                          ? "text-yellow-400 font-bold"
                          : "text-red-400 font-bold"
                    }
                  >
                    {tx.status}
                  </span>
                </div>
                <div>Amount: {tx.amount}</div>
                <div>Date: {new Date(tx.createdAt).toLocaleString()}</div>
                <div>
                  {["FAILED", "REJECTED"].includes(tx.status)
                    ? tx.note || "No reason provided"
                    : "-"}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto border rounded">
            <table className="min-w-full divide-y divide-gray-200 text-xs text-gray-100 ">
              <thead className="bg-gray-50 text-black font-semibold text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">Token</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPageData.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-2 font-medium">{tx.token}</td>
                    <td className="px-4 py-2">{tx.amount}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${tx.status === "APPROVED"
                        ? "text-green-600"
                        : tx.status === "PENDING"
                          ? "text-yellow-600"
                          : "text-red-600"
                        }`}
                    >
                      {tx.status}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-red-600">
                      {/* {tx.status === "FAILED" ? tx.note || "No reason provided" : "-"} */}
                      {(tx.status === "FAILED" || tx.status === "REJECTED")
                        ? tx.note || "No reason provided"
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
      }

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2 md:my-6 my-2 text-gray-300 text-sm">
        <button
          className="md:px-3 md:py-1 px-1 py-0.5 border rounded disabled:opacity-50 cursor-pointer"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          className="md:px-3 md:py-1 px-1 py-0.5 border rounded disabled:opacity-50 cursor-pointer"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div >
  );
}
