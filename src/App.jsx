import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConflictCard from './components/ConflictCard';
import Ticker from './components/Ticker';
import WorldMap from './components/WorldMap';
import Analytics from './components/Analytics';
import Chatbot from './components/Chatbot';

import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [warData, setWarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  // LocalStorage Safety
  const [savedReports, setSavedReports] = useState(() => {
    try {
      const saved = localStorage.getItem("sentinel_vault");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
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
      // API Key check to prevent crash
      if (!API_KEY) {
        console.error("VITE_GNEWS_API_KEY is missing in Env Variables");
        setLoading(false);
        return;
      }
      
      try {
        // Production-stable endpoint
        const response = await fetch(
          `https://gnews.io/api/v4/top-headlines?category=world&lang=en&max=10&apikey=${API_KEY}`
        );
        
        const data = await response.json();

        if (data && data.articles) {
          const formattedData = data.articles.map((article, index) => ({
            id: index + 1,
            location: article.source?.name || "Global Intel",
            description: article.title || "No Description Available",
            severity: getSeverity(article.title),
            url: article.url || "#",
            date: article.publishedAt 
              ? new Date(article.publishedAt).toLocaleDateString('en-GB') 
              : "LIVE"
          }));

          setWarData(formattedData);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        // Fallback data so UI doesn't stay empty or white
        setWarData([{
            id: 999,
            location: "Sentinel Node",
            description: "Connection to GNews lost. System running on local cache.",
            severity: "Monitoring",
            url: "#",
            date: "OFFLINE"
        }]);
      } finally {
        setLoading(false);
      }
    };
    fetchWarNews();
  }, [API_KEY]);

  const handleSaveReport = (report) => {
    if (!report?.url) return;
    const isAlreadySaved = savedReports.find(r => r.url === report.url);
    if (isAlreadySaved) {
      toast("Intelligence already in Vault", { icon: '📂' });
      return;
    }
    const updatedVault = [...savedReports, report];
    setSavedReports(updatedVault);
    localStorage.setItem("sentinel_vault", JSON.stringify(updatedVault));
    toast.success("Intelligence Saved");
  };

  // Ultra-Safe Filtering
  const filteredData = (warData || []).filter(item => {
    const loc = (item?.location || "").toLowerCase();
    const desc = (item?.description || "").toLowerCase();
    const query = (searchTerm || "").toLowerCase();
    const matchesSearch = loc.includes(query) || desc.includes(query);
    const matchesSeverity = severityFilter === "All" || item?.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-red-500 font-sans pb-12">
      <Toaster position="top-right" />
      <Navbar />
      
      {/* Safe Ticker */}
      <Ticker news={warData || []} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="space-y-8 mb-12">
          <WorldMap />
          {/* Safe Analytics */}
          {!loading && warData?.length > 0 && <Analytics data={warData} />}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-[#0f172a] p-6 border border-slate-800 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
          <div className="w-full md:w-2/3 flex gap-4">
            <input
              type="text"
              placeholder="FILTER BY REGION..."
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
            <span className="block text-4xl font-black text-white tabular-nums">{filteredData?.length || 0}</span>
            <span className="text-[10px] text-slate-500 uppercase font-black">Active Signals</span>
          </div>
        </div>

        {/* Reports Grid */}
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
                <ConflictCard key={item.id} data={item} onSave={() => handleSaveReport(item)} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800 text-slate-600 text-xs font-bold uppercase">
                No Intelligence Matches the Filter
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase">
        <span>Sentinel v4.0 // Secure Link</span>
        <span>Vault: {savedReports?.length || 0} Files</span>
      </footer>

      <Chatbot />
    </div>
  );
}

export default App;