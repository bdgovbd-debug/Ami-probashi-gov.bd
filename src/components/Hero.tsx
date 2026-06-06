import React from "react";
import { MessageSquare, Sparkles, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";
import { UserSession } from "../types";
import { GovEmblem } from "./GovBanner";

interface HeroProps {
  user: UserSession;
  onLoginClick: () => void;
  onScrollToProducts: () => void;
}

export default function Hero({ user, onLoginClick, onScrollToProducts }: HeroProps) {
  return (
    <section id="hero-section" className="relative overflow-hidden glass-effect bg-white border border-slate-200/80 text-slate-800 rounded-3xl py-12 px-6 sm:px-12 md:py-20 md:px-16 mx-4 sm:mx-6 lg:mx-8 my-6 sm:my-8 shadow-xl">
      
      {/* Decorative Blur Background Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-400/5 rounded-full blur-[100px] pointer-events-none" />
 
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        
        {/* Left column - Content */}
        <div className="md:col-span-12 lg:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-black tracking-wider uppercase">
            <GovEmblem className="w-5 h-5" />
            <span>গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রবাসী ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight md:leading-normal text-slate-900">
            প্রবাসী কার্ড’ আবেদন: <br className="hidden sm:inline" />
            এক ডিজিটাল কার্ডেই মিলবে <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500">সকল সরকারি সুযোগ-সুবিধা ও অনুদান!</span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
            প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয় এবং ওয়েজ আর্নার্স কল্যাণ বোর্ডের (WEWB) যৌথ উদ্যোগে প্রবাসীদের জীবনযাত্রা সহজ করতে চালু হচ্ছে এই ‘প্রবাসী কার্ড’। এটি কেবল একটি সাধারণ প্লাস্টিক বা ডিজিটাল কার্ড নয়, বরং এটি বিদেশে অবস্থানরত প্রতিটি বাংলাদেশির একক ডিজিটাল আইডেন্টিটি বা বৈধ পরিচয়পত্র।
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
            <button
              id="hero-shop-now-btn"
              onClick={onScrollToProducts}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/10 hover:scale-105 transition-transform duration-200 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <span>আবেদন শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {user.isLoggedIn && (
              <div id="hero-welcome-badge" className="inline-flex items-center gap-2.5 px-4.5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-emerald-700 shadow-xs w-full sm:w-auto justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>লগইন আছেন: {user.name}</span>
              </div>
            )}
          </div>

        </div>

        {/* Right column - Feature card demo/mock */}
        <div className="hidden lg:col-span-5 lg:block text-slate-800">
          <div className="relative p-6 sm:p-7 bg-white border border-slate-200 rounded-3xl shadow-xl">
            {/* Top indicator dots */}
            <div className="flex gap-1.5 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>

            {/* Simulated Mobile screen inside App */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">রিসেন্ট হোয়াটসঅ্যাপ সেশন</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-200 rounded-md">LIVE ACTIVE</span>
              </div>

              {/* Chat bubble 1 */}
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-bold text-[11px] shrink-0 text-white select-none shadow-sm">
                  অ
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-r-xl rounded-bl-xl text-xs space-y-1 max-w-[85%] text-slate-700">
                  <p className="font-extrabold text-emerald-700">আমি প্রবাসী মডারেটর</p>
                  <p>আসসালামু আলাইকুম! কোনো স্পেশাল প্রোডাক্টে সাহায্য লাগবে কি? আমরা প্রস্তুত আছি অর্ডার রিসিভ করতে!</p>
                </div>
              </div>

              {/* Chat bubble 2 */}
              <div className="flex gap-3 text-left justify-end">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-l-xl rounded-br-xl text-xs space-y-1 max-w-[85%] text-slate-800">
                  <p className="font-extrabold text-emerald-800 text-right">আপনি (কাস্টমার)</p>
                  <p>জি, আমি 'প্রিমিয়াম ব্লুটুথ স্মার্টওয়াচ' টি অর্ডার করতে চাই। ডেলিভারি চার্জ কত পড়বে?</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[11px] shrink-0 text-slate-750 select-none shadow-xs">
                  উ
                </div>
              </div>

              {/* Action alert box widget */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-700 font-medium">কার্ট চেকআউট রেডি</span>
                </div>
                <button
                  onClick={onScrollToProducts}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg leading-none transition-all cursor-pointer active:scale-95"
                >
                  কিনুন
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
