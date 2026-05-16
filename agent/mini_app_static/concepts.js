const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

try {
  tg?.setHeaderColor?.("#050507");
  tg?.setBackgroundColor?.("#050507");
  tg?.setBottomBarColor?.("#050507");
} catch {
  // Telegram client capabilities vary by version.
}

const params = new URLSearchParams(window.location.search);
if (params.get("dev") === "1") localStorage.buxMiniAppDev = "1";
const initData = tg?.initData || (localStorage.buxMiniAppDev === "1" ? "dev" : "");
const app = document.querySelector("#app");
const toastEl = document.querySelector("#toast");
const STORE_KEY = "buxMiniAppConceptLab:v4";

const CONCEPTS = [
  {
    id: 1,
    slug: "clean",
    name: "Clean Reel",
    score: "best base",
    line: "TikTok-style vertical cards with media first, copy separated, and large buttons.",
  },
  {
    id: 2,
    slug: "image",
    name: "Image Tap",
    score: "media first",
    line: "Tap the image to hide all explanation. Tap again when you want the decision layer.",
  },
  {
    id: 3,
    slug: "dock",
    name: "Button Dock",
    score: "long labels",
    line: "Persistent center buttons for real generated labels like Send draft A or Monitor every 30 min.",
  },
  {
    id: 4,
    slug: "drafts",
    name: "Draft Swipe",
    score: "variants",
    line: "Swipe sideways inside a card for summary, context, drafts, and feedback while buttons stay visible.",
  },
  {
    id: 5,
    slug: "stories",
    name: "Story Reel",
    score: "click through",
    line: "A social story lane with category rings and the same fast vertical card loop.",
  },
  {
    id: 6,
    slug: "xp",
    name: "XP Reel",
    score: "gamified",
    line: "Accepting useful work earns momentum points and keeps the feed playful without hiding the task.",
  },
  {
    id: 7,
    slug: "map",
    name: "Goal Map",
    score: "overview",
    line: "A compact goal-sector map explains what is open before you dive into the reel.",
  },
  {
    id: 8,
    slug: "zero",
    name: "Inbox Zero",
    score: "fast clearing",
    line: "A stricter approve/skip loop for clearing many cards with one-thumb controls.",
  },
  {
    id: 9,
    slug: "poster",
    name: "No Image Reel",
    score: "fallback",
    line: "Shows how the feed behaves when the agent has no image at all: clean generated posters.",
  },
  {
    id: 10,
    slug: "ops",
    name: "Agent OS Reel",
    score: "control",
    line: "The same reel wrapped in goal, permission, and cadence controls instead of a chatbot.",
  },
];

