const AUTH_STORAGE_KEY = "finance-auth-v1";
const LEGACY_FINANCE_STORAGE_KEY = "finance-summary-v1";
const THEME_KEY = "finance-theme";
const SUPABASE_URL = "https://ixxtzlrrpitsnskhnsew.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_BHG2D4weWXsm2LKbH6AIxg_dPBJ0Fnh";
const EXTERNAL_REFRESH_INTERVAL_MS = 60 * 60 * 1000;
const STATIC_METRICS_URL = "https://raw.githubusercontent.com/coldoutt/finsun/main/metrics.json";
const FRANKFURTER_API_URL = "https://api.frankfurter.dev/v2";
const COINPAPRIKA_API_URL = "https://api.coinpaprika.com/v1";
const MARKET_DATA_TIMEOUT_MS = 8000;
const CRYPTO_SEARCH_DEBOUNCE_MS = 280;
const APP_TABS = ["dashboard", "budget", "assets", "history", "settings"];
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const ASSET_GROUPS = [
  {
    id: "banks",
    label: "Банки",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 9 9-5 9 5" />
        <path d="M4 9h16" />
        <path d="M6 9v8M10 9v8M14 9v8M18 9v8" />
        <path d="M3 17h18M2 20h20" />
      </svg>
    `,
    description: "Банковские и накопительные счета, а также вклады.",
    defaultType: "account",
    types: [
      ["account", "Банковский счет"],
      ["savings", "Накопительный счет"],
      ["deposit", "Вклад"],
    ],
  },
  {
    id: "cash",
    label: "Наличные",
    icon: "₽",
    description: "Наличные рубли и иностранные валюты с автоматическим курсом к рублю.",
    defaultType: "currency",
    types: [["currency", "Валюта"]],
  },
  {
    id: "crypto",
    label: "Крипта",
    icon: "₿",
    description: "Криптовалюты с расчетом стоимости по количеству монет и цене в рублях.",
    defaultType: "crypto",
    types: [["crypto", "Криптовалюта"]],
  },
  {
    id: "investments",
    label: "Биржа",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 17 5-5 3 3 6-7" />
        <path d="M15 8h4v4" />
      </svg>
    `,
    description: "Брокерские счета и индивидуальные инвестиционные счета.",
    defaultType: "brokerage",
    types: [
      ["brokerage", "Брокерский счет"],
      ["iis", "ИИС"],
    ],
  },
  {
    id: "property",
    label: "Имущество",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 11 8-7 8 7" />
        <path d="M6.5 10.5V20h11v-9.5" />
        <path d="M10 20v-5h4v5" />
      </svg>
    `,
    description: "Жилая и коммерческая недвижимость, земля и другие объекты.",
    defaultType: "apartment",
    types: [
      ["apartment", "Квартира"],
      ["house", "Дом"],
      ["commercial", "Коммерческая"],
      ["land", "Земельный участок"],
      ["property-other", "Другой объект"],
    ],
  },
  {
    id: "other",
    label: "Прочее",
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    `,
    description: "Долги и другие активы, которые не относятся к основным разделам.",
    defaultType: "other",
    types: [["other", "Другой актив"]],
  },
];

const DEFAULT_FIAT_CURRENCY_OPTIONS = [
  { code: "USD", label: "USD — доллар США" },
  { code: "EUR", label: "EUR — евро" },
  { code: "JPY", label: "JPY — японская иена" },
  { code: "GBP", label: "GBP — британский фунт" },
  { code: "CNY", label: "CNY — китайский юань" },
  { code: "CHF", label: "CHF — швейцарский франк" },
  { code: "AUD", label: "AUD — австралийский доллар" },
  { code: "CAD", label: "CAD — канадский доллар" },
  { code: "HKD", label: "HKD — гонконгский доллар" },
  { code: "SGD", label: "SGD — сингапурский доллар" },
];
const PREFERRED_FIAT_CURRENCY_CODES = ["RUB", "USD", "EUR", "JPY", "GBP", "CNY", "CHF", "AUD", "CAD", "HKD", "SGD"];
const FALLBACK_FIAT_CURRENCY_CODES = `
  AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BHD BIF BMD BND BOB BRL BSD
  BTN BWP BYN BZD CAD CDF CHF CLP CNH CNY COP CRC CUP CVE CZK DJF DKK DOP DZD EGP
  ERN ETB EUR FJD FKP GBP GEL GGP GHS GIP GMD GNF GTQ GYD HKD HNL HTG HUF IDR ILS
  IMP INR IQD IRR ISK JEP JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP
  LKR LRD LSL LYD MAD MDL MGA MKD MMK MNT MOP MRO MRU MUR MVR MWK MXN MYR MZN NAD
  NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RON RSD RWF SAR SBD SCR
  SDG SEK SGD SHP SLE SOS SRD SSP STN SVC SYP SZL THB TJS TMT TND TOP TRY TTD TWD
  TZS UAH UGX USD UYU UZS VES VND VUV WST XAF XAG XAU XCD XCG XDR XOF XPD XPF XPT
  YER ZAR ZMW ZWG
`.trim().split(/\s+/);
const RUBLE_CURRENCY_OPTION = { code: "RUB", label: "RUB — российский рубль" };
const DEFAULT_CRYPTO_CURRENCY_OPTIONS = [
  { id: "btc-bitcoin", code: "BTC", name: "биткоин", label: "BTC — биткоин", rank: 1 },
  { id: "eth-ethereum", code: "ETH", name: "эфириум", label: "ETH — эфириум", rank: 2 },
  { id: "usdt-tether", code: "USDT", name: "Tether", label: "USDT — Tether", rank: 3 },
  { id: "toncoin-the-open-network", code: "TON", name: "тонкоин", label: "TON — тонкоин", rank: 29 },
  { id: "sol-solana", code: "SOL", name: "Solana", label: "SOL — Solana", rank: 0 },
  { id: "bnb-binance-coin", code: "BNB", name: "BNB", label: "BNB — BNB", rank: 0 },
  { id: "usdc-usd-coin", code: "USDC", name: "USD Coin", label: "USDC — USD Coin", rank: 0 },
];
const LEGACY_FIAT_CURRENCIES = ["USD", "EUR", "CNY", "HKD", "THB", "GBP", "CHF", "JPY", "AED", "TRY"];
const YEAR_SELECT_START = 2018;
const YEAR_SELECT_FUTURE_OFFSET = 5;

let state = {
  records: [],
  currentRows: [],
  budgets: [],
};
let budgetDraft = null;
let chartRange = "3y";
let activeAssetGroup = "banks";
let fiatCurrencyOptions = createFallbackFiatCurrencyOptions();
let cryptoCurrencyOptions = [...DEFAULT_CRYPTO_CURRENCY_OPTIONS];
let cryptoSearchTimer = null;
let cryptoSearchSequence = 0;
const cryptoSearchCache = new Map();
const pendingAssetRateRequests = new Map();
let expandedHistoryYears = new Set();
let collapsedAssetCategories = new Set();
let historyInitialized = false;
let chartHitAreas = [];
let chartHoverIndex = null;
let chartSelectedIndex = null;
let saveNoticeTimer = null;
let assetSortable = null;
let authState = {
  provider: "supabase",
  user: null,
};
let authMode = "login";
let passwordRecoveryActive = detectPasswordRecoveryRedirect();

const els = {
  totalMetric: document.querySelector("#totalMetric"),
  monthDeltaMetric: document.querySelector("#monthDeltaMetric"),
  yearDeltaMetric: document.querySelector("#yearDeltaMetric"),
  inflationMetric: document.querySelector("#inflationMetric"),
  inflationMeta: document.querySelector("#inflationMeta"),
  usdRateMetric: document.querySelector("#usdRateMetric"),
  usdRateMeta: document.querySelector("#usdRateMeta"),
  eurRateMetric: document.querySelector("#eurRateMetric"),
  eurRateMeta: document.querySelector("#eurRateMeta"),
  yearInput: document.querySelector("#yearInput"),
  monthInput: document.querySelector("#monthInput"),
  assetGroupNav: document.querySelector("#assetGroupNav"),
  assetEditorIcon: document.querySelector("#assetEditorIcon"),
  assetEditorTitle: document.querySelector("#assetEditorTitle"),
  assetEditorDescription: document.querySelector("#assetEditorDescription"),
  assetGroupTotal: document.querySelector("#assetGroupTotal"),
  budgetYearInput: document.querySelector("#budgetYearInput"),
  budgetMonthInput: document.querySelector("#budgetMonthInput"),
  budgetSourceNote: document.querySelector("#budgetSourceNote"),
  budgetIncomeRows: document.querySelector("#budgetIncomeRows"),
  budgetExpenseRows: document.querySelector("#budgetExpenseRows"),
  budgetIncomeActual: document.querySelector("#budgetIncomeActual"),
  budgetIncomePlan: document.querySelector("#budgetIncomePlan"),
  budgetExpenseActual: document.querySelector("#budgetExpenseActual"),
  budgetExpensePlan: document.querySelector("#budgetExpensePlan"),
  budgetFreeActual: document.querySelector("#budgetFreeActual"),
  budgetFreePlan: document.querySelector("#budgetFreePlan"),
  budgetIncomePlanTotal: document.querySelector("#budgetIncomePlanTotal"),
  budgetIncomeActualTotal: document.querySelector("#budgetIncomeActualTotal"),
  budgetIncomeDifferenceTotal: document.querySelector("#budgetIncomeDifferenceTotal"),
  budgetExpensePlanTotal: document.querySelector("#budgetExpensePlanTotal"),
  budgetExpenseActualTotal: document.querySelector("#budgetExpenseActualTotal"),
  budgetExpenseDifferenceTotal: document.querySelector("#budgetExpenseDifferenceTotal"),
  assetRows: document.querySelector("#assetRows"),
  assetTotalCell: document.querySelector("#assetTotalCell"),
  historyRows: document.querySelector("#historyRows"),
  chart: document.querySelector("#totalChart"),
  chartTooltip: document.querySelector("#chartTooltip"),
  assetStructureRows: document.querySelector("#assetStructureRows"),
  structureTooltip: document.querySelector("#structureTooltip"),
  assetStructurePeriod: document.querySelector("#assetStructurePeriod"),
  assetStructureTotal: document.querySelector("#assetStructureTotal"),
  saveNotice: document.querySelector("#saveNotice"),
  authEmailInput: document.querySelector("#authEmailInput"),
  authEmailField: document.querySelector("#authEmailField"),
  authPasswordInput: document.querySelector("#authPasswordInput"),
  authPasswordField: document.querySelector("#authPasswordField"),
  authPasswordLabel: document.querySelector("#authPasswordLabel"),
  authPasswordConfirmInput: document.querySelector("#authPasswordConfirmInput"),
  authPasswordConfirmField: document.querySelector("#authPasswordConfirmField"),
  authFirstNameInput: document.querySelector("#authFirstNameInput"),
  authLastNameInput: document.querySelector("#authLastNameInput"),
  authRegisterFields: document.querySelector("#authRegisterFields"),
  authFormTitle: document.querySelector("#authFormTitle"),
  authFormDescription: document.querySelector("#authFormDescription"),
  authInlineMessage: document.querySelector("#authInlineMessage"),
  authModePrompt: document.querySelector("#authModePrompt"),
  authModeToggleBtn: document.querySelector("#authModeToggleBtn"),
  registerBtn: document.querySelector("#registerBtn"),
  loginBtn: document.querySelector("#loginBtn"),
  forgotPasswordBtn: document.querySelector("#forgotPasswordBtn"),
  requestPasswordResetBtn: document.querySelector("#requestPasswordResetBtn"),
  updatePasswordBtn: document.querySelector("#updatePasswordBtn"),
  logoutBtn: document.querySelector("#logoutBtn"),
  saveProfileBtn: document.querySelector("#saveProfileBtn"),
  profileFirstNameInput: document.querySelector("#profileFirstNameInput"),
  profileLastNameInput: document.querySelector("#profileLastNameInput"),
  accountLoginForm: document.querySelector("#accountLoginForm"),
  accountSession: document.querySelector("#accountSession"),
  accountStatus: document.querySelector("#accountStatus"),
  accountNote: document.querySelector("#accountNote"),
  sidebarLoginBtn: document.querySelector("#sidebarLoginBtn"),
  sidebarUserBtn: document.querySelector("#sidebarUserBtn"),
  sidebarUserAvatar: document.querySelector("#sidebarUserAvatar"),
  sidebarUserName: document.querySelector("#sidebarUserName"),
  profileMenu: document.querySelector("#profileMenu"),
  profileMenuCloseBtn: document.querySelector("#profileMenuCloseBtn"),
  profileMenuSubtitle: document.querySelector("#profileMenuSubtitle"),
  pageKicker: document.querySelector("#pageKicker"),
  pageTitle: document.querySelector("#pageTitle"),
  pageSubtitle: document.querySelector("#pageSubtitle"),
  themeSelect: document.querySelector("#themeSelect"),
  addRowBtn: document.querySelector("#addRowBtn"),
  saveMonthBtn: document.querySelector("#saveMonthBtn"),
  addBudgetIncomeBtn: document.querySelector("#addBudgetIncomeBtn"),
  addBudgetExpenseBtn: document.querySelector("#addBudgetExpenseBtn"),
  saveBudgetBtn: document.querySelector("#saveBudgetBtn"),
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  hydrateTheme();
  fillMonthSelect();
  fillBudgetMonthSelect();
  fillYearSelects();
  setCurrentMonth();
  bindEvents();
  activeAssetGroup = getAssetGroupFromUrl();
  selectTab(getTabFromUrl(), { updateUrl: false });
  bindSupabaseAuthEvents();
  await hydrateSession();
  void loadFiatCurrencyOptions();
  state = await loadState();
  fillYearSelects({ preserveSelection: true });
  loadSelectedMonth({ preserveDraft: true });
  loadSelectedBudget();
  renderAll();
  updateExternalMetrics();
  window.setInterval(updateExternalMetrics, EXTERNAL_REFRESH_INTERVAL_MS);
}

function fillMonthSelect() {
  els.monthInput.innerHTML = months
    .map((month, index) => `<option value="${index}">${month}</option>`)
    .join("");
}

function fillBudgetMonthSelect() {
  if (!els.budgetMonthInput) return;
  els.budgetMonthInput.innerHTML = months
    .map((month, index) => `<option value="${index}">${month}</option>`)
    .join("");
}

function fillYearSelects({ preserveSelection = false } = {}) {
  const currentYear = new Date().getFullYear();
  const storedYears = [...state.records, ...state.budgets]
    .map(({ year }) => Number(year))
    .filter(Number.isInteger);
  const firstYear = Math.min(YEAR_SELECT_START, ...storedYears);
  const lastYear = Math.max(currentYear + YEAR_SELECT_FUTURE_OFFSET, ...storedYears);
  const options = [];

  for (let year = lastYear; year >= firstYear; year -= 1) {
    options.push(`<option value="${year}">${year}</option>`);
  }

  [els.yearInput, els.budgetYearInput].forEach((select) => {
    if (!select) return;
    const previousYear = preserveSelection ? Number(select.value) : currentYear;
    select.innerHTML = options.join("");
    select.value = String(previousYear >= firstYear && previousYear <= lastYear ? previousYear : currentYear);
  });
}

