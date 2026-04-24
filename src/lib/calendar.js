// Generate an .ics file for a campus event and trigger download.
// Compatible with Google Calendar, Apple Calendar, Outlook.

const DEMO_DATE = "20260424"; // Friday, April 24, 2026

function pad(n) { return n.toString().padStart(2, "0"); }

function toICSDateTime(timeStr) {
  // timeStr = "HH:MM" -> "20260424T120000"
  const [h, m] = timeStr.split(":");
  return `${DEMO_DATE}T${pad(h)}${pad(m)}00`;
}

function escapeICS(text) {
  return (text || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function generateICS(event) {
  const uid = `campusorbit-${event.id}-${Date.now()}@umd.edu`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CampusOrbit//UMD Hackathon//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toICSDateTime(event.time)}`,
    `DTEND:${toICSDateTime(event.end)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(event.location)}`,
    `DESCRIPTION:${escapeICS(event.desc + (event.perks?.length ? "\n\nPerks: " + event.perks.join(", ") : "") + "\n\nAdded via CampusOrbit")}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    `DESCRIPTION:Reminder: ${escapeICS(event.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return ics;
}

export function downloadICS(event) {
  const ics = generateICS(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]+/gi, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