const DEMO_CARDS = [
  {
    id: "demo-gmail",
    title: "Draft replies for the three people waiting on you",
    why: "A fast inbox sweep can turn vague guilt into approval-ready reply cards.",
    source: "miniapp-demo:gmail",
    source_label: "Gmail",
    importance: "high",
    buttons: ["Draft all replies", "Show only VIPs", "Monitor every 30 min"],
    blocks: [
      { title: "Draft all replies", body: "Find unanswered threads, draft short replies, and ask before sending." },
      { title: "Show only VIPs", body: "Filter for investors, customers, teammates, and named high-value contacts." },
      { title: "Monitor every 30 min", body: "Create a quiet inbox loop that only interrupts for concrete decisions." },
    ],
    image_text: "GMAIL\n3 replies",
    category: "inbox",
  },
  {
    id: "demo-slack",
    title: "Find who is blocked on you in Slack",
    why: "The agent can scan mentions, DMs, and hot channels, then produce a tiny unblock list.",
    source: "miniapp-demo:slack",
    source_label: "Slack",
    importance: "high",
    buttons: ["Find blockers", "Draft answers", "Daily digest"],
    blocks: [
      { title: "Find blockers", body: "Name the person, channel, and exact ask before creating a card." },
      { title: "Draft answers", body: "Prepare concise replies for review instead of sending anything visible." },
      { title: "Daily digest", body: "Schedule a short Slack brief that ignores noisy chatter." },
    ],
    image_text: "SLACK\nunblock",
    category: "people",
  },
  {
    id: "demo-github",
    title: "Watch the risky PR until CI is green",
    why: "Turn review requests and failing checks into a single ship-or-fix card.",
    source: "miniapp-demo:github",
    source_label: "GitHub",
    importance: "med",
    buttons: ["Watch CI", "Review diff", "Tell me when green"],
    blocks: [
      { title: "Watch CI", body: "Track checks and only interrupt for failures or merge readiness." },
      { title: "Review diff", body: "Summarize risky files, missing tests, and likely regressions." },
      { title: "Tell me when green", body: "Send one card when the branch is safe to merge." },
    ],
    image_text: "GITHUB\nship",
    category: "code",
  },
  {
    id: "demo-growth",
    title: "Find five warm distribution openings",
    why: "The feed should discover real people, posts, launches, and replies worth acting on.",
    source: "miniapp-demo:growth",
    source_label: "Growth",
    importance: "high",
    buttons: ["Find openings", "Draft outreach", "Make launch list"],
    blocks: [
      { title: "Find openings", body: "Search connected context for named people and channels with active intent." },
      { title: "Draft outreach", body: "Prepare short variants that feel specific, not generic." },
      { title: "Make launch list", body: "Build the next ten places worth posting or following up." },
    ],
    image_text: "GROWTH\nopenings",
    category: "growth",
  },
  {
    id: "demo-customers",
    title: "Spot customers who might churn this week",
    why: "Look for slow replies, unresolved bugs, usage drops, and frustrated messages.",
    source: "miniapp-demo:customers",
    source_label: "Customers",
    importance: "high",
    buttons: ["Start radar", "Find churn risk", "Draft save plan"],
    blocks: [
      { title: "Start radar", body: "Scan support, email, Slack, CRM notes, and product signals." },
      { title: "Find churn risk", body: "Name the customer, symptom, and next recovery move." },
      { title: "Draft save plan", body: "Create an approval card with the safest next contact." },
    ],
    image_text: "CUSTOMERS\nradar",
    category: "customer",
  },
  {
    id: "demo-calendar",
    title: "Prep your next meeting like a chief of staff",
    why: "A meeting card should include people, context, decisions, and suggested questions.",
    source: "miniapp-demo:calendar",
    source_label: "Calendar",
    importance: "med",
    buttons: ["Prep next meeting", "Find last context", "Daily agenda"],
    blocks: [
      { title: "Prep next meeting", body: "Gather attendees, prior threads, docs, and open decisions." },
      { title: "Find last context", body: "Recover the last relevant exchange before the meeting starts." },
      { title: "Daily agenda", body: "Summarize only meetings where prep changes the outcome." },
    ],
    image_text: "CALENDAR\nready",
    category: "calendar",
  },
  {
    id: "demo-brief",
    title: "Create a 9am startup command brief",
    why: "One daily digest for metrics, blockers, launches, risky PRs, and customer fires.",
    source: "miniapp-demo:brief",
    source_label: "Daily Brief",
    importance: "med",
    buttons: ["Set 9am brief", "Show sample", "Pick sources"],
    blocks: [
      { title: "Set 9am brief", body: "Schedule a PT morning brief that creates cards, not a wall of text." },
      { title: "Show sample", body: "Preview money, users, bugs, shipping, people, and risks." },
      { title: "Pick sources", body: "Choose Gmail, Slack, GitHub, Linear, Calendar, analytics, or docs." },
    ],
    image_text: "9AM\nbrief",
    category: "ops",
  },
  {
    id: "demo-quality",
    title: "Turn bugs and flaky checks into a fix queue",
    why: "The best monitoring card names the failure, likely cause, and next safe action.",
    source: "miniapp-demo:quality",
    source_label: "Quality",
    importance: "med",
    buttons: ["Find next fix", "Watch failures", "Make bug queue"],
    blocks: [
      { title: "Find next fix", body: "Inspect failing tests, bug reports, incidents, and noisy alerts." },
      { title: "Watch failures", body: "Keep a recurring monitor quiet until something materially changes." },
      { title: "Make bug queue", body: "Rank concrete bugs by user pain and shipping risk." },
    ],
    image_text: "BUGS\nfix queue",
    category: "quality",
  },
  {
    id: "demo-focus",
    title: "Protect two hours of deep work",
    why: "Batch low-value replies and only interrupt for named blockers or customer escalations.",
    source: "miniapp-demo:focus",
    source_label: "Focus",
    importance: "low",
    buttons: ["Start focus block", "Batch replies", "Only urgent"],
    blocks: [
      { title: "Start focus block", body: "Ask for the window, then quietly watch incoming surfaces." },
      { title: "Batch replies", body: "Draft low-risk replies for later approval." },
      { title: "Only urgent", body: "Interrupt only for named blockers, production issues, or time-sensitive decisions." },
    ],
    image_text: "FOCUS\n2 hours",
    category: "focus",
  },
  {
    id: "demo-launch",
    title: "Run a launch from idea to reaction follow-up",
    why: "Launch cards should handle copy, checklists, posting, monitoring, and the next reply.",
    source: "miniapp-demo:launch",
    source_label: "Launch",
    importance: "high",
    buttons: ["Plan launch", "Draft copy", "Watch reactions"],
    blocks: [
      { title: "Plan launch", body: "Make a visible checklist with channels, assets, blockers, and approvals." },
      { title: "Draft copy", body: "Prepare short variants for X, LinkedIn, email, community, and customer follow-up." },
      { title: "Watch reactions", body: "Turn replies, mentions, signups, and support issues into cards." },
    ],
    image_text: "LAUNCH\nmake noise",
    category: "launch",
  },
];

