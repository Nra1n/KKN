import { Instagram, Youtube, Facebook, ShieldAlert, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          
          {/* Group Logo and Moto */}
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                KKN
              </div>
              <span className="text-lg font-bold font-display text-slate-800 dark:text-white">
                Kelompok 5 Mangkung
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Mengabdi dengan tulus, mendampingi masyarakat, membangun peradaban desa yang mandiri dan berkemajuan.
            </p>
          </div>

          {/* University Info */}
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold font-mono">Penyelenggara</p>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Lembaga Penelitian dan Pengabdian Kepada Masyarakat (LPPM)</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-bold">STMIK LOMBOK</p>
          </div>

          {/* Social Media & Metadata */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/kkndesamangkung2026/"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-50 hover:bg-gradient-to-tr hover:from-yellow-600 hover:via-pink-600 hover:to-indigo-600 text-slate-500 hover:text-white dark:bg-slate-950 dark:text-slate-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 transition duration-300 shadow-sm"
                aria-label="Instagram KKN"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-50 hover:bg-red-600 text-slate-500 hover:text-white dark:bg-slate-950 dark:text-slate-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 transition duration-300 shadow-sm"
                aria-label="YouTube KKN"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-50 hover:bg-blue-600 text-slate-500 hover:text-white dark:bg-slate-950 dark:text-slate-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 transition duration-300 shadow-sm"
                aria-label="Facebook KKN"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
            
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Tahun KKN: <span className="text-slate-700 dark:text-slate-300 font-semibold">{currentYear}</span>
            </p>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500 text-center">
          <p>© {currentYear} KKN Kelompok 5 Mangkung. All rights reserved.</p>
          <p className="flex items-center gap-1 justify-center">
            Membangun Desa Bersama dengan <Heart className="w-3 h-3 text-red-500 fill-current" /> LPPM STMIK LOMBOK
          </p>
        </div>
      </div>
    </footer>
  );
}
