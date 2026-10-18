/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend Root: App.tsx (MVC Architecture)
 */
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./controllers/authController";
import { NavbarView } from "./views/NavbarView";
import { FooterView } from "./views/FooterView";
import { HomeView } from "./views/HomeView";
import { ProjectDetailModalView } from "./views/ProjectDetailModalView";
import { LoginModalView } from "./views/LoginModalView";
import { CVModalView } from "./views/CVModalView";
import { AdminStudioModalView } from "./views/AdminStudioModalView";
import { PortfolioController } from "./controllers/portfolioController";
import { FolderGit2, Cpu, Briefcase, Award, UserCheck, Mail } from "lucide-react";
const AppContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [profile, setProfile] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminStudioOpen, setIsAdminStudioOpen] = useState(false);

  useEffect(() => {
    const loadProfile = () => {
      PortfolioController.fetchProfile()
        .then(setProfile)
        .catch((error) => console.error("Failed to load profile from the database:", error));
    };
    loadProfile();
    window.addEventListener("portfolio_data_updated", loadProfile);
    return () => window.removeEventListener("portfolio_data_updated", loadProfile);
  }, []);

  const handleResetDefaults = () => {
    if (window.confirm("WARNING: This will reset all frontend projects, skills, certificates, and hero info to factory defaults. Continue?")) {
      PortfolioController.resetAllToDefaults();
    }
  };

  const handleExportBackup = () => {
    const json = PortfolioController.exportFullBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eliyas_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectTab = (tabId) => {
    // Automatically close modals so navigation smoothly switches view
    setIsAdminStudioOpen(false);
    setSelectedProject(null);
    setIsCVModalOpen(false);
    setIsLoginModalOpen(false);

    setActiveNavTab(tabId);
    if (tabId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const elem = document.getElementById(tabId);
    if (elem) {
      const yOffset = -88;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["projects", "skills", "experience", "certificates", "about", "contact"];
      const activeSection = sectionIds
        .filter((id) => {
          const section = document.getElementById(id);
          return section && section.getBoundingClientRect().top <= 120;
        })
        .pop();
      const isAtPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const nextActiveTab = isAtPageBottom
        ? "contact"
        : window.scrollY < 200 || !activeSection
          ? "home"
          : activeSection;
      setActiveNavTab((currentTab) => currentTab === nextActiveTab ? currentTab : nextActiveTab);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <div className="min-h-screen bg-[#F0F6FA] text-slate-900 flex flex-col font-sans selection:bg-[#083785] selection:text-white">
      {
    /* Navbar View */
  }
      <NavbarView
    profile={profile}
    currentTab={activeNavTab}
    onSelectTab={handleSelectTab}
    onOpenCV={() => setIsCVModalOpen(true)}
    onOpenLogin={() => setIsLoginModalOpen(true)}
    onOpenAdmin={() => setIsAdminStudioOpen(true)}
    isAdminOpen={isAdminStudioOpen}
    onCloseAdmin={() => setIsAdminStudioOpen(false)}
    onResetDefaults={handleResetDefaults}
    onExportBackup={handleExportBackup}
  />

      {
    /* Main Single-Page Content View */
  }
      <main className="flex-1">
        <HomeView
          profile={profile}
          onSelectTab={handleSelectTab}
          onOpenProject={(proj) => setSelectedProject(proj)}
          onOpenCV={() => setIsCVModalOpen(true)}
        />
      </main>

      {
    /* Footer View */
  }
      <FooterView
        profile={profile}
        onSelectTab={handleSelectTab}
        onOpenCV={() => setIsCVModalOpen(true)}
      />

      {
    /* Modals */
  }
      <ProjectDetailModalView
    project={selectedProject}
    onClose={() => setSelectedProject(null)}
  />

      <CVModalView
    profile={profile}
    isOpen={isCVModalOpen}
    onClose={() => setIsCVModalOpen(false)}
  />

      <LoginModalView
    isOpen={isLoginModalOpen}
    onClose={() => setIsLoginModalOpen(false)}
    onSuccess={() => setIsAdminStudioOpen(true)}
  />

      <AdminStudioModalView
    isOpen={isAdminStudioOpen}
    onClose={() => setIsAdminStudioOpen(false)}
  />

      {
    /* Mobile Floating Bottom Dock */
  }
      <div className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xl border border-slate-200 flex items-center gap-1">
        {[
    { id: "projects", icon: FolderGit2, label: "Projects" },
    { id: "skills", icon: Cpu, label: "Skills" },
    { id: "experience", icon: Briefcase, label: "Experience" },
    { id: "certificates", icon: Award, label: "Certificates" },
    { id: "about", icon: UserCheck, label: "About" },
    { id: "contact", icon: Mail, label: "Contact" }
  ].map((item) => {
    const Icon = item.icon;
    const isActive = activeNavTab === item.id;
    return <button
      key={item.id}
      onClick={() => handleSelectTab(item.id)}
      className={`p-2 rounded-full transition-all cursor-pointer flex flex-col items-center ${isActive ? "bg-[#083785] text-white scale-110 shadow-xs" : "text-slate-600 hover:text-[#083785] hover:bg-slate-100"}`}
      title={item.label}
    >
              <Icon className="w-4 h-4" />
            </button>;
  })}
      </div>
    </div>;
};
function App() {
  return <AuthProvider>
      <AppContent />
    </AuthProvider>;
}
export {
  App as default
};
