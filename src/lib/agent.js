import { EVENTS } from "../data/seed.js";

// File -> base64 (strip the data:...;base64, prefix)
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const comma = result.indexOf(",");
      resolve(result.slice(comma + 1));
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

// Decide which Anthropic content block type to use for a file
function getContentBlockForFile(file, base64) {
  const type = file.type;
  if (type.startsWith("image/")) {
    return {
      type: "image",
      source: { type: "base64", media_type: type, data: base64 },
    };
  }
  if (type === "application/pdf") {
    return {
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: base64 },
    };
  }
  // Unsupported — caller should filter beforehand, but safe fallback
  return null;
}

export async function askAgent({ apiKey, profile, calendar, resources, userMessage, history, attachments = [] }) {
  const status = Array.isArray(profile.status) ? profile.status.join(", ") : profile.status;
  const systemPrompt = `You are CampusOrbit, a personalized AI campus agent for ${profile.name}, ${profile.year} in ${profile.major} at the University of Maryland. You know them completely and give specific, actionable answers — never generic advice.

STUDENT PROFILE
- Status: ${status}
- Pronouns: ${profile.pronouns || "they/them"}
- Interests: ${profile.interests.join(", ")}
- Goals: ${profile.goals.join(", ")}
${profile.blurb ? `- Context: ${profile.blurb}` : ""}

TODAY'S CALENDAR (already booked — do NOT recommend conflicts on top of list)
${calendar.map(c => `- ${c.time}–${c.end}: ${c.title}`).join("\n")}

CAMPUS EVENTS TODAY (full list)
${EVENTS.map(e => `- [#${e.id}] ${e.time}–${e.end} | ${e.title} @ ${e.location} | tags: ${e.tags.join(", ")} | ${e.desc}${e.perks?.length ? ` | perks: ${e.perks.join(", ")}` : ""}`).join("\n")}

RESOURCES MATCHED TO THIS STUDENT
${resources.map(r => `- ${r.title} (${r.category}, ${r.amount}, deadline: ${r.deadline}, match: ${r.match}%) — ${r.why}`).join("\n")}

RULES
1. When asked about events, ALWAYS check the calendar first. Rank: (a) no conflict + interest match at top, (b) partial conflict next, (c) full conflicts last. Explicitly call out conflicts.
2. Be specific. Use real event names, times, locations, dollar amounts, deadlines. Never say "check the website."
3. When the student mentions stress, struggle, or a problem — diagnose what resources apply and give a 2–4 step action plan.
4. When drafting emails or applications, use their actual profile details (name, major, status).
5. Be warm but direct. They prefer specific guidance over cheerleading.
6. Keep replies tight — under 200 words unless drafting a doc or analyzing an attachment. Use tight paragraphs and short bulleted lists where helpful.
7. End with one concrete next action they can do in 5 minutes.
8. If recommending an event, mention they can add it to their calendar with the "Add" button on that event card.
9. If the user attaches a file (resume, scholarship PDF, screenshot), analyze it specifically against THIS student's profile, goals, and matched resources. Be specific about what to change, what they qualify for, what's strong, what's weak.

FORMATTING
- Use **bold** for key terms, deadlines, dollar amounts.
- Use bulleted lists ("- item") for 3+ parallel items.
- Use ## headings only when the response has clear distinct sections.
- Avoid heavy nesting. Keep it readable.`;

  // Build the user message — text + any attachments as content blocks
  let userContent;
  if (attachments.length > 0) {
    const fileBlocks = await Promise.all(
      attachments.map(async (att) => {
        const block = getContentBlockForFile(att.file, att.base64);
        return block;
      })
    );
    const validBlocks = fileBlocks.filter(Boolean);
    userContent = [
      ...validBlocks,
      { type: "text", text: userMessage || "Please review the attached file(s) in light of my profile and goals." },
    ];
  } else {
    userContent = userMessage;
  }

  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userContent },
  ];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
}
