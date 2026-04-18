export default function Navbar() {
  return (
    <nav className="bg-[#0f172a] text-white p-5 border-b border-red-500/30 shadow-2xl">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-widest text-red-600 uppercase">
          Global<span className="text-slate-100 italic font-light">Sentinel</span>
        </h1>
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider font-semibold">
          <a href="#" className="hover:text-red-500 transition-colors">Live Feed</a>
          <a href="#" className="hover:text-red-500 transition-colors">Global Map</a>
          <a href="#" className="text-red-500 border border-red-500 px-4 py-1 rounded-sm hover:bg-red-500 hover:text-white transition-all">Emergency Alerts</a>
        </div>
      </div>
      
    </nav>

    
  );
}
