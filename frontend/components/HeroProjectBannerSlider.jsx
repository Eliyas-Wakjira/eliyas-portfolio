/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Component: HeroProjectBannerSlider
 * Interactive auto-sliding banner carousel featuring the live deployed
 * project homepage interfaces (Evangadi AI Forum, ChatGPT Clone, Netflix Clone, Apple Clone).
 * Includes authentic browser frame mockup, live domain display, pause on hover,
 * direct launch links, and official tech stack logos.
 */
import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Play,
  Pause,
  Sparkles,
  ArrowUpRight,
  Layers,
  CheckCircle2
} from "lucide-react";
import { TechLogo } from "./TechLogo";
import { ProjectPreviewImage } from "./ProjectPreviewImage";
import { getProjectPreview, isDeployedProject, isPublicHttpsUrl } from "../models/projectPreview";

export const DEPLOYED_BANNER_PROJECTS = [
  {
    id: 1,
    title: "AI-Powered Evangadi Forum & Q&A Platform",
    shortTitle: "Evangadi AI Forum",
    tagline: "Full-stack developer community platform powered by conversational AI assistance",
    category: "AI & Community / Q&A",
    status: "Live & Deployed",
    live_url: "https://evangadi-form.vercel.app/",
    display_host: "evangadi-form.vercel.app",
    platform: "Vercel Edge",
    platform_color: "bg-black text-white",
    image_url: "/frontend/assets/images/evangadi_ai_forum.jpg",
    stack: ["react", "nodejs", "express", "mysql", "javascript", "tailwindcss"],
    stack_labels: ["React 19", "Node.js", "Express MVC", "MySQL 8.0", "AI API"],
    metrics: "Sub-40ms thread queries · AI answer resolution · Relational ACID",
    accent: "#38BDF8"
  },
  {
    id: 2,
    title: "ChatGPT Conversational AI Platform Clone",
    shortTitle: "ChatGPT Clone",
    tagline: "Modern conversational AI interface with SSE streaming tokens and code syntax highlighter",
    category: "Generative AI Platform",
    status: "Live & Deployed",
    live_url: "https://chatgpclon.netlify.app/",
    display_host: "chatgpclon.netlify.app",
    platform: "Netlify Edge",
    platform_color: "bg-teal-900 text-teal-100",
    image_url: "/frontend/assets/images/project_chatgpt.jpg",
    stack: ["react", "javascript", "tailwindcss", "nodejs", "express"],
    stack_labels: ["React 19", "SSE Streaming", "Tailwind CSS", "Syntax Highlighter"],
    metrics: "Sub-180ms first token latency · Multi-session threads · Dark theme",
    accent: "#10A37F"
  },
  {
    id: 3,
    title: "Netflix Streaming Experience Clone - TMDB API",
    shortTitle: "Netflix Clone",
    tagline: "Cinematic movie and series discovery consuming live TMDB REST APIs with trailer playback",
    category: "Media & Streaming",
    status: "Live & Deployed",
    live_url: "https://eliyas-netflex-clone.netlify.app/",
    display_host: "eliyas-netflex-clone.netlify.app",
    platform: "Netlify Edge",
    platform_color: "bg-rose-950 text-rose-100",
    image_url: "/frontend/assets/images/project_netflix.jpg",
    stack: ["react", "javascript", "tailwindcss", "nodejs"],
    stack_labels: ["React 19", "TMDB API", "Axios", "YouTube Trailer API"],
    metrics: "60fps carousel scrolling · Dynamic video trailer popups · REST Caching",
    accent: "#E50914"
  },
  {
    id: 8,
    title: "Apple.com Official Web Experience Clone",
    shortTitle: "Apple Clone",
    tagline: "Pixel-accurate responsive frontend recreation of Apple's global desktop and mobile navigation",
    category: "Web Experience",
    status: "Live & Deployed",
    live_url: "https://apple-clone-eliyas.netlify.app",
    display_host: "apple-clone-eliyas.netlify.app",
    platform: "Netlify Edge",
    platform_color: "bg-slate-900 text-slate-100",
    image_url: "/frontend/assets/images/project_apple.jpg",
    stack: ["react", "javascript", "tailwindcss"],
    stack_labels: ["React 19", "JavaScript", "Tailwind CSS", "60fps CSS Animation"],
    metrics: "Sub-1.2s page load · 60fps micro-interactions · Keyboard accessible",
    accent: "#0071E3"
  }
];

