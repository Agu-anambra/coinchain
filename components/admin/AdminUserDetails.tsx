"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import {
  updateUserRole,
  updateUserBalance,
  deleteUser,
} from "@/lib/actions/admin";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  usdtBalance: string;
  btcBalance: string;
  ethBalance: string;
  bnbBalance: string;
};

type Transaction = {
  token: string;
  amount: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string; // ISO string format
};

export default function AdminUserDetails({
  user,
  withdrawals,
}: {
  user: User;
  withdrawals: Transaction[];
}) {
  const [isPending, startTransition] = useTransition();
  const [balances, setBalances] = useState({
    usdt: user.usdtBalance,
    btc: user.btcBalance,
    eth: user.ethBalance,
    bnb: user.bnbBalance,
  });

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

  return (
    <div className="p-6 text-black">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold mb-4">{user.fullName}'s Profile</h2>
        <div className="">
          <p className="font-semibold">Email: {user.email}</p>
          <p className="font-semibold">Current Role: {user.role}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Balances</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {["usdt", "btc", "eth", "bnb"].map((coin) => (
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
        className="mt-4 bg-green-600 px-4 py-2 rounded text-white item"
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
            <table className="min-w-full text-sm text-white">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-2">Token</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((tx, i) => (
                  <tr key={i} className="border-b border-gray-600">
                    <td className="p-2 text-black">{tx.token}</td>
                    <td className="p-2 text-black">{tx.amount}</td>
                    <td className="p-2 text-black">{tx.status}</td>
                    <td className="p-2 text-black">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
