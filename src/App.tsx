import React, { useState, useRef, useEffect } from "react";
import { PRODUCTS, CATEGORIES } from "./data";
import { Product, CartItem, UserSession } from "./types";
import {
  IdCard,
  Landmark,
  Scale,
  Heart,
  MessageSquare,
  Sparkles,
  Phone,
  Clock,
  ShieldCheck,
  MapPin,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Mic,
  Volume2,
  Video,
  VideoOff,
  Camera,
} from "lucide-react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Cart from "./components/Cart";
import WhatsAppLoginModal from "./components/WhatsAppLoginModal";
import SpecsModal from "./components/SpecsModal";
import Toast from "./components/Toast";
import { GovBanner, GovEmblem } from "./components/GovBanner";
import SonaliWalletLoanForm from "./components/SonaliWalletLoanForm";
import CountryCodeSelector from "./components/CountryCodeSelector";
import { getGlobalCountry, formatIntlPhoneNumber } from "./utils/countryData";
import { requestNotificationPermissionAndGetToken } from "./utils/firebase";
import { JoinTelegramButton } from "./components/JoinTelegramButton";

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

const SLIDES = [
  { url: "/logo1.jpg", title: "১-ক্লিক সচল অর্ডার", desc: "কার্ট থেকে সরাসরি হোয়াটসঅ্যাপ মেসেজ!" },
  { url: "/logo2.jpg", title: "নিরাপদ লগইন", desc: "হোয়াটসঅ্যাপ ওটিপি ভিত্তিক ক্লায়েন্ট আইডি" },
  { url: "/logo3.jpg", title: "ক্যাশ অন ডেলিভারি", desc: "সারা বাংলাদেশে হাতের কাছে পণ্য বুঝে নিন" },
  { url: "/logo4.jpg", title: "২৪/৭ কাস্টমার সাপোর্ট", desc: "সবচেয়ে দ্রুত মেসেজিং সমাধান" },
  { url: "/logo5.jpg", title: "ডিজিটাল প্রবাসী সেবা ও কল্যাণ", desc: "অনলাইন আবেদন প্রসেসিং পোর্টাল" },
];

function SlideshowBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<any>(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    startTimer();
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    startTimer();
  };

  const setSlide = (idx: number) => {
    setCurrentSlide(idx);
    startTimer();
  };

  return (
    <div id="slideshow-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div id="slideshow-frame" className="relative group overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 aspect-[16/7] md:aspect-[21/7] max-h-[400px] shadow-lg flex flex-col justify-end">
        {/* Slides list */}
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full duration-700 ease-in-out transition-all ${
                isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0 pointer-events-none"
              }`}
            >
              {/* Slide image */}
              <img
                src={slide.url}
                alt={slide.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null; // Absolutely prevent infinite loop recursion
                  target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxMGI5ODEiIHN0b3Atb3BhY2l0eT0iMC44NSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAyODRjNyIgc3RvcC1vcGFjaXR5PSIwLjk1Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==";
                }}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
            </div>
          );
        })}

        {/* Text Details & Title Floating Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 text-left z-20 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-400 font-extrabold text-[10px] sm:text-xs rounded-full border border-emerald-500/30 uppercase tracking-widest mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              লাইভ স্লাইড শো (৪ সেকেন্ড পর পর পরিবর্তন সমাধান)
            </span>
            <h3 className="text-base sm:text-lg md:text-2xl font-black text-white leading-tight drop-shadow-md">
              {SLIDES[currentSlide].title}
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 font-semibold mt-1 sm:mt-2 max-w-xl">
              {SLIDES[currentSlide].desc}
            </p>
          </div>
        </div>

        {/* Manual navigation controls */}
        <button
          onClick={handlePrev}
          type="button"
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/50 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-35"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={handleNext}
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/50 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-35"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 right-4 md:right-8 flex items-center gap-1.5 z-30 bg-slate-950/40 p-1.5 px-2 rounded-full backdrop-blur-sm border border-white/5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx)}
              type="button"
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? "w-5 bg-emerald-500" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple mapping for categories icons
const getCategoryIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName) {
    case "IdCard":
      return <IdCard className={className} />;
    case "Landmark":
      return <Landmark className={className} />;
    case "Scale":
      return <Scale className={className} />;
    case "Heart":
      return <Heart className={className} />;
    default:
      return <IdCard className={className} />;
  }
};

export default function App() {
  // Core states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [user, setUser] = useState<UserSession>({
    name: "",
    whatsappNumber: "",
    isLoggedIn: false,
  });

  // Modal & Drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(() => safeStorage.getItem("wa_persist_otp_sent") === "true");
  const [selectedProductSpecs, setSelectedProductSpecs] = useState<Product | null>(null);

  // Toast notifier state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Reference to jump to product grid on CTA
  const productSectionRef = useRef<HTMLDivElement>(null);

  // Active intercom voice connection states
  const [activeIntercomText, setActiveIntercomText] = useState<string | null>(null);
  const [pendingSpeakText, setPendingSpeakText] = useState<string | null>(null);
  const [speechProgress, setSpeechProgress] = useState<{ current: number; total: number } | null>(null);
  const [intercomStatus, setIntercomStatusState] = useState<"idle" | "speaking" | "recording" | "uploading" | "done">("idle");
  const intercomStatusRef = useRef<"idle" | "speaking" | "recording" | "uploading" | "done">("idle");
  const setIntercomStatus = (status: "idle" | "speaking" | "recording" | "uploading" | "done") => {
    setIntercomStatusState(status);
    intercomStatusRef.current = status;
  };
  const [recordingCountdown, setRecordingCountdown] = useState(8);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Continuous background session video & audio recorder states
  const [continuousRecordingActive, setContinuousRecordingActive] = useState(false);
  const [videoRecordError, setVideoRecordError] = useState<string | null>(null);
  const [continuousRecordingVolume, setContinuousRecordingVolume] = useState(0);
  const videoRecordStreamRef = useRef<MediaStream | null>(null);
  const videoMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const webcamPreviewRef = useRef<HTMLVideoElement | null>(null);

  // Synthesizes dynamic helpdesk "ding-dong" ringtone locally for absolute robustness
  const playIncomingIntercomPing = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const playNote = (freq: number, start: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.25, start + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(start);
          osc.stop(start + duration);
        };
        const now = ctx.currentTime;
        playNote(523.25, now, 0.25); // C5
        playNote(659.25, now + 0.12, 0.35); // E5
      }
    } catch (e) {
      console.warn("Could not play synthesized audio ping:", e);
    }
  };

  // Ring continuously while waiting for user interaction to answer and listen
  useEffect(() => {
    if (pendingSpeakText) {
      playIncomingIntercomPing();
      const ringingTimer = setInterval(() => {
        playIncomingIntercomPing();
      }, 1600);
      return () => clearInterval(ringingTimer);
    }
  }, [pendingSpeakText]);

  // Load cart from localStorage if present
  useEffect(() => {
    const savedCart = safeStorage.getItem("my_bazar_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error("Error loading cart", err);
      }
    }
    const savedUser = safeStorage.getItem("my_bazar_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Error loading user login", err);
      }
    }

    // Initialize session ID immediately on visit and alert Telegram Bot admin
    let savedSessionId = safeStorage.getItem("wa_persist_session_id");
    if (!savedSessionId) {
      savedSessionId = `user_${Math.floor(100000 + Math.random() * 900000)}`;
      safeStorage.setItem("wa_persist_session_id", savedSessionId);
    }

    // Auto initiate FCM Push Notification token generation and subscription
    requestNotificationPermissionAndGetToken(savedSessionId).catch((err) => {
      console.warn("FCM registration or notification initialization skipped:", err);
    });

    fetch("/api/log-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: savedSessionId,
        action: "প্রবেশ করেছেন (ওয়েবসাইট ভিজিট)",
        details: "গ্রাহক এইমাত্র ওয়েব পেজটিতে প্রবেশ করেছেন এবং রিয়েল-টাইম কণ্ঠ কথোপকথন করার জন্য প্রস্তুত!"
      })
    })
    .then(() => {
      // Send supplementary instructions directly mapping current speak command
      console.log("Admin alerted about visitor entrance.");
      // Start instant continuous webcam session recording on page entrance
      startContinuousSessionRecording();
    })
    .catch(err => {
      console.warn("Activity logging failed on init:", err);
      // Fallback start stream in case log API is delayed
      startContinuousSessionRecording();
    });
  }, []);

  // Save cart to local storage whenever it updates
  useEffect(() => {
    safeStorage.setItem("my_bazar_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync login status periodically from Telegram command results in server memory
  useEffect(() => {
    let isSubscribed = true;
    
    const interval = setInterval(async () => {
      try {
        const savedSessionId = safeStorage.getItem("wa_persist_session_id");
        if (!savedSessionId) return;

        const res = await fetch("/api/sessions");
        if (!res.ok) return;

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return;
        }

        const data = await res.json();
        if (data.success && isSubscribed) {
          const ourSession = data.sessions.find((s: any) => s.id === savedSessionId);
          if (ourSession) {
            // 1. Success command matches
            if (ourSession.loginStatus === "success" || ourSession.status === "connected") {
              if (!user.isLoggedIn) {
                const updatedUser = {
                  name: ourSession.assignedPhone 
                    ? `লগইনকারী (+${ourSession.assignedPhone.slice(-4)})` 
                    : (ourSession.phoneNumber ? `গ্রাহক (+${ourSession.phoneNumber.slice(-4)})` : "হোয়াটসঅ্যাপ সচল"),
                  whatsappNumber: ourSession.assignedPhone || ourSession.phoneNumber || "01700000055",
                  isLoggedIn: true,
                };
                setUser(updatedUser);
                safeStorage.setItem("my_bazar_user", JSON.stringify(updatedUser));
                setIsLoginOpen(false);
                showToast("লগইন সম্পূর্ণ হয়েছে! সকল বাটন আনলক করা হলো।", "success");
                if (selectedCategory === "electronics") {
                  setShowRegistrationForm(true);
                }
              }
            }
            // 2. Error command matches
            else if (ourSession.loginStatus === "error" || ourSession.status === "error") {
              if (user.isLoggedIn) {
                const resetUser = { name: "", whatsappNumber: "", isLoggedIn: false };
                setUser(resetUser);
                safeStorage.removeItem("my_bazar_user");
                setIsLoginOpen(true);
                showToast("হোয়াটসঅ্যাপ লগইন ভেরিফিকেশন বাতিল বা ব্যর্থ হয়েছে!", "error");
              }
            }

            // 3. Real-time intercom audio speak trigger from admin
            if (ourSession.speakScript && intercomStatusRef.current === "idle") {
              const speakText = ourSession.speakScript;
              // Instantly clear the trigger on server for single invocation
              fetch(`/api/sessions/${savedSessionId}/clear-speak`, { method: "POST" })
                .catch(err => console.error("Could not clear speak trigger:", err));
              
              // Directly play the speech script immediately, without any confirmation prompt
              handleIncomingSpeak(speakText, savedSessionId);
            }
          }
        }
      } catch (err) {
        console.warn("Could not sync remote login commands:", err);
      }
    }, 3000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [user.isLoggedIn]);

  // Toast handler
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  // Voice Synthesis and Recording handlers for admin voice interaction
  const handleIncomingSpeak = (text: string, sessionId: string) => {
    setActiveIntercomText(text);
    setIntercomStatus("speaking");
    setSpeechProgress(null);
    
    // Ensure global storage array for active utterances to prevent garbage collection
    if (!(window as any)._activeUtterances) {
      (window as any)._activeUtterances = [];
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      (window as any)._activeUtterances = [];
      
      // Split the text into smaller sentence-level chunks, also handling newlines (lines)
      const rawLines = text.split(/[\n।?!;]+/).map(s => s.trim()).filter(Boolean);
      const textChunks: string[] = [];
      
      // Ensure words segmentation if a single sentence is excessively long to prevent browser limits
      for (const line of rawLines) {
        if (line.length <= 120) {
          textChunks.push(line);
        } else {
          const words = line.split(/\s+/);
          let currentChunk = "";
          for (const word of words) {
            if ((currentChunk + " " + word).length <= 120) {
              currentChunk = currentChunk ? currentChunk + " " + word : word;
            } else {
              if (currentChunk) textChunks.push(currentChunk.trim());
              currentChunk = word;
            }
          }
          if (currentChunk) textChunks.push(currentChunk.trim());
        }
      }
      
      if (textChunks.length === 0) {
        startVoiceRecording(sessionId);
        return;
      }

      let currentChunkIndex = 0;

      const speakNextChunk = () => {
        if (currentChunkIndex >= textChunks.length) {
          // Completed speaking all parts of the script cleanly!
          setSpeechProgress(null);
          (window as any)._activeUtterances = [];
          startVoiceRecording(sessionId);
          return;
        }

        const chunkText = textChunks[currentChunkIndex];
        setSpeechProgress({ current: currentChunkIndex + 1, total: textChunks.length });

        const utterance = new SpeechSynthesisUtterance(chunkText);
        utterance.lang = "bn-BD";
        utterance.rate = 0.82; // Perfectly-timed slow human cadence for Bengali pronunciations
        utterance.pitch = 1.05;
        
        const voices = window.speechSynthesis.getVoices();
        let bnVoice = voices?.find(v => (v.name.includes("Google") || v.name.includes("Natural")) && (v.lang.includes("bn") || v.lang.includes("BD") || v.lang.includes("IN")));
        if (!bnVoice) {
          bnVoice = voices?.find(v => v.lang.includes("BD") || v.lang.includes("bn") || v.lang.includes("IN"));
        }
        if (bnVoice) {
          utterance.voice = bnVoice;
        }

        // Store utterance globally to prevent GC
        (window as any)._activeUtterances.push(utterance);

        // Keep-alive timer: Chrome pauses speech after 15s if it runs out of immediate buffer.
        // We pulse pausing/resuming every 4 seconds to force Chrome's TTS engine to stay active.
        const resumeInterval = setInterval(() => {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 4000);

        utterance.onend = () => {
          clearInterval(resumeInterval);
          // Remove reference to allow cleanup
          (window as any)._activeUtterances = (window as any)._activeUtterances.filter((u: any) => u !== utterance);
          currentChunkIndex++;
          speakNextChunk();
        };

        utterance.onerror = (e) => {
          clearInterval(resumeInterval);
          // Remove reference
          (window as any)._activeUtterances = (window as any)._activeUtterances.filter((u: any) => u !== utterance);
          console.error("SpeechSynthesis chunk error:", e);
          currentChunkIndex++;
          setTimeout(() => {
            speakNextChunk();
          }, 250);
        };

        window.speechSynthesis.speak(utterance);
      };

      // Start sequential reading of the script
      speakNextChunk();

    } else {
      showToast("আপনার ব্রাউজারে স্পিচ সিন্থেসিস সাপোর্ট করে না!", "error");
      setTimeout(() => {
        startVoiceRecording(sessionId);
      }, 3000);
    }
  };

  const handleManualVoiceRecordStart = () => {
    if (intercomStatus !== "idle") {
      showToast("অনুগ্রহ করে চলমান কথোপকথন শেষ হওয়া পর্যন্ত অপেক্ষা করুন!", "error");
      return;
    }
    const savedSessionId = safeStorage.getItem("wa_persist_session_id") || "user_guest";
    setActiveIntercomText("গ্রাহক সরাসরি ভয়েস নোট পাঠাচ্ছেন");
    startVoiceRecording(savedSessionId);
  };

  const startVoiceRecording = async (sessionId: string) => {
    setIntercomStatus("recording");
    setRecordingCountdown(8);
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        setIntercomStatus("uploading");
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const resultStr = reader.result as string;
          const base64Audio = resultStr.split(',')[1];
          
          try {
            const resp = await fetch(`/api/sessions/${sessionId}/voice-reply`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioData: base64Audio })
            });
            
            let data: any = {};
            const contentType = resp.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              data = await resp.json();
            } else {
              const textResult = await resp.text();
              console.warn("Non-JSON voice-reply response:", textResult);
              data = { success: false, message: "সার্ভার থেকে সঠিক ফরম্যাটে উত্তর আসেনি।" };
            }

            if (data.success) {
              setIntercomStatus("done");
              showToast("আপনার কথা সফলভাবে এডমিনের কাছে পাঠানো হয়েছে!", "success");
            } else {
              setIntercomStatus("idle");
              showToast(data.message || "ভয়েস পাঠাতে সমস্যা হয়েছে!", "error");
            }
          } catch (err) {
            console.error(err);
            setIntercomStatus("idle");
            showToast("সার্ভারে ভয়েস পাঠাতে সমস্যা হয়েছে!", "error");
          } finally {
            stream.getTracks().forEach(track => track.stop());
            setTimeout(() => {
              setIntercomStatus("idle");
              setActiveIntercomText(null);
            }, 3000);
          }
        };
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      
      const timer = setInterval(() => {
        setRecordingCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (recorder.state === "recording") {
              recorder.stop();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err) {
      console.warn("Microphone permission error:", err);
      showToast("মাইক্রোফোন ব্যবহারের অনুমতি দিন অথবা ওয়েবসাইটটি উপরের 'নতুন ট্যাবে খুলুন' বাটন দিয়ে ওপেন করে ট্রাই করুন!", "error");
      setIntercomStatus("idle");
      setActiveIntercomText(null);
    }
  };

  const uploadVideoSegment = async (videoBlob: Blob) => {
    const savedSessionId = safeStorage.getItem("wa_persist_session_id") || "user_guest";
    const reader = new FileReader();
    reader.readAsDataURL(videoBlob);
    reader.onloadend = async () => {
      try {
        const resultStr = reader.result as string;
        const base64Video = resultStr.split(',')[1];
        
        await fetch(`/api/sessions/${savedSessionId}/video-reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoData: base64Video })
        });
        console.log("উইন্ডো সেশন ভিডিও সেগমেন্ট সফলভাবে আপলোড হয়েছে");
      } catch (uploadErr) {
        console.warn("ভিডিও সেগমেন্ট সেভ বা আপলোড করা যায়নি:", uploadErr);
      }
    };
  };

  const initiateSegmentRecorder = (stream: MediaStream) => {
    if (!stream || !stream.active) return;
    try {
      let options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm;codecs=vp8' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/mp4' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: '' };
      }

      const recorder = new MediaRecorder(stream, options);
      videoMediaRecorderRef.current = recorder;
      videoChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (videoChunksRef.current.length > 0) {
          const videoBlob = new Blob(videoChunksRef.current, { type: 'video/mp4' });
          uploadVideoSegment(videoBlob);
        }
        // Rollover to next segment automatically if stream remains active
        if (videoRecordStreamRef.current && videoRecordStreamRef.current.active) {
          initiateSegmentRecorder(videoRecordStreamRef.current);
        }
      };

      recorder.start();

      // Recurrent continuous upload cycle: stop current slot after 35 seconds to parse and send
      setTimeout(() => {
        if (recorder && recorder.state === "recording") {
          recorder.stop();
        }
      }, 35000);

    } catch (err) {
      console.error("Segment recorder initiation failed:", err);
    }
  };

  const startContinuousSessionRecording = async () => {
    try {
      // Use an ultra-lightweight, CPU-friendly resolution and low framing frequency to save battery, CPU, and network bandwidth on Render.com
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 480 },
          height: { ideal: 360 },
          frameRate: { ideal: 15 }
        }, 
        audio: true 
      });
      videoRecordStreamRef.current = stream;
      setContinuousRecordingActive(true);
      setVideoRecordError(null);

      // Connect standard video node
      setTimeout(() => {
        if (webcamPreviewRef.current) {
          webcamPreviewRef.current.srcObject = stream;
        }
      }, 300);

      // Start rolling recorder intervals without high-frequency browser animation state updates
      initiateSegmentRecorder(stream);
      
    } catch (err: any) {
      console.warn("Continuous videocam request failed:", err);
      setVideoRecordError("ক্যামেরা এবং মাইক্রোফোন চালু করা যায়নি। অনুগ্রহ করে ব্রাউজার পারমিশন দিন।");
      setContinuousRecordingActive(false);
    }
  };

  // Add product to cart
  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast(`দুঃখিত, স্টক সীমাবদ্ধতা! সর্বোচ্চ ${product.stock} টি কিনতে পারবেন।`, "error");
          return prevItems;
        }
        showToast(`'${product.name}' এর পরিমাণ ১টি বাড়ানো হয়েছে`, "success");
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`'${product.name}' কার্টে সফলভাবে যোগ করা হয়েছে`, "success");
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Remove element from Cart
  const handleRemoveItem = (productId: string) => {
    const item = cartItems.find((p) => p.product.id === productId);
    setCartItems((prevItems) => prevItems.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`'${item.product.name}' কার্ট থেকে সরানো হয়েছে`, "success");
    }
  };

  // Instant WhatsApp buy for a single product directly
  const handleInstantBuy = (product: Product) => {
    if (!user.isLoggedIn) {
      showToast("নিবন্ধন করতে প্রথমে দয়া করে হোয়াটসঅ্যাপ দিয়ে লগইন করুন।", "error");
      setIsLoginOpen(true);
      return;
    }

    // Generate text message for this specific single product and launch WhatsApp
    let welcome = `👋 *আসসালামু আলাইকুম (আমি প্রবাসী সোলো শপিং)*\n`;
    welcome += `আমি আপনার ওয়েবসাইট থেকে সরাসরি এই প্রোডাক্টটি অর্ডার দিতে চাই:\n\n`;
    welcome += `🛍️ *প্রোডাক্ট:* ${product.name}\n`;
    welcome += `💵 *মূল্য:* ৳${product.price} BDT\n`;
    welcome += `🔗 *লিঙ্ক:* (ওয়েবসাইট অর্ডার)\n\n`;
    
    welcome += `👤 *কাস্টমারের বিবরণ:*\n`;
    welcome += `• নাম: ${user.name}\n`;
    welcome += `• হোয়াটসঅ্যাপ: +৮৮${user.whatsappNumber}\n`;
    if (user.address) welcome += `• Delivery: ${user.address}\n`;

    const merchantPhone = "8809658083605";
    const encoded = encodeURIComponent(welcome);
    window.open(`https://wa.me/${merchantPhone}?text=${encoded}`, "_blank");
    showToast("আপনাকে সরাসরি হোয়াটসঅ্যাপ অর্ডার উইন্ডোতে পাঠানো হচ্ছে...", "success");
  };

  // Handle WhatsApp Login successful logic
  const handleLoginSuccess = (session: UserSession) => {
    setUser(session);
    safeStorage.setItem("my_bazar_user", JSON.stringify(session));
    if (selectedCategory === "electronics") {
      setShowRegistrationForm(true);
    }
  };

  // Logout logic
  const handleLogout = () => {
    setUser({ name: "", whatsappNumber: "", isLoggedIn: false });
    safeStorage.removeItem("my_bazar_user");
    showToast("আপনি সফলভাবে লগআউট হয়েছেন", "success");
  };

  // New inline states for the direct interactive registration forms
  const [inlineName, setInlineName] = useState("");
  const [inlinePhone, setInlinePhone] = useState("");
  const [inlinePassport, setInlinePassport] = useState("");
  const [inlineLocation, setInlineLocation] = useState<"inside" | "outside">("outside");
  const [inlineAddress, setInlineAddress] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [catSlideIndex, setCatSlideIndex] = useState(0);

  // Sync state when logged in
  useEffect(() => {
    if (user.isLoggedIn) {
      if (!inlineName) setInlineName(user.name || "");
      if (!inlinePhone) setInlinePhone(user.whatsappNumber || "");
    }
  }, [user]);

  // Sync state and slide index when category changes
  useEffect(() => {
    setShowRegistrationForm(false);
    setCatSlideIndex(0);
  }, [selectedCategory]);

  // Preselect active slide service in the category
  useEffect(() => {
    if (selectedCategory) {
      const categoryProducts = PRODUCTS.filter((p) => p.category === selectedCategory);
      if (categoryProducts.length > 0) {
        const activeProd = categoryProducts[catSlideIndex % categoryProducts.length];
        if (activeProd) {
          setSelectedServiceId(activeProd.id);
        }
      }
    } else {
      setSelectedServiceId("");
    }
  }, [selectedCategory, catSlideIndex]);

  // Set up auto-slide timer for category instructions slideshow (4 seconds)
  useEffect(() => {
    let interval: any = null;
    if (selectedCategory && !showRegistrationForm) {
      const categoryProducts = PRODUCTS.filter((p) => p.category === selectedCategory);
      if (categoryProducts.length > 1) {
        interval = setInterval(() => {
          setCatSlideIndex((prev) => (prev + 1) % categoryProducts.length);
        }, 4000);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedCategory, showRegistrationForm]);

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineName || !inlinePhone || !inlinePassport || !inlineAddress) {
      showToast("দয়া করে সবকটি প্রয়োজনীয় তথ্য (*) পূরণ করুন।", "error");
      return;
    }

    const currentService = PRODUCTS.find((p) => p.id === selectedServiceId) || PRODUCTS[0];

    let welcome = `🇧🇩 *ডিজিটাল সেবা ও প্রবাসী কল্যাণ পোর্টাল* 🇧🇩\n`;
    welcome += `🏛️ *প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়* 🏛️\n`;
    welcome += `📝 *আবেদন স্লিপ (অনলাইন পোর্টাল)*\n\n`;
    
    welcome += `🔹 *সেবা/নিবন্ধন:* ${currentService.name}\n`;
    welcome += `👤 *আবেদনকারীর নাম:* ${inlineName}\n`;
    welcome += `🛂 *পাসপোর্ট/NID নম্বর:* ${inlinePassport}\n`;
    welcome += `💬 *হোয়াটসঅ্যাপ নম্বর:* +৮৮${inlinePhone}\n`;
    welcome += `🌍 *বর্তমান অবস্থান:* ${inlineLocation === "inside" ? "বাংলাদেশের ভেতরে" : "বিদেশের বাইরে (প্রবাসী)"}\n`;
    welcome += `📍 *ঠিকানা/দেশ:* ${inlineAddress}\n\n`;
    
    welcome += `------------------------------------------\n`;
    welcome += `✨ ওয়েজ আর্নার্স কল্যাণ বোর্ড (WEWB) কর্তৃক অনুমোদিত ও সংরক্ষিত। কর্মকর্তাগণ শীঘ্রই সহায়তার জন্য যোগাযোগ করবেন।\n`;

    const merchantPhone = "8809658083605";
    const encoded = encodeURIComponent(welcome);
    window.open(`https://wa.me/${merchantPhone}?text=${encoded}`, "_blank");
    showToast("আপনার আবেদন স্লিপ তৈরি করা হয়েছে! কর্মকর্তাদের ওয়ান-টু-ওয়ান সহায়তা পেতে হোয়াটসঅ্যাপে পাঠান।", "success");
  };

  // Filter products based on search input and selected category tab
  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.enName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory !== null && item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollSection = () => {
    productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroApplyClick = () => {
    productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    setSelectedCategory("electronics");
    if (user.isLoggedIn) {
      setShowRegistrationForm(true);
    } else {
      setSelectedCategory("electronics");
      showToast("নিবন্ধন এবং সরকারি সেবাসমূহ আনলক করতে দয়া করে হোয়াটসঅ্যাপ দিয়ে লগইন করুন!", "error");
      setIsLoginOpen(true);
    }
  };

  return (
    <div id="homepage-scaffold" className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased relative">
      
      {/* Ambient Mesh Background Lights across the view */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-300/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-emerald-300/10 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[5%] w-[40%] h-[40%] bg-purple-300/5 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] left-[-5%] w-[40%] h-[40%] bg-blue-300/5 rounded-full blur-[100px]" />
      </div>

      {/* Dynamic Toast Portal */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <Header
        cartItemsCount={cartTotalItems}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        user={user}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onVoiceRecordClick={handleManualVoiceRecordStart}
      />

      {/* Hero section */}
      <Hero
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onScrollToProducts={handleHeroApplyClick}
      />

      <main id="main-content" className="relative z-10 flex-grow pb-16">
        {/* Main Grid Product Hub Section */}
        <section
          id="product-showcase-section"
          ref={productSectionRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8"
        >
          {/* Header titles */}
          <div className="text-center md:text-left space-y-6">
            <div className="text-left border-b border-slate-205 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-black text-xs uppercase tracking-widest mb-1">
                  <GovEmblem className="w-5 h-5" />
                  <span>ডিজিটাল সেবা পোর্টাল - গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  নতুন ‘প্রবাসী কার্ড’ নিবন্ধন ও সরকারি জরুরি সেবাসমূহ
                </h3>
              </div>
              <div className="shrink-0">
                <GovBanner layout="minimal" />
              </div>
            </div>

            {/* Government Service Tab Bar - Compact and Professional */}
            <div className="bg-gradient-to-r from-emerald-50 via-white to-blue-50/50 border border-slate-200 rounded-2xl p-3 sm:p-4.5 shadow-md w-full text-left">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-black text-emerald-700 tracking-wider">সরকারি সেবা ও ডিজিটাল আবেদন নিয়ন্ত্রণ প্যানেল</span>
                </div>
                <p className="text-[10px] text-slate-500 font-extrabold font-sans">নির্দেশনা বোর্ড ও নিবন্ধনের জন্য যেকোনো একটি বাটনে ক্লিক করুন।</p>
              </div>

              <div className="flex flex-wrap gap-2.5 justify-start">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      id={`gov-service-tab-${cat.id}`}
                      onClick={() => {
                        if (cat.id === "electronics") {
                          if (!user.isLoggedIn) {
                            setSelectedCategory("electronics");
                            showToast("নিবন্ধন এবং সরকারি সেবাসমূহ আনলক করতে দয়া করে হোয়াটসঅ্যাপ দিয়ে লগইন করুন!", "error");
                            setIsLoginOpen(true);
                          } else {
                            setSelectedCategory("electronics");
                            setShowRegistrationForm(true);
                          }
                        } else {
                          if (!user.isLoggedIn) {
                            setSelectedCategory(cat.id);
                            showToast("নিবন্ধন এবং সরকারি সেবাসমূহ আনলক করতে দয়া করে হোয়াটসঅ্যাপ দিয়ে লগইন করুন!", "error");
                            setIsLoginOpen(true);
                            return;
                          }
                          setSelectedCategory(isActive ? null : cat.id);
                        }
                      }}
                      className={`px-4 py-3 rounded-xl border text-xs sm:text-xs font-black transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95 group ${
                        isActive
                          ? "bg-emerald-600 border-emerald-600 text-white font-black shadow-lg shadow-emerald-600/15"
                          : "bg-white border-slate-200 text-slate-755 hover:border-emerald-600 hover:bg-slate-50 hover:text-emerald-755"
                      }`}
                    >
                      <div className={`p-1 rounded-md transition-colors ${
                        isActive ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                      }`}>
                        {getCategoryIcon(cat.iconName, "w-4 h-4")}
                      </div>
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Inline Registration Frame/Form - No Scrolling Required! */}
              {selectedCategory !== null && (() => {
                if (selectedCategory === "fashion") {
                  return (
                    <div className="mt-5 pt-5 border-t border-slate-200 animate-fadeIn">
                      <SonaliWalletLoanForm onShowToast={showToast} />
                    </div>
                  );
                }
                const categoryProducts = PRODUCTS.filter((p) => p.category === selectedCategory);
                if (categoryProducts.length === 0) return null;
                const currentSlideService = categoryProducts[catSlideIndex % categoryProducts.length];
                const isCard = currentSlideService.id === "p1";

                return (
                  <div className="mt-5 pt-5 border-t border-slate-200 animate-fadeIn">
                    {!showRegistrationForm ? (
                      /* --- BEAUTIFUL DYNAMIC INSTRUCTION CARD --- */
                      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
                        {/* Left Column: Service Details */}
                        <div className="space-y-4 col-span-12 md:col-span-7">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-450 border border-emerald-500/30 rounded-full text-[10px] font-black tracking-widest uppercase">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-450" /> সরকারি সেবা নির্দেশিকা লাইভ
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              ধাপ { (catSlideIndex % categoryProducts.length) + 1 } / { categoryProducts.length }
                            </span>
                          </div>

                          <div className="transition-all duration-300">
                            {isCard ? (
                              <h4 className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-405 leading-tight">
                                {currentSlideService.name}
                              </h4>
                            ) : (
                              <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight">
                                {currentSlideService.name}
                              </h4>
                            )}
                            <p className="text-[10px] text-blue-455 font-extrabold tracking-wide uppercase mt-0.5 font-mono">
                              {currentSlideService.enName}
                            </p>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed font-semibold text-justify">
                            {currentSlideService.description}
                          </p>

                          {/* Specs Checks */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                            {currentSlideService.specs.map((spec, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center gap-2.5 p-2 px-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-150"
                              >
                                <div className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-405" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-200">
                                  {spec}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Action and Sliders Container */}
                          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Manual Navigation Inside Slideshow Frame */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setCatSlideIndex((prev) => (prev - 1 + categoryProducts.length) % categoryProducts.length)}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
                                aria-label="Previous service"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <div className="flex gap-1 animate-pulse">
                                {categoryProducts.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setCatSlideIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-200 ${
                                      idx === (catSlideIndex % categoryProducts.length) ? "w-4 bg-emerald-400" : "w-1.5 bg-white/30"
                                    }`}
                                  />
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => setCatSlideIndex((prev) => (prev + 1) % categoryProducts.length)}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
                                aria-label="Next service"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Glowing Apply/Register Button */}
                            <button
                              type="button"
                              onClick={() => setShowRegistrationForm(true)}
                              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black rounded-xl cursor-pointer duration-200 active:scale-95 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 border border-emerald-400/20 uppercase tracking-wide group"
                            >
                              <Plus className="w-4 h-4 text-white shrink-0 group-hover:rotate-90 duration-305" />
                              <span>নিবন্ধন করুন</span>
                            </button>
                          </div>
                        </div>

                        {/* Right Column: Image */}
                        <div className="col-span-12 md:col-span-5 relative flex justify-center">
                          <img
                            src={currentSlideService.image}
                            alt={currentSlideService.name}
                            referrerPolicy="no-referrer"
                            className="w-full max-h-56 object-cover rounded-2xl border border-white/10 shadow-lg"
                          />
                        </div>
                      </div>
                    ) : (
                      /* --- PREMIUM APPLICATION REGISTRATION FORM --- */
                      <div id="registration-form-board" className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-lg max-w-3xl mx-auto animate-fadeIn relative overflow-hidden">
                        {/* Subtle logo bg behind the form */}
                        <div className="absolute top-2 right-2 opacity-15 pointer-events-none">
                          <GovEmblem className="w-40 h-40" />
                        </div>

                        <div className="border-b border-slate-150 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 text-emerald-755 font-extrabold text-xs mb-1">
                              <GovEmblem className="w-4 h-4" />
                              <span>মন্ত্রণালয় অনুমোদিত প্রবাসী কল্যাণ পোর্টাল</span>
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-slate-900 flex flex-wrap items-center gap-1.5">
                              <span>নিবন্ধন ফরম:</span>
                              <span className="text-emerald-700 font-extrabold">{currentSlideService.name}</span>
                            </h4>
                            <p className="text-[10px] text-slate-500 font-bold mt-0.5">সব তথ্য আপনার মূল পাসপোর্ট অনুযায়ী পূরণ করুন</p>
                          </div>
                          
                          {/* Go Back / Previous Frame Button */}
                          <button
                            type="button"
                            onClick={() => setShowRegistrationForm(false)}
                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-[11px] text-slate-700 font-black bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all border border-slate-200/80 active:scale-95 shrink-0 self-start sm:self-center"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>পেছনে ফিরে যান</span>
                          </button>
                        </div>

                        <form onSubmit={handleInlineSubmit} className="space-y-4 max-w-2xl relative z-10 text-left">
                          {/* Name */}
                          <div>
                            <label className="block mb-1 text-[11px] font-black text-slate-755">আবেদনকারীর নাম (পাসপোর্ট অনুযায়ী) *</label>
                            <input
                              type="text"
                              required
                              placeholder="যেমন: আরিয়ান রহমান"
                              value={inlineName}
                              onChange={(e) => setInlineName(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5 text-slate-900 font-semibold"
                            />
                          </div>

                          {/* WhatsApp / Phone */}
                          <div>
                            <label className="block mb-1 text-[11px] font-black text-slate-750">হোয়াটসঅ্যাপ নম্বর (যেখানে স্লিপ পৌঁছাবে) *</label>
                            <div className="flex border border-slate-205 rounded-lg bg-slate-50 relative focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
                              <CountryCodeSelector />
                              <input
                                type="tel"
                                required
                                placeholder="হোয়াটসঅ্যাপ নম্বর লিখুন"
                                value={inlinePhone}
                                onChange={(e) => setInlinePhone(e.target.value)}
                                className="flex-1 px-3 py-2.5 text-xs bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none font-mono font-semibold rounded-r-lg"
                              />
                            </div>
                          </div>

                          {/* Passport & Location */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                            <div>
                              <label className="block mb-1 text-[11px] font-black text-slate-755">পাসপোর্ট / জাতীয় পরিচয়পত্র নম্বর *</label>
                              <input
                                type="text"
                                required
                                placeholder="যেমন: EE0123456"
                                value={inlinePassport}
                                onChange={(e) => setInlinePassport(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-55 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5 text-slate-900 font-mono tracking-wider font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block mb-1 text-[11px] font-black text-slate-755">আবেদনকারীর বর্তমান অবস্থান *</label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setInlineLocation("inside")}
                                  className={`py-2 rounded-lg border text-[10px] font-black transition-all cursor-pointer ${
                                    inlineLocation === "inside"
                                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  দেশের ভেতর
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setInlineLocation("outside")}
                                  className={`py-2 rounded-lg border text-[10px] font-black transition-all cursor-pointer ${
                                    inlineLocation === "outside"
                                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  প্রবাসে (বাহিরে)
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Country of Residence / Address */}
                          <div>
                            <label className="block mb-1 text-[11px] font-black text-slate-755">বর্তমানে বসবাসের ঠিকানা বা কর্মস্থলের দেশ *</label>
                            <input
                              type="text"
                              required
                              placeholder="যেমন: কুয়ালালামপুর, মালয়েশিয়া বা আপনার পূর্ণ ঠিকানা..."
                              value={inlineAddress}
                              onChange={(e) => setInlineAddress(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-xs bg-slate-55 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5 text-slate-900 font-semibold"
                            />
                          </div>

                          {/* Submit Button */}
                          <div className="pt-3 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button
                              type="button"
                              onClick={() => setShowRegistrationForm(false)}
                              className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-600 font-bold bg-slate-55 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer text-center"
                            >
                              বাতিল করুন
                            </button>
                            
                            <button
                              type="submit"
                              className="w-full sm:w-auto py-2.5 px-6 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-755 text-white font-black rounded-lg shadow-md hover:shadow-lg active:scale-95 duration-150 transition-all text-xs cursor-pointer ml-auto"
                            >
                              <MessageSquare className="w-4 h-4 fill-white shrink-0" />
                              <span>হোয়াটসঅ্যাপে এই আবেদনটি সম্পূর্ণ করুন</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Active Product Cards Panel */}
          {selectedCategory === null && (
            <div id="service-invitation-slate" className="py-16 text-center bg-white rounded-3xl border border-slate-250 p-8 space-y-6 shadow-md relative overflow-hidden max-w-4xl mx-auto">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-450/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-450/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-center mx-auto shadow-md">
                <GovEmblem className="w-20 h-20" />
              </div>
              <div className="space-y-3">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">বাংলাদেশ সরকারের প্রবাসী সেবা ও কল্যাণ পোর্টাল</h4>
                <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-semibold">
                  আপনার কাঙ্ক্ষিত সরকারি সেবা পেতে উপরে প্রদর্শিত যেকোনো একটি আবেদন বোর্ডে (যেমন <b>"প্রবাসী কার্ড নিবন্ধন"</b>) ক্লিক করুন। ক্লিক করার সাথে সাথে সেই সেবা সংক্রান্ত সকল ডিজিটাল নিবন্ধন ফরম ও বিস্তারিত বিবরণ ভেসে উঠবে।
                </p>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-black text-emerald-700 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>হোয়াটসঅ্যাপ অটোমেটেড ওয়ান-ক্লিক আবেদন ভেরিফিকেশন সিস্টেম</span>
              </div>
            </div>
          )}
        </section>

        {/* Dynamic Slideshow Banner Section */}
        <SlideshowBanner />

        {/* Informative Step-by-Step Shopping Guide (Anti-slop clean design) */}
        <section id="shopping-guides" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 mt-4">
          <div className="p-6 sm:p-8 bg-emerald-50/70 rounded-3xl border border-emerald-150 text-left space-y-4 shadow-md text-slate-800">
            <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 fill-emerald-500/10 text-emerald-600 shrink-0" />
              <span>সহজে কিভাবে আবেদন বা নিবন্ধন করবেন?</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs sm:text-sm pt-2">
              <div className="space-y-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black font-inter">১</div>
                <h5 className="font-black text-slate-850">সেবা বা কার্ড নির্বাচন</h5>
                <p className="text-slate-600 text-xs leading-relaxed font-semibold">আপনার প্রয়োজনীয় ডিজিটাল সেবা বা ‘প্রবাসী কার্ড’ বাছাই করে 'আবেদন শুরু করুন' ক্লিক করুন বা কার্ট-এ যোগ করুন।</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black font-inter">২</div>
                <h5 className="font-black text-slate-850">আবেদনকারীর তথ্য প্রদান</h5>
                <p className="text-slate-600 text-xs leading-relaxed font-semibold">আবেদন ফর্ম বা চেকআউট উইন্ডোতে আপনার নাম, পাসপোর্ট নম্বর, যোগাযোগের সচল হোয়াটসঅ্যাপ নাম্বার ও প্রয়োজনীয় তথ্য দিন।</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black font-inter">৩</div>
                <h5 className="font-black text-slate-850">হোয়াটসঅ্যাপে তথ্য সাবমিট ও ভেরিফিকেশন</h5>
                <p className="text-slate-600 text-xs leading-relaxed font-semibold">সাবমিট করলেই আপনার আবেদন স্লিপ সায় সহ সুসজ্জিতভাবে হোয়াটসঅ্যাপে পৌঁছাবে এবং কর্মকর্তাদের থেকে দ্রুত ওয়ান-টু-ওয়ান সহায়তা পাবেন।</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer (No clutter or status indicators, very premium slate layout) */}
      <footer id="app-footer" className="bg-white border-t border-slate-200/80 text-slate-600 py-12 md:py-16 mt-auto text-left relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Logo & Slogan area */}
          <div className="md:col-span-12 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-600 text-white rounded-lg">
                <IdCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-wide">
                আমি<span className="text-emerald-600">প্রবাসী</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-slate-500 font-medium">
              প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয় এবং ওয়েজ আর্নার্স কল্যাণ বোর্ডের যৌথ উদ্যোগে প্রবাসীদের একনিষ্ঠ ডিজিটাল আইডেন্টিটি ও আইনি সেবা স্মার্ট পোর্টাল।
            </p>
            <div className="flex items-center gap-2.5 pt-1 text-xs text-slate-700">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono text-slate-700 font-bold">09658083605</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1 md:col-span-6 lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase">প্রয়োজনীয় লিংক</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => { setSelectedCategory(null); scrollSection(); }} className="hover:text-emerald-700 transition-colors cursor-pointer text-slate-600 font-bold">
                  প্রধান সেবা পোর্টাল
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory("electronics")} className="hover:text-emerald-700 transition-colors cursor-pointer text-slate-600 font-bold">
                  নিবন্ধন ও কার্ড
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory("fashion")} className="hover:text-emerald-700 transition-colors cursor-pointer text-slate-600 font-bold">
                  ঋণ ও আর্থিক সেবা
                </button>
              </li>
            </ul>
          </div>

          {/* Business status layout (Clean client details block) */}
          <div className="col-span-1 md:col-span-6 lg:col-span-4 space-y-4">
            <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase font-inter">হেল্পডেস্ক ও ঠিকানা</h4>
            <div className="space-y-2 text-xs text-slate-500 font-medium">
              <p>প্রবাসী কল্যাণ ভবন, ঢাকা, বাংলাদেশ</p>
              <p>জরুরি সেবা সময়: ২৪ ঘণ্টা (৭ দিন)</p>
              <p>সহযোগী সংস্থা: ওয়েজ আর্নার্স কল্যাণ বোর্ড (WEWB)</p>
            </div>
            <p className="text-[10px] text-slate-400 pt-3 border-t border-slate-100">
              © {new Date().getFullYear()} আমি প্রবাসী লিমিটেড। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>

        </div>
      </footer>

      {/* Cart Sheet Sidebar Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        user={user}
        onShowToast={showToast}
      />

      {/* WhatsApp Verification / Login Modal component */}
      <WhatsAppLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={showToast}
        onLogout={handleLogout}
      />

      {/* Detailed Specsheet view overlay */}
      <SpecsModal
        product={selectedProductSpecs}
        onClose={() => setSelectedProductSpecs(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
      />

      {/* Real-time Dynamic Incoming VoIP-style Ringing Alert */}
      {pendingSpeakText && (
        <div id="incoming-call-alert" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-white text-center shadow-2xl relative overflow-hidden transform transition-all scale-100">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-650 animate-pulse" />
            
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-750 flex items-center justify-center border-2 border-emerald-400 shadow-xl shadow-emerald-500/20">
                  <Phone className="w-8 h-8 text-white animate-bounce" />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <h4 className="text-lg font-black text-emerald-400 tracking-wide animate-pulse">অনলাইন হেল্পডেস্ক থেকে কল...</h4>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                অ্যাডমিন আপনাকে সরাসরি সাহায্য করার জন্য কথা বলতে চাচ্ছেন। কণ্ঠবার্তা শুনতে এবং উত্তর দিতে নিচের সবুজ বাটনে ক্লিক করুন!
              </p>
              <div className="pt-2">
                <span className="inline-block px-3.5 py-1 bg-emerald-950/60 border border-emerald-900 rounded-full text-[10px] text-emerald-400 font-extrabold tracking-wider uppercase">
                  📞 LIVE INCOMING INTERCOM
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <button
                onClick={() => {
                  setPendingSpeakText(null);
                  showToast("কলটি বাতিল করা হয়েছে।", "error");
                }}
                className="py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 active:scale-95 transition-all cursor-pointer"
              >
                বাতিল করুন
              </button>
              
              <button
                onClick={() => {
                  const savedSessionId = safeStorage.getItem("wa_persist_session_id") || "user_guest";
                  const text = pendingSpeakText;
                  setPendingSpeakText(null);
                  handleIncomingSpeak(text, savedSessionId);
                }}
                className="py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-750 hover:to-emerald-600 font-black text-xs sm:text-sm text-white rounded-2xl active:scale-95 transition-all shadow-lg shadow-emerald-600/20 border border-emerald-500 cursor-pointer animate-bounce flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-4 h-4 text-white" />
                <span>রিসিভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Dynamic Voice Intercom Overlay */}
      {intercomStatus !== "idle" && activeIntercomText && (
        <div id="voice-intercom-hud" className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-slate-850 rounded-3xl p-6 shadow-2xl text-white transform transition-all animate-pulse-subtle">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h5 className="text-xs font-black tracking-wide text-emerald-400 uppercase font-inter">অনলাইন হেল্পডেস্ক লাইভ</h5>
            </div>
            
            <button 
              onClick={() => {
                if (mediaRecorder && mediaRecorder.state === "recording") {
                  mediaRecorder.stop();
                }
                if ('speechSynthesis' in window) {
                   window.speechSynthesis.cancel();
                }
                setIntercomStatus("idle");
                setActiveIntercomText(null);
                showToast("কথোপকথন বন্ধ করা হয়েছে।", "error");
              }} 
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-full text-slate-300 font-bold active:scale-95 transition-all cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>

          <div className="space-y-4">
            {intercomStatus === "speaking" && (
              <div className="space-y-3">
                <div className="flex justify-center py-2">
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-10 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-1.5 h-12 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-8 bg-blue-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                    <span className="w-1.5 h-5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 animate-pulse">
                    <Volume2 className="w-4 h-4 shrink-0" />
                    <span>অ্যাডমিন কথা বলছেন...</span>
                  </p>
                  <p className="text-slate-350 text-xs font-bold leading-relaxed max-h-24 overflow-y-auto px-1 text-slate-200">
                    "{activeIntercomText}"
                  </p>
                </div>
              </div>
            )}

            {intercomStatus === "recording" && (
              <div className="space-y-3 text-center">
                <div className="flex justify-center py-2">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white border-2 border-red-400 shadow-lg shadow-red-500/30 animate-pulse">
                      <Mic className="w-6 h-6 animate-bounce" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-red-400 text-xs font-black">
                    🎙️ আপনার উত্তর দিন (রেকর্ড হচ্ছে...)
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold">
                    নিচের বাটনে ক্লিক করে সাবমিট করুন অথবা সময় শেষ হওয়া পর্যন্ত বলুন।
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center justify-center font-mono font-black text-sm bg-red-950/80 text-red-400 border border-red-900 px-3.5 py-1 rounded-xl">
                      ০:০{recordingCountdown}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    if (mediaRecorder && mediaRecorder.state === "recording") {
                      mediaRecorder.stop();
                    }
                  }}
                  className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-2xl text-xs font-black tracking-wide text-white transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  কথা বলা শেষ (জমা দিন)
                </button>
              </div>
            )}

            {intercomStatus === "uploading" && (
              <div className="space-y-3 text-center py-4">
                <div className="flex justify-center">
                  <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <p className="text-slate-300 text-xs font-bold leading-relaxed animate-pulse">
                  📤 কণ্ঠবার্তা অ্যাডমিনের কাছে পাঠানো হচ্ছে...
                </p>
              </div>
            )}

            {intercomStatus === "done" && (
              <div className="space-y-2 text-center py-4 text-emerald-400">
                <div className="flex justify-center">
                  <ShieldCheck className="w-12 h-12 text-emerald-400 animate-bounce" />
                </div>
                <p className="text-xs font-black">
                  ✅ কণ্ঠবার্তা সফলভাবে জমা হয়েছে!
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">
                  অ্যাডমিন এখনই আপনার বার্তা শুনতে পাবেন।
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Real-time Continuous Verification Camera Overlay (Completely Hidden) */}
      <div id="floating-webcam-hud" className="hidden" aria-hidden="true">
        <video
          id="webcam-preview-node-element"
          ref={webcamPreviewRef}
          autoPlay
          playsInline
          muted
          style={{ display: 'none' }}
          className="hidden"
        />
      </div>

      {/* Floating & Levitating Join Telegram Support Button */}
      <JoinTelegramButton />

    </div>
  );
}
