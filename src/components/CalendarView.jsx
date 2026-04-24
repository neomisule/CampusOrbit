import React from "react";
import { Clock, MapPin, Briefcase, GraduationCap, Heart, Sparkles, Trash2 } from "lucide-react";

// Show today's schedule as a visual timeline (8am – 10pm)
export default function CalendarView({ calendar, onRemoveAdded, onAddDemo }) {
  const startHour = 8;
  const endHour = 22;
  const totalMinutes = (endHour - startHour) * 60;

  function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function eventStyle(event) {
    const start = Math.max(0, timeToMinutes(event.time) - startHour * 60);
    const end = Math.min(totalMinutes, timeToMinutes(event.end) - startHour * 60);
    const duration = end - start;
    return {
      top: `${(start / totalMinutes) * 100}%`,
      height: `${(duration / totalMinutes) * 100}%`,
    };
  }

  function typeColor(type) {
    switch (type) {
      case "class": return { bg: "var(--forest-soft)", border: "var(--forest)", text: "var(--forest)" };
      case "work": return { bg: "var(--primary-soft)", border: "var(--primary)", text: "var(--primary-deep)" };
      case "personal": return { bg: "var(--rose-soft)", border: "var(--rose)", text: "var(--rose)" };
      case "campus-event": return { bg: "var(--honey-soft)", border: "var(--honey)", text: "var(--primary-deep)" };
      default: return { bg: "var(--cream-warm)", border: "var(--line-strong)", text: "var(--ink-soft)" };
    }
  }

  function typeIcon(type) {
    switch (type) {
      case "class": return GraduationCap;
      case "work": return Briefcase;
      case "personal": return Heart;
      case "campus-event": return Sparkles;
      default: return Clock;
    }
  }

  // Generate hour grid lines
  const hours = [];
  for (let h = startHour; h <= endHour; h++) {
    hours.push(h);
  }

  // Sort events by start time
  const sorted = [...calendar].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  // Current time indicator (use 11:42 AM as "now" for the demo)
  const nowMinutes = 11 * 60 + 42 - startHour * 60;
  const nowPct = (nowMinutes / totalMinutes) * 100;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--line)", background: "var(--paper-tint)" }}>
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] font-mono mb-0.5" style={{ color: "var(--ink-mute)" }}>
            Your day · April 24
          </div>
          <div className="font-serif text-xl leading-none" style={{ color: "var(--ink)" }}>
            <em>{calendar.length}</em> commitment{calendar.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Legend color="var(--forest)" label="Class" />
          <Legend color="var(--primary)" label="Work" />
          <Legend color="var(--rose)" label="Personal" />
          <Legend color="var(--honey)" label="Campus" />
        </div>
      </div>

      {/* Timeline */}
      <div className="flex" style={{ height: "440px" }}>
        {/* Hour gutter */}
        <div className="relative w-12 flex-shrink-0 border-r" style={{ borderColor: "var(--line-soft)" }}>
          {hours.map(h => {
            const top = ((h - startHour) * 60 / totalMinutes) * 100;
            const display = h === 12 ? "12p" : h > 12 ? `${h - 12}p` : `${h}a`;
            return (
              <div
                key={h}
                className="absolute left-0 right-0 text-[10px] font-mono pl-2 pt-0.5"
                style={{ top: `${top}%`, color: "var(--ink-mute)" }}
              >
                {display}
              </div>
            );
          })}
        </div>

        {/* Events area */}
        <div className="relative flex-1">
          {/* Hour grid lines */}
          {hours.map(h => {
            const top = ((h - startHour) * 60 / totalMinutes) * 100;
            return (
              <div
                key={h}
                className="absolute left-0 right-0 border-t"
                style={{ top: `${top}%`, borderColor: "var(--line-soft)" }}
              />
            );
          })}

          {/* Now indicator */}
          {nowPct >= 0 && nowPct <= 100 && (
            <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: `${nowPct}%` }}>
              <div className="relative">
                <div className="absolute left-[-4px] top-[-4px] w-2 h-2 rounded-full pulse-soft" style={{ background: "var(--primary)" }} />
                <div className="border-t-2" style={{ borderColor: "var(--primary)", borderStyle: "dashed" }} />
                <div className="absolute right-1 top-[-7px] text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "var(--primary)", color: "white" }}>
                  NOW
                </div>
              </div>
            </div>
          )}

          {/* Events */}
          {sorted.map((e, i) => {
            const colors = typeColor(e.type);
            const Icon = typeIcon(e.type);
            const isAdded = e.type === "campus-event";
            return (
              <div
                key={i}
                className="absolute left-1 right-1 rounded-lg px-2.5 py-1.5 group fade-in border-l-[3px]"
                style={{
                  ...eventStyle(e),
                  background: colors.bg,
                  border: `1px solid ${colors.border}40`,
                  borderLeftWidth: "3px",
                  borderLeftColor: colors.border,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div className="flex items-start justify-between gap-1 h-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider opacity-80" style={{ color: colors.text }}>
                      <Icon size={9} />
                      <span>{e.time} – {e.end}</span>
                    </div>
                    <div className="text-[12px] font-medium leading-tight mt-0.5 truncate" style={{ color: colors.text }}>
                      {e.title}
                    </div>
                    {e.location && timeToMinutes(e.end) - timeToMinutes(e.time) >= 60 && (
                      <div className="text-[10px] mt-0.5 flex items-center gap-0.5 opacity-70 truncate" style={{ color: colors.text }}>
                        <MapPin size={8} /> {e.location}
                      </div>
                    )}
                  </div>
                  {isAdded && onRemoveAdded && (
                    <button
                      onClick={() => onRemoveAdded(e.eventId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-0.5 rounded hover:bg-white/50"
                      title="Remove from calendar"
                    >
                      <Trash2 size={10} style={{ color: colors.text }} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="text-sm font-serif italic mb-1" style={{ color: "var(--ink-soft)" }}>Nothing on your calendar yet.</div>
                <div className="text-xs" style={{ color: "var(--ink-mute)" }}>Add an event from the "Today" panel to see it here.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--ink-mute)" }}>
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}