function setCurrentMonth() {
  const now = new Date();
  els.yearInput.value = now.getFullYear();
  els.monthInput.value = now.getMonth();
  if (els.budgetYearInput) els.budgetYearInput.value = now.getFullYear();
  if (els.budgetMonthInput) els.budgetMonthInput.value = now.getMonth();
}

async function loadFiatCurrencyOptions() {
  try {
    const currencies = await fetchMarketJson(`${FRANKFURTER_API_URL}/currencies`);
    if (!Array.isArray(currencies)) throw new Error("Unexpected currency list");

    const options = currencies
      .map((currency) => {
        const code = String(currency?.iso_code || "").trim().toUpperCase();
        if (!/^[A-Z]{3}$/.test(code)) return null;
        const name = getLocalizedCurrencyName(code, currency?.name);
        return { code, label: `${code} — ${name}` };
      })
      .filter(Boolean)
      .sort(compareFiatCurrencyOptions);

    if (options.length) {
      fiatCurrencyOptions = options;
      const assetEditorHasFocus = els.assetRows?.contains(document.activeElement);
      const activeFiatInput = document.activeElement?.matches?.("[data-fiat-query]")
        ? document.activeElement
        : null;
      if (activeFiatInput) {
        renderFiatSearchResults(Number(activeFiatInput.dataset.fiatQuery), activeFiatInput.value);
      } else if (activeAssetGroup === "cash" && !assetEditorHasFocus) {
        renderAssets();
      }
    }
  } catch (error) {
    console.warn("Frankfurter currency list is unavailable", error);
  }
}

function getLocalizedCurrencyName(code, fallbackName = "") {
  try {
    const displayNames = new Intl.DisplayNames(["ru"], { type: "currency" });
    const localized = displayNames.of(code);
    if (localized && localized !== code) return localized;
  } catch {
    // Older browsers can use the provider's English name.
  }
  return String(fallbackName || code).trim();
}

function createFallbackFiatCurrencyOptions() {
  const optionsByCode = new Map(
    [...DEFAULT_FIAT_CURRENCY_OPTIONS, RUBLE_CURRENCY_OPTION]
      .map((option) => [option.code, option]),
  );
  const browserSupportedCodes = typeof Intl.supportedValuesOf === "function"
    ? Intl.supportedValuesOf("currency")
    : [];
  const supportedCodes = new Set([
    ...FALLBACK_FIAT_CURRENCY_CODES,
    ...browserSupportedCodes,
  ]);

  supportedCodes.forEach((code) => {
    const normalizedCode = String(code || "").trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(normalizedCode)) return;
    const name = getLocalizedCurrencyName(normalizedCode);
    optionsByCode.set(normalizedCode, {
      code: normalizedCode,
      label: `${normalizedCode} — ${name}`,
    });
  });

  return Array.from(optionsByCode.values()).sort(compareFiatCurrencyOptions);
}

function compareFiatCurrencyOptions(left, right) {
  const leftIndex = PREFERRED_FIAT_CURRENCY_CODES.indexOf(left.code);
  const rightIndex = PREFERRED_FIAT_CURRENCY_CODES.indexOf(right.code);
  if (leftIndex >= 0 || rightIndex >= 0) {
    if (leftIndex < 0) return 1;
    if (rightIndex < 0) return -1;
    return leftIndex - rightIndex;
  }
  return left.code.localeCompare(right.code);
}

async function fetchMarketJson(url) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), MARKET_DATA_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Market data error: ${response.status}`);
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => selectTab(tab.dataset.tab));
  });

  document.querySelectorAll("[data-side-tab]").forEach((tab) => {
    tab.addEventListener("click", () => selectTab(tab.dataset.sideTab));
  });

  els.saveMonthBtn.addEventListener("click", saveSelectedMonth);
  els.registerBtn?.addEventListener("click", registerAccount);
  els.loginBtn?.addEventListener("click", loginAccount);
  els.forgotPasswordBtn?.addEventListener("click", () => setAuthMode("recovery"));
  els.requestPasswordResetBtn?.addEventListener("click", requestPasswordReset);
  els.updatePasswordBtn?.addEventListener("click", updateRecoveredPassword);
  els.logoutBtn?.addEventListener("click", logoutAccount);
  els.saveProfileBtn?.addEventListener("click", saveProfile);
  els.sidebarLoginBtn?.addEventListener("click", () => toggleProfileMenu());
  els.sidebarUserBtn?.addEventListener("click", () => toggleProfileMenu());
  els.profileMenuCloseBtn?.addEventListener("click", () => toggleProfileMenu(false));
  els.authModeToggleBtn?.addEventListener("click", () => {
    setAuthMode(authMode === "login" ? "register" : "login");
  });
  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => togglePasswordVisibility(button));
  });
  [
    els.authFirstNameInput,
    els.authLastNameInput,
    els.authEmailInput,
    els.authPasswordInput,
    els.authPasswordConfirmInput,
  ].forEach((input) => {
    input?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      if (authMode === "register") registerAccount();
      else if (authMode === "recovery") requestPasswordReset();
      else if (authMode === "update-password") updateRecoveredPassword();
      else loginAccount();
    });
  });
  els.themeSelect?.addEventListener("change", () => setTheme(els.themeSelect.value));
  els.addRowBtn.addEventListener("click", addAssetRow);
  els.addBudgetIncomeBtn?.addEventListener("click", () => addBudgetRow("incomes"));
  els.addBudgetExpenseBtn?.addEventListener("click", () => addBudgetRow("expenses"));
  els.saveBudgetBtn?.addEventListener("click", saveSelectedBudget);

  document.addEventListener("click", (event) => {
    if (!els.profileMenu?.hidden && !event.target.closest(".sidebar-account")) {
      toggleProfileMenu(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") toggleProfileMenu(false);
  });

  els.yearInput.addEventListener("change", loadSelectedMonth);
  els.monthInput.addEventListener("change", loadSelectedMonth);
  els.budgetYearInput?.addEventListener("change", loadSelectedBudget);
  els.budgetMonthInput?.addEventListener("change", loadSelectedBudget);

  document.querySelectorAll("[data-chart-range]").forEach((button) => {
    button.addEventListener("click", () => {
      chartRange = button.dataset.chartRange;
      document.querySelectorAll("[data-chart-range]").forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      resetChartInteraction();
      drawChart();
    });
  });

  els.chart.addEventListener("mousemove", handleChartPointerMove);
  els.chart.addEventListener("mouseleave", () => {
    chartHoverIndex = null;
    hideChartTooltip();
    drawChart();
  });
  els.chart.addEventListener("click", handleChartClick);
  window.addEventListener("resize", () => {
    resetChartInteraction();
    hideStructureTooltip();
    drawChart();
  });
  document.addEventListener("scroll", hideStructureTooltip, true);
}

function selectTab(name, options = {}) {
  const activeTab = APP_TABS.includes(name) ? name : "dashboard";
  const pageCopy = {
    dashboard: {
      kicker: "Обзор портфеля",
      title: "Дашборд",
      subtitle: "Ваш капитал, динамика и ключевые показатели в одном месте.",
    },
    assets: {
      kicker: "Управление капиталом",
      title: "Активы",
      subtitle: "Обновляйте структуру портфеля и сохраняйте итог каждого месяца.",
    },
    budget: {
      kicker: "Планирование",
      title: "Бюджет",
      subtitle: "Планируйте доходы и расходы, сравнивайте их с фактом и контролируйте свободный остаток.",
    },
    history: {
      kicker: "Финансовый архив",
      title: "История",
      subtitle: "Сравнивайте месяцы и наблюдайте долгосрочную динамику капитала.",
    },
    settings: {
      kicker: "Персонализация",
      title: "Настройки",
      subtitle: "Настройте внешний вид финансового пространства под себя.",
    },
  };
  const copy = pageCopy[activeTab];
  if (els.pageKicker) els.pageKicker.textContent = copy.kicker;
  if (els.pageTitle) els.pageTitle.textContent = copy.title;
  if (els.pageSubtitle) els.pageSubtitle.textContent = copy.subtitle;
  toggleProfileMenu(false);
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === activeTab);
  });
  document.querySelectorAll("[data-side-tab]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.sideTab === activeTab);
  });
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("is-visible"));
  document.querySelector(`#${activeTab}Panel`).classList.add("is-visible");
  if (options.updateUrl !== false) updateTabUrl(activeTab);
  if (activeTab === "dashboard") {
    drawChart();
  }
}

function getTabFromUrl() {
  const requestedTab = new URLSearchParams(window.location.search).get("tab");
  return APP_TABS.includes(requestedTab) ? requestedTab : "dashboard";
}

function getAssetGroupFromUrl() {
  const requestedGroup = new URLSearchParams(window.location.search).get("asset");
  return ASSET_GROUPS.some(({ id }) => id === requestedGroup) ? requestedGroup : "banks";
}

function updateTabUrl(tabName) {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tabName);
  window.history.replaceState(window.history.state, document.title, `${url.pathname}${url.search}${url.hash}`);
}

function updateAssetGroupUrl(groupId) {
  const url = new URL(window.location.href);
  url.searchParams.set("asset", groupId);
  window.history.replaceState(window.history.state, document.title, `${url.pathname}${url.search}${url.hash}`);
}

function loadSelectedMonth(options = {}) {
  const year = Number(els.yearInput.value);
  const month = Number(els.monthInput.value);
  const existing = state.records.find((record) => record.key === recordKey(year, month));
  if (existing) {
    state.currentRows = cloneRows(existing.rows);
  } else if (options.preserveDraft) {
    state.currentRows = cloneRows(state.currentRows || []);
  } else {
    const previous = findPreviousRecord({ year, month });
    state.currentRows = previous ? cloneRows(previous.rows) : [];
  }
  renderAssets();
}

async function saveSelectedMonth() {
  if (!isAuthenticated()) {
    showSaveNotice("Войдите в аккаунт, чтобы сохранять финансовые данные", "error");
    return;
  }

  const year = Number(els.yearInput.value);
  const month = Number(els.monthInput.value);
  const rows = readAssetRows();
  const total = sumRows(rows);
  const nextRecord = {
    key: recordKey(year, month),
    year,
    month,
    rows,
    total,
    savedAt: new Date().toISOString(),
  };

  const index = state.records.findIndex((record) => record.key === nextRecord.key);
  if (index >= 0) {
    state.records[index] = nextRecord;
  } else {
    state.records.push(nextRecord);
  }

  state.currentRows = cloneRows(rows);
  try {
    const result = await persist();
    renderAll();
    showSaveNotice(result?.remote ? "Данные сохранены в аккаунте" : "Данные сохранены только в этом браузере");
  } catch (error) {
    console.error("Save failed", error);
    showSaveNotice(error.message || "Не удалось сохранить данные", "error");
  }
}

function loadSelectedBudget() {
  if (!els.budgetYearInput || !els.budgetMonthInput) return;
  const year = Number(els.budgetYearInput.value);
  const month = Number(els.budgetMonthInput.value);
  const existing = state.budgets.find((budget) => budget.key === recordKey(year, month));

  if (existing) {
    budgetDraft = cloneBudgetRecord(existing);
    budgetDraft.source = "saved";
  } else {
    const previous = findPreviousBudget({ year, month });
    budgetDraft = previous
      ? {
          ...cloneBudgetRecord(previous, { resetActual: true }),
          key: recordKey(year, month),
          year,
          month,
          savedAt: null,
          source: "copied",
          sourcePeriod: recordKey(previous.year, previous.month),
        }
      : {
          key: recordKey(year, month),
          year,
          month,
          incomes: [],
          expenses: [],
          savedAt: null,
          source: "empty",
        };
  }

  renderBudget();
}

function renderBudget() {
  if (!budgetDraft || !els.budgetIncomeRows || !els.budgetExpenseRows) return;
  renderBudgetRows("incomes");
  renderBudgetRows("expenses");
  updateBudgetSourceNote();
  updateBudgetCalculations();
}

