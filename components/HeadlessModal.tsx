// components/HeadlessModal.tsx
"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function HeadlessModal({ children, onClose }) {
  return (
    <Transition appear show as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center bg-black/70">
          <Transition.Child
            enter="transition-opacity duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="inline-block w-full max-w-md p-6 my-20 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
