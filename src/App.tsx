import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StrukturKelompok from "./components/StrukturKelompok";
import KegiatanSeksi from "./components/KegiatanSeksi";
import KegiatanDetail from "./components/KegiatanDetail";
import LokasiDesa from "./components/LokasiDesa";
import LoginAdmin from "./components/LoginAdmin";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";
import { Dosen, Anggota, Kegiatan, ProfilDesa } from "./types";
import { ArrowUp, Loader2, Sparkles, HeartHandshake } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home"); // home, login, admin, detail
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(true);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [selectedKegiatanId, setSelectedKegiatanId] = useState<string | null>(null);

  // Core lists
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [profilDesa, setProfilDesa] = useState<ProfilDesa | null>(null);

  // <!-- Menampilkan data database -->
  // Fetch all database records for public display
  const fetchData = async () => {
    try {
      const dRes = await fetch("/api/dosen");
      const aRes = await fetch("/api/anggota");
      const kRes = await fetch("/api/kegiatan");
      const pRes = await fetch("/api/profil-desa");

      if (dRes.ok) {
        const dData = await dRes.json();
        setDosenList(dData);
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        setAnggotaList(aData);
      }
      if (kRes.ok) {
        const kData = await kRes.json();
        setKegiatanList(kData);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setProfilDesa(pData);
      }
    } catch (err) {
      console.error("Gagal memuat data publik KKN:", err);
    } finally {
      // 5. Setelah data selesai dimuat spinner/loading screen hilang
      setIsLoadingScreen(false);
    }
  };

  // Initial mount configurations
  useEffect(() => {
    // 1. Fetch backend records
    fetchData();

    // 2. Check persistent admin token
    const token = localStorage.getItem("adminToken");
    if (token === "kkn-secret-auth-token-2026") {
      setIsAdmin(true);
      setCurrentView("admin");
    }

    // 4. Scroll listener for Back to Top Button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("adminToken", token);
    setIsAdmin(true);
    setCurrentView("admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    setCurrentView("home");
  };

  // Smooth scroll helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExploreStruktur = () => {
    const el = document.getElementById("struktur-kelompok");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreKegiatan = () => {
    const el = document.getElementById("kegiatan");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 1. Loading Screen Render
  if (isLoadingScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-[999]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-700 flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20 animate-bounce">
            <span className="text-2xl font-black font-display tracking-wider">KKN</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              KKN STMIK LOMBOK
            </h2>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Kelompok 5 Mangkung 2026
            </p>
          </div>
          <div className="pt-4 flex justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Normal App Layout
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      
      {/* <!-- Navbar --> */}
      {/* Dynamic Floating Sticky Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {/* Screen Views router */}
      <div className="flex-grow">
        {currentView === "home" && (
          <div className="animate-fadeIn">
            {/* Hero Banner with gradients */}
            <Hero
              onExploreStruktur={handleExploreStruktur}
              onExploreKegiatan={handleExploreKegiatan}
            />
            
            {/* <!-- Lokasi Desa KKN --> */}
            <LokasiDesa
              profil={profilDesa}
            />
            
            {/* <!-- Struktur kelompok --> */}
            {/* DPL and Members Cards list */}
            <StrukturKelompok
              dosen={dosenList}
              anggota={anggotaList}
            />

            {/* <!-- Kegiatan --> */}
            {/* Program & Activities lists */}
            <KegiatanSeksi
              kegiatan={kegiatanList}
              onSelectKegiatan={(id) => {
                setSelectedKegiatanId(id);
                setCurrentView("detail");
              }}
            />
          </div>
        )}

        {currentView === "detail" && selectedKegiatanId && (
          <KegiatanDetail
            kegiatanId={selectedKegiatanId}
            onBack={() => {
              setCurrentView("home");
              setSelectedKegiatanId(null);
            }}
          />
        )}

        {currentView === "login" && (
          <LoginAdmin
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={() => {
              setCurrentView("home");
              setSelectedKegiatanId(null);
            }}
          />
        )}

        {currentView === "admin" && isAdmin && (
          <AdminDashboard
            onLogout={handleLogout}
            refreshPublicData={fetchData}
          />
        )}
      </div>

      {/* Footer view for Home and Login tabs */}
      {currentView !== "admin" && <Footer />}

      {/* Floating Kembali Ke Atas (Back to Top) Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-blue-400/20"
          title="Kembali ke Atas"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