function renderBudgetRows(kind) {
  const container = kind === "incomes" ? els.budgetIncomeRows : els.budgetExpenseRows;
  const rows = budgetDraft[kind];
  const nameLabel = kind === "incomes" ? "Источник" : "Категория";

  if (!rows.length) {
    container.innerHTML = `
      <tr class="budget-empty-row">
        <td colspan="5">Пока нет строк. Добавьте ${kind === "incomes" ? "источник дохода" : "категорию расходов"}.</td>
      </tr>
    `;
    return;
  }

  container.innerHTML = rows
    .map((row, index) => {
      const difference = row.actual - row.plan;
      const tone = getBudgetDifferenceTone(kind, difference);
      return `
        <tr>
          <td data-label="${nameLabel}" class="budget-name-cell">
            <input
              class="budget-name-input"
              data-budget-kind="${kind}"
              data-budget-index="${index}"
              data-budget-field="name"
              value="${escapeHtml(row.name)}"
              aria-label="${nameLabel}"
            />
          </td>
          <td data-label="План">
            <span class="budget-amount-input">
              <input
                data-budget-kind="${kind}"
                data-budget-index="${index}"
                data-budget-field="plan"
                inputmode="numeric"
                value="${formatPlainNumber(row.plan)}"
                aria-label="План"
              />
              <span aria-hidden="true">₽</span>
            </span>
          </td>
          <td data-label="Факт">
            <span class="budget-amount-input">
              <input
                data-budget-kind="${kind}"
                data-budget-index="${index}"
                data-budget-field="actual"
                inputmode="numeric"
                value="${formatPlainNumber(row.actual)}"
                aria-label="Факт"
              />
              <span aria-hidden="true">₽</span>
            </span>
          </td>
          <td data-label="Разница">
            <strong class="budget-difference ${tone}" data-budget-difference="${kind}-${index}">
              ${formatSignedMoney(difference)}
            </strong>
          </td>
          <td data-label="Действия" class="budget-actions-cell">
            <div class="budget-row-actions">
              <button type="button" data-budget-move="${kind}" data-budget-index="${index}" data-budget-direction="up" ${index === 0 ? "disabled" : ""} title="Поднять строку">↑</button>
              <button type="button" data-budget-move="${kind}" data-budget-index="${index}" data-budget-direction="down" ${index === rows.length - 1 ? "disabled" : ""} title="Опустить строку">↓</button>
              <button class="budget-delete-button" type="button" data-budget-delete="${kind}" data-budget-index="${index}" title="Удалить строку">×</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  container.querySelectorAll("[data-budget-field]").forEach((input) => {
    input.addEventListener("input", updateBudgetRowFromInput);
    input.addEventListener("change", commitBudgetRowInput);
  });
  container.querySelectorAll("[data-budget-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteBudgetRow(button.dataset.budgetDelete, Number(button.dataset.budgetIndex)));
  });
  container.querySelectorAll("[data-budget-move]").forEach((button) => {
    button.addEventListener("click", () => {
      moveBudgetRow(
        button.dataset.budgetMove,
        Number(button.dataset.budgetIndex),
        button.dataset.budgetDirection,
      );
    });
  });
}

function updateBudgetRowFromInput(event) {
  const input = event.target;
  const kind = input.dataset.budgetKind;
  const index = Number(input.dataset.budgetIndex);
  const field = input.dataset.budgetField;
  const row = budgetDraft?.[kind]?.[index];
  if (!row) return;

  row[field] = field === "name" ? input.value : parseAmount(input.value);
  updateBudgetCalculations();
}

function commitBudgetRowInput(event) {
  const input = event.target;
  const kind = input.dataset.budgetKind;
  const index = Number(input.dataset.budgetIndex);
  const field = input.dataset.budgetField;
  const row = budgetDraft?.[kind]?.[index];
  if (!row) return;

  if (field === "name") {
    row.name = input.value.trim() || (kind === "incomes" ? "Новый доход" : "Новый расход");
    input.value = row.name;
  } else {
    row[field] = parseAmount(input.value);
    input.value = formatPlainNumber(row[field]);
  }
  updateBudgetCalculations();
}

function updateBudgetCalculations() {
  if (!budgetDraft) return;
  const income = getBudgetTotals(budgetDraft.incomes);
  const expense = getBudgetTotals(budgetDraft.expenses);
  const freePlan = income.plan - expense.plan;
  const freeActual = income.actual - expense.actual;

  els.budgetIncomeActual.textContent = formatMoney(income.actual);
  els.budgetIncomePlan.textContent = formatMoney(income.plan);
  els.budgetExpenseActual.textContent = formatMoney(expense.actual);
  els.budgetExpensePlan.textContent = formatMoney(expense.plan);
  els.budgetFreeActual.textContent = formatMoney(freeActual);
  els.budgetFreePlan.textContent = formatMoney(freePlan);
  els.budgetFreeActual.classList.toggle("is-negative", freeActual < 0);
  els.budgetFreePlan.classList.toggle("is-negative", freePlan < 0);

  els.budgetIncomePlanTotal.textContent = formatMoney(income.plan);
  els.budgetIncomeActualTotal.textContent = formatMoney(income.actual);
  els.budgetIncomeDifferenceTotal.textContent = formatSignedMoney(income.actual - income.plan);
  els.budgetExpensePlanTotal.textContent = formatMoney(expense.plan);
  els.budgetExpenseActualTotal.textContent = formatMoney(expense.actual);
  els.budgetExpenseDifferenceTotal.textContent = formatSignedMoney(expense.actual - expense.plan);

  setBudgetDifferenceTone(els.budgetIncomeDifferenceTotal, "incomes", income.actual - income.plan);
  setBudgetDifferenceTone(els.budgetExpenseDifferenceTotal, "expenses", expense.actual - expense.plan);

  ["incomes", "expenses"].forEach((kind) => {
    budgetDraft[kind].forEach((row, index) => {
      const element = document.querySelector(`[data-budget-difference="${kind}-${index}"]`);
      if (!element) return;
      const difference = row.actual - row.plan;
      element.textContent = formatSignedMoney(difference);
      setBudgetDifferenceTone(element, kind, difference);
    });
  });
}

function getBudgetTotals(rows) {
  return rows.reduce(
    (totals, row) => ({
      plan: totals.plan + Number(row.plan || 0),
      actual: totals.actual + Number(row.actual || 0),
    }),
    { plan: 0, actual: 0 },
  );
}

function getBudgetDifferenceTone(kind, difference) {
  if (difference === 0) return "is-neutral";
  const isFavorable = kind === "incomes" ? difference > 0 : difference < 0;
  return isFavorable ? "is-positive" : "is-negative";
}

function setBudgetDifferenceTone(element, kind, difference) {
  if (!element) return;
  element.classList.remove("is-positive", "is-negative", "is-neutral");
  element.classList.add(getBudgetDifferenceTone(kind, difference));
}

function updateBudgetSourceNote() {
  if (!els.budgetSourceNote || !budgetDraft) return;
  if (budgetDraft.source === "saved") {
    els.budgetSourceNote.textContent = "Сохраненный персональный бюджет. Изменения применятся после сохранения.";
    return;
  }
  if (budgetDraft.source === "copied") {
    const [year, month] = budgetDraft.sourcePeriod.split("-").map(Number);
    els.budgetSourceNote.textContent = `План скопирован из ${months[month - 1].toLowerCase()} ${year}; фактические суммы обнулены.`;
    return;
  }
  els.budgetSourceNote.textContent = "Добавьте источники доходов и категории расходов.";
}

function addBudgetRow(kind) {
  if (!isAuthenticated()) {
    showSaveNotice("Войдите в аккаунт, чтобы планировать бюджет", "error");
    return;
  }
  if (!budgetDraft?.[kind]) return;
  budgetDraft[kind].push({
    name: kind === "incomes" ? "Новый доход" : "Новый расход",
    plan: 0,
    actual: 0,
  });
  budgetDraft.source = budgetDraft.source === "saved" ? "saved" : "draft";
  renderBudgetRows(kind);
  updateBudgetCalculations();
  const newInput = (kind === "incomes" ? els.budgetIncomeRows : els.budgetExpenseRows)
    .querySelector(`tr:last-child .budget-name-input`);
  newInput?.select();
}

function deleteBudgetRow(kind, index) {
  if (!isAuthenticated() || !budgetDraft?.[kind]?.[index]) return;
  budgetDraft[kind].splice(index, 1);
  renderBudgetRows(kind);
  updateBudgetCalculations();
}

function moveBudgetRow(kind, index, direction) {
  if (!isAuthenticated() || !budgetDraft?.[kind]?.[index]) return;
  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= budgetDraft[kind].length) return;
  [budgetDraft[kind][index], budgetDraft[kind][nextIndex]] = [
    budgetDraft[kind][nextIndex],
    budgetDraft[kind][index],
  ];
  renderBudgetRows(kind);
  updateBudgetCalculations();
}

async function saveSelectedBudget() {
  if (!isAuthenticated()) {
    showSaveNotice("Войдите в аккаунт, чтобы сохранить персональный бюджет", "error");
    return;
  }
  if (!budgetDraft) return;

  const nextBudget = normalizeBudgetRecord({
    ...budgetDraft,
    savedAt: new Date().toISOString(),
  });
  const index = state.budgets.findIndex((budget) => budget.key === nextBudget.key);
  if (index >= 0) state.budgets[index] = nextBudget;
  else state.budgets.push(nextBudget);

  try {
    setAuthButtonBusy(els.saveBudgetBtn, true, "Сохраняем...");
    const result = await persist();
    budgetDraft = cloneBudgetRecord(
      state.budgets.find((budget) => budget.key === nextBudget.key) || nextBudget,
    );
    budgetDraft.source = "saved";
    renderBudget();
    showSaveNotice(result?.remote ? "Бюджет сохранен в аккаунте" : "Бюджет сохранен в этом браузере");
  } catch (error) {
    console.error("Budget save failed", error);
    showSaveNotice(error.message || "Не удалось сохранить бюджет", "error");
  } finally {
    setAuthButtonBusy(els.saveBudgetBtn, false);
  }
}

function renderAll() {
  renderAssets();
  renderBudget();
  renderHistory();
  renderMetrics();
  renderAssetStructure();
  drawChart();
}

function renderAssets() {
  destroyAssetSortable();
  const rows = state.currentRows ?? [];
  const total = sumRows(rows);
  const totals = getAssetGroupTotals(rows);
  const activeGroup = getAssetGroup(activeAssetGroup);
  const activeRows = rows
    .map((row, index) => ({ row, index }))
    .filter((item) => item.row.group === activeGroup.id);

  els.assetGroupNav.innerHTML = ASSET_GROUPS
    .map((group) => {
      const groupRows = rows.filter((row) => row.group === group.id);
      return `
        <button
          class="asset-group-card ${group.id === activeGroup.id ? "is-active" : ""}"
          type="button"
          data-asset-group="${group.id}"
          aria-pressed="${group.id === activeGroup.id}"
        >
          <span class="asset-group-icon" aria-hidden="true">${group.icon}</span>
          <span class="asset-group-copy">
            <strong>${group.label}</strong>
            <small>${formatAssetCount(groupRows.length)}</small>
          </span>
          <b data-asset-group-total="${group.id}">${formatMoney(totals[group.id] || 0)}</b>
        </button>
      `;
    })
    .join("");

  els.assetEditorIcon.innerHTML = activeGroup.icon;
  els.assetEditorTitle.textContent = activeGroup.label;
  els.assetEditorDescription.textContent = activeGroup.description;
  els.assetGroupTotal.textContent = formatMoney(totals[activeGroup.id] || 0);
  els.assetTotalCell.textContent = formatMoney(total);

  els.assetRows.innerHTML = activeRows.length
    ? activeRows
        .map(({ row, index }, position) => renderAssetEntry(row, index, position))
        .join("")
    : `
      <div class="asset-entry-empty">
        <span class="asset-entry-empty-icon" aria-hidden="true">${activeGroup.icon}</span>
        <strong>В разделе пока нет активов</strong>
        <p>Добавьте первую запись. Она будет сохранена в снимке выбранного месяца.</p>
      </div>
    `;

  els.assetGroupNav.querySelectorAll("[data-asset-group]").forEach((button) => {
    button.addEventListener("click", () => {
      activeAssetGroup = button.dataset.assetGroup;
      updateAssetGroupUrl(activeAssetGroup);
      renderAssets();
    });
  });

  els.assetRows.querySelectorAll('[data-asset-field]:not([data-asset-field="type"])').forEach((input) => {
    input.addEventListener("input", updateAssetFieldFromInput);
    input.addEventListener("change", commitAssetField);
  });

  els.assetRows.querySelectorAll('[data-asset-field="type"]').forEach((select) => {
    select.addEventListener("change", changeAssetType);
  });

  bindCryptoAssetSearchEvents();
  bindFiatAssetSearchEvents();

  els.assetRows.querySelectorAll("[data-asset-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentRows.splice(Number(button.dataset.assetDelete), 1);
      renderAssets();
    });
  });

  initializeAssetSorting(activeRows.length);
}

function renderAssetEntry(row, index, position) {
  const group = getAssetGroup(row.group);
  const hasType = group.types.length > 1;
  const hasAutomaticName = usesAutomaticAssetName(row.group, row.type);
  const hasCodeSelector = row.group === "crypto" || row.group === "cash";
  const specificFields = renderAssetSpecificFields(row, index);
  const fieldCount = Number(!hasAutomaticName)
    + Number(hasType)
    + Number(hasCodeSelector)
    + getAssetSpecificFieldCount(row)
    + 1;
  return `
    <article class="asset-entry-card" data-asset-entry="${index}">
      <div class="asset-entry-main">
        <span class="asset-entry-number">${String(position + 1).padStart(2, "0")}</span>
        <div class="asset-entry-main-fields" style="--asset-field-count: ${fieldCount}">
          ${!hasAutomaticName
            ? `
              <label class="asset-field asset-field-name">
                Название
                <input data-asset-field="name" data-index="${index}" value="${escapeHtml(row.name)}" />
              </label>
            `
            : ""}
          ${hasType
            ? `
              <label class="asset-field asset-field-type">
                Тип
                <select data-asset-field="type" data-index="${index}">
                  ${group.types
                    .map(([value, label]) => `<option value="${value}" ${row.type === value ? "selected" : ""}>${label}</option>`)
                    .join("")}
                </select>
              </label>
            `
            : ""}
          ${hasCodeSelector ? renderAssetCodeField(row, index) : ""}
          ${specificFields}
          ${renderAssetPrimaryValue(row, index)}
        </div>
        <div class="category-actions">
          <span class="asset-drag-handle" aria-hidden="true" title="Перетащить актив">
            <svg viewBox="0 0 16 20">
              <circle cx="5" cy="4" r="1.25" />
              <circle cx="11" cy="4" r="1.25" />
              <circle cx="5" cy="10" r="1.25" />
              <circle cx="11" cy="10" r="1.25" />
              <circle cx="5" cy="16" r="1.25" />
              <circle cx="11" cy="16" r="1.25" />
            </svg>
          </span>
          <button class="delete-row" type="button" data-asset-delete="${index}" aria-label="Удалить актив" title="Удалить актив">×</button>
        </div>
      </div>
    </article>
  `;
}

function renderAssetPrimaryValue(row, index) {
  if (!isConvertibleAsset(row.group, row.type)) {
    return renderAssetNumberField("Стоимость, ₽", "amount", row.amount, index, "money", "asset-field-value");
  }

  return `
    <div class="asset-field asset-field-value">
      <span>Стоимость в рублях</span>
      <div class="asset-calculated-field">
        <strong data-asset-calculated="${index}">${formatMoney(row.amount)}</strong>
      </div>
    </div>
  `;
}

function renderAssetSpecificFields(row, index) {
  if (isConvertibleAsset(row.group, row.type)) {
    return renderAssetConversionFields(row, index);
  }

  if (row.group === "property") {
    return renderAssetDateField("Дата оценки", "valuationDate", row.valuationDate, index);
  }
  return "";
}

function getAssetSpecificFieldCount(row) {
  if (isConvertibleAsset(row.group, row.type)) {
    return row.group === "cash" && row.currencyCode === "RUB" ? 1 : 2;
  }
  if (row.group === "property") return 1;
  return 0;
}

function renderAssetConversionFields(row, index) {
  const rateLabel = row.group === "crypto" ? "Цена за единицу, ₽" : "Курс к рублю";
  const showRate = row.group !== "cash" || row.currencyCode !== "RUB";
  return `
    ${renderAssetNumberField("Количество", "units", row.units, index, "decimal")}
    ${showRate ? renderAssetNumberField(rateLabel, "unitRate", row.unitRate, index, "decimal") : ""}
  `;
}

function renderAssetCodeField(row, index) {
  const isCrypto = row.group === "crypto";
  if (isCrypto) return renderCryptoAssetCodeField(row, index);
  return renderFiatAssetCodeField(row, index);
}

function renderFiatAssetCodeField(row, index) {
  const option = getFiatOptionForRow(row);
  const value = option?.label || row.name || row.currencyCode || "";
  return `
    <label class="asset-field asset-field-code">
      Валюта
      <div class="asset-search-select">
        <input
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          aria-controls="fiatResults${index}"
          autocomplete="off"
          data-fiat-query="${index}"
          value="${escapeHtml(value)}"
          placeholder="Начните вводить USD или доллар"
        />
        <div class="asset-search-results" id="fiatResults${index}" data-fiat-results="${index}" role="listbox" hidden></div>
      </div>
    </label>
  `;
}

function renderCryptoAssetCodeField(row, index) {
  const option = getCryptoOptionForRow(row);
  const value = option?.label || row.name || row.currencyCode || "";
  return `
    <label class="asset-field asset-field-code">
      Монета
      <div class="asset-search-select">
        <input
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          aria-controls="cryptoResults${index}"
          autocomplete="off"
          data-crypto-query="${index}"
          value="${escapeHtml(value)}"
          placeholder="Начните вводить BTC или Bitcoin"
        />
        <div class="asset-search-results" id="cryptoResults${index}" data-crypto-results="${index}" role="listbox" hidden></div>
      </div>
    </label>
  `;
}

function getFiatOptionsForRow(row) {
  const selectedCode = String(row?.currencyCode || "").trim().toUpperCase();
  if (
    !selectedCode
    || fiatCurrencyOptions.some(({ code }) => code === selectedCode)
  ) {
    return fiatCurrencyOptions;
  }

  return [
    { code: selectedCode, label: `${selectedCode} — ${getStoredAssetLabel(row, selectedCode)}` },
    ...fiatCurrencyOptions,
  ];
}

function getFiatOptionForRow(row) {
  const code = String(row?.currencyCode || "").trim().toUpperCase();
  return getFiatOptionsForRow(row).find((option) => option.code === code) || null;
}

function getCryptoOptionForRow(row) {
  const marketId = String(row?.marketId || "").trim();
  const code = String(row?.currencyCode || "").trim().toUpperCase();
  return cryptoCurrencyOptions.find((option) => marketId && option.id === marketId)
    || cryptoCurrencyOptions.find((option) => option.code === code)
    || (code
      ? {
          id: marketId,
          code,
          name: getStoredAssetLabel(row, code),
          label: `${code} — ${getStoredAssetLabel(row, code)}`,
          rank: 0,
        }
      : null);
}

function getStoredAssetLabel(row, fallback) {
  const name = String(row?.name || "").trim();
  if (!name) return fallback;
  const separatorIndex = name.indexOf("—");
  return separatorIndex >= 0 ? name.slice(separatorIndex + 1).trim() : name;
}

function bindCryptoAssetSearchEvents() {
  els.assetRows.querySelectorAll("[data-crypto-query]").forEach((input) => {
    const index = Number(input.dataset.cryptoQuery);
    input.addEventListener("focus", () => {
      input.select();
      renderCryptoSearchResults(index, "");
    });
    input.addEventListener("input", () => {
      renderCryptoSearchResults(index, input.value);
      scheduleCryptoSearch(index, input.value);
    });
    input.addEventListener("keydown", (event) => {
      const results = els.assetRows.querySelector(`[data-crypto-results="${index}"]`);
      if (event.key === "Escape") {
        hideCryptoSearchResults(index);
        input.blur();
      } else if (event.key === "Enter") {
        const firstResult = results?.querySelector("[data-crypto-option]");
        if (firstResult) {
          event.preventDefault();
          firstResult.click();
        }
      }
    });
    input.addEventListener("blur", () => {
      window.setTimeout(() => {
        hideCryptoSearchResults(index);
        const row = state.currentRows[index];
        if (row) input.value = getCryptoOptionForRow(row)?.label || row.name || "";
      }, 160);
    });
  });
}

function bindFiatAssetSearchEvents() {
  els.assetRows.querySelectorAll("[data-fiat-query]").forEach((input) => {
    const index = Number(input.dataset.fiatQuery);
    input.addEventListener("focus", () => {
      input.select();
      renderFiatSearchResults(index, "");
    });
    input.addEventListener("input", () => {
      renderFiatSearchResults(index, input.value);
    });
    input.addEventListener("keydown", (event) => {
      const results = els.assetRows.querySelector(`[data-fiat-results="${index}"]`);
      if (event.key === "Escape") {
        hideFiatSearchResults(index);
        input.blur();
      } else if (event.key === "Enter") {
        const firstResult = results?.querySelector("[data-fiat-option]");
        if (firstResult) {
          event.preventDefault();
          firstResult.click();
        }
      }
    });
    input.addEventListener("blur", () => {
      window.setTimeout(() => {
        hideFiatSearchResults(index);
        const row = state.currentRows[index];
        if (row) input.value = getFiatOptionForRow(row)?.label || row.name || "";
      }, 160);
    });
  });
}

function renderFiatSearchResults(index, query) {
  const input = els.assetRows.querySelector(`[data-fiat-query="${index}"]`);
  const container = els.assetRows.querySelector(`[data-fiat-results="${index}"]`);
  const row = state.currentRows[index];
  if (!input || !container || !row) return;

  const normalizedQuery = normalizeSearchText(query);
  const options = getFiatOptionsForRow(row)
    .filter((option) => !normalizedQuery || normalizeSearchText(`${option.code} ${option.label}`).includes(normalizedQuery));

  container.innerHTML = options.length
    ? options
        .map((option) => `
          <button type="button" role="option" data-fiat-option="${escapeHtml(option.code)}">
            <strong>${escapeHtml(option.code)}</strong>
            <span>${escapeHtml(option.label.replace(`${option.code} — `, ""))}</span>
          </button>
        `)
        .join("")
    : '<span class="asset-search-empty">Совпадений пока нет</span>';
  container.hidden = false;
  input.setAttribute("aria-expanded", "true");

  container.querySelectorAll("[data-fiat-option]").forEach((button) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => selectFiatAsset(index, button.dataset.fiatOption));
  });
}

function hideFiatSearchResults(index) {
  const input = els.assetRows.querySelector(`[data-fiat-query="${index}"]`);
  const container = els.assetRows.querySelector(`[data-fiat-results="${index}"]`);
  if (container) container.hidden = true;
  if (input) input.setAttribute("aria-expanded", "false");
}

function selectFiatAsset(index, currencyCode) {
  const row = state.currentRows[index];
  const option = getFiatOptionsForRow(row).find(({ code }) => code === currencyCode);
  if (!row || !option) return;

  const isRuble = option.code === "RUB";
  row.type = "currency";
  row.currencyCode = option.code;
  row.marketId = "";
  row.name = option.label;
  row.unitRate = isRuble ? 1 : 0;
  row.rateSource = isRuble ? "" : "Frankfurter";
  row.rateUpdatedAt = "";
  row.conversionConfigured = true;
  recalculateAssetAmount(row);
  renderAssets();
  if (!isRuble) void loadLatestFiatRate(row.id, option.code);
}

function renderCryptoSearchResults(index, query) {
  const input = els.assetRows.querySelector(`[data-crypto-query="${index}"]`);
  const container = els.assetRows.querySelector(`[data-crypto-results="${index}"]`);
  if (!input || !container) return;

  const normalizedQuery = normalizeSearchText(query);
  const options = cryptoCurrencyOptions
    .filter((option) => !normalizedQuery || option.searchText?.includes(normalizedQuery) || normalizeSearchText(option.label).includes(normalizedQuery))
    .sort(compareCryptoOptions)
    .slice(0, 12);

  container.innerHTML = options.length
    ? options
        .map((option) => `
          <button type="button" role="option" data-crypto-option="${escapeHtml(option.id)}">
            <strong>${escapeHtml(option.code)}</strong>
            <span>${escapeHtml(option.name)}</span>
          </button>
        `)
        .join("")
    : '<span class="asset-search-empty">Совпадений пока нет</span>';
  container.hidden = false;
  input.setAttribute("aria-expanded", "true");

  container.querySelectorAll("[data-crypto-option]").forEach((button) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => selectCryptoAsset(index, button.dataset.cryptoOption));
  });
}

function hideCryptoSearchResults(index) {
  const input = els.assetRows.querySelector(`[data-crypto-query="${index}"]`);
  const container = els.assetRows.querySelector(`[data-crypto-results="${index}"]`);
  if (container) container.hidden = true;
  if (input) input.setAttribute("aria-expanded", "false");
}

function scheduleCryptoSearch(index, query) {
  window.clearTimeout(cryptoSearchTimer);
  const normalizedQuery = String(query || "").trim();
  if (normalizedQuery.length < 2) return;

  const sequence = ++cryptoSearchSequence;
  cryptoSearchTimer = window.setTimeout(async () => {
    try {
      const options = await searchCryptoAssets(normalizedQuery);
      if (sequence !== cryptoSearchSequence) return;
      mergeCryptoCurrencyOptions(options);

      const input = els.assetRows.querySelector(`[data-crypto-query="${index}"]`);
      if (input && input === document.activeElement && input.value.trim() === normalizedQuery) {
        renderCryptoSearchResults(index, normalizedQuery);
      }
    } catch (error) {
      console.warn("CoinPaprika search is unavailable", error);
    }
  }, CRYPTO_SEARCH_DEBOUNCE_MS);
}

async function searchCryptoAssets(query) {
  const cacheKey = normalizeSearchText(query);
  if (cryptoSearchCache.has(cacheKey)) return cryptoSearchCache.get(cacheKey);

  const url = `${COINPAPRIKA_API_URL}/search?q=${encodeURIComponent(query)}&c=currencies&limit=20`;
  const response = await fetchMarketJson(url);
  const options = Array.isArray(response?.currencies)
    ? response.currencies
        .filter((currency) => currency?.is_active !== false)
        .map(normalizeCryptoCurrencyOption)
        .filter(Boolean)
    : [];
  cryptoSearchCache.set(cacheKey, options);
  return options;
}

function normalizeCryptoCurrencyOption(currency) {
  const id = String(currency?.id || "").trim();
  const code = String(currency?.symbol || "").trim().toUpperCase();
  const name = String(currency?.name || "").trim();
  if (!id || !code || !name) return null;

  const label = `${code} — ${name}`;
  return {
    id,
    code,
    name,
    label,
    rank: Number(currency?.rank || 0),
    searchText: normalizeSearchText(`${code} ${name} ${id}`),
  };
}

function mergeCryptoCurrencyOptions(options) {
  const byId = new Map(cryptoCurrencyOptions.map((option) => [option.id, option]));
  options.forEach((option) => {
    const curated = byId.get(option.id);
    byId.set(option.id, curated
      ? {
          ...option,
          code: curated.code,
          name: curated.name,
          label: curated.label,
          searchText: normalizeSearchText(`${curated.code} ${curated.name} ${option.name} ${option.id}`),
        }
      : option);
  });
  cryptoCurrencyOptions = Array.from(byId.values());
}

function compareCryptoOptions(left, right) {
  const leftRank = Number(left.rank || Number.MAX_SAFE_INTEGER);
  const rightRank = Number(right.rank || Number.MAX_SAFE_INTEGER);
  return leftRank - rightRank || left.code.localeCompare(right.code);
}

function normalizeSearchText(value) {
  return String(value || "").trim().toLocaleLowerCase("ru");
}

function selectCryptoAsset(index, optionId) {
  const row = state.currentRows[index];
  const option = cryptoCurrencyOptions.find(({ id }) => id === optionId);
  if (!row || !option) return;

  row.marketId = option.id;
  row.currencyCode = option.code;
  row.name = option.label;
  row.unitRate = 0;
  row.rateSource = "CoinPaprika";
  row.rateUpdatedAt = "";
  row.conversionConfigured = Number(row.units || 0) > 0;
  recalculateAssetAmount(row);
  renderAssets();
  void loadLatestCryptoRate(row.id, option);
}

async function loadLatestCryptoRate(rowId, option) {
  const token = beginAssetRateRequest(rowId);
  setAssetRateLoading(rowId, true);
  try {
    const ticker = await fetchMarketJson(`${COINPAPRIKA_API_URL}/tickers/${encodeURIComponent(option.id)}?quotes=RUB`);
    const rate = Number(ticker?.quotes?.RUB?.price);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error("CoinPaprika returned an invalid RUB price");
    applyLoadedAssetRate(rowId, token, {
      rate,
      source: "CoinPaprika",
      updatedAt: ticker?.last_updated || "",
    });
  } catch (error) {
    finishAssetRateRequest(rowId, token);
    setAssetRateLoading(rowId, false);
    console.warn("CoinPaprika ticker is unavailable", error);
    showSaveNotice(`Не удалось загрузить цену ${option.code}. Введите её вручную`, "error");
  }
}

async function loadLatestFiatRate(rowId, currencyCode) {
  if (currencyCode === "RUB") return;
  const token = beginAssetRateRequest(rowId);
  setAssetRateLoading(rowId, true);
  try {
    const quote = await fetchMarketJson(`${FRANKFURTER_API_URL}/rate/${encodeURIComponent(currencyCode)}/RUB`);
    const rate = Number(quote?.rate);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error("Frankfurter returned an invalid RUB rate");
    applyLoadedAssetRate(rowId, token, {
      rate,
      source: "Frankfurter",
      updatedAt: quote?.date || "",
    });
  } catch (error) {
    finishAssetRateRequest(rowId, token);
    setAssetRateLoading(rowId, false);
    console.warn("Frankfurter rate is unavailable", error);
    showSaveNotice(`Не удалось загрузить курс ${currencyCode}. Введите его вручную`, "error");
  }
}

function beginAssetRateRequest(rowId) {
  const token = Symbol(rowId);
  pendingAssetRateRequests.set(rowId, token);
  return token;
}

function finishAssetRateRequest(rowId, token) {
  if (pendingAssetRateRequests.get(rowId) !== token) return false;
  pendingAssetRateRequests.delete(rowId);
  return true;
}

function applyLoadedAssetRate(rowId, token, value) {
  if (!finishAssetRateRequest(rowId, token)) return;
  const index = state.currentRows.findIndex((row) => row.id === rowId);
  const row = state.currentRows[index];
  if (!row) return;

  row.unitRate = value.rate;
  row.rateSource = value.source;
  row.rateUpdatedAt = value.updatedAt;
  row.conversionConfigured = Number(row.units || 0) > 0;
  recalculateAssetAmount(row);
  updateAssetRateUi(index, row);
}

function setAssetRateLoading(rowId, loading) {
  const index = state.currentRows.findIndex((row) => row.id === rowId);
  const input = els.assetRows
    .querySelector(`[data-asset-entry="${index}"] [data-asset-field="unitRate"]`);
  if (!input) return;
  input.placeholder = loading ? "Загрузка…" : "Введите значение";
  input.closest(".asset-field")?.classList.toggle("is-loading", loading);
}

function updateAssetRateUi(index, row) {
  const card = els.assetRows.querySelector(`[data-asset-entry="${index}"]`);
  const input = card?.querySelector('[data-asset-field="unitRate"]');
  if (input) {
    input.value = formatAssetDecimal(row.unitRate);
    input.placeholder = "Введите значение";
    input.closest(".asset-field")?.classList.remove("is-loading");
  }
  updateDisplayedAssetTotals();
}

function renderAssetNumberField(label, field, value, index, format, className = "") {
  const displayValue = format === "money" ? formatPlainNumber(value) : formatAssetDecimal(value);
  return `
    <label class="asset-field ${className}">
      ${label}
      <input
        data-asset-field="${field}"
        data-asset-format="${format}"
        data-index="${index}"
        inputmode="decimal"
        value="${displayValue}"
      />
    </label>
  `;
}

function renderAssetDateField(label, field, value, index) {
  return `
    <label class="asset-field">
      ${label}
      <input data-asset-field="${field}" data-index="${index}" type="date" value="${escapeHtml(value || "")}" />
    </label>
  `;
}

function renderHistory() {
  const records = sortedRecords();
  const yearRecords = getYearRecords();
  const yearDeltaByYear = new Map(
    yearRecords.map((record, index) => {
      const previous = yearRecords[index - 1];
      return [record.year, { delta: previous ? record.total - previous.total : null, previousTotal: previous?.total }];
    }),
  );
  const years = [...new Set(records.map((record) => record.year))].sort((a, b) => b - a);
  if (!historyInitialized && years.length) {
    expandedHistoryYears.add(years[0]);
    historyInitialized = true;
  }

  els.historyRows.innerHTML = years
    .flatMap((year) => {
      const yearRecord = yearRecords.find((record) => record.year === year);
      const yearDelta = yearDeltaByYear.get(year) ?? { delta: null, previousTotal: undefined };
      const monthRecords = records.filter((record) => record.year === year).reverse();
      const isExpanded = expandedHistoryYears.has(year);
      const yearRow = `
        <tr class="history-year-row">
          <td>
            <button class="history-toggle" type="button" data-history-year="${year}" aria-expanded="${isExpanded}">
              <span class="history-chevron" aria-hidden="true"></span>
              <span>${year}</span>
            </button>
          </td>
          <td class="amount-column">${formatMoney(yearRecord.total)}</td>
          ${deltaCells(yearDelta.delta, yearDelta.previousTotal)}
          <td class="history-actions-cell"></td>
        </tr>
      `;
      const monthRows = isExpanded
        ? monthRecords.map((record) => {
            const previous = findPreviousRecord(record);
            const delta = previous ? record.total - previous.total : null;
            return `
              <tr class="history-month-row">
                <td><span>${months[record.month]} ${record.year}</span></td>
                <td class="amount-column">${formatMoney(record.total)}</td>
                ${deltaCells(delta, previous?.total)}
                <td class="history-actions-cell">
                  <button
                    class="delete-row history-delete-button"
                    type="button"
                    data-history-delete="${record.key}"
                    aria-label="Удалить ${months[record.month]} ${record.year}"
                    title="Удалить месяц"
                  >×</button>
                </td>
              </tr>
            `;
          })
        : [];
      return [yearRow, ...monthRows];
    })
    .join("");

  els.historyRows.querySelectorAll("[data-history-year]").forEach((button) => {
    button.addEventListener("click", () => {
      const year = Number(button.dataset.historyYear);
      if (expandedHistoryYears.has(year)) expandedHistoryYears.delete(year);
      else expandedHistoryYears.add(year);
      renderHistory();
    });
  });

  els.historyRows.querySelectorAll("[data-history-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteHistoryRecord(button.dataset.historyDelete, button));
  });
}

async function deleteHistoryRecord(key, button) {
  if (!isAuthenticated()) {
    showSaveNotice("Войдите в аккаунт, чтобы удалять записи истории", "error");
    return;
  }

  const record = state.records.find((item) => item.key === key);
  if (!record) return;
  const period = `${months[record.month]} ${record.year}`;
  if (!window.confirm(`Удалить запись за ${period}? Это действие нельзя отменить.`)) return;

  const previousRecords = state.records;
  state.records = state.records.filter((item) => item.key !== key);
  button.disabled = true;

  try {
    await persist();
    if (!state.records.some((item) => item.year === record.year)) {
      expandedHistoryYears.delete(record.year);
    }
    renderAll();
    showSaveNotice(`Запись за ${period} удалена`);
  } catch (error) {
    console.error("History delete failed", error);
    state.records = previousRecords;
    renderAll();
    showSaveNotice(error.message || "Не удалось удалить запись истории", "error");
  }
}

function renderMetrics() {
  const records = sortedRecords();
  const latest = records.at(-1);
  const previous = latest ? findPreviousRecord(latest) : null;
  const latestYearPrevious = latest ? getYearRecords().find((record) => record.year === latest.year - 1) : null;

  els.totalMetric.textContent = latest ? formatMoney(latest.total) : "0 ₽";
  els.yearDeltaMetric.innerHTML =
    latest && latestYearPrevious ? formatMetricChange(latest.total - latestYearPrevious.total, latestYearPrevious.total) : "0 ₽";
  els.monthDeltaMetric.innerHTML =
    latest && previous ? formatMetricChange(latest.total - previous.total, previous.total) : "0 ₽";
}

async function updateExternalMetrics() {
  setExternalMetric(els.inflationMetric, els.inflationMeta, "Загрузка", "официальные данные");
  setExternalMetric(els.usdRateMetric, els.usdRateMeta, "Загрузка", "ЦБ РФ");
  setExternalMetric(els.eurRateMetric, els.eurRateMeta, "Загрузка", "ЦБ РФ");

  try {
    const response = await loadExternalMetrics();
    const rates = response.metrics?.rates;
    const inflation = response.metrics?.inflation;

    if (rates?.ok) {
      const meta = rates.date ? `ЦБ РФ · ${rates.date}` : "ЦБ РФ";
      setExternalMetric(els.usdRateMetric, els.usdRateMeta, formatRate(rates.usd), meta);
      setExternalMetric(els.eurRateMetric, els.eurRateMeta, formatRate(rates.eur), meta);
    } else {
      setExternalMetric(els.usdRateMetric, els.usdRateMeta, "Нет данных", "ЦБ РФ недоступен");
      setExternalMetric(els.eurRateMetric, els.eurRateMeta, "Нет данных", "ЦБ РФ недоступен");
    }

    if (inflation?.ok) {
      setExternalMetric(
        els.inflationMetric,
        els.inflationMeta,
        formatPercentValue(inflation.value),
        inflation.period ? `ЦБ РФ · ${inflation.period}` : "ЦБ РФ"
      );
    } else {
      setExternalMetric(els.inflationMetric, els.inflationMeta, "Нет данных", "ЦБ РФ недоступен");
    }
  } catch (error) {
    console.error("Metrics load failed", error);
    setExternalMetric(els.usdRateMetric, els.usdRateMeta, "Нет данных", "ЦБ РФ недоступен");
    setExternalMetric(els.eurRateMetric, els.eurRateMeta, "Нет данных", "ЦБ РФ недоступен");
    setExternalMetric(els.inflationMetric, els.inflationMeta, "Нет данных", "ЦБ РФ недоступен");
  }
}

async function loadExternalMetrics() {
  const isGitHubPages = window.location.hostname.endsWith("github.io");
  const staticUrls = isGitHubPages
    ? [STATIC_METRICS_URL, new URL("metrics.json", window.location.href).href]
    : ["metrics.json", STATIC_METRICS_URL];
  let lastError = null;

  for (const staticUrl of staticUrls) {
    try {
      const separator = staticUrl.includes("?") ? "&" : "?";
      const response = await fetch(`${staticUrl}${separator}updated=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Static metrics error: ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Static metrics are unavailable");
}

function setExternalMetric(valueElement, metaElement, value, meta) {
  if (valueElement) valueElement.textContent = value;
  if (metaElement) metaElement.textContent = meta;
}

function drawChart() {
  const canvas = els.chart;
  const shell = canvas.parentElement;
  const rect = shell.getBoundingClientRect();
  const isMobileChart = rect.width < 620;
  const width = Math.max(280, Math.floor(rect.width - (isMobileChart ? 20 : 32)));
  const height = isMobileChart ? 230 : rect.width < 900 ? 280 : 320;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const records = getChartRecords();
  chartHitAreas = [];
  if (!records.length) {
    hideChartTooltip();
    ctx.fillStyle = getCssColor("--muted");
    ctx.font = `${isMobileChart ? 15 : 17}px Inter, Calibri, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Сохраните первый месяц, чтобы увидеть динамику.", width / 2, height / 2);
    return;
  }

  const values = records.map((record) => record.total);
  const valueMin = Math.min(...values);
  const valueMax = Math.max(...values);
  const valuePadding = Math.max((valueMax - valueMin) * 0.14, Math.abs(valueMax) * 0.025, 1);
  const min = Math.max(0, valueMin - valuePadding);
  const max = valueMax + valuePadding;
  const plot = isMobileChart
    ? { left: 8, right: 8, top: 16, bottom: 14 }
    : { left: 12, right: 12, top: 20, bottom: 18 };
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const xStep = records.length > 1 ? plotWidth / (records.length - 1) : 0;

  const points = records.map((record, index) => {
    const x = records.length > 1 ? plot.left + index * xStep : plot.left + plotWidth / 2;
    const y = plot.top + plotHeight - ((record.total - min) / (max - min)) * plotHeight;
    return { x, y, record, index };
  });

  const areaGradient = ctx.createLinearGradient(0, plot.top, 0, plot.top + plotHeight);
  areaGradient.addColorStop(0, getCssColor("--chart-area-top"));
  areaGradient.addColorStop(1, getCssColor("--chart-area-bottom"));
  ctx.beginPath();
  traceChartPath(ctx, points);
  ctx.lineTo(points.at(-1).x, plot.top + plotHeight);
  ctx.lineTo(points[0].x, plot.top + plotHeight);
  ctx.closePath();
  ctx.fillStyle = areaGradient;
  ctx.fill();

  ctx.beginPath();
  traceChartPath(ctx, points);
  ctx.strokeStyle = getCssColor("--chart-line");
  ctx.lineWidth = isMobileChart ? 2 : 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  const hitHalfWidth = Math.max(16, xStep / 2);
  chartHitAreas = points.map((point) => ({
    ...point,
    left: point.x - hitHalfWidth,
    right: point.x + hitHalfWidth,
    top: plot.top,
    bottom: plot.top + plotHeight,
    plotBottom: plot.top + plotHeight,
  }));

  const activeIndex = chartHoverIndex ?? chartSelectedIndex;
  const activeArea = activeIndex === null ? null : chartHitAreas[activeIndex];
  if (activeArea) {
    ctx.strokeStyle = getCssColor("--chart-guide");
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(activeArea.x, plot.top);
    ctx.lineTo(activeArea.x, plot.top + plotHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = getCssColor("--surface");
    ctx.arc(activeArea.x, activeArea.y, isMobileChart ? 6 : 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = getCssColor("--chart-line");
    ctx.arc(activeArea.x, activeArea.y, isMobileChart ? 3 : 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (activeArea) showChartTooltip(activeArea, records);
}

function traceChartPath(ctx, points) {
  if (!points.length) return;
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const middleX = (previous.x + current.x) / 2;
    ctx.bezierCurveTo(middleX, previous.y, middleX, current.y, current.x, current.y);
  }
}

function getChartRecords() {
  const records = sortedRecords();
  const rangeMonths = {
    "6m": 6,
    "1y": 12,
    "3y": 36,
    "5y": 60,
  }[chartRange];
  if (!rangeMonths || !records.length) return records;

  const latest = records.at(-1);
  const latestMonthIndex = latest.year * 12 + latest.month;
  const firstMonthIndex = latestMonthIndex - rangeMonths + 1;
  return records.filter((record) => record.year * 12 + record.month >= firstMonthIndex);
}

function handleChartPointerMove(event) {
  const rect = els.chart.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const index = findChartHitIndex(x, y);
  if (index === chartHoverIndex) return;

  chartHoverIndex = index;
  if (index === null) hideChartTooltip();
  drawChart();
}

function handleChartClick(event) {
  const rect = els.chart.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const index = findChartHitIndex(x, y);
  chartSelectedIndex = chartSelectedIndex === index ? null : index;
  chartHoverIndex = index;
  drawChart();
}

function findChartHitIndex(x, y) {
  if (!chartHitAreas.length) return null;
  const direct = chartHitAreas.findIndex((area) => x >= area.left && x <= area.right && y >= area.top && y <= area.bottom);
  if (direct >= 0) return direct;

  const nearest = chartHitAreas
    .map((area, index) => ({ index, distance: Math.abs(area.x - x) + Math.abs(area.y - y) * 0.35 }))
    .sort((a, b) => a.distance - b.distance)[0];
  return nearest && nearest.distance < 24 ? nearest.index : null;
}

function showChartTooltip(area, records) {
  if (!els.chartTooltip) return;
  const previous = records[area.index - 1] ?? findPreviousRecord(area.record);
  const delta = previous ? area.record.total - previous.total : null;
  const tone = delta === null || delta >= 0 ? "positive" : "negative";
  const deltaText = delta === null ? "-" : formatSignedMoney(delta);
  const percentText = delta === null || previous.total === 0 ? "" : `<small>${formatSignedPercent(delta / previous.total)}</small>`;

  els.chartTooltip.innerHTML = `
    <strong>${formatFullPeriod(area.record)}</strong>
    <span>${formatMoney(area.record.total)}</span>
    <em class="${tone}">${deltaText}${percentText}</em>
  `;

  const shellRect = els.chart.parentElement.getBoundingClientRect();
  const tooltipWidth = 168;
  const left = Math.min(
    Math.max(els.chart.offsetLeft + area.x + 14, 12),
    shellRect.width - tooltipWidth - 12,
  );
  const top = Math.max(els.chart.offsetTop + area.y - 76, 12);
  els.chartTooltip.style.left = `${left}px`;
  els.chartTooltip.style.top = `${top}px`;
  els.chartTooltip.hidden = false;
}

function hideChartTooltip() {
  if (els.chartTooltip) els.chartTooltip.hidden = true;
}

function resetChartInteraction() {
  chartHoverIndex = null;
  chartSelectedIndex = null;
  chartHitAreas = [];
  hideChartTooltip();
}

function renderAssetStructure() {
  if (!els.assetStructureRows) return;
  const latest = sortedRecords().at(-1);
  if (!latest) {
    els.assetStructurePeriod.textContent = "Нет сохраненных месяцев";
    els.assetStructureTotal.textContent = "0 ₽";
    els.assetStructureRows.innerHTML = `<p class="structure-empty">Сохраните первый месяц, чтобы увидеть состав активов.</p>`;
    return;
  }

  const rows = latest.rows?.length ? latest.rows : state.currentRows;
  const categories = getAssetStructure(rows);
  const rowsTotal = categories.reduce((total, item) => total + item.total, 0);
  const total = rowsTotal || latest.total || 0;

  els.assetStructurePeriod.textContent = formatFullPeriod(latest);
  els.assetStructureTotal.textContent = formatMoney(total);

  if (!categories.length || total <= 0) {
    els.assetStructureRows.innerHTML = `<p class="structure-empty">В последнем месяце нет сумм по категориям.</p>`;
    return;
  }

  els.assetStructureRows.innerHTML = categories
    .map((item, index) => {
      const share = item.total / total;
      const width = Math.max(2, Math.round(share * 100));
      const details = rows
        .filter((row) => row.category === item.category && Number(row.amount || 0) > 0)
        .sort((a, b) => b.amount - a.amount)
        .map((row) => ({ name: row.name, amount: row.amount }));
      return `
        <article class="structure-row" style="--bar-color: ${getStructureColor(index)}" tabindex="0" data-category="${escapeHtml(item.category)}" data-items="${escapeHtml(JSON.stringify(details))}">
          <div class="structure-row-main">
            <span class="structure-dot" aria-hidden="true"></span>
            <strong>${escapeHtml(item.category)}</strong>
            <small>${formatPercent(share)}</small>
            <span>${formatMoney(item.total)}</span>
          </div>
          <div class="structure-track" aria-hidden="true">
            <span style="width: ${width}%"></span>
          </div>
        </article>
      `;
    })
    .join("");

  els.assetStructureRows.querySelectorAll(".structure-row").forEach((row) => {
    row.addEventListener("mouseenter", () => showStructureTooltip(row));
    row.addEventListener("mousemove", () => showStructureTooltip(row));
    row.addEventListener("mouseleave", hideStructureTooltip);
    row.addEventListener("focus", () => showStructureTooltip(row));
    row.addEventListener("blur", hideStructureTooltip);
  });
}

function getCssColor(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function getShortMonth(month) {
  return months[month].slice(0, 3);
}

function formatPeriod(record) {
  return `${getShortMonth(record.month)} ${record.year}`;
}

function formatFullPeriod(record) {
  return `${months[record.month]} ${record.year}`;
}

function showStructureTooltip(row) {
  if (!els.structureTooltip) return;

  const items = parseStructureItems(row.dataset.items);
  const title = row.dataset.category || "";
  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  els.structureTooltip.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <span>${formatMoney(total)}</span>
    <div>
      ${items.length ? items.map((item) => `<p><em>${escapeHtml(item.name)}</em><b>${formatMoney(item.amount)}</b></p>`).join("") : "<p><em>Нет сумм</em><b>-</b></p>"}
    </div>
  `;

  els.structureTooltip.style.left = "0";
  els.structureTooltip.style.top = "0";
  els.structureTooltip.hidden = false;
  positionStructureTooltip(row);
}

function positionStructureTooltip(row) {
  const viewportPadding = 12;
  const gap = 8;
  const rowRect = row.getBoundingClientRect();
  const tooltipRect = els.structureTooltip.getBoundingClientRect();
  const maxLeft = Math.max(viewportPadding, window.innerWidth - tooltipRect.width - viewportPadding);
  const left = Math.min(Math.max(rowRect.left + 20, viewportPadding), maxLeft);
  const belowTop = rowRect.bottom + gap;
  const aboveTop = rowRect.top - tooltipRect.height - gap;
  const fitsBelow = belowTop + tooltipRect.height <= window.innerHeight - viewportPadding;
  const fitsAbove = aboveTop >= viewportPadding;
  let top = belowTop;

  if (!fitsBelow && fitsAbove) {
    top = aboveTop;
  } else if (!fitsBelow) {
    const spaceBelow = window.innerHeight - rowRect.bottom;
    const spaceAbove = rowRect.top;
    top = spaceAbove > spaceBelow ? aboveTop : belowTop;
  }

  const maxTop = Math.max(viewportPadding, window.innerHeight - tooltipRect.height - viewportPadding);
  els.structureTooltip.style.left = `${left}px`;
  els.structureTooltip.style.top = `${Math.min(Math.max(top, viewportPadding), maxTop)}px`;
}

function hideStructureTooltip() {
  if (els.structureTooltip) els.structureTooltip.hidden = true;
}

function parseStructureItems(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function updateAssetFieldFromInput(event) {
  const input = event.target;
  const index = Number(input.dataset.index);
  const field = input.dataset.assetField;
  const row = state.currentRows[index];
  if (!row || !field) return;
  const previousValue = row[field];

  if (["amount"].includes(field)) row[field] = parseAmount(input.value);
  else if (["units", "unitRate", "annualRate"].includes(field)) row[field] = parseAssetDecimal(input.value);
  else row[field] = input.value;

  if (field === "unitRate") {
    pendingAssetRateRequests.delete(row.id);
    row.rateSource = "manual";
    row.rateUpdatedAt = "";
    setAssetRateLoading(row.id, false);
  }

  if (field === "currencyCode" && previousValue !== row.currencyCode) {
    const isRuble = row.group === "cash" && row.currencyCode === "RUB";
    row.marketId = "";
    row.name = getAutomaticAssetName(row.group, row.type, row.currencyCode, row.marketId) || row.name;
    row.unitRate = isRuble ? 1 : 0;
    row.rateSource = isRuble ? "" : "Frankfurter";
    row.rateUpdatedAt = "";
    row.conversionConfigured = true;
    recalculateAssetAmount(row);
    updateAssetRateUi(index, row);
    if (row.group === "cash" && !isRuble) {
      void loadLatestFiatRate(row.id, row.currencyCode);
    }
  }

  if (isConvertibleAsset(row.group, row.type) && ["units", "unitRate"].includes(field)) {
    row.conversionConfigured = true;
    recalculateAssetAmount(row);
  }

  updateDisplayedAssetTotals();
}

function commitAssetField(event) {
  updateAssetFieldFromInput(event);
  const input = event.target;
  const index = Number(input.dataset.index);
  const field = input.dataset.assetField;
  const row = state.currentRows[index];
  if (!row) return;

  if (field === "name") {
    row.name = input.value.trim() || "Без названия";
    input.value = row.name;
  } else if (input.dataset.assetFormat === "money") {
    input.value = formatPlainNumber(row[field]);
  } else if (input.dataset.assetFormat === "decimal") {
    input.value = formatAssetDecimal(row[field]);
  }
}

function changeAssetType(event) {
  const index = Number(event.target.dataset.index);
  const row = state.currentRows[index];
  if (!row) return;

  row.type = event.target.value;
  if (isConvertibleAsset(row.group, row.type)) {
    const isCash = row.group === "cash";
    row.currencyCode = row.group === "crypto"
      ? (isCryptoCurrencyCode(row.currencyCode) ? row.currencyCode : "BTC")
      : (isFiatCurrencyCode(row.currencyCode) ? row.currencyCode : "RUB");
    const isRuble = isCash && row.currencyCode === "RUB";
    row.marketId = row.group === "crypto" ? getCryptoOptionForRow(row)?.id || "btc-bitcoin" : "";
    row.units = Number(row.units || 0);
    row.unitRate = isRuble ? 1 : 0;
    row.rateSource = row.group === "crypto" ? "CoinPaprika" : (isRuble ? "" : "Frankfurter");
    row.rateUpdatedAt = "";
    row.name = getAutomaticAssetName(row.group, row.type, row.currencyCode, row.marketId);
    row.conversionConfigured = isCash || Number(row.units || 0) > 0;
    recalculateAssetAmount(row);
  } else if (row.group === "cash") {
    row.currencyCode = "RUB";
    row.marketId = "";
    row.name = "Рубль";
    row.conversionConfigured = false;
    row.rateSource = "";
    row.rateUpdatedAt = "";
  }
  renderAssets();
  if (isConvertibleAsset(row.group, row.type)) {
    if (row.group === "crypto") {
      const option = getCryptoOptionForRow(row);
      if (option) void loadLatestCryptoRate(row.id, option);
    } else {
      void loadLatestFiatRate(row.id, row.currencyCode);
    }
  }
}

function updateDisplayedAssetTotals() {
  const totals = getAssetGroupTotals(state.currentRows);
  els.assetGroupNav.querySelectorAll("[data-asset-group-total]").forEach((element) => {
    element.textContent = formatMoney(totals[element.dataset.assetGroupTotal] || 0);
  });
  els.assetTotalCell.textContent = formatMoney(sumRows(state.currentRows));
  els.assetGroupTotal.textContent = formatMoney(totals[activeAssetGroup] || 0);
  els.assetRows.querySelectorAll("[data-asset-calculated]").forEach((element) => {
    const index = Number(element.dataset.assetCalculated);
    element.textContent = formatMoney(state.currentRows[index]?.amount || 0);
  });
}

function destroyAssetSortable() {
  assetSortable?.destroy();
  assetSortable = null;
}

function initializeAssetSorting(rowCount) {
  if (rowCount < 2 || !els.assetRows || !window.Sortable) return;

  assetSortable = window.Sortable.create(els.assetRows, {
    animation: 180,
    direction: "vertical",
    draggable: ".asset-entry-card",
    handle: ".asset-drag-handle",
    ghostClass: "asset-entry-ghost",
    chosenClass: "asset-entry-chosen",
    dragClass: "asset-entry-dragging",
    fallbackClass: "asset-entry-dragging",
    fallbackOnBody: true,
    fallbackTolerance: 4,
    delay: 180,
    delayOnTouchOnly: true,
    touchStartThreshold: 4,
    scrollSensitivity: 80,
    scrollSpeed: 12,
    onEnd(event) {
      const oldPosition = event.oldDraggableIndex;
      const newPosition = event.newDraggableIndex;
      if (!Number.isInteger(oldPosition) || !Number.isInteger(newPosition) || oldPosition === newPosition) return;

      reorderActiveAssetRows(oldPosition, newPosition);
      window.setTimeout(() => {
        renderAssets();
        void saveSelectedMonth();
      }, 0);
    },
  });
}

function reorderActiveAssetRows(oldPosition, newPosition) {
  const groupIndexes = state.currentRows
    .map((row, index) => (row.group === activeAssetGroup ? index : -1))
    .filter((index) => index >= 0);
  const groupRows = groupIndexes.map((index) => state.currentRows[index]);
  const [movedRow] = groupRows.splice(oldPosition, 1);
  if (!movedRow) return;

  groupRows.splice(newPosition, 0, movedRow);
  groupIndexes.forEach((stateIndex, position) => {
    state.currentRows[stateIndex] = groupRows[position];
  });
}

function addAssetRow() {
  if (!isAuthenticated()) {
    showSaveNotice("Войдите в аккаунт, чтобы добавлять активы", "error");
    return;
  }

  const group = getAssetGroup(activeAssetGroup);
  const row = normalizeRowState({
    id: createAssetId(group.id, state.currentRows.length),
    group: group.id,
    category: group.label,
    type: group.defaultType,
    name: "Новый актив",
    amount: 0,
  });
  state.currentRows.push(row);
  renderAssets();
  els.assetRows.querySelector(
    ".asset-entry-card:last-child [data-asset-field='name'], .asset-entry-card:last-child [data-fiat-query], .asset-entry-card:last-child [data-crypto-query]",
  )?.focus();
  if (row.group === "crypto") {
    const option = getCryptoOptionForRow(row);
    if (option) void loadLatestCryptoRate(row.id, option);
  }
}

function hydrateTheme() {
  const theme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(theme);
  if (els.themeSelect) els.themeSelect.value = theme;
}

function setTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
  drawChart();
}

function applyTheme(theme) {
  document.body.dataset.theme = theme === "dark" ? "dark" : "light";
}

async function hydrateSession() {
  try {
    ensureSupabaseClient();
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    authState.user = !passwordRecoveryActive && data.session?.user
      ? await loadSupabaseUser(data.session.user)
      : null;
  } catch (error) {
    console.error("Session restore failed", error);
    authState.user = null;
    showSaveNotice("Сервис аккаунтов временно недоступен", "error");
  }
  updateAccountStatus();
  if (passwordRecoveryActive) activatePasswordRecovery();
}

function bindSupabaseAuthEvents() {
  if (!supabaseClient) return;
  supabaseClient.auth.onAuthStateChange((event) => {
    if (event !== "PASSWORD_RECOVERY") return;
    window.setTimeout(() => activatePasswordRecovery(), 0);
  });
}

function updateAccountStatus() {
  if (!els.accountStatus || !els.accountNote) return;

  if (isAuthenticated()) {
    const profile = getUserProfile(authState.user);
    const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
    els.accountStatus.value = authState.user.email;
    if (els.profileFirstNameInput) els.profileFirstNameInput.value = profile.firstName;
    if (els.profileLastNameInput) els.profileLastNameInput.value = profile.lastName;
    if (els.sidebarUserName) els.sidebarUserName.textContent = displayName;
    if (els.sidebarUserAvatar) els.sidebarUserAvatar.textContent = getUserInitials(profile);
    if (els.profileMenuSubtitle) {
      els.profileMenuSubtitle.textContent = "";
      els.profileMenuSubtitle.hidden = true;
    }
    els.accountNote.textContent = "Изменения сохраняются в защищённом персональном хранилище Supabase.";
    if (els.accountLoginForm) els.accountLoginForm.hidden = true;
    if (els.accountSession) els.accountSession.hidden = false;
    if (els.sidebarLoginBtn) els.sidebarLoginBtn.hidden = true;
    if (els.sidebarUserBtn) els.sidebarUserBtn.hidden = false;
  } else {
    els.accountStatus.value = "";
    els.accountNote.textContent = "В гостевом режиме активы и история не сохраняются.";
    if (els.accountLoginForm) els.accountLoginForm.hidden = false;
    if (els.accountSession) els.accountSession.hidden = true;
    if (els.sidebarLoginBtn) els.sidebarLoginBtn.hidden = false;
    if (els.sidebarUserBtn) els.sidebarUserBtn.hidden = true;
    if (els.profileMenuSubtitle) {
      els.profileMenuSubtitle.textContent = "Вход в персональный аккаунт";
      els.profileMenuSubtitle.hidden = false;
    }
  }

  const editingEnabled = isAuthenticated();
  if (els.addRowBtn) els.addRowBtn.disabled = !editingEnabled;
  if (els.saveMonthBtn) els.saveMonthBtn.disabled = !editingEnabled;
}

function toggleProfileMenu(forceOpen) {
  if (!els.profileMenu) return;
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : els.profileMenu.hidden;
  els.profileMenu.hidden = !shouldOpen;
  els.sidebarLoginBtn?.setAttribute("aria-expanded", String(shouldOpen));
  els.sidebarUserBtn?.setAttribute("aria-expanded", String(shouldOpen));
  if (shouldOpen && !isAuthenticated()) {
    clearAuthMessage();
    els.authEmailInput?.focus();
  }
}

function setAuthMode(mode) {
  const allowedModes = new Set(["login", "register", "recovery", "update-password"]);
  authMode = allowedModes.has(mode) ? mode : "login";
  const isRegister = authMode === "register";
  const isRecovery = authMode === "recovery";
  const isPasswordUpdate = authMode === "update-password";
  const isLogin = authMode === "login";

  if (els.authRegisterFields) els.authRegisterFields.hidden = !isRegister;
  if (els.authEmailField) els.authEmailField.hidden = isPasswordUpdate;
  if (els.authPasswordField) els.authPasswordField.hidden = isRecovery;
  if (els.authPasswordConfirmField) els.authPasswordConfirmField.hidden = !(isRegister || isPasswordUpdate);
  if (els.forgotPasswordBtn) els.forgotPasswordBtn.hidden = !isLogin;
  if (els.registerBtn) els.registerBtn.hidden = !isRegister;
  if (els.loginBtn) els.loginBtn.hidden = !isLogin;
  if (els.requestPasswordResetBtn) els.requestPasswordResetBtn.hidden = !isRecovery;
  if (els.updatePasswordBtn) els.updatePasswordBtn.hidden = !isPasswordUpdate;
  if (els.authPasswordLabel) els.authPasswordLabel.textContent = isPasswordUpdate ? "Новый пароль" : "Пароль";
  if (els.authFormTitle) {
    els.authFormTitle.textContent = isRegister
      ? "Создайте аккаунт"
      : isRecovery
        ? "Восстановление пароля"
        : isPasswordUpdate
          ? "Придумайте новый пароль"
          : "С возвращением";
  }
  if (els.authFormDescription) {
    els.authFormDescription.textContent = isRegister
      ? "Зарегистрируйтесь, чтобы хранить персональную финансовую историю."
      : isRecovery
        ? "Укажите email — мы отправим защищённую ссылку для смены пароля."
        : isPasswordUpdate
          ? "Введите новый пароль дважды. Он должен содержать минимум 8 символов."
          : "Войдите, чтобы открыть свои финансовые данные.";
  }
  if (els.authModePrompt) {
    els.authModePrompt.textContent = isRegister
      ? "Уже есть аккаунт?"
      : isLogin
        ? "Нет аккаунта?"
        : "Вспомнили пароль?";
  }
  if (els.authModeToggleBtn) {
    els.authModeToggleBtn.textContent = isLogin ? "Зарегистрироваться" : "Войти";
  }
  if (els.authPasswordInput) {
    els.authPasswordInput.autocomplete = isRegister || isPasswordUpdate ? "new-password" : "current-password";
  }
  if (!(isRegister || isPasswordUpdate) && els.authPasswordConfirmInput) {
    els.authPasswordConfirmInput.value = "";
  }
  clearAuthMessage();
  if (isRegister) els.authFirstNameInput?.focus();
  else if (isPasswordUpdate) els.authPasswordInput?.focus();
  else els.authEmailInput?.focus();
}

function togglePasswordVisibility(button) {
  const input = document.querySelector(`#${button.dataset.passwordToggle}`);
  if (!input) return;
  const shouldShow = input.type === "password";
  input.type = shouldShow ? "text" : "password";
  button.textContent = shouldShow ? "Скрыть" : "Показать";
  button.setAttribute("aria-label", shouldShow ? "Скрыть пароль" : "Показать пароль");
}

function showAuthMessage(message) {
  if (!els.authInlineMessage) return;
  els.authInlineMessage.textContent = message;
  els.authInlineMessage.hidden = false;
}

function clearAuthMessage() {
  if (!els.authInlineMessage) return;
  els.authInlineMessage.textContent = "";
  els.authInlineMessage.hidden = true;
}

async function saveProfile() {
  if (!isAuthenticated()) return;

  const firstName = els.profileFirstNameInput?.value.trim() || "";
  const lastName = els.profileLastNameInput?.value.trim() || "";
  if (!firstName || !lastName || firstName.length > 80 || lastName.length > 80) {
    showSaveNotice("Укажите имя и фамилию длиной до 80 символов", "error");
    return;
  }

  try {
    ensureSupabaseClient();
    const { data, error } = await supabaseClient
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", authState.user.id)
      .select("first_name, last_name")
      .single();
    if (error) throw error;
    authState.user = {
      ...authState.user,
      firstName: data.first_name,
      lastName: data.last_name,
    };
    updateAccountStatus();
    showSaveNotice("Профиль сохранен");
  } catch (error) {
    console.error("Profile save failed", error);
    showSaveNotice(error.message || "Не удалось сохранить профиль", "error");
  }
}

function readAuthCredentials() {
  const email = els.authEmailInput?.value.trim() || "";
  const password = els.authPasswordInput?.value || "";
  if (!email || !password) {
    throw new Error("Укажите email и пароль.");
  }
  return { email, password };
}

async function registerAccount() {
  try {
    clearAuthMessage();
    const credentials = {
      ...readAuthCredentials(),
      firstName: els.authFirstNameInput?.value.trim() || "",
      lastName: els.authLastNameInput?.value.trim() || "",
    };
    const passwordConfirm = els.authPasswordConfirmInput?.value || "";
    if (!credentials.firstName || !credentials.lastName) {
      throw new Error("Укажите имя и фамилию.");
    }
    if (credentials.password.length < 8) {
      throw new Error("Пароль должен содержать минимум 8 символов.");
    }
    if (credentials.password !== passwordConfirm) {
      throw new Error("Пароли не совпадают.");
    }
    ensureSupabaseClient();
    const { data, error } = await supabaseClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          first_name: credentials.firstName,
          last_name: credentials.lastName,
        },
        emailRedirectTo: getAuthRedirectUrl(),
      },
    });
    if (error) throw error;
    clearAuthPassword();
    if (!data.session) {
      authState.user = null;
      setAuthMode("login");
      updateAccountStatus();
      showAuthMessage("Аккаунт создан. Подтвердите email по ссылке из письма, затем войдите.");
      showSaveNotice("Проверьте почту для подтверждения регистрации");
      return;
    }
    authState.user = await loadSupabaseUser(data.user);
    updateAccountStatus();
    await reloadStateFromAccount();
    toggleProfileMenu(false);
    showSaveNotice("Аккаунт создан, вход выполнен");
  } catch (error) {
    console.error("Register failed", error);
    const message = getAuthErrorMessage(error, "Не удалось создать аккаунт");
    showAuthMessage(message);
    showSaveNotice(message, "error");
  }
}

