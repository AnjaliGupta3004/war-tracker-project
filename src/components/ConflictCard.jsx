export default function ConflictCard({ data }) {
  return (
    <div className="flex flex-col h-full bg-[#1e293b] border border-slate-700/50 rounded-none relative overflow-hidden group hover:border-red-500/50 transition-all shadow-2xl">
      {/* Decorative red corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/10 rotate-45 translate-x-8 -translate-y-8"></div>
      
      {/* Content Area - Isme flex-grow use kiya hai */}
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] tracking-[0.2em] text-red-500 font-bold uppercase">Report #00{data.id}</span>
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${
            data.severity === 'High' ? 'bg-red-600 text-white' : 'bg-orange-500 text-black'
          }`}>
            {data.severity} Risk
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-3 uppercase tracking-tight group-hover:text-red-400 transition-colors">
          {data.location}
        </h3>
        
        <p className="text-slate-400 text-sm leading-relaxed font-medium">
          {data.description}
        </p>
      </div>

      {/* Footer Area - mt-auto ensures it stays at the bottom */}
      <div className="mt-auto flex justify-between items-center border-t border-slate-700/50 p-6 pt-4 bg-slate-900/30">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Verification</span>
          <span className="text-xs text-green-500 font-mono">Status: Verified</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold text-block">Timestamp</span>
          <span className="text-xs text-slate-300 block">{data.date}</span>
        </div>
      </div>
    </div>
  );
}