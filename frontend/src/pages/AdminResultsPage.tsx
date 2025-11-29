import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "../components/Layout";
import { Button } from "../components/UI";
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  Cpu
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE as string;

export function AdminResultsPage() {
  const { jobId } = useParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State to track which result cards are expanded (for the full AI explanation)
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    if (!jobId) return;

    try {
      const res = await axios.get(`${API_BASE}/screening/results/${jobId}`);
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // --- Loading State ---
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="text-slate-400 font-mono animate-pulse">Analyzing Candidates...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* --- Header --- */}
      <div className="mb-8">
        <Button 
          onClick={() => navigate("/admin")} 
          variant="ghost" 
          className="mb-4 pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Button>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
          Screening Results
        </h1>
        <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
            <Cpu size={14} className="text-orange-500"/>
            <span>Job ID: {jobId}</span>
        </div>
      </div>

      {results.length === 0 && (
        <div className="p-12 border border-dashed border-slate-700 rounded-2xl bg-slate-900/30 text-center">
            <p className="text-slate-500 text-lg">No results found.</p>
            <p className="text-slate-600 text-sm mt-2">Make sure you have run the screening process for this job.</p>
        </div>
      )}

      {/* --- Results Feed --- */}
      <div className="space-y-8">
        {results.map((r, index) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-orange-500/10 transition-shadow duration-500"
          >
            {/* 1. Card Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-orange-500 font-black text-4xl">#{index + 1}</span>
                        <div className="bg-slate-800 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                            <FileText size={14} className="text-slate-400"/>
                            <span className="text-slate-200 font-medium text-sm truncate max-w-[200px] md:max-w-md">
                                {r.resumes.original_filename}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400">Match Confidence:</span>
                        <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-orange-500 rounded-full" 
                                style={{ width: `${r.fit_percentage}%` }}
                            />
                        </div>
                        <span className="text-orange-400 font-bold text-sm">{r.fit_percentage}%</span>
                    </div>
                </div>

                {/* Circular Score */}
                <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                        <circle 
                            cx="48" cy="48" r="40" 
                            stroke="#f97316" strokeWidth="6" fill="transparent" 
                            strokeDasharray={251} 
                            strokeDashoffset={251 - (251 * r.score) / 100} 
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-bold text-white">{r.score}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Score</span>
                    </div>
                </div>
            </div>

            {/* 2. Analysis Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
                {/* Strengths */}
                <div className="p-6 md:p-8 bg-slate-900/30">
                    <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                        <CheckCircle size={16} /> Key Strengths
                    </h3>
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {r.strengths}
                    </div>
                </div>

                {/* Weaknesses */}
                <div className="p-6 md:p-8 bg-slate-950/30">
                    <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                        <AlertTriangle size={16} /> Potential Gaps
                    </h3>
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {r.weaknesses}
                    </div>
                </div>
            </div>

            {/* 3. Expandable Full AI Explanation */}
            <div className="border-t border-white/5 bg-slate-950">
                <button 
                    onClick={() => toggleExpand(r.id)}
                    className="w-full flex items-center justify-center gap-2 p-4 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    {expandedId === r.id ? (
                        <>Hide AI Analysis <ChevronUp size={16} /></>
                    ) : (
                        <>Read Full AI Analysis <ChevronDown size={16} /></>
                    )}
                </button>
                
                <AnimatePresence>
                    {expandedId === r.id && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-8 pt-0 text-slate-400 text-sm leading-7 border-t border-dashed border-slate-800">
                                <p className="mb-2 text-orange-500 font-mono text-xs uppercase">/// AI Model Output ///</p>
                                {r.raw_explanation}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

          </motion.div>
        ))}
      </div>
    </Layout>
  );
}