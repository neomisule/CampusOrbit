// Quick-start personas (still useful for "demo this fast" scenarios)
export const QUICK_START = {
  priya: {
    id: "priya",
    name: "Priya Sharma",
    initials: "PS",
    year: "Graduate · M.S.",
    major: "Applied Machine Learning",
    status: ["First-gen", "International"],
    pronouns: "she/her",
    interests: ["AI/ML", "research", "career prep", "free food"],
    goals: ["AI/ML Engineer roles at top tech", "research collaborations", "industry network"],
    blurb: "M.S. student, TA for DATA 612, actively job-searching.",
    calendar: [
      { time: "10:00", end: "11:15", title: "DATA 612 — Lecture", type: "class" },
      { time: "13:00", end: "14:00", title: "Office hours (TA)", type: "work" },
      { time: "16:30", end: "17:30", title: "Gym", type: "personal" },
    ],
  },
  marcus: {
    id: "marcus",
    name: "Marcus Reed",
    initials: "MR",
    year: "Undergraduate · Junior",
    major: "Computer Science",
    status: ["First-gen", "Transfer", "Commuter"],
    pronouns: "he/him",
    interests: ["software engineering", "cybersecurity", "free food", "community"],
    goals: ["SWE internship Summer 2026", "build first project portfolio", "find study group"],
    blurb: "Transferred from PG Community College. Works 20hrs/week off-campus.",
    calendar: [
      { time: "09:00", end: "09:50", title: "CMSC 351 — Lecture", type: "class" },
      { time: "11:00", end: "12:15", title: "CMSC 414 — Lecture", type: "class" },
      { time: "17:00", end: "21:00", title: "Shift @ Target", type: "work" },
    ],
  },
  amara: {
    id: "amara",
    name: "Amara Okafor",
    initials: "AO",
    year: "Undergraduate · Sophomore",
    major: "Public Health · pre-med",
    status: ["Low-income", "Single parent"],
    pronouns: "she/her",
    interests: ["health equity", "research", "mentorship", "wellness"],
    goals: ["MCAT prep + medical school", "research assistant role", "manage financial stress"],
    blurb: "Sophomore balancing coursework with parenting a 4-year-old. Pell grant recipient.",
    calendar: [
      { time: "08:00", end: "09:15", title: "BSCI 207 — Lecture", type: "class" },
      { time: "14:00", end: "15:30", title: "Childcare pickup", type: "personal" },
      { time: "18:00", end: "20:00", title: "Study block (home)", type: "personal" },
    ],
  },
};

// Onboarding option lists for custom profile flow
export const ONBOARD_OPTIONS = {
  years: [
    "Freshman", "Sophomore", "Junior", "Senior",
    "Graduate · M.S.", "Graduate · Ph.D.", "Postdoc",
  ],
  statuses: [
    "First-gen", "International", "Transfer", "Commuter",
    "Low-income", "Single parent", "Veteran", "Working full-time",
    "DACA", "Online student",
  ],
  interests: [
    "AI/ML", "software engineering", "cybersecurity", "data science",
    "research", "career prep", "entrepreneurship", "design",
    "health equity", "public policy", "sustainability",
    "arts", "wellness", "community", "mentorship",
    "free food", "international community",
  ],
  goalTemplates: [
    "Land a SWE internship",
    "Get into research",
    "Apply for scholarships",
    "Build a project portfolio",
    "Improve mental health",
    "Make new friends",
    "Find a study group",
    "Prep for grad school",
    "Career switch",
    "Manage financial stress",
  ],
};

