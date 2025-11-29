import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button, Card } from "../components/UI";
import { 
  ArrowRight, 
  Bot, 
  Briefcase, 
  CheckCircle, 
  Cpu, 
  Search, 
  User, 
  Zap,
  Star,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* --- Navigation Bar --- */}
      <nav className="flex justify-between items-center py-6 mb-16 relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Bot className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight hidden md:block">AI Hiring Portal</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-4"
          >
            Login
          </button>
          <Button 
            variant="primary" 
            className="px-6 py-2 text-sm h-10 rounded-lg shadow-orange-500/20"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="text-center max-w-5xl mx-auto mb-32 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-orange-500/30 text-orange-400 text-xs font-bold mb-8 uppercase tracking-wider backdrop-blur-md shadow-lg shadow-orange-500/10">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]" />
            AI Model v2.1 Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
            Hiring, <br className="md:hidden"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">Solved by Intelligence.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop manually screening resumes. Our AI analyzes thousands of candidates in seconds to find the perfect match based on skills, potential, and culture fit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate("/signup")} 
              className="h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow"
            >
              Start Hiring Now <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button 
              onClick={() => navigate("/signup")} 
              variant="secondary" 
              className="h-14 px-8 text-lg w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 border-slate-700"
            >
              Find a Job
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 font-bold text-white"><ShieldCheck size={18}/> Enterprise Ready</div>
             <div className="flex items-center gap-2 font-bold text-white"><Zap size={18}/> 99.9% Uptime</div>
             <div className="flex items-center gap-2 font-bold text-white"><Star size={18}/> 4.9/5 Rating</div>
          </div>
        </motion.div>
      </section>

      {/* --- Value Proposition Grid --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
        
        {/* For Recruiters Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
          <Card className="relative h-full border-orange-500/20 bg-slate-900/80 hover:border-orange-500/50 transition-all">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-colors border border-white/5">
              <Briefcase size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">For Companies</h3>
            <p className="text-slate-400 mb-6">Automate your recruitment pipeline.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-slate-300 items-start">
                <CheckCircle size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <span>Screen 1,000+ resumes in under 60 seconds.</span>
              </li>
              <li className="flex gap-3 text-slate-300 items-start">
                <CheckCircle size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <span>Unbiased, skill-based candidate rankings.</span>
              </li>
              <li className="flex gap-3 text-slate-300 items-start">
                <CheckCircle size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <span>Instant interview questions generated by AI.</span>
              </li>
            </ul>
            <Button onClick={() => navigate("/signup")} variant="outline" className="w-full group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all">Post a Job</Button>
          </Card>
        </motion.div>

        {/* For Applicants Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="relative group"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-400 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity" />
           <Card className="relative h-full border-white/10 bg-slate-900/40 hover:bg-slate-900/60 transition-all">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 group-hover:text-white transition-colors border border-white/5">
              <User size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">For Talent</h3>
            <p className="text-slate-400 mb-6">Get matched with your dream role.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-slate-300 items-start">
                <CheckCircle size={20} className="text-slate-500 shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                <span>One-click apply with auto-resume parsing.</span>
              </li>
              <li className="flex gap-3 text-slate-300 items-start">
                <CheckCircle size={20} className="text-slate-500 shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                <span>Get feedback on your profile strength.</span>
              </li>
              <li className="flex gap-3 text-slate-300 items-start">
                <CheckCircle size={20} className="text-slate-500 shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                <span>Match with roles that fit your skills.</span>
              </li>
            </ul>
            <Button onClick={() => navigate("/signup")} variant="secondary" className="w-full">Upload Resume</Button>
          </Card>
        </motion.div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="text-center mb-32 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">How Our AI Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center group">
            <div className="w-24 h-24 bg-slate-900 border border-slate-700 group-hover:border-orange-500/50 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-300">
              <Search className="text-slate-400 group-hover:text-white transition-colors" size={32} />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">1. Analyze</h4>
            <p className="text-slate-400 text-sm max-w-[250px]">
              We break down JDs and Resumes into thousands of semantic data points.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center group">
            <div className="w-24 h-24 bg-slate-900 border border-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] transition-all duration-300">
              <Cpu className="text-orange-500 animate-pulse" size={32} />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">2. Match</h4>
            <p className="text-slate-400 text-sm max-w-[250px]">
              Our Vector Engine calculates deep compatibility scores in real-time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center group">
            <div className="w-24 h-24 bg-slate-900 border border-slate-700 group-hover:border-yellow-500/50 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-300">
              <Zap className="text-slate-400 group-hover:text-yellow-400 transition-colors" size={32} />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">3. Rank</h4>
            <p className="text-slate-400 text-sm max-w-[250px]">
              You get a prioritized list of candidates who are ready to interview.
            </p>
          </div>
        </div>
      </section>

      {/* --- Call to Action --- */}
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-16 text-center border border-white/10 bg-slate-900/50 backdrop-blur-sm max-w-5xl mx-auto">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to upgrade your workflow?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg">
            Join forward-thinking companies using AI Hiring Portal to cut hiring time by 80%.
          </p>
          <Button onClick={() => navigate("/signup")} className="px-12 py-4 h-auto text-lg rounded-xl shadow-2xl shadow-orange-500/20">
            Create Free Account
          </Button>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-600/5 via-transparent to-purple-600/5" />
      </section>
      
      {/* Footer */}
      <footer className="text-center text-slate-600 text-sm py-16 border-t border-white/5 mt-20">
        <div className="flex justify-center gap-6 mb-8 text-slate-500">
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
        </div>
        <p>© 2025 AI Hiring Portal. Powered by Supabase & Vector Search.</p>
      </footer>
    </Layout>
  );
}