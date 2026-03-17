import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConflictCard from './components/ConflictCard';
import Ticker from './components/Ticker';
import WorldMap from './components/WorldMap'; 
import Analytics from './components/Analytics'; 
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [warData, setWarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  
  // Phase 2 Safety: LocalStorage error prevention
  const [savedReports, setSavedReports] = useState(() => {
    try {
      const saved = localStorage.getItem("sentinel_vault");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Vault access error", e);
      return [];
    }
  });

  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

  const getSeverity = (title) => {
    if (!title) return "Monitoring";
    const highIntensityKeywords = ["attack", "strike", "bomb", "casualty", "offensive", "battle", "clash", "nuclear", "military", "explosion"];
    const diplomaticKeywords = ["ceasefire", "negotiation", "talks", "peace", "agreement", "aid", "dialogue", "summit"];
    const text = title.toLowerCase();

    if (highIntensityKeywords.some(k => text.includes(k))) return "High Intensity";
    if (diplomaticKeywords.some(k => text.includes(k))) return "Diplomatic";
    return "Monitoring";
  };

  useEffect(() => {
    const fetchWarNews = async () => {
      if (!API_KEY) {
        toast.error("API Key Missing");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=war OR conflict OR military&lang=en&max=10&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (data && data.articles) {
          const formattedData = data.articles.map((article, index) => ({
            id: index + 1,
            location: article.source?.name || "Unknown Source",
            description: article.title || "Intelligence Report Missing",
            severity: getSeverity(article.title),
            url: article.url || "#",
            date: article.publishedAt 
              ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : "N/A"
          }));
          
          setWarData(formattedData);

          if (formattedData.some(item => item.severity === "High Intensity")) {
            toast.error("CRITICAL: High Intensity Signals Detected", {
              icon: '🚨',
              style: { borderRadius: '0px', background: '#0f172a', color: '#ff4b4b', border: '1px solid #ff4b4b', fontFamily: 'monospace' }
            });
          }
        }
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWarNews();
  }, [API_KEY]);

  const handleSaveReport = (report) => {
    if (!report || !report.url) return;
    const isAlreadySaved = savedReports.find(r => r.url === report.url);
    if (isAlreadySaved) {
      toast("Intelligence already in Vault", { icon: '📂' });
      return;
    }
    const updatedVault = [...savedReports, report];
    setSavedReports(updatedVault);
    localStorage.setItem("sentinel_vault", JSON.stringify(updatedVault));
    toast.success("Intelligence Saved to Vault");
  };

  // Safe Filtering Logic
  const filteredData = (warData || []).filter(item => {
    const loc = (item.location || "").toLowerCase();
    const desc = (item.description || "").toLowerCase();
    const query = (searchTerm || "").toLowerCase();
    
    const matchesSearch = loc.includes(query) || desc.includes(query);
    const matchesSeverity = severityFilter === "All" || item.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-red-500 font-sans pb-12">
      <Toaster position="top-right" />
      <Navbar />
      <Ticker news={warData || []} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        
        {/* Step 1: Wrap Map/Charts in extra safety */}
        <div className="space-y-8 mb-12">
           <WorldMap />
           {!loading && warData.length > 0 && <Analytics data={warData} />}
        </div> 

        {/* Intelligence Controls - Same as before */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-[#0f172a] p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
          <div className="w-full md:w-2/3 flex gap-4">
            <input
              type="text"
              placeholder="FILTER BY REGION OR KEYWORD..."
              className="flex-1 bg-[#1e293b] border border-slate-700 p-3 text-xs focus:outline-none focus:border-red-600 font-mono uppercase"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="bg-[#1e293b] border border-slate-700 p-3 text-xs font-mono uppercase text-slate-400"
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="All">All Severity</option>
              <option value="High Intensity">High Intensity</option>
              <option value="Diplomatic">Diplomatic</option>
              <option value="Monitoring">Monitoring</option>
            </select>
          </div>
          <div className="text-right">
            <span className="block text-4xl font-black text-white leading-none tabular-nums">{filteredData.length}</span>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Active Signals</span>
          </div>
        </div>

        {/* Intelligence Reports Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-[#1e293b]/50 animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <ConflictCard 
                  key={item.id} 
                  data={item} 
                  onSave={() => handleSaveReport(item)} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800">
                <p className="text-slate-600 uppercase tracking-widest text-xs font-bold">No Intelligence Matches the Filter</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-widest">
        <span>Sentinel v2.0 // Active Tracking</span>
        <span>Secure Vault Storage: {savedReports.length} Files</span>
      </footer>
    </div>
  );
}

export default App;