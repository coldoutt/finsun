const AUTH_STORAGE_KEY = "finance-auth-v1";
const THEME_KEY = "finance-theme";
const SUPABASE_URL = "https://ixxtzlrrpitsnskhnsew.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_BHG2D4weWXsm2LKbH6AIxg_dPBJ0Fnh";
const EXTERNAL_REFRESH_INTERVAL_MS = 60 * 60 * 1000;
const STATIC_METRICS_URL = "https://raw.githubusercontent.com/coldoutt/finsun/main/metrics.json";
const OWNER_EMAIL = "tonygazz@gmail.com";
const OWNER_HISTORY_VERSION = 1;
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
    icon: "₽",
    description: "Счета, карты, накопительные счета и вклады.",
    defaultType: "account",
    types: [
      ["account", "Банковский счет"],
      ["card", "Банковская карта"],
      ["savings", "Накопительный счет"],
      ["deposit", "Вклад"],
    ],
  },
  {
    id: "money",
    label: "Валюта",
    icon: "$",
    description: "Наличные рубли, иностранная валюта и криптовалюта.",
    defaultType: "cash",
    types: [
      ["cash", "Наличные рубли"],
      ["currency", "Иностранная валюта"],
      ["crypto", "Криптовалюта"],
    ],
  },
  {
    id: "investments",
    label: "Инвестиции",
    icon: "↗",
    description: "Брокерские счета, ИИС, ценные бумаги и фонды.",
    defaultType: "brokerage",
    types: [
      ["brokerage", "Брокерский счет"],
      ["iis", "ИИС"],
      ["security", "Ценные бумаги"],
      ["fund", "Фонд"],
    ],
  },
  {
    id: "property",
    label: "Недвижимость",
    icon: "⌂",
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
    id: "debts",
    label: "Долги",
    icon: "↔",
    description: "Деньги, которые должны вам или которые должны вы.",
    defaultType: "receivable",
    types: [
      ["receivable", "Мне должны"],
      ["payable", "Я должен"],
    ],
  },
  {
    id: "other",
    label: "Прочее",
    icon: "+",
    description: "Активы, которые не относятся к основным разделам.",
    defaultType: "other",
    types: [["other", "Другой актив"]],
  },
];

const FIAT_CURRENCIES = ["USD", "EUR", "CNY", "HKD", "THB", "GBP", "CHF", "JPY", "AED", "TRY"];
const CRYPTO_CURRENCIES = ["BTC", "ETH", "USDT", "TON", "SOL", "BNB", "USDC"];

const ownerSeedRows = [
  ["Банк. Карта", "Альфа", 0],
  ["Банк. Карта", "Яндекс", 83660],
  ["Банк. Карта", "Т-Банк", 0],
  ["Банк.Счет", "Альфа", 0],
  ["Банк.Счет", "OZON", 0],
  ["Банк.Счет", "WB", 878998],
  ["Банк.Вклад", "WB", 1744383],
  ["Банк.Вклад", "Т-Банк", 1034698],
  ["Банк.Вклад", "Яндекс", 2106186],
  ["Биржа", "Портфель", 27147],
  ["Биржа", "ИИС", 2488842],
  ["Биржа", "Заблокированное", 50000],
  ["Криптовалюты", "BTC", 151000],
  ["Криптовалюты", "TON", 1000],
  ["Инвестиции/Долги", "Александр", 600000],
  ["Наличные", "Рубли", 0],
  ["Наличные", "Доллары", 78000],
  ["Наличные", "Доллары Гонконг", 112],
  ["Наличные", "Баты", 515],
  ["Наличные", "Юани", 2500],
  ["Наличные", "Евро", 190000],
].map(([category, name, amount]) => ({ category, name, amount }));