export const HeroProjectBannerSlider = ({ onOpenProject, allProjects = [], variant = "card" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const liveProjects = allProjects.filter(
    (project) => isDeployedProject(project) && isPublicHttpsUrl(project.live_url)
  );
  const sourceProjects = liveProjects.length > 0 ? liveProjects : DEPLOYED_BANNER_PROJECTS;
  const activeItems = sourceProjects.map((project) => {
    const fallback = DEPLOYED_BANNER_PROJECTS.find((item) => item.id === project.id) || {};
    const merged = { ...fallback, ...project };
    let displayHost = fallback.display_host || "";
    try {
      displayHost = new URL(merged.live_url).hostname.replace(/^www\./, "");
    } catch {}
    return {
      ...merged,
      shortTitle: merged.shortTitle || merged.title,
      tagline: merged.overview || merged.tagline || "",
      display_host: displayHost,
      image_url: merged.image_url || "",
      stack: Array.isArray(merged.stack) ? merged.stack : fallback.stack || [],
      category: merged.category || fallback.category || "Featured Project",
      platform: fallback.platform || displayHost
    };
  });

  const total = activeItems.length;
  const current = activeItems[currentIndex] || activeItems[0];

  useEffect(() => {
    if (currentIndex >= total) {
      setCurrentIndex(0);
      setPrevIndex(0);
    }
  }, [currentIndex, total]);

  const changeSlide = (newIndex) => {
    if (newIndex === currentIndex) return;
    setPrevIndex(currentIndex);
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    changeSlide((currentIndex + 1) % total);
  };

  const handlePrev = () => {
    changeSlide((currentIndex - 1 + total) % total);
  };

  useEffect(() => {
    if (isPaused || isHovered) return;
    timerRef.current = setInterval(() => {
      setPrevIndex((prev) => prev);
      setCurrentIndex((prev) => {
        setPrevIndex(prev);
        return (prev + 1) % total;
      });
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, isHovered, total]);

  if (variant === "background") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#083785]" aria-hidden="true">
        {activeItems.map((item, index) => (
          <ProjectPreviewImage
            key={item.id}
            project={item}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover object-[68%_center] brightness-110 saturate-110 transition-all duration-1000 ease-in-out ${
              index === currentIndex
                ? "scale-100 opacity-100"
                : "scale-105 opacity-0"
            }`}
            referrerPolicy="no-referrer"
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#083785_0%,rgba(8,55,133,0.94)_32%,rgba(8,55,133,0.72)_52%,rgba(8,55,133,0.12)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,55,133,0.62)_0%,transparent_45%,rgba(8,55,133,0.18)_100%)]" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Glow Halo */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/30 via-[#ECC257]/20 to-cyan-500/30 rounded-[28px] blur-xl opacity-75 pointer-events-none" />

      {/* Main Glass Device Mockup Window */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950/95 border border-white/20 shadow-2xl backdrop-blur-xl flex flex-col">
        {/* ========================================================== */}
        {/* BROWSER TITLE BAR / WINDOW HEADER                         */}
        {/* ========================================================== */}
        <div className="bg-slate-900/95 border-b border-white/10 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
          {/* macOS Traffic Light Window Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] inline-block shadow-xs" />
          </div>

          {/* Browser Address Bar with Live Deployed URL */}
          <div className="flex-1 max-w-md mx-auto">
            <a
              href={current.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-black/50 hover:bg-black/70 border border-white/10 text-slate-300 hover:text-white transition-all text-[11px] font-mono group truncate"
              title={`Open ${current.live_url} in new tab`}
            >
              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-slate-400">https://</span>
              <span className="font-semibold text-white truncate">{current.display_host}</span>
              <ArrowUpRight className="w-3 h-3 text-[#ECC257] shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Live Indicator & Play/Pause */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">LIVE APP</span>
            </span>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isPaused ? "Resume auto-slide" : "Pause auto-slide"}
            >
              {isPaused ? <Play className="w-3 h-3 text-[#ECC257]" /> : <Pause className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* INTERFACE SCREENSHOT CAROUSEL VIEWPORT                    */}
        {/* ========================================================== */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-900 group">
          {/* Previous Slide Layer Retained As Background ("kan duraa background godhii") */}
          {activeItems[prevIndex] && prevIndex !== currentIndex && (
            <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700">
              <ProjectPreviewImage
                project={activeItems[prevIndex]}
                alt={activeItems[prevIndex].title}
                className="w-full h-full object-cover object-top opacity-75"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
            </div>
          )}

          {activeItems.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-all duration-700 ease-out transform z-10 ${
                  isActive
                    ? "opacity-100 scale-100 translate-x-0 pointer-events-auto"
                    : idx < currentIndex
                    ? "opacity-0 scale-98 -translate-x-8 pointer-events-none"
                    : "opacity-0 scale-98 translate-x-8 pointer-events-none"
                }`}
              >
                <ProjectPreviewImage
                  project={item}
                  alt={item.title}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle vignette shadow gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </div>
            );
          })}

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous project interface"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 shadow-lg z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next project interface"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 shadow-lg z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Floating Live Badge Top Left */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-extrabold bg-[#083785]/90 text-white border border-blue-400/40 shadow-md backdrop-blur-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#ECC257]" />
              <span>{current.platform}</span>
            </span>
          </div>

          {/* Slide Counter Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold bg-black/70 text-slate-200 border border-white/15 backdrop-blur-md">
              0{currentIndex + 1} / 0{total}
            </span>
          </div>
        </div>

        {/* ========================================================== */}
        {/* PROJECT INFO BANNER DRAWER & ACTIONS                      */}
        {/* ========================================================== */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-md">
                  {current.category}
                </span>
                <span className="text-xs text-slate-300 font-mono hidden md:inline truncate">
                  {current.metrics}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-display font-black text-white tracking-tight truncate">
                {current.title}
              </h3>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={current.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 text-xs font-mono font-bold text-[#083785] bg-[#ECC257] hover:bg-[#ffd768] active:scale-95 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer font-display"
                title={`Launch live demo: ${current.display_host}`}
              >
                <span>Launch Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {onOpenProject && (
                <button
                  onClick={() => onOpenProject(current)}
                  className="px-3.5 py-2 text-xs font-mono font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  title="Inspect Architecture Case Study"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-200" />
                  <span>Details</span>
                </button>
              )}
            </div>
          </div>

          {/* Tech Stack Icons Strip for this Project */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <span className="text-[11px] font-mono text-slate-400 font-semibold shrink-0">
                Stack:
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {current.stack.map((techKey) => (
                  <div
                    key={techKey}
                    className="p-1 rounded-lg bg-white/10 border border-white/15 hover:bg-white/20 transition-colors flex items-center justify-center w-6 h-6"
                    title={techKey}
                  >
                    <TechLogo tech={techKey} className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 shrink-0">
              {activeItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => changeSlide(idx)}
                  className={`transition-all rounded-full cursor-pointer ${
                    idx === currentIndex
                      ? "w-6 h-1.5 bg-[#ECC257]"
                      : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* QUICK THUMBNAIL SELECTOR PILLS                            */}
        {/* ========================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1.5 bg-black/80 border-t border-white/10">
          {activeItems.map((item, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => changeSlide(idx)}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-white/20 text-white font-bold border border-[#ECC257]/60 shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-[#ECC257] animate-pulse" : "bg-slate-600"}`} />
                <span className="text-[11px] font-mono truncate">{item.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroProjectBannerSlider;
