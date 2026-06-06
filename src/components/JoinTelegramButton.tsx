import React from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";

export function JoinTelegramButton() {
  const handleBotRedirect = () => {
    // Open Telegram link in a new tab
    window.open("https://t.me/myimopage_bot", "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      id="telegram-floating-button-wrapper"
      className="fixed bottom-6 right-6 z-50 pointer-events-auto"
      animate={{
        y: [0, -8, 0]
      }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <button
        id="telegram-join-btn"
        onClick={handleBotRedirect}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#229ED9] to-[#0088cc] text-white rounded-full shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-108 active:scale-95 border border-white/20"
        title="টেলিগ্রাম বটের সাথে যুক্ত হন"
      >
        <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white transform -rotate-45 translate-x-[1px] -translate-y-[1px] fill-white shrink-0" />
        
        {/* Ambient notification bubble indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-black items-center justify-center text-white">
            ১
          </span>
        </span>
      </button>
    </motion.div>
  );
}
