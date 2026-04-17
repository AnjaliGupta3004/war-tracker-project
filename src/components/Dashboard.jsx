import React from 'react';
import WorldMap from '../components/WorldMap';
import Analytics from '../components/Analytics';
import ConflictCard from '../components/ConflictCard';

const Dashboard = ({ loading, filteredData, warData, searchTerm, setSearchTerm, setSeverityFilter, onSave, onSelect }) => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Map & Analytics Section */}
      <div className="space-y-8 mb-12">
        <WorldMap />
        {!loading && warData?.length > 0 && <Analytics data={warData} />}
      </div>

      {/* Search & Filters (As it is) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-[#0f172a] p-6 border border-slate-800 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
        <div className="w-full md:w-2/3 flex gap-4">
          <input
            type="text"
            placeholder="FILTER BY REGION..."
            className="flex-1 bg-[#1e293b] border border-slate-700 p-3 text-xs focus:outline-none focus:border-red-600 font-mono uppercase text-white"
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

              <div key={item.id} onClick={() => onSelect(item)} className="cursor-pointer group relative">
                <ConflictCard data={item} onSave={(e) => { e.stopPropagation(); onSave(item); }} />
                <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-all border border-red-600/20"></div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-800 text-slate-600 text-xs font-bold uppercase">
              No Intelligence Matches the Filter
            </div>
          )}



      
        </div>
      )}
    </div>
  );
};





export default Dashboard;