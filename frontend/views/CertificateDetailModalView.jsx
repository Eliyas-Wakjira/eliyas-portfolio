/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend View: CertificateDetailModalView (V in MVC)
 */
import { useEffect, useState } from "react";
import { X, ExternalLink, CheckCircle2, Copy, Check, Building2, Award } from "lucide-react";
import { apiUrl } from "../controllers/api";
const CertificateDetailModalView = ({
  certificate,
  onClose
}) => {
  const [copiedId, setCopiedId] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (certificate) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [certificate, onClose]);
  if (!certificate) return null;
  const fileUrl = apiUrl(certificate.file_url || "");
  const isPdf = certificate.file_mime_type === "application/pdf" || /\.pdf(?:[?#]|$)/i.test(fileUrl);
  const handleCopyId = () => {
    navigator.clipboard.writeText(certificate.credential_id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2e3);
  };
  return <div className="fixed top-16 sm:top-[70px] inset-x-0 bottom-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-7rem)] flex flex-col">
        {
    /* Top Header */
  }
        <div className="bg-[#083785] text-white p-6 sm:p-8 relative shrink-0">
          <button
    onClick={onClose}
    className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
    aria-label="Close modal"
  >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 text-blue-100 font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-[#ECC257]" />
            <span>
              {certificate.category_number}. {certificate.category} · VERIFIED CREDENTIAL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white leading-tight">
            {certificate.title}
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-100 mt-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Issued by {certificate.issuer}</span>
          </div>
        </div>

        {
    /* Scrollable Body */
  }
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {fileUrl && (
            <div className={`relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md ${isPdf ? "h-[420px]" : "aspect-video max-h-[300px]"}`}>
              {isPdf ? (
                <iframe
                  src={fileUrl}
                  title={`${certificate.title} PDF`}
                  className="w-full h-full"
                />
              ) : (
                <img
                  src={fileUrl}
                  alt={certificate.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              )}
              {!isPdf && (
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm px-3 py-1 rounded-lg text-white font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official Verification Stamp · {certificate.year}</span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">DATE ISSUED</span>
              <span className="font-semibold text-slate-800 font-mono">{certificate.issue_date}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">EXPIRATION</span>
              <span className="font-semibold text-slate-800 font-mono">{certificate.expiry_date}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">CATEGORY</span>
              <span className="font-semibold text-slate-800 font-mono truncate block">
                {certificate.category_number}. {certificate.category}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">STATUS</span>
              <span className="text-emerald-700 font-bold font-mono">Verified</span>
            </div>
          </div>

          {certificate.credential_id && <div className="flex items-center justify-between p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/80">
              <div className="text-xs font-mono text-[#083785]">
                <strong className="block text-[10px] text-slate-500 uppercase font-sans">
                  Official Credential Identifier:
                </strong>
                <span className="font-bold text-sm tracking-wide">{certificate.credential_id}</span>
              </div>
              <button
    onClick={handleCopyId}
    className="px-3 py-1.5 text-xs font-semibold text-[#083785] bg-white hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
  >
                {copiedId ? <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </> : <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>}
              </button>
            </div>}

          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 font-mono">
              CERTIFIED SCOPE &amp; RIGOR
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
              {certificate.description}
            </p>
          </div>

          {certificate.skills_acquired.length > 0 && <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono">
                VALIDATED SKILLS &amp; STANDARDS
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {certificate.skills_acquired.map((s, idx) => <span
    key={idx}
    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-50 text-[#083785] border border-blue-100 font-medium"
  >
                    {s}
                  </span>)}
              </div>
            </div>}

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <a
    href={apiUrl(certificate.file_url || certificate.credential_url || "")}
    target="_blank"
    rel="noopener noreferrer"
    className="px-5 py-2.5 text-xs font-bold text-white bg-[#083785] hover:bg-[#062c6d] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
  >
              <span>Verify at {certificate.issuer} (New Tab)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
    onClick={onClose}
    className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors cursor-pointer"
  >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export {
  CertificateDetailModalView
};
