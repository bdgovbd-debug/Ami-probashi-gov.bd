import React from "react";
import { Star, MessageSquare, Plus, ShoppingCart, Tag } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onShowSpecs: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onInstantBuy,
  onShowSpecs,
}: ProductCardProps) {
  // Calculate discount percentage if original price is present
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article
      id={`product-card-${product.id}`}
      className="group relative flex flex-col overflow-hidden bg-white border border-slate-200/80 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl rounded-2xl text-slate-800"
    >
      
      {/* Product Image Panel */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-550/90 text-white text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm leading-none">
            <Tag className="w-3 h-3" />
            <span>{discountPercent}% ছাড়</span>
          </div>
        )}

        {/* Popular Item Badge */}
        {product.isPopular && (
          <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider leading-none shadow-xs">
            জনপ্রিয়
          </div>
        )}

        {/* Quick View Spec Button overlay */}
        <button
          id={`view-specs-btn-${product.id}`}
          onClick={() => onShowSpecs(product)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 px-3.5 py-1.5 bg-slate-900/90 border border-slate-700/50 backdrop-blur-md text-white text-xs font-black rounded-full hover:bg-emerald-600 hover:text-white transition-all shadow-xs cursor-pointer"
        >
          ফিচারসমূহ দেখুন
        </button>
      </div>

      {/* Product Details Panel */}
      <div className="flex flex-col flex-1 p-4.5 sm:p-5 text-left">
        
        {/* Rating and Stock */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1 text-amber-550">
            <Star className="w-3.5 h-3.5 fill-amber-550" />
            <span className="text-xs font-extrabold text-slate-850 font-inter">{product.rating}</span>
            <span className="text-[10px] text-slate-500 font-bold">({product.reviewsCount})</span>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${product.stock > 10 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {product.stock > 0 ? `স্টক: ${product.stock} টি` : "আউট অব স্টক"}
          </span>
        </div>

        {/* Title (Bold Text header as requested) */}
        <h3 className="text-base font-black text-slate-905 leading-snug group-hover:text-emerald-700 transition-colors mb-1.5 min-h-12 line-clamp-2">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Bottom Panel: Price & Actions */}
        <div className="mt-auto space-y-3 pt-3 border-t border-slate-100">
          
          {/* Price display */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-emerald-600 font-inter">
              ৳{product.price.toLocaleString("bn-BD")}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-extrabold font-inter">
                ৳{product.originalPrice.toLocaleString("bn-BD")}
              </span>
            )}
          </div>

          {/* Core Buy / Cart Buttons */}
          <div className="grid grid-cols-5 gap-2 pt-1 font-sans">
            
            {/* Add to Cart Button */}
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={() => onAddToCart(product)}
              disabled={product.stock <= 0}
              className="col-span-2 py-2.5 flex items-center justify-center gap-1 border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-xs font-black animate-none"
              title="কার্টে যোগ করুন"
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>কার্ট</span>
            </button>

            {/* Direct Instant WhatsApp Buy Now Button */}
            <button
              id={`instant-buy-btn-${product.id}`}
              onClick={() => onInstantBuy(product)}
              disabled={product.stock <= 0}
              className="col-span-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-95 duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white shrink-0" />
              <span>নিবন্ধন করুন</span>
            </button>

          </div>
        </div>

      </div>
    </article>
  );
}
