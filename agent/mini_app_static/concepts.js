const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

try {
  tg?.setHeaderColor?.("#090b10");
  tg?.setBackgroundColor?.("#090b10");
  tg?.setBottomBarColor?.("#090b10");
} catch {
  // Older Telegram clients do not expose every color API.
}

const params = new URLSearchParams(window.location.search);
if (params.get("dev") === "1") localStorage.buxMiniAppDev = "1";
const initData = tg?.initData || (localStorage.buxMiniAppDev === "1" ? "dev" : "");
const app = document.querySelector("#app");
const toastEl = document.querySelector("#toast");
const STORE_KEY = "buxMiniAppConceptLab:v3";

const CONCEPTS = [
  {
    id: 1,
    slug: "reels",
    name: "AI Reels",
    score: "visual scroll",
    line: "A TikTok-like work feed. One image, one decision, no dashboard thinking.",
  },
  {
    id: 2,
    slug: "quest",
    name: "Quest Casino",
    score: "most addictive",
    line: "A warmer version of the quest board: jackpots, XP, streaks, and useful work.",
  },
  {
    id: 3,
    slug: "slot",
    name: "Idea Slot",
    score: "fast ideas",
    line: "Spin through cached ideas, then approve, skip, or remix without waiting on generation.",
  },
  {
    id: 4,
    slug: "numbers",
    name: "Founder Scoreboard",
    score: "big numbers",
    line: "The big metrics stay on top. Cards explain exactly what moves a number next.",
  },
  {
    id: 5,
    slug: "stories",
    name: "Stories Board",
    score: "social",
    line: "Telegram work stories: colorful channels, posters, quick reactions, and follow-ups.",
  },
  {
    id: 6,
    slug: "speed",
    name: "Speed Tap",
    score: "quickest loop",
    line: "A very fast click-through lane for clearing many cards without losing context.",
  },
  {
    id: 7,
    slug: "radar",
    name: "Goal Radar",
    score: "futuristic",
    line: "A radar overview grouped by goals. Tap a blip to inspect and act.",
  },
  {
    id: 8,
    slug: "wheel",
    name: "Action Wheel",
    score: "playful",
    line: "A roulette-like wheel for discovering the next high-leverage idea.",
  },
  {
    id: 9,
    slug: "gallery",
    name: "Poster Gallery",
    score: "most visual",
    line: "Cards become large collectible posters so the idea is understood immediately.",
  },
  {
    id: 10,
    slug: "os",
    name: "Goal OS",
    score: "overview",
    line: "Not another chat. A control room for goals, permissions, cadence, and momentum.",
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
  spinIndex: 0,
  wheelTurns: 0,
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
    };
  } catch {
    return { decisions: {}, cards: [], notes: {} };
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
  return [...generated, ...normalized, ...demos];
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
    image_text: raw.image_text || fallback.image_text || raw.title || "BUX\ncard",
    category: raw.category || inferCategory(raw),
    demo,
    visual: raw.visual || { kind: "none" },
    created_at: raw.created_at || Math.round(Date.now() / 1000),
  };
}