const CATEGORY_META = {
  inbox: { label: "Inbox", short: "IN", color: "#ff4d6d" },
  people: { label: "People", short: "DM", color: "#22c55e" },
  code: { label: "Code", short: "PR", color: "#38bdf8" },
  growth: { label: "Growth", short: "GR", color: "#f59e0b" },
  customer: { label: "Customers", short: "CU", color: "#f97316" },
  calendar: { label: "Calendar", short: "CA", color: "#a78bfa" },
  ops: { label: "Ops", short: "OP", color: "#14b8a6" },
  quality: { label: "Quality", short: "QA", color: "#ef4444" },
  focus: { label: "Focus", short: "FO", color: "#64748b" },
  launch: { label: "Launch", short: "LA", color: "#ec4899" },
};

const PANEL_ORDER = ["summary", "context", "drafts", "feedback"];

const state = {
  cards: [],
  goals: [],
  topics: [],
  stats: {},
  activity: [],
  me: { settings: {} },
  conceptId: conceptIdFromPath(),
  selected: {},
  focusCardId: null,
  apiOnline: false,
  apiError: "",
  local: loadLocalState(),
};

function conceptIdFromPath() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const match = path.match(/(?:mini[-_]?app|miniapp)[-/]?(\d{1,2})$/i);
  if (!match) return 0;
  const value = Number(match[1]);
  return value >= 1 && value <= 10 ? value : 0;
}

function conceptPath(id) {
  const suffix = params.get("dev") === "1" || localStorage.buxMiniAppDev === "1" ? "?dev=1" : "";
  return `/mini-app-${id}${suffix}`;
}

function hubPath() {
  return `/mini-apps${params.get("dev") === "1" || localStorage.buxMiniAppDev === "1" ? "?dev=1" : ""}`;
}

function loadLocalState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    return {
      decisions: parsed.decisions || {},
      cards: Array.isArray(parsed.cards) ? parsed.cards : [],
      notes: parsed.notes || {},
      panels: parsed.panels || {},
      mediaOnly: parsed.mediaOnly || {},
      points: Number(parsed.points || 0),
    };
  } catch {
    return { decisions: {}, cards: [], notes: {}, panels: {}, mediaOnly: {}, points: 0 };
  }
}

function saveLocalState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state.local));
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-Init-Data": initData,
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
  return body;
}

async function refresh() {
  try {
    const [goals, topics, cards, stats, activity, me] = await Promise.all([
      api("/api/goals"),
      api("/api/topics"),
      api("/api/cards"),
      api("/api/stats"),
      api("/api/activity"),
      api("/api/me"),
    ]);
    state.apiOnline = true;
    state.apiError = "";
    state.goals = goals.goals || [];
    state.topics = topics.topics || [];
    state.stats = stats.stats || {};
    state.activity = activity.activity || [];
    state.me = me || { settings: {} };
    state.cards = mergeCards(cards.cards || []);
  } catch (error) {
    state.apiOnline = false;
    state.apiError = error.message || "API unavailable";
    state.goals = [];
    state.topics = [];
    state.stats = { open: 10, done: Object.keys(state.local.decisions).length };
    state.activity = localActivity();
    state.cards = mergeCards([]);
  }
  if (!state.focusCardId || !state.cards.some((card) => String(card.id) === String(state.focusCardId))) {
    state.focusCardId = activeCards(1)[0]?.id || state.cards[0]?.id || null;
  }
  render();
}

function mergeCards(apiCards) {
  const normalized = apiCards.map((card) => normalizeCard(card, false));
  const existingSources = new Set(normalized.map((card) => card.source));
  const generated = state.local.cards.map((card) => normalizeCard(card, true));
  const generatedIds = new Set(generated.map((card) => String(card.id)));
  const needed = Math.max(0, 10 - normalized.length - generated.length);
  const demos = DEMO_CARDS
    .filter((card) => !existingSources.has(card.source) && !generatedIds.has(String(card.id)))
    .slice(0, needed)
    .map((card) => normalizeCard(card, true));
  return [...normalized, ...generated, ...demos];
}