async function loginAccount() {
  try {
    clearAuthMessage();
    const credentials = readAuthCredentials();
    ensureSupabaseClient();
    const { data, error } = await supabaseClient.auth.signInWithPassword(credentials);
    if (error) throw error;
    authState.user = await loadSupabaseUser(data.user);
    clearAuthPassword();
    updateAccountStatus();
    await reloadStateFromAccount();
    toggleProfileMenu(false);
    showSaveNotice("Вход выполнен");
  } catch (error) {
    console.error("Login failed", error);
    const message = getAuthErrorMessage(error, "Не удалось выполнить вход");
    showAuthMessage(message);
    showSaveNotice(message, "error");
  }
}

async function requestPasswordReset() {
  const email = els.authEmailInput?.value.trim() || "";
  if (!email) {
    showAuthMessage("Укажите email аккаунта.");
    els.authEmailInput?.focus();
    return;
  }

  try {
    clearAuthMessage();
    setAuthButtonBusy(els.requestPasswordResetBtn, true, "Отправляем...");
    ensureSupabaseClient();
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordRecoveryRedirectUrl(),
    });
    if (error) throw error;
    showAuthMessage("Письмо отправлено. Откройте ссылку из письма на этом устройстве.");
    showSaveNotice("Письмо для восстановления пароля отправлено");
  } catch (error) {
    console.error("Password reset request failed", error);
    const message = getAuthErrorMessage(error, "Не удалось отправить письмо");
    showAuthMessage(message);
    showSaveNotice(message, "error");
  } finally {
    setAuthButtonBusy(els.requestPasswordResetBtn, false);
  }
}

