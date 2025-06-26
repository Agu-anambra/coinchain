"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface Props {
  userName: string;
  onClose: () => void;
  isOpen: boolean;
}

export default function DropdownMenu({ userName, onClose, isOpen }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute right-20 top-10 mt-2 w-48 bg-white shadow-lg rounded-md pt-2 text-sm text-gray-700 z-50"
        >
          <div className="px-4 py-2 border-b font-semibold">{userName}</div>
          <Link
            href="/dashboard"
            className="block px-4 py-2 hover:bg-primary/80 font-bold"
            onClick={onClose}
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              onClose();
              signOut({ callbackUrl: "/sign-in" });
            }}
            className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 hover:rounded-b-md font-bold"
          >
            Logout
          </button>
            {/* <form
            action={async () => {
              "use server";

              await signOut();
            }}
            className="mb-0 "
            onClick={() => setDropdownOpen(false)}
          >
            <Button className="cursor-pointer text-dark-100">Logout</Button>
          </form> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
