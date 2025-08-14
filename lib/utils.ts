import { DEPOSIT_TOKENS } from "@/components/DepositTokenst";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string):string => {
  const names = name.split(" ").map((part) => part[0]).join('').toUpperCase().slice(0,2);
  return names;
}

export const getNativeFromTokenNetwork = (token: string, network: string): string | null => {
  for (const t of DEPOSIT_TOKENS) {
    if (t.token.toUpperCase() === token.toUpperCase()) {
      const net = t.networks.find(n => n.name.toUpperCase() === network.toUpperCase());
      return net ? net.native : null;
    }
  }
  return null;
}