function ensureButtons(buttons) {
  const labels = (Array.isArray(buttons) ? buttons : []).map((item) => String(item || "").trim()).filter(Boolean);
  const defaults = ["Start", "Skip", "Remix"];
  for (const label of defaults) {
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
  document.body.className = `concept-${concept.id} theme-${concept.slug}`;
  app.className = `concept-shell concept-shell-${concept.slug}`;
  const renderers = {
    1: renderReels,
    2: renderQuestCasino,
    3: renderSlotMachine,
    4: renderNumbers,
    5: renderStories,
    6: renderSpeedTap,
    7: renderRadar,
    8: renderWheel,
    9: renderGallery,
    10: renderGoalOS,
  };
  app.innerHTML = `
    ${renderLabNav(concept)}
    ${renderers[concept.id]?.(concept) || ""}
  `;
}

function renderHub() {
  return `
    <section class="hub-hero">
      <p class="micro">bux experiment lab</p>
      <h1>10 sharper Mini App experiences.</h1>
      <p>Same AI action cards, ten different interaction loops: reels, slot machine, radar, roulette, posters, speed tapping, and a goal OS.</p>
      <div class="hub-stats">
        <span>${state.cards.length} cards loaded</span>
        <span>${Object.keys(groupByCategory()).length} goals/categories</span>
        <span>${state.apiOnline ? "live data" : "demo fallback"}</span>
      </div>
      <button class="mega-spin" data-action="spin-global">Spin a new idea</button>
    </section>
    <section class="concept-grid">
      ${CONCEPTS.map((concept) => `
        <a class="concept-tile concept-tile-${concept.id}" href="${conceptPath(concept.id)}">
          <span class="tile-kicker">Mini App ${concept.id}</span>
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

function renderReels(concept) {
  const cards = activeCards(10);
  return `
    <section class="reels-shell">
      <div class="reels-intro">
        <span>Mini App 1</span>
        <h1>${escapeHtml(concept.name)}</h1>
        <p>${escapeHtml(concept.line)}</p>
      </div>
      <div class="reel-feed">
        ${cards.map((card, index) => `
          <article class="reel-card" data-card-id="${card.id}">
            ${renderVisual(card, "reel-visual")}
            <div class="reel-copy">
              <span>${escapeHtml(categoryMeta(card).label)} / ${escapeHtml(sourceName(card))}</span>
              <h2>${escapeHtml(card.title)}</h2>
              <p>${escapeHtml(card.why)}</p>
              <div class="reel-buttons">
                ${actionButton("start", card, selectedLabel(card), "primary")}
                ${actionButton("skip", card, "Skip", "dark")}
                ${actionButton("remix", card, "Remix", "glass")}
              </div>
            </div>
            <div class="reel-side">
              <button data-action="focus" data-card-id="${card.id}">${String(index + 1).padStart(2, "0")}</button>
              <button data-action="context" data-card-id="${card.id}">Tune</button>
              <button data-action="remix" data-card-id="${card.id}">New</button>
            </div>
          </article>
        `).join("") || emptyPanel()}
      </div>
    </section>
  `;
}

function renderQuestCasino(concept) {
  const cards = activeCards(6);
  return `
    <section class="quest-casino">
      <header class="casino-hero">
        <div>
          <p class="micro">Mini App 2 / ${escapeHtml(concept.score)}</p>
          <h1>Clear quests. Win momentum.</h1>
          <p>${escapeHtml(concept.line)}</p>
        </div>
        <div class="jackpot">
          <span>XP</span>
          <strong>${xpScore()}</strong>
          <small>${cards.length} quests open</small>
        </div>
      </header>
      <div class="quest-table">
        ${cards.map((card, index) => `
          <article class="quest-ticket ${index === 0 ? "hot" : ""}">
            <div class="ticket-rank">${index + 1}</div>
            ${renderVisual(card, "ticket-visual")}
            <div class="ticket-copy">
              <span>${escapeHtml(categoryMeta(card).label)}</span>
              <h2>${escapeHtml(card.title)}</h2>
              <p>${escapeHtml(card.why)}</p>
              <div class="ticket-actions">
                ${variantButtons(card)}
                ${actionButton("start", card, "Claim quest", "primary")}
                ${actionButton("skip", card, "Fold", "quiet")}
              </div>
            </div>
          </article>
        `).join("") || emptyPanel()}
      </div>
    </section>
  `;
}

function renderSlotMachine(concept) {
  const card = focusedCard() || activeCards(1)[0];
  const cards = activeCards(10);
  const prev = cards[(cards.indexOf(card) - 1 + cards.length) % Math.max(1, cards.length)] || card;
  const next = cards[(cards.indexOf(card) + 1) % Math.max(1, cards.length)] || card;
  return `
    <section class="slot-shell">
      <div class="slot-marquee">
        <p class="micro">Mini App 3 / cached idea generator</p>
        <h1>${escapeHtml(concept.name)}</h1>
        <p>${escapeHtml(concept.line)}</p>
      </div>
      <div class="slot-machine ${state.local.lastSpin ? "spun" : ""}">
        <div class="slot-window">
          ${slotReel(prev, "Goal")}
          ${slotReel(card, "Action", true)}
          ${slotReel(next, "Reward")}
        </div>
        <button class="spin-lever" data-action="spin">Spin</button>
      </div>
      <article class="slot-result">
        ${card ? `
          ${renderVisual(card, "slot-poster")}
          <div>
            <span>${escapeHtml(sourceName(card))}</span>
            <h2>${escapeHtml(card.title)}</h2>
            <p>${escapeHtml(card.why)}</p>
            <div class="slot-actions">
              ${actionButton("start", card, "Yes, run it", "primary")}
              ${actionButton("skip", card, "No", "dark")}
              ${actionButton("remix", card, "Generate similar", "glass")}
            </div>
          </div>
        ` : emptyPanel()}
      </article>
    </section>
  `;
}

function slotReel(card, label, active = false) {
  return `
    <div class="slot-reel ${active ? "active" : ""}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(card ? clip(card.title, 34) : "New idea")}</strong>
      <small>${escapeHtml(card ? categoryMeta(card).label : "bux")}</small>
    </div>
  `;
}

function renderNumbers(concept) {
  const cards = activeCards(5);
  const grouped = groupByCategory();
  return `
    <section class="numbers-shell">
      <header class="numbers-top">
        <div>
          <p class="micro">Mini App 4 / ${escapeHtml(concept.score)}</p>
          <h1>Numbers first. Cards underneath.</h1>
        </div>
        <p>${escapeHtml(concept.line)}</p>
      </header>
      <div class="number-wall">
        <article><span>open</span><strong>${state.stats.open || activeCards(100).length}</strong><small>waiting moves</small></article>
        <article><span>goals</span><strong>${Object.keys(grouped).length}</strong><small>active lanes</small></article>
        <article><span>done</span><strong>${state.stats.done || localActivity().length}</strong><small>decisions</small></article>
      </div>
      <div class="number-runway">
        ${cards.map((card) => `
          <article class="runway-card">
            ${renderVisual(card, "runway-visual")}
            <div>
              <span>${escapeHtml(categoryMeta(card).short)} / ${escapeHtml(sourceName(card))}</span>
              <h2>${escapeHtml(card.title)}</h2>
              <p>${escapeHtml(card.why)}</p>
              <div>${actionButton("start", card, selectedLabel(card), "primary")}${actionButton("skip", card, "Later", "quiet")}</div>
            </div>
          </article>
        `).join("") || emptyPanel()}
      </div>
    </section>
  `;
}

function renderStories(concept) {
  const grouped = Object.entries(groupByCategory());
  const cards = activeCards(8);
  return `
    <section class="stories-shell">
      <header class="stories-header">
        <p class="micro">Mini App 5 / social work feed</p>
        <h1>${escapeHtml(concept.name)}</h1>
        <p>${escapeHtml(concept.line)}</p>
      </header>
      <div class="story-bubbles">
        ${grouped.map(([key, items]) => `
          <button class="story-bubble" style="--bubble:${categoryMeta({ category: key }).color}" data-action="focus" data-card-id="${items[0]?.id || ""}">
            <span>${escapeHtml(categoryMeta({ category: key }).short)}</span>
            <strong>${escapeHtml(categoryMeta({ category: key }).label)}</strong>
            <small>${items.length}</small>
          </button>
        `).join("")}
      </div>
      <div class="social-feed">
        ${cards.map((card) => `
          <article class="social-post">
            <header>
              <div class="avatar-chip">${escapeHtml(categoryMeta(card).short)}</div>
              <div><strong>${escapeHtml(sourceName(card))}</strong><span>${escapeHtml(relative(card.created_at))}</span></div>
              <button data-action="remix" data-card-id="${card.id}">Remix</button>
            </header>
            ${renderVisual(card, "post-visual")}
            <h2>${escapeHtml(card.title)}</h2>
            <p>${escapeHtml(card.why)}</p>
            <footer>
              ${actionButton("start", card, selectedLabel(card), "primary")}
              ${actionButton("context", card, "Comment", "glass")}
              ${actionButton("skip", card, "Skip", "quiet")}
            </footer>
          </article>
        `).join("") || emptyPanel()}
      </div>
    </section>
  `;
}

function renderSpeedTap(concept) {
  const cards = activeCards(6);
  const card = focusedCard() || cards[0];
  const progress = Math.min(100, Math.round((localActivity().length / Math.max(1, state.cards.length)) * 100));
  return `
    <section class="speed-shell">
      <aside class="speed-rail">
        <p class="micro">Mini App 6</p>
        <h1>Tap through a stack.</h1>
        <p>${escapeHtml(concept.line)}</p>
        <div class="speed-meter"><span style="width:${progress}%"></span></div>
        <strong>${progress}% cleared locally</strong>
      </aside>
      <article class="speed-card">
        ${card ? `
          ${renderVisual(card, "speed-visual")}
          <div class="speed-copy">
            <span>${escapeHtml(categoryMeta(card).label)} / ${escapeHtml(sourceName(card))}</span>
            <h2>${escapeHtml(card.title)}</h2>
            <p>${escapeHtml(card.why)}</p>
            <div class="speed-actions">
              ${actionButton("skip", card, "No", "danger")}
              ${actionButton("remix", card, "Different", "glass")}
              ${actionButton("start", card, "Yes", "primary")}
            </div>
          </div>
        ` : emptyPanel()}
      </article>
      <div class="speed-queue">
        ${cards.map((item, index) => `
          <button class="${String(item.id) === String(card?.id) ? "active" : ""}" data-action="focus" data-card-id="${item.id}">
            <span>${index + 1}</span>${escapeHtml(clip(item.title, 42))}
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderRadar(concept) {
  const cards = activeCards(10);
  const focus = focusedCard() || cards[0];
  const groups = Object.entries(groupByCategory());
  return `
    <section class="radar-shell">
      <div class="radar-intro">
        <p class="micro">Mini App 7 / loved direction</p>
        <h1>${escapeHtml(concept.name)}</h1>
        <p>${escapeHtml(concept.line)}</p>
        <div class="goal-chips">
          ${groups.map(([key, items]) => `<span style="--chip:${categoryMeta({ category: key }).color}">${escapeHtml(categoryMeta({ category: key }).label)} ${items.length}</span>`).join("")}
        </div>
      </div>
      <div class="radar-map">
        <div class="radar-grid"></div>
        <div class="radar-sweep"></div>
        ${cards.map((card, index) => {
          const pos = radarPosition(index, card);
          return `
            <button class="radar-blip ${String(card.id) === String(focus?.id) ? "active" : ""}" style="left:${pos.x}%;top:${pos.y}%;--blip:${categoryMeta(card).color}" data-action="focus" data-card-id="${card.id}">
              <span>${escapeHtml(categoryMeta(card).short)}</span>
              <strong>${escapeHtml(clip(card.title, 28))}</strong>
            </button>
          `;
        }).join("")}
        <div class="radar-core">bux</div>
      </div>
      <aside class="radar-detail">
        ${focus ? renderFocusPanel(focus, "Pull into work") : emptyPanel()}
      </aside>
    </section>
  `;
}

function renderWheel(concept) {
  const cards = activeCards(10);
  const card = focusedCard() || cards[0];
  return `
    <section class="wheel-shell">
      <header class="wheel-header">
        <p class="micro">Mini App 8 / roulette discovery</p>
        <h1>${escapeHtml(concept.name)}</h1>
        <p>${escapeHtml(concept.line)}</p>
      </header>
      <div class="wheel-layout">
        <div class="wheel" style="--turn:${state.wheelTurns * 38}deg">
          ${cards.slice(0, 8).map((item, index) => `
            <button class="wheel-spoke spoke-${index + 1}" data-action="focus" data-card-id="${item.id}">
              <span>${escapeHtml(categoryMeta(item).short)}</span>
            </button>
          `).join("")}
          <button class="wheel-center" data-action="spin-wheel">Spin</button>
        </div>
        <article class="wheel-card">
          ${card ? `
            ${renderVisual(card, "wheel-visual")}
            <span>${escapeHtml(categoryMeta(card).label)}</span>
            <h2>${escapeHtml(card.title)}</h2>
            <p>${escapeHtml(card.why)}</p>
            <div>${actionButton("start", card, "Run this", "primary")}${actionButton("skip", card, "Pass", "dark")}${actionButton("remix", card, "Similar", "glass")}</div>
          ` : emptyPanel()}
        </article>
      </div>
    </section>
  `;
}

function renderGallery(concept) {
  const cards = activeCards(10);
  return `
    <section class="gallery-shell">
      <header class="gallery-header">
        <p class="micro">Mini App 9 / visual first</p>
        <h1>${escapeHtml(concept.name)}</h1>
        <p>${escapeHtml(concept.line)}</p>
      </header>
      <div class="poster-grid">
        ${cards.map((card, index) => `
          <article class="poster-card poster-${(index % 5) + 1}">
            ${renderVisual(card, "poster-visual")}
            <div class="poster-caption">
              <span>${escapeHtml(sourceName(card))}</span>
              <h2>${escapeHtml(card.title)}</h2>
              <div>${actionButton("start", card, selectedLabel(card), "primary")}${actionButton("skip", card, "Skip", "quiet")}</div>
            </div>
          </article>
        `).join("") || emptyPanel()}
      </div>
    </section>
  `;
}

function renderGoalOS(concept) {
  const grouped = Object.entries(groupByCategory());
  const focus = focusedCard() || activeCards(1)[0];
  return `
    <section class="os-shell">
      <header class="os-header">
        <div>
          <p class="micro">Mini App 10 / not chat</p>
          <h1>${escapeHtml(concept.name)}</h1>
          <p>${escapeHtml(concept.line)}</p>
        </div>
        <button data-action="generate" class="os-scan">Scan for 10</button>
      </header>
      <div class="os-grid">
        <article class="os-card permission">
          <span>permission boundary</span>
          <strong>Private work first. Ask before visible side effects.</strong>
          <p>Buttons feel instant here, then sync to the backend when Telegram auth and writes are available.</p>
        </article>
        <article class="os-card cadence">
          <span>cadence</span>
          <strong>${state.me?.settings?.cadence || "On demand + scheduled goals"}</strong>
          <button data-action="autopilot">Start private work</button>
        </article>
        <article class="os-card stats">
          <span>momentum</span>
          <div class="stat-row"><strong>${activeCards(100).length}</strong><small>open</small></div>
          <div class="stat-row"><strong>${localActivity().length}</strong><small>local taps</small></div>
        </article>
        <article class="os-card focus">
          ${focus ? renderFocusPanel(focus, "Approve") : emptyPanel()}
        </article>
        <article class="os-card goal-list">
          <span>goals</span>
          ${grouped.map(([key, items]) => `
            <button data-action="focus" data-card-id="${items[0]?.id || ""}">
              <i style="background:${categoryMeta({ category: key }).color}"></i>
              ${escapeHtml(categoryMeta({ category: key }).label)}
              <b>${items.length}</b>
            </button>
          `).join("")}
        </article>
      </div>
    </section>
  `;
}

function renderFocusPanel(card, cta) {
  return `
    ${renderVisual(card, "focus-visual")}
    <span>${escapeHtml(categoryMeta(card).label)} / ${escapeHtml(sourceName(card))}</span>
    <h2>${escapeHtml(card.title)}</h2>
    <p>${escapeHtml(card.why)}</p>
    <div class="focus-actions">
      ${variantButtons(card)}
      ${actionButton("start", card, cta, "primary")}
      ${actionButton("skip", card, "Skip", "dark")}
      ${actionButton("remix", card, "Remix", "glass")}
    </div>
  `;
}

function renderVisual(card, className = "") {
  const visual = card.visual || {};
  if (visual.kind === "image" && visual.src) {
    return `<figure class="card-visual ${className}"><img src="${escapeAttr(visual.src)}" alt="" loading="lazy" /></figure>`;
  }
  const lines = String(card.image_text || card.title || "BUX\ncard").split(/\n+/).filter(Boolean);
  const top = lines[0] || categoryMeta(card).label;
  const bottom = lines.slice(1).join(" ") || clip(card.title, 24);
  return `
    <figure class="card-visual visual-fallback ${className}" style="--visual:${categoryMeta(card).color}">
      <span>${escapeHtml(categoryMeta(card).short)}</span>
      <strong>${escapeHtml(top)}</strong>
      <small>${escapeHtml(bottom)}</small>
    </figure>
  `;
}

function variantButtons(card) {
  return cardButtons(card).slice(0, 3).map((item, index) => `
    <button class="variant ${selectedIndex(card) === index ? "active" : ""}" data-action="variant" data-card-id="${card.id}" data-index="${index}">
      ${escapeHtml(item.text)}
    </button>
  `).join("");
}

function actionButton(action, card, label, style = "") {
  const id = card?.id || "";
  return `<button class="action ${action} ${style}" data-action="${action}" data-card-id="${id}" ${id ? "" : "disabled"}>${escapeHtml(label || action)}</button>`;
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

function selectedLabel(card) {
  return cardButtons(card)[selectedIndex(card)]?.text || "Start";
}

function selectedRaw(card) {
  return cardButtons(card)[selectedIndex(card)]?.raw || "";
}

function cardButtons(card) {
  return ensureButtons(card?.buttons).map((item) => ({ raw: item, text: clip(buttonText(item), 24) }));
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
  saveLocalState();
  state.focusCardId = activeCards(1)[0]?.id || state.cards[0]?.id || null;
}

function localActivity() {
  return Object.entries(state.local.decisions)
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => Number(b.at || 0) - Number(a.at || 0));
}

function xpScore() {
  return String(1200 + localActivity().length * 175 + activeCards(100).length * 40).padStart(4, "0");
}

function spinToNext() {
  const cards = activeCards(100);
  if (!cards.length) return null;
  state.spinIndex = (state.spinIndex + 1) % cards.length;
  state.focusCardId = cards[state.spinIndex].id;
  state.local.lastSpin = Date.now();
  saveLocalState();
  return cards[state.spinIndex];
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
  toast("New local idea generated.");
  render();
}

function radarPosition(index, card) {
  const seed = Array.from(String(card.id)).reduce((sum, char) => sum + char.charCodeAt(0), index * 17);
  const angle = ((seed * 47) % 360) * (Math.PI / 180);
  const radius = 18 + ((seed * 19) % 34);
  return {
    x: Math.round(50 + Math.cos(angle) * radius),
    y: Math.round(50 + Math.sin(angle) * radius),
  };
}

function relative(ts) {
  const value = Number(ts || 0);
  if (!value) return "now";
  const minutes = Math.max(1, Math.round((Date.now() / 1000 - value) / 60));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
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
  return `<article class="empty-panel"><strong>No cards yet</strong><p>Spin, generate, or connect a tool to fill this prototype.</p></article>`;
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
    return;
  }
  if (action === "variant" && card) {
    state.selected[String(card.id)] = Number(target.dataset.index || 0);
    state.focusCardId = card.id;
    haptic("selectionChanged");
    render();
    return;
  }
  if (action === "start" && card) {
    markDecision(card, "started", selectedRaw(card));
    haptic("success");
    toast(`Started: ${selectedLabel(card)}`);
    render();
    syncStart(card);
    return;
  }
  if (action === "skip" && card) {
    markDecision(card, "skipped", "skip");
    haptic("medium");
    toast("Skipped. Next card loaded.");
    render();
    syncSkip(card);
    return;
  }
  if (action === "context" && card) {
    const comment = window.prompt("What should the agent optimize for?", "Make it more concrete and visual.");
    if (!comment?.trim()) return;
    state.local.notes[String(card.id)] = [...(state.local.notes[String(card.id)] || []), comment.trim()];
    saveLocalState();
    haptic("success");
    toast("Tuning note saved.");
    syncComment(card, comment.trim());
    return;
  }
  if (action === "remix") {
    remixCard(card);
    return;
  }
  if (action === "spin" || action === "spin-global") {
    const next = spinToNext();
    haptic("heavy");
    toast(next ? `Spun: ${clip(next.title, 42)}` : "No cards to spin.");
    render();
    return;
  }
  if (action === "spin-wheel") {
    state.wheelTurns += 1;
    const next = spinToNext();
    haptic("heavy");
    toast(next ? `Wheel picked: ${clip(next.title, 42)}` : "No cards to spin.");
    render();
    return;
  }
  if (action === "generate") {
    remixCard(focusedCard());
    if (initData) {
      api("/api/generate", { method: "POST", body: "{}" }).catch(() => {});
    }
    return;
  }
  if (action === "autopilot") {
    haptic("success");
    toast("Private work staged.");
    if (initData) {
      api("/api/autopilot", { method: "POST", body: "{}" }).catch(() => {});
    }
  }
});

await refresh();
