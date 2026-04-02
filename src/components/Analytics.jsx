import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Analytics = ({ data = [] }) => {
  // 1. Safety Gate: Agar data nahi hai toh blank screen ki jagah loading indicator dikhao
  if (!data || data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center border border-dashed border-slate-800 mb-12">
        <span className="text-[10px] font-mono text-slate-600 animate-pulse uppercase tracking-[0.2em]">
          Analyzing Signal Data...
        </span>
      </div>
    );
  }

  // 2. Data processing with safe filtering
  const stats = [
    { name: 'High Intensity', value: data.filter(d => d.severity === 'High Intensity').length, color: '#ef4444' },
    { name: 'Diplomatic', value: data.filter(d => d.severity === 'Diplomatic').length, color: '#3b82f6' },
    { name: 'Monitoring', value: data.filter(d => d.severity === 'Monitoring').length, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Intensity Breakdown - Pie Chart */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-slate-700">INTEL_STATS_V4</div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-800 pb-2">
          📊 Intensity Distribution
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                // React 19 optimization: animation ko false rakh sakte hain agar crash ho
                isAnimationActive={true}
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', fontSize: '10px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {stats.map(s => (
            <div key={s.name} className="flex items-center gap-2">
              <div className="w-2 h-2" style={{ backgroundColor: s.color }}></div>
              <span className="text-[9px] uppercase font-bold text-slate-500">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Frequency - Bar Chart */}
      <div className="bg-[#0f172a] border border-slate-800 p-6 shadow-2xl">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-800 pb-2">
          📈 Signal Strength by Severity
        </h3>
  <div style={{ width: '100%', height: '350px', minHeight: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#475569', fontSize: 10 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#1e293b' }} 
                contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} 
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  
                ))}
              </Bar>
            </BarChart>

          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

};

export default Analytics;