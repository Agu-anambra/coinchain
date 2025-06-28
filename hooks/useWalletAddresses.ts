"use client";
import { useEffect, useState } from "react";


export const useWalletAddress = (token: string) => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/wallet/${token}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setAddress(data?.address ?? null))
      .catch(() => setAddress(null))
      .finally(() => setLoading(false));
  }, [token]);

  return { address, loading };
};