const ownerSeedRecords = [
  [2018, 0, 1669978],
  [2018, 1, 1705192],
  [2018, 2, 1615314],
  [2018, 3, 1653257],
  [2018, 4, 1928825],
  [2018, 5, 1870501],
  [2018, 6, 1857858],
  [2018, 7, 1886796],
  [2018, 8, 1812265],
  [2018, 9, 1777527],
  [2018, 10, 1692597],
  [2018, 11, 1764550],
  [2019, 0, 1620240],
  [2019, 1, 1547620],
  [2019, 2, 1650342],
  [2019, 3, 1611234],
  [2019, 4, 1593343],
  [2019, 5, 1485480],
  [2019, 6, 1337423],
  [2019, 7, 1430232],
  [2019, 8, 1635863],
  [2019, 9, 1580452],
  [2019, 10, 1550698],
  [2019, 11, 1496568],
  [2020, 0, 1703181],
  [2020, 1, 1650332],
  [2020, 2, 1610924],
  [2020, 3, 1860221],
  [2020, 4, 1790654],
  [2020, 5, 1764550],
  [2020, 6, 1635863],
  [2020, 7, 1765732],
  [2020, 8, 1654778],
  [2020, 9, 1856876],
  [2020, 10, 1967918],
  [2020, 11, 1979343],
  [2021, 0, 2052003],
  [2021, 1, 2120518],
  [2021, 2, 2301268],
  [2021, 3, 2237898],
  [2021, 4, 2303719],
  [2021, 5, 2504841],
  [2021, 6, 2522866],
  [2021, 7, 2599506],
  [2021, 8, 2624383],
  [2021, 9, 2634613],
  [2021, 10, 2752578],
  [2021, 11, 2789386],
  [2022, 0, 2845085],
  [2022, 1, 2890223],
  [2022, 2, 2998607],
  [2022, 3, 3153839],
  [2022, 4, 3198602],
  [2022, 5, 3202787],
  [2022, 6, 3228705],
  [2022, 7, 3401622],
  [2022, 8, 3436564],
  [2022, 9, 3570118],
  [2022, 10, 3721606],
  [2022, 11, 3759559],
  [2023, 0, 3824648],
  [2023, 1, 3921817],
  [2023, 2, 4186771],
  [2023, 3, 4288299],
  [2023, 4, 4405574],
  [2023, 5, 4594270],
  [2023, 6, 4697339],
  [2023, 7, 4839181],
  [2023, 8, 4796272],
  [2023, 9, 4936351],
  [2023, 10, 5124582],
  [2023, 11, 5156159],
  [2024, 0, 5156500],
  [2024, 1, 5283711],
  [2024, 2, 5686789],
  [2024, 3, 5648644],
  [2024, 4, 5706628],
  [2024, 5, 5752040],
  [2024, 6, 5815659],
  [2024, 7, 5943143],
  [2024, 8, 6058127],
  [2024, 9, 6104230],
  [2024, 10, 6211292],
  [2024, 11, 6465176],
  [2025, 0, 6475469],
  [2025, 1, 6906388],
  [2025, 2, 6996459],
  [2025, 3, 7001131],
  [2025, 4, 7133253],
  [2025, 5, 7392638],
  [2025, 6, 7691546],
  [2025, 7, 7841137],
  [2025, 8, 8075894],
  [2025, 9, 8123127],
  [2025, 10, 8148213],
  [2025, 11, 8405166],
  [2026, 0, 8515469],
  [2026, 1, 8662513],
  [2026, 2, 8865577],
  [2026, 3, 8976046],
  [2026, 4, 9120620],
  [2026, 5, 9437041],
].map(([year, month, total]) => ({
  key: recordKey(year, month),
  year,
  month,
  rows: cloneRows(ownerSeedRows),
  total,
  savedAt: new Date().toISOString(),
}));

let state = {
  records: [],
  currentRows: [],
  budgets: [],
};
let budgetDraft = null;
let chartMode = "bar";
let activeAssetGroup = "banks";
let latestExternalRates = {};
let selectedChartYears = new Set();
let expandedHistoryYears = new Set();
let collapsedAssetCategories = new Set();
let historyInitialized = false;
let chartHitAreas = [];
let chartHoverIndex = null;
let chartSelectedIndex = null;
let saveNoticeTimer = null;
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
  chartYearFilters: document.querySelector("#chartYearFilters"),
  yearDropdown: document.querySelector("#yearDropdown"),
  yearDropdownBtn: document.querySelector("#yearDropdownBtn"),
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
  sidebarUserEmail: document.querySelector("#sidebarUserEmail"),
  profileMenu: document.querySelector("#profileMenu"),
  profileMenuCloseBtn: document.querySelector("#profileMenuCloseBtn"),
  profileMenuSubtitle: document.querySelector("#profileMenuSubtitle"),
  pageKicker: document.querySelector("#pageKicker"),
  pageTitle: document.querySelector("#pageTitle"),
  pageSubtitle: document.querySelector("#pageSubtitle"),
  todayDate: document.querySelector("#todayDate"),
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
  setCurrentMonth();
  updateTodayDate();
  bindEvents();
  bindSupabaseAuthEvents();
  await hydrateSession();
  state = await loadState();
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