function normalizeCard(raw, demo) {
  const fallback = DEMO_CARDS.find((item) => item.source === raw.source) || {};
  return {
    ...raw,
    id: raw.id,
    title: raw.title || fallback.title || "Untitled card",
    why: raw.why || raw.description || fallback.why || "This is ready for a one-tap decision.",
    source: raw.source || fallback.source || "miniapp-demo",
    source_label: raw.source_label || fallback.source_label || raw.topic_title || "bux",
    buttons: ensureButtons(raw.buttons || fallback.buttons),
    blocks: Array.isArray(raw.blocks) && raw.blocks.length ? raw.blocks : fallback.blocks || [],
    image_text: raw.image_text || fallback.image_text || "",
    category: raw.category || inferCategory(raw),
    demo,
    visual: raw.visual || { kind: "none" },
    created_at: raw.created_at || Math.round(Date.now() / 1000),
  };
}

function ensureButtons(buttons) {
  const labels = (Array.isArray(buttons) ? buttons : []).map((item) => String(item || "").trim()).filter(Boolean);
  for (const label of ["Start", "Need context", "Skip"]) {
    if (labels.length >= 3) break;
    if (!labels.some((item) => item.toLowerCase() === label.toLowerCase())) labels.push(label);
  }
  return labels.slice(0, 4);
}

function inferCategory(card) {
  const text = `${card.source || ""} ${card.source_label || ""} ${card.title || ""}`.toLowerCase();
  if (text.includes("gmail") || text.includes("email") || text.includes("inbox")) return "inbox";
  if (text.includes("slack") || text.includes("dm") || text.includes("people")) return "people";
  if (text.includes("github") || text.includes("pr") || text.includes("ci") || text.includes("repo")) return "code";
  if (text.includes("customer") || text.includes("churn") || text.includes("lead")) return "customer";
  if (text.includes("calendar") || text.includes("meeting")) return "calendar";
  if (text.includes("quality") || text.includes("bug") || text.includes("monitor")) return "quality";
  if (text.includes("focus") || text.includes("deep")) return "focus";
  if (text.includes("launch")) return "launch";
  if (text.includes("growth") || text.includes("distribution")) return "growth";
  return "ops";
}

function render() {
  const concept = CONCEPTS.find((item) => item.id === state.conceptId);
  if (!concept) {
    app.className = "concept-shell hub-mode";
    document.body.className = "hub";
    app.innerHTML = renderHub();
    return;
  }
  document.body.className = `concept-${concept.id} reel-theme theme-${concept.slug}`;
  app.className = `concept-shell concept-shell-${concept.slug}`;
  app.innerHTML = `
    ${renderLabNav(concept)}
    ${renderFeedConcept(concept)}
  `;
}

function renderHub() {
  return `
    <section class="hub-hero">
      <p class="micro">bux reel lab</p>
      <h1>10 versions of the AI work reel.</h1>
      <p>Every version uses the same real database cards. The differences are media focus, buttons, feedback, drafts, and overview.</p>
      <div class="hub-stats">
        <span>${state.cards.length} cards loaded</span>
        <span>${Object.keys(groupByCategory()).length} goal sectors</span>
        <span>${state.apiOnline ? "live data first" : "demo fallback"}</span>
      </div>
    </section>
    <section class="concept-grid">
      ${CONCEPTS.map((concept) => `
        <a class="concept-tile concept-tile-${concept.id}" href="${conceptPath(concept.id)}">
          <span class="tile-kicker">Version ${concept.id}</span>
          <strong>${escapeHtml(concept.name)}</strong>
          <p>${escapeHtml(concept.line)}</p>
          <small>${escapeHtml(concept.score)}</small>
        </a>
      `).join("")}
    </section>
  `;
}

function renderLabNav(concept) {
  const prev = concept.id === 1 ? 10 : concept.id - 1;
  const next = concept.id === 10 ? 1 : concept.id + 1;
  return `
    <nav class="lab-nav" aria-label="Mini App versions">
      <a class="lab-home" href="${hubPath()}">All</a>
      <div class="version-strip">
        <a href="${conceptPath(prev)}">Prev ${prev}</a>
        <span>${concept.id} / 10</span>
        <a href="${conceptPath(next)}">Next ${next}</a>
      </div>
      <span class="sync-pill ${state.apiOnline ? "online" : "offline"}">${state.apiOnline ? "live" : "demo"}</span>
    </nav>
  `;
}

