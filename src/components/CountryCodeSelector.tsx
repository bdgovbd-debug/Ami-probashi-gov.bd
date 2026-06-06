import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, Plus, Globe, Sparkles } from "lucide-react";
import { COUNTRIES, getGlobalCountry, setGlobalCountry, Country } from "../utils/countryData";

const POPULAR_COUNTRIES: Country[] = [
  { name: "Bangladesh", namebn: "বাংলাদেশ", code: "BD", dialCode: "+880", flag: "🇧🇩" },
  { name: "Saudi Arabia", namebn: "সৌদি আরব", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "United Arab Emirates", namebn: "সংযুক্ত আরব", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "Malaysia", namebn: "মালয়েশিয়া", code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { name: "Oman", namebn: "ওমান", code: "OM", dialCode: "+968", flag: "🇴🇲" },
  { name: "Qatar", namebn: "কাতার", code: "QA", dialCode: "+974", flag: "🇶🇦" },
  { name: "Kuwait", namebn: "কুয়েত", code: "KW", dialCode: "+965", flag: "🇰🇼" },
  { name: "Singapore", namebn: "সিঙ্গাপুর", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "Bahrain", namebn: "বাহরাইন", code: "BH", dialCode: "+973", flag: "🇧🇭" },
  { name: "Maldives", namebn: "মালদ্বীপ", code: "MV", dialCode: "+960", flag: "🇲🇻" },
  { name: "Italy", namebn: "ইতালি", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "United Kingdom", namebn: "যুক্তরাজ্য", code: "GB", dialCode: "+44", flag: "🇬🇧" },
];

export default function CountryCodeSelector() {
  const [currentCountry, setCurrentCountry] = useState(getGlobalCountry);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customDialCode, setCustomDialCode] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state from global channel
  useEffect(() => {
    const handleSync = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setCurrentCountry({
          dialCode: detail.dialCode,
          flag: detail.flag,
          name: detail.name,
          namebn: detail.namebn
        });
      }
    };
    window.addEventListener("globalCountryCodeChanged", handleSync);
    
    // Periodically fetch in case of storage updates
    const timer = setInterval(() => {
      const live = getGlobalCountry();
      if (live.dialCode !== currentCountry.dialCode) {
        setCurrentCountry(live);
      }
    }, 500);

    return () => {
      window.removeEventListener("globalCountryCodeChanged", handleSync);
      clearInterval(timer);
    };
  }, [currentCountry.dialCode]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCountry = (country: Country | { dialCode: string; flag: string; name: string; namebn: string }) => {
    setGlobalCountry(country.dialCode, country.flag, country.name, country.namebn);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleCustomAction = () => {
    let code = customDialCode.trim();
    if (!code) return;
    if (!code.startsWith("+")) {
      code = "+" + code;
    }
    setGlobalCountry(code, "🌐", "Custom", "অন্যান্য দেশ");
    setCustomDialCode("");
    setIsOpen(false);
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleCustomAction();
    }
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.namebn.includes(searchQuery) ||
      c.dialCode.includes(searchQuery)
  );

  return (
    <div id="country-selector-widget" className="relative shrink-0 select-none" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border-r border-slate-200 rounded-l-xl flex items-center gap-1.5 transition-all text-sm font-black cursor-pointer active:scale-95 duration-150"
      >
        <span className="text-lg leading-none shrink-0" role="img" aria-label="country-flag">
          {currentCountry.flag}
        </span>
        <span className="font-mono text-xs">{currentCountry.dialCode}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-[310px] sm:w-[330px] bg-white border border-slate-200 rounded-3xl shadow-2xl z-[200] overflow-hidden animate-fadeIn text-left">
          {/* Search box inside dropdown */}
          <div className="p-3 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="দেশ বা কোড খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 font-sans text-slate-850"
                autoFocus
              />
            </div>
          </div>

          {/* New Grid of Popular Expatriate Countries - Easy manual selection */}
          <div className="p-3 bg-indigo-50/20 border-b border-slate-100">
            <span className="text-[10px] font-extrabold tracking-wide text-indigo-600 block mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              প্রবাসী ভাইদের জন্য বিশেষ জনপ্রিয় দেশসমূহ:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {POPULAR_COUNTRIES.map((c) => {
                const isSelected = currentCountry.dialCode === c.dialCode;
                return (
                  <button
                    key={`popular-${c.code}`}
                    type="button"
                    onClick={() => selectCountry(c)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all hover:scale-102 active:scale-95 duration-150 cursor-pointer text-center ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/10"
                        : "bg-white border-slate-150 hover:border-emerald-300 hover:bg-emerald-50/10 text-slate-800"
                    }`}
                  >
                    <span className="text-lg leading-none mb-0.5 select-none">{c.flag}</span>
                    <span className="text-[9px] font-black text-slate-900 truncate w-full leading-tight">
                      {c.namebn}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-600/90 mt-0.5 font-extrabold leading-none">
                      {c.dialCode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Custom Type Option at Dropdown top */}
          <div className="px-3 py-2 bg-emerald-50/50 border-b border-slate-100 text-[10px] font-black text-emerald-800">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-emerald-700 block font-semibold">ম্যানুয়ালি যেকোনো কান্ট্রি কোড টাইপ করুন:</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="যেমন: +1246"
                  value={customDialCode}
                  onChange={(e) => setCustomDialCode(e.target.value)}
                  onKeyDown={handleCustomKeyDown}
                  className="flex-1 px-2.5 py-1.5 text-[11px] bg-white border border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleCustomAction}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] rounded-lg flex items-center justify-center font-bold cursor-pointer transition-colors"
                >
                  যুক্ত করুন
                </button>
              </div>
            </div>
          </div>

          {/* Country code list */}
          <div className="max-h-52 overflow-y-auto scrollbar-thin divide-y divide-slate-50">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const isSelected = currentCountry.dialCode === c.dialCode;
                return (
                  <button
                    key={`${c.code}-${c.dialCode}`}
                    type="button"
                    onClick={() => selectCountry(c)}
                    className={`w-full px-3 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-all font-sans text-slate-800 cursor-pointer ${
                      isSelected ? "bg-emerald-50/60 font-black text-emerald-950" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg select-none shrink-0">{c.flag}</span>
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold text-slate-900 leading-none mb-1">{c.namebn}</span>
                        <span className="text-[10px] text-slate-500 font-bold leading-none">{c.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-slate-600 font-bold text-xs shrink-0 pl-1">
                      <span className="text-emerald-700 font-extrabold">{c.dialCode}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-3.5 text-center text-xs text-slate-400">কোনো দেশ পাওয়া যায়নি</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
