"use client";
import { useEffect, useState } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iOS);

    // Detect if app is already standalone (installed)
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );

    // Handle Android "beforeinstallprompt"
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
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

  if (isStandalone) {
    return null; // already installed, hide button
  }

  return (
    <>
      {/* ANDROID / CHROME */}
      {deferredPrompt && (
        <button
          onClick={installApp}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Install App
        </button>
      )}

      {/* iOS SAFARI */}
      {isIOS && !deferredPrompt && (
        <div className="p-3 bg-yellow-100 text-gray-800 rounded-lg text-sm">
          <p>
            📲 To install this app on iOS: tap{" "}
            <span className="font-bold">Share</span> →{" "}
            <span className="font-bold">Add to Home Screen</span>
          </p>
        </div>
      )}
    </>
  );
}

// "use client";
// import { useEffect, useState } from "react";

// export default function InstallPWA() {
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

//   useEffect(() => {
//     const handler = (e: any) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//     };

//     window.addEventListener("beforeinstallprompt", handler);
//     return () => window.removeEventListener("beforeinstallprompt", handler);
//   }, []);

//   const installApp = async () => {
//     if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     const choice = await deferredPrompt.userChoice;
//     if (choice.outcome === "accepted") {
//       console.log("App installed");
//     }
//     setDeferredPrompt(null);
//   };

//   return (
//     deferredPrompt && (
//       <button
//         onClick={installApp}
//         className="px-4 py-2 bg-primary text-white rounded-lg"
//       >
//         Install App
//       </button>
//     )
//   );
// }
