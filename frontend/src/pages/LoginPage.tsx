import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button, Input } from "../components/UI";
import { LogIn, Loader2, AlertCircle, ArrowRight } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      // 1. Login via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("Login failed - User not found.");

      // 2. Fetch the user's profile to know role
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileErr || !profile) throw new Error("Failed to fetch user profile.");

      // 3. Redirect based on role
      if (profile.role === "admin") navigate("/admin");
      else navigate("/applicant");

    } catch (error: any) {
      setErr(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[85vh] flex items-center justify-center">
        
        {/* Main Card Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
          
          {/* Left Side: Visuals (Hidden on mobile) */}
          <div className="relative p-12 hidden md:flex flex-col justify-between bg-gradient-to-br from-orange-600/20 via-slate-900 to-purple-900/20 border-r border-white/5">
            <div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl mb-8 flex items-center justify-center shadow-lg shadow-orange-500/40">
                <LogIn className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                AI Hiring Portal
              </h1>
              <p className="text-orange-200/60 font-medium text-lg">
                Next Generation Talent Acquisition
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-2 w-24 bg-gradient-to-r from-orange-500 to-transparent rounded-full animate-pulse" />
              <div className="h-2 w-16 bg-gradient-to-r from-orange-500/50 to-transparent rounded-full" />
              <div className="h-2 w-32 bg-gradient-to-r from-orange-500/20 to-transparent rounded-full" />
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-8 md:p-12 bg-slate-950/40 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400">Enter your credentials to access your dashboard.</p>
            </div>

            {err && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle size={18} />
                {err}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email Address"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                    <a href="#" className="text-xs text-slate-500 hover:text-orange-400 transition-colors">Forgot password?</a>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base"
                disabled={loading}
              >
                {loading ? (
                  <> <Loader2 className="animate-spin" /> Logging in... </>
                ) : (
                  <> Login <ArrowRight size={18} /> </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center pt-8 border-t border-white/5">
              <p className="text-slate-400 text-sm">
                Don’t have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-orange-400 hover:text-orange-300 font-bold hover:underline decoration-orange-500/30 underline-offset-4 transition-all"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}