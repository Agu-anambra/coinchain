'use client'
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function WhatsAppSupport() {
    
  const phoneNumber = "447349556804";
  const message = "Hello! I have some enquiries to make.";
  const encodedMessage = encodeURIComponent(message);

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const tooltipInterval = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }, 10000);

    return () => clearInterval(tooltipInterval);
  }, []);

  return (
    <div className="fixed md:bottom-60 bottom-28 right-4 flex flex-col items-end gap-1 z-50">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-primary text-black text-xs px-3 py-1 rounded-lg shadow-lg"
          >
            Need Support?
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button with bounce + shake */}
      <motion.a
        href={`https://wa.me/${phoneNumber}?text=${encodedMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        animate={{
          y: [0, -5, 0], // bounce
          rotate: [0, 0, 0, -5, 5, -5, 5, 0], // shake
        }}
        transition={{
          repeat: Infinity,
          repeatDelay: 6, // every 6s
          duration: 0.8,
        }}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center cursor-pointer"
        style={{ width: 50, height: 50 }}
      >
        <FaWhatsapp size={30} />
      </motion.a>
    </div>
    // <a
    //   href={`https://wa.me/${phoneNumber}?text=${encodedMessage}`}
    //   target="_blank"
    //   rel="noopener noreferrer"
    //   className="fixed bottom-12 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-1 shadow-lg flex items-center justify-center"
    //   style={{ width: 60, height: 60 }}
    // >
    //   <FaWhatsapp size={30} />
    // </a>
  );
}
