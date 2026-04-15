export default function ConflictCard({ data, onSave }) {
  // Severity ke hisaab se colors define karna
  const severityColors = {
    'High Intensity': 'bg-red-600 text-white',
    'Diplomatic': 'bg-blue-500 text-white',
    'Monitoring': 'bg-orange-500 text-black'
  };
  


  return (
    <div className="flex flex-col h-full bg-[#1e293b] border border-slate-700/50 rounded-none relative overflow-hidden group hover:border-red-500/50 transition-all shadow-2xl">
      {/* Top Corner Decorative Element */}

      <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/10 rotate-45 translate-x-8 -translate-y-8"></div>
      
      
      <div className="p-6 flex-grow">

        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] tracking-[0.2em] text-red-500 font-bold uppercase">Report #00{data.id}</span>
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${severityColors[data.severity] || 'bg-slate-500 text-white'}`}>
            {data.severity}

          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-3 uppercase tracking-tight group-hover:text-red-400 transition-colors">
          {data.location}
        </h3>
        
        <p className="text-slate-400 text-sm leading-relaxed font-medium mb-4">
          {data.description}

        </p>

        <div className="flex items-center gap-4 mt-2">
          {/* View Full Report Link */}
          <a 
            href={data.url} 
            target="_blank" 

            rel="noopener noreferrer"
            className="inline-block text-[9px] text-red-500 font-bold uppercase tracking-widest border-b border-red-500 pb-1 hover:text-white hover:border-white transition-all"
          >
            View Full Intelligence Report →
          </a>

          {/* Phase 2: Save to Vault Button */}
          <button 
            onClick={onSave}
            className="text-[10px] text-slate-400 hover:text-green-500 transition-colors flex items-center gap-1 uppercase font-bold tracking-widest"
            title="Save to Secure Vault"
          >
            <span></span> Save to Vault
          </button>
        </div>
      </div>

      <div className="mt-auto flex justify-between items-center border-t border-slate-700/50 p-6 pt-4 bg-slate-900/30">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Verification</span>
          <span className="text-xs text-green-500 font-mono">Status: Verified</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Timestamp</span>
          <span className="text-xs text-slate-300 block font-mono">{data.date}</span>
        </div>
      </div>
    </div>
  );
}