import React, { useState, useMemo, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  Search, Menu, X, Bell, User, Settings, LogOut, 
  ChevronRight, Calendar, Star, Layout, Shield, 
  Smartphone, CreditCard, Bus, MapPin, Briefcase, 
  ExternalLink, Send, Plus, Trash2, Edit2, CheckCircle2, 
  Moon, Sun, Globe, Heart, MessageSquare, Image, Video,
  Music, Gamepad2, Laptop, ShoppingBag, Terminal, Zap,
  Facebook, Twitter, Instagram, Github, Linkedin, Youtube,
  Coffee, Palette, Camera, Book, Share2, Filter, 
  HelpCircle, Info, Lock, Eye, EyeOff, Mail, Phone,
  Cloud, Download, Upload, RefreshCw, Layers, Grid,
  Clock, Languages, LayoutGrid, Trophy, Crown, Target, 
  Rocket, Gem, DollarSign, Film, Clapperboard, PlayCircle, 
  MonitorPlay, Tv, UserCheck, Train, FileText, PhoneCall, 
  Flame, Siren, Plane, HeartPulse, GraduationCap, Lightbulb, 
  Landmark, Car, Droplet, Cpu, Calculator, Coins
} from 'lucide-react';

// --- ফায়ারবেস কনফিগারেশন ---
// আদনান, তোমার ফায়ারবেস কনসোল থেকে নিচের তথ্যগুলো বসিয়ে নাও। 
// আমি ডামি ডাটা দিয়েছি যাতে এরর না আসে।
const firebaseConfig = {
  apiKey: "AIzaSyDummyKey_Replace_This", 
  authDomain: "adi-digital-ultimate.firebaseapp.com",
  projectId: "adi-digital-ultimate",
  storageBucket: "adi-digital-ultimate.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'adi-digital-ultimate';

// সফট ডিং সাউন্ড
const playPremiumSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (e) {}
};

// গোল্ডেন ভেক্টর লোগো
const ADILogo = ({ size = 40 }) => {
  return (
    <div className="relative flex items-center justify-center group" style={{ width: size, height: size }}>
      <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
      <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full animate-float drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
        <defs>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FDE047' }} />
            <stop offset="100%" style={{ stopColor: '#A16207' }} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#gold)" strokeWidth="1.5" strokeDasharray="12 6" className="animate-spin-slow" />
        <circle cx="50" cy="50" r="41" fill="rgba(2, 6, 23, 0.9)" stroke="url(#gold)" strokeWidth="1" />
        <text x="50%" y="58%" textAnchor="middle" fill="url(#gold)" style={{ fontSize: '30px', fontWeight: '900', fontStyle: 'italic', fontFamily: 'serif' }}>ADI</text>
      </svg>
    </div>
  );
};

// সার্ভিস ডাটা
const simOffers = [
  { id: 's1', nameBn: "GP অফার", nameEn: "GP Offers", icon: Smartphone, color: "#00a9e0", link: "https://www.grameenphone.com/" },
  { id: 's2', nameBn: "রবি অফার", nameEn: "Robi Offers", icon: Smartphone, color: "#e31837", link: "https://www.robi.com.bd/" },
  { id: 's3', nameBn: "BL অফার", nameEn: "BL Offers", icon: Smartphone, color: "#ff8200", link: "https://www.banglalink.net/" },
  { id: 's4', nameBn: "এয়ারটেল অফার", nameEn: "Airtel Offers", icon: Smartphone, color: "#ed1c24", link: "https://www.bd.airtel.com/" },
  { id: 's5', nameBn: "টেলিটক অফার", nameEn: "Teletalk Offers", icon: Smartphone, color: "#77bc1f", link: "http://www.teletalk.com.bd/" }
];

