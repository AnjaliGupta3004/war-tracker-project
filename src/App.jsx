import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Ticker from './components/Ticker';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';
import IntelReader from './components/IntelReader';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [warData, setWarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [savedReports, setSavedReports] = useState(() => {
    try {
      const saved = localStorage.getItem("sentinel_vault");
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

  const getSeverity = (title) => {
    if (!title) return "Monitoring";
    const text = title.toLowerCase();
    if (["attack", "strike", "bomb", "military"].some(k => text.includes(k))) return "High Intensity";
    if (["peace", "talks", "aid"].some(k => text.includes(k))) return "Diplomatic";
    return "Monitoring";
  };

  useEffect(() => {
    const fetchWarNews = async () => {
      if (!API_KEY) { setLoading(false); return; }
      try {
        const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=world&lang=en&max=12&apikey=${API_KEY}`);
        const data = await response.json();
        if (data && data.articles) {
          setWarData(data.articles.map((a, i) => ({
            id: i + 1,
            location: a.source?.name || "Global Intel",
            description: a.title,
            severity: getSeverity(a.title),
            url: a.url,
            date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-GB') : "LIVE"
          })));
        }
      } catch (error) {
        console.error(error);
      } finally { setLoading(false); }
    };
    fetchWarNews();
  }, [API_KEY]);

  const handleSaveReport = (report) => {
    if (savedReports.find(r => r.url === report.url)) {
      toast("Intelligence already in Vault", { icon: '📂' });
      return;
    }
    const updated = [...savedReports, report];
    setSavedReports(updated);
    localStorage.setItem("sentinel_vault", JSON.stringify(updated));
    toast.success("Intelligence Saved");
  };

  const filteredData = (warData || []).filter(item => {
    const matchesSearch = item.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "All" || item.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-12">
      <Toaster position="top-right" />
      <Navbar />
      <Ticker news={warData || []} />

      <main className="max-w-7xl mx-auto py-8 px-6">
        {!selectedArticle ? (
          <Dashboard 
            loading={loading}
            warData={warData}
            filteredData={filteredData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSeverityFilter={setSeverityFilter}
            onSave={handleSaveReport}
            onSelect={setSelectedArticle}
          />
        ) : (
          <IntelReader 
            article={selectedArticle} 
            onBack={() => setSelectedArticle(null)} 
          />
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase">
        <span>Sentinel v4.0 // Secure Link</span>
        <span>Vault: {savedReports.length} Files</span>
      </footer>

      <Chatbot />
    </div>
  );
}

export default App;