"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getInitials } from "@/lib/utils";
import { Session } from "next-auth";
import DropdownMenu from "./Dropdown"; 

const Header = ({ session }: { session: Session }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="my-2 md:my-5 flex justify-between gap-5 relative z-50">
      <Link
        href="/"
        className="text-white text-lg md:text-2xl font-bold flex items-center gap-2"
      >
        <Image
          src="/assets/images/COINCHAIN.png"
          alt="logo"
          width={40}
          height={40}
        />
        Coinchain
      </Link>

      <div className="flex gap-2 md:gap-5 items-center relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="focus:outline-none"
        >
          <Avatar>
            <AvatarFallback className="bg-amber-100 border border-primary border-3 text-base font-bold">
              {getInitials(session?.user?.name || "IN")}
            </AvatarFallback>
          </Avatar>
        </button>

        <DropdownMenu
          // userName={session?.user?.name}
          userName={session?.user?.name ?? "User"}
          onClose={() => setDropdownOpen(false)}
          isOpen={dropdownOpen}
        />

        <Link
          href="/wallet-access"
          className="flex items-center border border-white text-white hover:text-dark-100 text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary transition"
        >
          Connect
        </Link>
      </div>
    </header>
  );
};

export default Header;
