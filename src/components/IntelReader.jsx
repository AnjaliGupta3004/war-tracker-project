import React from 'react';

const IntelReader = ({ article, onBack }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col animate-in slide-in-from-right duration-500">
      <div className="bg-[#0f172a] p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[9px] text-red-500 font-mono font-black uppercase tracking-widest">Uplink Established // {article.location}</span>
          <h2 className="text-white text-xs font-bold truncate max-w-md uppercase">{article.description}</h2>
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="border border-slate-700 text-white px-4 py-2 text-[10px] font-black uppercase hover:bg-slate-800">Back</button>
          <a href={article.url} target="_blank" rel="noreferrer" className="bg-red-600 text-white px-4 py-2 text-[10px] font-black uppercase">Open Original ↗</a>
        </div>
        
      </div>
      <div className="flex-1 bg-white relative">
        <iframe src={article.url} className="w-full h-full border-none" title="Intel Feed" />
        <div className="absolute inset-0 -z-10 bg-slate-900 flex items-center justify-center text-slate-500 font-mono text-xs uppercase p-10 text-center">
           Encryption Blocked View. Use 'Open Original' to bypass firewall.
          
        </div>
      </div>
    </div>
  );
};
export default IntelReader;