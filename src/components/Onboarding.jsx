import React, { useState } from "react";
import { ONBOARD_OPTIONS } from "../data/seed.js";
import { ArrowRight, ArrowLeft, Check, Plus, X, Calendar as CalIcon } from "lucide-react";

const STEPS = ["identity", "academic", "context", "interests", "goals", "calendar"];

export default function Onboarding({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name: "",
    pronouns: "",
    year: "",
    major: "",
    status: [],
    interests: [],
    goals: [],
    calendar: [
      { time: "10:00", end: "11:15", title: "", type: "class" },
    ],
  });

  function update(field, value) {
    setProfile(p => ({ ...p, [field]: value }));
  }

  function toggle(field, value) {
    setProfile(p => ({
      ...p,
      [field]: p[field].includes(value)
        ? p[field].filter(v => v !== value)
        : [...p[field], value],
    }));
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else finalize();
  }

  function back() {
    if (step > 0) setStep(step - 1);
    else onBack();
  }

  function canAdvance() {
    switch (STEPS[step]) {
      case "identity": return profile.name.trim().length > 0;
      case "academic": return profile.year && profile.major.trim().length > 0;
      case "context": return true; // status is optional
      case "interests": return profile.interests.length > 0;
      case "goals": return profile.goals.length > 0;
      case "calendar": return true;
      default: return true;
    }
  }

  function finalize() {
    const initials = profile.name
      .split(" ")
      .map(w => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ME";

    const finalProfile = {
      ...profile,
      id: "custom",
      initials,
      blurb: profile.status.length > 0 ? `${profile.year} · ${profile.status.join(", ")}` : profile.year,
      // Filter out empty calendar entries
      calendar: profile.calendar.filter(c => c.title.trim().length > 0),
    };
    onComplete(finalProfile);
  }

  const stepName = STEPS[step];

  return (
    <div className="min-h-screen w-full relative">
      {/* Decorative orbits */}
      <div className="absolute top-32 right-[-80px] w-72 h-72 rounded-full border opacity-15 orbit-spin" style={{ borderColor: "var(--primary)" }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <button onClick={back} className="text-sm flex items-center gap-1.5 hover:opacity-70 transition-opacity" style={{ color: "var(--ink-soft)" }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="h-1 rounded-full transition-all"
                style={{
                  width: i === step ? "32px" : "16px",
                  background: i <= step ? "var(--primary)" : "var(--line-strong)",
                }}
              />
            ))}
          </div>
        </div>

        {/* IDENTITY */}
        {stepName === "identity" && (
          <div className="fade-up">
            <div className="text-[11px] uppercase tracking-[0.25em] mb-4 font-mono" style={{ color: "var(--primary)" }}>
              Step 1 of {STEPS.length}
            </div>
            <h1 className="font-serif text-5xl mb-3 leading-tight" style={{ color: "var(--ink)" }}>
              Hi, I'm CampusOrbit.<br />
              <em style={{ color: "var(--primary)" }}>What should I call you?</em>
            </h1>
            <p className="text-base mb-10" style={{ color: "var(--ink-soft)" }}>
              I'll personalize everything based on what you tell me. None of this leaves your browser.
            </p>

            <div className="space-y-5">
              <Field label="Your name">
                <input
                  autoFocus
                  type="text"
                  value={profile.name}
                  onChange={e => update("name", e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none text-lg transition-colors"
                  style={{ background: "var(--paper)", borderColor: "var(--line)", color: "var(--ink)" }}
                  onFocus={e => e.target.style.borderColor = "var(--primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--line)"}
                />
              </Field>
              <Field label="Pronouns (optional)">
                <div className="flex gap-2 flex-wrap">
                  {["she/her", "he/him", "they/them", "she/they", "he/they"].map(p => (
                    <Chip
                      key={p}
                      active={profile.pronouns === p}
                      onClick={() => update("pronouns", profile.pronouns === p ? "" : p)}
                    >
                      {p}
                    </Chip>
                  ))}
                </div>
              </Field>
            </div>
          </div>
        )}

        {/* ACADEMIC */}
        {stepName === "academic" && (
          <div className="fade-up">
            <div className="text-[11px] uppercase tracking-[0.25em] mb-4 font-mono" style={{ color: "var(--primary)" }}>
              Step 2 of {STEPS.length}
            </div>
            <h1 className="font-serif text-5xl mb-3 leading-tight" style={{ color: "var(--ink)" }}>
              Where are you in your <em style={{ color: "var(--primary)" }}>journey?</em>
            </h1>
            <p className="text-base mb-10" style={{ color: "var(--ink-soft)" }}>Year and major help me filter what's relevant.</p>

            <div className="space-y-6">
              <Field label="Year">
                <div className="flex gap-2 flex-wrap">
                  {ONBOARD_OPTIONS.years.map(y => (
                    <Chip key={y} active={profile.year === y} onClick={() => update("year", y)}>{y}</Chip>
                  ))}
                </div>
              </Field>
              <Field label="Major / Program">
                <input
                  type="text"
                  value={profile.major}
                  onChange={e => update("major", e.target.value)}
                  placeholder="e.g. Computer Science, Public Health, Business..."
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none text-lg transition-colors"
                  style={{ background: "var(--paper)", borderColor: "var(--line)", color: "var(--ink)" }}
                  onFocus={e => e.target.style.borderColor = "var(--primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--line)"}
                />
              </Field>
            </div>
          </div>
        )}

        {/* CONTEXT */}
        {stepName === "context" && (
          <div className="fade-up">
            <div className="text-[11px] uppercase tracking-[0.25em] mb-4 font-mono" style={{ color: "var(--primary)" }}>
              Step 3 of {STEPS.length}
            </div>
            <h1 className="font-serif text-5xl mb-3 leading-tight" style={{ color: "var(--ink)" }}>
              Anything I should <em style={{ color: "var(--primary)" }}>know about</em> your situation?
            </h1>
            <p className="text-base mb-10" style={{ color: "var(--ink-soft)" }}>
              Optional. Tap any that apply — I'll surface scholarships, grants, and resources you qualify for.
            </p>
            <div className="flex gap-2 flex-wrap">
              {ONBOARD_OPTIONS.statuses.map(s => (
                <Chip key={s} active={profile.status.includes(s)} onClick={() => toggle("status", s)}>{s}</Chip>
              ))}
            </div>
          </div>
        )}

        {/* INTERESTS */}
        {stepName === "interests" && (
          <div className="fade-up">
            <div className="text-[11px] uppercase tracking-[0.25em] mb-4 font-mono" style={{ color: "var(--primary)" }}>
              Step 4 of {STEPS.length}
            </div>
            <h1 className="font-serif text-5xl mb-3 leading-tight" style={{ color: "var(--ink)" }}>
              What are you <em style={{ color: "var(--primary)" }}>into?</em>
            </h1>
            <p className="text-base mb-10" style={{ color: "var(--ink-soft)" }}>Pick at least one. The more you pick, the better I match events to you.</p>
            <div className="flex gap-2 flex-wrap">
              {ONBOARD_OPTIONS.interests.map(i => (
                <Chip key={i} active={profile.interests.includes(i)} onClick={() => toggle("interests", i)}>{i}</Chip>
              ))}
            </div>
          </div>
        )}

        {/* GOALS */}
        {stepName === "goals" && (
          <div className="fade-up">
            <div className="text-[11px] uppercase tracking-[0.25em] mb-4 font-mono" style={{ color: "var(--primary)" }}>
              Step 5 of {STEPS.length}
            </div>
            <h1 className="font-serif text-5xl mb-3 leading-tight" style={{ color: "var(--ink)" }}>
              What are you <em style={{ color: "var(--primary)" }}>working toward?</em>
            </h1>
            <p className="text-base mb-10" style={{ color: "var(--ink-soft)" }}>Pick from common goals or write your own.</p>
            <div className="flex gap-2 flex-wrap mb-6">
              {ONBOARD_OPTIONS.goalTemplates.map(g => (
                <Chip key={g} active={profile.goals.includes(g)} onClick={() => toggle("goals", g)}>{g}</Chip>
              ))}
            </div>
            <Field label="Add your own goal">
              <CustomGoalInput onAdd={(g) => update("goals", [...profile.goals, g])} />
            </Field>
            {profile.goals.filter(g => !ONBOARD_OPTIONS.goalTemplates.includes(g)).length > 0 && (
              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-wider font-mono mb-2" style={{ color: "var(--ink-mute)" }}>Your custom goals</div>
                <div className="flex gap-2 flex-wrap">
                  {profile.goals.filter(g => !ONBOARD_OPTIONS.goalTemplates.includes(g)).map(g => (
                    <span key={g} className="text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ background: "var(--primary-soft)", color: "var(--primary-deep)" }}>
                      {g}
                      <button onClick={() => update("goals", profile.goals.filter(x => x !== g))}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CALENDAR */}
        {stepName === "calendar" && (
          <div className="fade-up">
            <div className="text-[11px] uppercase tracking-[0.25em] mb-4 font-mono" style={{ color: "var(--primary)" }}>
              Step 6 of {STEPS.length}
            </div>
            <h1 className="font-serif text-5xl mb-3 leading-tight" style={{ color: "var(--ink)" }}>
              What does your <em style={{ color: "var(--primary)" }}>day</em> look like?
            </h1>
            <p className="text-base mb-8" style={{ color: "var(--ink-soft)" }}>
              Add your classes, work, and commitments. I'll rank events around your real availability.
            </p>

            <div className="space-y-3 mb-4">
              {profile.calendar.map((slot, i) => (
                <CalendarRow
                  key={i}
                  slot={slot}
                  onChange={(updates) => {
                    const newCal = [...profile.calendar];
                    newCal[i] = { ...slot, ...updates };
                    update("calendar", newCal);
                  }}
                  onRemove={() => update("calendar", profile.calendar.filter((_, j) => j !== i))}
                  removable={profile.calendar.length > 1}
                />
              ))}
            </div>

            <button
              onClick={() => update("calendar", [...profile.calendar, { time: "12:00", end: "13:00", title: "", type: "class" }])}
              className="w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:bg-white"
              style={{ borderColor: "var(--line-strong)", color: "var(--ink-soft)" }}
            >
              <Plus size={14} /> Add another commitment
            </button>

            <div className="mt-4 text-xs italic" style={{ color: "var(--ink-mute)" }}>
              <CalIcon size={11} className="inline mr-1" />
              You can add more later. Empty entries are skipped.
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={back}
            className="text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            style={{ color: "var(--ink-soft)" }}
          >
            ← Back
          </button>
          <button
            onClick={next}
            disabled={!canAdvance()}
            className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5"
            style={{ background: "var(--primary)", color: "white", boxShadow: canAdvance() ? "var(--shadow)" : "none" }}
          >
            {step === STEPS.length - 1 ? "Enter CampusOrbit" : "Continue"}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider font-mono mb-2" style={{ color: "var(--ink-mute)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-2 rounded-full text-sm transition-all border"
      style={
        active
          ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" }
          : { background: "var(--paper)", color: "var(--ink-soft)", borderColor: "var(--line-strong)" }
      }
    >
      {active && <Check size={11} className="inline mr-1 -mt-0.5" />}
      {children}
    </button>
  );
}

function CustomGoalInput({ onAdd }) {
  const [value, setValue] = useState("");
  function submit() {
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  }
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        placeholder="e.g. Get into a top ML PhD program"
        className="flex-1 px-4 py-2.5 rounded-xl border-2 outline-none transition-colors"
        style={{ background: "var(--paper)", borderColor: "var(--line)", color: "var(--ink)" }}
        onFocus={e => e.target.style.borderColor = "var(--primary)"}
        onBlur={e => e.target.style.borderColor = "var(--line)"}
      />
      <button onClick={submit} className="px-4 rounded-xl text-sm font-medium" style={{ background: "var(--ink)", color: "white" }}>
        Add
      </button>
    </div>
  );
}

function CalendarRow({ slot, onChange, onRemove, removable }) {
  const colorMap = {
    class: "var(--forest)",
    work: "var(--primary)",
    personal: "var(--rose)",
  };
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ background: "var(--paper)", borderColor: "var(--line)" }}>
      <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: colorMap[slot.type] }} />
      <input
        type="time"
        value={slot.time}
        onChange={e => onChange({ time: e.target.value })}
        className="font-mono text-sm px-2 py-1.5 rounded border outline-none"
        style={{ background: "var(--cream)", borderColor: "var(--line)", color: "var(--ink)" }}
      />
      <span className="text-xs" style={{ color: "var(--ink-mute)" }}>→</span>
      <input
        type="time"
        value={slot.end}
        onChange={e => onChange({ end: e.target.value })}
        className="font-mono text-sm px-2 py-1.5 rounded border outline-none"
        style={{ background: "var(--cream)", borderColor: "var(--line)", color: "var(--ink)" }}
      />
      <input
        type="text"
        value={slot.title}
        onChange={e => onChange({ title: e.target.value })}
        placeholder="What's this? (e.g. CMSC 351 lecture)"
        className="flex-1 text-sm px-2 py-1.5 rounded border outline-none"
        style={{ background: "var(--cream)", borderColor: "var(--line)", color: "var(--ink)" }}
      />
      <select
        value={slot.type}
        onChange={e => onChange({ type: e.target.value })}
        className="text-xs px-2 py-1.5 rounded border outline-none"
        style={{ background: "var(--cream)", borderColor: "var(--line)", color: "var(--ink)" }}
      >
        <option value="class">Class</option>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
      </select>
      {removable && (
        <button onClick={onRemove} className="text-xs p-1.5 rounded hover:bg-red-50 transition-colors" style={{ color: "var(--ink-mute)" }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