function setCurrentMonth() {
  const now = new Date();
  els.yearInput.value = now.getFullYear();
  els.monthInput.value = now.getMonth();
  if (els.budgetYearInput) els.budgetYearInput.value = now.getFullYear();
  if (els.budgetMonthInput) els.budgetMonthInput.value = now.getMonth();
}

function updateTodayDate() {
  if (!els.todayDate) return;
  const date = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(new Date());
  els.todayDate.textContent = `Сегодня ${date}`;
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

  document.querySelectorAll("[data-chart]").forEach((button) => {
    button.addEventListener("click", () => {
      chartMode = button.dataset.chart;
      document.querySelectorAll("[data-chart]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      resetChartInteraction();
      drawChart();
    });
  });

  els.yearDropdownBtn?.addEventListener("click", () => {
    const isOpen = !els.chartYearFilters.hidden;
    setYearDropdownOpen(!isOpen);
  });

  document.addEventListener("click", (event) => {
    if (els.yearDropdown?.contains(event.target)) return;
    setYearDropdownOpen(false);
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
    drawChart();
  });
}

function selectTab(name) {
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
  const copy = pageCopy[name] || pageCopy.dashboard;
  if (els.pageKicker) els.pageKicker.textContent = copy.kicker;
  if (els.pageTitle) els.pageTitle.textContent = copy.title;
  if (els.pageSubtitle) els.pageSubtitle.textContent = copy.subtitle;
  toggleProfileMenu(false);
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === name);
  });
  document.querySelectorAll("[data-side-tab]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.sideTab === name);
  });
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("is-visible"));
  document.querySelector(`#${name}Panel`).classList.add("is-visible");
  if (name === "dashboard") {
    drawChart();
  }
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
  renderChartFilters();
  renderAssetStructure();
  drawChart();
}

function renderChartFilters() {
  const years = [...new Set(sortedRecords().map((record) => record.year))].sort((a, b) => b - a);
  if (!years.length) {
    els.chartYearFilters.innerHTML = "";
    updateYearDropdownLabel([]);
    return;
  }

  if (!selectedChartYears.size) {
    years.slice(0, 3).forEach((year) => selectedChartYears.add(year));
  }

  els.chartYearFilters.innerHTML = years
    .map(
      (year) => `
        <label class="year-chip">
          <input type="checkbox" value="${year}" ${selectedChartYears.has(year) ? "checked" : ""} />
          ${year}
        </label>
      `,
    )
    .join("");

  els.chartYearFilters.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      const year = Number(input.value);
      if (input.checked) selectedChartYears.add(year);
      else selectedChartYears.delete(year);
      updateYearDropdownLabel(years);
      drawChart();
    });
  });

  updateYearDropdownLabel(years);
}

function setYearDropdownOpen(isOpen) {
  if (!els.chartYearFilters || !els.yearDropdownBtn) return;
  els.chartYearFilters.hidden = !isOpen;
  els.yearDropdownBtn.setAttribute("aria-expanded", String(isOpen));
}

function updateYearDropdownLabel(years) {
  if (!els.yearDropdownBtn) return;
  const selected = years.filter((year) => selectedChartYears.has(year)).sort((a, b) => a - b);
  els.yearDropdownBtn.textContent = `Период: ${formatSelectedYears(selected)}`;
}

function formatSelectedYears(years) {
  if (!years.length) return "не выбраны";
  if (years.length === 1) return String(years[0]);
  const isContinuous = years.every((year, index) => index === 0 || year === years[index - 1] + 1);
  if (isContinuous) return `${years[0]}-${years.at(-1)}`;
  if (years.length <= 3) return years.join(", ");
  return `${years[0]}-${years.at(-1)} · ${years.length}`;
}

function renderAssets() {
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

  els.assetEditorIcon.textContent = activeGroup.icon;
  els.assetEditorTitle.textContent = activeGroup.label;
  els.assetEditorDescription.textContent = activeGroup.description;
  els.assetGroupTotal.textContent = formatMoney(totals[activeGroup.id] || 0);
  els.assetTotalCell.textContent = formatMoney(total);

  els.assetRows.innerHTML = activeRows.length
    ? activeRows
        .map(({ row, index }, position) => renderAssetEntry(row, index, position, activeRows.length))
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

  els.assetRows.querySelectorAll("[data-asset-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentRows.splice(Number(button.dataset.assetDelete), 1);
      renderAssets();
    });
  });

  els.assetRows.querySelectorAll("[data-asset-move]").forEach((button) => {
    button.addEventListener("click", () => {
      moveAssetRow(Number(button.dataset.assetMove), button.dataset.direction);
    });
  });
}

