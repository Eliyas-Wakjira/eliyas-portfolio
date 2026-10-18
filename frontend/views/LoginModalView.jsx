/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend View: LoginModalView (V in MVC)
 */
import { useState, useEffect } from "react";
import { useAuth } from "../controllers/authController";
import { X, Lock, Mail, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
const LoginModalView = ({ isOpen, onClose, onSuccess }) => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setLocalError(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    try {
      const ok = await login(email, password);
      if (ok) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setLocalError(error || "Sign-in failed");
      }
    } catch {
      setLocalError("Authentication request failed.");
    } finally {
      setLoading(false);
    }
  };
  return <div className="fixed top-16 sm:top-[70px] inset-x-0 bottom-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {
    /* Header */
  }
        <div className="bg-[#083785] text-white p-6 sm:p-7 relative">
          <button
    onClick={onClose}
    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
    aria-label="Close modal"
  >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-blue-100 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ECC257]" />
            <span>MVC Full-Stack Portfolio Portal</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-black text-white leading-tight">
            Sign In to Eliyas Studio
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Access administrative management, message inbox, and MySQL console.
          </p>
        </div>

        {
    /* Body */
  }
        <div className="p-6 sm:p-7 space-y-5">
          {(localError || error) && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{localError || error}</span>
            </div>}

          {
    /* Form */
  }
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="admin@example.com"
    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#083785] bg-slate-50/50"
  />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    type={showPassword ? "text" : "password"}
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#083785] bg-slate-50/50 font-mono"
  />
                <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
  >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
    type="submit"
    disabled={loading}
    className="w-full py-3 text-xs sm:text-sm font-bold text-white bg-[#083785] hover:bg-[#062c6d] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
  >
              <span>{loading ? "Authenticating..." : "Sign In as Administrator"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>;
};
export {
  LoginModalView
};
