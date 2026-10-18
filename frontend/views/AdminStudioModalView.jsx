/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend View: AdminStudioModalView (V in MVC)
 * Professional Admin Dashboard allowing full editing of everything on the frontend:
 * 1. Hero & Profile (Name, Bio, 4 Stats)
 * 2. Projects (Create, Edit, Delete, Toggle Featured, Image presets)
 * 3. Tech Stack & Skills (Create, Edit, Delete, Categories, Icons, Colors)
 * 4. Certificates & Accreditation (Create, Edit, Delete, 4 Categories, Links, Skills)
 * 5. Career & Experience (Create, Edit, Delete, Deliverables list)
 * 6. About & Pedagogy (Headlines, Bio paragraphs, Academic details)
 * 7. Client Inquiries / Messages Inbox (View, Reply, Delete)
 * 8. Backup / Export / Factory Reset
 */
import { useState, useEffect } from "react";
import { useAuth } from "../controllers/authController";
import { MessageController } from "../controllers/messageController";
import { PortfolioController, DEFAULT_PROFILE } from "../controllers/portfolioController";
import { TechLogo } from "../components/TechLogo";
import { ProjectPreviewImage } from "../components/ProjectPreviewImage";
import { isDeployedProject, isPublicHttpsUrl } from "../models/projectPreview";
import { apiFetch as fetch, apiUrl } from "../controllers/api";
import {
  X,
  ShieldCheck,
  Mail,
  FolderGit2,
  Cpu,
  Award,
  Briefcase,
  User,
  Info,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  Eye,
  ArrowLeft
} from "lucide-react";

