import React, { useState, useEffect } from "react";
import { Dosen, Anggota, Kegiatan, Stats, ProfilDesa } from "../types";
import ImageUpload from "./ImageUpload";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarDays,
  FileSpreadsheet,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Calendar,
  AlertCircle,
  Menu,
  X,
  CheckCircle,
  Briefcase
} from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
  refreshPublicData?: () => void;
}

export default function AdminDashboard({ onLogout, refreshPublicData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "dosen" | "anggota" | "kegiatan" | "rekap" | "profil">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Data States
  const [stats, setStats] = useState<Stats>({ totalDosen: 0, totalAnggota: 0, totalAkanDatang: 0, totalSelesai: 0 });
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  
  const [profilDesa, setProfilDesa] = useState<ProfilDesa | null>(null);
  const [profilForm, setProfilForm] = useState({
    nama_desa: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    alamat: "",
    latitude: "",
    longitude: "",
    link_maps: "",
    gambar_peta: ""
  });

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"dosen" | "anggota" | "kegiatan">("dosen");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notify, setNotify] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form States
  const [dosenForm, setDosenForm] = useState({ nama: "", nip: "", jabatan: "Dosen Pembimbing Lapangan", foto: "" });
  const [anggotaForm, setAnggotaForm] = useState({ nama: "", nim: "", jabatan: "Ketua Kelompok", foto: "" });
  const [kegiatanForm, setKegiatanForm] = useState({
    nama: "",
    lokasi: "",
    tanggal: "",
    jam: "",
    deskripsi: "",
    foto: "",
    status: "akan datang" as "akan datang" | "selesai",
    dokumentasi: "",
    tujuan: "",
    latarBelakang: "",
    agenda: "",
    sasaran: "",
    apaYangDilakukan: "",
    apaYangDihasilkan: "",
    dampakKegiatan: "",
    kesimpulanKegiatan: ""
  });

  // Multi-photo documentation temporary list
  const [tempDocs, setTempDocs] = useState<any[]>([]);

  // Fetch all administrative lists
  const refreshData = async () => {
    try {
      const statsRes = await fetch("/api/stats");
      const dRes = await fetch("/api/dosen");
      const aRes = await fetch("/api/anggota");
      const kRes = await fetch("/api/kegiatan");
      const pRes = await fetch("/api/profil-desa");

      if (statsRes.ok && dRes.ok && aRes.ok && kRes.ok) {
        setStats(await statsRes.json());
        setDosenList(await dRes.json());
        setAnggotaList(await aRes.json());
        setKegiatanList(await kRes.json());
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setProfilDesa(pData);
        if (pData) {
          setProfilForm({
            nama_desa: pData.nama_desa || "",
            kecamatan: pData.kecamatan || "",
            kabupaten: pData.kabupaten || "",
            provinsi: pData.provinsi || "",
            alamat: pData.alamat || "",
            latitude: pData.latitude || "",
            longitude: pData.longitude || "",
            link_maps: pData.link_maps || "",
            gambar_peta: pData.gambar_peta || ""
          });
        }
      }
    } catch (err) {
      showNotification("Gagal memuat ulang data administratif", "error");
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotify({ message, type });
    setTimeout(() => setNotify(null), 4000);
  };

  // Delete handlers
  const handleDelete = async (type: "dosen" | "anggota" | "kegiatan", id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification(`Berhasil menghapus data ${type}!`, "success");
        refreshData();
      } else {
        showNotification(`Gagal menghapus data ${type}.`, "error");
      }
    } catch {
      showNotification("Koneksi gagal saat menghapus data.", "error");
    }
  };

  const refreshTempDocs = async (kId: string) => {
    try {
      const res = await fetch(`/api/dokumentasi?kegiatan_id=${kId}`);
      if (res.ok) {
        setTempDocs(await res.json());
      }
    } catch (err) {
      console.error("Gagal refresh dokumentasi:", err);
    }
  };

  // Open modal for creating records
  const openCreateModal = (type: "dosen" | "anggota" | "kegiatan") => {
    setModalType(type);
    setEditingId(null);
    setIsModalOpen(true);

    if (type === "dosen") {
      setDosenForm({ nama: "", nip: "", jabatan: "Dosen Pembimbing Lapangan", foto: "" });
    } else if (type === "anggota") {
      setAnggotaForm({ nama: "", nim: "", jabatan: "Ketua Kelompok", foto: "" });
    } else {
      setKegiatanForm({
        nama: "",
        lokasi: "",
        tanggal: "",
        jam: "",
        deskripsi: "",
        foto: "",
        status: "akan datang",
        dokumentasi: "",
        tujuan: "",
        latarBelakang: "",
        agenda: "",
        sasaran: "",
        apaYangDilakukan: "",
        apaYangDihasilkan: "",
        dampakKegiatan: "",
        kesimpulanKegiatan: ""
      });
      setTempDocs([]);
    }
  };

  // Open modal for editing records
  const openEditModal = (type: "dosen" | "anggota" | "kegiatan", item: any) => {
    setModalType(type);
    setEditingId(item.id);
    setIsModalOpen(true);

    if (type === "dosen") {
      setDosenForm({ nama: item.nama, nip: item.nip, jabatan: item.jabatan, foto: item.foto });
    } else if (type === "anggota") {
      setAnggotaForm({ nama: item.nama, nim: item.nim, jabatan: item.jabatan, foto: item.foto });
    } else {
      setKegiatanForm({
        nama: item.nama,
        lokasi: item.lokasi,
        tanggal: item.tanggal,
        jam: item.jam,
        deskripsi: item.deskripsi,
        foto: item.foto,
        status: item.status,
        dokumentasi: item.dokumentasi || "",
        tujuan: item.tujuan || "",
        latarBelakang: item.latarBelakang || "",
        agenda: item.agenda || "",
        sasaran: item.sasaran || "",
        apaYangDilakukan: item.apaYangDilakukan || "",
        apaYangDihasilkan: item.apaYangDihasilkan || "",
        dampakKegiatan: item.dampakKegiatan || "",
        kesimpulanKegiatan: item.kesimpulanKegiatan || ""
      });
      refreshTempDocs(item.id);
    }
  };

  // Multi-photo documentation handlers
  const handleMultiFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!editingId) {
      alert("Silakan simpan rincian kegiatan terlebih dahulu sebelum mengunggah foto dokumentasi.");
      return;
    }

    const validFiles: string[] = [];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Validation: format (JPG, JPEG, PNG) and size (<= 5MB)
      const isFormatValid = ["image/jpeg", "image/jpg", "image/png"].includes(file.type);
      const isSizeValid = file.size <= maxSizeBytes;

      if (!isFormatValid || !isSizeValid) {
        alert("Format atau ukuran file tidak sesuai. Pastikan file berupa JPG/JPEG/PNG dan berukuran maksimal 5 MB per foto.");
        return;
      }

      // Read file as Base64 encoded string
      const reader = new FileReader();
      const readPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64 = await readPromise;
      validFiles.push(base64);
    }

    // Call POST /api/dokumentasi to upload multiple photos at once
    try {
      const res = await fetch("/api/dokumentasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kegiatan_id: editingId,
          fotos: validFiles,
          keterangan: ""
        })
      });
      if (res.ok) {
        showNotification("Berhasil mengunggah foto dokumentasi tambahan!", "success");
        refreshTempDocs(editingId);
      } else {
        showNotification("Gagal mengunggah foto dokumentasi.", "error");
      }
    } catch {
      showNotification("Terjadi kesalahan jaringan saat mengunggah foto.", "error");
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto dokumentasi ini?")) return;
    try {
      const res = await fetch(`/api/dokumentasi/${docId}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Berhasil menghapus foto dokumentasi!", "success");
        if (editingId) refreshTempDocs(editingId);
      } else {
        showNotification("Gagal menghapus foto dokumentasi.", "error");
      }
    } catch {
      showNotification("Terjadi kesalahan jaringan saat menghapus foto.", "error");
    }
  };

  const handleUpdateDocKeterangan = async (docId: string, val: string) => {
    try {
      // Optimistic update
      setTempDocs((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, keterangan: val } : d))
      );

      await fetch(`/api/dokumentasi/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keterangan: val })
      });
    } catch {
      showNotification("Gagal memperbarui keterangan foto.", "error");
    }
  };

  // Form submit handlers
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = `/api/${modalType}${editingId ? `/${editingId}` : ""}`;
    const method = editingId ? "PUT" : "POST";
    const bodyData = modalType === "dosen" ? dosenForm : modalType === "anggota" ? anggotaForm : kegiatanForm;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      if (res.ok) {
        showNotification(
          `Berhasil ${editingId ? "memperbarui" : "menambahkan"} data ${modalType}!`,
          "success"
        );
        setIsModalOpen(false);
        refreshData();
      } else {
        showNotification(`Gagal mengirim data ${modalType}.`, "error");
      }
    } catch {
      showNotification("Koneksi gagal. Silakan coba kembali.", "error");
    }
  };

  const handleProfilSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profil-desa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilForm)
      });
      if (res.ok) {
        showNotification("Berhasil memperbarui profil lokasi desa!", "success");
        refreshData();
        if (refreshPublicData) {
          refreshPublicData();
        }
      } else {
        showNotification("Gagal memperbarui profil lokasi desa.", "error");
      }
    } catch {
      showNotification("Koneksi gagal saat memperbarui profil.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans transition-colors pt-20">
      
      {/* Dynamic Floating Toast Alerts */}
      {notify && (
        <div className="fixed top-24 right-6 z-[100] animate-bounce">
          <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${
            notify.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950 border-red-500 text-red-800 dark:text-red-300"
          }`}>
            {notify.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <p className="text-sm font-semibold">{notify.message}</p>
          </div>
        </div>
      )}

      {/* Admin Mobile Top Bar Trigger */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Collapsible Admin Sidebar Dashboard */}
      <aside
        className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 p-6 flex flex-col justify-between fixed h-[calc(100vh-80px)] top-[80px] z-30 transition-transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">MENU ADMIN</h3>
            <p className="text-xs text-blue-500 font-semibold uppercase">Kelompok 5 Mangkung</p>
          </div>

          <div className="space-y-1">
            {/* Dashboard Stats */}
            <button
              onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dasbor Ringkasan
            </button>

            {/* Lecturers */}
            <button
              onClick={() => { setActiveTab("dosen"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "dosen"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Kelola Dosen
            </button>

            {/* Members */}
            <button
              onClick={() => { setActiveTab("anggota"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "anggota"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              Kelola Anggota
            </button>

            {/* Activities */}
            <button
              onClick={() => { setActiveTab("kegiatan"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "kegiatan"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Kelola Kegiatan
            </button>

             {/* Profil Desa */}
            <button
              onClick={() => { setActiveTab("profil"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "profil"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <MapPin className="w-4 h-4" />
              Profil Desa
            </button>

            {/* Rekap Excel panel */}
            <button
              onClick={() => { setActiveTab("rekap"); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "rekap"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Rekap Kegiatan
            </button>
          </div>
        </div>

        {/* Logout session item */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition mt-auto"
        >
          <LogOut className="w-4 h-4" />
          Keluar Admin
        </button>
      </aside>

      {/* Main Administrative Display Panel Content */}
      <main className="flex-1 lg:ml-64 p-6 sm:p-10 min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 transition-all duration-300">
        
        {/* TAB 1: DASHBOARD RINGKASAN PANEL */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header description */}
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
                Dashboard Ringkasan Admin
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Selamat datang di panel utama. Pantau statistika penyebaran program KKN Kelompok 5 Desa Mangkung di sini.
              </p>
            </div>

            {/* Statistika Cards Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card Dosen */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Dosen DPL</p>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.totalDosen}</h4>
                </div>
              </div>

              {/* Card Anggota */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Anggota</p>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.totalAnggota}</h4>
                </div>
              </div>

              {/* Card Upcoming */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl">
                  <CalendarDays className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Akan Datang</p>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.totalAkanDatang}</h4>
                </div>
              </div>

              {/* Card Completed */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selesai / Rekap</p>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.totalSelesai}</h4>
                </div>
              </div>
            </div>

            {/* Quick overview panel info */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <h3 className="text-xl font-bold font-display">Sistem Autotransisi Kegiatan Diaktifkan</h3>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Sistem akan secara otomatis mendeteksi aktivitas yang memiliki tanggal di masa lalu dan memindahkannya ke tab <strong>"Kegiatan Selesai" / "Rekap"</strong> demi memudahkan pengelolaan administratif harian kelompok Anda.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("kegiatan")}
                className="px-6 py-3 rounded-xl font-bold bg-white text-blue-700 hover:bg-blue-50 shadow-md active:scale-95 transition whitespace-nowrap"
              >
                Atur Agenda
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: DOSEN MANAGEMENT */}
        {activeTab === "dosen" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Kelola Dosen Pembimbing</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tambah, sunting, dan hapus profil Dosen Pembimbing Lapangan (DPL).</p>
              </div>
              <button
                onClick={() => openCreateModal("dosen")}
                className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm flex items-center gap-2 shadow-md hover:bg-blue-700 hover:shadow-blue-500/10 active:scale-95 transition duration-200"
              >
                <Plus className="w-4 h-4" />
                Tambah Dosen
              </button>
            </div>

            {/* Grid Dosen */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dosenList.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 border rounded-3xl">
                  <p className="text-slate-500">Belum ada data dosen pembimbing.</p>
                </div>
              ) : (
                dosenList.map((d) => (
                  <div key={d.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shrink-0 bg-slate-100">
                        <img src={d.foto} alt={d.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{d.nama}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">NIP: {d.nip}</p>
                        <span className="text-xs mt-2 inline-block px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg font-semibold">{d.jabatan}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                      <button
                        onClick={() => openEditModal("dosen", d)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20 rounded-lg transition"
                        title="Sunting Dosen"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete("dosen", d.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-lg transition"
                        title="Hapus Dosen"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ANGGOTA MANAGEMENT */}
        {activeTab === "anggota" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Kelola Anggota Kelompok</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Atur profil mahasiswa, NIM, jabatan kelompok, dan pasfoto resmi.</p>
              </div>
              <button
                onClick={() => openCreateModal("anggota")}
                className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm flex items-center gap-2 shadow-md hover:bg-blue-700 hover:shadow-blue-500/10 active:scale-95 transition duration-200"
              >
                <Plus className="w-4 h-4" />
                Tambah Anggota
              </button>
            </div>

            {/* Grid Anggota */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {anggotaList.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 border rounded-3xl">
                  <p className="text-slate-500">Belum ada data anggota kelompok.</p>
                </div>
              ) : (
                anggotaList.map((a) => (
                  <div key={a.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shrink-0 bg-slate-100">
                        <img src={a.foto} alt={a.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{a.nama}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">NIM: {a.nim}</p>
                        <span className="text-xs mt-2 inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold">{a.jabatan}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                      <button
                        onClick={() => openEditModal("anggota", a)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20 rounded-lg transition"
                        title="Sunting Anggota"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete("anggota", a.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-lg transition"
                        title="Hapus Anggota"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: KEGIATAN MANAGEMENT */}
        {activeTab === "kegiatan" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Kelola Agenda Kegiatan</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Atur kalender program kerja, lokasi pelaksanaan, gambar utama, dan rincian kegiatan KKN.</p>
              </div>
              <button
                onClick={() => openCreateModal("kegiatan")}
                className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm flex items-center gap-2 shadow-md hover:bg-blue-700 hover:shadow-blue-500/10 active:scale-95 transition duration-200"
              >
                <Plus className="w-4 h-4" />
                Tambah Agenda
              </button>
            </div>

            {/* List Agenda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kegiatanList.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 border rounded-3xl">
                  <p className="text-slate-500">Belum ada agenda kegiatan yang terdaftar.</p>
                </div>
              ) : (
                kegiatanList.map((k) => (
                  <div key={k.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border bg-slate-100 shrink-0">
                          <img src={k.foto} alt={k.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            k.status === "selesai" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}>
                            {k.status === "selesai" ? "Selesai" : "Akan Datang"}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{k.nama}</h4>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span>{k.lokasi}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span>{k.tanggal}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-500" />
                          <span>{k.jam} WIB</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{k.deskripsi}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                      <button
                        onClick={() => openEditModal("kegiatan", k)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/20 rounded-lg transition"
                        title="Sunting Agenda"
                      >
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete("kegiatan", k.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-lg transition"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: REKAP KEGIATAN & EXCEL DOWNLOAD PANEL */}
        {activeTab === "rekap" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Rekap & Dokumentasi Kegiatan</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Arsip seluruh rekapitulasi program kerja yang telah berhasil diselesaikan beserta laporan foto lapangan.</p>
              </div>
              
              <a
                href="/api/kegiatan/rekap/excel"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-95 hover:shadow-emerald-500/10 transition"
              >
                <FileSpreadsheet className="w-4.5 h-4.5" />
                Unduh Rekap Excel
              </a>
            </div>

            {/* List Rekap Kegiatan */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-display">Tabel Arsip Selesai</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/10">
                      <th className="py-4 px-6 w-12">No</th>
                      <th className="py-4 px-6">Nama Kegiatan</th>
                      <th className="py-4 px-6">Lokasi</th>
                      <th className="py-4 px-6">Waktu</th>
                      <th className="py-4 px-6">Arsip Foto Lapangan & Dokumentasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80 text-sm">
                    {kegiatanList.filter(k => k.status === "selesai").length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                          Belum ada rekap kegiatan selesai yang diarsipkan.
                        </td>
                      </tr>
                    ) : (
                      kegiatanList.filter(k => k.status === "selesai").map((k, index) => (
                        <tr key={k.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="py-4 px-6 font-semibold text-slate-500">{index + 1}</td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-slate-850 dark:text-slate-100">{k.nama}</span>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{k.deskripsi}</p>
                          </td>
                          <td className="py-4 px-6 text-slate-600 dark:text-slate-350 font-medium">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span>{k.lokasi}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 space-y-0.5 font-medium">
                            <p className="text-xs text-slate-800 dark:text-slate-200">{k.tanggal}</p>
                            <p className="text-[10px] text-slate-400">{k.jam} WIB</p>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {/* Main image preview */}
                              <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-100" title="Foto Utama">
                                <img src={k.foto} alt="Utama" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              {/* Dokumentasi preview */}
                              {k.dokumentasi && (
                                <div className="w-14 h-10 rounded-lg overflow-hidden border border-emerald-100 shrink-0 bg-emerald-50" title="Dokumentasi Selesai">
                                  <img src={k.dokumentasi} alt="Dokumentasi" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PROFIL DESA PANEL */}
        {activeTab === "profil" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">Kelola Profil & Lokasi Desa KKN</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Atur data geografis, alamat, peta spasial desa, serta tautan Google Maps untuk beranda publik.</p>
            </div>

            <form onSubmit={handleProfilSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Desa</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Desa Sukamaju"
                    value={profilForm.nama_desa}
                    onChange={(e) => setProfilForm({ ...profilForm, nama_desa: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kecamatan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Cigudeg"
                    value={profilForm.kecamatan}
                    onChange={(e) => setProfilForm({ ...profilForm, kecamatan: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kabupaten / Kota</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kabupaten Bogor"
                    value={profilForm.kabupaten}
                    onChange={(e) => setProfilForm({ ...profilForm, kabupaten: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Provinsi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jawa Barat"
                    value={profilForm.provinsi}
                    onChange={(e) => setProfilForm({ ...profilForm, provinsi: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Lengkap Kantor Desa / Posko</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Masukkan jalan, dusun, RT/RW, dan kode pos posko atau balai desa..."
                  value={profilForm.alamat}
                  onChange={(e) => setProfilForm({ ...profilForm, alamat: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Garis Lintang (Latitude)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: -6.123456"
                    value={profilForm.latitude}
                    onChange={(e) => setProfilForm({ ...profilForm, latitude: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Garis Bujur (Longitude)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 106.123456"
                    value={profilForm.longitude}
                    onChange={(e) => setProfilForm({ ...profilForm, longitude: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link Navigasi Google Maps</label>
                <input
                  type="url"
                  required
                  placeholder="Contoh: https://goo.gl/maps/..."
                  value={profilForm.link_maps}
                  onChange={(e) => setProfilForm({ ...profilForm, link_maps: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div className="border-t border-slate-150 dark:border-slate-800 pt-6 space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Gambar / Foto Peta Desa KKN</label>
                <ImageUpload
                  value={profilForm.gambar_peta}
                  onChange={(base64) => setProfilForm({ ...profilForm, gambar_peta: base64 })}
                  label="Unggah Foto Peta Desa"
                />
              </div>

              <div className="pt-6 border-t border-slate-150 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 active:scale-95 transition shadow-lg hover:shadow-blue-500/15"
                >
                  Simpan Perubahan Profil Desa
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

      {/* ADMIN EDIT / CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                {editingId ? "Sunting" : "Tambah"} Data {modalType === "dosen" ? "Dosen DPL" : modalType === "anggota" ? "Anggota" : "Kegiatan"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* DOSEN FORM FIELDS */}
              {modalType === "dosen" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Dosen Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dr. Ir. H. Ahmad Sudrajat, M.T."
                      value={dosenForm.nama}
                      onChange={(e) => setDosenForm({ ...dosenForm, nama: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NIP / NIDN</label>
                    <input
                      type="text"
                      placeholder="Masukkan NIP dosen pembimbing"
                      value={dosenForm.nip}
                      onChange={(e) => setDosenForm({ ...dosenForm, nip: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jabatan Struktur</label>
                    <input
                      type="text"
                      required
                      value={dosenForm.jabatan}
                      onChange={(e) => setDosenForm({ ...dosenForm, jabatan: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <ImageUpload
                    value={dosenForm.foto}
                    onChange={(base64) => setDosenForm({ ...dosenForm, foto: base64 })}
                    label="Unggah Pasfoto Dosen"
                  />
                </div>
              )}

              {/* ANGGOTA FORM FIELDS */}
              {modalType === "anggota" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Anggota Kelompok</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Naufal Rahisna"
                      value={anggotaForm.nama}
                      onChange={(e) => setAnggotaForm({ ...anggotaForm, nama: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NIM (Nomor Induk Mahasiswa)</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan NIM anggota"
                      value={anggotaForm.nim}
                      onChange={(e) => setAnggotaForm({ ...anggotaForm, nim: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jabatan Kelompok KKN</label>
                    <select
                      value={anggotaForm.jabatan}
                      onChange={(e) => setAnggotaForm({ ...anggotaForm, jabatan: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Ketua Kelompok">Ketua Kelompok</option>
                      <option value="Sekretaris">Sekretaris</option>
                      <option value="Bendahara">Bendahara</option>
                      <option value="Divisi Humas">Divisi Humas</option>
                      <option value="Divisi Acara">Divisi Acara</option>
                      <option value="Divisi Dokumentasi">Divisi Dokumentasi</option>
                      <option value="Divisi Perlengkapan">Divisi Perlengkapan</option>
                      <option value="Anggota">Anggota</option>
                    </select>
                  </div>
                  <ImageUpload
                    value={anggotaForm.foto}
                    onChange={(base64) => setAnggotaForm({ ...anggotaForm, foto: base64 })}
                    label="Unggah Pasfoto Resmi Anggota"
                  />
                </div>
              )}

              {/* KEGIATAN FORM FIELDS */}
              {modalType === "kegiatan" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Kegiatan</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kerja Bakti Bersih Desa"
                      value={kegiatanForm.nama}
                      onChange={(e) => setKegiatanForm({ ...kegiatanForm, nama: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi Pelaksanaan</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Balai Desa Sukamaju"
                      value={kegiatanForm.lokasi}
                      onChange={(e) => setKegiatanForm({ ...kegiatanForm, lokasi: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</label>
                      <input
                        type="date"
                        required
                        value={kegiatanForm.tanggal}
                        onChange={(e) => setKegiatanForm({ ...kegiatanForm, tanggal: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Kegiatan</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 08:00"
                        value={kegiatanForm.jam}
                        onChange={(e) => setKegiatanForm({ ...kegiatanForm, jam: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi Singkat</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Uraikan rincian singkat program kerja pengabdian..."
                      value={kegiatanForm.deskripsi}
                      onChange={(e) => setKegiatanForm({ ...kegiatanForm, deskripsi: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Kegiatan</label>
                    <select
                      value={kegiatanForm.status}
                      onChange={(e) => setKegiatanForm({ ...kegiatanForm, status: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    >
                      <option value="akan datang">Akan Datang</option>
                      <option value="selesai">Selesai / Rekap</option>
                    </select>
                  </div>

                  <ImageUpload
                    value={kegiatanForm.foto}
                    onChange={(base64) => setKegiatanForm({ ...kegiatanForm, foto: base64 })}
                    label="Unggah Poster / Banner Utama"
                  />

                  {/* PORTAL BERITA: DETAIL SEKSI */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <h5 className="text-sm font-bold text-blue-600 dark:text-blue-400">Rincian Detail Kegiatan (Portal Berita)</h5>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latar Belakang Kegiatan</label>
                      <textarea
                        rows={3}
                        placeholder="Uraikan latar belakang dilaksanakannya program pengabdian ini..."
                        value={kegiatanForm.latarBelakang}
                        onChange={(e) => setKegiatanForm({ ...kegiatanForm, latarBelakang: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tujuan Kegiatan</label>
                      <textarea
                        rows={2}
                        placeholder="Contoh: Memberdayakan pelaku UMKM lokal melalui pemasaran digital..."
                        value={kegiatanForm.tujuan}
                        onChange={(e) => setKegiatanForm({ ...kegiatanForm, tujuan: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agenda Kegiatan</label>
                        <textarea
                          rows={3}
                          placeholder="Uraikan jadwal susunan acara / tahapan kegiatan..."
                          value={kegiatanForm.agenda}
                          onChange={(e) => setKegiatanForm({ ...kegiatanForm, agenda: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sasaran Peserta</label>
                        <textarea
                          rows={3}
                          placeholder="Contoh: Seluruh pelaku UMKM kuliner di Desa Sukamaju..."
                          value={kegiatanForm.sasaran}
                          onChange={(e) => setKegiatanForm({ ...kegiatanForm, sasaran: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* LAPORAN HASIL KEGIATAN (Hanya untuk Selesai) */}
                  {kegiatanForm.status === "selesai" && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                      <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Laporan Hasil Kegiatan (Selesai)</h5>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Apa yang Dilakukan</label>
                        <textarea
                          rows={2}
                          placeholder="Uraikan aksi nyata yang dilakukan di lapangan..."
                          value={kegiatanForm.apaYangDilakukan}
                          onChange={(e) => setKegiatanForm({ ...kegiatanForm, apaYangDilakukan: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Apa yang Dihasilkan</label>
                        <textarea
                          rows={2}
                          placeholder="Uraikan luaran / produk / hasil konkret yang diperoleh..."
                          value={kegiatanForm.apaYangDihasilkan}
                          onChange={(e) => setKegiatanForm({ ...kegiatanForm, apaYangDihasilkan: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dampak & Manfaat Kegiatan</label>
                        <textarea
                          rows={2}
                          placeholder="Uraikan kontribusi positif yang dirasakan masyarakat..."
                          value={kegiatanForm.dampakKegiatan}
                          onChange={(e) => setKegiatanForm({ ...kegiatanForm, dampakKegiatan: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kesimpulan</label>
                        <textarea
                          rows={2}
                          placeholder="Uraikan kesimpulan akhir dari kegiatan ini..."
                          value={kegiatanForm.kesimpulanKegiatan}
                          onChange={(e) => setKegiatanForm({ ...kegiatanForm, kesimpulanKegiatan: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  )}

                  {/* KELOLA DOKUMENTASI MULTI FOTO */}
                  {kegiatanForm.status === "selesai" && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-sm font-bold text-blue-600 dark:text-blue-400">Galeri Dokumentasi Multi-Foto</h5>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {editingId 
                              ? "Unggah dan beri keterangan pada banyak foto dokumentasi lapangan."
                              : "Simpan rincian kegiatan terlebih dahulu untuk mengaktifkan galeri multi-foto."}
                          </p>
                        </div>
                        {editingId && (
                          <div>
                            <input
                              type="file"
                              id="doc-multi-upload-input"
                              name="dokumentasi[]"
                              multiple
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={handleMultiFileSelect}
                              className="hidden"
                            />
                            <label
                              htmlFor="doc-multi-upload-input"
                              className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Pilih Foto-Foto
                            </label>
                          </div>
                        )}
                      </div>

                      {editingId ? (
                        tempDocs.length === 0 ? (
                          <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            <p className="text-xs text-slate-400 dark:text-slate-500">Belum ada foto dokumentasi galeri. Klik tombol di atas untuk mengunggah.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            {tempDocs.map((doc) => (
                              <div key={doc.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 relative group/item">
                                <div className="aspect-video w-full rounded-lg overflow-hidden border bg-slate-100 relative">
                                  <img src={doc.foto} alt="Dokumentasi" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDoc(doc.id)}
                                    className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-90 hover:scale-105 transition"
                                    title="Hapus Foto"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Beri keterangan foto..."
                                  value={doc.keterangan || ""}
                                  onChange={(e) => handleUpdateDocKeterangan(doc.id, e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 rounded-2xl text-amber-800 dark:text-amber-400 text-xs">
                          Fitur multi-foto dokumentasi akan aktif secara otomatis setelah Anda mengklik tombol "Simpan Perubahan" atau saat menyunting agenda kegiatan yang sudah tersimpan.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-350 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 active:scale-95 transition"
                >
                  Simpan Perubahan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
