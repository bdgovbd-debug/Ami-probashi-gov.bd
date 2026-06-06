import React from "react";
import { Shield, Award, Star } from "lucide-react";

export function GovEmblem({ className = "w-10 h-10" }: { className?: string }) {
  const [logoAvailable, setLogoAvailable] = React.useState(true);

  return (
    <div id="gov-official-emblem" className={`relative flex items-center justify-center shrink-0 ${className} group rounded-full overflow-hidden`}>
      {logoAvailable ? (
        <img 
          src="/my-logo.jpg" 
          alt="Logo"
          className="w-full h-full object-cover rounded-full select-none"
          onError={() => setLogoAvailable(false)}
        />
      ) : (
        <>
          {/* Outer shining light */}
          <div className="absolute inset-x-0 inset-y-0 rounded-full bg-emerald-500/20 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
          
          {/* Outer Double Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/80 bg-gradient-to-br from-emerald-950 to-slate-950 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <div className="w-[88%] h-[88%] rounded-full border border-yellow-500/50 flex items-center justify-center relative">
              
              {/* Mini star at top */}
              <div className="absolute top-0.5 text-[5px] text-yellow-400">
                <Star className="w-1.5 h-1.5 fill-yellow-400 text-yellow-400" />
              </div>

              {/* Central Red Disc representing Bangladesh flag */}
              <div className="w-[65%] h-[65%] rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center shadow-inner relative">
                {/* Map Placeholder representation */}
                <div className="w-2.5 h-2 w bg-yellow-400 rounded-full blur-[0.5px] opacity-90 transform -rotate-12" />
              </div>
              
              {/* Decorative mini stars on sides */}
              <div className="absolute left-1 text-[4px] text-yellow-400">★</div>
              <div className="absolute right-1 text-[4px] text-yellow-400">★</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface GovBannerProps {
  layout?: "horizontal" | "vertical" | "minimal";
}

export function GovBanner({ layout = "horizontal" }: GovBannerProps) {
  if (layout === "minimal") {
    return (
      <div 
        id="gov-banner-minimal" 
        className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] sm:text-xs font-black text-emerald-800 shadow-xs"
      >
        <GovEmblem className="w-5 h-5" />
        <span className="tracking-wide font-black">প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়</span>
      </div>
    );
  }

  if (layout === "vertical") {
    return (
      <div 
        id="gov-banner-vertical" 
        className="p-5 bg-white border border-slate-200 rounded-2xl text-center space-y-3 relative overflow-hidden shadow-md"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-emerald-500 to-yellow-500" />
        <GovEmblem className="w-12 h-12 mx-auto" />
        <div className="space-y-1">
          <h5 className="text-xs font-black text-amber-700 tracking-wider">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h5>
          <p className="text-sm font-black text-slate-900">প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়</p>
          <p className="text-[10px] text-emerald-700 font-extrabold tracking-widest uppercase">Government of Bangladesh</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="gov-banner-horizontal" 
      className="w-full p-4.5 bg-gradient-to-r from-emerald-50 via-white to-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4.5 shadow-md relative overflow-hidden"
    >
      {/* Government Color Ribbon bar indicator */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-emerald-500 to-yellow-500" />
      
      <div className="flex items-center gap-3.5 text-left">
        <GovEmblem className="w-11 h-11" />
        <div>
          <div className="flex items-center gap-1.5 pb-0.5">
            <span className="text-[10px] font-black text-amber-700 tracking-wider uppercase leading-none">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</span>
            <span className="w-1 h-3 bg-slate-200 rounded-full" />
            <span className="text-[9px] text-slate-500 font-extrabold leading-none">সরকারি অফিসিয়াল পোর্টাল</span>
          </div>
          <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়
          </h4>
          <p className="text-[10px] text-slate-500 font-semibold">ওয়েজ আর্নার্স কল্যাণ বোর্ড (WEWB) কর্তৃক অনুমোদিত ও সংরক্ষিত</p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50/70 border border-emerald-100 rounded-xl">
        <Shield className="w-4 h-4 text-emerald-600 animate-pulse" />
        <span className="text-[10px] font-black text-slate-700">শতভাগ নিরাপদ সরকারি এনক্রিপ্ট পোর্টাল</span>
      </div>
    </div>
  );
}