async function updateRecoveredPassword() {
  const password = els.authPasswordInput?.value || "";
  const passwordConfirm = els.authPasswordConfirmInput?.value || "";
  if (password.length < 8) {
    showAuthMessage("Пароль должен содержать минимум 8 символов.");
    return;
  }
  if (password !== passwordConfirm) {
    showAuthMessage("Пароли не совпадают.");
    return;
  }

  try {
    clearAuthMessage();
    setAuthButtonBusy(els.updatePasswordBtn, true, "Сохраняем...");
    ensureSupabaseClient();
    const { error } = await supabaseClient.auth.updateUser({ password });
    if (error) throw error;

    const { data, error: userError } = await supabaseClient.auth.getUser();
    if (userError) throw userError;
    passwordRecoveryActive = false;
    authState.user = await loadSupabaseUser(data.user);
    clearPasswordRecoveryUrl();
    clearAuthPassword();
    setAuthMode("login");
    updateAccountStatus();
    await reloadStateFromAccount();
    toggleProfileMenu(false);
    showSaveNotice("Пароль успешно изменён");
  } catch (error) {
    console.error("Password update failed", error);
    const message = getAuthErrorMessage(error, "Не удалось изменить пароль");
    showAuthMessage(message);
    showSaveNotice(message, "error");
  } finally {
    setAuthButtonBusy(els.updatePasswordBtn, false);
  }
}

