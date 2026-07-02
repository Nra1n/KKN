import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, MapPin, Users, HeartHandshake } from "lucide-react";

interface HeroProps {
  onExploreStruktur: () => void;
  onExploreKegiatan: () => void;
}

export default function Hero({ onExploreStruktur, onExploreKegiatan }: HeroProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Soft delay to trigger beautiful CSS entrance animations
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="home" className="relative pt-36 pb-24 md:pt-44 md:pb-32 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-950 overflow-hidden text-white transition-colors duration-300">
      {/* Decorative glassmorphism glowing orbs from the design spec */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-white/5 rounded-full -mr-36 -mt-36 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Grid Pattern overlay for tech/modern vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold tracking-widest text-blue-100 uppercase transition-all duration-1000 transform ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span>KKN STMIK LOMBOK 2026</span>
          </div>

          {/* Big Title */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight leading-tight transition-all duration-1000 delay-100 transform ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            KKN STMIK LOMBOK <br/>
            <span className="bg-gradient-to-r from-white via-blue-100 to-sky-200 bg-clip-text text-transparent drop-shadow-sm">
              Kelompok 5 Desa Mangkung
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-base sm:text-lg md:text-xl text-blue-100/90 font-sans leading-relaxed max-w-2xl mx-auto transition-all duration-1000 delay-300 transform ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            "Membangun Desa Bersama Melalui Program KKN yang Terintegrasi dan Transparan" — Mengabdi dengan tulus, menciptakan kemajuan nyata, dan mempererat kebersamaan.
          </p>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 transition-all duration-1000 delay-500 transform ${
              animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <button
              onClick={onExploreStruktur}
              className="w-full sm:w-auto px-7 py-3 bg-white text-blue-900 rounded-lg font-bold text-sm shadow-md hover:shadow-lg hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Lihat Profil Kelompok
              <ArrowRight className="w-4 h-4 text-blue-800 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onExploreKegiatan}
              className="w-full sm:w-auto px-7 py-3 bg-blue-500/20 backdrop-blur-md border border-white/25 text-white rounded-lg font-bold text-sm hover:bg-blue-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              Jelajah Kegiatan
            </button>
          </div>
        </div>

        {/* Highlight Stats Panels */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16 md:mt-24 transition-all duration-1000 delay-700 transform ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-blue-500/50 transition">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Lokasi KKN</p>
              <h3 className="text-base font-bold text-white">Desa Mangkung</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 transition">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Sumber Daya</p>
              <h3 className="text-base font-bold text-white">6 Anggota + 1 DPL</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-cyan-500/50 transition">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Fokus Program</p>
              <h3 className="text-base font-bold text-white">Pemberdayaan Desa</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
