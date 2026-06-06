import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div id="toast-wrapper" className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 w-full max-w-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -15 }}
        className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto ${
          type === "success"
            ? "bg-slate-900 border-emerald-500/20 text-emerald-400"
            : "bg-slate-900 border-red-500/20 text-red-400"
        }`}
      >
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
        ) : (
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
        )}
        <p className="text-xs sm:text-sm font-bold text-left text-slate-100 flex-1 leading-normal">
          {message}
        </p>
      </motion.div>
    </div>
  );
}
