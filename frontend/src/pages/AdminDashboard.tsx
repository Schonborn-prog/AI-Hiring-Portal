import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button, Input, TextArea, Card } from "../components/UI";
import { Plus, Play, BarChart2, Briefcase, LogOut, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE as string;

export function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);

    if (data.user) fetchJobs(data.user.id);
  };

  const fetchJobs = async (adminId: string) => {
    const { data, error } = await supabase
      .from("job_descriptions")
      .select("*")
      .eq("admin_id", adminId)
      .order("created_at", { ascending: false });

    if (!error && data) setJobs(data);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const createJob = async () => {
    if (!title || !description || !user) return;
    setLoading(true);

    const { error } = await supabase.from("job_descriptions").insert({
      admin_id: user.id,
      title,
      description,
    });

    if (!error) {
      setTitle("");
      setDescription("");
      fetchJobs(user.id);
    }

    setLoading(false);
  };

  const runScreening = async (jobId: string) => {
    try {
      // Optional: Add a toast notification here in the future
      alert("Screening started! Check results after some time."); 
      await axios.post(`${API_BASE}/screening/run`, { job_id: jobId });
    } catch (err: any) {
      alert("Failed to run screening: " + err.message);
    }
  };

  // Loading State (Styled)
  if (!user) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* --- Header Section --- */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Admin</span> Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Manage talent acquisition campaigns</p>
        </div>
        <Button onClick={logout} variant="secondary" className="text-sm px-4 py-2">
            <LogOut size={16} /> Logout
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        
        {/* --- Left Column: Create Job Form --- */}
        <div className="lg:col-span-2">
            <Card className="h-full border-t-4 border-t-orange-500">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Plus className="text-orange-500" /> Create Job Description
                </h2>
                
                <div className="space-y-6">
                    <Input
                        label="Job Title"
                        placeholder="e.g. Senior Machine Learning Engineer"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextArea
                        label="Job Details"
                        placeholder="Paste the full job description, requirements, and responsibilities..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[200px]"
                    />

                    <div className="flex justify-end">
                        <Button onClick={createJob} disabled={loading} className="w-full md:w-auto">
                            {loading ? (
                                <><Loader2 className="animate-spin" size={18}/> Saving...</> 
                            ) : (
                                "Save Job Description"
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>

        {/* --- Right Column: Existing Jobs List --- */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="text-orange-500" /> Your Jobs
            </h2>

            {jobs.length === 0 && (
                <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl bg-slate-900/30">
                    <p className="text-slate-500">No job descriptions created yet.</p>
                </div>
            )}

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {jobs.map((job) => (
                    <Card key={job.id} className="p-5 border border-orange-500/10 hover:border-orange-500/40 bg-slate-900/40 transition-all group">
                        <div className="mb-4">
                            <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                                {job.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono mt-1">
                                ID: {job.id.slice(0, 8)}...
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button 
                                onClick={() => runScreening(job.id)} 
                                variant="secondary" 
                                className="text-xs py-2 px-2 h-10"
                            >
                                <Play size={14} /> Screen
                            </Button>
                            
                            <Button 
                                onClick={() => navigate(`/admin/results/${job.id}`)} 
                                variant="primary" 
                                className="text-xs py-2 px-2 h-10"
                            >
                                <BarChart2 size={14} /> Results
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </Layout>
  );
}