function renderFeedConcept(concept) {
  const cards = activeCards(14);
  return `
    <section class="reel-lab variant-${concept.slug}">
      ${renderConceptHeader(concept)}
      ${concept.id === 5 ? renderStoryRail(cards) : ""}
      ${concept.id === 7 ? renderGoalMap(cards) : ""}
      ${concept.id === 10 ? renderOpsStrip(cards) : ""}
      <div class="reel-feed">
        ${cards.map((card, index) => renderReelCard(card, index, concept)).join("") || emptyPanel()}
      </div>
    </section>
  `;
}

function renderConceptHeader(concept) {
  return `
    <header class="concept-floating-title">
      <span>Version ${concept.id}</span>
      <strong>${escapeHtml(concept.name)}</strong>
      <small>${escapeHtml(concept.score)}</small>
    </header>
  `;
}

function renderReelCard(card, index, concept) {
  const meta = categoryMeta(card);
  const mediaOnly = Boolean(state.local.mediaOnly[String(card.id)]);
  const panel = panelFor(card);
  const forcePoster = concept.id === 9;
  return `
    <article class="reel-card ${mediaOnly ? "media-only" : ""} ${forcePoster ? "force-poster" : ""}" style="--accent:${meta.color}" data-card-id="${card.id}">
      <div class="media-stage">
        ${renderMedia(card, forcePoster)}
        <span class="media-tap-hint">${mediaOnly ? "Tap for details" : "Tap for image only"}</span>
      </div>
      <button class="media-hotspot" data-action="toggle-media" data-card-id="${card.id}" aria-label="Toggle media only"></button>
      <div class="card-meta">
        <span>${escapeHtml(meta.label)}</span>
        <strong>${escapeHtml(sourceName(card))}</strong>
        ${concept.id === 6 ? `<em>+${pointsFor(card)} XP</em>` : ""}
      </div>
      ${concept.id === 7 ? renderCardSector(card, index) : ""}
      <div class="card-sheet" style="--panel-index:${PANEL_ORDER.indexOf(panel)}">
        <nav class="panel-tabs">
          ${PANEL_ORDER.map((item) => `
            <button class="${panel === item ? "active" : ""}" data-action="panel" data-panel="${item}" data-card-id="${card.id}">
              ${escapeHtml(panelLabel(item, card))}
            </button>
          `).join("")}
        </nav>
        <div class="panel-track">
          ${renderSummaryPanel(card, concept)}
          ${renderContextPanel(card)}
          ${renderDraftsPanel(card)}
          ${renderFeedbackPanel(card)}
        </div>
      </div>
      ${renderDecisionDock(card, concept)}
      ${renderSideRail(card, index, concept)}
    </article>
  `;
}

function renderMedia(card, forcePoster = false) {
  const visual = forcePoster ? { kind: "none" } : card.visual || {};
  if (visual.kind === "video" && visual.src) {
    return `
      <figure class="card-media video-media">
        <video src="${escapeAttr(visual.src)}" autoplay loop muted playsinline></video>
      </figure>
    `;
  }
  if (visual.kind === "image" && visual.src) {
    return `
      <figure class="card-media image-media">
        <img src="${escapeAttr(visual.src)}" alt="" loading="lazy" />
      </figure>
    `;
  }
  const meta = categoryMeta(card);
  const lines = String(card.image_text || "").split(/\n+/).filter(Boolean);
  const top = lines[0] || meta.label;
  const bottom = lines.slice(1).join(" ") || sourceName(card);
  return `
    <figure class="card-media poster-media">
      <span>${escapeHtml(meta.short)}</span>
      <strong>${escapeHtml(top)}</strong>
      <small>${escapeHtml(bottom)}</small>
    </figure>
  `;
}

function renderSummaryPanel(card, concept) {
  const title = concept.id === 8 ? clip(card.title, 62) : card.title;
  const titleClass = String(title).length > 42 ? " title-long" : "";
  return `
    <section class="info-panel summary-panel${titleClass}">
      <p>${escapeHtml(categoryMeta(card).label)} / ${escapeHtml(sourceName(card))}</p>
      <h2>${escapeHtml(title)}</h2>
      <div class="why">${escapeHtml(clip(card.why, concept.id === 1 ? 150 : 190))}</div>
    </section>
  `;
}

function renderContextPanel(card) {
  const block = card.blocks?.[0];
  const body = block?.body || card.action || card.why || "No extra context on this card yet.";
  return `
    <section class="info-panel context-panel">
      <p>Context</p>
      <h2>${escapeHtml(block?.title || "What the agent knows")}</h2>
      <div class="body-copy">${escapeHtml(clip(body, 420))}</div>
    </section>
  `;
}

