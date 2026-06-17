import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, User, Phone, RefreshCw, Minimize2 } from 'lucide-react';
import { chatApi } from '../../utils/api';
import { v4 as uuidv4 } from 'uuid';

const QUICK = [
  'What areas are popular in London?',
  'How does Help to Buy work?',
  'What are current mortgage rates?',
  'Find me 3 bed houses under 400k',
];

export default function ChatbotWidget() {
  const [open,      setOpen]      = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [handover,  setHandover]  = useState(false);
  const [unread,    setUnread]    = useState(0);
  const [sessionId]               = useState(() => uuidv4());
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role:'assistant', content:"Hi! I'm PropAI Assistant. I can help you find properties, understand mortgages, and navigate the UK property market. What are you looking for?", ts: new Date() }]);
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(p => [...p, { role:'user', content:msg, ts:new Date() }]);
    setLoading(true);
    try {
      const { data } = await chatApi.chat(sessionId, msg);
      setMessages(p => [...p, { role:'assistant', content:data.message, ts:new Date(), handover:data.handoverTriggered }]);
      if (data.handoverTriggered) setHandover(true);
      if (!open) setUnread(u => u+1);
    } catch {
      setMessages(p => [...p, { role:'assistant', content:"I'm having trouble connecting. Please try again.", ts:new Date(), error:true }]);
    } finally { setLoading(false); }
  };

  const reset = () => { setMessages([]); setHandover(false); setOpen(false); setTimeout(() => setOpen(true), 100); };
  const fmt = (d) => new Date(d).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!open && <AnimatePresence><motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
          className="bg-blue-900 text-white rounded-2xl px-4 py-2 text-sm font-medium max-w-48 text-center shadow-lg">
          Ask AI about UK property
        </motion.div></AnimatePresence>}
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => setOpen(!open)}
          className="w-14 h-14 bg-gradient-to-br from-blue-800 to-blue-500 rounded-full shadow-xl flex items-center justify-center relative">
          {open ? <X className="w-6 h-6 text-white"/> : <MessageCircle className="w-6 h-6 text-white"/>}
          {unread > 0 && !open && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unread}</span>}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:20}}
            className={`fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden w-96 ${minimised ? 'h-16' : 'h-[560px]'}`}
            style={{ maxHeight:'calc(100vh - 120px)' }}>
            <div className="bg-gradient-to-r from-blue-800 to-blue-500 p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"><Sparkles className="w-5 h-5 text-white"/></div>
                <div>
                  <h3 className="text-white font-semibold text-sm">PropAI Assistant</h3>
                  <p className="text-white/70 text-xs flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"/>{handover ? 'Connecting to agent...' : 'Online'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={reset} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"><RefreshCw className="w-4 h-4"/></button>
                <button onClick={() => setMinimised(!minimised)} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"><Minimize2 className="w-4 h-4"/></button>
                <button onClick={() => setOpen(false)} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"><X className="w-4 h-4"/></button>
              </div>
            </div>

            {!minimised && <>
              {handover && (
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-800 text-sm"><User className="w-4 h-4"/><span className="font-medium">Connecting to a specialist...</span></div>
                  <a href="tel:+441234567890" className="flex items-center gap-1 text-blue-700 text-xs font-semibold"><Phone className="w-3.5 h-3.5"/>Call now</a>
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.role==='user' ? 'flex-row-reverse' : ''}`}>
                    {m.role==='assistant' && <div className="w-7 h-7 bg-gradient-to-br from-blue-700 to-blue-400 rounded-full flex-shrink-0 flex items-center justify-center mt-1"><Sparkles className="w-3.5 h-3.5 text-white"/></div>}
                    <div className={`max-w-[80%] flex flex-col ${m.role==='user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role==='user' ? 'bg-blue-700 text-white rounded-tr-sm' : m.error ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                        {m.handover && <p className="text-amber-600 font-semibold text-xs mb-1 flex items-center gap-1"><User className="w-3 h-3"/>Transferring to agent</p>}
                        {m.content}
                      </div>
                      <span className="text-gray-400 text-[10px] mt-1 px-1">{fmt(m.ts)}</span>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-700 to-blue-400 rounded-full flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-white"/></div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                      <span className="chat-dot w-2 h-2 bg-gray-400 rounded-full"/><span className="chat-dot w-2 h-2 bg-gray-400 rounded-full"/><span className="chat-dot w-2 h-2 bg-gray-400 rounded-full"/>
                    </div>
                  </div>
                )}
                <div ref={endRef}/>
              </div>

              {messages.length === 1 && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {QUICK.map(q => <button key={q} onClick={() => send(q)} className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-full font-medium border border-blue-100 transition-colors">{q}</button>)}
                </div>
              )}

              <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
                  <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()}
                    placeholder="Ask about any property..." className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none py-1"/>
                  <button onClick={() => send()} disabled={!input.trim()||loading}
                    className="w-8 h-8 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 rounded-lg flex items-center justify-center transition-colors">
                    <Send className="w-4 h-4 text-white"/>
                  </button>
                </div>
                <p className="text-gray-400 text-[10px] text-center mt-2">PropAI uses AI. Not financial or legal advice.</p>
              </div>
            </>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
