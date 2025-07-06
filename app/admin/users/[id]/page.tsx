import { db } from "@/database/drizzle";
import { transactions, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import AdminUserDetails from '@/components/admin/AdminUserDetails';

interface PageProps {
  params: { id: string };
}

type Transaction = {
  token: string;
  amount: string;
  withdrawalWallet: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  // createdAt: Date | null;
};

type User = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
  usdtBalance: string;
  btcBalance: string;
  ethBalance: string;
  bnbBalance: string;
  seedPhrase?: string | null;
};

export default async function AdminUserPage({ params }: PageProps) {
  const [user] = await db
  .select()
  .from(users)
  .where(eq(users.id, params?.id));

  if (!user) return <div>User not found</div>;

  const safeUser: User = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role ?? "USER",
    usdtBalance: user.usdtBalance ?? "",
    btcBalance: user.btcBalance ?? "",
    ethBalance: user.ethBalance ?? "",
    bnbBalance: user.bnbBalance ?? "",
  seedPhrase: user.seedPhrase ?? null,
  };

  const withdrawalsRaw = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.userId, params.id), eq(transactions.type, 'WITHDRAW')));

  const withdrawals: Transaction[] = withdrawalsRaw.map(tx => ({
    ...tx,
    status: tx.status ?? "PENDING",
  createdAt: tx.createdAt?.toISOString() ?? new Date().toISOString(),
  }));
    
  return <AdminUserDetails user={safeUser} withdrawals={withdrawals} />;
}
