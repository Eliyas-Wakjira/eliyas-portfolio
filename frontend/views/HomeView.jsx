/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend View: HomeView (V in MVC)
 * Main single-page portfolio layout uniting the 6 core navbar sections:
 * 1. Projects, 2. Skills, 3. Experience, 4. Certificates (4 Categories), 5. About, 6. Contact
 */
import { useState, useEffect } from "react";
import { PortfolioController } from "../controllers/portfolioController";
import { MessageController } from "../controllers/messageController";
import { TechnologyExpertiseView } from "./TechnologyExpertiseView";
import { CertificatesMarqueeView } from "./CertificatesMarqueeView";
import { HeroProjectBannerSlider } from "../components/HeroProjectBannerSlider";
import { ProjectPreviewImage } from "../components/ProjectPreviewImage";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  FileDown,
  CheckCircle2,
  Building2,
  Layout,
  Server,
  Database,
  Cloud,
  Mail,
  Phone,
  MapPin,
  Globe,
  Send,
  AlertCircle,
  Cpu,
  UserCheck
} from "lucide-react";
const HomeView = ({
  profile: loadedProfile,
  onSelectTab,
  onOpenProject,
  onOpenCV
}) => {
  const profile = loadedProfile || {};
  const [projects, setProjects] = useState(() => PortfolioController.getProjects());
  const [certificates, setCertificates] = useState(() => PortfolioController.getCertificates());
  const [experiences, setExperiences] = useState(() => PortfolioController.getExperiences());
  const [dataError, setDataError] = useState("");
  const [unavailableResources, setUnavailableResources] = useState(() => new Set());
  const [projectFilter, setProjectFilter] = useState("All");
  const handleTabSwitch = (tabId) => {
    if (onSelectTab) onSelectTab(tabId);
  };
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [contactStatus, setContactStatus] = useState(null);
  const [sendingContact, setSendingContact] = useState(false);

  const loadData = () => {
    Promise.all([
      PortfolioController.fetchProjects(projectFilter),
      PortfolioController.fetchCertificates("All"),
      PortfolioController.fetchExperiences()
    ])
      .then(([nextProjects, nextCertificates, nextExperiences]) => {
        setProjects(nextProjects);
        setCertificates(nextCertificates);
        setExperiences(nextExperiences);
        setDataError("");
      })
      .catch((error) => {
        console.error("Failed to load portfolio content from the database:", error);
        setDataError(error.message);
      });
  };

  useEffect(() => {
    const handleApiStatus = (event) => {
      setUnavailableResources((current) => {
        const next = new Set(current);
        if (event.detail.available) next.delete(event.detail.resource);
        else next.add(event.detail.resource);
        return next;
      });
    };
    window.addEventListener("portfolio_api_status", handleApiStatus);
    loadData();
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener("portfolio_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("portfolio_api_status", handleApiStatus);
      window.removeEventListener("portfolio_data_updated", handleUpdate);
    };
  }, [projectFilter]);
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSendingContact(true);
    setContactStatus(null);
    try {
      const res = await MessageController.sendMessage(contactForm);
      if (res.success) {
        setContactStatus({ type: "success", message: res.message });
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setContactStatus({ type: "error", message: res.message });
      }
    } finally {
      setSendingContact(false);
    }
  };
  if (!loadedProfile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-600" role="status">
        Loading portfolio content from the database...
      </div>
    );
  }
  return <div className="w-full space-y-12 lg:space-y-16 pb-12">
      {dataError && (
        <p className="mx-auto max-w-7xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          Unable to load portfolio content from the database: {dataError}
        </p>
      )}
      {unavailableResources.size > 0 && (
        <p className="mx-auto max-w-7xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          Showing saved/default portfolio information while the database service is unavailable. Contact messages and admin changes need the backend.
        </p>
      )}
      {
    /* ============================================================ */
  }
      {
    /* HERO SECTION                                                 */
  }
      {
    /* ============================================================ */
  }
      <section
    id="home"
    className="relative min-h-[600px] lg:min-h-[680px] bg-[#083785] text-white overflow-hidden border-b border-white/15 shadow-2xl"
  >
        <HeroProjectBannerSlider variant="background" allProjects={projects} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 min-h-[600px] lg:min-h-[680px] flex items-center">
          <div className="w-full">
            <div className="max-w-3xl space-y-5 sm:space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-display font-black text-white tracking-[-0.03em] leading-[1.08] text-balance drop-shadow-md">
                {profile.hero_title || profile.name}
              </h1>

              <p className="text-sm sm:text-base lg:text-base text-slate-100 font-normal leading-relaxed drop-shadow">
                {profile.hero_subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 pt-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => handleTabSwitch("projects")}
                    className="px-5 py-2.5 text-xs sm:text-sm font-bold text-[#083785] bg-white hover:bg-blue-50 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer font-display hover:scale-105"
                  >
                    <span>Explore Projects</span>
                    <ArrowRight className="w-4 h-4 text-[#083785]" />
                  </button>

                  <button
                    onClick={onOpenCV}
                    className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#C33E1F] hover:bg-[#a83219] rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-[#083785]" />
                    <span>Download CV</span>
                  </button>
                </div>

                <div className="ml-auto flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    onClick={() => handleTabSwitch("skills")}
                    className="min-w-[200px] min-h-[60px] justify-center px-6 py-3 text-sm sm:text-base font-semibold text-white bg-black/40 border border-white/30 hover:bg-black/60 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
                  >
                    <Cpu className="w-4 h-4 text-cyan-300" />
                    <span>What I Build</span>
                  </button>

                  <button
                    onClick={() => handleTabSwitch("contact")}
                    className="min-w-[200px] min-h-[60px] justify-center px-6 py-3 text-sm sm:text-base font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
                  >
                    <span>Hire Me</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/20 text-xs font-mono">
                {profile.stats?.map((stat, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
                    <div className={`text-lg sm:text-xl font-display font-extrabold ${stat.color || "text-[#ECC257]"}`}>{stat.value}</div>
                    <div className="text-blue-100 text-[10px] sm:text-[11px] mt-0.5 truncate">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20 pt-10 sm:pt-12">
          <section id="projects" className="scroll-mt-24 space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-[#083785] tracking-tight">
                Selected Projects
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Production-grade applications built across the full stack: Next.js 15 App Router interfaces, React 19 single-page apps, Express MVC microservices, and normalized MySQL relational databases.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-auto">
              {[
                { id: "All", label: "All Work" },
                { id: "Live", label: "Live & Deployed" },
                { id: "Future", label: "Future / Pipeline" },
                { id: "Full-Stack", label: "Full-Stack" },
                { id: "Frontend", label: "Frontend" }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setProjectFilter(filter.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    projectFilter === filter.id
                      ? "bg-[#083785] text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project) => {
              const isLive = project.status?.toLowerCase().includes("live") || project.status?.toLowerCase().includes("published");
              let displayHost = "";
              try {
                if (project.live_url) {
                  const urlObj = new URL(project.live_url.startsWith("http") ? project.live_url : `https://${project.live_url}`);
                  displayHost = urlObj.hostname.replace(/^www\./, "");
                }
              } catch {}

              return (
                <div
                  key={project.id}
                  onClick={() => onOpenProject(project)}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-[#083785] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
                >
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <ProjectPreviewImage
                        project={project}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#083785] text-white shadow-xs">
                          {project.layer}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        {isLive ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-white shadow-md flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>Live App</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#ECC257] text-[#083785] shadow-md flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#083785]" />
                            <span>Future / Pipeline</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-display font-black text-lg text-slate-900 group-hover:text-[#083785] transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {project.overview}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                    <span className="text-xs font-mono font-semibold text-[#083785] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Project details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <div className="flex items-center gap-2">
                      {project.live_url && (
                        <a
                          href={project.live_url.startsWith("http") ? project.live_url : `https://${project.live_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1.5 text-xs font-mono font-bold text-[#083785] bg-blue-50 hover:bg-[#083785] hover:text-white rounded-xl transition-all flex items-center gap-1 shadow-2xs border border-blue-200/80 cursor-pointer"
                          title={`Launch ${displayHost || "project"}`}
                        >
                          <span>{isLive ? "Live Demo" : "Visit"}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Source on GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

          <section id="skills" className="scroll-mt-24 animate-in fade-in duration-300">
            <TechnologyExpertiseView />
          </section>

        {
    /* ============================================================ */
  }
        {
    /* 3. EXPERIENCE SECTION (Navbar Item 3: Experience)            */
  }
        {
    /* ============================================================ */
  }
          <section id="experience" className="scroll-mt-24 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-[#083785] tracking-tight">
                Professional Experience
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Dual background spanning high-load enterprise software architecture and collegiate computer science lecturing.
              </p>
            </div>

            <button
    onClick={onOpenCV}
    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#C33E1F] hover:bg-[#a83219] rounded-xl shadow-xs transition-all cursor-pointer self-start md:self-auto"
  >
              <FileDown className="w-4 h-4" />
              <span>Download Full CV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {experiences.map((exp) => <div
    key={exp.id}
    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-[#083785] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
  >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#083785] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                      {exp.period}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                      {exp.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-black text-lg text-[#083785] leading-snug">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-[#083785] shrink-0" />
                      <span>{exp.organization}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      Key Deliverables:
                    </div>
                    {exp.achievements.map((item, idx) => <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>)}
                  </div>
                </div>
              </div>)}
          </div>
        </section>

          <section id="certificates" className="scroll-mt-24 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-[#083785] tracking-tight">
                Certifications
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Verified qualifications across Technology, Education, Humanitarian, and Industry disciplines.
              </p>
            </div>

          </div>

          <CertificatesMarqueeView
    certificates={certificates}
  />
        </section>

        {
    /* ============================================================ */
  }
        {
    /* 5. ABOUT SECTION (Navbar Item 5: About)                      */
  }
        {
    /* ============================================================ */
  }
          <section id="about" className="scroll-mt-24 space-y-6 animate-in fade-in duration-300">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#083785] tracking-tight">
              Professional Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Full-stack software architect, relational database specialist, and collegiate computer engineering educator based in Addis Ababa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#083785]">
                  <MapPin className="w-4 h-4 text-[#ECC257]" />
                  <span>{profile.about?.location || "Addis Ababa, Ethiopia (UTC+3)"}</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-[#083785] leading-tight">
                  {profile.about?.headline || "Bridging frontend craft with backend database depth."}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {profile.about?.p1}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {profile.about?.p2}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-mono">
                <div className="text-slate-500 uppercase font-bold text-[10px]">
                  Academic Background:
                </div>
                <div className="text-slate-800 font-semibold font-sans">
                  {profile.about?.degree}
                </div>
                <div className="text-slate-600">
                  {profile.about?.university || profile.about?.pedagogy}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
    onClick={onOpenCV}
    className="px-4 py-2 text-xs font-bold text-[#083785] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer border border-blue-200"
  >
                  Download Full CV
                </button>
                <button
    onClick={() => onSelectTab("contact")}
    className="px-4 py-2 text-xs font-bold text-white bg-[#083785] hover:bg-[#062c6d] rounded-xl transition-colors cursor-pointer"
  >
                  Contact Eliyas
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#083785] hover:shadow-lg transition-all duration-300 space-y-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#083785] flex items-center justify-center font-bold">
                  <Server className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-[#083785]">
                  01. Clean MVC Separation
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Business logic lives cleanly in controllers, SQL queries in dedicated models, and view rendering strictly on the client. Zero spaghetti server routes.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#083785] hover:shadow-lg transition-all duration-300 space-y-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#083785] flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-[#083785]">
                  02. Relational Integrity
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Leveraging MySQL foreign key constraints, connection pooling, prepared statements, and ACID transactions rather than unconstrained key-value stores.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#083785] hover:shadow-lg transition-all duration-300 space-y-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#083785] flex items-center justify-center font-bold">
                  <Layout className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-[#083785]">
                  03. Design Token Polish
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enforcing strict typography scales, WCAG AA contrast, fluid mobile viewports, and zero-pill metadata aesthetics for distinctive, human craftsmanship.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#083785] hover:shadow-lg transition-all duration-300 space-y-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#083785] flex items-center justify-center font-bold">
                  <Cloud className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-[#083785]">
                  04. DevOps &amp; Reliability
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multi-stage Dockerfiles, automated GitHub Actions CI/CD pipelines, SSL termination, and high-availability Linux server configurations.
                </p>
              </div>
            </div>
          </div>
        </section>

          <section id="contact" className="scroll-mt-24 space-y-6 animate-in fade-in duration-300">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#083785] tracking-tight">
              Get in Touch
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Available for full-time engineering roles, contract projects, database architecture consulting, and collegiate technical training workshops.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 bg-[#083785] text-white p-6 sm:p-10 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest uppercase text-blue-200 font-bold block">
                  DIRECT CONTACT CHANNELS
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-tight">
                  Let's engineer your next digital solution.
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  Whether you have an upcoming web application, need database query optimization, or seek a guest instructor for your engineering team, reach out anytime.
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/20 text-xs sm:text-sm font-mono text-blue-100">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#ECC257] shrink-0" />
                  <span>{profile.contact?.location || "Addis Ababa, Ethiopia (UTC+3)"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#ECC257] shrink-0" />
                  <a href={`mailto:${profile.contact?.email || "info@eliyastech.com"}`} className="hover:text-white hover:underline text-blue-100">
                    {profile.contact?.email || "info@eliyastech.com"}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#ECC257] shrink-0" />
                  <a href={`tel:${(profile.contact?.phone || "+251 919 501 238").replace(/\s+/g, "")}`} className="hover:text-white hover:underline text-blue-100">
                    {profile.contact?.phone || "+251 919 501 238"}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#ECC257] shrink-0" />
                  <a href="https://eliyastech.com" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline text-blue-100">
                    eliyastech.com
                  </a>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
    href="https://github.com/Eliyas-wakjira"
    target="_blank"
    rel="noopener noreferrer"
    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white hover:text-[#083785] text-white text-xs font-mono font-semibold transition-colors flex items-center gap-2"
  >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
    href="https://www.linkedin.com/in/eliyas-wakjira-b13650137"
    target="_blank"
    rel="noopener noreferrer"
    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white hover:text-[#083785] text-white text-xs font-mono font-semibold transition-colors flex items-center gap-2"
  >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-6 sm:p-10 space-y-6">
              {contactStatus && <div
    className={`p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed ${contactStatus.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"}`}
  >
                  {contactStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{contactStatus.message}</span>
                </div>}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-800 mb-1">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
    id="contact-name"
    type="text"
    required
    value={contactForm.name}
    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
    placeholder="e.g. Dawit Bekele"
    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#083785] bg-slate-50/50"
  />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-800 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
    id="contact-email"
    type="email"
    required
    value={contactForm.email}
    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
    placeholder="dawit@company.et"
    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#083785] bg-slate-50/50"
  />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-800 mb-1">
                    Project Focus / Inquiry Type
                  </label>
                  <input
    id="contact-subject"
    type="text"
    value={contactForm.subject}
    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
    placeholder="e.g. Next.js Web App, Express MVC Backend, or MySQL Consulting"
    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#083785] bg-slate-50/50"
  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-800 mb-1">
                    Project Details &amp; Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
    id="contact-message"
    required
    rows={5}
    value={contactForm.message}
    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
    placeholder="Tell me about your project, timeline, and technical requirements..."
    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#083785] bg-slate-50/50 resize-y"
  />
                </div>

                <div className="pt-2">
                  <button
    type="submit"
    disabled={sendingContact}
    className="w-full py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#083785] hover:bg-[#062c6d] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
  >
                    <Send className="w-4 h-4" />
                    <span>{sendingContact ? "Submitting message..." : "SEND"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>;
};
export {
  HomeView
};
