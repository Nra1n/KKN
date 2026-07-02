import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import exceljs from "exceljs";

const DB_FILE = path.join(process.cwd(), "db.json");

// Helper to load database
function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    // Seed default data if database doesn't exist
    const defaultData = {
      admin: {
        username: "admin",
        password: "admin"
      },
      dosen: [
        {
          id: "d1",
          nama: "Dr. Ir. H. Ahmad Sudrajat, M.T.",
          nip: "197508122003121002",
          jabatan: "Dosen Pembimbing Lapangan",
          // Base64 elegant SVG blue gradient avatar placeholder
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%231e3a8a'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M20,80 Q50,50 80,80 Z' fill='%23ffffff'/></svg>"
        }
      ],
      anggota: [
        {
          id: "a1",
          nama: "Naufal Rahisna",
          nim: "2105011001",
          jabatan: "Ketua Kelompok",
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%232563eb'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M20,80 Q50,50 80,80 Z' fill='%23ffffff'/></svg>"
        },
        {
          id: "a2",
          nama: "Siti Aminah",
          nim: "2105011002",
          jabatan: "Sekretaris",
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%230284c7'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M20,80 Q50,50 80,80 Z' fill='%23ffffff'/></svg>"
        },
        {
          id: "a3",
          nama: "Budi Santoso",
          nim: "2105011003",
          jabatan: "Bendahara",
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%230f766e'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M20,80 Q50,50 80,80 Z' fill='%23ffffff'/></svg>"
        },
        {
          id: "a4",
          nama: "Rian Hidayat",
          nim: "2105011004",
          jabatan: "Divisi Humas",
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%234f46e5'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M20,80 Q50,50 80,80 Z' fill='%23ffffff'/></svg>"
        },
        {
          id: "a5",
          nama: "Laila Fitriani",
          nim: "2105011005",
          jabatan: "Divisi Acara",
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%230891b2'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M20,80 Q50,50 80,80 Z' fill='%23ffffff'/></svg>"
        },
        {
          id: "a6",
          nama: "Yusuf Al-Fatih",
          nim: "2105011006",
          jabatan: "Divisi Dokumentasi",
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23059669'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M20,80 Q50,50 80,80 Z' fill='%23ffffff'/></svg>"
        }
      ],
      kegiatan: [
        {
          id: "k1",
          nama: "Kerja Bakti Bersih Desa",
          lokasi: "Balai Desa Sukamaju",
          tanggal: "2026-06-25", // Past date, will be "selesai"
          jam: "08:00",
          deskripsi: "Membersihkan area sekitar Balai Desa Sukamaju bersama warga setempat untuk menciptakan lingkungan sehat dan asri.",
          status: "selesai",
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%231e3a8a'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='8'>Kerja Bakti Desa</text></svg>",
          dokumentasi: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%2310b981'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='8'>Dokumentasi Kerja Bakti</text></svg>"
        },
        {
          id: "k2",
          nama: "Pelatihan Pembuatan Website Desa",
          lokasi: "Kantor Desa Sukamaju",
          tanggal: "2026-06-28", // Past date, will be "selesai"
          jam: "09:30",
          deskripsi: "Sosialisasi dan pelatihan pengelolaan website desa kepada perangkat desa agar mempermudah pelayanan digital.",
          status: "selesai",
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%233b82f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='8'>Website Desa</text></svg>",
          dokumentasi: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%23059669'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='8'>Dokumentasi Pelatihan</text></svg>"
        },
        {
          id: "k3",
          nama: "Sosialisasi Program Kerja KKN",
          lokasi: "Balai Desa Sukamaju",
          tanggal: "2026-07-10", // Future date (as of July 2, 2026)
          jam: "13:30",
          deskripsi: "Pemaparan seluruh agenda program kerja KKN Kelompok kepada jajaran pemerintah desa dan perwakilan warga.",
          status: "akan datang",
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%236366f1'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='8'>Sosialisasi Proker</text></svg>"
        },
        {
          id: "k4",
          nama: "Penyuluhan Kesehatan & Stunting",
          lokasi: "Posyandu Sukamaju",
          tanggal: "2026-07-15", // Future date
          jam: "09:00",
          deskripsi: "Edukasi kesehatan ibu dan anak, serta pencegahan stunting melalui asupan gizi seimbang.",
          status: "akan datang",
          foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%230ea5e9'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='8'>Penyuluhan Kesehatan</text></svg>"
        }
      ],
      profil_desa: {
        id: "p1",
        nama_desa: "Desa Sukamaju",
        kecamatan: "Kecamatan Sukasari",
        kabupaten: "Kabupaten Bandung",
        provinsi: "Jawa Barat",
        alamat: "Jl. Raya Sukamaju No.10",
        latitude: "-6.7845",
        longitude: "107.6412",
        link_maps: "https://maps.google.com/?q=-6.7845,107.6412",
        gambar_peta: "/uploads/peta/peta_desa.jpg"
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), "utf8");
    return defaultData;
  }

  // Setup directory for uploads
  const uploadsDir = path.join(process.cwd(), "uploads");
  const petaDir = path.join(uploadsDir, "peta");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
  if (!fs.existsSync(petaDir)) fs.mkdirSync(petaDir);

  const petaPath = path.join(petaDir, "peta_desa.jpg");
  if (!fs.existsSync(petaPath)) {
    // Elegant base64 map blueprint
    const mapBlueprintBase64 = "iVBORw0KGgoAAAANSUhEUgAABAAAAAMgCAMAAACd6ZWWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFHi02/////zG53wAAAAJ0Uk5T/wDltzBKAAAIJElEQVR42uzBMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgNhb4AAG89IAnAAAAAElFTkSuQmCC";
    try {
      fs.writeFileSync(petaPath, Buffer.from(mapBlueprintBase64, "base64"));
    } catch (e) {
      console.error("Gagal membuat default peta_desa.jpg:", e);
    }
  }

  const fileContent = fs.readFileSync(DB_FILE, "utf8");
  const data = JSON.parse(fileContent);
  let updated = false;

  // Initialize profil_desa if missing
  if (!data.profil_desa) {
    data.profil_desa = {
      id: "p1",
      nama_desa: "Desa Sukamaju",
      kecamatan: "Kecamatan Sukasari",
      kabupaten: "Kabupaten Bandung",
      provinsi: "Jawa Barat",
      alamat: "Jl. Raya Sukamaju No.10",
      latitude: "-6.7845",
      longitude: "107.6412",
      link_maps: "https://maps.google.com/?q=-6.7845,107.6412",
      gambar_peta: "/uploads/peta/peta_desa.jpg"
    };
    updated = true;
  }

  // 5. Tambahkan tabel/array database baru untuk dokumentasi multi foto
  if (!data.dokumentasi) {
    data.dokumentasi = [
      {
        id: "doc1",
        kegiatan_id: "k1",
        foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%23047857'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='6'>Foto 1: Kerja Bakti Lapangan</text></svg>",
        keterangan: "Warga berkumpul di depan balai desa bersiap memulai kerja bakti.",
        created_at: "2026-06-25T08:30:00Z"
      },
      {
        id: "doc2",
        kegiatan_id: "k1",
        foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%23059669'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='6'>Foto 2: Pembersihan Selokan</text></svg>",
        keterangan: "Pembersihan selokan air agar lancar saat hujan.",
        created_at: "2026-06-25T09:15:00Z"
      },
      {
        id: "doc3",
        kegiatan_id: "k1",
        foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%2310b981'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='6'>Foto 3: Hasil Pembersihan</text></svg>",
        keterangan: "Lingkungan sekitar balai desa yang bersih dan rapi.",
        created_at: "2026-06-25T11:00:00Z"
      },
      {
        id: "doc4",
        kegiatan_id: "k2",
        foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%231e40af'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='6'>Foto 1: Teori Pembuatan Web</text></svg>",
        keterangan: "Penyampaian materi teoritis pembuatan website desa.",
        created_at: "2026-06-28T10:00:00Z"
      },
      {
        id: "doc5",
        kegiatan_id: "k2",
        foto: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%232563eb'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-size='6'>Foto 2: Praktik Input Data</text></svg>",
        keterangan: "Perangkat desa mencoba secara mandiri menginputkan berita.",
        created_at: "2026-06-28T11:30:00Z"
      }
    ];
    updated = true;
  }

  // Ensure default detailed fields exist on kegiatan
  data.kegiatan = data.kegiatan.map((k: any) => {
    let changed = false;
    if (k.id === "k1" && !k.tujuan) {
      k.tujuan = "Meningkatkan kebersihan lingkungan sekitar Balai Desa Sukamaju dan mempererat tali silaturahmi antar warga.";
      k.latarBelakang = "Area sekitar Balai Desa Sukamaju memerlukan peremajaan dan kebersihan ekstra demi menjaga kesehatan lingkungan desa dan kenyamanan pelayanan publik.";
      k.agenda = "1. Kumpul di Balai Desa pukul 08:00\n2. Pembagian wilayah kerja bakti\n3. Pembersihan selokan dan perapian taman\n4. Istirahat dan makan siang bersama";
      k.sasaran = "Seluruh area Balai Desa Sukamaju dan jalan utama sekitarnya.";
      k.apaYangDilakukan = "Warga melakukan gotong royong membersihkan sampah plastik, memotong rumput liar, mengeruk lumpur selokan, serta mengecat ulang pagar Balai Desa.";
      k.apaYangDihasilkan = "Lingkungan Balai Desa Sukamaju menjadi bersih, sehat, dan rapi. Pagar balai desa memiliki cat baru yang cerah.";
      k.dampakKegiatan = "Meningkatnya kepedulian masyarakat terhadap kebersihan, berkurangnya genangan air akibat saluran tersumbat, dan terciptanya iklim pelayanan publik yang lebih nyaman.";
      k.kesimpulanKegiatan = "Kegiatan berjalan sukses dengan partisipasi aktif dari 30 warga dan seluruh anggota kelompok KKN.";
      changed = true;
    }
    if (k.id === "k2" && !k.tujuan) {
      k.tujuan = "Membekali perangkat desa dengan keterampilan praktis untuk memperbarui informasi dan memberikan pelayanan digital melalui website resmi.";
      k.latarBelakang = "Kurangnya pemahaman mengenai administrasi portal desa digital menghambat penyampaian berita dan transparansi informasi publik kepada masyarakat luar.";
      k.agenda = "1. Pembukaan oleh Kepala Desa\n2. Pengenalan dashboard admin CMS website\n3. Praktik penulisan berita & upload galeri\n4. Evaluasi & sesi tanya jawab";
      k.sasaran = "Sekretaris desa, kepala urusan umum, dan perwakilan staf pelayanan Desa Sukamaju.";
      k.apaYangDilakukan = "Menjelaskan konsep hosting, domain, dilanjutkan demo pengelolaan modul artikel dan dokumentasi desa menggunakan CMS khusus.";
      k.apaYangDihasilkan = "Staf desa memiliki akun editor masing-masing dan berhasil menerbitkan berita perdana tentang KKN.";
      k.dampakKegiatan = "Pelayanan surat-menyurat dan publikasi potensi desa sekarang dapat dilakukan secara lebih transparan dan cepat.";
      k.kesimpulanKegiatan = "Pelatihan berjalan lancar. Semua peserta kini mandiri dalam memperbarui konten portal desa.";
      changed = true;
    }
    if (k.id === "k3" && !k.tujuan) {
      k.tujuan = "Menyelaraskan rencana program kerja mahasiswa KKN dengan kebutuhan riil pemerintah desa dan warga.";
      k.latarBelakang = "Koordinasi awal sangat krusial untuk memastikan seluruh program kerja KKN mendapat dukungan penuh dan berjalan sejalan dengan RPJM Desa Sukamaju.";
      k.agenda = "1. Presentasi usulan program kerja per divisi\n2. Sesi diskusi, masukan, dan saran dari kepala desa\n3. Penentuan jadwal kolaborasi kegiatan";
      k.sasaran = "Kepala Desa Sukamaju, jajaran Kepala Dusun, Ketua RT/RW, dan tokoh pemuda Karang Taruna.";
      changed = true;
    }
    if (k.id === "k4" && !k.tujuan) {
      k.tujuan = "Meningkatkan kesadaran ibu hamil dan menyusui mengenai pola asuh anak demi menekan angka stunting.";
      k.latarBelakang = "Desa Sukamaju memiliki beberapa kasus anak dengan indikasi tumbuh kembang lambat akibat kurangnya edukasi gizi mikro harian.";
      k.agenda = "1. Pemeriksaan tinggi/berat badan bayi gratis\n2. Ceramah interaktif oleh Ahli Gizi Puskesmas\n3. Demo memasak MPASI bernutrisi tinggi dan ekonomis\n4. Pembagian paket sembako dan vitamin anak";
      k.sasaran = "Ibu hamil, ibu menyusui, serta kader Posyandu Melati Desa Sukamaju.";
      changed = true;
    }
    if (changed) updated = true;
    return k;
  });

  if (updated) {
    saveDb(data);
  }
  return data;
}

