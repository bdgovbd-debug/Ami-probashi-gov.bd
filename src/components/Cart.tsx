import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Plus, Minus, MessageSquare, ShieldCheck, MapPin } from "lucide-react";
import { CartItem, UserSession } from "../types";
import { GovEmblem } from "./GovBanner";
import CountryCodeSelector from "./CountryCodeSelector";
import { getGlobalCountry, formatIntlPhoneNumber } from "../utils/countryData";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  user: UserSession;
  onShowToast: (message: string, type: "success" | "error") => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  user,
  onShowToast,
}: CartProps) {
  // Local state for delivery details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Sync with logged-in user when user values change
  useEffect(() => {
    if (user.isLoggedIn) {
      setCustomerName(user.name);
      setCustomerPhone(user.whatsappNumber);
      if (user.address) {
        setDeliveryAddress(user.address);
      }
    } else {
      setCustomerName("");
      setCustomerPhone("");
      setDeliveryAddress("");
    }
  }, [user]);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCharge = deliveryArea === "inside" ? 60 : 120;
  const total = subtotal + deliveryCharge;

  // Formatting integers to Bengali numerals (optional, but looks beautiful). For precision, let's keep BDT standard formatting
  const formatBDT = (num: number) => {
    return `৳${num.toLocaleString("bn-BD")}`;
  };

  // Submit via WhatsApp link
  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      onShowToast("আপনার কার্টটি চমৎকারভাবে খালি রয়েছে!", "error");
      return;
    }

    if (!customerName.trim()) {
      onShowToast("অনুগ্রহ করে কাস্টমারের নাম লিখুন", "error");
      return;
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      onShowToast("একটি সঠিক ১০ বা ১১ ডিজিটের ফোন নম্বর দিন", "error");
      return;
    }

    if (!deliveryAddress.trim()) {
      onShowToast("অনুগ্রহ করে ডেলিভারি ঠিকানা প্রদান করুন", "error");
      return;
    }

    // Assemble the text content in Bengali + markdown decoration for WhatsApp Web/App
    let messageText = `🛍️ *নতুন অর্ডার রিকোয়েস্ট (আমি প্রবাসী)*\n`;
    messageText += `===============================\n\n`;
    
    messageText += `👤 *কাস্টমারের বিবরণ:*\n`;
    messageText += `• নাম: ${customerName}\n`;
    const { dialCode } = getGlobalCountry();
    const formattedPhone = formatIntlPhoneNumber(dialCode, customerPhone);

    messageText += `• হোয়াটসঅ্যাপ নম্বর: +${formattedPhone}\n`;
    messageText += `• ঠিকানা: ${deliveryAddress}\n`;
    messageText += `• অঞ্চল: ${deliveryArea === "inside" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}\n\n`;

    messageText += `📦 *অর্ডারকৃত প্রোডাক্টসমূহ:*\n`;
    cartItems.forEach((item, index) => {
      const itemTotal = item.product.price * item.quantity;
      messageText += `${index + 1}. *${item.product.name}*\n`;
      messageText += `   পরিমাণ: ${item.quantity} টি | দাম: ৳${item.product.price} x ${item.quantity} = ৳${itemTotal}\n`;
    });
    messageText += `\n`;

    messageText += `===============================\n`;
    messageText += `💵 *বিল হিসেব:* \n`;
    messageText += `• প্রোডাক্ট সাবটোটাল: ৳${subtotal}\n`;
    messageText += `• ডেলিভারি চার্জ: ৳${deliveryCharge} (${deliveryArea === "inside" ? "Inside Dhaka" : "Outside Dhaka"})\n`;
    messageText += `• *সর্বমোট বিল্ড মূল্য: ৳${total}*\n\n`;
    
    messageText += `🤝 ধন্যবাদ! আমি এই অর্ডারটি কনফার্ম করতে চাই। অনুগ্রহ করে দ্রুত প্রসেসিং শুরু করুন।`;

    onShowToast("অর্ডার প্রসেস হচ্ছে! আপনাকে হোয়াটসঅ্যাপে রিডাইরেক্ট করা হচ্ছে...", "success");

    // Standard high-converting support phone number of the merchant
    const merchantPhone = "8809658083605";
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${merchantPhone}?text=${encodedMessage}`;

    // Redirect user to WhatsApp target link safely
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="cart-sidebar-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs">
          {/* Blackout click transition wrapper */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            id="cart-sidebar-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-lg bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col z-10 text-slate-800"
          >
            {/* Official Government Top Header Banner */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-2.5 relative overflow-hidden text-left shrink-0">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-emerald-500 to-yellow-500" />
              <GovEmblem className="w-9 h-9 shrink-0" />
              <div className="flex flex-col justify-center">
                <span className="text-[8px] sm:text-[9px] font-black text-amber-700 block tracking-wide uppercase leading-none pb-0.5">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</span>
                <p className="text-[10px] sm:text-xs font-black text-slate-900 leading-tight">
                  • প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান মন্ত্রণালয়
                </p>
                <p className="text-[9px] text-slate-500 font-bold block leading-none mt-0.5">
                  স্মার্ট ডিজিটাল প্রবাসী সেবা ও অর্ডার পোর্টাল
                </p>
              </div>
            </div>

            {/* Header */}
            <div className="p-5 border-b border-slate-250 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-55 bg-emerald-50 border border-emerald-150 rounded-lg text-emerald-650">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg leading-none text-slate-950">আপনার আবেদন ঝুড়ি</h3>
                  <p className="text-xs text-slate-500 mt-1 font-bold">{cartItems.length} টি সেবা/নিবন্ধন যোগ করা হয়েছে</p>
                </div>
              </div>
              <button
                id="close-cart-sidebar"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-200 transition-all cursor-pointer text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Areas */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Product items loop */}
              {cartItems.length === 0 ? (
                <div id="empty-cart-view" className="h-48 flex flex-col items-center justify-center text-center space-y-3">
                  <p className="text-slate-500 font-semibold">আপনার আবেদন তালিকাটি সম্পূর্ণ খালি রয়েছে</p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-emerald-50 border border-emerald-150 text-emerald-700 font-black text-xs rounded-full transition-all cursor-pointer hover:bg-emerald-100"
                  >
                    সেবা নির্বাচন করতে ফিরে যান
                  </button>
                </div>
              ) : (
                <div id="cart-items-list" className="space-y-4">
                  <h4 className="text-xs font-black tracking-wider text-slate-500 uppercase">নির্বাচিত ডিজিটাল সেবাসমূহ</h4>
                  
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 items-center justify-between"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0 pr-1">
                        <h5 className="text-xs font-black text-slate-900 truncate">{item.product.name}</h5>
                        <p className="text-xs text-emerald-700 font-extrabold font-inter mt-0.5">৳{item.product.price} BDT</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-white border border-slate-200 rounded-md py-1 px-1 shrink-0 font-inter text-slate-800">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 hover:bg-slate-100 text-slate-500 disabled:opacity-35 rounded-xs cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-slate-950">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 hover:bg-slate-100 text-slate-500 disabled:opacity-35 rounded-xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery Details Form */}
              {cartItems.length > 0 && (
                <form id="checkout-details-form" onSubmit={handleWhatsAppOrder} className="space-y-4 pt-4 border-t border-slate-250">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black tracking-wider text-slate-500 uppercase">আবেদনকারীর তথ্য ও বিবরণ</h4>
                    {user.isLoggedIn && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-black bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> হোয়াটসঅ্যাপ ভেরিফাইড
                      </span>
                    )}
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block mb-1.5 text-xs font-black text-slate-700">আবেদনকারীর নাম (পাসপোর্ট অনুযায়ী) *</label>
                    <input
                      id="cart-customer-name"
                      type="text"
                      required
                      placeholder="যেমন: আরিয়ান রহমান"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:border-emerald-600 text-slate-900 transition-all font-sans"
                    />
                  </div>

                  {/* WhatsApp/Phone Input */}
                  <div>
                    <label className="block mb-1.5 text-xs font-black text-slate-700">হোয়াটসঅ্যাপ নম্বর (যেখানে আবেদন স্লিপ পৌঁছাবে) *</label>
                    <div className="flex border border-slate-250 rounded-xl bg-slate-50 relative focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                      <CountryCodeSelector />
                      <input
                        id="cart-customer-phone"
                        type="tel"
                        required
                        placeholder="হোয়াটসঅ্যাপ নম্বর লিখুন"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="flex-1 px-3 py-2.5 text-sm bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none font-mono rounded-r-xl"
                      />
                    </div>
                  </div>

                  {/* Delivery Location Area Radio Toggle */}
                  <div>
                    <label className="block mb-1.5 px-0.5 text-xs font-black text-slate-700">আবেদনকারীর বর্তমান অবস্থান *</label>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <label className={`p-2.5 rounded-xl border flex flex-col justify-center items-center text-center cursor-pointer transition-all ${deliveryArea === "inside" ? "border-emerald-500 bg-emerald-50/50 text-emerald-800 font-bold" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                        <input
                          id="area-inside-dhaka"
                          type="radio"
                          name="deliveryArea"
                          value="inside"
                          checked={deliveryArea === "inside"}
                          onChange={() => setDeliveryArea("inside")}
                          className="sr-only"
                        />
                        <span className="text-xs font-black">বাংলাদেশের ভেতরে</span>
                        <span className="text-[11px] font-black mt-0.5 font-inter">অনলাইন প্রসেসিং (১-২ দিন)</span>
                      </label>
                      <label className={`p-2.5 rounded-xl border flex flex-col justify-center items-center text-center cursor-pointer transition-all ${deliveryArea === "outside" ? "border-emerald-500 bg-emerald-50/50 text-emerald-800 font-bold" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                        <input
                          id="area-outside-dhaka"
                          type="radio"
                          name="deliveryArea"
                          value="outside"
                          checked={deliveryArea === "outside"}
                          onChange={() => setDeliveryArea("outside")}
                          className="sr-only"
                        />
                        <span className="text-xs font-black">বিদেশের বাইরে (প্রবাসী)</span>
                        <span className="text-[11px] font-black mt-0.5 font-inter">দূতাবাস ও কুরিয়ার (৩-৫ দিন)</span>
                      </label>
                    </div>
                  </div>

                  {/* Full Delivery Address TextArea */}
                  <div>
                    <label className="block mb-1.5 text-xs font-black text-slate-700">বর্তমানে বসবাসের ঠিকানা বা কর্মস্থলের দেশ *</label>
                    <textarea
                      id="cart-customer-address"
                      rows={2.5}
                      required
                      placeholder="যেমন: কুয়ালালামপুর, মালয়েশিয়া বা আপনার পূর্ণ ঠিকানা..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:border-emerald-600 text-slate-900 transition-all resize-none font-sans"
                    />
                  </div>

                  {/* Place WhatsApp Order Button hidden/visible anchor trigger */}
                  <div className="pt-2">
                    <button
                      id="cart-checkout-whatsapp-btn"
                      type="submit"
                      disabled={cartItems.length === 0}
                      className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-95 text-sm"
                    >
                      <MessageSquare className="w-4 h-4 fill-white shrink-0" />
                      <span>হোয়াটসঅ্যাপের মাধ্যমে আবেদন পত্র পাঠান</span>
                    </button>
                    <p className="text-[10px] text-slate-500 mt-2 text-center font-bold">
                      আবেদন বাটনে চাপলে সরাসরি আপনার তথ্য সহ মেসেজটি কর্মকর্তাদের ওয়ান-টু-ওয়ান সাহায্য পেতে হোয়াটসঅ্যাপ চ্যাটউইন্ডোতে ওপেন হবে।
                    </p>
                  </div>
                </form>
              )}

            </div>

            {/* Billing Summary Sticky Widget */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>সার্ভিস ফি সাবটোটাল</span>
                  <span className="font-extrabold text-slate-800 font-inter">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>অনলাইন প্রসেসিং ও পোর্টাল ফি</span>
                  <span className="font-extrabold text-slate-800 font-inter">{formatBDT(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-dashed border-slate-200">
                  <span>সর্বমোট আবেদন প্রদেয়</span>
                  <span className="text-emerald-700 text-base font-black font-inter">{formatBDT(total)}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