const AdminStudioModalView = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [toastMessage, setToastMessage] = useState(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);

  // Editable States
  const [profileData, setProfileData] = useState(DEFAULT_PROFILE);
  const [projectsList, setProjectsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [certsList, setCertsList] = useState([]);
  const [expsList, setExpsList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);

  // Active Editing Modals/Drawers
  const [editingProject, setEditingProject] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [editingExp, setEditingExp] = useState(null);

  // Search/Filters
  const [projectSearch, setProjectSearch] = useState("");
  const [certFilterCat, setCertFilterCat] = useState("All");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadAllData = () => {
    setProfileData(PortfolioController.getProfile());
    setProjectsList(PortfolioController.getProjects());
    setSkillsList(PortfolioController.getSkills());
    setCertsList(PortfolioController.getCertificates());
    setExpsList(PortfolioController.getExperiences());
    MessageController.fetchMessages().then((msgs) => {
      if (msgs && msgs.length > 0) setMessagesList(msgs);
    });
  };

  useEffect(() => {
    if (isOpen) {
      loadAllData();
      document.body.style.overflow = "hidden";
      const handleUpdate = () => loadAllData();
      window.addEventListener("portfolio_data_updated", handleUpdate);
      return () => {
        window.removeEventListener("portfolio_data_updated", handleUpdate);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Save Handlers
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    await PortfolioController.updateProfile(profileData);
    showToast("Profile & Hero details saved! Frontend updated.");
  };

  const handleSaveProject = async (e) => {
    e?.preventDefault();
    if (!editingProject?.title) return alert("Project title is required");
    const isDeployed = isDeployedProject(editingProject);
    const previewMode = editingProject.preview_mode || (isDeployed ? "auto" : "screenshot");
    if (editingProject.live_url && !isPublicHttpsUrl(editingProject.live_url)) {
      return alert("Project deployment links must use a public HTTPS URL.");
    }
    if (editingProject.repo_url && !isPublicHttpsUrl(editingProject.repo_url)) {
      return alert("Repository links must use a public HTTPS URL.");
    }
    if (isDeployed && previewMode === "auto" && !isPublicHttpsUrl(editingProject.live_url)) {
      return alert("Add a valid public HTTPS deployment URL to capture its live screen.");
    }
    if (previewMode === "screenshot" && !editingProject.screenshot_url) {
      return alert("Upload a project screenshot before saving this preview option.");
    }
    if (!isDeployed && previewMode !== "screenshot") {
      return alert("Only deployed projects can use automatic live website screenshots.");
    }
    await PortfolioController.saveProject(editingProject);
    setProjectsList(PortfolioController.getProjects());
    setEditingProject(null);
    showToast("Project saved successfully!");
  };

  const handleProjectScreenshotUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      return alert("Choose a JPEG, PNG, or WebP screenshot no larger than 5 MB.");
    }

    setUploadingScreenshot(true);
    try {
      const response = await fetch("/api/uploads/project-screenshot", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": file.type },
        body: file
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Screenshot upload failed");
      setEditingProject((current) => ({
        ...current,
        screenshot_url: result.data.url,
        preview_mode: "screenshot"
      }));
      showToast("Project screenshot uploaded.");
    } catch (error) {
      alert(error.message || "Screenshot upload failed.");
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handleCertificateFileUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      return alert("Choose a JPEG, PNG, WebP, or PDF certificate file no larger than 10 MB.");
    }

    setUploadingCertificate(true);
    try {
      const response = await fetch("/api/uploads/certificate-file", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Certificate upload failed");
      setEditingCert((current) => ({
        ...current,
        file_url: result.data.url,
        file_mime_type: result.data.mimeType
      }));
      showToast("Certificate file uploaded.");
    } catch (error) {
      alert(error.message || "Certificate upload failed.");
    } finally {
      setUploadingCertificate(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    await PortfolioController.deleteProject(id);
    setProjectsList(PortfolioController.getProjects());
    showToast("Project removed from frontend.");
  };

  const handleSaveSkill = async (e) => {
    e?.preventDefault();
    if (!editingSkill?.name) return alert("Skill name is required");
    await PortfolioController.saveSkill(editingSkill);
    setSkillsList(PortfolioController.getSkills());
    setEditingSkill(null);
    showToast("Tech skill saved! Columns updated.");
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Delete this technology from the stack?")) return;
    await PortfolioController.deleteSkill(id);
    setSkillsList(PortfolioController.getSkills());
    showToast("Technology removed.");
  };

  const handleSaveCert = async (e) => {
    e?.preventDefault();
    if (!editingCert?.title) return alert("Certificate title is required");
    await PortfolioController.saveCertificate(editingCert);
    setCertsList(PortfolioController.getCertificates());
    setEditingCert(null);
    showToast("Certificate saved! Row marquee updated.");
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm("Delete this certificate credential?")) return;
    await PortfolioController.deleteCertificate(id);
    setCertsList(PortfolioController.getCertificates());
    showToast("Certificate removed.");
  };

  const handleSaveExp = async (e) => {
    e?.preventDefault();
    if (!editingExp?.role) return alert("Role title is required");
    await PortfolioController.saveExperience(editingExp);
    setExpsList(PortfolioController.getExperiences());
    setEditingExp(null);
    showToast("Work experience saved!");
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm("Delete this work experience entry?")) return;
    await PortfolioController.deleteExperience(id);
    setExpsList(PortfolioController.getExperiences());
    showToast("Experience removed.");
  };

  const handleDeleteMessage = async (id) => {
    await MessageController.deleteMessage(id);
    setMessagesList((prev) => prev.filter((m) => m.id !== id));
    showToast("Message deleted.");
  };

  const handleResetDefaults = () => {
    if (window.confirm("WARNING: This will reset all frontend projects, skills, certificates, and hero info to factory defaults. Continue?")) {
      PortfolioController.resetAllToDefaults();
      loadAllData();
      showToast("All portfolio items reset to initial defaults.");
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
    showToast("Backup JSON file exported.");
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const ok = PortfolioController.importFullBackup(evt.target.result);
      if (ok) {
        loadAllData();
        showToast("Backup restored successfully! Frontend reloaded.");
      } else {
        alert("Failed to parse valid backup JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed top-16 sm:top-[70px] inset-x-0 bottom-0 z-40 bg-white flex flex-col overflow-hidden animate-in fade-in duration-200">

        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shrink-0 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MAIN BODY: SIDEBAR + CONTENT AREA                           */}
        {/* ============================================================ */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="w-56 sm:w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0 p-3 sm:p-4 space-y-4 overflow-y-auto">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 block">
                Manage Frontend
              </span>

              {[
                { id: "overview", label: "Overview Metrics", icon: Sparkles, count: null },
                { id: "profile", label: "Hero & Bio Profile", icon: User, count: null },
                { id: "projects", label: "Projects Manager", icon: FolderGit2, count: projectsList.length },
                { id: "skills", label: "Tech Stack & Skills", icon: Cpu, count: skillsList.length },
                { id: "certificates", label: "Certificates Marquee", icon: Award, count: certsList.length },
                { id: "experience", label: "Career & Experience", icon: Briefcase, count: expsList.length },
                { id: "about", label: "About Eliyas Details", icon: Info, count: null },
                { id: "messages", label: "Inquiries Inbox", icon: Mail, count: messagesList.length }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? "bg-[#083785] text-white shadow-sm font-bold"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#ECC257]" : "text-slate-500"}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {tab.count !== null && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <label className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-mono text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#083785]" />
                <span>Import JSON</span>
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>

              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#083785] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live Site</span>
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50/50">
            {/* ============================================================ */}
            {/* TAB 1: OVERVIEW METRICS                                      */}
            {/* ============================================================ */}
            {activeTab === "overview" && (
              <div className="space-y-6 max-w-5xl">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#083785]">
                    Portfolio Control Center
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Live overview of everything displayed on Eliyas Wakjira's single-page web architecture.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div
                    onClick={() => setActiveTab("projects")}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#083785] cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-[10px] font-mono text-[#083785] uppercase font-bold">PROJECTS</span>
                    <div className="text-3xl font-display font-black text-slate-900 mt-1">{projectsList.length}</div>
                    <span className="text-xs text-slate-500">Live Showcases</span>
                  </div>

                  <div
                    onClick={() => setActiveTab("skills")}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#083785] cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-[10px] font-mono text-cyan-700 uppercase font-bold">TECH STACK</span>
                    <div className="text-3xl font-display font-black text-slate-900 mt-1">{skillsList.length}</div>
                    <span className="text-xs text-slate-500">Vertical Marquee Items</span>
                  </div>

                  <div
                    onClick={() => setActiveTab("certificates")}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#083785] cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-[10px] font-mono text-amber-700 uppercase font-bold">CREDENTIALS</span>
                    <div className="text-3xl font-display font-black text-slate-900 mt-1">{certsList.length}</div>
                    <span className="text-xs text-slate-500">Row Marquee Cards</span>
                  </div>

                  <div
                    onClick={() => setActiveTab("messages")}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#083785] cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">INBOX MESSAGES</span>
                    <div className="text-3xl font-display font-black text-slate-900 mt-1">{messagesList.length}</div>
                    <span className="text-xs text-slate-500">Client Inquiries</span>
                  </div>
                </div>

                {/* Quick Edit Links */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-display font-bold text-[#083785] uppercase tracking-wide font-mono">
                    Quick Edit Shortcuts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-colors cursor-pointer group"
                    >
                      <User className="w-5 h-5 text-[#083785] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-xs text-slate-900">Hero &amp; Profile</div>
                      <div className="text-[11px] text-slate-500">Edit name, bio, 4 stats &amp; hero photo</div>
                    </button>

                    <button
                      onClick={() => {
                        setEditingProject({
                          title: "",
                          slug: "",
                          layer: "Full-Stack",
                          category: "Web Platform",
                          overview: "",
                          outcome: "",
                          frontend_stack: "React 19, Tailwind CSS",
                          backend_stack: "Node.js, Express MVC, MySQL 8.0",
                          infra_stack: "Docker, AWS",
                          image_url: "/frontend/assets/images/tech_network_bg.jpg",
                          live_url: "https://",
                          repo_url: "https://github.com/",
                          is_featured: true
                        });
                        setActiveTab("projects");
                      }}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-colors cursor-pointer group"
                    >
                      <Plus className="w-5 h-5 text-[#083785] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-xs text-slate-900">Add New Project</div>
                      <div className="text-[11px] text-slate-500">Create new production showcase card</div>
                    </button>

                    <button
                      onClick={() => {
                        setEditingCert({
                          title: "",
                          issuer: "",
                          issue_date: "2024",
                          category: "Technology",
                          credential_id: "ID-" + Math.floor(Math.random() * 100000),
                          credential_url: "https://",
                          skills_acquired: ["Full-Stack", "Architecture"]
                        });
                        setActiveTab("certificates");
                      }}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-colors cursor-pointer group"
                    >
                      <Award className="w-5 h-5 text-[#083785] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-xs text-slate-900">Add Certificate</div>
                      <div className="text-[11px] text-slate-500">Insert credential into row marquee</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 2: HERO & PROFILE EDITOR                                 */}
            {/* ============================================================ */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-[#083785]">
                      Hero &amp; Profile Information
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Update the headline, introduction, and profile statistics.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#083785] hover:bg-[#062c6d] transition-all flex items-center gap-2 shadow-md cursor-pointer hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                        Full Name / Title
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#083785]"
                        required
                      />
                    </div>

                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                      Hero Bio Subtitle (Lead paragraph)
                    </label>
                    <textarea
                      rows={3}
                      value={profileData.hero_subtitle}
                      onChange={(e) => setProfileData({ ...profileData, hero_subtitle: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#083785]"
                    />
                  </div>

                  {/* 4 Stats Editor */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <span className="text-xs font-mono font-bold text-slate-700 uppercase block">
                      4 Hero Metric Counters
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {profileData.stats.map((stat, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <label className="text-[10px] font-mono font-bold text-slate-500 block">
                            Stat #{idx + 1}
                          </label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...profileData.stats];
                              newStats[idx].value = e.target.value;
                              setProfileData({ ...profileData, stats: newStats });
                            }}
                            placeholder="Value (e.g. 6+)"
                            className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                          />
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...profileData.stats];
                              newStats[idx].label = e.target.value;
                              setProfileData({ ...profileData, stats: newStats });
                            }}
                            placeholder="Label"
                            className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* ============================================================ */}
            {/* TAB 3: PROJECTS MANAGER                                      */}
            {/* ============================================================ */}
            {activeTab === "projects" && (
              <div className="space-y-6 max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-[#083785]">
                      Featured Projects Manager ({projectsList.length})
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Create, update, or remove projects displayed on the frontend grid.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setEditingProject({
                        title: "",
                        slug: "",
                        layer: "Frontend + Backend",
                        category: "Full-Stack Web App",
                        status: "Future Project / Pipeline",
                        overview: "",
                        outcome: "",
                        frontend_stack: "React 19, Tailwind CSS",
                        backend_stack: "Node.js, Express MVC, MySQL 8.0",
                        infra_stack: "Docker, AWS",
                        image_url: "/frontend/assets/images/project_apple.jpg",
                        screenshot_url: "",
                        preview_mode: "screenshot",
                        live_url: "",
                        repo_url: "https://github.com/",
                        is_featured: true
                      })
                    }
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#083785] hover:bg-[#062c6d] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                {/* Project Search Bar */}
                <div className="relative max-w-md">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects by title, category, stack..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#083785] bg-white"
                  />
                </div>

                {/* Projects List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {projectsList
                    .filter((p) => {
                      const q = projectSearch.toLowerCase();
                      return (
                        !q ||
                        p.title.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q) ||
                        p.layer.toLowerCase().includes(q)
                      );
                    })
                    .map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-[#083785] transition-all"
                      >
                        <div className="space-y-2">
                          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-100">
                            <ProjectPreviewImage
                              project={proj}
                              alt={proj.title}
                              className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute top-2 left-2 flex gap-1">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#ECC257] text-[#083785]">
                                {proj.layer}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-[#083785] uppercase font-bold block truncate">
                              {proj.category}
                            </span>
                            <h3 className="font-display font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                              {proj.title}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {proj.overview}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            {proj.live_url && (
                              <a
                                href={proj.live_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-slate-400 hover:text-[#083785]"
                                title="Open Live Demo"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingProject({ ...proj })}
                              className="px-2.5 py-1 text-xs font-semibold text-[#083785] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Project Edit / Add Drawer Modal */}
                {editingProject && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <form
                      onSubmit={handleSaveProject}
                      className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-display font-black text-lg text-[#083785]">
                          {editingProject.id ? `Edit Project: ${editingProject.title}` : "Add New Project"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Project Title *
                          </label>
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Layer / Stack Type
                          </label>
                          <select
                            value={editingProject.layer}
                            onChange={(e) => setEditingProject({ ...editingProject, layer: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Frontend + Backend">Frontend + Backend (Full-Stack)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Project Status
                        </label>
                        <select
                          value={editingProject.status || "Future Project / Pipeline"}
                          onChange={(event) => {
                            const status = event.target.value;
                            setEditingProject({
                              ...editingProject,
                              status,
                              preview_mode: isDeployedProject({ status }) ? "auto" : "screenshot"
                            });
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                        >
                          <option value="Live & Deployed">Live &amp; Deployed</option>
                          <option value="Future Project / Pipeline">Future Project / Pipeline</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Category / Domain
                        </label>
                        <input
                          type="text"
                          value={editingProject.category}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Overview (Brief explanation)
                        </label>
                        <textarea
                          rows={2}
                          value={editingProject.overview}
                          onChange={(e) => setEditingProject({ ...editingProject, overview: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Outcome / Key Results
                        </label>
                        <input
                          type="text"
                          value={editingProject.outcome}
                          onChange={(e) => setEditingProject({ ...editingProject, outcome: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Live Demo URL
                          </label>
                          <input
                            type="text"
                            value={editingProject.live_url || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            GitHub Repo URL
                          </label>
                          <input
                            type="text"
                            value={editingProject.repo_url || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, repo_url: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Project Screen Preview
                          </label>
                          <select
                            value={editingProject.preview_mode || (isDeployedProject(editingProject) ? "auto" : "screenshot")}
                            onChange={(event) => setEditingProject({
                              ...editingProject,
                              preview_mode: event.target.value
                            })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                          >
                            <option value="auto" disabled={!isDeployedProject(editingProject)}>
                              Automatically capture deployed website
                            </option>
                            <option value="screenshot">Upload a screenshot manually</option>
                          </select>
                          {editingProject.preview_mode !== "screenshot" && isDeployedProject(editingProject) ? (
                            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                              The public HTTPS URL is sent to thum.io to generate the website screenshot. Some sites block external captures; upload a screenshot instead if that happens.
                            </p>
                          ) : (
                            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                              Upload a screenshot for an unreleased project or when its live site blocks automatic capture.
                            </p>
                          )}
                        </div>

                        {editingProject.preview_mode === "screenshot" && (
                          <div className="flex flex-wrap items-center gap-3">
                            <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white ${uploadingScreenshot ? "bg-slate-400" : "bg-[#083785] hover:bg-[#062c6d]"}`}>
                              <Upload className="h-4 w-4" />
                              <span>{uploadingScreenshot ? "Uploading..." : "Choose screenshot"}</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleProjectScreenshotUpload}
                                disabled={uploadingScreenshot}
                                className="hidden"
                              />
                            </label>
                            {editingProject.screenshot_url && (
                              <span className="text-[11px] font-semibold text-emerald-700">Screenshot uploaded</span>
                            )}
                            <span className="text-[11px] text-slate-500">JPEG, PNG, or WebP · 5 MB max</span>
                          </div>
                        )}

                        {editingProject.image_url && (
                          <div className="max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <ProjectPreviewImage
                              project={editingProject}
                              alt="Selected project screen preview"
                              className="aspect-video w-full object-cover"
                            />
                          </div>
                        )}

                        <details className="text-xs">
                          <summary className="cursor-pointer font-semibold text-slate-600">Optional fallback cover image</summary>
                          <input
                            type="text"
                            value={editingProject.image_url || ""}
                            onChange={(event) => setEditingProject({ ...editingProject, image_url: event.target.value })}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                            placeholder="/frontend/assets/images/project-cover.jpg"
                          />
                        </details>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold text-white bg-[#083785] hover:bg-[#062c6d] rounded-xl flex items-center gap-1.5 shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Project</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 4: TECH STACK & SKILLS                                   */}
            {/* ============================================================ */}
            {activeTab === "skills" && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-[#083785]">
                      Tech Stack &amp; Skills ({skillsList.length})
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Edits the items flowing through the vertical column marquee (odd moving up, even moving down).
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setEditingSkill({
                        name: "",
                        category: "frontend",
                        categoryLabel: "Frontend Tech",
                        role: "Core architectural capability",
                        color: "#083785"
                      })
                    }
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#083785] hover:bg-[#062c6d] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Technology</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillsList.map((skill, idx) => (
                    <div
                      key={skill.id || idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-[#083785] transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                          <TechLogo tech={skill} className="w-7 h-7" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-xs sm:text-sm text-[#083785]">
                              {skill.name}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                              {skill.categoryLabel || skill.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{skill.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingSkill({ ...skill })}
                          className="p-1.5 text-slate-400 hover:text-[#083785] hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Skill Modal */}
                {editingSkill && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <form
                      onSubmit={handleSaveSkill}
                      className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-display font-black text-base text-[#083785]">
                          {editingSkill.id ? `Edit ${editingSkill.name}` : "Add Technology"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setEditingSkill(null)}
                          className="p-1 rounded-full text-slate-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Technology Name *
                        </label>
                        <input
                          type="text"
                          value={editingSkill.name}
                          onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          placeholder="e.g. Next.js 15, PostgreSQL"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Category
                          </label>
                          <select
                            value={editingSkill.category}
                            onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          >
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="database">Database</option>
                            <option value="devops">DevOps</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            value={editingSkill.categoryLabel}
                            onChange={(e) => setEditingSkill({ ...editingSkill, categoryLabel: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                            placeholder="e.g. Frontend UI"
                          />
                        </div>
                      </div>

                      {/* Real Logo Live Preview & Custom URL */}
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Real Logo &amp; SVG Path
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center p-2 shrink-0">
                            <TechLogo tech={editingSkill} className="w-8 h-8" />
                          </div>
                          <input
                            type="text"
                            value={editingSkill.logo_url || ""}
                            onChange={(e) => setEditingSkill({ ...editingSkill, logo_url: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-700"
                            placeholder="e.g. /assets/tech-logos/mysql.svg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Description / Architecture Role
                        </label>
                        <input
                          type="text"
                          value={editingSkill.role}
                          onChange={(e) => setEditingSkill({ ...editingSkill, role: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          placeholder="e.g. Server Components & App Router"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingSkill(null)}
                          className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-[#083785] hover:bg-[#062c6d] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Technology</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 5: CERTIFICATES & ACCREDITATION                          */}
            {/* ============================================================ */}
            {activeTab === "certificates" && (
              <div className="space-y-6 max-w-6xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-[#083785]">
                      Certificates &amp; Accreditation ({certsList.length})
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Edits the credentials appearing in the horizontal row marquee and grid viewer.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setEditingCert({
                        title: "",
                        issuer: "",
                        issue_date: "2024",
                        category: "Technology",
                        credential_id: "ID-" + Math.floor(Math.random() * 100000),
                        credential_url: "https://",
                        skills_acquired: ["Full-Stack", "Architecture"]
                      })
                    }
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#083785] hover:bg-[#062c6d] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Certificate</span>
                  </button>
                </div>

                {/* Category Filter Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Technology", "Education", "Humanitarian", "Others"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCertFilterCat(cat)}
                      className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        certFilterCat === cat
                          ? "bg-[#083785] text-white border-[#083785]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certsList
                    .filter((c) => certFilterCat === "All" || c.category === certFilterCat)
                    .map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 group hover:border-[#083785] transition-all"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold">
                              {cert.category}
                            </span>
                            <span className="text-slate-400 font-semibold">{cert.issue_date}</span>
                          </div>

                          <h4 className="font-display font-bold text-sm text-[#083785] leading-snug line-clamp-2">
                            {cert.title}
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-1">Issued by: {cert.issuer}</p>

                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            ID: {cert.credential_id}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <a
                            href={apiUrl(cert.file_url || cert.credential_url || "")}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-[#083785] hover:underline flex items-center gap-1"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingCert({ ...cert })}
                              className="px-2.5 py-1 text-xs font-semibold text-[#083785] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCert(cert.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Edit Certificate Modal */}
                {editingCert && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <form
                      onSubmit={handleSaveCert}
                      className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-display font-black text-base text-[#083785]">
                          {editingCert.id ? `Edit: ${editingCert.title}` : "Add Certificate"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setEditingCert(null)}
                          className="p-1 rounded-full text-slate-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Certificate Title *
                        </label>
                        <input
                          type="text"
                          value={editingCert.title}
                          onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Issuer
                          </label>
                          <input
                            type="text"
                            value={editingCert.issuer}
                            onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Issue Date / Year
                          </label>
                          <input
                            type="text"
                            value={editingCert.issue_date}
                            onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Category
                          </label>
                          <select
                            value={editingCert.category}
                            onChange={(e) => setEditingCert({ ...editingCert, category: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          >
                            <option value="Technology">Technology</option>
                            <option value="Education">Education</option>
                            <option value="Humanitarian">Humanitarian</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Credential ID
                          </label>
                          <input
                            type="text"
                            value={editingCert.credential_id}
                            onChange={(e) => setEditingCert({ ...editingCert, credential_id: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Credential URL (Link to open in new tab)
                        </label>
                        <input
                          type="text"
                          value={editingCert.credential_url || ""}
                          onChange={(e) => setEditingCert({ ...editingCert, credential_url: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Certificate image or PDF (10 MB max)
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          onChange={handleCertificateFileUpload}
                          disabled={uploadingCertificate}
                          className="w-full text-xs file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-blue-50 file:text-[#083785] file:font-semibold"
                        />
                        {uploadingCertificate && (
                          <p className="mt-1 text-[11px] text-slate-500">Uploading certificate file...</p>
                        )}
                        {editingCert.file_url && (
                          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-emerald-700">
                            <a
                              href={apiUrl(editingCert.file_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold hover:underline truncate"
                            >
                              Uploaded file · Open in new tab
                            </a>
                            <button
                              type="button"
                              onClick={() => setEditingCert({
                                ...editingCert,
                                file_url: "",
                                file_mime_type: ""
                              })}
                              className="shrink-0 text-rose-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Skills Acquired (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={
                            Array.isArray(editingCert.skills_acquired)
                              ? editingCert.skills_acquired.join(", ")
                              : editingCert.skills_acquired || ""
                          }
                          onChange={(e) =>
                            setEditingCert({
                              ...editingCert,
                              skills_acquired: e.target.value.split(",").map((s) => s.trim())
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingCert(null)}
                          className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-[#083785] hover:bg-[#062c6d] rounded-xl flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Certificate</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 6: CAREER & WORK EXPERIENCE                              */}
            {/* ============================================================ */}
            {activeTab === "experience" && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-[#083785]">
                      Career Trajectory &amp; Experience ({expsList.length})
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Edits pedagogical and enterprise software architecture roles.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setEditingExp({
                        role: "",
                        organization: "",
                        period: "2024 - Present",
                        type: "Full-Time / Contract",
                        description: "",
                        achievements: ["Deliverable 1", "Deliverable 2"]
                      })
                    }
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#083785] hover:bg-[#062c6d] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {expsList.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4 group hover:border-[#083785] transition-all"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold">
                            {exp.period}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">{exp.type}</span>
                        </div>
                        <h4 className="font-display font-bold text-base text-[#083785]">{exp.role}</h4>
                        <div className="text-xs font-semibold text-slate-700">{exp.organization}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-start">
                        <button
                          onClick={() => setEditingExp({ ...exp })}
                          className="px-3 py-1.5 text-xs font-semibold text-[#083785] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteExp(exp.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Experience Modal */}
                {editingExp && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <form
                      onSubmit={handleSaveExp}
                      className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-display font-black text-base text-[#083785]">
                          {editingExp.id ? `Edit: ${editingExp.role}` : "Add Experience"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setEditingExp(null)}
                          className="p-1 rounded-full text-slate-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Role Title *
                        </label>
                        <input
                          type="text"
                          value={editingExp.role}
                          onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Organization
                          </label>
                          <input
                            type="text"
                            value={editingExp.organization}
                            onChange={(e) => setEditingExp({ ...editingExp, organization: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                            Period
                          </label>
                          <input
                            type="text"
                            value={editingExp.period}
                            onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={editingExp.description}
                          onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                          Key Deliverables (One per line)
                        </label>
                        <textarea
                          rows={3}
                          value={
                            Array.isArray(editingExp.achievements)
                              ? editingExp.achievements.join("\n")
                              : editingExp.achievements || ""
                          }
                          onChange={(e) =>
                            setEditingExp({
                              ...editingExp,
                              achievements: e.target.value.split("\n").filter(Boolean)
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingExp(null)}
                          className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-[#083785] hover:bg-[#062c6d] rounded-xl flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 7: ABOUT ELIYAS & PEDAGOGY                               */}
            {/* ============================================================ */}
            {activeTab === "about" && (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-[#083785]">
                      About &amp; Principles Content
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Edits the biography card, collegiate pedagogical principles, and academic qualifications.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#083785] hover:bg-[#062c6d] transition-all flex items-center gap-2 shadow-md cursor-pointer hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                        Location String
                      </label>
                      <input
                        type="text"
                        value={profileData.about.location}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            about: { ...profileData.about, location: e.target.value }
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                        Degree &amp; Major
                      </label>
                      <input
                        type="text"
                        value={profileData.about.degree}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            about: { ...profileData.about, degree: e.target.value }
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                      Section Headline
                    </label>
                    <input
                      type="text"
                      value={profileData.about.headline}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          about: { ...profileData.about, headline: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                      Biography Paragraph 1 (Frontend craft &amp; backend depth)
                    </label>
                    <textarea
                      rows={3}
                      value={profileData.about.p1}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          about: { ...profileData.about, p1: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                      Biography Paragraph 2 (Pedagogy &amp; systems architecture)
                    </label>
                    <textarea
                      rows={3}
                      value={profileData.about.p2}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          about: { ...profileData.about, p2: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                      Teaching Pedagogy Framework
                    </label>
                    <textarea
                      rows={2}
                      value={profileData.about.pedagogy}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          about: { ...profileData.about, pedagogy: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>
              </form>
            )}

            {/* ============================================================ */}
            {/* TAB 8: MESSAGES & CONTACT INBOX                              */}
            {/* ============================================================ */}
            {activeTab === "messages" && (
              <div className="space-y-6 max-w-5xl">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#083785]">
                    Client Inquiries &amp; Messages ({messagesList.length})
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Submissions received through the frontend "Get in Touch" contact form.
                  </p>
                </div>

                {messagesList.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-mono">
                    No messages in inbox currently.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messagesList.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#083785]">{msg.name}</span>
                            <span className="text-[11px] font-mono text-slate-500">&lt;{msg.email}&gt;</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400">{msg.created_at?.slice(0, 10)}</span>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{msg.subject}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export { AdminStudioModalView };
