"use client";

import { useState } from "react";
import WalletAccessModal from "./WalletAccessModal";
import trustIcon from "@/public/images/wallets/trust-wallet.png";
import coinbaseIcon from "@/public/images/wallets/coinbase.png";
import exodusIcon from "@/public/images/wallets/exodus.png";
import safepalIcon from "@/public/images/wallets/safepal.png";
import metamaskIcon from "@/public/images/wallets/metamask.svg";
import okx from "@/public/images/wallets/okx-logo.png";
import Image from "next/image";

const WALLETS = [
  { name: "Trust Wallet", icon: trustIcon },
  { name: "Coinbase Wallet", icon: coinbaseIcon },
  { name: "Exodus Wallet", icon: exodusIcon },
  { name: "Safepal Wallet", icon: safepalIcon },
  { name: "Metamask Wallet", icon: metamaskIcon },
  { name: "OKX Wallet", icon: okx },
];

export default function WalletSelectorModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleWalletSelect = (wallet: string) => {
    setSelectedWallet(wallet);
    // maybe open the next modal step or close this one
  };

  if (selectedWallet)
    return <WalletAccessModal walletName={selectedWallet} onClose={onClose} />;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl w-100 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-center text-black">
          Choose Wallet
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {WALLETS.map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => handleWalletSelect(name)}
              className="flex flex-col items-center p-2 bg-transparent rounded-xl hover:bg-gray-100 transition text-white"
            >
              <Image
                src={icon}
                alt={name}
                width={400}
                height={400}
                className="object-contain w-16 h-16 mb-2"
              />
              <span className="text-sm text-center text-black">{name}</span>
            </button>
          ))}
        </div>

        {/* <div className="grid grid-cols-1 gap-3">
          {WALLETS.map((wallet) => (
            <button
              key={wallet}
              onClick={() => setSelectedWallet(wallet)}
              className="bg-primary text-black py-2 px-4 rounded-lg hover:bg-primary/90"
            >
              {wallet}
            </button>
          ))}
        </div> */}
      </div>
    </div>
  );
}