function renderDraftsPanel(card) {
  const blocks = Array.isArray(card.blocks) && card.blocks.length ? card.blocks : [
    { title: "Draft action", body: card.action || "The agent should produce the concrete artifact after you tap a button." },
  ];
  return `
    <section class="info-panel drafts-panel">
      <p>Drafts / variants</p>
      <div class="draft-stack">
        ${blocks.slice(0, 4).map((block, index) => `
          <article>
            <span>${index + 1}</span>
            <strong>${escapeHtml(block.title || `Option ${index + 1}`)}</strong>
            <small>${escapeHtml(clip(block.body || "", 130))}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderFeedbackPanel(card) {
  return `
    <section class="info-panel feedback-panel">
      <p>Feedback</p>
      <h2>Make the next card better.</h2>
      <div class="feedback-grid">
        ${["Too vague", "Need image", "Wrong goal", "More concrete"].map((label) => `
          <button data-action="quick-note" data-card-id="${card.id}" data-note="${escapeAttr(label)}">${escapeHtml(label)}</button>
        `).join("")}
        <button class="voice-wide" data-action="voice" data-card-id="${card.id}">Voice note</button>
      </div>
    </section>
  `;
}

function renderDecisionDock(card, concept) {
  const buttons = cardButtons(card);
  const selected = buttons[selectedIndex(card)] || buttons[0];
  const alternates = buttons.filter((_, index) => index !== selectedIndex(card)).slice(0, 3);
  const primaryLabel = concept.id === 8 ? "Do it" : selected.text;
  const longActions = [primaryLabel, ...alternates.map((item) => item.text)].some((label) => String(label).length > 24);
  return `
    <footer class="decision-dock ${longActions ? "long-actions" : ""}">
      <button class="primary-decision" data-action="start" data-card-id="${card.id}">
        <span>${escapeHtml(primaryLabel)}</span>
      </button>
      <div class="secondary-decisions">
        ${alternates.map((item, index) => `
          <button data-action="variant" data-card-id="${card.id}" data-index="${buttons.indexOf(item)}">${escapeHtml(item.text)}</button>
        `).join("")}
        <button data-action="context" data-card-id="${card.id}">Add context</button>
      </div>
    </footer>
  `;
}

function renderSideRail(card, index, concept) {
  return `
    <aside class="side-rail">
      <button data-action="panel" data-panel="context" data-card-id="${card.id}">
        <strong>${String(index + 1).padStart(2, "0")}</strong>
        <span>Context</span>
      </button>
      <button data-action="panel" data-panel="drafts" data-card-id="${card.id}">
        <strong>${Array.isArray(card.blocks) ? card.blocks.length : 0}</strong>
        <span>Drafts</span>
      </button>
      <button data-action="voice" data-card-id="${card.id}">
        <strong>mic</strong>
        <span>Voice</span>
      </button>
      <button data-action="skip" data-card-id="${card.id}">
        <strong>${concept.id === 6 ? `+${Math.max(5, pointsFor(card) / 4)}` : "skip"}</strong>
        <span>Skip</span>
      </button>
    </aside>
  `;
}

function renderStoryRail(cards) {
  const groups = Object.entries(groupByCategory()).slice(0, 8);
  return `
    <div class="story-rail">
      ${groups.map(([key, items]) => `
        <button style="--accent:${categoryMeta({ category: key }).color}" data-action="focus" data-card-id="${items[0]?.id || ""}">
          <span>${escapeHtml(categoryMeta({ category: key }).short)}</span>
          <strong>${escapeHtml(categoryMeta({ category: key }).label)}</strong>
          <small>${items.length}</small>
        </button>
      `).join("") || cards.slice(0, 5).map((card) => `
        <button style="--accent:${categoryMeta(card).color}" data-action="focus" data-card-id="${card.id}">
          <span>${escapeHtml(categoryMeta(card).short)}</span>
          <strong>${escapeHtml(sourceName(card))}</strong>
          <small>1</small>
        </button>
      `).join("")}
    </div>
  `;
}

function renderGoalMap(cards) {
  const groups = Object.entries(groupByCategory()).slice(0, 7);
  return `
    <aside class="goal-map">
      <p>Open goal sectors</p>
      <div>
        ${groups.map(([key, items], index) => `
          <button class="sector sector-${index + 1}" style="--accent:${categoryMeta({ category: key }).color}" data-action="focus" data-card-id="${items[0]?.id || ""}">
            <span>${escapeHtml(categoryMeta({ category: key }).short)}</span>
            <strong>${items.length}</strong>
          </button>
        `).join("")}
      </div>
      <small>${cards.length} cards on deck</small>
    </aside>
  `;
}

function renderCardSector(card, index) {
  const meta = categoryMeta(card);
  return `
    <div class="card-sector">
      <span style="background:${meta.color}">${escapeHtml(meta.short)}</span>
      <strong>sector ${index + 1}</strong>
    </div>
  `;
}

function renderOpsStrip(cards) {
  return `
    <aside class="ops-strip">
      <article><span>Open</span><strong>${state.stats.open || activeCards(100).length}</strong></article>
      <article><span>Points</span><strong>${state.local.points || 0}</strong></article>
      <article><span>Sectors</span><strong>${Object.keys(groupByCategory()).length}</strong></article>
      <button data-action="generate">Generate 10</button>
    </aside>
  `;
}

function panelFor(card) {
  const value = state.local.panels[String(card.id)] || "summary";
  return PANEL_ORDER.includes(value) ? value : "summary";
}

function panelLabel(panel, card) {
  if (panel === "drafts") return Array.isArray(card.blocks) && card.blocks.length ? `Drafts ${card.blocks.length}` : "Action";
  if (panel === "feedback") return "Tune";
  return panel[0].toUpperCase() + panel.slice(1);
}

function activeCards(limit = 100) {
  const pending = state.cards.filter((card) => !["started", "skipped"].includes(decisionFor(card)?.status));
  const cards = pending.length ? pending : state.cards;
  if (!cards.length) return [];
  const offset = state.conceptId ? (state.conceptId - 1) % cards.length : 0;
  const rotated = [...cards.slice(offset), ...cards.slice(0, offset)];
  return rotated.slice(0, limit);
}

function focusedCard() {
  return state.cards.find((card) => String(card.id) === String(state.focusCardId)) || activeCards(1)[0] || null;
}

function groupByCategory() {
  return activeCards(100).reduce((acc, card) => {
    const key = card.category || inferCategory(card);
    acc[key] ||= [];
    acc[key].push(card);
    return acc;
  }, {});
}

function categoryMeta(card) {
  return CATEGORY_META[card.category || inferCategory(card)] || CATEGORY_META.ops;
}

function selectedIndex(card) {
  const total = cardButtons(card).length;
  if (!total) return 0;
  const raw = Number(state.selected[String(card.id)] || 0);
  return Math.max(0, Math.min(total - 1, raw));
}

function cardButtons(card) {
  return ensureButtons(card?.buttons).map((item) => ({ raw: item, text: buttonText(item) }));
}

function selectedRaw(card) {
  return cardButtons(card)[selectedIndex(card)]?.raw || "";
}

function buttonText(value) {
  return String(value || "")
    .replace(/^✅\s*/, "")
    .replace(/^🛠️?\s*/, "")
    .replace(/^✏️\s*/, "")
    .trim() || "Start";
}

function sourceName(card) {
  return card.source_label || card.topic_title || card.source || "bux";
}

function decisionFor(card) {
  return state.local.decisions[String(card.id)] || null;
}

function markDecision(card, status, detail = "") {
  if (!card) return;
  state.local.decisions[String(card.id)] = {
    status,
    detail,
    title: card.title,
    source: sourceName(card),
    at: Date.now(),
  };
  state.local.points = Number(state.local.points || 0) + (status === "started" ? pointsFor(card) : 5);
  saveLocalState();
  state.focusCardId = activeCards(1)[0]?.id || state.cards[0]?.id || null;
}

function localActivity() {
  return Object.entries(state.local.decisions)
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => Number(b.at || 0) - Number(a.at || 0));
}