export const EVENTS = [
  { id: 1, title: "AI in Healthcare Panel", time: "12:00", end: "13:00", location: "Iribe 0324", tags: ["AI/ML", "research", "career prep", "free food", "health equity", "data science"], desc: "Panel with researchers from UMD Med, Hopkins, NIH. Free lunch.", perks: ["Free lunch", "Networking"] },
  { id: 2, title: "ML Reading Group: LoRA & QLoRA", time: "15:00", end: "16:00", location: "AVW 4172", tags: ["AI/ML", "research", "data science"], desc: "Deep dive on parameter-efficient fine-tuning.", perks: ["Research connections"] },
  { id: 3, title: "Resume Workshop — Tech Track", time: "13:30", end: "14:30", location: "Hornbake Library", tags: ["career prep", "software engineering"], desc: "Career center workshop on technical resumes for SWE/ML roles.", perks: ["1-on-1 reviews"] },
  { id: 4, title: "Painting Night at Stamp", time: "19:00", end: "21:00", location: "Stamp Student Union", tags: ["arts", "wellness", "community"], desc: "Free paint, canvas, snacks. Open to all.", perks: ["Free supplies", "Free snacks"] },
  { id: 5, title: "International Grad Coffee Hour", time: "16:00", end: "17:00", location: "Adele H. Stamp", tags: ["community", "international community", "free food"], desc: "Casual meetup for international graduate students.", perks: ["Free coffee"] },
  { id: 6, title: "NVIDIA Tech Talk: vLLM in Production", time: "18:00", end: "19:30", location: "Iribe Antonov Auditorium", tags: ["AI/ML", "career prep", "software engineering", "free food"], desc: "Engineer from NVIDIA on serving LLMs at scale. Recruiters present.", perks: ["Recruiter access", "Free pizza"] },
  { id: 7, title: "Cybersecurity Capture-the-Flag", time: "12:30", end: "14:30", location: "Iribe 1116", tags: ["software engineering", "cybersecurity", "community"], desc: "Beginner-friendly CTF run by the ACES program.", perks: ["Prizes", "Free snacks"] },
  { id: 8, title: "Pre-Med Research Mixer", time: "11:00", end: "12:30", location: "SPH 1312", tags: ["research", "health equity", "mentorship", "career prep"], desc: "Connect with faculty actively recruiting undergrad RAs.", perks: ["Lab tours", "Free lunch"] },
  { id: 9, title: "Student Parents Lunch & Learn", time: "12:00", end: "13:00", location: "Stamp Family Lounge", tags: ["wellness", "community", "mentorship"], desc: "Resources for student parents — childcare, scheduling, financial aid.", perks: ["Free childcare", "Free lunch"] },
  { id: 10, title: "MCAT Study Group Kickoff", time: "16:00", end: "17:30", location: "McKeldin Library 6107", tags: ["health equity", "mentorship", "wellness"], desc: "Weekly group, mixed levels. Free practice materials provided.", perks: ["Free prep books"] },
  { id: 11, title: "Startup Pitch Night", time: "18:30", end: "20:30", location: "Dingman Center", tags: ["entrepreneurship", "career prep", "community"], desc: "Watch student founders pitch. Free dinner, investors in attendance.", perks: ["Free dinner", "Investor access"] },
  { id: 12, title: "Sustainability Hackathon Info", time: "17:00", end: "18:00", location: "ESJ 1224", tags: ["sustainability", "career prep", "community"], desc: "Learn about the spring sustainability hackathon. $5k prize pool.", perks: ["Prize info"] },
];

export const RESOURCES = [
  { id: "fg-stem", title: "First-Gen STEM Scholarship", category: "Scholarship", amount: "$2,500", deadline: "Nov 14", matchTags: ["first-gen", "STEM"], why: "First-gen + STEM background", action: "Draft application" },
  { id: "intl-grant", title: "International Grad Emergency Grant", category: "Financial", amount: "$1,200", deadline: "Rolling", matchTags: ["international", "graduate"], why: "International graduate students with documented need", action: "Check eligibility" },
  { id: "research-fund", title: "Graduate Research Travel Award", category: "Research", amount: "$800", deadline: "Dec 1", matchTags: ["graduate", "research"], why: "Active research role with publication record", action: "Start application" },
  { id: "career-1on1", title: "ML Career Coach (1-on-1)", category: "Career", amount: "Free", deadline: "Book this week", matchTags: ["career prep", "AI/ML"], why: "Dedicated coach for ML/AI track", action: "Book session" },
  { id: "transfer-mentor", title: "Transfer Student Mentor Program", category: "Mentorship", amount: "Free", deadline: "Open enrollment", matchTags: ["transfer"], why: "Pairs you with a junior/senior who transferred in", action: "Get matched" },
  { id: "swe-internship", title: "CS Department Internship Pipeline", category: "Career", amount: "Stipend $4k+", deadline: "Dec 8", matchTags: ["software engineering", "career prep"], why: "Direct pipeline to partner companies", action: "Apply now" },
  { id: "single-parent", title: "Student Parent Emergency Fund", category: "Financial", amount: "$1,500", deadline: "Rolling", matchTags: ["parent", "low-income", "single parent"], why: "Student parents facing unexpected expenses", action: "Apply" },
  { id: "mcat-fee-waiver", title: "MCAT Fee Assistance Program", category: "Pre-Med", amount: "Up to $300 saved", deadline: "Apply 60 days early", matchTags: ["pre-med", "low-income"], why: "AAMC fee waiver for income-eligible students", action: "Check eligibility" },
  { id: "pantry", title: "Campus Food Pantry", category: "Basic Needs", amount: "Free", deadline: "Open daily 10am–4pm", matchTags: ["any"], why: "Open to all students, no questions asked", action: "Get hours" },
  { id: "tutoring-cs", title: "CS Peer Tutoring (Free)", category: "Academic", amount: "Free", deadline: "Walk-in", matchTags: ["software engineering"], why: "Free peer tutoring for 100/200-level CS", action: "Walk in" },
  { id: "research-pipeline", title: "Pre-Med Research Match Program", category: "Research", amount: "Stipend possible", deadline: "Mar 15", matchTags: ["pre-med", "research"], why: "Faculty-undergrad research pairing program", action: "Submit interest form" },
  { id: "wellness-counseling", title: "Free Counseling Sessions", category: "Wellness", amount: "Free · 8 sessions", deadline: "Walk-in", matchTags: ["wellness", "any"], why: "Free, confidential counseling for all students", action: "Schedule" },
  { id: "entrepreneur-fund", title: "Student Entrepreneur Microgrant", category: "Funding", amount: "$500–$2,000", deadline: "Quarterly", matchTags: ["entrepreneurship"], why: "Seed funding for student-led ventures", action: "Apply" },
  { id: "design-portfolio", title: "Design Portfolio Review", category: "Career", amount: "Free", deadline: "Sign up weekly", matchTags: ["design", "career prep"], why: "Industry mentors review your portfolio", action: "Sign up" },
];

