import React, { useState } from 'react';
import Groq from "groq-sdk"; // 🚀 Groq SDK Import

// SDK Initialize (Vite environment ke liye)
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'SENTINEL ONLINE. LPU acceleration active. How can I assist?' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      // 🚀 Groq Chat Completion Call
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are SENTINEL, a high-speed tactical AI assistant. Provide concise, military-style geopolitical intel."
          },
          {
            role: "user",
            content: currentInput,
          },
        ],
        model: "llama-3.3-70b-versatile", // Sabse fast aur powerful model
      });

      const aiResponse = chatCompletion.choices[0]?.message?.content || "No intel received.";
      setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);

    } catch (error) {
      console.error("Groq Uplink Error:", error);
      
      // Fallback logic remains for a professional UI
      setTimeout(() => {
        const responses = [
          "SENTINEL: Satellite encryption active. Regional threat levels remain stable.",
          "INTEL: High-frequency interference detected. Displaying cached tactical data.",
          "SYSTEM: Connection to central command is intermittent. Scanning local perimeter..."
        ];
        const randomMsg = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { role: "ai", text: randomMsg }]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl border-2 border-white/20 transition-all flex items-center justify-center w-14 h-14"
      >
        {isOpen ? "✖" : "Chat"}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-[#0f172a] border border-slate-800 shadow-2xl flex flex-col font-mono overflow-hidden">
          <div className="bg-slate-900 p-3 border-b border-slate-800 text-[10px] font-black uppercase text-red-500 flex justify-between items-center">
            <span>Sentinel v4.0 (Groq-LPU)</span>
            <span className="animate-pulse text-green-500 text-[8px]">● ULTRA-FAST</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[11px] bg-black/40">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`inline-block p-2 max-w-[85%] ${m.role === 'user' ? 'bg-blue-900/40 text-blue-300' : 'bg-slate-800 text-slate-300'} border border-slate-700`}>
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <div className="text-red-500 animate-pulse text-[9px]">DECRYPTING LPU FEED...</div>}
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              className="flex-1 bg-black border border-slate-700 p-2 text-[10px] text-white focus:outline-none focus:border-red-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="SCAN COMMAND..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;