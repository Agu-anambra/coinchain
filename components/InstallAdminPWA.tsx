"use client";
import { useEffect, useState } from "react";

export default function InstallAdminPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showIOSBanner, setShowIOSBanner] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const iOS = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(iOS);

        // Detect if app is already standalone (installed)

        const checkStandalone = () => {
            setIsStandalone(
                window.matchMedia("(display-mode: standalone)").matches ||
                (window.navigator as any).standalone === true
            );
        };

        checkStandalone();

        const mediaQuery = window.matchMedia("(display-mode: standalone)");
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", checkStandalone);
        } else {
            // Safari fallback
            mediaQuery.addListener(checkStandalone);
        }


        // Handle Android "beforeinstallprompt"
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener("beforeinstallprompt", handler);

        // Show iOS banner only if not dismissed before
        if (iOS && !localStorage.getItem("iosBannerDismissed")) {
            setShowIOSBanner(true);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", checkStandalone);
            } else {
                mediaQuery.removeListener(checkStandalone);
            }
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
            console.log("App installed");
        }
        setDeferredPrompt(null);
    };

    const dismissIOSBanner = () => {
        setShowIOSBanner(false);
        localStorage.setItem("iosBannerDismissed", "true");
    };

    if (isStandalone) {
        return null; // already installed, hide button
    }
    return (
        <>
            {/* ANDROID / CHROME */}
            {deferredPrompt && (
                <div className="w-full flex justify-end bg-primary-admin/70">
                    <button
                        onClick={installApp}
                        aria-label="Install this app"
                        style={{ maxWidth: '220px' }}
                        // className="px-4 py-1 bg-primary text-white text-xs"
                        className="w-auto px-4 py-1 bg-primary-admin/60 text-white shadow-md font-semibold transition hover:bg-primary-admin/90 text-right cursor-pointer text-xs"
                    >
                        Install App
                    </button>
                </div>
            )}
            {/* iOS SAFARI */}
            {isIOS && !deferredPrompt && (
                <div className="p-3 bg-yellow-100 text-gray-800 text-xs">
                    {/* <div className="w-full p-3 bg-yellow-100 text-gray-800 text-xs flex items-center"> */}
                    <p>
                        📲 To install this app on iOS: tap{" "}
                        <span className="font-bold">Share</span> →{" "}
                        <span className="font-bold">Add to Home Screen</span>
                    </p>
                </div>
            )}
            {isIOS && showIOSBanner && !deferredPrompt && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto bg-yellow-100 text-gray-800 px-4 py-2 rounded-lg shadow z-4 text-xs flex justify-between items-center">
                    <p>
                        📲 Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> to install
                    </p>
                    <button
                        onClick={dismissIOSBanner}
                        aria-label="Dismiss"
                        className="ml-3 text-red-600 font-bold hover:text-red-900 border p-2 rounded-md"
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}
