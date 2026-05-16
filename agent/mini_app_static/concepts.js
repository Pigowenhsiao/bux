const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

try {
  tg?.setHeaderColor?.("#f6f1e8");
  tg?.setBackgroundColor?.("#f6f1e8");
  tg?.setBottomBarColor?.("#f6f1e8");
} catch {
  // Telegram client capabilities vary by version.
}

const params = new URLSearchParams(window.location.search);
if (params.get("dev") === "1") localStorage.buxMiniAppDev = "1";
const initData = tg?.initData || (localStorage.buxMiniAppDev === "1" ? "dev" : "");
const app = document.querySelector("#app");
const toastEl = document.querySelector("#toast");
const STORE_KEY = "buxMiniAppConceptLab:v6";
const CONCEPT_COUNT = 20;

const CONCEPTS = [
  ["scroll-reel", "Scroll Reel", "reel", "TikTok-style card loop: text below media, buttons below text, no overlays."],
  ["x-feed", "X Feed", "timeline", "A social feed for quick scanning many agent suggestions."],
  ["story-stack", "Story Stack", "stories", "Tap-card previews with one full card in focus."],
  ["swipe-deck", "Swipe Deck", "deck", "Tinder-style decision stack with the action dock outside the card."],
  ["pin-board", "Pin Board", "board", "A fast visual board for comparing many cards at once."],
  ["wallet-pass", "Wallet Pass", "wallet", "Stacked passes with clear title, source, and approval controls."],
  ["chat-cards", "Big Chat Cards", "chat", "The v7 direction: big card heading, small explanation, chat-like flow."],
  ["goal-lanes", "Goal Lanes", "kanban", "Grouped cards for seeing which goals have open agent work."],
  ["mail-triage", "Mail Triage", "mail", "The v9 direction: clean list preview plus one readable detail card."],
  ["command-center", "Command Center", "command", "Stats and a concrete queue without turning into a chatbot."],
  ["magazine-card", "Magazine Card", "magazine", "Editorial card treatment with copy and controls separated."],
  ["photo-grid", "Photo Grid", "gallery", "Thumbnail overview with a selected action card below."],
  ["checklist", "Checklist", "checklist", "A simple list for clearing cards quickly."],
  ["calendar-stack", "Calendar Stack", "calendar", "Cards arranged like a day plan with one-tap decisions."],
  ["slot-picker", "Slot Picker", "arcade", "A playful picker for spinning through possible agent actions."],
  ["split-brief", "Split Brief", "split", "Separate evidence/context from the final decision controls."],
  ["paper-stack", "Paper Stack", "stack", "Physical cards with strong hierarchy and no media text."],
  ["voice-card", "Voice Card", "voice", "Optimized for quick spoken feedback on a suggested action."],
  ["dense-queue", "Dense Queue", "compact", "Compact operator list for rapidly clearing many cards."],
  ["coach-card", "Coach Card", "coach", "A decision coach card with why, evidence, and a clear next move."],
].map(([slug, name, layout, line], index) => ({
  id: index + 1,
  slug,
  name,
  layout,
  line,
  accent: palette(index),
}));

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
      { title: "What the agent checks", body: "Unanswered threads, VIP senders, and anything with a clear ask." },
      { title: "Draft variants", body: "Short reply, warmer reply, and direct next-step reply." },
      { title: "Safety", body: "Nothing sends without approval." },
    ],
    category: "inbox",
  },
  {
    id: "demo-slack",
    title: "Find who is blocked on you in Slack",
    why: "Scan mentions, DMs, and hot channels, then produce a tiny unblock list.",
    source: "miniapp-demo:slack",
    source_label: "Slack",
    importance: "high",
    buttons: ["Find blockers", "Draft answers", "Daily digest"],
    blocks: [
      { title: "Signals", body: "Direct asks, repeated pings, deadlines, and names attached to blockers." },
      { title: "Output", body: "A short list of people, channel, exact ask, and proposed reply." },
      { title: "Cadence", body: "Optional daily digest instead of constant pings." },
    ],
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
      { title: "When green", body: "Send one card when the branch is safe to merge." },
    ],
    category: "code",
  },
  {
    id: "demo-growth",
    title: "Find five warm distribution openings",
    why: "Discover real people, posts, launches, and replies worth acting on.",
    source: "miniapp-demo:growth",
    source_label: "Growth",
    importance: "high",
    buttons: ["Find openings", "Draft outreach", "Make launch list"],
    blocks: [
      { title: "Good opening", body: "A named person or channel with active intent, not generic outreach." },
      { title: "Draft style", body: "Short, specific, and tied to the visible context." },
      { title: "Next batch", body: "Create ten more only after learning from taps and skips." },
    ],
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
      { title: "Risk signs", body: "Complaint language, silence, unresolved bugs, and leadership escalation." },
      { title: "Recovery", body: "Name the customer, symptom, and safest next contact." },
      { title: "Boundary", body: "Drafts are approval-only before sending." },
    ],
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
      { title: "Prep packet", body: "Attendees, prior threads, docs, open decisions, and likely objections." },
      { title: "Question list", body: "Three questions that change the outcome of the meeting." },
      { title: "Follow-up", body: "Draft the recap after the meeting if approved." },
    ],
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
      { title: "Sections", body: "Money, users, bugs, shipping, people, and risks." },
      { title: "Format", body: "Cards, not a wall of text." },
      { title: "Schedule", body: "PT morning brief, with quiet self-pacing between runs." },
    ],
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
      { title: "Inputs", body: "Failing tests, bug reports, incidents, and noisy alerts." },
      { title: "Ranking", body: "User pain, shipping risk, and confidence." },
      { title: "Next action", body: "Open a branch, draft a bug report, or monitor quietly." },
    ],
    category: "quality",
  },
  {
    id: "demo-focus",
    title: "Protect two hours of deep work",
    why: "Batch low-value replies and only interrupt for named blockers or escalations.",
    source: "miniapp-demo:focus",
    source_label: "Focus",
    importance: "low",
    buttons: ["Start focus block", "Batch replies", "Only urgent"],
    blocks: [
      { title: "Quiet mode", body: "Watch incoming surfaces without interrupting every time." },
      { title: "Urgent means", body: "Named blocker, production issue, customer escalation, or time-sensitive decision." },
      { title: "Afterward", body: "Summarize what was ignored, drafted, or needs approval." },
    ],
    category: "focus",
  },
  {
    id: "demo-launch",
    title: "Run a launch from idea to reaction follow-up",
    why: "Handle copy, checklists, posting, monitoring, and the next reply.",
    source: "miniapp-demo:launch",
    source_label: "Launch",
    importance: "high",
    buttons: ["Plan launch", "Draft copy", "Watch reactions"],
    blocks: [
      { title: "Launch plan", body: "Channels, assets, blockers, owner approvals, and timing." },
      { title: "Copy", body: "X, LinkedIn, email, community, and customer follow-up variants." },
      { title: "Reaction loop", body: "Replies, mentions, signups, and support issues become new cards." },
    ],
    category: "launch",
  },
];

