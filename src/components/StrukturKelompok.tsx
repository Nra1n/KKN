import { Dosen, Anggota } from "../types";
import { UserCheck, GraduationCap, Award, IdCard, Users } from "lucide-react";

interface StrukturKelompokProps {
  dosen: Dosen[];
  anggota: Anggota[];
}

export default function StrukturKelompok({ dosen, anggota }: StrukturKelompokProps) {
  return (
    <section id="struktur-kelompok" className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            Penggerak Program
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            Struktur Kelompok KKN
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            Kolaborasi akademisi dan mahasiswa hebat yang mendedikasikan waktu dan gagasan kreatifnya untuk pemberdayaan masyarakat Desa Sukamaju.
          </p>
        </div>

        {/* 1. Dosen Pembimbing Lapangan (DPL) Section */}
        <div className="mb-20">
          <h3 className="text-xs font-bold text-center text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 font-display flex items-center justify-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Dosen Pembimbing Lapangan
          </h3>
          <div className="flex justify-center">
            {dosen.length === 0 ? (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-xl p-5 text-center font-medium my-4 w-full max-w-sm">
                Data dosen belum tersedia
              </div>
            ) : (
              dosen.map((d) => (
                <div
                  key={d.id}
                  className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center transition-all duration-300 group hover:shadow-md hover:border-blue-500/20"
                >
                  <div className="relative w-28 h-28 mx-auto mb-5 rounded-full p-0.5 bg-gradient-to-br from-blue-400 to-blue-600 transition-transform group-hover:scale-105">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 overflow-hidden p-1">
                      <img
                        src={d.foto}
                        alt={d.nama}
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight font-display">
                    {d.nama}
                  </h4>
                  <p className="text-xs text-blue-500 dark:text-blue-400 font-semibold mt-1">
                    NIP: {d.nip}
                  </p>
                  
                  {/* Badge */}
                  <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" />
                    {d.jabatan}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Mahasiswa Anggota Section */}
        <div>
          <h3 className="text-xs font-bold text-center text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-10 font-display flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Struktur Anggota Kelompok
          </h3>

          {anggota.length === 0 ? (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-xl p-5 text-center font-medium my-4 w-full">
              Data anggota belum tersedia
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {anggota.map((m, idx) => (
                <div
                  key={m.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-blue-500/20 group relative overflow-hidden"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative w-24 h-24 mb-5 rounded-full p-0.5 bg-slate-100 dark:bg-slate-800 group-hover:bg-gradient-to-br group-hover:from-blue-400 group-hover:to-blue-600 transition-all duration-300">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 overflow-hidden p-1">
                      <img
                        src={m.foto}
                        alt={m.nama}
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  
                  <h4 className="text-base font-bold text-slate-800 dark:text-white font-display group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {m.nama}
                  </h4>

                  {/* NIM ID Display */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-1">
                    <IdCard className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    <span>NIM: {m.nim}</span>
                  </div>

                  {/* Member Role Badge */}
                  <div className="mt-4 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/20 dark:group-hover:text-blue-300 group-hover:border-blue-200 transition-all">
                    {m.jabatan}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
