/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend View: CVModalView (V in MVC)
 */
import { useEffect } from "react";
import { X, Printer, Mail, MapPin, Globe, Award, GraduationCap } from "lucide-react";
const CVModalView = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const handlePrint = () => {
    window.print();
  };
  return <div className="fixed top-16 sm:top-[70px] inset-x-0 bottom-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-7rem)] flex flex-col">
        {
    /* CV Modal Toolbar */
  }
        <div className="bg-[#083785] text-white p-4 sm:p-6 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-white">
              Curriculum Vitae · Eliyas Wakjira
            </h2>
            <p className="text-xs text-blue-100 font-mono">
              Full-Stack Software Engineer &amp; Collegiate Computing Instructor
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
    onClick={handlePrint}
    className="px-3.5 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
    title="Print CV"
  >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
    onClick={onClose}
    className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
    aria-label="Close CV"
  >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {
    /* Scrollable Printable Document */
  }
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-slate-50/50">
          {
    /* Header Card */
  }
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-black text-[#083785]">
                  Eliyas Wakjira
                </h1>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  Full-Stack Developer, Relational Database Specialist &amp; Collegiate Lecturer
                </p>
              </div>
              <div className="text-xs font-mono space-y-1 text-slate-600 sm:text-right">
                <div className="flex sm:justify-end items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#083785]" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
                <div className="flex sm:justify-end items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#083785]" />
                  <a href="mailto:info@eliyastech.com" className="text-[#083785] hover:underline">
                    info@eliyastech.com
                  </a>
                </div>
                <div className="flex sm:justify-end items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#083785]" />
                  <a href="https://eliyastech.com" target="_blank" rel="noopener noreferrer" className="text-[#083785] hover:underline">
                    eliyastech.com
                  </a>
                </div>
              </div>
            </div>

            {
    /* Executive Bio */
  }
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Results-driven Senior Full-Stack Engineer and Collegiate Lecturer with 5+ years of experience engineering high-performance reactive web applications (React 19, Next.js 15), decoupled microservice architectures (Node.js, Express.js MVC), and normalized relational databases (MySQL 8.0, InnoDB transactions). Passionate about pedagogical rigor, software engineering best practices, and mentoring junior engineers.
            </p>
          </div>

          {
    /* Education & Credentials */
  }
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#083785] font-display font-bold text-base border-b border-slate-100 pb-2">
              <GraduationCap className="w-5 h-5 text-[#083785]" />
              <span>EDUCATION &amp; PEDAGOGICAL QUALIFICATIONS</span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Bachelor of Science (B.Sc.) in Computer Science &amp; Information Technology
                    </h4>
                    <p className="text-slate-600 text-xs">Metropolitan University / Technical College</p>
                  </div>
                  <span className="font-mono text-xs text-slate-500">Graduated with Distinction</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Higher Diploma in Technical &amp; Vocational Collegiate Instruction (HDP)
                    </h4>
                    <p className="text-slate-600 text-xs">Federal TVET Institute / Ministry of Education</p>
                  </div>
                  <span className="font-mono text-xs text-slate-500">Certified Collegiate Instructor</span>
                </div>
              </div>
            </div>
          </div>

          {
    /* Technical Skills Summary */
  }
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#083785] font-display font-bold text-base border-b border-slate-100 pb-2">
              <Award className="w-5 h-5 text-[#083785]" />
              <span>TECHNICAL COMPETENCIES &amp; STACK</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-800 font-mono block">Frontend Development:</span>
                <p className="text-slate-600 leading-relaxed">
                  React 19, Next.js 15, TypeScript, Tailwind CSS, Concurrent Rendering, Context API, Lucide Icons, WCAG AA Accessibility.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 font-mono block">Backend &amp; Databases:</span>
                <p className="text-slate-600 leading-relaxed">
                  Node.js, Express.js MVC, MySQL 8.0, Boyce-Codd Normal Form, Index Tuning, ACID Transactions, Redis Caching, RESTful APIs, JWT.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 font-mono block">DevOps &amp; Cloud:</span>
                <p className="text-slate-600 leading-relaxed">
                  Docker Multi-Stage Builds, AWS EC2, S3, RDS, CloudFront, Linux / Ubuntu Systemd, NGINX SSL, GitHub Actions CI/CD.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 font-mono block">Instruction &amp; Management:</span>
                <p className="text-slate-600 leading-relaxed">
                  Collegiate Curricula Design, TVET Competency Assessment, Laboratory Mentorship, Agile Sprint Execution, Code Auditing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export {
  CVModalView
};
