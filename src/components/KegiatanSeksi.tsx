import { useState } from "react";
import { Kegiatan } from "../types";
import { Search, Calendar, MapPin, Clock, Tag, ChevronLeft, ChevronRight, FileText, Image as ImageIcon } from "lucide-react";

interface KegiatanSeksiProps {
  kegiatan: Kegiatan[];
  onSelectKegiatan?: (id: string) => void;
}

export default function KegiatanSeksi({ kegiatan, onSelectKegiatan }: KegiatanSeksiProps) {
  const [activeTab, setActiveTab] = useState<"akan datang" | "selesai">("akan datang");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Formatting date utility
  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      return new Date(dateStr).toLocaleDateString("id-ID", options);
    } catch {
      return dateStr;
    }
  };

  // 1. Filtered and Searched list based on current settings
  const filteredKegiatan = kegiatan.filter((k) => {
    // Filter by tab
    const tabMatch = k.status === activeTab;
    
    // Filter by search query
    const textMatch =
      k.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Filter by date
    const dateMatch = dateFilter ? k.tanggal === dateFilter : true;

    return tabMatch && textMatch && dateMatch;
  });

  // 2. Pagination Math
  const totalPages = Math.ceil(filteredKegiatan.length / itemsPerPage);
  const paginatedKegiatan = filteredKegiatan.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabChange = (tab: "akan datang" | "selesai") => {
    setActiveTab(tab);
    setCurrentPage(1); // reset page
  };

  return (
    <section id="kegiatan" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            Agenda Pengabdian
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Program & Kegiatan KKN
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            Daftar program kerja pengabdian masyarakat kelompok KKN yang sedang direncanakan maupun yang telah sukses diselenggarakan di Desa Sukamaju.
          </p>
        </div>

        {/* Controls: Tabs, Search and Date Filter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mb-10 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4 shadow-sm">
          
          {/* Custom Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl w-full md:w-fit border border-slate-200/60 dark:border-slate-800/80">
            <button
              onClick={() => handleTabChange("akan datang")}
              className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "akan datang"
                  ? "bg-white dark:bg-slate-850 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Akan Datang
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === "akan datang" ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" : "bg-slate-200 text-slate-600 dark:bg-slate-900 dark:text-slate-500"
              }`}>
                {kegiatan.filter(k => k.status === "akan datang").length}
              </span>
            </button>
            <button
              onClick={() => handleTabChange("selesai")}
              className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "selesai"
                  ? "bg-white dark:bg-slate-850 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Selesai
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === "selesai" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-slate-200 text-slate-600 dark:bg-slate-900 dark:text-slate-500"
              }`}>
                {kegiatan.filter(k => k.status === "selesai").length}
              </span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-md">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Date Picker Filter */}
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                title="Saring berdasarkan tanggal"
              />
              {dateFilter && (
                <button
                  onClick={() => { setDateFilter(""); setCurrentPage(1); }}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] text-red-500 font-semibold hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Dynamic Activity List */}
        {paginatedKegiatan.length === 0 ? (
          <div className="alert alert-info bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-xl p-6 text-center font-medium my-4">
            Belum ada kegiatan tersedia
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paginatedKegiatan.map((k) => (
              <div
                key={k.id}
                onClick={() => onSelectKegiatan && onSelectKegiatan(k.id)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer"
              >
                {/* Visual Image / Documentation Wrapper */}
                <div className="relative h-60 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  
                  {/* Status Overlay Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                      k.status === "selesai"
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}>
                      {k.status === "selesai" ? "Terlaksana" : "Akan Datang"}
                    </span>
                  </div>

                  <img
                    src={k.foto}
                    alt={k.nama}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Glassmorphism Title Footer on Image */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 pt-12">
                    <p className="text-xs font-semibold text-blue-300 flex items-center gap-1 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      {k.lokasi}
                    </p>
                    <h3 className="text-lg font-bold text-white leading-snug mt-1 font-display">
                      {k.nama}
                    </h3>
                  </div>
                </div>

                {/* Card Content body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-3">
                    {/* Time / Date indicators */}
                    <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 px-3 py-1 rounded-lg">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {formatDate(k.tanggal)}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 px-3 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {k.jam} WIB
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {k.deskripsi}
                    </p>
                  </div>

                  {/* Documentation Display (for Completed activities) */}
                  {k.status === "selesai" && k.dokumentasi && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                        Dokumentasi Utama
                      </p>
                      <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100">
                        <img
                          src={k.dokumentasi}
                          alt="Dokumentasi KKN"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Elegant Call To Action at the bottom */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      {k.status === "selesai" ? "Lihat Laporan & Dokumentasi" : "Lihat Rincian Kegiatan"} &rarr;
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border transition ${
                currentPage === 1
                  ? "border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed"
                  : "border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
              title="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Halaman {currentPage} dari {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl border transition ${
                currentPage === totalPages
                  ? "border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed"
                  : "border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
              title="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
