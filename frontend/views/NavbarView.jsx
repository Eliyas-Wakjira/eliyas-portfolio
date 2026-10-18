/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend View: NavbarView (V in MVC)
 */
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../controllers/authController";
import {
  FileDown,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  User,
  RefreshCw,
  Download
} from "lucide-react";
import { EliyasLogo } from "../components/EliyasLogo";
const NavbarView = ({
  currentTab,
  onSelectTab,
  onOpenCV,
  onOpenLogin,
  onOpenAdmin,
  isAdminOpen = false,
  onCloseAdmin,
  onResetDefaults,
  onExportBackup
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navLinks = [
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "certificates", label: "Certificates" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" }
  ];
  const handleNavClick = (tabId) => {
    if (isAdminOpen && onCloseAdmin) {
      onCloseAdmin();
    }
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };
  return <header
    className={`sticky top-0 z-[60] w-full transition-all duration-300 h-16 sm:h-[76px] flex items-center ${isScrolled ? "bg-[#06265d]/95 backdrop-blur-xl shadow-lg border-b border-white/10" : "bg-[#083785] border-b border-white/10 shadow-md"}`}
  >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 xl:gap-4">
          {
    /* ========================================================= */
  }
          {
    /* ZONE 1: BRAND IDENTIFIER                                  */
  }
          {
    /* ========================================================= */
  }
          <div className="flex items-center gap-3 min-w-0">
            <button
    onClick={() => handleNavClick("home")}
    className="text-left group flex items-center gap-3 cursor-pointer min-w-0"
  >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center ring-1 ring-white/20">
                <EliyasLogo className="w-full h-full" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg sm:text-xl text-white tracking-tight group-hover:text-white transition-colors whitespace-nowrap">
                    Eliyas Wakjira
                  </span>
                  {isAdminOpen && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ECC257] text-[#083785]">
                      <ShieldCheck className="w-3 h-3 text-[#083785]" />
                      <span>Admin Studio</span>
                    </span>
                  )}
                </div>
                <span className="hidden sm:block text-[10px] lg:text-[11px] font-nav text-blue-200/90 tracking-wide font-medium">
                  Excellence in Digital Transformation
                </span>
              </div>
            </button>
          </div>

          {
    /* ========================================================= */
  }
          {
    /* ZONE 2: PRIMARY NAVIGATION LINKS (Bold, Larger Font, Stylish) */
  }
          {
    /* ========================================================= */
  }
          <nav aria-label="Main navigation" className="hidden xl:flex items-center justify-end gap-4 2xl:gap-5">
            {navLinks.map((link) => {
    const isActive = !isAdminOpen && currentTab === link.id;
    return <button
      key={link.id}
      onClick={() => handleNavClick(link.id)}
      aria-current={isActive ? "page" : undefined}
      className={`px-2.5 2xl:px-3 py-2 text-base 2xl:text-lg font-semibold font-nav rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${isActive ? "bg-white text-[#083785] shadow-sm" : "text-blue-100 hover:text-white hover:bg-white/10"}`}
    >
                  <span>{link.label}</span>
                </button>;
  })}
          </nav>

          {
    /* ========================================================= */
  }
          {
    /* ZONE 3: ACTIONS & AUTHENTICATION BUTTON                   */
  }
          {
    /* ========================================================= */
  }
          <div className="col-start-2 row-start-1 xl:col-start-3 flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            {isAdminOpen ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={onResetDefaults}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-rose-200 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 rounded-xl transition-all cursor-pointer border border-rose-400/30"
                  title="Reset all content to factory defaults"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  onClick={onExportBackup}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer border border-white/20"
                  title="Download JSON backup"
                >
                  <Download className="w-3.5 h-3.5 text-[#ECC257]" />
                  <span>Export</span>
                </button>

                <button
                  onClick={onCloseAdmin}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#083785] bg-[#ECC257] hover:bg-[#e0b74e] rounded-xl shadow-md transition-all cursor-pointer"
                  title="Close Admin and view portfolio"
                >
                  <X className="w-4 h-4 text-[#083785]" />
                  <span>Close Admin</span>
                </button>
              </div>
            ) : !isAuthenticated ? <button
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-extrabold text-white bg-[#C33E1F] hover:bg-[#a83219] active:scale-95 rounded-xl shadow-md transition-all cursor-pointer font-display"
              title="Sign in as Administrator or Guest"
            >
              <User className="w-3.5 h-3.5 text-white" />
              <span>Sign In</span>
            </button> : (
    /* Authenticated User Menu */
    <div className="relative" ref={dropdownRef}>
                <button
      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-white/15 border border-white/25 rounded-xl hover:bg-white/25 transition-colors cursor-pointer"
    >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="truncate max-w-[110px]">{user?.full_name?.split(" ")[0]}</span>
                  {isAdmin && <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#ECC257] text-[#083785] rounded font-extrabold">
                      Admin
                    </span>}
                </button>

                {userDropdownOpen && <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.full_name}</p>
                      <p className="text-[11px] font-mono text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <button
      onClick={() => {
        setUserDropdownOpen(false);
        onOpenAdmin();
      }}
      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-[#083785] font-semibold flex items-center gap-2 cursor-pointer"
    >
                      <ShieldCheck className="w-4 h-4 text-[#083785]" />
                      <span>Admin SQL Studio</span>
                    </button>

                    <button
      onClick={() => {
        setUserDropdownOpen(false);
        logout();
      }}
      className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1"
    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>}
              </div>
  )}

            {
    /* Mobile Hamburger Toggle */
  }
            <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="xl:hidden p-2 text-white hover:text-white hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
    aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
    aria-expanded={mobileMenuOpen}
  >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {
    /* Mobile Drawer Navigation */
  }
      {mobileMenuOpen && <div className="xl:hidden fixed inset-x-0 top-16 sm:top-[76px] max-h-[calc(100dvh-4rem)] overflow-y-auto bg-[#062c6d] border-b border-white/10 shadow-2xl p-4 sm:p-6 space-y-3 z-[70] animate-in fade-in slide-in-from-top-4 duration-200">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1.5 max-w-7xl mx-auto">
            {navLinks.map((link, index) => {
    const isActive = currentTab === link.id;
    return <button
      key={link.id}
      onClick={() => handleNavClick(link.id)}
      aria-current={isActive ? "page" : undefined}
      className={`w-full flex items-center justify-between px-4 py-3 text-lg font-semibold font-nav rounded-xl transition-colors text-left cursor-pointer ${isActive ? "bg-white text-[#083785] shadow-sm" : "text-blue-100 hover:bg-white/10 hover:text-white"}`}
    >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className={`text-xs ${isActive ? "text-[#083785]/50" : "text-blue-200/60"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>;
  })}
          </nav>

          <div className="pt-2 border-t border-blue-900/80 flex items-center justify-center">
            {!isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 text-xs sm:text-sm font-extrabold font-display text-white bg-[#C33E1F] hover:bg-[#a83219] rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <User className="w-4 h-4 text-white" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 text-xs sm:text-sm font-extrabold font-display text-[#083785] bg-white rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#083785]" />
                <span>Admin Studio</span>
              </button>
            )}
          </div>
        </div>}
    </header>;
};
export {
  NavbarView
};
