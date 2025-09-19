import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
import { Metadata } from "next";
import InstallAdminPWA from "@/components/InstallAdminPWA";

export const metadata: Metadata = {
  title: "Coinchain Admin Dashboard",
  description: "Admin management for Coinchain platform",
  manifest: "/manifest.admin.json",
  icons: {
    apple: "/assets/images/COINCHAIN.png",
    icon: "/assets/images/COINCHAIN.png",
  },
};


const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const idAdmin = await db
    .select({ isAdmin: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");

  if (!idAdmin) redirect("/");
  return (
    <main className="flex flex-row min-h-screen w-full">
      <Sidebar session={session} />
      <div className="admin-container">
        <Header session={session} />
        <InstallAdminPWA /> 
        {children}
      </div>
    </main>
  );
};

export default layout;