function pointsFor(card) {
  const base = card.importance === "high" ? 120 : card.importance === "low" ? 40 : 80;
  return base + Math.min(40, cardButtons(card).length * 10);
}

function remixCard(card) {
  const source = DEMO_CARDS[(Date.now() + state.local.cards.length) % DEMO_CARDS.length];
  const category = card?.category || source.category || "ops";
  const meta = CATEGORY_META[category] || CATEGORY_META.ops;
  const copy = {
    ...source,
    id: `local-${Date.now()}`,
    title: card ? `Sharper version: ${clip(card.title, 52)}` : source.title,
    why: card ? `A generated local remix with a clearer first action for ${sourceName(card)}.` : source.why,
    source: `miniapp-local:${Date.now()}`,
    source_label: `${meta.label} remix`,
    buttons: ensureButtons(card?.buttons || source.buttons),
    category,
    demo: true,
    visual: { kind: "none" },
    created_at: Math.round(Date.now() / 1000),
  };
  state.local.cards.unshift(copy);
  saveLocalState();
  state.cards = mergeCards(state.cards.filter((item) => !item.demo || !String(item.id).startsWith("demo-")));
  state.focusCardId = copy.id;
  haptic("success");
  toast("New local variant generated.");
  render();
}

function clip(value, limit) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, Math.max(0, limit - 1)).trim()}...` : text;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toastEl.classList.remove("show"), 2100);
}

function haptic(kind = "light") {
  try {
    if (kind === "selectionChanged") tg?.HapticFeedback?.selectionChanged?.();
    else if (kind === "success") tg?.HapticFeedback?.notificationOccurred?.("success");
    else tg?.HapticFeedback?.impactOccurred?.(kind);
  } catch {
    // Haptics are optional outside Telegram.
  }
}

function emptyPanel() {
  return `<article class="empty-panel"><strong>No cards yet</strong><p>Generate cards or connect a tool to fill this reel with real work.</p></article>`;
}

function saveNote(card, note) {
  state.local.notes[String(card.id)] = [...(state.local.notes[String(card.id)] || []), note];
  saveLocalState();
}

function addContext(card) {
  const comment = window.prompt("What should the agent change?", "Make this more concrete.");
  if (!comment?.trim()) return;
  saveNote(card, comment.trim());
  haptic("success");
  toast("Context saved.");
  syncComment(card, comment.trim());
}

function addVoiceNote(card) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    const comment = window.prompt("Voice fallback: what should the agent know?");
    if (!comment?.trim()) return;
    saveNote(card, `Voice note: ${comment.trim()}`);
    syncComment(card, comment.trim());
    toast("Voice note saved.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const text = event.results?.[0]?.[0]?.transcript || "";
    if (text.trim()) {
      saveNote(card, `Voice note: ${text.trim()}`);
      syncComment(card, text.trim());
      toast("Voice note saved.");
    }
  };
  recognition.onerror = () => toast("Voice capture failed.");
  recognition.start();
  toast("Listening...");
}

function syncStart(card) {
  if (!initData || card.demo) return;
  api(`/api/cards/${card.id}/start`, {
    method: "POST",
    body: JSON.stringify({ button: selectedRaw(card) }),
  })
    .then(() => refresh())
    .catch(() => toast("Saved locally. Backend write did not accept it yet."));
}

function syncSkip(card) {
  if (!initData || card.demo) return;
  api(`/api/cards/${card.id}/dismiss`, { method: "POST", body: "{}" })
    .then(() => refresh())
    .catch(() => toast("Skipped locally. Backend write did not accept it yet."));
}

function syncComment(card, comment) {
  if (!initData || card.demo) return;
  api(`/api/cards/${card.id}/comment`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  }).catch(() => toast("Note saved locally. Backend write did not accept it yet."));
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const cardId = target.dataset.cardId;
  const card = state.cards.find((item) => String(item.id) === String(cardId));

  if (action === "focus" && card) {
    state.focusCardId = card.id;
    haptic("selectionChanged");
    render();
    document.querySelector(`[data-card-id="${CSS.escape(String(card.id))}"]`)?.scrollIntoView({ block: "center" });
    return;
  }
  if (action === "toggle-media" && card) {
    const key = String(card.id);
    state.local.mediaOnly[key] = !state.local.mediaOnly[key];
    saveLocalState();
    haptic("light");
    render();
    return;
  }
  if (action === "panel" && card) {
    state.local.mediaOnly[String(card.id)] = false;
    state.local.panels[String(card.id)] = target.dataset.panel || "summary";
    saveLocalState();
    haptic("selectionChanged");
    render();
    return;
  }
  if (action === "variant" && card) {
    state.selected[String(card.id)] = Number(target.dataset.index || 0);
    haptic("selectionChanged");
    render();
    return;
  }
  if (action === "start" && card) {
    markDecision(card, "started", selectedRaw(card));
    haptic("success");
    toast(`Started: ${buttonText(selectedRaw(card))}`);
    render();
    syncStart(card);
    return;
  }
  if (action === "skip" && card) {
    markDecision(card, "skipped", "skip");
    haptic("medium");
    toast("Skipped. Scroll or keep tapping.");
    render();
    syncSkip(card);
    return;
  }
  if (action === "context" && card) {
    addContext(card);
    return;
  }
  if (action === "voice" && card) {
    addVoiceNote(card);
    return;
  }
  if (action === "quick-note" && card) {
    const note = target.dataset.note || "Feedback";
    saveNote(card, note);
    haptic("success");
    toast(`Saved: ${note}`);
    syncComment(card, note);
    return;
  }
  if (action === "remix") {
    remixCard(card || focusedCard());
    return;
  }
  if (action === "generate") {
    remixCard(focusedCard());
    if (initData) api("/api/generate", { method: "POST", body: "{}" }).catch(() => {});
  }
});

await refresh();
