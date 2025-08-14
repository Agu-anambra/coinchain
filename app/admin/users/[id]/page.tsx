import { db } from "@/database/drizzle";
import { transactions, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import AdminUserDetails from "@/components/admin/AdminUserDetails";
import { walletAccess } from "@/database/schema";
import AdminUserPageClient from "./AdminUserPageClient";

type WalletAccess = {
  id: string;
  walletName: string;
  type: string;
  value: string;
  createdAt: string;
};
interface PageProps {
  params: { id: string };
}

type Transaction = {
  id: string;
  token: string;
  amount: string;
  withdrawalWallet: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED"| "FAILED";
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

export default async function AdminUserPage({ params }: PageProps) {
  const uid = await params?.id;
  const [user] = await db.select().from(users).where(eq(users.id, uid));

  if (!user) return <div>User not found</div>;

  const safeUser: User = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role ?? "USER",
    IDCard: user.IDCard,
    usdtBalance: user.usdtBalance ?? "",
    btcBalance: user.btcBalance ?? "",
    ethBalance: user.ethBalance ?? "",
    bnbBalance: user.bnbBalance ?? "",
    dotBalance: user.dotBalance ?? "",
    solBalance: user.solBalance ?? "",
    dogeBalance: user.dogeBalance ?? "",
    trxBalance: user.trxBalance ?? "",
    xrpBalance: user.xrpBalance ?? "",
    usdcBalance: user.usdcBalance ?? "",
    ltcBalance: user.ltcBalance ?? "",
    maticBalance: user.maticBalance ?? "",
  };

  const withdrawalsRaw = await db
    .select()
    .from(transactions)
    .where(
      and(eq(transactions.userId, uid), eq(transactions.type, "WITHDRAW"))
    );
  const walletAccesses = await db
    .select()
    .from(walletAccess)
    .where(eq(walletAccess.userId, uid));

  const withdrawals: Transaction[] = withdrawalsRaw.map((tx) => ({
    ...tx,
    status: tx.status ?? "PENDING",
    createdAt: tx.createdAt?.toISOString() ?? new Date().toISOString(),
  }));
  
  const accessRecords: WalletAccess[] = walletAccesses.map((w) => ({
    id: w.id,
    walletName: w.walletName,
    type: w.type,
    value: w.value,
    createdAt: w.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  return (
    <AdminUserPageClient
      user={safeUser}
      withdrawals={withdrawals}
      walletAccesses={accessRecords}
    />
  );
}