function renderAssetEntry(row, index, position, groupCount) {
  const group = getAssetGroup(row.group);
  return `
    <article class="asset-entry-card" data-asset-entry="${index}">
      <div class="asset-entry-card-head">
        <span class="asset-entry-number">${String(position + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(row.name)}</strong>
        <span class="asset-entry-value" data-asset-row-total="${index}">${formatMoney(row.amount)}</span>
        <div class="category-actions">
          <button class="move-category" type="button" data-asset-move="${index}" data-direction="up" ${position === 0 ? "disabled" : ""} title="Поднять актив">↑</button>
          <button class="move-category" type="button" data-asset-move="${index}" data-direction="down" ${position === groupCount - 1 ? "disabled" : ""} title="Опустить актив">↓</button>
          <button class="delete-row" type="button" data-asset-delete="${index}" title="Удалить актив">×</button>
        </div>
      </div>
      <div class="asset-entry-fields">
        <label class="asset-field asset-field-name">
          Название
          <input data-asset-field="name" data-index="${index}" value="${escapeHtml(row.name)}" />
        </label>
        <label class="asset-field">
          Тип
          <select data-asset-field="type" data-index="${index}">
            ${group.types
              .map(([value, label]) => `<option value="${value}" ${row.type === value ? "selected" : ""}>${label}</option>`)
              .join("")}
          </select>
        </label>
        ${renderAssetSpecificFields(row, index)}
      </div>
    </article>
  `;
}

function renderAssetSpecificFields(row, index) {
  if (row.group === "money" && row.type !== "cash") {
    const currencies = row.type === "crypto" ? CRYPTO_CURRENCIES : FIAT_CURRENCIES;
    const rateLabel = row.type === "crypto" ? "Цена за единицу, ₽" : "Курс к рублю";
    return `
      <label class="asset-field">
        ${row.type === "crypto" ? "Монета" : "Валюта"}
        <select data-asset-field="currencyCode" data-index="${index}">
          ${currencies
            .map((code) => `<option value="${code}" ${row.currencyCode === code ? "selected" : ""}>${code}</option>`)
            .join("")}
        </select>
      </label>
      ${renderAssetNumberField("Количество", "units", row.units, index, "decimal")}
      ${renderAssetNumberField(rateLabel, "unitRate", row.unitRate, index, "decimal")}
      <div class="asset-calculated-field">
        <span>Стоимость в рублях</span>
        <strong data-asset-calculated="${index}">${formatMoney(row.amount)}</strong>
      </div>
    `;
  }

  const amountField = renderAssetNumberField("Стоимость, ₽", "amount", row.amount, index, "money");
  if (row.group === "banks") {
    const depositFields = row.type === "deposit" || row.type === "savings"
      ? `
        ${renderAssetNumberField("Ставка, % годовых", "annualRate", row.annualRate, index, "decimal")}
        ${renderAssetDateField("Дата открытия", "openedAt", row.openedAt, index)}
        ${renderAssetDateField("Дата окончания", "closesAt", row.closesAt, index)}
      `
      : "";
    return `${amountField}${depositFields}`;
  }
  if (row.group === "property") {
    return `${amountField}${renderAssetDateField("Дата оценки", "valuationDate", row.valuationDate, index)}`;
  }
  if (row.group === "debts") {
    return `${amountField}${renderAssetDateField("Срок возврата", "dueDate", row.dueDate, index)}`;
  }
  return amountField;
}

