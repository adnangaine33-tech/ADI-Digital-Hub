import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  Search, Clock, Train, PhoneCall, GraduationCap,
  Globe, UserCheck, Landmark, FileText,
  Coins, Trophy, Target, Rocket, Gem, Crown,
  LayoutGrid, Film, PlayCircle, Clapperboard,
  Lightbulb, Smartphone, Car, LogIn, Info, Languages, X, Calendar,
  HeartPulse, Shield, CreditCard, Briefcase, Zap, Map, Tv, MonitorPlay,
  Gavel, Scale, Droplet, Truck, Camera, Newspaper, Video, Youtube,
  Flame, Image, Cpu, DollarSign, CloudSun, Moon, Calculator, MapPin, Cloud,
  Bus, Plane, Siren, LifeBuoy, Download, Share2, CheckCircle
} from 'lucide-react';

let firebaseConfig;
try {
  firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
    apiKey: "dummy", authDomain: "adi.firebaseapp.com", projectId: "adi"
  };
} catch (e) {
  firebaseConfig = { apiKey: "dummy" };
}

let app, auth, db;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

const playPremiumSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {}
};

const ADILogo = ({ size = 40 }) => (
  <div className="relative flex items-center justify-center group" style={{ width: size, height: size }}>
    <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
    <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full animate-float">
      <defs>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FDE047' }} />
          <stop offset="100%" style={{ stopColor: '#A16207' }} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#gold)" strokeWidth="1.5" strokeDasharray="12 6" className="animate-spin-slow" />
      <circle cx="50" cy="50" r="41" fill="rgba(2, 6, 23, 0.9)" stroke="url(#gold)" strokeWidth="1" />
      <text x="50%" y="58%" textAnchor="middle" fill="url(#gold)" style={{ fontSize: '30px', fontWeight: '900', fontStyle: 'italic' }}>ADI</text>
    </svg>
  </div>
);

const simOffers = [
  { id: 's1', nameBn: "GP অফার", nameEn: "GP Offers", icon: Smartphone, color: "#00a9e0", link: "https://www.grameenphone.com/" },
  { id: 's2', nameBn: "রবি অফার", nameEn: "Robi Offers", icon: Smartphone, color: "#e31837", link: "https://www.robi.com.bd/" },
  { id: 's3', nameBn: "BL অফার", nameEn: "BL Offers", icon: Smartphone, color: "#ff8200", link: "https://www.banglalink.net/" },
  { id: 's4', nameBn: "এয়ারটেল অফার", nameEn: "Airtel Offers", icon: Smartphone, color: "#ed1c24", link: "https://www.bd.airtel.com/" },
  { id: 's5', nameBn: "টেলিটক অফার", nameEn: "Teletalk Offers", icon: Smartphone, color: "#77bc1f", link: "http://www.teletalk.com.bd/" }
];

const movieHub = [
  { id: 'm1', nameBn: "হলিউড মুভি", nameEn: "Hollywood", icon: Film, color: "#3b82f6", link: "https://m4uhd.tv/" },
  { id: 'm2', nameBn: "বলিউড মুভি", nameEn: "Bollywood", icon: Clapperboard, color: "#f59e0b", link: "https://eversafe.xyz/" },
  { id: 'm6', nameBn: "টফি লাইভ", nameEn: "Toffee", icon: Tv, color: "#fbbf24", link: "https://toffeelive.com/" }
];