// Build a profile-keys bag from any profile
function buildProfileKeys(profile) {
  const keys = new Set();
  const status = Array.isArray(profile.status) ? profile.status : profile.status.split(", ");

  status.forEach(s => {
    const lower = s.toLowerCase();
    if (lower.includes("first-gen")) keys.add("first-gen");
    if (lower.includes("international")) { keys.add("international"); keys.add("international community"); }
    if (lower.includes("transfer")) keys.add("transfer");
    if (lower.includes("low-income")) keys.add("low-income");
    if (lower.includes("parent")) { keys.add("parent"); keys.add("single parent"); }
    if (lower.includes("commuter")) keys.add("commuter");
    if (lower.includes("veteran")) keys.add("veteran");
  });

  if (profile.year?.toLowerCase().includes("graduate")) keys.add("graduate");

  const major = profile.major?.toLowerCase() || "";
  if (major.includes("machine learning") || major.includes("ml") || major.includes("ai")) {
    keys.add("AI/ML"); keys.add("STEM"); keys.add("research"); keys.add("data science");
  }
  if (major.includes("computer science") || major.includes("cs")) {
    keys.add("software engineering"); keys.add("STEM");
  }
  if (major.includes("data")) { keys.add("data science"); keys.add("STEM"); }
  if (major.includes("public health") || major.includes("pre-med")) {
    keys.add("pre-med"); keys.add("research"); keys.add("health equity");
  }
  if (major.includes("engineering")) keys.add("STEM");
  if (major.includes("business") || major.includes("entrepreneurship")) keys.add("entrepreneurship");
  if (major.includes("design") || major.includes("art")) keys.add("design");

  (profile.interests || []).forEach(i => keys.add(i));
  (profile.goals || []).forEach(g => {
    const lower = g.toLowerCase();
    if (lower.includes("intern") || lower.includes("job") || lower.includes("career")) keys.add("career prep");
    if (lower.includes("research")) keys.add("research");
    if (lower.includes("scholarship") || lower.includes("financ")) keys.add("low-income");
    if (lower.includes("startup") || lower.includes("entrepreneur")) keys.add("entrepreneurship");
  });

  return keys;
}

export function getResourcesForProfile(profile) {
  const keys = buildProfileKeys(profile);
  return RESOURCES
    .map(r => {
      if (r.matchTags.includes("any")) return { ...r, match: 70 };
      const hits = r.matchTags.filter(t => keys.has(t)).length;
      if (hits === 0) return null;
      const match = Math.min(98, 62 + hits * 13 + ((r.id.charCodeAt(0) % 5)));
      return { ...r, match };
    })
    .filter(Boolean)
    .sort((a, b) => b.match - a.match);
}

export function getNudgesForProfile(profile) {
  const keys = buildProfileKeys(profile);
  const nudges = [];

  if (keys.has("first-gen") && keys.has("STEM")) {
    nudges.push({ id: "fg-stem-deadline", type: "deadline", text: "First-Gen STEM Scholarship closes in 3 weeks. Want me to draft your personal statement?", urgency: "soon" });
  }
  if (keys.has("AI/ML") || keys.has("software engineering")) {
    nudges.push({ id: "nvidia-tonight", type: "opportunity", text: "NVIDIA recruiters at tonight's tech talk (6pm, Iribe). Strong fit for your goals.", urgency: "today" });
  }
  if (keys.has("transfer")) {
    nudges.push({ id: "transfer-mentor", type: "support", text: "Transfer Mentor Program is open enrollment — pairs you with someone who's been in your shoes.", urgency: "soon" });
  }
  if (keys.has("parent") || keys.has("single parent")) {
    nudges.push({ id: "parent-lunch", type: "opportunity", text: "Student Parents Lunch & Learn at noon today — free childcare and free lunch.", urgency: "today" });
  }
  if (keys.has("pre-med")) {
    nudges.push({ id: "premed-research", type: "opportunity", text: "Pre-Med Research Mixer at 11am has free childcare and connects you to RA roles.", urgency: "today" });
  }
  if (keys.has("low-income")) {
    nudges.push({ id: "emergency-fund", type: "support", text: "If you're facing an unexpected bill, the Emergency Fund is rolling — usually pays out in 5 days.", urgency: "soon" });
  }
  if (keys.has("entrepreneurship")) {
    nudges.push({ id: "pitch-night", type: "opportunity", text: "Startup Pitch Night tonight at Dingman — investors attending, free dinner.", urgency: "today" });
  }
  if (keys.has("wellness") || nudges.length < 3) {
    nudges.push({ id: "wellness-paint", type: "wellness", text: "Painting Night at Stamp — easy, low-stakes, free supplies. Good for a busy week.", urgency: "low" });
  }

  return nudges.slice(0, 4);
}