function renderAssetNumberField(label, field, value, index, format) {
  const displayValue = format === "money" ? formatPlainNumber(value) : formatAssetDecimal(value);
  return `
    <label class="asset-field">
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
      selectedChartYears.delete(record.year);
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
      latestExternalRates = {
        USD: Number(rates.usd) || 0,
        EUR: Number(rates.eur) || 0,
      };
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
  const height = isMobileChart ? 280 : rect.width < 900 ? 330 : 380;
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
    ctx.font = "20px Calibri, Segoe UI, sans-serif";
    ctx.fillText("Выберите год или сохраните первый месяц.", 24, 60);
    return;
  }

  const values = records.map((record) => record.total);
  const axis = getAxisScale(Math.min(...values), Math.max(...values));
  const max = axis.max;
  const min = axis.min;
  const plot = isMobileChart
    ? { left: 52, right: 12, top: 20, bottom: 54 }
    : { left: 76, right: 24, top: 28, bottom: 72 };
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const slotWidth = plotWidth / Math.max(1, records.length);
  const xStep = records.length > 1 ? slotWidth : 0;
  const barWidth = Math.max(isMobileChart ? 5 : 8, Math.min(isMobileChart ? 24 : 38, slotWidth * 0.72));

  ctx.strokeStyle = getCssColor("--line");
  ctx.lineWidth = 1;
  ctx.fillStyle = getCssColor("--muted");
  ctx.font = `${isMobileChart ? 11 : 13}px Calibri, Segoe UI, sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= axis.steps; i += 1) {
    const y = plot.top + (plotHeight / axis.steps) * i;
    const value = max - axis.step * i;
    ctx.beginPath();
    ctx.moveTo(plot.left, y);
    ctx.lineTo(width - plot.right, y);
    ctx.stroke();
    ctx.fillText(formatAxisCompact(value), plot.left - 12, y);
  }

  ctx.strokeStyle = getCssColor("--line-strong");
  ctx.beginPath();
  ctx.moveTo(plot.left, plot.top);
  ctx.lineTo(plot.left, plot.top + plotHeight);
  ctx.lineTo(width - plot.right, plot.top + plotHeight);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = getCssColor("--muted");
  ctx.font = `${isMobileChart ? 11 : 13}px Calibri, Segoe UI, sans-serif`;
  const labelEvery = getLabelStep(records.length, isMobileChart);
  records.forEach((record, index) => {
    const shouldLabel = index === 0 || index === records.length - 1 || index % labelEvery === 0 || record.month === 0;
    if (!shouldLabel) return;
    const x = plot.left + slotWidth / 2 + index * xStep;
    ctx.fillText(getShortMonth(record.month), x, plot.top + plotHeight + (isMobileChart ? 9 : 12));
    ctx.fillText(String(record.year), x, plot.top + plotHeight + (isMobileChart ? 24 : 28));
  });

  const points = records.map((record, index) => {
    const x = plot.left + slotWidth / 2 + index * xStep;
    const y = plot.top + plotHeight - ((record.total - min) / (max - min)) * plotHeight;
    return { x, y, record, index };
  });

  chartHitAreas = points.map((point) => ({
    ...point,
    left: point.x - Math.max(barWidth / 2, 14),
    right: point.x + Math.max(barWidth / 2, 14),
    top: chartMode === "bar" ? point.y : point.y - 16,
    bottom: plot.top + plotHeight,
    barWidth,
    plotBottom: plot.top + plotHeight,
  }));

  const activeIndex = chartHoverIndex ?? chartSelectedIndex;
  const activeArea = activeIndex === null ? null : chartHitAreas[activeIndex];
  if (activeArea) {
    ctx.strokeStyle = getCssColor("--line-strong");
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(activeArea.x, plot.top);
    ctx.lineTo(activeArea.x, plot.top + plotHeight);
    ctx.stroke();
  }

  if (chartMode === "bar") {
    points.forEach((point, index) => {
      const isActive = index === activeIndex;
      ctx.fillStyle = isActive ? getCssColor("--accent-strong") : getCssColor("--cyan");
      ctx.fillRect(point.x - barWidth / 2, point.y, barWidth, plot.top + plotHeight - point.y);
    });
  } else {
    ctx.strokeStyle = getCssColor("--cyan");
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    points.forEach((point, index) => {
      const isActive = index === activeIndex;
      ctx.beginPath();
      ctx.fillStyle = isActive ? getCssColor("--accent-strong") : getCssColor("--accent");
      ctx.arc(point.x, point.y, isActive ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (activeArea) showChartTooltip(activeArea, records);
}

function getChartRecords() {
  const records = sortedRecords();
  return records.filter((record) => selectedChartYears.has(record.year));
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
  const left = Math.min(Math.max(area.x + 14, 12), shellRect.width - tooltipWidth - 12);
  const top = Math.max(area.y - 76, 12);
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

function getLabelStep(count, compact = false) {
  if (compact) {
    if (count <= 8) return 1;
    if (count <= 24) return 3;
    if (count <= 48) return 6;
    return 12;
  }
  if (count <= 18) return 1;
  if (count <= 36) return 3;
  if (count <= 72) return 6;
  return 12;
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

  const sectionRect = els.structureTooltip.parentElement.getBoundingClientRect();
  const rowRect = row.getBoundingClientRect();
  const tooltipWidth = 260;
  const left = Math.min(Math.max(rowRect.left - sectionRect.left + 20, 12), sectionRect.width - tooltipWidth - 12);
  els.structureTooltip.style.left = `${left}px`;
  els.structureTooltip.style.top = "0";
  els.structureTooltip.hidden = false;

  const tooltipHeight = els.structureTooltip.getBoundingClientRect().height;
  const belowViewportTop = rowRect.bottom + 8;
  const aboveViewportTop = rowRect.top - tooltipHeight - 8;
  const viewportPadding = 10;
  let viewportTop = belowViewportTop;

  if (belowViewportTop + tooltipHeight > window.innerHeight - viewportPadding && aboveViewportTop >= viewportPadding) {
    viewportTop = aboveViewportTop;
  } else if (belowViewportTop + tooltipHeight > window.innerHeight - viewportPadding) {
    viewportTop = Math.max(viewportPadding, window.innerHeight - tooltipHeight - viewportPadding);
  }

  els.structureTooltip.style.top = `${viewportTop - sectionRect.top}px`;
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

function getAxisScale(minValue, maxValue) {
  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
    return { min: 0, max: 1, step: 0.2, steps: 5 };
  }

  if (minValue === maxValue) {
    const padding = Math.max(Math.abs(maxValue) * 0.2, 1);
    minValue -= padding;
    maxValue += padding;
  }

  const min = Math.max(0, minValue * 0.9);
  const max = maxValue * 1.1;
  const steps = 5;
  const step = (max - min) / steps;
  return { min, max, step, steps };
}

function updateAssetFieldFromInput(event) {
  const input = event.target;
  const index = Number(input.dataset.index);
  const field = input.dataset.assetField;
  const row = state.currentRows[index];
  if (!row || !field) return;

  if (["amount"].includes(field)) row[field] = parseAmount(input.value);
  else if (["units", "unitRate", "annualRate"].includes(field)) row[field] = parseAssetDecimal(input.value);
  else row[field] = input.value;

  if (field === "currencyCode" && row.type === "currency") {
    const suggestedRate = getSuggestedAssetRate(row.currencyCode);
    if (suggestedRate > 0) {
      row.unitRate = suggestedRate;
      const rateInput = input.closest(".asset-entry-card")?.querySelector('[data-asset-field="unitRate"]');
      if (rateInput) rateInput.value = formatAssetDecimal(suggestedRate);
      if (row.units > 0) {
        row.conversionConfigured = true;
        recalculateAssetAmount(row);
      }
    }
  }

  if (row.group === "money" && row.type !== "cash" && ["units", "unitRate"].includes(field)) {
    row.conversionConfigured = true;
    recalculateAssetAmount(row);
  }

  if (field === "name") {
    const title = input.closest(".asset-entry-card")?.querySelector(".asset-entry-card-head > strong");
    if (title) title.textContent = input.value || "Без названия";
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
  if (row.group === "money" && row.type !== "cash") {
    row.currencyCode ||= row.type === "crypto" ? "BTC" : "USD";
    row.units = Number(row.units || 0);
    row.unitRate = Number(row.unitRate || getSuggestedAssetRate(row.currencyCode) || 0);
  }
  renderAssets();
}

function updateDisplayedAssetTotals() {
  const totals = getAssetGroupTotals(state.currentRows);
  els.assetGroupNav.querySelectorAll("[data-asset-group-total]").forEach((element) => {
    element.textContent = formatMoney(totals[element.dataset.assetGroupTotal] || 0);
  });
  els.assetTotalCell.textContent = formatMoney(sumRows(state.currentRows));
  els.assetGroupTotal.textContent = formatMoney(totals[activeAssetGroup] || 0);
  els.assetRows.querySelectorAll("[data-asset-row-total]").forEach((element) => {
    const index = Number(element.dataset.assetRowTotal);
    element.textContent = formatMoney(state.currentRows[index]?.amount || 0);
  });
  els.assetRows.querySelectorAll("[data-asset-calculated]").forEach((element) => {
    const index = Number(element.dataset.assetCalculated);
    element.textContent = formatMoney(state.currentRows[index]?.amount || 0);
  });
}

function moveAssetRow(index, direction) {
  const row = state.currentRows[index];
  if (!row) return;
  const groupIndexes = state.currentRows
    .map((item, itemIndex) => (item.group === row.group ? itemIndex : -1))
    .filter((itemIndex) => itemIndex >= 0);
  const position = groupIndexes.indexOf(index);
  const nextPosition = direction === "up" ? position - 1 : position + 1;
  if (nextPosition < 0 || nextPosition >= groupIndexes.length) return;

  const nextIndex = groupIndexes[nextPosition];
  [state.currentRows[index], state.currentRows[nextIndex]] = [state.currentRows[nextIndex], state.currentRows[index]];
  renderAssets();
}

function addAssetRow() {
  if (!isAuthenticated()) {
    showSaveNotice("Войдите в аккаунт, чтобы добавлять активы", "error");
    return;
  }

  const group = getAssetGroup(activeAssetGroup);
  state.currentRows.push(normalizeRowState({
    id: createAssetId(group.id, state.currentRows.length),
    group: group.id,
    category: group.label,
    type: group.defaultType,
    name: "Новый актив",
    amount: 0,
  }));
  renderAssets();
  els.assetRows.querySelector(".asset-entry-card:last-child [data-asset-field='name']")?.select();
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
    if (els.sidebarUserEmail) els.sidebarUserEmail.textContent = authState.user.email;
    if (els.sidebarUserAvatar) els.sidebarUserAvatar.textContent = getUserInitials(profile);
    if (els.profileMenuSubtitle) els.profileMenuSubtitle.textContent = displayName;
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
    if (els.profileMenuSubtitle) els.profileMenuSubtitle.textContent = "Вход в персональный аккаунт";
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
    return normalizeState(saved.state, { fallbackRecords: [] });
  }

  if (isOwnerAccount() && needsOwnerHistoryMigration(data.state)) {
    const saved = await saveStateToSupabase(await buildOwnerSeedState());
    return normalizeState(saved.state, { fallbackRecords: [] });
  }

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

function getUserProfile(user) {
  const defaults = getDefaultUserProfile(user?.email);
  const isLegacyOwnerProfile = String(user?.email || "").toLowerCase() === OWNER_EMAIL
    && user?.firstName === "Tony"
    && user?.lastName === "Gazz";
  return {
    firstName: String(isLegacyOwnerProfile ? defaults.firstName : user?.firstName || defaults.firstName).trim(),
    lastName: String(isLegacyOwnerProfile ? defaults.lastName : user?.lastName || defaults.lastName).trim(),
  };
}

function getDefaultUserProfile(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (normalizedEmail === OWNER_EMAIL) {
    return { firstName: "Антон", lastName: "Гасилин" };
  }
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
  if (isOwnerAccount()) return buildOwnerSeedState();
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

function isOwnerAccount() {
  return String(authState.user?.email || "").trim().toLowerCase() === OWNER_EMAIL;
}

function needsOwnerHistoryMigration(value) {
  return Number(value?.ownerHistoryVersion || 0) < OWNER_HISTORY_VERSION;
}

async function buildOwnerSeedState() {
  try {
    const response = await fetch("finance.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Seed data error: ${response.status}`);
    const state = normalizeState(await response.json(), { fallbackRecords: [] });
    state.ownerHistoryVersion = OWNER_HISTORY_VERSION;
    return state;
  } catch (error) {
    console.error("Owner seed data load failed", error);
    return {
      records: ownerSeedRecords.map((record) => normalizeRecordState(record)).filter(Boolean),
      currentRows: cloneRows(ownerSeedRows),
      budgets: [],
      ownerHistoryVersion: OWNER_HISTORY_VERSION,
    };
  }
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
    ownerHistoryVersion: Number(value?.ownerHistoryVersion || 0),
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
  const conversionConfigured = row?.conversionConfigured === true
    || (Number(row?.units || 0) !== 0 && Number(row?.unitRate || 0) !== 0);
  const units = Number.isFinite(Number(row?.units)) ? Number(row.units) : 0;
  const unitRate = Number.isFinite(Number(row?.unitRate)) ? Number(row.unitRate) : 0;
  const storedAmount = Number.isFinite(Number(row?.amount)) ? Math.round(Number(row.amount)) : 0;
  const amount = group.id === "money" && type !== "cash" && conversionConfigured
    ? Math.round(units * unitRate)
    : storedAmount;

  return {
    id: String(row?.id || createAssetId(group.id, index, `${row?.category || ""}|${row?.name || ""}|${storedAmount}`)),
    group: group.id,
    category: group.label,
    type,
    name: String(row?.name || "").trim() || "Без названия",
    amount,
    currencyCode: inferAssetCurrencyCode(group.id, type, row),
    units,
    unitRate,
    conversionConfigured,
    annualRate: Number.isFinite(Number(row?.annualRate)) ? Number(row.annualRate) : 0,
    openedAt: normalizeAssetDate(row?.openedAt),
    closesAt: normalizeAssetDate(row?.closesAt),
    valuationDate: normalizeAssetDate(row?.valuationDate),
    dueDate: normalizeAssetDate(row?.dueDate),
  };
}

function inferAssetGroup(row) {
  const stored = ASSET_GROUPS.find((group) => group.id === row?.group);
  if (stored) return stored;

  const text = `${row?.category || ""} ${row?.name || ""}`.toLowerCase();
  if (text.includes("долг")) return getAssetGroup("debts");
  if (text.includes("банк") || text.includes("вклад") || text.includes("счет") || text.includes("счёт")) {
    return getAssetGroup("banks");
  }
  if (
    text.includes("налич")
    || text.includes("валют")
    || text.includes("крип")
    || FIAT_CURRENCIES.some((code) => text.includes(code.toLowerCase()))
    || CRYPTO_CURRENCIES.some((code) => text.includes(code.toLowerCase()))
  ) {
    return getAssetGroup("money");
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
    if (text.includes("карт")) return "card";
    return "account";
  }
  if (group.id === "money") {
    if (text.includes("крип") || CRYPTO_CURRENCIES.some((code) => text.includes(code.toLowerCase()))) return "crypto";
    if (
      text.includes("доллар")
      || text.includes("евро")
      || text.includes("юан")
      || text.includes("бат")
      || FIAT_CURRENCIES.some((code) => text.includes(code.toLowerCase()))
    ) {
      return "currency";
    }
    return "cash";
  }
  if (group.id === "investments") {
    if (text.includes("иис")) return "iis";
    if (text.includes("акци") || text.includes("облига") || text.includes("бумаг")) return "security";
    if (text.includes("фонд")) return "fund";
    return "brokerage";
  }
  if (group.id === "property") {
    if (text.includes("квартир")) return "apartment";
    if (text.includes("дом")) return "house";
    if (text.includes("земл")) return "land";
    if (text.includes("коммер")) return "commercial";
    return "property-other";
  }
  if (group.id === "debts") return text.includes("мой долг") || text.includes("я должен") ? "payable" : "receivable";
  return group.defaultType;
}

function inferAssetCurrencyCode(groupId, type, row) {
  if (groupId !== "money" || type === "cash") return "RUB";
  const stored = String(row?.currencyCode || "").trim().toUpperCase();
  const codes = type === "crypto" ? CRYPTO_CURRENCIES : FIAT_CURRENCIES;
  if (codes.includes(stored)) return stored;

  const text = `${row?.category || ""} ${row?.name || ""}`.toLowerCase();
  if (text.includes("гонконг")) return "HKD";
  if (text.includes("доллар")) return "USD";
  if (text.includes("евро")) return "EUR";
  if (text.includes("юан")) return "CNY";
  if (text.includes("бат")) return "THB";
  return codes.find((code) => text.includes(code.toLowerCase())) || codes[0];
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
  row.amount = Math.round(Number(row.units || 0) * Number(row.unitRate || 0));
}

function getSuggestedAssetRate(currencyCode) {
  return Number(latestExternalRates[String(currencyCode || "").toUpperCase()] || 0);
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

function formatAxis(value) {
  return Math.round(value).toLocaleString("ru-RU");
}

function formatAxisCompact(value) {
  if (Math.abs(value) >= 1_000_000) {
    const millions = value / 1_000_000;
    const digits = Number.isInteger(millions) ? 0 : 1;
    return `${millions.toLocaleString("ru-RU", { maximumFractionDigits: digits })} млн`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${Math.round(value / 1_000).toLocaleString("ru-RU")} тыс`;
  }
  return formatAxis(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