const earningGames = [
  { id: 'g1', nameBn: "গোল্ডেন গেম", nameEn: "Golden Game", icon: Trophy, color: "#FFD700", link: "https://yaoqing.kg9993.com/?referralCode=uao9681" },
  { id: 'g2', nameBn: "মেগা উইন", nameEn: "Mega Win", icon: Crown, color: "#E21313", link: "https://www.77abc.me/?r=nuy0211" },
  { id: 'g3', nameBn: "বেট মাস্টার", nameEn: "Bet Master", icon: Target, color: "#0075C9", link: "https://www.8999bet11.com/?r=zsh8053" },
  { id: 'g4', nameBn: "এক্স-লাইট", nameEn: "X-Lite", icon: Rocket, color: "#6EB43F", link: "https://1xlite-08668.world/mobile?bf=731911c8881c4_4731026357" },
  { id: 'g5', nameBn: "সুপার আর্নিং", nameEn: "Super Earning", icon: Gem, color: "#F47920", link: "https://www.pjok.xin/?r=viz9917" },
  { id: 'g6', nameBn: "আর্ন ১০০", nameEn: "Earn 100", icon: DollarSign, color: "#22c55e", link: "https://earn100.com/" }
];

const movieHub = [
  { id: 'm1', nameBn: "হলিউড মুভি", nameEn: "Hollywood", icon: Film, color: "#3b82f6", link: "https://m4uhd.tv/" },
  { id: 'm2', nameBn: "বলিউড মুভি", nameEn: "Bollywood", icon: Clapperboard, color: "#f59e0b", link: "https://eversafe.xyz/" },
  { id: 'm3', nameBn: "সাউথ মুভি", nameEn: "South Indian", icon: PlayCircle, color: "#10b981", link: "https://www.youtube.com/results?search_query=south+indian+movies" },
  { id: 'm4', nameBn: "বঙ্গ বিডি", nameEn: "Bongo BD", icon: MonitorPlay, color: "#ef4444", link: "https://bongobd.com/" },
  { id: 'm5', nameBn: "বায়োস্কোপ", nameEn: "Bioscope", icon: Video, color: "#06b6d4", link: "https://www.bioscopelive.com/" },
  { id: 'm6', nameBn: "টফি লাইভ", nameEn: "Toffee", icon: Tv, color: "#fbbf24", link: "https://toffeelive.com/" },
  { id: 'm7', nameBn: "সিনেমা বিডি", nameEn: "Cinemaz BD", icon: Film, color: "#8b5cf6", link: "https://cinemazbd.net/" },
  { id: 'm8', nameBn: "123 মুভিজ", nameEn: "123Movies", icon: PlayCircle, color: "#38bdf8", link: "https://ww4.123moviesfree.net/" }
];

