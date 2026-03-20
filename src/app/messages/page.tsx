'use client';

import React, { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Smile, CheckCheck, FileText, Image as ImageIcon, MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState('');

  const chats = [
    { id: 0, name: "Priya Singh", role: "UI Designer", lastMsg: "The design is ready for review!", time: "10:45 AM", online: true, unread: 2 },
    { id: 1, name: "Rahul Mehta", role: "Backend Dev", lastMsg: "I've pushed the API changes.", time: "Yesterday", online: false, unread: 0 },
    { id: 2, name: "Apple Inc.", role: "Enterprise Client", lastMsg: "Can we schedule a call?", time: "Wed", online: true, unread: 0 },
    { id: 3, name: "Sneha L.", role: "Content Writer", lastMsg: "Blog post draft is attached.", time: "Mon", online: false, unread: 0 },
  ];

  const messages = [
    { id: 1, sender: "me", text: "Hey Priya, how is the dashboard design coming along?", time: "09:30 AM" },
    { id: 2, sender: "them", text: "It's going great! I've just finished the dark mode version and the responsive layouts.", time: "09:45 AM" },
    { id: 3, sender: "me", text: "Awesome. Can you share the Figma link?", time: "10:00 AM" },
    { id: 4, sender: "them", text: "Sure, here it is along with the exported assets.", time: "10:30 AM" },
    { id: 5, sender: "them", file: { name: "Dashboard_Final.pdf", size: "2.4 MB" }, time: "10:31 AM" },
    { id: 6, sender: "them", text: "The design is ready for review!", time: "10:45 AM" },
  ];

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* ── LEFT SIDEBAR: Chat List ── */}
      <div className="w-full md:w-[360px] border-r border-gray-100 flex flex-col bg-white">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Messages</h1>
            <button className="text-gray-400 hover:text-gray-900 transition-colors">
              <MessageSquare size={22} strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full h-12 pl-12 pr-4 bg-gray-50/50 border border-transparent rounded-[20px] text-sm focus:outline-none focus:bg-white focus:border-gray-200 transition-all placeholder:text-gray-400 font-semibold"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-1 no-scrollbar">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`px-4 py-4 rounded-2xl flex gap-4 cursor-pointer transition-all ${
                activeChat === chat.id 
                  ? 'bg-blue-50/50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeChat === chat.id ? 'from-blue-600 to-indigo-600' : 'from-blue-500 to-blue-700'} text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/10`}>
                  {chat.name.charAt(0)}
                </div>
                {chat.online && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-gray-900 text-[15px] truncate tracking-tight">{chat.name}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className={`text-xs truncate ${chat.unread > 0 ? 'text-gray-600 font-bold' : 'text-gray-400 font-medium'}`}>
                    {chat.lastMsg}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-blue-500/20">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CHAT WINDOW ── */}
      <div className="hidden md:flex flex-1 flex-col bg-white">
        {/* Chat Header */}
        <div className="h-20 px-8 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/10">
              {chats[activeChat].name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1.5">{chats[activeChat].name}</h3>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
                Online Now
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
              <Phone size={22} strokeWidth={2.5} />
            </button>
            <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
              <Video size={22} strokeWidth={2.5} />
            </button>
            <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
              <MoreVertical size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 p-10 overflow-y-auto no-scrollbar bg-[#FAFBFF]/50 flex flex-col gap-8">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[70%] px-5 py-4 shadow-sm ${
                  msg.sender === 'me' 
                    ? 'bg-blue-600 text-white rounded-[24px] rounded-br-[4px] font-medium' 
                    : 'bg-white text-gray-900 border border-gray-100/10 rounded-[24px] rounded-bl-[4px] font-medium shadow-[0_4px_20px_rgb(0,0,0,0.03)]'
                }`}
              >
                {msg.file ? (
                  <div className="flex items-center gap-5 min-w-[240px]">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                      msg.sender === 'me' ? 'bg-white/10' : 'bg-gray-50 text-blue-600'
                    }`}>
                      <FileText size={28} />
                    </div>
                    <div>
                      <div className="text-sm font-bold truncate max-w-[160px] tracking-tight">{msg.file.name}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-0.5">{msg.file.size}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                )}
              </div>
              <div 
                className={`mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3 ${
                  msg.sender === 'me' ? 'mr-1' : 'ml-1'
                }`}
              >
                {msg.time} 
                {msg.sender === 'me' && (
                  <div className="flex ml-1">
                    <CheckCheck size={14} className="text-blue-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Control Area */}
        <div className="p-8 bg-white border-t border-gray-100">
          <div className="flex items-center gap-4 bg-gray-50 border border-transparent p-2.5 pl-6 rounded-[24px] focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all">
            <button className="text-gray-400 hover:text-blue-600 transition-colors">
              <Smile size={22} strokeWidth={2.5} />
            </button>
            <input 
              type="text" 
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 h-12 bg-transparent border-none outline-none text-sm font-semibold text-gray-900 placeholder:text-gray-400"
            />
            <div className="flex items-center gap-3 pr-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-all">
                <ImageIcon size={22} strokeWidth={2.5} />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-all">
                <Paperclip size={22} strokeWidth={2.5} />
              </button>
              <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                <Send size={22} strokeWidth={2.5} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
