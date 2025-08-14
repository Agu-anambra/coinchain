"use client";

import AdminUserDetails from "@/components/admin/AdminUserDetails";
import { useRouter } from "next/navigation";


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
  withdrawalWallet: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FAILED";
  createdAt: string;
};

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
interface AdminUserDetailsProps {
  user: User;
  withdrawals: Transaction[];
  walletAccesses: WalletAccess[];
}

export default function AdminUserPageClient({ user, withdrawals, walletAccesses}:AdminUserDetailsProps) {
  const router = useRouter();

  return (
    <AdminUserDetails
      user={user}
      withdrawals={withdrawals}
      walletAccesses={walletAccesses}
      refresh={() => router.refresh()}
    />
  );
}
