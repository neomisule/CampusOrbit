import React, { useState } from "react";
import { QUICK_START } from "../data/seed.js";
import { ArrowRight, Key, Sparkles, UserPlus, Zap } from "lucide-react";

export default function Login({ onCreateProfile, onUseQuickStart }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem("anthropic_api_key") || "");
  const [hovered, setHovered] = useState(null);

  function persistKey() {
    if (!apiKey.trim()) {
      alert("Please paste your Anthropic API key first.");
      return false;
    }
    localStorage.setItem("anthropic_api_key", apiKey.trim());
    return true;
  }

  function handleCreate() {
    if (persistKey()) onCreateProfile(apiKey.trim());
  }

  function handleQuickStart(personaId) {
    if (persistKey()) onUseQuickStart(personaId, apiKey.trim());
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Decorative orbits */}
      <div className="absolute top-20 right-[-100px] w-96 h-96 rounded-full border opacity-30 orbit-spin" style={{ borderColor: "var(--primary)" }}>
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: "var(--primary)" }} />
      </div>
      <div className="absolute bottom-[-50px] left-[-50px] w-72 h-72 rounded-full border opacity-25" style={{ borderColor: "var(--forest)" }}>
        <div className="absolute -bottom-1 right-1/4 w-2.5 h-2.5 rounded-full" style={{ background: "var(--forest)" }} />
      </div>
      <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full opacity-40" style={{ background: "var(--honey)" }} />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full opacity-50" style={{ background: "var(--forest)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-16">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12 fade-up">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 orbit-spin" style={{ borderColor: "var(--primary)", borderRightColor: "transparent" }} />
            <div className="absolute inset-2.5 rounded-full" style={{ background: "var(--primary)" }} />
          </div>
          <div>
            <div className="font-serif text-2xl leading-none tracking-tight" style={{ color: "var(--ink)" }}>
              Campus<span style={{ color: "var(--primary)" }}>Orbit</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] font-mono mt-1" style={{ color: "var(--ink-mute)" }}>
              Anthropic × Maryland · Hackathon 2026
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start mb-16">
          <div className="fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="inline-block mb-6 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider" style={{ background: "var(--primary-soft)", color: "var(--primary-deep)" }}>
              Track 2 · Campus Intelligence & Equity
            </div>
            <h1 className="font-serif text-6xl md:text-7xl leading-[0.95] mb-6" style={{ color: "var(--ink)" }}>
              Your campus,<br />
              <em style={{ color: "var(--primary)", fontStyle: "italic" }}>intelligent.</em>
            </h1>
            <p className="text-lg leading-relaxed max-w-lg" style={{ color: "var(--ink-soft)" }}>
              One AI agent that knows your schedule, your goals, every event happening on campus, and every resource you qualify for. <span className="font-serif italic" style={{ color: "var(--ink)" }}>Built for the students who fall through the cracks.</span>
            </p>
          </div>

          {/* API Key card */}
          <div className="fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="p-6 rounded-2xl border" style={{ background: "var(--paper)", borderColor: "var(--line)", boxShadow: "var(--shadow)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Key size={14} style={{ color: "var(--primary)" }} />
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--ink)" }}>API Key</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "var(--cream-warm)", color: "var(--ink-mute)" }}>
                  Browser only
                </span>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="w-full px-4 py-3 rounded-xl border-2 outline-none font-mono text-sm transition-all"
                style={{
                  background: "var(--cream)",
                  borderColor: "var(--line)",
                  color: "var(--ink)",
                }}
                onFocus={e => e.target.style.borderColor = "var(--primary)"}
                onBlur={e => e.target.style.borderColor = "var(--line)"}
              />
              <p className="text-[11px] mt-3 leading-relaxed" style={{ color: "var(--ink-mute)" }}>
                Stored in localStorage. Get one at{" "}
                <span className="font-mono" style={{ color: "var(--primary)" }}>console.anthropic.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Two paths */}
        <div className="mb-6 flex items-center gap-3 fade-up" style={{ animationDelay: "0.3s" }}>
          <span className="text-[11px] uppercase tracking-[0.25em] font-mono" style={{ color: "var(--ink-mute)" }}>How would you like to begin?</span>
          <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {/* CREATE PROFILE — primary */}
          <button
            onClick={handleCreate}
            onMouseEnter={() => setHovered("create")}
            onMouseLeave={() => setHovered(null)}
            className="group text-left p-7 rounded-2xl border-2 transition-all hover:-translate-y-1 fade-up relative overflow-hidden"
            style={{
              background: hovered === "create" ? "var(--primary)" : "var(--paper)",
              borderColor: "var(--primary)",
              boxShadow: hovered === "create" ? "var(--shadow-lg)" : "var(--shadow)",
              animationDelay: "0.35s",
            }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{ background: hovered === "create" ? "white" : "var(--primary)" }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus size={18} style={{ color: hovered === "create" ? "white" : "var(--primary)" }} />
                <span className="text-xs uppercase tracking-wider font-mono font-medium" style={{ color: hovered === "create" ? "rgba(255,255,255,0.9)" : "var(--primary-deep)" }}>
                  Recommended
                </span>
              </div>
              <div className="font-serif text-3xl mb-2 leading-tight" style={{ color: hovered === "create" ? "white" : "var(--ink)" }}>
                Create your profile
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: hovered === "create" ? "rgba(255,255,255,0.85)" : "var(--ink-soft)" }}>
                Tell CampusOrbit who you are. We'll match real UMD events, scholarships, and resources to your situation.
              </p>
              <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: hovered === "create" ? "white" : "var(--primary)" }}>
                Start onboarding <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* QUICK START */}
          <div className="p-7 rounded-2xl border fade-up" style={{ background: "var(--paper)", borderColor: "var(--line)", animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} style={{ color: "var(--forest)" }} />
              <span className="text-xs uppercase tracking-wider font-mono font-medium" style={{ color: "var(--forest)" }}>
                Quick demo
              </span>
            </div>
            <div className="font-serif text-3xl mb-2 leading-tight" style={{ color: "var(--ink)" }}>
              Try a sample profile
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ink-soft)" }}>
              Three real-feeling student profiles to demo the system fast.
            </p>
            <div className="space-y-2">
              {Object.values(QUICK_START).map(p => (
                <button
                  key={p.id}
                  onClick={() => handleQuickStart(p.id)}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left"
                  style={{
                    background: hovered === p.id ? "var(--cream-warm)" : "var(--cream)",
                    borderColor: hovered === p.id ? "var(--forest)" : "var(--line)",
                  }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-serif text-xs flex-shrink-0" style={{ background: "var(--forest)", color: "white" }}>
                    {p.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium leading-tight" style={{ color: "var(--ink)" }}>{p.name}</div>
                    <div className="text-[11px] truncate" style={{ color: "var(--ink-mute)" }}>{p.year} · {p.major}</div>
                  </div>
                  <ArrowRight size={13} style={{ color: hovered === p.id ? "var(--forest)" : "var(--ink-mute)" }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs fade-up" style={{ color: "var(--ink-mute)", animationDelay: "0.5s" }}>
          <Sparkles size={12} />
          <span>Powered by Claude Sonnet 4. Your conversations are not stored.</span>
        </div>
      </div>
    </div>
  );
}