const mainServices = [
  { id: 1, nameBn: "জাতীয় পরিচয়পত্র", nameEn: "NID Services", icon: UserCheck, color: "#3b82f6", link: "https://services.nidw.gov.bd/" },
  { id: 2, nameBn: "রেলওয়ে টিকেট", nameEn: "Railway Ticket", icon: Train, color: "#10b981", link: "https://eticket.railway.gov.bd/" },
  { id: 5, nameBn: "৯৯৯ জরুরি সেবা", nameEn: "999 Emergency", icon: PhoneCall, color: "#ef4444", link: "tel:999" },
  { id: 11, nameBn: "চাকরির খবর", nameEn: "Job News", icon: Briefcase, color: "#f43f5e", link: "https://www.bdjobs.com/" },
  { id: 18, nameBn: "চ্যাট জিপিটি", nameEn: "ChatGPT AI", icon: Cpu, color: "#10b981", link: "https://chat.openai.com/" }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ name: "Adi", lang: "bn", savedAt: null });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installDone, setInstallDone] = useState(false);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    const forceLoad = setTimeout(() => setLoading(false), 3000);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      clearInterval(clock);
      clearTimeout(forceLoad);
      unsubscribe();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallDone(true);
        setIsInstalled(true);
        setInstallPrompt(null);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ADI Digital Hub',
        text: 'ADI HUB - Bangladesh Digital Services',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  const isBn = userData.lang === "bn";
  const formatTime = (date) => date.toLocaleTimeString(isBn ? 'bn-BD' : 'en-US');

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><ADILogo size={110} /></div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden font-sans">
      <div className="px-6 py-2 border-b border-slate-800/50 bg-slate-900/40 text-[10px] font-black uppercase text-center text-yellow-500">
        <Clock className="inline mr-2" size={12}/> {formatTime(currentTime)} | PREMIUM HUB ACTIVE
      </div>

      <nav className="sticky top-0 z-[100] px-6 py-4 border-b border-slate-800/50 backdrop-blur-xl bg-[#020617]/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ADILogo size={45} />
          <span className="font-black italic text-yellow-500 ml-2 text-lg">ADI HUB</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowDownload(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-600 text-white text-[11px] font-black uppercase tracking-wider">
            <Download size={14} /> ডাউনলোড
          </button>
          <button onClick={() => setShowAbout(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-white">
            <Info size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 md:p-6 pb-32">
        <div className="text-center py-10">
          <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter">
            {isBn ? 'স্বাগতম,' : 'Welcome,'} <span className="text-yellow-500 uppercase">{userData.name}</span>
          </h2>
          <div className="relative max-w-xl mx-auto mt-8 group px-4">
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
            <input
              type="text" placeholder={isBn ? "সার্ভিস খুঁজুন..." : "Search..."}
              className="w-full pl-16 pr-8 py-6 rounded-full border-2 border-slate-800 bg-slate-900 outline-none focus:border-yellow-500 transition-all shadow-2xl"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-center mb-10 overflow-x-auto no-scrollbar py-2">
          {['all', 'sim', 'movie', 'earn'].map(tab => (
            <button key={tab} onClick={() => { playPremiumSound(); setActiveTab(tab); }}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'bg-yellow-600' : 'bg-slate-800 text-slate-500'}`}>
              {tab === 'all' ? (isBn ? 'সব' : 'All') : tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {(activeTab === 'all' || activeTab === 'sim') && (
            <section className="animate-fade-in">
              <h3 className="text-xl font-black italic mb-6 text-blue-500 flex items-center gap-3 px-2"><Smartphone/> সিম অফার</h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2">
                {simOffers.map(item => (
                  <div key={item.id} onClick={() => setSelectedItem(item)} className="flex-shrink-0 w-32 p-6 rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 hover:border-yellow-500 transition-all flex flex-col items-center cursor-pointer">
                    <item.icon size={28} style={{color: item.color}} />
                    <p className="text-[10px] font-black mt-4 text-center">{isBn ? item.nameBn : item.nameEn}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'movie') && (
            <section className="animate-fade-in">
              <h3 className="text-xl font-black italic mb-6 text-red-500 flex items-center gap-3 px-2"><Film/> মুভি হাব</h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2">
                {movieHub.map(item => (
                  <div key={item.id} onClick={() => setSelectedItem(item)} className="flex-shrink-0 w-32 p-6 rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 hover:border-red-500 transition-all flex flex-col items-center cursor-pointer">
                    <item.icon size={28} style={{color: item.color}} />
                    <p className="text-[10px] font-black mt-4 text-center">{isBn ? item.nameBn : item.nameEn}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {activeTab === 'all' && (
          <div className="mt-12 animate-fade-in">
            <h3 className="text-xl font-black italic mb-6 text-emerald-500 flex items-center gap-3 px-2"><LayoutGrid/> ডিজিটাল সেবা</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
              {mainServices.filter(s => s.nameBn.includes(search) || s.nameEn.toLowerCase().includes(search.toLowerCase())).map(s => (
                <div key={s.id} onClick={() => setSelectedItem(s)} className="p-6 rounded-[3rem] bg-slate-900 border-2 border-slate-800 hover:border-yellow-500 transition-all flex flex-col items-center cursor-pointer">
                  <s.icon size={28} style={{color: s.color}} />
                  <h4 className="font-black text-[11px] mt-4 text-center">{isBn ? s.nameBn : s.nameEn}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <div className="relative w-full max-w-sm p-10 rounded-[3rem] bg-slate-900 border border-slate-800 text-center">
            <selectedItem.icon size={48} className="mx-auto mb-6 text-yellow-500" />
            <h3 className="text-2xl font-black mb-6">{isBn ? selectedItem.nameBn : selectedItem.nameEn}</h3>
            <a href={selectedItem.link} target="_blank" rel="noreferrer" onClick={() => setSelectedItem(null)} className="block w-full py-4 bg-yellow-600 text-white rounded-2xl font-black uppercase">ওপেন করুন</a>
            <button onClick={() => setSelectedItem(null)} className="mt-4 text-slate-500 font-bold">ফিরে যান</button>
          </div>
        </div>
      )}

      {showAbout && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
          <div className="w-full max-w-md p-10 rounded-[3rem] bg-slate-900 border border-slate-800 text-center">
            <ADILogo size={80} />
            <h3 className="text-2xl font-black mt-6 text-yellow-500">ADI HUB v10.0</h3>
            <p className="text-slate-400 mt-4 text-sm font-bold">ডেভলপার: আদনান বিন তানভীর (আদি)</p>
            <button onClick={() => setShowAbout(false)} className="mt-10 py-4 px-10 bg-slate-800 rounded-2xl font-black">বন্ধ করুন</button>
          </div>
        </div>
      )}

      {showDownload && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80">
          <div className="w-full max-w-md rounded-[3rem] bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-8 text-center">
              <ADILogo size={70} />
              <h3 className="text-2xl font-black mt-4 text-white">ADI Digital Hub</h3>
              <p className="text-yellow-200 text-xs font-bold mt-1">v10.0 - Premium Digital Services</p>
            </div>

            <div className="p-8 space-y-4">
              {isInstalled || installDone ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-900/30 border border-emerald-700">
                  <CheckCircle size={22} className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="font-black text-emerald-400 text-sm">ইনস্টল সম্পন্ন!</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">অ্যাপটি আপনার ফোনে ইনস্টল হয়েছে।</p>
                  </div>
                </div>
              ) : (
                <>
                  {installPrompt ? (
                    <button onClick={handleInstall} className="w-full py-4 rounded-2xl bg-yellow-600 text-white font-black uppercase flex items-center justify-center gap-3 text-sm">
                      <Download size={18} /> ফোনে ইনস্টল করুন
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                      <p className="font-black text-yellow-500 text-sm mb-3">ম্যানুয়াল ইনস্টল গাইড</p>
                      <div className="space-y-3 text-left">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-yellow-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                          <p className="text-slate-300 text-[12px] font-bold">Android: Chrome ব্রাউজারে মেনু আইকন (<span className="text-yellow-500">⋮</span>) ক্লিক করুন</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-yellow-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                          <p className="text-slate-300 text-[12px] font-bold">"Add to Home screen" বা "হোম স্ক্রিনে যোগ করুন" সিলেক্ট করুন</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-yellow-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                          <p className="text-slate-300 text-[12px] font-bold">iPhone: Safari-এ Share বাটন চাপুন, তারপর "Add to Home Screen"</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-yellow-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                          <p className="text-slate-300 text-[12px] font-bold">"Add / যোগ করুন" বাটনে ক্লিক করুন - ইনস্টল সম্পন্ন!</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button onClick={handleShare} className="w-full py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white font-black uppercase flex items-center justify-center gap-3 text-sm">
                <Share2 size={18} /> লিংক শেয়ার করুন
              </button>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-slate-500 text-[11px] font-bold text-center">ইন্টারনেট ছাড়াও ব্যবহার করা যাবে (Offline Support)</p>
              </div>
            </div>

            <div className="px-8 pb-8">
              <button onClick={() => setShowDownload(false)} className="w-full py-3 text-slate-500 font-black text-sm">বন্ধ করুন</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spin-slow { animation: rotate 15s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