const CATEGORY_META = {
  inbox: { label: "Inbox", short: "IN", color: "#ff5a7a" },
  people: { label: "People", short: "DM", color: "#19c37d" },
  code: { label: "Code", short: "PR", color: "#2bb6ff" },
  growth: { label: "Growth", short: "GR", color: "#f7a72b" },
  customer: { label: "Customers", short: "CU", color: "#ff7a1a" },
  calendar: { label: "Calendar", short: "CA", color: "#9b7cff" },
  ops: { label: "Ops", short: "OP", color: "#19b7a8" },
  quality: { label: "Quality", short: "QA", color: "#ef4444" },
  focus: { label: "Focus", short: "FO", color: "#64748b" },
  launch: { label: "Launch", short: "LA", color: "#e84aa7" },
};

const state = {
  cards: [],
  goals: [],
  topics: [],
  stats: {},
  activity: [],
  me: { settings: {} },
  conceptId: conceptIdFromPath(),
  focusCardId: null,
  selected: {},
  apiOnline: false,
  apiError: "",
  local: loadLocalState(),
};

function palette(index) {
  return [
    "#ff5a7a",
    "#111827",
    "#f59e0b",
    "#22c55e",
    "#38bdf8",
    "#8b5cf6",
    "#f97316",
    "#14b8a6",
    "#ef4444",
    "#eab308",
  ][index % 10];
}

function conceptIdFromPath() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const match = path.match(/(?:mini[-_]?app|miniapp)[-/]?(\d{1,2})$/i);
  if (!match) return 0;
  const value = Number(match[1]);
  return value >= 1 && value <= CONCEPT_COUNT ? value : 0;
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
      points: Number(parsed.points || 0),
    };
  } catch {
    return { decisions: {}, cards: [], notes: {}, points: 0 };
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
    title: raw.title || fallback.title || "Untitled action",
    why: raw.why || raw.description || fallback.why || "This is ready for a one-tap decision.",
    source: raw.source || fallback.source || "miniapp-demo",
    source_label: raw.source_label || fallback.source_label || raw.topic_title || "bux",
    source_url: raw.source_url || "",
    buttons: ensureButtons(raw.buttons || fallback.buttons),
    blocks: Array.isArray(raw.blocks) && raw.blocks.length ? raw.blocks : fallback.blocks || [],
    category: raw.category || fallback.category || inferCategory(raw),
    importance: raw.importance || fallback.importance || "med",
    demo,
    visual: raw.visual || { kind: "none" },
    created_at: raw.created_at || Math.round(Date.now() / 1000),
  };
}

function ensureButtons(buttons) {
  const labels = (Array.isArray(buttons) ? buttons : []).map((item) => String(item || "").trim()).filter(Boolean);
  return labels.length ? labels.slice(0, 4) : ["Start"];
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
    document.body.className = "hub";
    app.className = "concept-shell hub-mode";
    app.innerHTML = renderHub();
    return;
  }
  document.body.className = `concept-page layout-${concept.layout} concept-${concept.id}`;
  app.className = "concept-shell";
  app.innerHTML = `
    ${renderLabNav(concept)}
    ${renderConcept(concept)}
  `;
}

function renderHub() {
  return `
    <section class="hub-hero">
      <p class="eyebrow">bux concept lab</p>
      <h1>20 Mini App directions.</h1>
      <p>Twenty tested interaction models for accepting, skipping, expanding, and improving agent work.</p>
      <div class="hub-stats">
        <span>${state.cards.length} cards loaded</span>
        <span>${Object.keys(groupByCategory()).length} source groups</span>
        <span>${state.apiOnline ? "live database" : "demo fallback"}</span>
      </div>
    </section>
    <section class="concept-grid">
      ${CONCEPTS.map((concept) => `
        <a class="concept-tile tile-${concept.layout}" style="--accent:${concept.accent}" href="${conceptPath(concept.id)}">
          <span>Version ${concept.id}</span>
          <strong>${escapeHtml(concept.name)}</strong>
          <p>${escapeHtml(concept.line)}</p>
        </a>
      `).join("")}
    </section>
  `;
}

