import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, LayoutDashboard, Home, Users, CalendarDays, LogIn } from "lucide-react";

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Navbar({ currentView, setCurrentView, isAdmin, onLogout }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  // Track scroll position for backdrop blurring
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync theme with HTML document class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [activeSection, setActiveSection] = useState("home");

  // Scroll Spy to track which section is currently active
  useEffect(() => {
    if (currentView !== "home") return;

    const handleScrollSpy = () => {
      const sections = ["home", "struktur-kelompok", "kegiatan"];
      const scrollPosition = window.scrollY + 200; // offset for nav height

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy);
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [currentView]);

  const menuItems = [
    { id: "home", label: "Beranda", icon: Home },
    { id: "struktur-kelompok", label: "Struktur Kelompok", icon: Users },
    { id: "kegiatan", label: "Kegiatan KKN", icon: CalendarDays },
  ];

  const handleNavClick = (id: string) => {
    setCurrentView("home");
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to the section
    setTimeout(() => {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 120);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-slate-250/80 dark:border-slate-800/80 py-3.5"
          : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200/40 dark:border-slate-900/40 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-12">
          {/* Logo with Blue Gradient */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="/assets/img/logo-kkn.png" 
              alt="Logo KKN STMIK LOMBOK" 
              className="h-[45px] w-auto shrink-0 group-hover:scale-105 transition-transform duration-300" 
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <strong className="text-[18px] font-bold text-slate-900 dark:text-white leading-tight tracking-wide font-display">
                KKN STMIK LOMBOK
              </strong>
              <small className="text-[13px] font-medium text-blue-600 dark:text-blue-300 -mt-[2px]">
                Kelompok 5 - Desa Mangkung
              </small>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm uppercase tracking-wider">
            {!isAdmin ? (
              <>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`transition-colors py-1 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                      (currentView === "home" && activeSection === item.id) || (currentView === "detail" && item.id === "kegiatan")
                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-0.5 font-bold"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentView("login")}
                  className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    currentView === "login"
                      ? "bg-blue-700 text-white shadow-md"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  Login Admin
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentView("admin")}
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 hover:opacity-80 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  DASHBOARD ADMIN
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs font-bold text-red-600 hover:text-red-500 dark:text-red-400 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/20 hover:bg-red-100 transition"
                >
                  KELUAR
                </button>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all border border-slate-200/50 dark:border-slate-800/50"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all border border-slate-200/50 dark:border-slate-800/50"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 absolute top-full left-0 w-full p-4 space-y-3 shadow-lg animate-fadeIn">
          {!isAdmin ? (
            <>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      (currentView === "home" && activeSection === item.id) || (currentView === "detail" && item.id === "kegiatan")
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              
              <button
                onClick={() => {
                  setCurrentView("login");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium bg-blue-600 text-white shadow-sm hover:bg-blue-700"
              >
                <LogIn className="w-5 h-5" />
                Admin Login
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setCurrentView("admin");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard Admin
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <X className="w-5 h-5" />
                Keluar
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