function activatePasswordRecovery() {
  passwordRecoveryActive = true;
  authState.user = null;
  updateAccountStatus();
  setAuthMode("update-password");
  toggleProfileMenu(true);
}

function setAuthButtonBusy(button, busy, busyLabel = "") {
  if (!button) return;
  if (busy) {
    button.dataset.defaultLabel = button.textContent;
    button.textContent = busyLabel || button.textContent;
  } else if (button.dataset.defaultLabel) {
    button.textContent = button.dataset.defaultLabel;
    delete button.dataset.defaultLabel;
  }
  button.disabled = busy;
}

async function logoutAccount() {
  try {
    ensureSupabaseClient();
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Logout failed", error);
  }

  authState.user = null;
  clearAuthPassword();
  setAuthMode("login");
  updateAccountStatus();
  state = buildGuestState();
  loadSelectedMonth({ preserveDraft: true });
  loadSelectedBudget();
  renderAll();
  showSaveNotice("Вы вышли из аккаунта");
}

function clearAuthPassword() {
  if (els.authPasswordInput) els.authPasswordInput.value = "";
  if (els.authPasswordConfirmInput) els.authPasswordConfirmInput.value = "";
}

async function loadState() {
  if (isAuthenticated()) {
    try {
      return await loadStateFromSupabase();
    } catch (error) {
      console.error("Supabase load failed", error);
      showSaveNotice("Не удалось загрузить данные аккаунта", "error");
    }
  }

  return buildGuestState();
}

