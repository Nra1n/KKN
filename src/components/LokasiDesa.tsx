import React, { useEffect, useRef, useState } from "react";
import { ProfilDesa } from "../types";
import { MapPin, Map, Navigation, AlertCircle, ExternalLink } from "lucide-react";

interface LokasiDesaProps {
  profil: ProfilDesa | null;
}

export default function LokasiDesa({ profil }: LokasiDesaProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  // Load Leaflet dynamically to avoid bundler issues and ensure seamless runtime integration
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Initialize and update the interactive map when data or Leaflet is ready
  useEffect(() => {
    if (!leafletLoaded || !profil || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const lat = parseFloat(profil.latitude) || -6.7845;
    const lng = parseFloat(profil.longitude) || 107.6412;

    // Destroy existing instance to prevent duplicates on state reload
    if (mapRef.current) {
      mapRef.current.remove();
    }

    try {
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false // Prevent intrusive scrolling issues
      }).setView([lat, lng], 14);
      
      mapRef.current = map;

      // Beautiful light-themed OSM tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom high-contrast marker setup
      const markerIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });

      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);

      const popupContent = `
        <div class="p-2 text-slate-800 font-sans" style="min-width: 200px;">
          <h6 class="font-extrabold text-blue-700 text-sm mb-1">
            Lokasi KKN Kelompok Desa Sukamaju
          </h6>
          <p class="text-xs text-slate-600 mb-2 leading-tight">
            <strong>${profil.nama_desa}</strong><br/>
            ${profil.alamat}
          </p>
          <div class="w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
            <img src="${profil.gambar_peta || '/uploads/peta/peta_desa.jpg'}" alt="Foto Desa" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();
    } catch (err) {
      console.error("Gagal memuat peta Leaflet:", err);
    }
  }, [leafletLoaded, profil]);

  // If no profile is available, show bootstrap alert as requested in guideline #9
  if (!profil) {
    return (
      <section id="lokasi-desa" className="py-16 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center gap-4 text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <h5 className="font-bold text-sm">Data lokasi desa belum tersedia</h5>
              <p className="text-xs opacity-90 mt-0.5">Silakan login sebagai administrator dan perbarui menu Profil Desa melalui Dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lokasi-desa" className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Map className="w-3.5 h-3.5" />
            Pusat Informasi Wilayah
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            Lokasi Desa KKN
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            Wilayah pelaksanaan program KKN dan lokasi desa
          </p>
        </div>

        {/* Card Modern Bootstrap-Style */}
        <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden p-6 sm:p-10 space-y-10">
          
          {/* Top Half: Static Peta Desa (Centered, Rounded, Hover-Zoom, Transition Effects) */}
          <div className="flex flex-col items-center">
            <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              Peta Pembagian Area Desa
            </h4>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 max-w-3xl w-full aspect-[16/10] bg-slate-100 dark:bg-slate-950 transition-all duration-500 hover:shadow-2xl hover:border-blue-500/30">
              <img 
                src={profil.gambar_peta || "/uploads/peta/peta_desa.jpg"} 
                alt="Peta Desa Sukamaju KKN" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20'>Peta Wilayah KKN</text></svg>";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Bottom Half: Information Grid & Interactive Leaflet Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Information Card & Navigation Button */}
            <div className="flex flex-col justify-between p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-6">
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
                      Informasi Geografis Desa
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Koordinat wilayah pelaksanaan KKN
                    </p>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  <div className="flex justify-between py-2 items-center">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Nama Desa</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{profil.nama_desa}</span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Kecamatan</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{profil.kecamatan}</span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Kabupaten</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{profil.kabupaten}</span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Provinsi</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{profil.provinsi}</span>
                  </div>
                  <div className="flex justify-between py-2 items-start pt-3">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 pt-0.5">Alamat</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-right max-w-[200px] leading-relaxed">
                      {profil.alamat}
                    </span>
                  </div>
                </div>
              </div>

              {/* Blue Gradient Navigation Button */}
              <div className="pt-4">
                <a
                  href={profil.link_maps || `https://maps.google.com/?q=${profil.latitude},${profil.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-500/15 active:scale-95 text-sm"
                >
                  <Navigation className="w-4 h-4 animate-pulse" />
                  Lihat Lokasi di Google Maps
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* Interactive Leaflet Map Container with custom frame styling */}
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Peta Interaktif Desa KKN
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Gunakan mouse/jari untuk navigasi
                </span>
              </div>
              
              <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-950 z-10">
                <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
                
                {!leafletLoaded && (
                  <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xs text-slate-400 gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Memuat Peta Interaktif...
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
