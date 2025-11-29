import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button, Input } from "../components/UI";
import { 
  UserPlus, 
  Loader2, 
  AlertCircle, 
  ArrowRight, 
  Briefcase, 
  User 
} from "lucide-react";
import { clsx } from "clsx";

export function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("applicant");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErr("");

    try {
        // 1. Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        const user = data.user;
        if (!user) throw new Error("Signup failed - No user data returned.");

        // 2. Insert into profiles table
        const { error: profileErr } = await supabase.from("profiles").insert({
            id: user.id,
            full_name: fullName,
            role,
        });

        if (profileErr) throw profileErr;

        // Redirect to login
        navigate("/login");
        
    } catch (error: any) {
        setErr(error.message || "An unexpected error occurred");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[85vh] flex items-center justify-center">
        
        {/* Main Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
          
          {/* Left Side: Visuals */}
          <div className="relative p-12 hidden md:flex flex-col justify-between bg-gradient-to-br from-purple-900/20 via-slate-900 to-orange-600/20 border-r border-white/5">
            <div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl mb-8 flex items-center justify-center shadow-lg shadow-orange-500/40">
                <UserPlus className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                Join the Future
              </h1>
              <p className="text-orange-200/60 font-medium text-lg">
                Where Top Talent Meets AI Intelligence.
              </p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">1</div>
                    <p className="text-sm">Create your profile</p>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">2</div>
                    <p className="text-sm">Upload resume / Post jobs</p>
                </div>
                <div className="flex items-center gap-4 text-white font-medium">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/50">3</div>
                    <p className="text-sm">Let AI do the work</p>
                </div>
            </div>
          </div>

          {/* Right Side: Signup Form */}
          <div className="p-8 md:p-12 bg-slate-950/40 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-400">Get started with your AI-powered hiring journey.</p>
            </div>

            {err && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle size={18} />
                {err}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />

              <Input
                label="Password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Custom Role Selector */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold ml-1 uppercase tracking-wider">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                    {/* Applicant Option */}
                    <div 
                        onClick={() => setRole('applicant')}
                        className={clsx(
                            "cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300",
                            role === 'applicant' 
                                ? "bg-orange-500/10 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
                                : "bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-500 hover:bg-slate-800"
                        )}
                    >
                        <User size={24} className={role === 'applicant' ? "text-orange-500" : "text-slate-500"} />
                        <span className="font-bold text-sm">Applicant</span>
                    </div>

                    {/* Admin Option */}
                    <div 
                        onClick={() => setRole('admin')}
                        className={clsx(
                            "cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300",
                            role === 'admin' 
                                ? "bg-orange-500/10 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
                                : "bg-slate-900/50 border-slate-700 text-slate-500 hover:border-slate-500 hover:bg-slate-800"
                        )}
                    >
                        <Briefcase size={24} className={role === 'admin' ? "text-orange-500" : "text-slate-500"} />
                        <span className="font-bold text-sm">Recruiter</span>
                    </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base mt-4"
                disabled={loading}
              >
                {loading ? (
                  <> <Loader2 className="animate-spin" /> Creating Account... </>
                ) : (
                  <> Sign Up <ArrowRight size={18} /> </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center pt-8 border-t border-white/5">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-orange-400 hover:text-orange-300 font-bold hover:underline decoration-orange-500/30 underline-offset-4 transition-all"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}