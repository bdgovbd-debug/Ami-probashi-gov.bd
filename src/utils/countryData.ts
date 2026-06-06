export interface Country {
  name: string;
  namebn: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { name: "Bangladesh", namebn: "বাংলাদেশ", code: "BD", dialCode: "+880", flag: "🇧🇩" },
  { name: "Saudi Arabia", namebn: "সৌদি আরব", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "United Arab Emirates", namebn: "সংযুক্ত আরব আমিরাত", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "Malaysia", namebn: "মালয়েশিয়া", code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { name: "Oman", namebn: "ওমান", code: "OM", dialCode: "+968", flag: "🇴🇲" },
  { name: "Qatar", namebn: "কাতার", code: "QA", dialCode: "+974", flag: "🇶🇦" },
  { name: "Kuwait", namebn: "কুয়েত", code: "KW", dialCode: "+965", flag: "🇰🇼" },
  { name: "Bahrain", namebn: "বাহরাইন", code: "BH", dialCode: "+973", flag: "🇧🇭" },
  { name: "Singapore", namebn: "সিঙ্গাপুর", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "United Kingdom", namebn: "যুক্তরাজ্য (UK)", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "United States", namebn: "যুক্তরাষ্ট্র (USA)", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Italy", namebn: "ইতালি", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Lebanon", namebn: "লেবানন", code: "LB", dialCode: "+961", flag: "🇱🇧" },
  { name: "Maldives", namebn: "মালদ্বীপ", code: "MV", dialCode: "+960", flag: "🇲🇻" },
  { name: "Jordan", namebn: "জর্ডান", code: "JO", dialCode: "+962", flag: "🇯🇴" },
  { name: "Brunei Darussalam", namebn: "ব্রুনাই", code: "BN", dialCode: "+673", flag: "🇧🇳" },
  { name: "Cyprus", namebn: "সাইপ্রাস", code: "CY", dialCode: "+357", flag: "🇨🇾" },
  { name: "South Korea", namebn: "দক্ষিণ কোরিয়া", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "Greece", namebn: "গ্রিস", code: "GR", dialCode: "+30", flag: "🇬🇷" },
  { name: "Libya", namebn: "লিবিয়া", code: "LY", dialCode: "+218", flag: "🇱🇾" },
  { name: "Portugal", namebn: "পর্তুগাল", code: "PT", dialCode: "+351", flag: "🇵🇹" },
  { name: "Romania", namebn: "রোমানিয়া", code: "RO", dialCode: "+40", flag: "🇷🇴" },
  { name: "Spain", namebn: "স্পেন", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Canada", namebn: "কানাডা", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "South Africa", namebn: "দক্ষিণ আফ্রিকা", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { name: "Iraq", namebn: "ইরাক", code: "IQ", dialCode: "+964", flag: "🇮🇶" },
  { name: "India", namebn: "ভারত", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "Bhutan", namebn: "ভুটান", code: "BT", dialCode: "+975", flag: "🇧🇹" },
  { name: "Nepal", namebn: "নেপাল", code: "NP", dialCode: "+977", flag: "🇳🇵" },
  { name: "Japan", namebn: "জাপান", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "Germany", namebn: "জার্মানি", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "France", namebn: "ফ্রান্স", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Australia", namebn: "অস্ট্রেলিয়া", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Switzerland", namebn: "সুইজারল্যান্ড", code: "CH", dialCode: "+41", flag: "🇨🇭" },
  { name: "Sweden", namebn: "সুইডেন", code: "SE", dialCode: "+46", flag: "🇸🇪" },
  { name: "Netherlands", namebn: "নেদারল্যান্ডস", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "Ireland", namebn: "আয়ারল্যান্ড", code: "IE", dialCode: "+353", flag: "🇮🇪" },
  { name: "Finland", namebn: "ফিনল্যান্ড", code: "FI", dialCode: "+358", flag: "🇫🇮" },
  { name: "Norway", namebn: "নরওয়ে", code: "NO", dialCode: "+47", flag: "🇳🇴" },
  { name: "Poland", namebn: "পোল্যান্ড", code: "PL", dialCode: "+48", flag: "🇵🇱" },
  { name: "Egypt", namebn: "মিশর", code: "EG", dialCode: "+20", flag: "🇪🇬" },
  { name: "Turkey", namebn: "তুরস্ক", code: "TR", dialCode: "+90", flag: "🇹🇷" },
  { name: "Russia", namebn: "রাশিয়া", code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { name: "China", namebn: "চীন", code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { name: "Sri Lanka", namebn: "শ্রীলঙ্কা", code: "LK", dialCode: "+94", flag: "🇱🇰" },
  { name: "Pakistan", namebn: "পাকিস্তান", code: "PK", dialCode: "+92", flag: "🇵🇰" },
  { name: "Hong Kong", namebn: "হংকং", code: "HK", dialCode: "+852", flag: "🇭🇰" },
  { name: "Thailand", namebn: "থাইল্যান্ড", code: "TH", dialCode: "+66", flag: "🇹🇭" },
  { name: "New Zealand", namebn: "নিউজিল্যান্ড", code: "NZ", dialCode: "+64", flag: "🇳🇿" },
  { name: "Mauritius", namebn: "মরিশাস", code: "MU", dialCode: "+230", flag: "🇲🇺" },
  { name: "Seychelles", namebn: "সেশেলস", code: "SC", dialCode: "+248", flag: "🇸🇨" }
];

export function getGlobalCountry() {
  try {
    const dialCode = localStorage.getItem("global_country_code") || "+880";
    const flag = localStorage.getItem("global_country_flag") || "🇧🇩";
    const name = localStorage.getItem("global_country_name") || "Bangladesh";
    const namebn = localStorage.getItem("global_country_namebn") || "বাংলাদেশ";
    return { dialCode, flag, name, namebn };
  } catch (e) {
    return { dialCode: "+880", flag: "🇧🇩", name: "Bangladesh", namebn: "বাংলাদেশ" };
  }
}

export function setGlobalCountry(dialCode: string, flag: string, name: string, namebn: string) {
  try {
    localStorage.setItem("global_country_code", dialCode);
    localStorage.setItem("global_country_flag", flag);
    localStorage.setItem("global_country_name", name);
    localStorage.setItem("global_country_namebn", namebn);
    window.dispatchEvent(new CustomEvent("globalCountryCodeChanged", {
      detail: { dialCode, flag, name, namebn }
    }));
  } catch (e) {
    console.warn("Could not save country code globally:", e);
  }
}

export function formatIntlPhoneNumber(dial: string, phone: string): string {
  // strip all non-digits from dial code
  const dialDigits = dial.replace(/[^0-9]/g, "");
  // strip all non-digits from phone
  let phoneDigits = phone.replace(/[^0-9]/g, "");
  
  // if phone starts with the dial digits, strip them to avoid duplicate
  if (phoneDigits.startsWith(dialDigits) && phoneDigits.length > dialDigits.length) {
    phoneDigits = phoneDigits.substring(dialDigits.length);
  }
  
  // strip leading zero if present in the rest of the phone, unless it's just '0'
  if (phoneDigits.startsWith("0") && phoneDigits.length > 1) {
    phoneDigits = phoneDigits.substring(1);
  }
  
  return dialDigits + phoneDigits;
}