async function persist() {
  if (isAuthenticated()) {
    const result = await saveStateToSupabase(state);
    state = normalizeState(result.state, { fallbackRecords: [] });
    return { remote: true };
  }

  return { remote: false };
}

async function reloadStateFromAccount() {
  state = await loadStateFromSupabase();
  loadSelectedMonth({ preserveDraft: true });
  loadSelectedBudget();
  renderAll();
}

async function loadStateFromSupabase() {
  ensureSupabaseClient();
  const { data, error } = await supabaseClient
    .from("finance_states")
    .select("state")
    .eq("user_id", authState.user.id)
    .maybeSingle();
  if (error) throw error;

  if (!data) {
    const initialState = await buildInitialAccountState();
    const saved = await saveStateToSupabase(initialState);
    clearLegacyBrowserStorage(authState.user.email);
    return normalizeState(saved.state, { fallbackRecords: [] });
  }

  clearLegacyBrowserStorage(authState.user.email);
  return normalizeState(data.state, { fallbackRecords: [] });
}

async function saveStateToSupabase(value) {
  ensureSupabaseClient();
  const normalized = normalizeState(value, { fallbackRecords: [] });
  const { data, error } = await supabaseClient
    .from("finance_states")
    .upsert({
      user_id: authState.user.id,
      state: normalized,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id",
    })
    .select("state")
    .single();
  if (error) throw error;
  return data;
}

function readBrowserAuthStore() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      nextUserId: Number(parsed?.nextUserId || 1),
      currentUserId: parsed?.currentUserId ? Number(parsed.currentUserId) : null,
      users: Array.isArray(parsed?.users) ? parsed.users : [],
      financeStates: parsed?.financeStates && typeof parsed.financeStates === "object" ? parsed.financeStates : {},
    };
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { nextUserId: 1, currentUserId: null, users: [], financeStates: {} };
  }
}

function getLegacyBrowserState(email) {
  const store = readBrowserAuthStore();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const legacyUser = store.users.find((item) => String(item.email || "").toLowerCase() === normalizedEmail);
  return legacyUser ? store.financeStates[String(legacyUser.id)] || null : null;
}

function clearLegacyBrowserStorage(email) {
  try {
    localStorage.removeItem(LEGACY_FINANCE_STORAGE_KEY);

    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) return;

    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const users = Array.isArray(parsed?.users) ? parsed.users : [];
    const targetIds = users
      .filter((item) => String(item.email || "").trim().toLowerCase() === normalizedEmail)
      .map((item) => String(item.id));
    if (!targetIds.length) return;

    const financeStates = parsed?.financeStates && typeof parsed.financeStates === "object"
      ? { ...parsed.financeStates }
      : {};
    targetIds.forEach((id) => delete financeStates[id]);
    const remainingUsers = users.filter((item) => !targetIds.includes(String(item.id)));
    const currentUserId = targetIds.includes(String(parsed?.currentUserId))
      ? null
      : parsed?.currentUserId || null;

    if (!remainingUsers.length && !Object.keys(financeStates).length) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      nextUserId: Number(parsed?.nextUserId || 1),
      currentUserId,
      users: remainingUsers,
      financeStates,
    }));
  } catch {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Storage may be unavailable in privacy-restricted browser contexts.
    }
  }
}

function getUserProfile(user) {
  const defaults = getDefaultUserProfile(user?.email);
  return {
    firstName: String(user?.firstName || defaults.firstName).trim(),
    lastName: String(user?.lastName || defaults.lastName).trim(),
  };
}

function getDefaultUserProfile(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const parts = normalizedEmail
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  return {
    firstName: parts[0] || "Пользователь",
    lastName: parts.slice(1).join(" "),
  };
}

function getUserInitials(profile) {
  return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase() || "П";
}

async function buildInitialAccountState() {
  const legacyState = getLegacyBrowserState(authState.user.email);
  if (legacyState && !needsEmptyStateMigration(legacyState)) {
    return normalizeState(legacyState, { fallbackRecords: [] });
  }
  return buildGuestState();
}

function needsEmptyStateMigration(value) {
  return !Array.isArray(value?.records) || (!value.records.length && !value.currentRows?.length);
}

async function loadSupabaseUser(user) {
  if (!user) return null;
  ensureSupabaseClient();
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  const metadata = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email,
    firstName: data?.first_name || metadata.first_name || "",
    lastName: data?.last_name || metadata.last_name || "",
    createdAt: user.created_at,
  };
}

function ensureSupabaseClient() {
  if (!supabaseClient) {
    throw new Error("Не удалось загрузить клиент Supabase. Проверьте подключение к интернету.");
  }
}

function getAuthRedirectUrl() {
  if (window.location.protocol === "file:") return "https://coldoutt.github.io/finsun/";
  return `${window.location.origin}${window.location.pathname}`;
}

function getPasswordRecoveryRedirectUrl() {
  const redirectUrl = new URL(getAuthRedirectUrl());
  redirectUrl.searchParams.set("recovery", "1");
  return redirectUrl.href;
}

function detectPasswordRecoveryRedirect() {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);
  return hashParams.get("type") === "recovery" || queryParams.get("recovery") === "1";
}

function clearPasswordRecoveryUrl() {
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("recovery");
  cleanUrl.hash = "";
  window.history.replaceState({}, document.title, `${cleanUrl.pathname}${cleanUrl.search}`);
}

function getAuthErrorMessage(error, fallback) {
  const message = String(error?.message || "").toLowerCase();
  if (message.includes("email rate limit exceeded")) {
    return "Лимит отправки писем исчерпан. Подождите около часа и повторите попытку.";
  }
  if (message.includes("invalid login credentials")) {
    return "Неверный email или пароль.";
  }
  if (message.includes("new password should be different")) {
    return "Новый пароль должен отличаться от предыдущего.";
  }
  if (message.includes("password should be at least")) {
    return "Пароль должен содержать минимум 8 символов.";
  }
  if (message.includes("auth session missing") || message.includes("session")) {
    return "Ссылка восстановления недействительна или истекла. Запросите новое письмо.";
  }
  return error?.message || fallback;
}

function isAuthenticated() {
  return Boolean(authState.user?.id);
}

function buildGuestState() {
  return normalizeState(null, { fallbackRecords: [] });
}

function showSaveNotice(message, tone = "success") {
  if (!els.saveNotice) return;
  window.clearTimeout(saveNoticeTimer);
  els.saveNotice.textContent = message;
  els.saveNotice.classList.toggle("is-error", tone === "error");
  els.saveNotice.hidden = false;
  saveNoticeTimer = window.setTimeout(() => {
    els.saveNotice.hidden = true;
  }, 3200);
}

function normalizeState(value, options = {}) {
  const fallbackRecords = Array.isArray(options.fallbackRecords) ? options.fallbackRecords : [];
  const records = Array.isArray(value?.records)
    ? value.records.map(normalizeRecordState).filter(Boolean)
    : fallbackRecords.map((record) => normalizeRecordState(record)).filter(Boolean);
  const fallbackRows = records.at(-1)?.rows?.length ? records.at(-1).rows : [];
  const currentRows = Array.isArray(value?.currentRows) && value.currentRows.length
    ? value.currentRows.map(normalizeRowState)
    : cloneRows(fallbackRows);
  const budgetMap = new Map();
  if (Array.isArray(value?.budgets)) {
    value.budgets
      .map(normalizeBudgetRecord)
      .filter(Boolean)
      .forEach((budget) => budgetMap.set(budget.key, budget));
  }

  return {
    records,
    currentRows: cloneRows(currentRows),
    budgets: Array.from(budgetMap.values()).sort((a, b) => a.year - b.year || a.month - b.month),
  };
}

