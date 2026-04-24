import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Send, Calendar, Sparkles, Bell, MapPin, Clock, ArrowUpRight,
  Loader2, LogOut, CheckCircle2, Plus, Download, Eye, EyeOff,
  Paperclip, X, FileText, Image as ImageIcon, AlertCircle
} from "lucide-react";
import { EVENTS, getResourcesForProfile, getNudgesForProfile } from "../data/seed.js";
import { askAgent, fileToBase64 } from "../lib/agent.js";
import { downloadICS } from "../lib/calendar.js";
import CalendarView from "./CalendarView.jsx";
import Markdown from "./Markdown.jsx";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

export default function Dashboard({ profile, apiKey, onLogout }) {
  const [addedEvents, setAddedEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]); // [{ file, base64, preview, name, sizeKB }]
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] = useState("nudges");
  const [showCalendar, setShowCalendar] = useState(true);
  const [fileError, setFileError] = useState("");
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const resources = useMemo(() => getResourcesForProfile(profile), [profile]);
  const nudges = useMemo(() => getNudgesForProfile(profile), [profile]);

  const fullCalendar = useMemo(() => {
    return [
      ...profile.calendar,
      ...addedEvents.map(e => ({
        time: e.time, end: e.end, title: e.title, location: e.location,
        type: "campus-event", eventId: e.id,
      })),
    ];
  }, [profile.calendar, addedEvents]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const STARTERS = [
    "What should I do today?",
    "Any scholarships I should apply to?",
    "I'm stressed — help me prioritize",
    "Draft a cold email to a professor",
  ];

  async function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setFileError("");

    const newFiles = [];
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setFileError(`"${file.name}" is not supported. Use images (PNG/JPG/GIF/WebP) or PDF.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`"${file.name}" is too large (max 10 MB).`);
        continue;
      }
      try {
        const base64 = await fileToBase64(file);
        const preview = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null;
        newFiles.push({
          file,
          base64,
          preview,
          name: file.name,
          sizeKB: Math.round(file.size / 1024),
          isImage: file.type.startsWith("image/"),
        });
      } catch (err) {
        setFileError(`Couldn't read "${file.name}".`);
      }
    }
    setPendingFiles(prev => [...prev, ...newFiles]);
    e.target.value = ""; // reset so same file can be re-selected later
  }

  function removeFile(idx) {
    setPendingFiles(prev => {
      const removed = prev[idx];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function send(text) {
    const message = (text ?? input).trim();
    if ((!message && pendingFiles.length === 0) || loading) return;

    const attachmentsForSend = [...pendingFiles];
    const userMsgContent = message || (attachmentsForSend.length > 0 ? "_(attached file)_" : "");

    const newHistory = [
      ...messages,
      {
        role: "user",
        content: userMsgContent,
        attachments: attachmentsForSend.map(f => ({ name: f.name, isImage: f.isImage, preview: f.preview })),
      },
    ];
    setMessages(newHistory);
    setInput("");
    setPendingFiles([]);
    setLoading(true);
    setFileError("");

    try {
      // For history, attachments only go on the most recent message
      const reply = await askAgent({
        apiKey, profile, calendar: fullCalendar, resources,
        userMessage: message || "Please review the attached file(s) in light of my profile and goals.",
        history: messages.map(m => ({ role: m.role, content: m.content })),
        attachments: attachmentsForSend,
      });
      setMessages([...newHistory, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newHistory, { role: "assistant", content: `I couldn't reach the API: ${e.message}\n\nCheck the API key and try again.` }]);
    }
    setLoading(false);
  }

  function addToCalendar(event) {
    if (!addedEvents.find(e => e.id === event.id)) {
      setAddedEvents(prev => [...prev, event]);
    }
  }
  function removeFromCalendar(eventId) {
    setAddedEvents(prev => prev.filter(e => e.id !== eventId));
  }
  function exportICS(event) { downloadICS(event); }

  const rankedEvents = useMemo(() => {
    return [...EVENTS].map(e => {
      const conflict = fullCalendar.find(c =>
        c.eventId !== e.id && !(e.end <= c.time || e.time >= c.end)
      );
      const interestMatch = e.tags.filter(t => profile.interests.includes(t)).length;
      const isAdded = !!addedEvents.find(a => a.id === e.id);
      return { ...e, conflict, interestMatch, isAdded };
    }).sort((a, b) => {
      if (a.isAdded && !b.isAdded) return -1;
      if (!a.isAdded && b.isAdded) return 1;
      if (!a.conflict && b.conflict) return -1;
      if (a.conflict && !b.conflict) return 1;
      return b.interestMatch - a.interestMatch;
    });
  }, [fullCalendar, addedEvents, profile.interests]);

  return (
    <div className="min-h-screen w-full relative">
      {/* Header */}
      <header className="relative z-20 border-b" style={{ borderColor: "var(--line)", background: "var(--paper)" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full border-2 orbit-spin" style={{ borderColor: "var(--primary)", borderRightColor: "transparent" }} />
              <div className="absolute inset-2 rounded-full" style={{ background: "var(--primary)" }} />
            </div>
            <div>
              <div className="font-serif text-lg leading-none" style={{ color: "var(--ink)" }}>
                Campus<span style={{ color: "var(--primary)" }}>Orbit</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono mt-0.5" style={{ color: "var(--ink-mute)" }}>
                Friday · April 24, 2026
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCalendar(s => !s)}
              className="hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{ borderColor: "var(--line-strong)", color: "var(--ink-soft)", background: "var(--paper)" }}
            >
              {showCalendar ? <EyeOff size={12} /> : <Eye size={12} />}
              {showCalendar ? "Hide" : "Show"} calendar
            </button>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border" style={{ background: "var(--cream)", borderColor: "var(--line)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-serif font-medium text-white" style={{ background: "var(--primary)" }}>
                {profile.initials}
              </div>
              <div className="text-xs">
                <div className="font-medium leading-tight" style={{ color: "var(--ink)" }}>{profile.name.split(" ")[0]}</div>
                <div className="text-[10px] font-mono" style={{ color: "var(--ink-mute)" }}>{profile.year}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors"
              style={{ color: "var(--ink-soft)" }}
              title="Switch profile"
            >
              <LogOut size={12} /> Switch
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_460px] gap-6">

          {/* LEFT */}
          <section className="flex flex-col gap-5 min-w-0">
            {messages.length === 0 && (
              <div className="fade-up">
                <div className="text-[11px] uppercase tracking-[0.25em] mb-3 font-mono" style={{ color: "var(--ink-mute)" }}>
                  Friday · 11:42 AM · 64°F · Sunny
                </div>
                <h1 className="font-serif text-5xl md:text-6xl leading-[0.95] mb-4" style={{ color: "var(--ink)" }}>
                  Hello, <em style={{ color: "var(--primary)" }}>{profile.name.split(" ")[0]}.</em>
                </h1>
                <p className="max-w-xl text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  I know your schedule, your goals, every event happening on campus today, and every resource you qualify for. <span className="font-serif italic" style={{ color: "var(--ink)" }}>Ask me anything — or attach a resume, scholarship PDF, or screenshot for review.</span>
                </p>
              </div>
            )}

            {showCalendar && (
              <div className="fade-up" style={{ animationDelay: "0.05s" }}>
                <CalendarView calendar={fullCalendar} onRemoveAdded={removeFromCalendar} />
              </div>
            )}

            {/* Chat panel */}
            <div className="rounded-2xl border flex flex-col" style={{ background: "var(--paper)", borderColor: "var(--line)", minHeight: "400px" }}>
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--line)", background: "var(--paper-tint)" }}>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} style={{ color: "var(--primary)" }} />
                  <span className="text-[11px] uppercase tracking-[0.2em] font-mono" style={{ color: "var(--ink)" }}>Ask CampusOrbit</span>
                </div>
                <span className="text-[10px] font-mono" style={{ color: "var(--ink-mute)" }}>
                  Powered by Claude Sonnet 4
                </span>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ maxHeight: "560px" }}>
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--ink-mute)" }}>
                      Try asking →
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {STARTERS.map(p => (
                        <button
                          key={p}
                          onClick={() => send(p)}
                          className="text-xs px-3 py-2 rounded-full border transition-all hover:-translate-y-0.5"
                          style={{ background: "var(--cream)", borderColor: "var(--line-strong)", color: "var(--ink-soft)" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line-strong)"; e.currentTarget.style.color = "var(--ink-soft)"; }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs italic mt-2" style={{ color: "var(--ink-mute)" }}>
                      Or attach a resume, scholarship PDF, or screenshot using the paperclip ↓
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} fade-up`}>
                    <div
                      className="max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed"
                      style={
                        m.role === "user"
                          ? { background: "var(--primary)", color: "white" }
                          : { background: "var(--cream)", color: "var(--ink)", border: "1px solid var(--line)" }
                      }
                    >
                      {/* Attachments */}
                      {m.attachments?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {m.attachments.map((a, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs"
                              style={{
                                background: m.role === "user" ? "rgba(255,255,255,0.18)" : "var(--paper)",
                                color: m.role === "user" ? "white" : "var(--ink-soft)",
                                border: m.role === "user" ? "1px solid rgba(255,255,255,0.25)" : "1px solid var(--line)",
                              }}
                            >
                              {a.isImage && a.preview ? (
                                <img src={a.preview} alt={a.name} className="w-8 h-8 rounded object-cover" />
                              ) : a.isImage ? (
                                <ImageIcon size={14} />
                              ) : (
                                <FileText size={14} />
                              )}
                              <span className="truncate max-w-[180px]">{a.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Body */}
                      {m.role === "assistant"
                        ? <Markdown>{m.content}</Markdown>
                        : <span className="whitespace-pre-wrap">{m.content}</span>
                      }
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start fade-up">
                    <div className="rounded-2xl px-4 py-3 flex items-center gap-2 text-sm border" style={{ background: "var(--cream)", borderColor: "var(--line)", color: "var(--ink-mute)" }}>
                      <Loader2 size={14} className="animate-spin" />
                      {pendingFiles.length > 0 || messages[messages.length - 1]?.attachments?.length
                        ? "Reading the attachment and checking your profile…"
                        : "Checking your calendar and campus feeds…"}
                    </div>
                  </div>
                )}
              </div>

              {/* Pending file previews */}
              {pendingFiles.length > 0 && (
                <div className="px-3 pt-3 border-t" style={{ borderColor: "var(--line)" }}>
                  <div className="flex flex-wrap gap-2">
                    {pendingFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border group" style={{ background: "var(--cream)", borderColor: "var(--line-strong)" }}>
                        {f.isImage && f.preview ? (
                          <img src={f.preview} alt={f.name} className="w-7 h-7 rounded object-cover" />
                        ) : f.isImage ? (
                          <ImageIcon size={14} style={{ color: "var(--ink-soft)" }} />
                        ) : (
                          <FileText size={14} style={{ color: "var(--primary)" }} />
                        )}
                        <div className="text-xs">
                          <div className="font-medium leading-tight max-w-[180px] truncate" style={{ color: "var(--ink)" }}>{f.name}</div>
                          <div className="text-[10px] font-mono" style={{ color: "var(--ink-mute)" }}>{f.sizeKB} KB</div>
                        </div>
                        <button
                          onClick={() => removeFile(i)}
                          className="ml-1 p-0.5 rounded hover:bg-white transition-colors"
                          style={{ color: "var(--ink-mute)" }}
                          title="Remove"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File error */}
              {fileError && (
                <div className="px-4 pt-2 flex items-center gap-1.5 text-xs" style={{ color: "var(--primary-deep)" }}>
                  <AlertCircle size={12} /> {fileError}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t" style={{ borderColor: "var(--line)" }}>
                <div className="relative flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-cream-warm disabled:opacity-30 flex-shrink-0"
                    style={{ background: "var(--cream)", color: "var(--ink-soft)", border: "1px solid var(--line-strong)" }}
                    title="Attach a resume, PDF, or image"
                  >
                    <Paperclip size={15} />
                  </button>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                    disabled={loading}
                    placeholder={pendingFiles.length > 0 ? "Add a question, or just send the file…" : "Ask anything — events, scholarships, advice…"}
                    className="flex-1 rounded-xl pl-4 pr-12 py-3 text-[14px] outline-none transition-all border-2"
                    style={{
                      background: "var(--cream)",
                      borderColor: "var(--line)",
                      color: "var(--ink)",
                    }}
                    onFocus={e => e.target.style.borderColor = "var(--primary)"}
                    onBlur={e => e.target.style.borderColor = "var(--line)"}
                  />
                  <button
                    onClick={() => send()}
                    disabled={loading || (!input.trim() && pendingFiles.length === 0)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <Send size={14} />
                  </button>
                </div>
                <div className="text-[10px] mt-1.5 font-mono" style={{ color: "var(--ink-faint)" }}>
                  Supports PNG · JPG · GIF · WebP · PDF · max 10 MB
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT — Orbital panels */}
          <aside className="space-y-3 xl:sticky xl:top-6 xl:self-start xl:max-h-[calc(100vh-100px)] xl:overflow-y-auto pb-6">
            <div className="flex gap-1 p-1 rounded-xl border" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
              {[
                { id: "nudges", label: "Nudges", icon: Bell, count: nudges.length },
                { id: "events", label: "Today", icon: Calendar, count: rankedEvents.length },
                { id: "resources", label: "For You", icon: Sparkles, count: resources.length },
              ].map(t => {
                const Icon = t.icon;
                const active = activePanel === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActivePanel(t.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all"
                    style={
                      active
                        ? { background: "var(--primary)", color: "white" }
                        : { background: "transparent", color: "var(--ink-soft)" }
                    }
                  >
                    <Icon size={12} /> {t.label}
                    <span className="text-[10px] opacity-70">({t.count})</span>
                  </button>
                );
              })}
            </div>

            {activePanel === "nudges" && (
              <div className="space-y-3 fade-in">
                <div className="text-[10px] uppercase tracking-[0.25em] px-1 font-mono" style={{ color: "var(--ink-mute)" }}>
                  Proactive · {nudges.length} things you should know
                </div>
                {nudges.map((n, i) => {
                  const tone = n.urgency === "today"
                    ? { bg: "var(--primary-soft)", border: "var(--primary)", text: "var(--primary-deep)" }
                    : n.urgency === "soon"
                    ? { bg: "var(--honey-soft)", border: "var(--honey)", text: "var(--honey)" }
                    : { bg: "var(--rose-soft)", border: "var(--rose)", text: "var(--rose)" };
                  return (
                    <div key={n.id} className="p-4 rounded-xl border fade-up" style={{ background: tone.bg, borderColor: tone.border + "55", animationDelay: `${i * 0.06}s` }}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.urgency === "today" ? "pulse-soft" : ""}`} style={{ background: tone.border }} />
                        <div className="flex-1">
                          <div className="text-[10px] uppercase tracking-wider mb-1 font-mono font-medium" style={{ color: tone.text }}>
                            {n.type} · {n.urgency}
                          </div>
                          <div className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>{n.text}</div>
                          <button
                            onClick={() => send(n.text)}
                            className="mt-3 text-xs flex items-center gap-1 group font-medium"
                            style={{ color: tone.text }}
                          >
                            Take action <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activePanel === "events" && (
              <div className="space-y-3 fade-in">
                <div className="text-[10px] uppercase tracking-[0.25em] px-1 font-mono" style={{ color: "var(--ink-mute)" }}>
                  Ranked by your availability + interests
                </div>
                {rankedEvents.map((e, i) => (
                  <div
                    key={e.id}
                    className="p-4 rounded-xl border transition-all fade-up"
                    style={{
                      background: e.isAdded ? "var(--forest-soft)" : e.conflict ? "var(--cream)" : "var(--paper)",
                      borderColor: e.isAdded ? "var(--forest)" : "var(--line)",
                      opacity: e.conflict && !e.isAdded ? 0.7 : 1,
                      animationDelay: `${i * 0.04}s`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold leading-tight" style={{ color: "var(--ink)" }}>{e.title}</div>
                        <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-[11px]" style={{ color: "var(--ink-mute)" }}>
                          <span className="flex items-center gap-1"><Clock size={10} /> {e.time}–{e.end}</span>
                          <span className="flex items-center gap-1"><MapPin size={10} /> {e.location}</span>
                        </div>
                      </div>
                      {e.isAdded ? (
                        <div className="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1" style={{ background: "var(--forest)", color: "white" }}>
                          <CheckCircle2 size={10} /> Added
                        </div>
                      ) : e.conflict ? (
                        <div className="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ background: "var(--primary-soft)", color: "var(--primary-deep)" }}>
                          Conflict
                        </div>
                      ) : e.interestMatch > 0 ? (
                        <div className="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ background: "var(--honey-soft)", color: "var(--honey)" }}>
                          ★ Match
                        </div>
                      ) : null}
                    </div>
                    {e.conflict && !e.isAdded && (
                      <div className="text-[11px] mb-2 italic" style={{ color: "var(--primary-deep)" }}>
                        Overlaps with {e.conflict.title}
                      </div>
                    )}
                    <div className="text-[12.5px] leading-relaxed mb-2" style={{ color: "var(--ink-soft)" }}>{e.desc}</div>
                    {e.perks?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {e.perks.map(p => (
                          <span key={p} className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: "var(--cream-warm)", color: "var(--ink-soft)", border: "1px solid var(--line)" }}>{p}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {e.isAdded ? (
                        <button
                          onClick={() => removeFromCalendar(e.id)}
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors"
                          style={{ background: "var(--paper)", color: "var(--ink-soft)", borderColor: "var(--line-strong)" }}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCalendar(e)}
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all hover:-translate-y-0.5"
                          style={{ background: "var(--primary)", color: "white", boxShadow: "var(--shadow-sm)" }}
                        >
                          <Plus size={12} /> Add to calendar
                        </button>
                      )}
                      <button
                        onClick={() => exportICS(e)}
                        className="text-xs flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors"
                        style={{ color: "var(--ink-mute)" }}
                        title="Download .ics for Google/Apple Calendar"
                      >
                        <Download size={11} /> .ics
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activePanel === "resources" && (
              <div className="space-y-3 fade-in">
                <div className="text-[10px] uppercase tracking-[0.25em] px-1 font-mono" style={{ color: "var(--ink-mute)" }}>
                  Matched to your profile · ranked by fit
                </div>
                {resources.map((r, i) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl border transition-all hover:-translate-y-0.5 fade-up"
                    style={{ background: "var(--paper)", borderColor: "var(--line)", animationDelay: `${i * 0.04}s` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-wider mb-1 font-mono font-medium" style={{ color: "var(--primary)" }}>{r.category}</div>
                        <div className="text-sm font-semibold leading-tight" style={{ color: "var(--ink)" }}>{r.title}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-serif text-base" style={{ color: "var(--primary-deep)" }}>{r.amount}</div>
                        <div className="text-[10px] mt-0.5 font-mono" style={{ color: "var(--ink-mute)" }}>{r.deadline}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--cream-warm)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${r.match}%`, background: "linear-gradient(to right, var(--primary), var(--honey))" }} />
                      </div>
                      <span className="text-[10px] tabular-nums font-mono font-medium" style={{ color: "var(--ink-soft)" }}>{r.match}%</span>
                    </div>
                    <div className="text-[11.5px] mb-2.5 italic" style={{ color: "var(--ink-mute)" }}>Why: {r.why}</div>
                    <button
                      onClick={() => send(`Help me with: ${r.title}. ${r.action}.`)}
                      className="text-xs flex items-center gap-1 group font-medium"
                      style={{ color: "var(--primary)" }}
                    >
                      {r.action} <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
