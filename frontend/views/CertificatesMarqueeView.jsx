/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend View: Certificate grid (V in MVC)
 * Features:
 * 1. Responsive certificate grid with diploma parchment watermarks
 * 2. Open certificate files in a new tab and copy credential IDs
 */
import { useState } from "react";
import { INITIAL_CERTIFICATES } from "../models/localDataFallback";
import { apiUrl } from "../controllers/api";
import {
  Award,
  ExternalLink,
  Calendar,
  Building2,
  Copy,
  Check,
  Cpu,
  GraduationCap,
  HeartHandshake,
  ShieldCheck
} from "lucide-react";

const CertificatesMarqueeView = ({
  certificates = INITIAL_CERTIFICATES
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenInNewTab = (cert, e) => {
    e.stopPropagation();
    const targetUrl = cert.file_url || cert.credential_url;
    if (targetUrl) {
      window.open(apiUrl(targetUrl), "_blank", "noopener,noreferrer");
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Technology":
        return <Cpu className="w-3.5 h-3.5 text-[#083785]" />;
      case "Education":
        return <GraduationCap className="w-3.5 h-3.5 text-amber-700" />;
      case "Humanitarian":
        return <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />;
      case "Others":
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />;
      default:
        return <Award className="w-3.5 h-3.5 text-[#083785]" />;
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case "Technology":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Education":
        return "bg-amber-50 text-amber-900 border-amber-200";
      case "Humanitarian":
        return "bg-emerald-50 text-emerald-900 border-emerald-200";
      case "Others":
        return "bg-purple-50 text-purple-900 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const renderCard = (cert) => {
    const targetUrl = cert.file_url || cert.credential_url;
    return (
      <div
        key={cert.id}
        onClick={(e) => handleOpenInNewTab(cert, e)}
        className="relative w-full bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-[#083785] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1 overflow-hidden shadow-xs"
        title={`Open ${cert.title} in new tab`}
      >
        {/* Subtle Watermark Background */}
        <div className="absolute top-0 right-0 w-28 h-28 opacity-[0.06] pointer-events-none select-none overflow-hidden rounded-bl-full">
          <img
            src="/frontend/assets/images/cert_diploma_bg.jpg"
            alt="Diploma Watermark"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 space-y-3">
          {/* Category & Date Header */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border ${getCategoryBadgeClass(
                cert.category
              )}`}
            >
              {getCategoryIcon(cert.category)}
              <span>{cert.category}</span>
            </span>

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{cert.issue_date}</span>
            </div>
          </div>

          {/* Title & Issuer */}
          <div>
            <h3 className="text-sm sm:text-base font-display font-extrabold text-[#083785] group-hover:text-[#062c6d] transition-colors leading-snug line-clamp-2">
              {cert.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-1">
              <Building2 className="w-3.5 h-3.5 text-[#083785] shrink-0" />
              <span className="truncate">{cert.issuer}</span>
            </div>
          </div>

          {/* Skills Acquired Chips (Max 3 for concise look) */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {cert.skills_acquired.slice(0, 3).map((skill, sIdx) => (
              <span
                key={sIdx}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="relative z-10 pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={(e) => handleCopyId(cert.credential_id, e)}
            title="Copy ID"
            className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-[#083785] transition-colors cursor-pointer truncate max-w-[130px]"
          >
            {copiedId === cert.credential_id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{cert.credential_id}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5">
            <a
              href={apiUrl(targetUrl || "")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#083785] hover:bg-[#062c6d] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <span>View</span>
              <ExternalLink className="w-3 h-3 text-white" />
            </a>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificates.map((cert) => renderCard(cert))}
      </div>
    </div>
  );
};

export { CertificatesMarqueeView };