function normalizeRecordState(record) {
  const year = Number(record?.year);
  const month = Number(record?.month);
  if (!Number.isInteger(year) || !Number.isInteger(month)) return null;
  const rows = Array.isArray(record?.rows) ? record.rows.map(normalizeRowState) : [];
  const total = Number.isFinite(Number(record?.total))
    ? Math.round(Number(record.total))
    : sumRows(rows);

  return {
    key: recordKey(year, month),
    year,
    month,
    rows,
    total,
    savedAt: record?.savedAt || null,
  };
}

function normalizeRowState(row, index = 0) {
  const group = inferAssetGroup(row);
  const type = inferAssetType(group, row);
  const storedAmount = Number.isFinite(Number(row?.amount)) ? Math.round(Number(row.amount)) : 0;
  const currencyCode = inferAssetCurrencyCode(group.id, type, row);
  const storedUnits = Number.isFinite(Number(row?.units)) ? Number(row.units) : 0;
  const isRubleCash = group.id === "cash" && currencyCode === "RUB";
  const isLegacyRubleAmount = isRubleCash
    && row?.type === "cash"
    && storedUnits === 0
    && storedAmount !== 0;
  const units = isLegacyRubleAmount ? storedAmount : storedUnits;
  const unitRate = isRubleCash
    ? 1
    : (Number.isFinite(Number(row?.unitRate)) ? Number(row.unitRate) : 0);
  const conversionConfigured = isRubleCash
    || row?.conversionConfigured === true
    || (units !== 0 && unitRate !== 0);
  const amount = isConvertibleAsset(group.id, type) && conversionConfigured
    ? Math.round(units * unitRate)
    : storedAmount;
  const marketId = group.id === "crypto"
    ? String(row?.marketId || findCryptoOptionByCode(currencyCode)?.id || "").trim()
    : "";
  const automaticName = getAutomaticAssetName(group.id, type, currencyCode, marketId, row?.name);

  const normalized = {
    id: String(row?.id || createAssetId(group.id, index, `${row?.category || ""}|${row?.name || ""}|${storedAmount}`)),
    group: group.id,
    category: group.label,
    type,
    name: automaticName || String(row?.name || "").trim() || "Без названия",
    amount,
    currencyCode,
    marketId,
    units,
    unitRate,
    conversionConfigured,
    rateSource: isRubleCash ? "" : String(row?.rateSource || "").trim(),
    rateUpdatedAt: isRubleCash ? "" : String(row?.rateUpdatedAt || "").trim(),
    annualRate: Number.isFinite(Number(row?.annualRate)) ? Number(row.annualRate) : 0,
    openedAt: normalizeAssetDate(row?.openedAt),
    closesAt: normalizeAssetDate(row?.closesAt),
    valuationDate: normalizeAssetDate(row?.valuationDate),
    dueDate: normalizeAssetDate(row?.dueDate),
  };

  if (group.id === "crypto" && marketId) {
    mergeCryptoCurrencyOptions([{
      id: marketId,
      code: currencyCode,
      name: getStoredAssetLabel(normalized, currencyCode),
      label: normalized.name,
      rank: 0,
      searchText: normalizeSearchText(`${currencyCode} ${normalized.name} ${marketId}`),
    }]);
  }
  return normalized;
}

function inferAssetGroup(row) {
  const text = `${row?.category || ""} ${row?.name || ""}`.toLowerCase();
  const currencyCode = inferLegacyAssetCurrencyCode(row, text);

  if (row?.group === "money") {
    if (isCryptoAssetRow(row, text)) return getAssetGroup("crypto");
    if (currencyCode && currencyCode !== "RUB" && !isFiatCurrencyCode(currencyCode)) return getAssetGroup("other");
    return getAssetGroup("cash");
  }
  if (row?.group === "debts") return getAssetGroup("other");

  const stored = ASSET_GROUPS.find((group) => group.id === row?.group);
  if (stored) return stored;

  if (isCryptoAssetRow(row, text)) return getAssetGroup("crypto");
  if (text.includes("долг")) return getAssetGroup("other");
  if (text.includes("банк") || text.includes("вклад") || text.includes("счет") || text.includes("счёт")) {
    return getAssetGroup("banks");
  }
  if (
    text.includes("налич")
    || text.includes("валют")
    || currencyCode
  ) {
    return currencyCode && currencyCode !== "RUB" && !isFiatCurrencyCode(currencyCode)
      ? getAssetGroup("other")
      : getAssetGroup("cash");
  }
  if (text.includes("бирж") || text.includes("инвест") || text.includes("иис") || text.includes("брокер")) {
    return getAssetGroup("investments");
  }
  if (text.includes("недвиж") || text.includes("квартир") || text.includes("дом") || text.includes("земл")) {
    return getAssetGroup("property");
  }
  return getAssetGroup("other");
}

function inferAssetType(group, row) {
  if (group.types.some(([value]) => value === row?.type)) return row.type;
  const text = `${row?.category || ""} ${row?.name || ""}`.toLowerCase();

  if (group.id === "banks") {
    if (text.includes("вклад")) return "deposit";
    if (text.includes("накоп")) return "savings";
    return "account";
  }
  if (group.id === "cash") {
    return "currency";
  }
  if (group.id === "crypto") return "crypto";
  if (group.id === "investments") {
    if (text.includes("иис")) return "iis";
    return "brokerage";
  }
  if (group.id === "property") {
    if (text.includes("квартир")) return "apartment";
    if (text.includes("дом")) return "house";
    if (text.includes("земл")) return "land";
    if (text.includes("коммер")) return "commercial";
    return "property-other";
  }
  return group.defaultType;
}

function inferAssetCurrencyCode(groupId, type, row) {
  if (groupId === "crypto") {
    const stored = String(row?.currencyCode || "").trim().toUpperCase();
    if (isCryptoCurrencyCode(stored)) return stored;
    const name = String(row?.name || "").trim().toUpperCase();
    return cryptoCurrencyOptions.find(({ code }) => name.includes(code))?.code || "BTC";
  }
  if (groupId !== "cash") return "RUB";

  const stored = String(row?.currencyCode || "").trim().toUpperCase();
  if (isFiatCurrencyCode(stored)) return stored;

  const text = `${row?.category || ""} ${row?.name || ""}`.toLowerCase();
  if (text.includes("рубл")) return "RUB";
  if (text.includes("гонконг")) return "HKD";
  if (text.includes("доллар")) return "USD";
  if (text.includes("евро")) return "EUR";
  return fiatCurrencyOptions.find(({ code }) => text.includes(code.toLowerCase()))?.code || "RUB";
}

function usesAutomaticAssetName(groupId, type) {
  return groupId === "crypto" || groupId === "cash";
}

function getAutomaticAssetName(groupId, type, currencyCode, marketId = "", storedName = "") {
  if (groupId === "crypto") {
    return cryptoCurrencyOptions.find((option) => marketId && option.id === marketId)?.label
      || findCryptoOptionByCode(currencyCode)?.label
      || String(storedName || "").trim();
  }
  if (groupId === "cash") {
    return fiatCurrencyOptions.find(({ code }) => code === currencyCode)?.label
      || String(storedName || "").trim();
  }
  return "";
}

function findCryptoOptionByCode(currencyCode) {
  const code = String(currencyCode || "").trim().toUpperCase();
  return cryptoCurrencyOptions.find((option) => option.code === code);
}

function isFiatCurrencyCode(currencyCode) {
  return /^[A-Z]{3}$/.test(String(currencyCode || "").trim().toUpperCase());
}

function isCryptoCurrencyCode(currencyCode) {
  return /^[A-Z0-9]{2,15}$/.test(String(currencyCode || "").trim().toUpperCase());
}

function inferLegacyAssetCurrencyCode(row, text = "") {
  const stored = String(row?.currencyCode || "").trim().toUpperCase();
  if (stored === "RUB" || LEGACY_FIAT_CURRENCIES.includes(stored)) return stored;

  const normalizedText = text || `${row?.category || ""} ${row?.name || ""}`.toLowerCase();
  if (normalizedText.includes("гонконг")) return "HKD";
  if (normalizedText.includes("доллар")) return "USD";
  if (normalizedText.includes("евро")) return "EUR";
  if (normalizedText.includes("юан")) return "CNY";
  if (normalizedText.includes("бат")) return "THB";
  if (normalizedText.includes("рубл")) return "RUB";

  const name = String(row?.name || "").trim().toUpperCase();
  return LEGACY_FIAT_CURRENCIES.includes(name) ? name : "";
}

function isCryptoAssetRow(row, text = "") {
  if (row?.group === "crypto" || row?.type === "crypto") return true;
  const stored = String(row?.currencyCode || "").trim().toUpperCase();
  const name = String(row?.name || "").trim().toUpperCase();
  const normalizedText = text || `${row?.category || ""} ${row?.name || ""}`.toLowerCase();
  return normalizedText.includes("крип")
    || cryptoCurrencyOptions.some(({ code }) => stored === code || name.includes(code));
}

function isConvertibleAsset(groupId, type) {
  return groupId === "crypto" || groupId === "cash";
}

function normalizeAssetDate(value) {
  const date = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

function normalizeBudgetRecord(budget) {
  const year = Number(budget?.year);
  const month = Number(budget?.month);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 0 || month > 11) return null;

  return {
    key: recordKey(year, month),
    year,
    month,
    incomes: Array.isArray(budget?.incomes) ? budget.incomes.map(normalizeBudgetRow) : [],
    expenses: Array.isArray(budget?.expenses) ? budget.expenses.map(normalizeBudgetRow) : [],
    savedAt: budget?.savedAt || null,
  };
}

function normalizeBudgetRow(row) {
  return {
    name: String(row?.name || "").trim() || "Без названия",
    plan: Number.isFinite(Number(row?.plan)) ? Math.round(Number(row.plan)) : 0,
    actual: Number.isFinite(Number(row?.actual)) ? Math.round(Number(row.actual)) : 0,
  };
}

function isEmptyState(value) {
  return !Array.isArray(value?.records) || value.records.length === 0;
}

function readAssetRows() {
  return state.currentRows.map(normalizeRowState);
}

function getCategoryTotals(rows) {
  return rows.reduce((result, row) => {
    const category = getAssetGroup(row.group).label;
    result[category] = (result[category] ?? 0) + Number(row.amount || 0);
    return result;
  }, {});
}

function getAssetGroupTotals(rows) {
  return rows.reduce((totals, row) => {
    const groupId = getAssetGroup(row.group).id;
    totals[groupId] = (totals[groupId] || 0) + Number(row.amount || 0);
    return totals;
  }, {});
}

function getAssetStructure(rows) {
  return Object.entries(getCategoryTotals(rows))
    .map(([category, total]) => ({ category, total }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);
}

function getStructureColor(index) {
  const colors = ["#28c45d", "#27b6c4", "#64a0d8", "#d28a61", "#b58cff", "#e2c15b", "#f27594", "#8bcf68"];
  return colors[index % colors.length];
}

function sortedRecords() {
  return [...state.records].sort((a, b) => a.year - b.year || a.month - b.month);
}

function findPreviousRecord(record) {
  return sortedRecords()
    .filter((item) => item.year < record.year || (item.year === record.year && item.month < record.month))
    .at(-1);
}

function findPreviousBudget(budget) {
  return [...state.budgets]
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .filter((item) => item.year < budget.year || (item.year === budget.year && item.month < budget.month))
    .at(-1);
}

function cloneBudgetRecord(budget, options = {}) {
  return {
    key: recordKey(budget.year, budget.month),
    year: budget.year,
    month: budget.month,
    incomes: budget.incomes.map((row) => ({
      ...row,
      actual: options.resetActual ? 0 : row.actual,
    })),
    expenses: budget.expenses.map((row) => ({
      ...row,
      actual: options.resetActual ? 0 : row.actual,
    })),
    savedAt: budget.savedAt || null,
  };
}

function getYearRecords() {
  const byYear = new Map();
  sortedRecords().forEach((record) => byYear.set(record.year, record));
  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}

function deltaCells(delta, previousTotal) {
  if (delta === null || previousTotal === undefined || previousTotal === 0) {
    return `<td class="empty">-</td>`;
  }
  const tone = delta >= 0 ? "positive" : "negative";
  return `
    <td class="${tone} amount-column history-change-cell">
      <span>${formatSignedMoney(delta)}</span>
      <small>${formatSignedPercent(delta / previousTotal)}</small>
    </td>
  `;
}

function sumRows(rows) {
  return rows.reduce((total, row) => total + Number(row.amount || 0), 0);
}

function getAssetGroup(groupId) {
  return ASSET_GROUPS.find((group) => group.id === groupId) || ASSET_GROUPS.at(-1);
}

function createAssetId(groupId, index = 0, seed = "") {
  const value = `${groupId}|${index}|${seed}`;
  let hash = 0;
  for (let position = 0; position < value.length; position += 1) {
    hash = (hash * 31 + value.charCodeAt(position)) >>> 0;
  }
  return `asset-${groupId}-${hash.toString(36)}`;
}

function formatAssetCount(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  const ending = mod10 === 1 && mod100 !== 11 ? "актив" : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "актива" : "активов";
  return `${count} ${ending}`;
}

function recalculateAssetAmount(row) {
  const unitRate = row.group === "cash" && row.currencyCode === "RUB"
    ? 1
    : Number(row.unitRate || 0);
  row.amount = Math.round(Number(row.units || 0) * unitRate);
}

function recordKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function parseAmount(value) {
  const normalized = String(value).replace(/[^\d,-]/g, "").replace(",", ".");
  return Math.round(Number.parseFloat(normalized) || 0);
}

function parseAssetDecimal(value) {
  const normalized = String(value)
    .replace(/\s/g, "")
    .replace(/[^\d,.-]/g, "")
    .replace(",", ".");
  return Number.parseFloat(normalized) || 0;
}

function parseRussianNumber(value) {
  if (value === null || value === undefined) return Number.NaN;
  const normalized = String(value)
    .replace(/\s/g, "")
    .replace(/[^\d,.-]/g, "")
    .replace(",", ".");
  return Number.parseFloat(normalized);
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function formatMoney(value) {
  return `${formatPlainNumber(value)} ₽`;
}

function formatRate(value) {
  return `${Number(value).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`;
}

function formatPercentValue(value) {
  return `${Number(value).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
}

function formatSignedMoney(value) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatMoney(Math.abs(value))}`;
}

function formatMetricChange(delta, base) {
  const tone = delta >= 0 ? "positive" : "negative";
  return `
    <span class="metric-main">${formatSignedMoney(delta)}</span>
    <span class="metric-percent ${tone}">${formatSignedPercent(delta / base)}</span>
  `;
}

function formatPlainNumber(value) {
  return Math.round(Number(value || 0)).toLocaleString("ru-RU");
}

function formatAssetDecimal(value) {
  return Number(value || 0).toLocaleString("ru-RU", {
    maximumFractionDigits: 8,
    useGrouping: false,
  });
}

function formatPercent(value) {
  return value.toLocaleString("ru-RU", { style: "percent", maximumFractionDigits: 0 });
}

function formatSignedPercent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("ru-RU", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
