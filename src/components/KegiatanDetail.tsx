import React, { useState, useEffect } from "react";
import { Kegiatan, Dokumentasi } from "../types";
import { ChevronLeft, MapPin, Calendar, Clock, BookOpen, Goal, Award, Milestone, Info, Image as ImageIcon, ChevronRight, X } from "lucide-react";

interface KegiatanDetailProps {
  kegiatanId: string;
  onBack: () => void;
}

export default function KegiatanDetail({ kegiatanId, onBack }: KegiatanDetailProps) {
  const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null);
  const [dokumentasiList, setDokumentasiList] = useState<Dokumentasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    // Scroll to top when view changes to detail
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Fetch Kegiatan data and its documentation
    const fetchDetailData = async () => {
      try {
        setIsLoading(true);
        // Fetch single kegiatan detail
        const resKegiatan = await fetch(`/api/kegiatan/${kegiatanId}`);
        if (resKegiatan.ok) {
          const dataKegiatan = await resKegiatan.json();
          setKegiatan(dataKegiatan);
        }

        // Fetch documentation list
        const resDocs = await fetch(`/api/dokumentasi?kegiatan_id=${kegiatanId}`);
        if (resDocs.ok) {
          const dataDocs = await resDocs.json();
          setDokumentasiList(dataDocs);
        }
      } catch (error) {
        console.error("Error loading detail data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailData();
  }, [kegiatanId]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      return new Date(dateStr).toLocaleDateString("id-ID", options);
    } catch {
      return dateStr;
    }
  };

  // Lightbox navigation helpers
  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null && dokumentasiList.length > 0) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : dokumentasiList.length - 1));
    }
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex !== null && dokumentasiList.length > 0) {
      setLightboxIndex((prev) => (prev !== null && prev < dokumentasiList.length - 1 ? prev + 1 : 0));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Memuat detail kegiatan...</p>
      </div>
    );
  }

  if (!kegiatan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="text-center max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
          <Info className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Kegiatan Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Maaf, rincian data kegiatan ini tidak berhasil ditemukan atau telah dihapus.</p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-sm active:scale-95"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 pb-20">
      
      {/* 1. HERO BANNER WITH OVERLAY & BACK TRIGGER */}
      <div className="relative h-[480px] w-full overflow-hidden bg-slate-950">
        {/* Background Image */}
        <img
          src={kegiatan.foto}
          alt={kegiatan.nama}
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Blue/Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-950/75 z-0" />

        {/* Floating Controls */}
        <div className="absolute top-6 left-6 z-10 max-w-7xl mx-auto px-4 w-full">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white backdrop-blur-md rounded-xl text-sm font-semibold transition border border-white/15 shadow-md active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Kegiatan
          </button>
        </div>

        {/* Hero Meta Information Content */}
        <div className="absolute bottom-0 inset-x-0 z-10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pb-12">
            
            {/* Status Indicator Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
                kegiatan.status === "selesai"
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 text-white"
              }`}>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {kegiatan.status === "selesai" ? "Terlaksana / Selesai" : "Akan Datang"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl drop-shadow-md">
              {kegiatan.nama}
            </h1>

            {/* Sub Meta Info with Icons */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 mt-6 text-sm text-slate-200 font-medium">
              <span className="flex items-center gap-2 bg-black/30 px-3.5 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <MapPin className="w-4 h-4 text-rose-400" />
                {kegiatan.lokasi}
              </span>
              <span className="flex items-center gap-2 bg-black/30 px-3.5 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <Calendar className="w-4 h-4 text-emerald-400" />
                {formatDate(kegiatan.tanggal)}
              </span>
              <span className="flex items-center gap-2 bg-black/30 px-3.5 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                {kegiatan.jam} WIB
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT BODY AREA */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Description and Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Deskripsi & Ringkasan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Deskripsi & Latar Belakang
            </h2>
            
            <p className="text-slate-650 dark:text-slate-300 leading-relaxed text-base">
              {kegiatan.deskripsi}
            </p>

            {kegiatan.latarBelakang && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Latar Belakang</h3>
                <p className="text-slate-650 dark:text-slate-350 leading-relaxed text-sm">
                  {kegiatan.latarBelakang}
                </p>
              </div>
            )}
          </div>

          {/* Rencana / Agenda & Target */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tujuan & Sasaran */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Goal className="w-4.5 h-4.5 text-indigo-500" />
                Tujuan & Sasaran
              </h3>
              
              <div className="space-y-3">
                {kegiatan.tujuan ? (
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/60 dark:border-indigo-900/40 p-3.5 rounded-xl text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Tujuan:</strong>
                    {kegiatan.tujuan}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Tujuan belum dispesifikasikan.</p>
                )}

                {kegiatan.sasaran ? (
                  <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/40 p-3.5 rounded-xl text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-blue-600 dark:text-blue-400 block mb-1">Sasaran Peserta:</strong>
                    {kegiatan.sasaran}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Sasaran belum dispesifikasikan.</p>
                )}
              </div>
            </div>

            {/* Agenda Kegiatan */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Milestone className="w-4.5 h-4.5 text-emerald-500" />
                Agenda Acara
              </h3>
              
              {kegiatan.agenda ? (
                <div className="text-sm text-slate-655 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
                  {kegiatan.agenda}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl text-center">
                  Susunan agenda acara belum dirilis.
                </p>
              )}
            </div>
          </div>

          {/* 3. HASIL KEGIATAN (KHUSUS KEGIATAN SELESAI) */}
          {kegiatan.status === "selesai" && (
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 pb-4 border-b border-blue-100 dark:border-blue-900/40">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Laporan & Hasil Kegiatan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Apa yang Dilakukan */}
                <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">Aktivitas Terlaksana</span>
                  <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
                    {kegiatan.apaYangDilakukan || "Melaksanakan program kerja kelompok sesuai agenda kerja bakti dan sosialisasi lapangan bersama perangkat desa."}
                  </p>
                </div>

                {/* Apa yang Dihasilkan */}
                <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">Output / Hasil Nyata</span>
                  <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
                    {kegiatan.apaYangDihasilkan || "Terwujudnya peningkatan kebersihan, kemandirian pengelolaan digitalisasi desa, serta antusiasme tinggi dari kader setempat."}
                  </p>
                </div>

                {/* Dampak Kegiatan */}
                <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">Dampak Positif</span>
                  <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
                    {kegiatan.dampakKegiatan || "Terjalinnya ikatan erat mahasiswa KKN dengan warga, mendorong kesadaran kolektif untuk pengembangan berkelanjutan di Desa Sukamaju."}
                  </p>
                </div>

                {/* Kesimpulan */}
                <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-xs">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-1">Kesimpulan Pelaksanaan</span>
                  <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-medium">
                    {kegiatan.kesimpulanKegiatan || "Secara keseluruhan kegiatan telah tercapai 100% dan berjalan dengan sangat kondusif."}
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Column: Mini Sticky Side Info Panel & Quick Links */}
        <div className="space-y-6">
          
          {/* Quick Info Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
              Rangkuman Penyelenggaraan
            </h3>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Status</span>
                <span className={`font-bold uppercase tracking-wider text-[11px] ${
                  kegiatan.status === "selesai" ? "text-emerald-500" : "text-blue-500"
                }`}>
                  {kegiatan.status === "selesai" ? "Selesai" : "Mendatang"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Lokasi KKN</span>
                <span className="font-semibold text-slate-700 dark:text-slate-250 text-right">{kegiatan.lokasi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Tanggal</span>
                <span className="font-semibold text-slate-700 dark:text-slate-250">{kegiatan.tanggal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Pukul / Jam</span>
                <span className="font-semibold text-slate-700 dark:text-slate-250">{kegiatan.jam} WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Total Dokumentasi</span>
                <span className="font-semibold text-slate-700 dark:text-slate-250">{dokumentasiList.length} Foto</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Diperbarui secara berkala oleh tim KKN bekerjasama dengan perangkat Desa Sukamaju.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* 4. DOKUMENTASI MULTI FOTO GRID GALLERY SECTION */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-16 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Dokumentasi & Galeri Foto
          </h2>
          <span className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full text-xs font-semibold text-slate-500">
            {dokumentasiList.length} Item
          </span>
        </div>

        {dokumentasiList.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Belum Ada Dokumentasi Lapangan</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Foto-foto dokumentasi resmi akan diunggah oleh admin sesaat setelah kegiatan ini dilaksanakan.
            </p>
          </div>
        ) : (
          /* Responsive grid: Desktop: 4, Tablet: 3, Mobile: 2 */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dokumentasiList.map((doc, idx) => (
              <div
                key={doc.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative cursor-pointer bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300"
              >
                {/* Photo container */}
                <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={doc.foto}
                    alt={doc.keterangan || "Dokumentasi"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Hover Glass Effect */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-center justify-center">
                    <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg">
                      Klik untuk Memperbesar
                    </span>
                  </div>
                </div>

                {/* Caption / Keterangan */}
                {doc.keterangan && (
                  <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-450 line-clamp-2 px-1 font-medium italic">
                    {doc.keterangan}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 5. LIGHTBOX MODAL WITH FULL IMAGE, CAPTION & PREV/NEXT NAV */}
      {lightboxIndex !== null && dokumentasiList[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 select-none backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Info Bar */}
          <div className="absolute top-4 inset-x-0 flex items-center justify-between px-6 z-10">
            <span className="text-sm text-slate-300 font-semibold tracking-wider font-mono">
              {lightboxIndex + 1} / {dokumentasiList.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full transition"
              title="Tutup Galeri"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Display container */}
          <div className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center">
            
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrevImage}
              className="absolute -left-4 sm:left-4 z-25 p-3.5 bg-black/55 hover:bg-black/85 text-white hover:text-blue-400 rounded-full border border-white/10 transition backdrop-blur-sm"
              title="Foto Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* High-res Large Image */}
            <img
              src={dokumentasiList[lightboxIndex].foto}
              alt="Besar"
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/5 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />

            {/* Right Nav Arrow */}
            <button
              onClick={handleNextImage}
              className="absolute -right-4 sm:right-4 z-25 p-3.5 bg-black/55 hover:bg-black/85 text-white hover:text-blue-400 rounded-full border border-white/10 transition backdrop-blur-sm"
              title="Foto Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

          {/* Bottom Caption Overlay */}
          <div 
            className="mt-6 max-w-xl text-center bg-white/5 border border-white/10 backdrop-blur-md px-6 py-4 rounded-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-slate-200 text-sm leading-relaxed font-semibold">
              {dokumentasiList[lightboxIndex].keterangan || "Tidak ada keterangan foto."}
            </p>
            <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider block mt-2">
              Diunggah pada: {new Date(dokumentasiList[lightboxIndex].created_at).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