function renderLabNav(concept) {
  const prev = concept.id === 1 ? CONCEPT_COUNT : concept.id - 1;
  const next = concept.id === CONCEPT_COUNT ? 1 : concept.id + 1;
  return `
    <nav class="lab-nav" aria-label="Mini App concepts">
      <a class="lab-home" href="${hubPath()}">All 20</a>
      <a href="${conceptPath(prev)}">Prev ${prev}</a>
      <span>${concept.id} / ${CONCEPT_COUNT}</span>
      <a href="${conceptPath(next)}">Next ${next}</a>
      <small>${escapeHtml(concept.layout)}</small>
    </nav>
  `;
}

function renderConcept(concept) {
  const cards = activeCards(18);
  const card = focusedCard(cards);
  const ordered = prioritizeCard(cards, card);
  const renderer = LAYOUTS[concept.layout] || renderGeneric;
  return `
    <section class="concept-screen" style="--accent:${concept.accent}">
      <header class="concept-title">
        <span>Version ${concept.id}</span>
        <h1>${escapeHtml(concept.name)}</h1>
        <p>${escapeHtml(concept.line)}</p>
      </header>
      ${renderPreviewStrip(ordered, card)}
      ${renderer(concept, ordered, card)}
    </section>
  `;
}

function renderPreviewStrip(cards, card) {
  const visible = cards.slice(0, 10);
  return `
    <nav class="card-preview" aria-label="Card previews">
      <button class="card-step" data-action="focus-prev" type="button">Prev card</button>
      <div class="preview-track">
        ${visible.map((item, index) => `
          <button class="${String(item.id) === String(card.id) ? "active" : ""}" data-action="focus" data-card-id="${item.id}" type="button" aria-pressed="${String(item.id) === String(card.id)}">
            <span>${index + 1}</span>
            <strong>${escapeHtml(clip(item.title, 42))}</strong>
          </button>
        `).join("")}
      </div>
      <button class="card-step" data-action="focus-next" type="button">Next card</button>
    </nav>
  `;
}

const LAYOUTS = {
  reel: renderReel,
  timeline: renderTimeline,
  stories: renderStories,
  deck: renderDeck,
  board: renderBoard,
  wallet: renderWallet,
  chat: renderChat,
  kanban: renderKanban,
  mail: renderMail,
  command: renderCommand,
  magazine: renderMagazine,
  gallery: renderGallery,
  checklist: renderChecklist,
  calendar: renderCalendar,
  arcade: renderArcade,
  split: renderSplit,
  stack: renderStack,
  voice: renderVoice,
  compact: renderCompact,
  table: renderTable,
  coach: renderCoach,
  doc: renderDoc,
  forum: renderForum,
  linear: renderLinear,
  playlist: renderPlaylist,
  quest: renderQuest,
  shop: renderShop,
  brief: renderBrief,
  focus: renderFocus,
  broadcast: renderBroadcast,
  crm: renderCrm,
  terminal: renderTerminal,
  comic: renderComic,
  roadmap: renderRoadmap,
  habit: renderHabit,
  market: renderMarket,
  onebutton: renderOneButton,
  draft: renderDraftStudio,
  team: renderTeam,
  shelves: renderShelves,
  receipt: renderReceipt,
  auction: renderAuction,
  launch: renderLaunch,
  letter: renderLetter,
  mission: renderMission,
  sports: renderSports,
  proof: renderProof,
  splitdeck: renderSplitDeck,
  tiles: renderTiles,
  concierge: renderConcierge,
};