// Helper to save database
function saveDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

// Auto transition activities whose dates have passed
function autoShiftKegiatan(data: any) {
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  let updated = false;

  data.kegiatan = data.kegiatan.map((k: any) => {
    // If status is "akan datang" and date is in the past, change it to "selesai"
    if (k.status === "akan datang" && k.tanggal < todayStr) {
      k.status = "selesai";
      // Ensure there is documentation, fallback to its main photo if none
      if (!k.dokumentasi) {
        k.dokumentasi = k.foto;
      }
      updated = true;
    }
    return k;
  });

  if (updated) {
    saveDb(data);
  }
  return data;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" })); // allow big base64 uploads
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Ensure database initialized and active
  const db = loadDb();
  autoShiftKegiatan(db);

  // --- API ROUTING ---

  // Auth: Check status / Get current admin config
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    const currentDb = loadDb();
    if (
      currentDb.admin.username === username &&
      currentDb.admin.password === password
    ) {
      res.json({ success: true, token: "kkn-secret-auth-token-2026" });
    } else {
      res.status(401).json({ success: false, message: "Username atau Password salah!" });
    }
  });

  // Dosen CRUD
  app.get("/api/dosen", (req, res) => {
    const currentDb = loadDb();
    res.json(currentDb.dosen);
  });

  app.post("/api/dosen", (req, res) => {
    const { nama, nip, jabatan, foto } = req.body;
    const currentDb = loadDb();
    const newDosen = {
      id: "d" + Date.now(),
      nama,
      nip: nip || "-",
      jabatan: jabatan || "Dosen Pembimbing Lapangan",
      foto: foto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%231e3a8a'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M20,80 Q50,50 80,80 Z' fill='%23ffffff'/></svg>"
    };
    currentDb.dosen.push(newDosen);
    saveDb(currentDb);
    res.json(newDosen);
  });

  app.put("/api/dosen/:id", (req, res) => {
    const { id } = req.params;
    const { nama, nip, jabatan, foto } = req.body;
    const currentDb = loadDb();
    const idx = currentDb.dosen.findIndex((d: any) => d.id === id);
    if (idx !== -1) {
      currentDb.dosen[idx] = {
        ...currentDb.dosen[idx],
        nama: nama || currentDb.dosen[idx].nama,
        nip: nip !== undefined ? nip : currentDb.dosen[idx].nip,
        jabatan: jabatan || currentDb.dosen[idx].jabatan,
        foto: foto || currentDb.dosen[idx].foto
      };
      saveDb(currentDb);
      res.json(currentDb.dosen[idx]);
    } else {
      res.status(404).json({ message: "Dosen tidak ditemukan" });
    }
  });

  app.delete("/api/dosen/:id", (req, res) => {
    const { id } = req.params;
    const currentDb = loadDb();
    currentDb.dosen = currentDb.dosen.filter((d: any) => d.id !== id);
    saveDb(currentDb);
    res.json({ success: true });
  });

  // Anggota CRUD
  app.get("/api/anggota", (req, res) => {
    const currentDb = loadDb();
    res.json(currentDb.anggota);
  });

  app.post("/api/anggota", (req, res) => {
    const { nama, nim, jabatan, foto } = req.body;
    const currentDb = loadDb();
    const newAnggota = {
      id: "a" + Date.now(),
      nama,
      nim,
      jabatan,
      foto: foto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%232563eb'/><circle cx='50' cy='40' r='20' fill='%23ffffff'/><path d='M20,80 Q50,50 80,80 Z' fill='%23ffffff'/></svg>"
    };
    currentDb.anggota.push(newAnggota);
    saveDb(currentDb);
    res.json(newAnggota);
  });

  app.put("/api/anggota/:id", (req, res) => {
    const { id } = req.params;
    const { nama, nim, jabatan, foto } = req.body;
    const currentDb = loadDb();
    const idx = currentDb.anggota.findIndex((a: any) => a.id === id);
    if (idx !== -1) {
      currentDb.anggota[idx] = {
        ...currentDb.anggota[idx],
        nama: nama || currentDb.anggota[idx].nama,
        nim: nim || currentDb.anggota[idx].nim,
        jabatan: jabatan || currentDb.anggota[idx].jabatan,
        foto: foto || currentDb.anggota[idx].foto
      };
      saveDb(currentDb);
      res.json(currentDb.anggota[idx]);
    } else {
      res.status(404).json({ message: "Anggota tidak ditemukan" });
    }
  });

  app.delete("/api/anggota/:id", (req, res) => {
    const { id } = req.params;
    const currentDb = loadDb();
    currentDb.anggota = currentDb.anggota.filter((a: any) => a.id !== id);
    saveDb(currentDb);
    res.json({ success: true });
  });

  // Kegiatan CRUD
  // 1. Get all kegiatan
  app.get("/api/kegiatan", (req, res) => {
    let currentDb = loadDb();
    currentDb = autoShiftKegiatan(currentDb);
    res.json(currentDb.kegiatan);
  });

  // 1b. Get single kegiatan by ID
  app.get("/api/kegiatan/:id", (req, res) => {
    let currentDb = loadDb();
    currentDb = autoShiftKegiatan(currentDb);
    const item = currentDb.kegiatan.find((k: any) => k.id === req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Kegiatan tidak ditemukan" });
    }
  });

  // 1c. Get list of dokumentasi (filterable by kegiatan_id)
  app.get("/api/dokumentasi", (req, res) => {
    const currentDb = loadDb();
    const { kegiatan_id } = req.query;
    if (kegiatan_id) {
      const filtered = currentDb.dokumentasi.filter((d: any) => d.kegiatan_id === kegiatan_id);
      return res.json(filtered);
    }
    res.json(currentDb.dokumentasi);
  });

  // 1d. Create multiple dokumentasi (multi foto sekaligus)
  app.post("/api/dokumentasi", (req, res) => {
    const { kegiatan_id, fotos, keterangan } = req.body; // fotos is array of base64 strings
    if (!kegiatan_id || !fotos || !Array.isArray(fotos)) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const currentDb = loadDb();
    const addedDocs: any[] = [];
    fotos.forEach((foto: string, index: number) => {
      const newDoc = {
        // Unique ID format: doc-timestamp-index
        id: "doc-" + Date.now() + "-" + index,
        kegiatan_id,
        foto,
        keterangan: keterangan || "",
        created_at: new Date().toISOString()
      };
      currentDb.dokumentasi.push(newDoc);
      addedDocs.push(newDoc);
    });
    saveDb(currentDb);
    res.json({ success: true, addedDocs });
  });

  // 1e. Delete single dokumentasi
  app.delete("/api/dokumentasi/:id", (req, res) => {
    const { id } = req.params;
    const currentDb = loadDb();
    currentDb.dokumentasi = currentDb.dokumentasi.filter((d: any) => d.id !== id);
    saveDb(currentDb);
    res.json({ success: true });
  });

  // 1f. Update single dokumentasi caption/keterangan
  app.put("/api/dokumentasi/:id", (req, res) => {
    const { id } = req.params;
    const { keterangan } = req.body;
    const currentDb = loadDb();
    const idx = currentDb.dokumentasi.findIndex((d: any) => d.id === id);
    if (idx !== -1) {
      currentDb.dokumentasi[idx].keterangan = keterangan || "";
      saveDb(currentDb);
      res.json(currentDb.dokumentasi[idx]);
    } else {
      res.status(404).json({ error: "Dokumentasi tidak ditemukan" });
    }
  });

  // --- Profil Desa API ---
  app.get("/api/profil-desa", (req, res) => {
    const currentDb = loadDb();
    res.json(currentDb.profil_desa || null);
  });

  app.post("/api/profil-desa", (req, res) => {
    const { 
      nama_desa, 
      kecamatan, 
      kabupaten, 
      provinsi, 
      alamat, 
      latitude, 
      longitude, 
      link_maps, 
      gambar_peta 
    } = req.body;

    const currentDb = loadDb();
    
    let savedPath = "/uploads/peta/peta_desa.jpg";
    if (gambar_peta && gambar_peta.startsWith("data:image/")) {
      try {
        const matches = gambar_peta.match(/^data:image\/(\w+);base64,(.+)$/);
        if (matches) {
          const buffer = Buffer.from(matches[2], "base64");
          // Ensure directory exists
          const uploadsDir = path.join(process.cwd(), "uploads");
          const petaDir = path.join(uploadsDir, "peta");
          if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
          if (!fs.existsSync(petaDir)) fs.mkdirSync(petaDir);
          fs.writeFileSync(path.join(petaDir, "peta_desa.jpg"), buffer);
        }
      } catch (err) {
        console.error("Gagal menyimpan gambar peta desa:", err);
      }
    }

    currentDb.profil_desa = {
      id: "p1",
      nama_desa: nama_desa || "Desa Sukamaju",
      kecamatan: kecamatan || "Kecamatan Sukasari",
      kabupaten: kabupaten || "Kabupaten Bandung",
      provinsi: provinsi || "Jawa Barat",
      alamat: alamat || "Jl. Raya Sukamaju No.10",
      latitude: latitude || "-6.7845",
      longitude: longitude || "107.6412",
      link_maps: link_maps || "https://maps.google.com/?q=-6.7845,107.6412",
      gambar_peta: savedPath
    };

    saveDb(currentDb);
    res.json(currentDb.profil_desa);
  });

  // Add new kegiatan with detailed fields
  app.post("/api/kegiatan", (req, res) => {
    const { 
      nama, lokasi, tanggal, jam, deskripsi, foto, status, dokumentasi,
      tujuan, latarBelakang, agenda, sasaran,
      apaYangDilakukan, apaYangDihasilkan, dampakKegiatan, kesimpulanKegiatan
    } = req.body;
    const currentDb = loadDb();

    const todayStr = new Date().toISOString().split("T")[0];
    const computedStatus = status || (tanggal < todayStr ? "selesai" : "akan datang");

    const newKegiatan = {
      id: "k" + Date.now(),
      nama,
      lokasi,
      tanggal,
      jam,
      deskripsi,
      status: computedStatus,
      foto: foto || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 150 100'><rect width='100%' height='100%' fill='%23cbd5e1'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='10'>No Image</text></svg>",
      dokumentasi: computedStatus === "selesai" ? (dokumentasi || foto) : undefined,
      
      // Detailed fields
      tujuan: tujuan || "",
      latarBelakang: latarBelakang || "",
      agenda: agenda || "",
      sasaran: sasaran || "",
      
      // Results fields
      apaYangDilakukan: apaYangDilakukan || "",
      apaYangDihasilkan: apaYangDihasilkan || "",
      dampakKegiatan: dampakKegiatan || "",
      kesimpulanKegiatan: kesimpulanKegiatan || ""
    };

    currentDb.kegiatan.push(newKegiatan);
    saveDb(currentDb);
    res.json(newKegiatan);
  });

  // Update kegiatan with detailed fields
  app.put("/api/kegiatan/:id", (req, res) => {
    const { id } = req.params;
    const { 
      nama, lokasi, tanggal, jam, deskripsi, foto, status, dokumentasi,
      tujuan, latarBelakang, agenda, sasaran,
      apaYangDilakukan, apaYangDihasilkan, dampakKegiatan, kesimpulanKegiatan
    } = req.body;
    const currentDb = loadDb();
    const idx = currentDb.kegiatan.findIndex((k: any) => k.id === id);
    if (idx !== -1) {
      const todayStr = new Date().toISOString().split("T")[0];
      const targetDate = tanggal || currentDb.kegiatan[idx].tanggal;
      const computedStatus = status || (targetDate < todayStr ? "selesai" : "akan datang");

      currentDb.kegiatan[idx] = {
        ...currentDb.kegiatan[idx],
        nama: nama || currentDb.kegiatan[idx].nama,
        lokasi: lokasi || currentDb.kegiatan[idx].lokasi,
        tanggal: targetDate,
        jam: jam || currentDb.kegiatan[idx].jam,
        deskripsi: deskripsi || currentDb.kegiatan[idx].deskripsi,
        status: computedStatus,
        foto: foto || currentDb.kegiatan[idx].foto,
        dokumentasi: computedStatus === "selesai" ? (dokumentasi || currentDb.kegiatan[idx].dokumentasi || foto || currentDb.kegiatan[idx].foto) : undefined,
        
        // Detailed fields
        tujuan: tujuan !== undefined ? tujuan : currentDb.kegiatan[idx].tujuan,
        latarBelakang: latarBelakang !== undefined ? latarBelakang : currentDb.kegiatan[idx].latarBelakang,
        agenda: agenda !== undefined ? agenda : currentDb.kegiatan[idx].agenda,
        sasaran: sasaran !== undefined ? sasaran : currentDb.kegiatan[idx].sasaran,

        // Results fields
        apaYangDilakukan: apaYangDilakukan !== undefined ? apaYangDilakukan : currentDb.kegiatan[idx].apaYangDilakukan,
        apaYangDihasilkan: apaYangDihasilkan !== undefined ? apaYangDihasilkan : currentDb.kegiatan[idx].apaYangDihasilkan,
        dampakKegiatan: dampakKegiatan !== undefined ? dampakKegiatan : currentDb.kegiatan[idx].dampakKegiatan,
        kesimpulanKegiatan: kesimpulanKegiatan !== undefined ? kesimpulanKegiatan : currentDb.kegiatan[idx].kesimpulanKegiatan
      };
      saveDb(currentDb);
      res.json(currentDb.kegiatan[idx]);
    } else {
      res.status(404).json({ message: "Kegiatan tidak ditemukan" });
    }
  });

  app.delete("/api/kegiatan/:id", (req, res) => {
    const { id } = req.params;
    const currentDb = loadDb();
    currentDb.kegiatan = currentDb.kegiatan.filter((k: any) => k.id !== id);
    // Also cleanup any associated dokumentasi multi-photos
    currentDb.dokumentasi = currentDb.dokumentasi.filter((d: any) => d.kegiatan_id !== id);
    saveDb(currentDb);
    res.json({ success: true });
  });

  // STATISTICS (Dashboard data)
  app.get("/api/stats", (req, res) => {
    let currentDb = loadDb();
    currentDb = autoShiftKegiatan(currentDb);
    const totalDosen = currentDb.dosen.length;
    const totalAnggota = currentDb.anggota.length;
    const totalAkanDatang = currentDb.kegiatan.filter((k: any) => k.status === "akan datang").length;
    const totalSelesai = currentDb.kegiatan.filter((k: any) => k.status === "selesai").length;

    res.json({
      totalDosen,
      totalAnggota,
      totalAkanDatang,
      totalSelesai
    });
  });

  // EXCEL EXPORT ENDPOINT WITH IMAGE EMBEDDING
  app.get("/api/kegiatan/rekap/excel", async (req, res) => {
    try {
      let currentDb = loadDb();
      currentDb = autoShiftKegiatan(currentDb);

      // We only rekap the completed activities as requested by "Menu Rekap Kegiatan: Berisi kegiatan yang sudah selesai"
      const completedActivities = currentDb.kegiatan.filter((k: any) => k.status === "selesai");

      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Rekap Kegiatan KKN");

      // Set page columns
      worksheet.columns = [
        { header: "No", key: "no", width: 8 },
        { header: "Nama Kegiatan", key: "nama", width: 30 },
        { header: "Lokasi", key: "lokasi", width: 25 },
        { header: "Tanggal", key: "tanggal", width: 18 },
        { header: "Jam", key: "jam", width: 12 },
        { header: "Deskripsi", key: "deskripsi", width: 45 },
        { header: "Foto Kegiatan", key: "foto", width: 22 }
      ];

      // Format Header Row
      const headerRow = worksheet.getRow(1);
      headerRow.height = 30;
      headerRow.eachCell((cell) => {
        // Dark blue header (#1E3A8A)
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1E3A8A" }
        };
        cell.font = {
          name: "Arial",
          bold: true,
          color: { argb: "FFFFFFFF" },
          size: 11
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center"
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFCBD5E1" } },
          bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
          left: { style: "thin", color: { argb: "FFCBD5E1" } },
          right: { style: "thin", color: { argb: "FFCBD5E1" } }
        };
      });

      // Populate data and embed photos
      for (let i = 0; i < completedActivities.length; i++) {
        const k = completedActivities[i];
        const rowIndex = i + 2;
        const row = worksheet.getRow(rowIndex);

        row.getCell(1).value = i + 1;
        row.getCell(2).value = k.nama;
        row.getCell(3).value = k.lokasi;
        row.getCell(4).value = k.tanggal;
        row.getCell(5).value = k.jam;
        row.getCell(6).value = k.deskripsi;
        row.getCell(7).value = ""; // Holds the image

        // Set high row heights to fit pictures perfectly (e.g. 100pt)
        row.height = 100;

        // Apply borders and alignments to each cell
        row.eachCell((cell, colNum) => {
          cell.alignment = {
            vertical: "middle",
            horizontal: colNum === 1 || colNum === 4 || colNum === 5 || colNum === 7 ? "center" : "left",
            wrapText: colNum === 6 || colNum === 2 // Allow wrap for Description and Title
          };
          cell.border = {
            top: { style: "thin", color: { argb: "FFCBD5E1" } },
            bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
            left: { style: "thin", color: { argb: "FFCBD5E1" } },
            right: { style: "thin", color: { argb: "FFCBD5E1" } }
          };
        });

        // Add Image
        // Check if documentation or regular photo exists and is base64
        const rawPhoto = k.dokumentasi || k.foto;
        if (rawPhoto && rawPhoto.startsWith("data:image/")) {
          try {
            // Parse base64 parts
            const match = rawPhoto.match(/^data:image\/(\w+);base64,(.+)$/);
            if (match) {
              const extension = match[1] === "svg+xml" ? "png" : (match[1] as any);
              let base64Data = match[2];

              // Since standard SVG base64 is not natively supported inside Excel by all viewers,
              // we can still write it or fallback safely. For our SVG-based placeholders,
              // let's render text or process safely. ExcelJS works beautifully with PNG/JPEG.
              // If extension is not directly png/jpeg, or if it is svg, we can either convert or let exceljs try.
              if (extension === "svg" || rawPhoto.includes("<svg")) {
                // If it is our inline SVG string, we don't have canvas to convert to PNG server side, 
                // but we can either skip or write a text note. To make it perfect, let's embed a standard tiny fallback PNG 
                // for SVG data URIs, or let the user's uploaded actual PNG/JPEG work beautifully!
                // Let's use a standard tiny grey PNG base64 for SVG defaults, while actual user uploaded images (which are PNG/JPG base64 from FileReader) will embed perfectly!
                const tinyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                const imageId = workbook.addImage({
                  base64: tinyPngBase64,
                  extension: "png"
                });
                worksheet.addImage(imageId, {
                  tl: { col: 6, row: rowIndex - 1 },
                  ext: { width: 100, height: 100 },
                  editAs: "oneCell"
                });
                row.getCell(7).value = "[Default Placeholder]";
              } else {
                const imageId = workbook.addImage({
                  base64: base64Data,
                  extension: extension
                });
                worksheet.addImage(imageId, {
                  tl: { col: 6, row: rowIndex - 1 },
                  ext: { width: 100, height: 100 },
                  editAs: "oneCell"
                });
              }
            }
          } catch (imgError) {
            console.error("Gagal menyematkan gambar ke Excel:", imgError);
            row.getCell(7).value = "[Gagal Memuat Foto]";
          }
        } else {
          row.getCell(7).value = "Tidak Ada Foto";
        }
      }

      // Set Response headers for Excel download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Rekap_Kegiatan_KKN.xlsx"
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Gagal export excel:", error);
      res.status(500).send("Gagal mengunduh berkas Excel rekap.");
    }
  });

  // Vite Integration Setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] KKN Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
