import React from "react";
import { Search, ShoppingBag, User, LogOut, MessageSquare, Store, Mic } from "lucide-react";
import { UserSession } from "../types";
import { GovEmblem } from "./GovBanner";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  user: UserSession;
  onLogout: () => void;
  onLoginClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onVoiceRecordClick: () => void;
}

export default function Header({
  cartItemsCount,
  onCartClick,
  user,
  onLogout,
  onLoginClick,
  searchQuery,
  onSearchChange,
  onVoiceRecordClick,
}: HeaderProps) {
  return (
    <header id="app-header" className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-2xl border-b border-emerald-500/20 shadow-md text-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 sm:min-h-24 py-3 sm:py-4 items-center justify-between gap-4 md:gap-6">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <GovEmblem className="w-11 h-11 sm:w-15 sm:h-15 filter drop-shadow-md" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs md:text-sm font-black text-rose-600 sm:text-amber-800 tracking-wider uppercase leading-none">
                  গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h1 className="text-[13px] sm:text-lg md:text-xl font-black tracking-tight text-slate-900 leading-tight mt-0.5 sm:mt-1 font-sans">
                প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়
              </h1>
              <p className="text-[9px] sm:text-[11px] text-slate-500 font-bold block mt-0.5 leading-none">
                স্মার্ট ডিজিটাল প্রবাসী সেবা ও অর্ডার পোর্টাল
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-1 sm:mx-6 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                id="search-products-input"
                type="text"
                placeholder="প্রয়োজনীয় সেবা ও কার্ড খুঁজুন (যেমন: প্রবাসী কার্ড, লোন)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-sm transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* WhatsApp Contact link */}
            <a
              id="whatsapp-direct-support-btn"
              href="https://wa.me/8809658083605?text=আসসালামু%20আলাইকুম,%20আমি%20'আমি%20প্রবাসী'%20থেকে%20যোগাযোগ%20করছি।"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-4.5 py-2.5 bg-emerald-50 border border-emerald-250 text-emerald-800 hover:bg-emerald-100 font-black rounded-full text-xs tracking-wide transition-all duration-200 hover:scale-105"
            >
              <MessageSquare className="w-4 h-4 fill-emerald-500/10 text-emerald-600" />
              <span>সহায়তা নিন</span>
            </a>

            {/* Login / Profile State */}
            {user.isLoggedIn ? (
              <div id="logged-in-profile" className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-white border border-emerald-200/80 rounded-full p-1 pl-3 pr-1 text-xs text-slate-800 shadow-sm shrink-0">
                <div className="flex flex-col text-right hidden sm:block">
                  <span className="font-extrabold text-slate-900 leading-tight block truncate max-w-28">{user.name}</span>
                  <span className="text-[10px] text-emerald-600 font-black leading-none mt-0.5">হোয়াটসঅ্যাপ সচল</span>
                </div>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-black text-xs sm:text-sm select-none shadow-md">
                  {user.name.charAt(0)}
                </div>
                {/* Logout Button */}
                <button
                  id="header-logout-btn"
                  onClick={onLogout}
                  title="লগআউট করুন"
                  className="p-1 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={onLoginClick}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-full transition-all cursor-pointer hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95 shadow-md border border-emerald-500 shrink-0"
                title="লগইন করুন"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
