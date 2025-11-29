import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) {
      navigate("/login");
      return;
    }

    if (profile.role === "admin") navigate("/admin");
    else navigate("/applicant");
  };

  return <p style={{ padding: 40 }}>Loading...</p>;
}

export default App;