function renderReel(concept, cards) {
  return `
    <div class="reel-stream">
      ${cards.slice(0, 5).map((card) => `
        <article class="phone-reel ${hasRealVisual(card) ? "" : "no-visual-card"} concept-card" data-card-id="${card.id}">
          ${renderVisual(card, "reel-visual")}
          <div class="reel-copy">
            ${renderMeta(card)}
            <h2>${escapeHtml(clip(card.title, 82))}</h2>
            <p>${escapeHtml(clip(card.why, 150))}</p>
          </div>
          ${renderActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderTimeline(concept, cards) {
  return `
    <div class="timeline-shell">
      ${cards.slice(0, 8).map((card) => `
        <article class="social-post concept-card" data-card-id="${card.id}">
          <button class="avatar" data-action="focus" data-card-id="${card.id}">${escapeHtml(categoryMeta(card).short)}</button>
          <div>
            <header><strong>${escapeHtml(sourceName(card))}</strong><span>@${escapeHtml(card.category)}</span></header>
            <h2>${escapeHtml(clip(card.title, 92))}</h2>
            <p>${escapeHtml(clip(card.why, 160))}</p>
            ${renderVisual(card, "post-media")}
            ${renderActions(card, "inline-actions")}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderStories(concept, cards, card) {
  return `
    <div class="story-layout">
      <div class="story-strip">
        ${cards.slice(0, 8).map((item) => `
          <button class="${String(item.id) === String(card.id) ? "active" : ""}" data-action="focus" data-card-id="${item.id}">
            ${renderVisual(item, "story-thumb")}
            <span>${escapeHtml(sourceName(item))}</span>
          </button>
        `).join("")}
      </div>
      <article class="story-stage concept-card" data-card-id="${card.id}">
        ${renderVisual(card, "story-visual")}
        <section>
          ${renderMeta(card)}
          <h2>${escapeHtml(clip(card.title, 92))}</h2>
          <p>${escapeHtml(clip(card.why, 170))}</p>
          ${renderActions(card)}
        </section>
      </article>
    </div>
  `;
}

function renderDeck(concept, cards, card) {
  return `
    <div class="deck-shell">
      ${cards.slice(0, 4).reverse().map((item, index) => `
        <article class="swipe-card concept-card" style="--stack:${index}" data-card-id="${item.id}">
          ${renderVisual(item, "deck-visual")}
          <section>
            ${renderMeta(item)}
            <h2>${escapeHtml(clip(item.title, 78))}</h2>
            <p>${escapeHtml(clip(item.why, 150))}</p>
          </section>
        </article>
      `).join("")}
      ${renderActions(card, "deck-actions")}
    </div>
  `;
}

function renderBoard(concept, cards) {
  return `
    <div class="pin-board">
      ${cards.slice(0, 12).map((card, index) => `
        <article class="pin pin-${index % 5} concept-card" data-card-id="${card.id}">
          ${renderVisual(card, "pin-visual")}
          <h2>${escapeHtml(clip(card.title, 70))}</h2>
          <p>${escapeHtml(clip(card.why, 90))}</p>
          ${renderMiniActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderWallet(concept, cards) {
  return `
    <div class="wallet-stack">
      ${cards.slice(0, 6).map((card, index) => `
        <article class="wallet-pass concept-card" style="--i:${index}" data-card-id="${card.id}">
          <div>${renderMeta(card)}<h2>${escapeHtml(clip(card.title, 72))}</h2></div>
          <p>${escapeHtml(clip(card.why, 120))}</p>
          ${renderActions(card, "pass-actions")}
        </article>
      `).join("")}
    </div>
  `;
}

function renderChat(concept, cards, card) {
  return `
    <div class="chat-shell">
      <div class="chat-thread">
        ${cards.slice(0, 5).map((item, index) => `
          <article class="bubble ${index % 2 ? "user-bubble" : "agent-bubble"} concept-card" data-card-id="${item.id}">
            <span>${escapeHtml(sourceName(item))}</span>
            <h2>${escapeHtml(clip(item.title, 90))}</h2>
            <p>${escapeHtml(clip(item.why, 130))}</p>
          </article>
        `).join("")}
      </div>
      <div class="chat-composer">${renderMiniActions(card)}<button data-action="voice" data-card-id="${card.id}">Hold to explain</button></div>
    </div>
  `;
}

function renderKanban(concept, cards) {
  const groups = groupedCards(cards);
  return `
    <div class="kanban-board">
      ${groups.slice(0, 4).map(([key, items]) => `
        <section>
          <h2>${escapeHtml(categoryMeta({ category: key }).label)}</h2>
          ${items.slice(0, 4).map((card) => `
            <article class="lane-card concept-card" data-card-id="${card.id}">
              <strong>${escapeHtml(clip(card.title, 72))}</strong>
              <p>${escapeHtml(clip(card.why, 90))}</p>
              ${renderMiniActions(card)}
            </article>
          `).join("")}
        </section>
      `).join("")}
    </div>
  `;
}

function renderMail(concept, cards, card) {
  return `
    <div class="mail-app">
      <aside>
        ${cards.slice(0, 7).map((item) => `
          <button class="${String(item.id) === String(card.id) ? "active" : ""}" data-action="focus" data-card-id="${item.id}">
            <strong>${escapeHtml(clip(item.title, 48))}</strong>
            <span>${escapeHtml(sourceName(item))}</span>
          </button>
        `).join("")}
      </aside>
      <article class="mail-detail concept-card" data-card-id="${card.id}">
        ${renderMeta(card)}
        <h2>${escapeHtml(card.title)}</h2>
        <p>${escapeHtml(clip(card.why, 240))}</p>
        ${renderBlocks(card)}
        ${renderActions(card)}
      </article>
    </div>
  `;
}

function renderCommand(concept, cards, card) {
  return `
    <div class="command-grid">
      <section class="stat-card"><span>Open</span><strong>${activeCards(100).length}</strong></section>
      <section class="stat-card"><span>Points</span><strong>${state.local.points || 0}</strong></section>
      <section class="stat-card"><span>Sources</span><strong>${Object.keys(groupByCategory()).length}</strong></section>
      <article class="command-main concept-card" data-card-id="${card.id}">
        ${renderVisual(card, "command-visual")}
        <div>${renderMeta(card)}<h2>${escapeHtml(card.title)}</h2><p>${escapeHtml(clip(card.why, 180))}</p></div>
        ${renderActions(card)}
      </article>
      <section class="command-queue">
        ${cards.slice(1, 6).map((item) => `<button data-action="focus" data-card-id="${item.id}">${escapeHtml(clip(item.title, 58))}</button>`).join("")}
      </section>
    </div>
  `;
}

function renderMagazine(concept, cards, card) {
  return `
    <article class="magazine concept-card" data-card-id="${card.id}">
      ${renderVisual(card, "mag-cover")}
      <section>
        ${renderMeta(card)}
        <h2>${escapeHtml(card.title)}</h2>
        <p>${escapeHtml(clip(card.why, 220))}</p>
        ${renderActions(card)}
      </section>
    </article>
  `;
}

function renderGallery(concept, cards, card) {
  return `
    <div class="gallery-layout">
      <div class="gallery-grid">
        ${cards.slice(0, 9).map((item) => `
          <button data-action="focus" data-card-id="${item.id}">
            ${renderVisual(item, "gallery-thumb")}
          </button>
        `).join("")}
      </div>
      <article class="gallery-caption concept-card" data-card-id="${card.id}">
        <h2>${escapeHtml(clip(card.title, 70))}</h2>
        <p>${escapeHtml(clip(card.why, 130))}</p>
        ${renderActions(card)}
      </article>
    </div>
  `;
}

function renderChecklist(concept, cards) {
  return `
    <div class="checklist-shell">
      ${cards.slice(0, 9).map((card, index) => `
        <article class="check-row concept-card" data-card-id="${card.id}">
          <button data-action="start" data-card-id="${card.id}">${index + 1}</button>
          <div><strong>${escapeHtml(clip(card.title, 86))}</strong><p>${escapeHtml(clip(card.why, 100))}</p></div>
          <button data-action="skip" data-card-id="${card.id}">Skip</button>
        </article>
      `).join("")}
    </div>
  `;
}

function renderCalendar(concept, cards) {
  return `
    <div class="calendar-shell">
      ${cards.slice(0, 7).map((card, index) => `
        <article class="time-block concept-card" data-card-id="${card.id}">
          <time>${String(9 + index).padStart(2, "0")}:00</time>
          <div><h2>${escapeHtml(clip(card.title, 76))}</h2><p>${escapeHtml(clip(card.why, 100))}</p>${renderMiniActions(card)}</div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderArcade(concept, cards, card) {
  const choices = cardButtons(card);
  return `
    <div class="arcade-shell">
      <div class="slot-window">
        ${choices.slice(0, 3).map((button) => `<span>${escapeHtml(button.text)}</span>`).join("")}
      </div>
      <article class="arcade-card concept-card" data-card-id="${card.id}">
        ${renderVisual(card, "arcade-visual")}
        <h2>${escapeHtml(card.title)}</h2>
        <p>${escapeHtml(clip(card.why, 150))}</p>
      </article>
      ${renderActions(card, "arcade-actions")}
    </div>
  `;
}

function renderSplit(concept, cards, card) {
  return `
    <article class="split-shell concept-card" data-card-id="${card.id}">
      ${renderVisual(card, "split-visual")}
      <section>
        ${renderMeta(card)}
        <h2>${escapeHtml(card.title)}</h2>
        <p>${escapeHtml(clip(card.why, 200))}</p>
        ${renderBlocks(card)}
        ${renderActions(card)}
      </section>
    </article>
  `;
}

function renderStack(concept, cards) {
  return `
    <div class="paper-stack">
      ${cards.slice(0, 5).map((card, index) => `
        <article class="paper-card concept-card" style="--i:${index}" data-card-id="${card.id}">
          ${renderMeta(card)}
          <h2>${escapeHtml(clip(card.title, 96))}</h2>
          <p>${escapeHtml(clip(card.why, 150))}</p>
          ${renderMiniActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderVoice(concept, cards, card) {
  return `
    <div class="voice-shell">
      <article class="voice-card concept-card" data-card-id="${card.id}">
        <div class="wave"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        ${renderMeta(card)}
        <h2>${escapeHtml(card.title)}</h2>
        <p>${escapeHtml(clip(card.why, 180))}</p>
        <button class="voice-giant" data-action="voice" data-card-id="${card.id}">Tell agent what is wrong</button>
        ${renderActions(card)}
      </article>
    </div>
  `;
}

function renderCompact(concept, cards) {
  return `
    <div class="compact-list">
      ${cards.slice(0, 12).map((card) => `
        <article class="compact-row concept-card" data-card-id="${card.id}">
          <span>${escapeHtml(categoryMeta(card).short)}</span>
          <strong>${escapeHtml(clip(card.title, 64))}</strong>
          ${renderMiniActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderTable(concept, cards) {
  return `
    <div class="table-shell">
      <div class="table-head"><span>Source</span><span>Action</span><span>Impact</span></div>
      ${cards.slice(0, 10).map((card) => `
        <article class="table-row concept-card" data-card-id="${card.id}">
          <span>${escapeHtml(sourceName(card))}</span>
          <strong>${escapeHtml(clip(card.title, 60))}</strong>
          ${renderMiniActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderCoach(concept, cards, card) {
  return `
    <article class="coach-shell concept-card" data-card-id="${card.id}">
      <section class="coach-advice"><span>Recommended next move</span><h2>${escapeHtml(clip(card.title, 82))}</h2></section>
      <section><h3>Why now</h3><p>${escapeHtml(clip(card.why, 180))}</p></section>
      <section><h3>Evidence</h3>${renderBlocks(card)}</section>
      ${renderActions(card)}
    </article>
  `;
}

function renderDoc(concept, cards, card) {
  return `
    <article class="doc-shell concept-card" data-card-id="${card.id}">
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(clip(card.why, 240))}</p>
      ${renderBlocks(card)}
      ${renderActions(card)}
    </article>
  `;
}

function renderForum(concept, cards) {
  return `
    <div class="forum-feed">
      ${cards.slice(0, 7).map((card) => `
        <article class="forum-post concept-card" data-card-id="${card.id}">
          <aside>${pointsFor(card)}<span>pts</span></aside>
          <section><h2>${escapeHtml(clip(card.title, 80))}</h2><p>${escapeHtml(clip(card.why, 120))}</p>${renderMiniActions(card)}</section>
        </article>
      `).join("")}
    </div>
  `;
}

function renderLinear(concept, cards) {
  return `
    <div class="linear-list">
      ${cards.slice(0, 10).map((card, index) => `
        <article class="linear-row concept-card" data-card-id="${card.id}">
          <span>BUX-${100 + index}</span>
          <strong>${escapeHtml(clip(card.title, 76))}</strong>
          <em>${escapeHtml(card.importance)}</em>
          ${renderMiniActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderPlaylist(concept, cards, card) {
  return `
    <div class="playlist-shell concept-card" data-card-id="${card.id}">
      ${renderVisual(card, "album-art")}
      <section><h2>${escapeHtml(card.title)}</h2><p>${escapeHtml(clip(card.why, 160))}</p>${renderActions(card)}</section>
      <ol>${cards.slice(1, 7).map((item) => `<li><button data-action="focus" data-card-id="${item.id}">${escapeHtml(clip(item.title, 64))}</button></li>`).join("")}</ol>
    </div>
  `;
}

function renderQuest(concept, cards) {
  return `
    <div class="quest-ladder">
      ${cards.slice(0, 7).map((card, index) => `
        <article class="quest-step concept-card" data-card-id="${card.id}">
          <span>${index + 1}</span>
          <div><strong>${escapeHtml(clip(card.title, 76))}</strong><p>+${pointsFor(card)} momentum</p></div>
          ${renderMiniActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderShop(concept, cards) {
  return `
    <div class="shop-shelf">
      ${cards.slice(0, 8).map((card) => `
        <article class="shop-card concept-card" data-card-id="${card.id}">
          ${renderVisual(card, "shop-visual")}
          <h2>${escapeHtml(clip(card.title, 62))}</h2>
          <p>${escapeHtml(clip(card.why, 92))}</p>
          ${renderMiniActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderBrief(concept, cards, card) {
  return `
    <article class="brief-shell concept-card" data-card-id="${card.id}">
      <time>Today</time>
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(clip(card.why, 190))}</p>
      <div class="brief-lines">${cards.slice(1, 5).map((item) => `<span>${escapeHtml(clip(item.title, 54))}</span>`).join("")}</div>
      ${renderActions(card)}
    </article>
  `;
}

function renderFocus(concept, cards, card) {
  return `
    <article class="focus-shell concept-card" data-card-id="${card.id}">
      <span>${escapeHtml(sourceName(card))}</span>
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(clip(card.why, 180))}</p>
      ${renderActions(card)}
    </article>
  `;
}

function renderBroadcast(concept, cards, card) {
  return `
    <div class="broadcast-shell">
      <article class="dispatch concept-card" data-card-id="${card.id}">
        <span>Dispatch ready</span>
        <h2>${escapeHtml(card.title)}</h2>
        <p>${escapeHtml(clip(card.why, 180))}</p>
      </article>
      <aside>${renderActions(card)}<button data-action="context" data-card-id="${card.id}">Edit before sending</button></aside>
    </div>
  `;
}

function renderCrm(concept, cards) {
  return `
    <div class="crm-pipeline">
      ${["Lead", "Risk", "Follow-up"].map((label, lane) => `
        <section><h2>${label}</h2>${cards.filter((_, index) => index % 3 === lane).slice(0, 4).map((card) => `
          <article class="crm-card concept-card" data-card-id="${card.id}">
            <strong>${escapeHtml(clip(card.title, 62))}</strong>
            <p>${escapeHtml(sourceName(card))}</p>
            ${renderMiniActions(card)}
          </article>
        `).join("")}</section>
      `).join("")}
    </div>
  `;
}

function renderTerminal(concept, cards, card) {
  return `
    <article class="terminal-shell concept-card" data-card-id="${card.id}">
      <pre>$ bux suggest --next\nsource=${escapeHtml(sourceName(card))}\nimpact=${pointsFor(card)}\n\n${escapeHtml(clip(card.title, 140))}</pre>
      <p>${escapeHtml(clip(card.why, 180))}</p>
      ${renderActions(card)}
    </article>
  `;
}

function renderComic(concept, cards, card) {
  const blocks = card.blocks.length ? card.blocks : [{ title: "Problem", body: card.why }, { title: "Agent", body: card.action || primaryButton(card) }, { title: "You", body: "Approve, skip, or comment." }];
  return `
    <div class="comic-strip concept-card" data-card-id="${card.id}">
      ${blocks.slice(0, 3).map((block) => `<section><strong>${escapeHtml(block.title)}</strong><p>${escapeHtml(clip(block.body, 110))}</p></section>`).join("")}
      ${renderActions(card)}
    </div>
  `;
}

function renderRoadmap(concept, cards) {
  const groups = groupedCards(cards);
  const card = cards[0];
  return `
    <div class="roadmap-shell">
      ${groups.slice(0, 4).map(([key, items], lane) => `
        <section><h2>${escapeHtml(categoryMeta({ category: key }).label)}</h2>${items.slice(0, 3).map((card) => `
          <article class="road-card concept-card" style="--lane:${lane}" data-card-id="${card.id}">${escapeHtml(clip(card.title, 70))}</article>
        `).join("")}</section>
      `).join("")}
      ${card ? renderActions(card, "road-actions") : ""}
    </div>
  `;
}

function renderHabit(concept, cards, card) {
  return `
    <article class="habit-shell concept-card" data-card-id="${card.id}">
      <div class="rings"><span>7</span><span>14</span><span>30</span></div>
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(clip(card.why, 160))}</p>
      ${renderActions(card)}
    </article>
  `;
}

function renderMarket(concept, cards) {
  return renderShop(concept, cards);
}

function renderOneButton(concept, cards, card) {
  return `
    <article class="one-button-shell concept-card" data-card-id="${card.id}">
      ${renderMeta(card)}
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(clip(card.why, 180))}</p>
      <button class="mega-button" data-action="start" data-card-id="${card.id}">${escapeHtml(primaryButton(card))}</button>
      <button data-action="skip" data-card-id="${card.id}">Skip</button>
      <button data-action="context" data-card-id="${card.id}">Tell agent what to change</button>
    </article>
  `;
}

function renderDraftStudio(concept, cards, card) {
  return `
    <div class="draft-studio concept-card" data-card-id="${card.id}">
      <aside><h2>${escapeHtml(clip(card.title, 70))}</h2><p>${escapeHtml(clip(card.why, 120))}</p></aside>
      <section>${renderBlocks(card)}</section>
      ${renderActions(card)}
    </div>
  `;
}

function renderTeam(concept, cards) {
  return `
    <div class="team-room">
      ${cards.slice(0, 8).map((card) => `
        <article class="person-card concept-card" data-card-id="${card.id}">
          <span>${escapeHtml(categoryMeta(card).short)}</span>
          <strong>${escapeHtml(sourceName(card))}</strong>
          <p>${escapeHtml(clip(card.title, 82))}</p>
          ${renderMiniActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderShelves(concept, cards) {
  const groups = groupedCards(cards);
  const card = cards[0];
  return `
    <div class="shelves">
      ${groups.slice(0, 5).map(([key, items]) => `
        <section><h2>${escapeHtml(categoryMeta({ category: key }).label)}</h2><div>${items.map((card) => `<button data-action="focus" data-card-id="${card.id}">${escapeHtml(clip(card.title, 54))}</button>`).join("")}</div></section>
      `).join("")}
      ${card ? `<article class="concept-card shelf-action" data-card-id="${card.id}">${renderActions(card)}</article>` : ""}
    </div>
  `;
}

function renderReceipt(concept, cards, card) {
  return `
    <article class="receipt-shell concept-card" data-card-id="${card.id}">
      <h2>Agent receipt</h2>
      <p>${escapeHtml(card.title)}</p>
      ${renderBlocks(card)}
      <hr />
      ${renderActions(card)}
    </article>
  `;
}

function renderAuction(concept, cards) {
  return `
    <div class="auction-room">
      ${cards.slice(0, 6).map((card) => `
        <article class="bid-card concept-card" data-card-id="${card.id}">
          <span>${pointsFor(card)}</span>
          <h2>${escapeHtml(clip(card.title, 70))}</h2>
          ${renderMiniActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderLaunch(concept, cards, card) {
  return `
    <div class="launch-shell concept-card" data-card-id="${card.id}">
      <section><h2>${escapeHtml(card.title)}</h2><p>${escapeHtml(clip(card.why, 160))}</p>${renderActions(card)}</section>
      <ol>${["Copy", "Assets", "Post", "Watch", "Reply"].map((step) => `<li>${step}</li>`).join("")}</ol>
    </div>
  `;
}

function renderLetter(concept, cards, card) {
  return `
    <article class="letter-shell concept-card" data-card-id="${card.id}">
      <p>Dear Magnus,</p>
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(clip(card.why, 210))}</p>
      <p>The agent will stay inside approval boundaries unless you tap start.</p>
      ${renderActions(card)}
    </article>
  `;
}

function renderMission(concept, cards, card) {
  return `
    <div class="mission-shell concept-card" data-card-id="${card.id}">
      <section class="orbit">${renderVisual(card, "mission-visual")}</section>
      <section><span>Mission objective</span><h2>${escapeHtml(card.title)}</h2><p>${escapeHtml(clip(card.why, 160))}</p>${renderActions(card)}</section>
    </div>
  `;
}

function renderSports(concept, cards, card) {
  return `
    <article class="sports-shell concept-card" data-card-id="${card.id}">
      ${renderVisual(card, "sports-visual")}
      <h2>${escapeHtml(card.title)}</h2>
      <div class="stats"><span>Impact ${pointsFor(card)}</span><span>${escapeHtml(card.importance)}</span><span>${escapeHtml(sourceName(card))}</span></div>
      ${renderActions(card)}
    </article>
  `;
}

function renderProof(concept, cards, card) {
  return `
    <article class="proof-shell concept-card" data-card-id="${card.id}">
      <section><h2>Evidence</h2>${renderBlocks(card)}</section>
      <section><h2>${escapeHtml(card.title)}</h2><p>${escapeHtml(clip(card.why, 160))}</p>${renderActions(card)}</section>
    </article>
  `;
}

function renderSplitDeck(concept, cards, card) {
  const buttons = cardButtons(card);
  return `
    <div class="splitdeck-shell concept-card" data-card-id="${card.id}">
      ${buttons.slice(0, 2).map((button, index) => `<section><span>Option ${index + 1}</span><h2>${escapeHtml(button.text)}</h2><p>${escapeHtml(clip(card.why, 130))}</p><button data-action="variant" data-card-id="${card.id}" data-index="${index}">Choose</button></section>`).join("")}
      ${renderActions(card)}
    </div>
  `;
}

function renderTiles(concept, cards) {
  return `
    <div class="tile-os">
      ${cards.slice(0, 12).map((card) => `
        <article class="os-tile concept-card" data-card-id="${card.id}">
          <button data-action="focus" data-card-id="${card.id}"><span>${escapeHtml(categoryMeta(card).short)}</span>${escapeHtml(clip(card.title, 48))}</button>
          ${renderMiniActions(card)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderConcierge(concept, cards, card) {
  return `
    <article class="concierge-shell concept-card" data-card-id="${card.id}">
      <span>Concierge proposal</span>
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(clip(card.why, 180))}</p>
      ${renderBlocks(card)}
      ${renderActions(card)}
    </article>
  `;
}

function renderGeneric(concept, cards, card) {
  return renderSplit(concept, cards, card);
}

function renderVisual(card, extra = "") {
  const meta = categoryMeta(card);
  const visual = card.visual || {};
  if (visual.kind === "video" && visual.src) {
    return `<figure class="visual-box ${extra}"><video src="${escapeAttr(visual.src)}" autoplay loop muted playsinline></video></figure>`;
  }
  if (visual.kind === "image" && visual.src) {
    return `<figure class="visual-box ${extra}"><img src="${escapeAttr(visual.src)}" alt="" loading="lazy" /></figure>`;
  }
  return `
    <figure class="visual-box visual-art no-media ${extra}" style="--card-accent:${meta.color}">
      <i></i><i></i><i></i>
      <span>${escapeHtml(meta.short)}</span>
    </figure>
  `;
}

function hasRealVisual(card) {
  return Boolean(card?.visual?.src && ["image", "video"].includes(card.visual.kind));
}

function renderMeta(card) {
  const meta = categoryMeta(card);
  return `
    <div class="meta-line" style="--card-accent:${meta.color}">
      <span>${escapeHtml(meta.label)}</span>
      <strong>${escapeHtml(sourceName(card))}</strong>
    </div>
  `;
}

function renderActions(card, className = "") {
  const choices = agentChoices(card).slice(0, 3);
  return `
    <footer class="action-bar ${className}">
      <div class="agent-buttons">
        ${choices.map((button, index) => `
          <button class="${index === 0 ? "primary-action" : ""}" data-action="start" data-card-id="${card.id}" data-index="${button.index}">
            ${escapeHtml(button.text)}
          </button>
        `).join("")}
      </div>
      <div class="utility-buttons">
        <button data-action="skip" data-card-id="${card.id}">Skip</button>
        <button data-action="context" data-card-id="${card.id}">Add context</button>
      </div>
    </footer>
  `;
}

function renderMiniActions(card) {
  const primary = agentChoices(card)[0];
  return `
    <div class="mini-actions">
      <button data-action="start" data-card-id="${card.id}" data-index="${primary.index}">${escapeHtml(clip(primary.text, 22))}</button>
      <button data-action="skip" data-card-id="${card.id}">Skip</button>
    </div>
  `;
}

function renderBlocks(card) {
  const blocks = Array.isArray(card.blocks) && card.blocks.length ? card.blocks : [
    { title: "Context", body: card.action || card.why || "No extra context yet." },
  ];
  return `
    <div class="block-list">
      ${blocks.slice(0, 3).map((block) => `
        <section>
          <strong>${escapeHtml(block.title || "Detail")}</strong>
          <p>${escapeHtml(clip(block.body || "", 180))}</p>
        </section>
      `).join("")}
    </div>
  `;
}

function activeCards(limit = 100) {
  const pending = state.cards.filter((card) => !["started", "skipped"].includes(decisionFor(card)?.status));
  const cards = pending.length ? pending : state.cards;
  return cards.slice(0, limit);
}

function focusedCard(cards = activeCards(18)) {
  return cards.find((card) => String(card.id) === String(state.focusCardId)) || cards[0] || state.cards[0] || DEMO_CARDS[0];
}

function prioritizeCard(cards, card) {
  if (!card) return cards;
  return [card, ...cards.filter((item) => String(item.id) !== String(card.id))];
}

function groupedCards(cards = activeCards(100)) {
  return Object.entries(cards.reduce((acc, card) => {
    const key = card.category || inferCategory(card);
    acc[key] ||= [];
    acc[key].push(card);
    return acc;
  }, {}));
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

function agentChoices(card) {
  const choices = cardButtons(card)
    .map((button, index) => ({ ...button, index }))
    .filter((button) => button.text.toLowerCase() !== "skip");
  return choices.length ? choices : [{ raw: "Start", text: "Start", index: 0 }];
}

function selectedRaw(card) {
  return cardButtons(card)[selectedIndex(card)]?.raw || "";
}

function primaryButton(card) {
  return agentChoices(card)[0]?.text || "Start";
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
  const copy = {
    ...source,
    id: `local-${Date.now()}`,
    title: card ? `Sharper version: ${clip(card.title, 52)}` : source.title,
    why: card ? `A local remix with a clearer first action for ${sourceName(card)}.` : source.why,
    source: `miniapp-local:${Date.now()}`,
    source_label: "Local remix",
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

  if (action === "focus-next" || action === "focus-prev") {
    const cards = activeCards(100);
    if (!cards.length) return;
    const current = cards.findIndex((item) => String(item.id) === String(state.focusCardId));
    const fallback = current >= 0 ? current : 0;
    const direction = action === "focus-next" ? 1 : -1;
    const next = cards[(fallback + direction + cards.length) % cards.length];
    if (next) {
      state.focusCardId = next.id;
      haptic("selectionChanged");
      render();
    }
    return;
  }
  if (action === "focus" && card) {
    state.focusCardId = card.id;
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
    if (target.dataset.index !== undefined) {
      state.selected[String(card.id)] = Number(target.dataset.index || 0);
    }
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
    toast("Skipped.");
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
  if (action === "generate") {
    remixCard(focusedCard());
    if (initData) api("/api/generate", { method: "POST", body: "{}" }).catch(() => {});
  }
});

await refresh();
