import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { Layout } from "../components/Layout";
import { Button, Card } from "../components/UI";
import { 
  Briefcase, 
  Upload, 
  FileText, 
  LogOut, 
  CheckCircle, 
  Loader2, 
  Clock 
} from "lucide-react";

export function ApplicantDashboard() {
  const [user, setUser] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  
  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUser();
    fetchJobs();
  }, []);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);

    if (data.user) fetchResumes(data.user.id);
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("job_descriptions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setJobs(data);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const fetchResumes = async (userId: string) => {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setResumes(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
    }
  };

  const uploadResume = async () => {
    if (!file || !user) return;
    setUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Upload file to storage
      const { error: uploadErr } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadErr) throw uploadErr;

      // 2. Insert metadata into resumes table
      const { error: insertErr } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          file_path: filePath,
          original_filename: file.name,
        });

      if (insertErr) throw insertErr;

      // 3. Refresh list
      await fetchResumes(user.id);
      setFile(null);
      // Reset input value
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("Resume uploaded successfully!");
    } catch (err: any) {
      alert(err.message);
    }

    setUploading(false);
  };

  // --- Loading View ---
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
      {/* --- Header --- */}
      <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Applicant</span> Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">Explore opportunities & manage your profile</p>
        </div>
        <Button onClick={logout} variant="secondary" className="text-sm px-4 py-2">
            <LogOut size={16} /> Logout
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Job Feed --- */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-slate-300 flex items-center gap-2">
            <Briefcase className="text-orange-500" /> Open Positions
          </h2>
          
          {jobs.length === 0 && (
              <div className="p-8 border border-dashed border-slate-700 rounded-xl bg-slate-900/30 text-center text-slate-500">
                  No job descriptions available right now.
              </div>
          )}

          <div className="space-y-6">
            {jobs.map((job) => (
                <Card key={job.id} className="border-l-4 border-l-orange-500 hover:bg-slate-800/80 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                            {job.title}
                        </h3>
                        <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-full border border-orange-500/20 font-mono">
                            ACTIVE
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4 hover:line-clamp-none transition-all">
                        {job.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={12} /> Posted: {new Date(job.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </Card>
            ))}
          </div>
        </div>

        {/* --- Right Column: Upload & Resume List --- */}
        <div className="space-y-8">
          
          {/* Upload Section */}
          <div>
            <h2 className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <Upload className="text-orange-500" /> Upload Resume
            </h2>

            <Card className="border-dashed border-2 border-slate-700 bg-slate-900/30 text-center py-10 hover:border-orange-500/50 transition-colors relative overflow-hidden">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                />
                
                <div className="flex flex-col items-center gap-4 relative z-10">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-4 bg-slate-800 rounded-full text-orange-500 cursor-pointer hover:bg-slate-700 transition-colors shadow-lg"
                    >
                        {uploading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                    </div>
                    
                    <div>
                        {file ? (
                            <p className="font-bold text-green-400 flex items-center justify-center gap-2">
                                <FileText size={16} /> {file.name}
                            </p>
                        ) : (
                            <>
                                <p className="font-medium text-white">Click to Select PDF</p>
                                <p className="text-xs text-slate-500 mt-1">Max size: 5MB</p>
                            </>
                        )}
                    </div>

                    <Button 
                        onClick={uploadResume} 
                        disabled={uploading || !file}
                        className="mt-2 w-full max-w-[200px]"
                    >
                        {uploading ? "Uploading..." : "Submit Resume"}
                    </Button>
                </div>
            </Card>
          </div>

          {/* List of Resumes */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Your History</h3>
            
            {resumes.length === 0 && <p className="text-slate-500 text-sm italic">No resumes uploaded yet.</p>}

            <div className="space-y-3">
                {resumes.map((res) => (
                    <div key={res.id} className="bg-slate-800/50 p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-orange-500/30 transition-all group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-slate-700 rounded-lg shrink-0">
                                <FileText size={20} className="text-orange-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate group-hover:text-orange-300 transition-colors">
                                    {res.original_filename}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                    {new Date(res.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                    </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}