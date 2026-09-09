import { API_URL } from '../config';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Sparkles, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { extractApiError } from "../lib/api-errors";
import axios from "axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password
      });
      navigate("/login");
    } catch (err: any) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4 py-12 relative overflow-hidden text-[#f5f5f5]">
      <div className="w-full max-w-md bg-[#111111] p-8 sm:p-10 rounded-2xl shadow-xl border border-[#222222] relative">
        {/* Brand header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-[#161616] border border-[#262626] items-center justify-center text-[#bbf451] mb-2 font-bold">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-[#737373]">
            Start tracking and boosting your resume ATS compatibility
          </p>
        </div>

        {error && (
          <div className="bg-[#16120e] border border-[#fb923c]/30 text-[#fb923c] p-3.5 rounded-xl mb-6 text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#a3a3a3] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
              <Input 
                type="email" 
                placeholder="name@example.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="pl-10 h-11 bg-[#0a0a0a] border-[#262626] text-[#f5f5f5] placeholder:text-[#525252] focus:border-[#bbf451]" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#a3a3a3] uppercase tracking-wider mb-1.5">
              Create Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="At least 6 characters"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                minLength={6} 
                className="pl-10 pr-10 h-11 bg-[#0a0a0a] border-[#262626] text-[#f5f5f5] placeholder:text-[#525252] focus:border-[#bbf451]" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#f5f5f5] focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 text-[11px] text-[#737373] font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#bbf451]" />
              <span>Full access to ATS scoring & semantic analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#bbf451]" />
              <span>Automatic history saving & report tracking</span>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="default"
            className="w-full h-11 font-bold text-sm mt-3" 
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up for Free"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#222222] text-center">
          <p className="text-xs text-[#737373]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#bbf451] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
