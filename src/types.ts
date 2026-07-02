export interface Dosen {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  foto: string;
}

export interface Anggota {
  id: string;
  nama: string;
  nim: string;
  jabatan: string;
  foto: string;
}

export interface Kegiatan {
  id: string;
  nama: string;
  lokasi: string;
  tanggal: string;
  jam: string;
  deskripsi: string;
  status: "akan datang" | "selesai";
  foto: string;
  dokumentasi?: string;
  
  // Detailed fields for news/portal display
  tujuan?: string;
  latarBelakang?: string;
  agenda?: string;
  sasaran?: string;

  // Results for completed activities
  apaYangDilakukan?: string;
  apaYangDihasilkan?: string;
  dampakKegiatan?: string;
  kesimpulanKegiatan?: string;
}

export interface Dokumentasi {
  id: string;
  kegiatan_id: string;
  foto: string;
  keterangan: string;
  created_at: string;
}

export interface Stats {
  totalDosen: number;
  totalAnggota: number;
  totalAkanDatang: number;
  totalSelesai: number;
}

export interface ProfilDesa {
  id: string;
  nama_desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  alamat: string;
  latitude: string;
  longitude: string;
  link_maps: string;
  gambar_peta: string;
}

