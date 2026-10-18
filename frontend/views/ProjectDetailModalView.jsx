/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend View: ProjectDetailModalView (V in MVC)
 */
import { useEffect } from "react";
import { X, ExternalLink, Github, CheckCircle2, Server, Layout, Cloud } from "lucide-react";
import { ProjectPreviewImage } from "../components/ProjectPreviewImage";
import { isDeployedProject } from "../models/projectPreview";
const ProjectDetailModalView = ({
  project,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);
  if (!project) return null;
  return <div className="fixed top-16 sm:top-[70px] inset-x-0 bottom-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-7rem)] flex flex-col">
        {
    /* Modal Header */
  }
        <div className="relative aspect-video max-h-[340px] w-full overflow-hidden bg-slate-900 shrink-0">
          <ProjectPreviewImage
            project={project}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {
    /* Close button */
  }
          <button
    onClick={onClose}
    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
    aria-label="Close modal"
  >
            <X className="w-5 h-5" />
          </button>

          {
    /* Hero text overlay */
  }
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ECC257] text-[#083785]">
                {project.layer}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-white/90 bg-white/20 backdrop-blur-sm">
                {project.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-display font-black text-white leading-tight">
              {project.title}
            </h2>
          </div>
        </div>

        {
    /* Modal Scrollable Body */
  }
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {
    /* Metadata quick stats */
  }
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">CLIENT / SCOPE</span>
              <span className="font-semibold text-slate-800">{project.client_name || "Production Product"}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">ROLE</span>
              <span className="font-semibold text-slate-800">{project.role_title || "Lead Full-Stack Developer"}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">STATUS</span>
              <span className="text-emerald-700 font-bold font-mono">{project.status}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">DEPLOYMENT</span>
              <span className="font-semibold text-slate-800 font-mono">
                {isDeployedProject(project) ? "Live Website" : "Project Screenshot"}
              </span>
            </div>
          </div>

          {
    /* Executive Overview */
  }
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono">
              SYSTEM OVERVIEW &amp; PROBLEM STATEMENT
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
              {project.overview}
            </p>
          </div>

          {
    /* Business & Technical Outcome */
  }
          {project.outcome && <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 uppercase font-mono tracking-wider">
                    VERIFIED DELIVERABLE &amp; SYSTEM OUTCOME
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    {project.outcome}
                  </p>
                </div>
              </div>
            </div>}

          {
    /* Tech Stack Breakdown Strip */
  }
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              ARCHITECTURAL COMPONENT STACK
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {project.frontend_stack && <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#083785] font-bold">
                    <Layout className="w-3.5 h-3.5" />
                    <span>Frontend Interface</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">{project.frontend_stack}</p>
                </div>}
              {project.backend_stack && <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#083785] font-bold">
                    <Server className="w-3.5 h-3.5" />
                    <span>Backend &amp; DB Services</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">{project.backend_stack}</p>
                </div>}
              {project.infra_stack && <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#083785] font-bold">
                    <Cloud className="w-3.5 h-3.5" />
                    <span>DevOps &amp; Infrastructure</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">{project.infra_stack}</p>
                </div>}
            </div>
          </div>

          {
    /* Action Footer */
  }
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {project.live_url && <a
    href={project.live_url}
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2.5 text-xs font-bold text-white bg-[#083785] hover:bg-[#062c6d] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
  >
                  <span>Launch Live Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>}
              {project.repo_url && <a
    href={project.repo_url}
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#083785] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
  >
                  <Github className="w-3.5 h-3.5" />
                  <span>Inspect Codebase</span>
                </a>}
            </div>

            <button
    onClick={onClose}
    className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors cursor-pointer"
  >
              Close Case Study
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export {
  ProjectDetailModalView
};
