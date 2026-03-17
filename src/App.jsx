import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConflictCard from './components/ConflictCard';
import Ticker from './components/Ticker'; // Ticker import karein

function App() {
  const [warData, setWarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  // YOUR API KEY HERE
  // const API_KEY = "7ceaad52478b4437a33db8c0de84a238"; 
const API_KEY = "dc60a3f1f342fe3adc5143876f01270a";
  // Function to assign severity based on keywords
  const getSeverity = (title) => {
    const highIntensityKeywords = ["attack", "strike", "bomb", "casualty", "offensive", "battle", "clash", "nuclear"];
    const diplomaticKeywords = ["ceasefire", "negotiation", "talks", "peace", "agreement", "aid", "dialogue"];
    
    title = title.toLowerCase();

    if (highIntensityKeywords.some(keyword => title.includes(keyword))) {
      return "High Intensity";
    } else if (diplomaticKeywords.some(keyword => title.includes(keyword))) {
      return "Diplomatic";
    } else {
      return "Monitoring"; // Default
    }
  };

  useEffect(() => {
    const fetchWarNews = async () => {
      try {
   const response = await fetch(
          `https://gnews.io/api/v4/search?q=war OR conflict OR military&lang=en&max=10&apikey=${API_KEY}`
        );  
        const data = await response.json();
        
        if (data.articles) {
          const formattedData = data.articles.map((article, index) => ({
            id: index + 1,
            location: article.source.name || "Global News",
            description: article.title,
            severity: getSeverity(article.title), // Sentiment logic use ho raha hai
            date: new Date(article.publishedAt).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric'
            })
          }));
          setWarData(formattedData);
        }
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error);
        setLoading(false);
      }
    };

    fetchWarNews();
  }, []);

  // Advanced Filter Logic
  const filteredData = warData.filter(item => {
    const matchesSearch = 
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "All" || item.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-red-500 font-sans">
      <Navbar />
      <Ticker news={warData} /> {/* Ticker added below Navbar */}
      
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Intelligence Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-[#0f172a] p-6 border border-slate-800 rounded-none shadow-2xl">
          <div className="w-full md:w-2/3 flex gap-4">
            <input 
              type="text" 
              placeholder="FILTER BY REGION OR KEYWORD..." 
              className="flex-1 bg-[#1e293b] border border-slate-700 p-3 rounded-none text-xs focus:outline-none focus:border-red-600 transition-all font-mono uppercase"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="bg-[#1e293b] border border-slate-700 p-3 rounded-none text-xs focus:outline-none focus:border-red-600 font-mono uppercase text-slate-400"
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="All">All Severity</option>
              <option value="High Intensity">High Intensity</option>
              <option value="Diplomatic">Diplomatic</option>
              <option value="Monitoring">Monitoring</option>
            </select>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <span className="block text-3xl font-bold text-white leading-none">{filteredData.length}</span>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Live Reports</span>
            </div>
          </div>
        </div>

        {loading ? (
          // SKELETON LOADER UI
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col h-full bg-[#1e293b]/50 border border-slate-700/50 rounded-none relative overflow-hidden group animate-pulse">
                <div className="p-6 flex-grow space-y-4">
                  <div className="h-4 bg-slate-700 w-1/4 rounded"></div>
                  <div className="h-8 bg-slate-700 w-3/4 rounded"></div>
                  <div className="h-4 bg-slate-700 w-full rounded"></div>
                </div>
                <div className="mt-auto flex justify-between items-center border-t border-slate-700/50 p-6 pt-4 bg-slate-900/30">
                  <div className="h-6 bg-slate-700 w-1/3 rounded"></div>
                  <div className="h-6 bg-slate-700 w-1/3 rounded"></div>
                </div>
              </div>
            ))}
            <p className="col-span-full text-center py-20 text-xs uppercase tracking-[0.5em] text-red-500 font-black animate-pulse">Scanning Global Frequencies...</p>
          </div>
        ) : (
          // REAL DATA UI
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredData.length > 0 ? (
              filteredData.map(item => (
                <ConflictCard key={item.id} data={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800">
                <p className="text-slate-600 uppercase tracking-widest text-sm">No Matching Signals Found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;