const mainServices = [
  { id: 1, nameBn: "জাতীয় পরিচয়পত্র", nameEn: "NID Services", icon: UserCheck, color: "#3b82f6", link: "https://services.nidw.gov.bd/" },
  { id: 2, nameBn: "রেলওয়ে টিকেট", nameEn: "Railway Ticket", icon: Train, color: "#10b981", link: "https://eticket.railway.gov.bd/" },
  { id: 3, nameBn: "পাসপোর্ট চেক", nameEn: "Passport Status", icon: Globe, color: "#0ea5e9", link: "https://www.epassport.gov.bd/" },
  { id: 4, nameBn: "জন্ম নিবন্ধন", nameEn: "Birth Registration", icon: FileText, color: "#06b6d4", link: "https://bdris.gov.bd/" },
  { id: 5, nameBn: "৯৯৯ জরুরি সেবা", nameEn: "999 Emergency", icon: PhoneCall, color: "#ef4444", link: "tel:999" },
  { id: 24, nameBn: "ফায়ার সার্ভিস", nameEn: "Fire Service", icon: Flame, color: "#f97316", link: "http://www.fireservice.gov.bd/" },
  { id: 25, nameBn: "এম্বুলেন্স সেবা", nameEn: "Ambulance", icon: Siren, color: "#ef4444", link: "https://www.findambulance.com/" },
  { id: 26, nameBn: "বাস টিকিট", nameEn: "Bus Ticket", icon: Bus, color: "#10b981", link: "https://www.shohoz.com/bus-tickets" },
  { id: 27, nameBn: "বিমান টিকিট", nameEn: "Air Ticket", icon: Plane, color: "#0ea5e9", link: "https://www.flightexpert.com/" },
  { id: 6, nameBn: "অনলাইন ডাক্তার", nameEn: "Online Doctor", icon: HeartPulse, color: "#14b8a6", link: "https://www.doctorola.com/" },
  { id: 7, nameBn: "পরীক্ষার রেজাল্ট", nameEn: "Exam Results", icon: GraduationCap, color: "#a855f7", link: "http://www.educationboardresults.gov.bd/" },
  { id: 8, nameBn: "বিদ্যুৎ বিল", nameEn: "Electricity Bill", icon: Lightbulb, color: "#f59e0b", link: "https://www.desco.org.bd/" },
  { id: 9, nameBn: "জমির খারিজ", nameEn: "Land Mutation", icon: Landmark, color: "#10b981", link: "https://mutation.land.gov.bd/" },
  { id: 10, nameBn: "ড্রাইভিং লাইসেন্স", nameEn: "Driving License", icon: Car, color: "#64748b", link: "https://bsp.brta.gov.bd/" },
  { id: 11, nameBn: "চাকরির খবর", nameEn: "Job News", icon: Briefcase, color: "#f43f5e", link: "https://www.bdjobs.com/" },
  { id: 12, nameBn: "ই-চালান", nameEn: "E-Chalan", icon: CreditCard, color: "#8b5cf6", link: "https://echallan.gov.bd/" },
  { id: 13, nameBn: "পুলিশ ক্লিয়ারেন্স", nameEn: "Police Clearance", icon: Shield, color: "#3b82f6", link: "https://pcc.police.gov.bd/" },
  { id: 14, nameBn: "ফটো মেকার", nameEn: "Photo Maker", icon: Image, color: "#fbbf24", link: "https://www.cutout.pro/passport-photo-maker" },
  { id: 15, nameBn: "খাজনা আদায়", nameEn: "Land Tax", icon: Scale, color: "#4ade80", link: "https://ldtax.gov.bd/" },
  { id: 17, nameBn: "রক্তের সন্ধান", nameEn: "Blood Finder", icon: Droplet, color: "#ef4444", link: "https://www.bloodman.org/" },
  { id: 18, nameBn: "চ্যাট জিপিটি", nameEn: "ChatGPT AI", icon: Cpu, color: "#10b981", link: "https://chat.openai.com/" },
  { id: 19, nameBn: "বিকাশ লিমিট", nameEn: "bKash Limit", icon: Info, color: "#d946ef", link: "https://www.bkash.com/help/limits" },
  { id: 20, nameBn: "নামাজের সময়", nameEn: "Prayer Times", icon: Moon, color: "#10b981", link: "https://www.islamicfinder.org/world/bangladesh/" },
  { id: 21, nameBn: "আবহাওয়া খবর", nameEn: "Weather", icon: Cloud, color: "#0ea5e9", link: "https://weather.com/" },
  { id: 22, nameBn: "কারেন্সি কনভার্টার", nameEn: "Currency", icon: Calculator, color: "#f59e0b", link: "https://www.xe.com/currencyconverter/" },
  { id: 23, nameBn: "লাইভ ম্যাপ", nameEn: "Google Maps", icon: MapPin, color: "#ef4444", link: "https://www.google.com/maps" }
];

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ name: "", lang: "bn", savedAt: null });
  const [tempName, setTempName] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error("Auth error", e);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      }
    }, (err) => console.error("Firestore error", err));
    return () => unsubscribe();
  }, [user]);

  const handleStart = async (e) => {
    if(e) e.preventDefault();
    if (!tempName.trim()) return;
    
    playPremiumSound();
    setSaveStatus("Saving...");
    
    const newData = { 
      ...userData, 
      name: tempName.trim(), 
      savedAt: new Date().toISOString(),
      userId: user?.uid 
    };

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), newData, { merge: true });
        setSaveStatus("Saved to Cloud!");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch (e) {
        setSaveStatus("Error saving!");
      }
    }
    setUserData(newData);
  };

  const toggleLang = async () => {
    playPremiumSound();
    const newLang = userData.lang === 'bn' ? 'en' : 'bn';
    const updatedData = { ...userData, lang: newLang };
    setUserData(updatedData);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true });
    }
  };

  const isBn = userData.lang === "bn";
  const formatTime = (date) => date.toLocaleTimeString(isBn ? 'bn-BD' : 'en-US');
  const formatDate = (date) => date.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const filteredServices = useMemo(() => {
    return mainServices.filter(s => {
      const name = isBn ? s.nameBn : s.nameEn;
      return name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, isBn]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <ADILogo size={110} />
    </div>
  );

  if (!userData.name) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent"></div>
        <form onSubmit={handleStart} className="w-full max-w-sm p-12 bg-slate-900/40 border border-slate-800 rounded-[3.5rem] backdrop-blur-3xl text-center shadow-2xl relative z-10">
          <ADILogo size={130} />
          <h1 className="text-3xl font-black text-white mt-8 mb-2 italic tracking-tighter">ADI HUB</h1>
          <p className="text-slate-500 text-[10px] mb-12 font-bold uppercase tracking-widest">Premium Service Hub</p>
          <input 
            type="text" 
            placeholder={isBn ? "আপনার নাম লিখুন" : "Enter your name"}
            className="w-full p-6 bg-slate-950/80 border border-slate-700 rounded-2xl text-white text-center font-bold outline-none focus:border-yellow-500 transition-all mb-5"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            required
          />
          <button type="submit" className="w-full py-6 bg-gradient-to-br from-yellow-600 to-yellow-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl">
            {isBn ? "প্রবেশ ও সেভ করুন" : "Save & Enter"} <LogOut size={20} />
          </button>
        </form>
      </div>
    );
  }

  const SectionHeader = ({ title, icon: Icon, colorClass }) => (
    <div className="flex items-center justify-between mb-6 mt-12 px-2">
      <h3 className={`text-xl font-black italic flex items-center gap-3 ${colorClass}`}>
        <Icon size={22} /> {title}
      </h3>
      <div className="h-[1px] flex-grow ml-6 bg-gradient-to-r from-slate-800 to-transparent opacity-20"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <div className="px-6 py-3 border-b border-slate-800/50 bg-slate-900/40 text-center text-[10px] font-black uppercase tracking-widest text-yellow-500">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8">
           <span className="flex items-center gap-2"><Clock size={12}/> {formatTime(currentTime)}</span>
           <span className="flex items-center gap-2"><Calendar size={12}/> {formatDate(currentTime)}</span>
           {saveStatus && <span className="flex items-center gap-2 text-green-500 animate-pulse"><Cloud size={12}/> {saveStatus}</span>}
        </div>
      </div>

      <nav className="sticky top-0 z-[100] px-6 py-4 border-b border-slate-800/50 backdrop-blur-xl bg-[#020617]/80">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <ADILogo size={45} />
            <span className="font-black italic text-yellow-500 tracking-tighter ml-2 text-lg">ADI HUB</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className="px-4 py-2.5 rounded-xl bg-slate-800/60 text-white hover:bg-yellow-600 transition-all text-[10px] font-black uppercase flex items-center gap-2">
              <Languages size={18} /> {userData.lang}
            </button>
            <button onClick={() => { playPremiumSound(); setShowAbout(true); }} className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-800/60 text-white hover:bg-blue-600 transition-all">
              <Info size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 md:p-6 pb-32">
        <div className="text-center py-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic px-4">
            {isBn ? 'স্বাগতম,' : 'Welcome,'} <span className="text-yellow-500 uppercase">{userData.name}</span>
          </h2>
          <div className="relative max-w-xl mx-auto group px-4">
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-500" size={22} />
            <input 
              type="text" 
              placeholder={isBn ? "আপনার সার্ভিসটি খুঁজুন..." : "Search for your service..."}
              className="w-full pl-16 pr-8 py-6 rounded-full border-2 border-slate-800 bg-slate-900 outline-none font-bold text-lg transition-all focus:border-yellow-500 shadow-2xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-start md:justify-center mb-10 overflow-x-auto no-scrollbar py-2 px-2">
           {[
             {id: 'all', bn: 'সব', en: 'All'},
             {id: 'sim', bn: 'সিম অফার', en: 'Sim'},
             {id: 'movie', bn: 'মুভি হাব', en: 'Movies'},
             {id: 'earn', bn: 'আর্নিং গেমস', en: 'Earning'}
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => { playPremiumSound(); setActiveTab(tab.id); }}
               className={`px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-yellow-600 text-white' : 'bg-slate-800/40 text-slate-500 hover:text-slate-300'}`}
             >
               {isBn ? tab.bn : tab.en}
             </button>
           ))}
        </div>

        <div className="space-y-4">
          {(activeTab === 'all' || activeTab === 'sim') && (
            <div>
              <SectionHeader title={isBn ? "সিম অফার" : "Sim Offers"} icon={Smartphone} colorClass="text-blue-500" />
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2">
                {simOffers.map(item => (
                  <div key={item.id} onClick={() => { playPremiumSound(); setSelectedItem(item); }} className="flex-shrink-0 w-32 md:w-36 p-5 rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 hover:border-yellow-500/40 transition-all cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800/50" style={{color: item.color}}><item.icon size={28} /></div>
                      <p className="text-[10px] font-black text-center">{isBn ? item.nameBn : item.nameEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'movie') && (
            <div>
              <SectionHeader title={isBn ? "মুভি হাব" : "Movie Hub"} icon={Film} colorClass="text-red-500" />
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2">
                {movieHub.map(item => (
                  <div key={item.id} onClick={() => { playPremiumSound(); setSelectedItem(item); }} className="flex-shrink-0 w-32 md:w-36 p-5 rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 hover:border-red-500/40 transition-all cursor-pointer shadow-lg shadow-black/40">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800/50" style={{color: item.color}}><item.icon size={28} /></div>
                      <p className="text-[10px] font-black text-center">{isBn ? item.nameBn : item.nameEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'earn') && (
            <div>
              <SectionHeader title={isBn ? "আর্নিং পোর্টাল" : "Earning Portal"} icon={Coins} colorClass="text-yellow-500" />
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2">
                {earningGames.map(item => (
                  <div key={item.id} onClick={() => { playPremiumSound(); setSelectedItem(item); }} className="flex-shrink-0 w-32 md:w-36 p-5 rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 hover:border-yellow-500/40 transition-all cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800/50" style={{color: item.color}}><item.icon size={28} /></div>
                      <p className="text-[10px] font-black text-center">{isBn ? item.nameBn : item.nameEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {activeTab === 'all' && (
          <div>
            <SectionHeader title={isBn ? "ডিজিটাল সেবা" : "Digital Services"} icon={LayoutGrid} colorClass="text-emerald-500" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2">
              {filteredServices.map(s => (
                <div key={s.id} onClick={() => { playPremiumSound(); setSelectedItem(s); }} className="p-5 rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 hover:border-yellow-500/50 transition-all cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-slate-800/40" style={{color: s.color}}><s.icon size={26} /></div>
                  <h4 className="font-black text-[11px] text-center h-8 flex items-center justify-center">{isBn ? s.nameBn : s.nameEn}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showAbout && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
          <div className="relative w-full max-w-md p-10 rounded-[3rem] bg-slate-900 border border-slate-800">
            <button onClick={() => setShowAbout(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={24}/></button>
            <ADILogo size={80} />
            <h3 className="text-3xl font-black mt-8 mb-6 text-yellow-500 italic">ADI HUB v10.0</h3>
            <div className="text-slate-400 space-y-5 font-medium leading-relaxed">
              <p className="p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-r-xl text-yellow-500 text-xs font-bold">
                জরুরি সেবা এবং যাতায়াত টিকেট এখন যুক্ত করা হয়েছে।
              </p>
              <p className="text-[10px] text-yellow-600 font-black uppercase tracking-[0.3em] pt-8 border-t border-slate-800 text-center">Powered by ADI Digital</p>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <div className="relative w-full max-w-sm p-10 rounded-[3rem] bg-slate-900 border border-slate-800 text-center">
            <div className="w-20 h-20 mx-auto rounded-[2rem] bg-slate-800 flex items-center justify-center text-yellow-500 mb-8 animate-float"><selectedItem.icon size={44} /></div>
            <h3 className="text-2xl font-black mb-4 italic">{isBn ? selectedItem.nameBn : selectedItem.nameEn}</h3>
            <p className="text-slate-500 text-xs mb-10 font-bold uppercase tracking-widest">{isBn ? 'এই সার্ভিসটি কি ওপেন করবেন?' : 'Open this service?'}</p>
            <div className="flex flex-col gap-4">
              <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" onClick={() => setSelectedItem(null)} className="py-5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-[1.5rem] font-black shadow-2xl">প্রবেশ করুন</a>
              <button onClick={() => setSelectedItem(null)} className="py-2 text-slate-600 font-bold hover:text-slate-400">ফিরে যান</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
}

export default App;
