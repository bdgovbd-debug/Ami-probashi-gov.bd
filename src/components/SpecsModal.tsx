import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, ShoppingCart, MessageSquare, Star } from "lucide-react";
import { Product } from "../types";

interface SpecsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
}

export default function SpecsModal({
  product,
  onClose,
  onAddToCart,
  onInstantBuy,
}: SpecsModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div id="specs-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        {/* Backdrop click closer */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          id="specs-card-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg glass-modal bg-slate-950/95 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh] text-white"
        >
          {/* Header image panel */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            
            {/* Close button */}
            <button
              id="close-specs-modal"
              onClick={onClose}
              className="absolute p-2 transition-all rounded-full top-3 right-3 text-slate-300 bg-black/40 hover:bg-black/60 border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title floating on image */}
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-md uppercase tracking-wider">
                {product.category === "electronics" ? "গ্যাজেটস" : product.category === "fashion" ? "ফ্যাশন" : product.category === "organic" ? "খাদ্য" : "হোম লাইফস্টাইল"}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white mt-1 leading-snug truncate">
                {product.name}
              </h3>
            </div>
          </div>

          {/* Body panel */}
          <div className="p-5 sm:p-6 text-left flex-1 overflow-y-auto space-y-4">
            
            {/* Short review / rating block */}
            <div className="flex items-center gap-4.5 justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-inter text-slate-200">{product.rating}</span>
                <span className="text-slate-400 font-normal text-xs">({product.reviewsCount} টি কাস্টমার রিভিউ)</span>
              </div>
              <div className="text-lg font-black text-emerald-400 font-inter">
                ৳{product.price.toLocaleString("bn-BD")}
              </div>
            </div>

            {/* Specs list block */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">প্রোডাক্ট বিস্তারিত ফিচারসমূহ:</h4>
              <ul className="space-y-2.5">
                {product.specs.map((spec, idx) => (
                  <li key={idx} className="flex gap-2 text-slate-200 text-xs sm:text-sm leading-relaxed items-start">
                    <div className="p-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description box */}
            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">সংক্ষিপ্ত বিবরণ:</h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

          </div>

          {/* Footer controls */}
          <div className="p-4 bg-slate-950/60 border-t border-white/10 grid grid-cols-2 gap-3 shrink-0">
            <button
              id="specs-add-to-cart"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="py-3 px-4 flex items-center justify-center gap-1.5 border border-white/15 bg-white/5 hover:bg-emerald-500/10 text-slate-200 hover:text-emerald-300 font-bold rounded-xl text-xs transition-all cursor-pointer active:scale-95 duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>কার্টে যোগ করুন</span>
            </button>

            <button
              id="specs-instant-buy"
              onClick={() => {
                onInstantBuy(product);
                onClose();
              }}
              className="py-3 px-4 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 cursor-pointer active:scale-95 duration-200"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>নিবন্ধন করুন</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
