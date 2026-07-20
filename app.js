const AUTH_STORAGE_KEY = "finance-auth-v1";
const THEME_KEY = "finance-theme";
const API_BASE = resolveApiBase();
const EXTERNAL_REFRESH_INTERVAL_MS = 60 * 60 * 1000;
const OWNER_EMAIL = "tonygazz@gmail.com";
const OWNER_SEED_LAST_RECORD_KEY = "2026-07";

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
};
let chartMode = "bar";
let selectedChartYears = new Set();
let expandedHistoryYears = new Set();
let collapsedAssetCategories = new Set();
let historyInitialized = false;
let chartHitAreas = [];
let chartHoverIndex = null;
let chartSelectedIndex = null;
let saveNoticeTimer = null;
let authState = {
  provider: "api",
  user: null,
};

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
  authPasswordInput: document.querySelector("#authPasswordInput"),
  registerBtn: document.querySelector("#registerBtn"),
  loginBtn: document.querySelector("#loginBtn"),
  logoutBtn: document.querySelector("#logoutBtn"),
  accountStatus: document.querySelector("#accountStatus"),
  accountNote: document.querySelector("#accountNote"),
  themeSelect: document.querySelector("#themeSelect"),
  addRowBtn: document.querySelector("#addRowBtn"),
  saveMonthBtn: document.querySelector("#saveMonthBtn"),
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  hydrateTheme();
  fillMonthSelect();
  setCurrentMonth();
  bindEvents();
  await hydrateSession();
  state = await loadState();
  loadSelectedMonth({ preserveDraft: true });
  renderAll();
  updateExternalMetrics();
  window.setInterval(updateExternalMetrics, EXTERNAL_REFRESH_INTERVAL_MS);
}

function fillMonthSelect() {
  els.monthInput.innerHTML = months
    .map((month, index) => `<option value="${index}">${month}</option>`)
    .join("");
}

function setCurrentMonth() {
  const now = new Date();
  els.yearInput.value = now.getFullYear();
  els.monthInput.value = now.getMonth();
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
  els.logoutBtn?.addEventListener("click", logoutAccount);
  els.themeSelect?.addEventListener("change", () => setTheme(els.themeSelect.value));
  els.addRowBtn.addEventListener("click", addAssetRow);

  els.yearInput.addEventListener("change", loadSelectedMonth);
  els.monthInput.addEventListener("change", loadSelectedMonth);

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
    state.currentRows = [];
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

function renderAll() {
  renderAssets();
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
  const categoryTotals = getCategoryTotals(rows);
  const total = sumRows(rows);
  const categorySuggestions = [...new Set(rows.map((row) => row.category))];
  const groups = getGroupedRows(rows);

  document.querySelector("#categorySuggestions").innerHTML = categorySuggestions
    .map((category) => `<option value="${escapeHtml(category)}"></option>`)
    .join("");

  els.assetRows.innerHTML = groups
    .map((group, groupIndex) => {
      const isCollapsed = collapsedAssetCategories.has(group.category);
      const assetRows = group.rows
        .map(
          ({ row, index }, itemIndex) => `
        <tr class="asset-item-row">
          <td>
            <input data-field="category" data-index="${index}" type="hidden" value="${escapeHtml(row.category)}" />
            <input data-field="name" data-index="${index}" value="${escapeHtml(row.name)}" />
          </td>
          <td class="amount-column">
            <span class="asset-amount-input">
              <input data-field="amount" data-index="${index}" inputmode="numeric" value="${formatPlainNumber(row.amount)}" />
              <span aria-hidden="true">₽</span>
            </span>
          </td>
          <td class="actions-column">
            <div class="category-actions">
              <button class="move-category" type="button" data-move-row="${index}" data-row-direction="up" ${itemIndex === 0 ? "disabled" : ""} title="Поднять строку">↑</button>
              <button class="move-category" type="button" data-move-row="${index}" data-row-direction="down" ${itemIndex === group.rows.length - 1 ? "disabled" : ""} title="Опустить строку">↓</button>
              <button class="delete-row" type="button" data-delete="${index}" title="Удалить строку">×</button>
            </div>
          </td>
        </tr>
      `,
        )
        .join("");
      return `
        <tr class="asset-category-row">
          <td>
            <div class="asset-category-heading">
              <button class="asset-toggle" type="button" data-toggle-category="${escapeHtml(group.category)}" aria-expanded="${!isCollapsed}" title="${isCollapsed ? "Развернуть категорию" : "Свернуть категорию"}">
                <span class="asset-chevron" aria-hidden="true"></span>
              </button>
              <input data-category-group="${escapeHtml(group.category)}" list="categorySuggestions" value="${escapeHtml(group.category)}" />
            </div>
          </td>
          <td class="amount-column asset-category-total">
            <span>${formatMoney(group.total)}</span>
          </td>
          <td class="actions-column">
            <div class="category-actions">
              <button class="move-category" type="button" data-move-category="${escapeHtml(group.category)}" data-direction="up" ${groupIndex === 0 ? "disabled" : ""} title="Поднять категорию">↑</button>
              <button class="move-category" type="button" data-move-category="${escapeHtml(group.category)}" data-direction="down" ${groupIndex === groups.length - 1 ? "disabled" : ""} title="Опустить категорию">↓</button>
              <button class="delete-row" type="button" data-delete-category="${escapeHtml(group.category)}" title="Удалить категорию">×</button>
            </div>
          </td>
        </tr>
        ${isCollapsed ? "" : assetRows}
      `;
    })
    .join("");

  els.assetTotalCell.textContent = formatMoney(total);

  els.assetRows.querySelectorAll("[data-field]").forEach((input) => {
    input.addEventListener("change", updateRowFromInput);
    input.addEventListener("input", updateRowFromInput);
  });

  els.assetRows.querySelectorAll("[data-category-group]").forEach((input) => {
    input.addEventListener("input", syncCategoryGroup);
    input.addEventListener("change", updateCategoryGroup);
  });

  els.assetRows.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentRows.splice(Number(button.dataset.delete), 1);
      renderAssets();
    });
  });

  els.assetRows.querySelectorAll("[data-delete-category]").forEach((button) => {
    button.addEventListener("click", () => {
      collapsedAssetCategories.delete(button.dataset.deleteCategory);
      state.currentRows = state.currentRows.filter((row) => row.category !== button.dataset.deleteCategory);
      renderAssets();
    });
  });

  els.assetRows.querySelectorAll("[data-toggle-category]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleAssetCategory(button.dataset.toggleCategory);
    });
  });

  els.assetRows.querySelectorAll("[data-move-category]").forEach((button) => {
    button.addEventListener("click", () => {
      moveCategory(button.dataset.moveCategory, button.dataset.direction);
    });
  });

  els.assetRows.querySelectorAll("[data-move-row]").forEach((button) => {
    button.addEventListener("click", () => {
      moveAssetRow(Number(button.dataset.moveRow), button.dataset.rowDirection);
    });
  });
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
    const response = await apiRequest("/metrics");
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

function updateRowFromInput(event) {
  const index = Number(event.target.dataset.index);
  const field = event.target.dataset.field;
  const value = field === "amount" ? parseAmount(event.target.value) : event.target.value;
  state.currentRows[index][field] = value;
  els.assetTotalCell.textContent = formatMoney(sumRows(state.currentRows));

  if (field === "category" || field === "amount") {
    renderAssets();
  }
}

function updateCategoryGroup(event) {
  syncCategoryGroup(event);
  renderAssets();
}

function syncCategoryGroup(event) {
  const previousCategory = event.target.dataset.categoryGroup;
  const nextCategory = event.target.value.trim() || "Без категории";
  state.currentRows.forEach((row) => {
    if (row.category === previousCategory) {
      row.category = nextCategory;
    }
  });
  els.assetRows.querySelectorAll(`.asset-item-row [data-field="category"]`).forEach((input) => {
    if (input.value === previousCategory) {
      input.value = nextCategory;
    }
  });
  if (collapsedAssetCategories.has(previousCategory)) {
    collapsedAssetCategories.delete(previousCategory);
    collapsedAssetCategories.add(nextCategory);
  }
  event.target.dataset.categoryGroup = nextCategory;
}

function toggleAssetCategory(category) {
  if (collapsedAssetCategories.has(category)) collapsedAssetCategories.delete(category);
  else collapsedAssetCategories.add(category);
  renderAssets();
}

function moveCategory(category, direction) {
  const groups = getGroupedRows(state.currentRows);
  const index = groups.findIndex((group) => group.category === category);
  if (index === -1) return;

  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= groups.length) return;

  [groups[index], groups[nextIndex]] = [groups[nextIndex], groups[index]];
  state.currentRows = groups.flatMap((group) => group.rows.map(({ row }) => row));
  renderAssets();
}

function moveAssetRow(index, direction) {
  const groups = getGroupedRows(state.currentRows);
  const group = groups.find((item) => item.rows.some((row) => row.index === index));
  if (!group) return;

  const rowIndex = group.rows.findIndex((item) => item.index === index);
  const nextIndex = direction === "up" ? rowIndex - 1 : rowIndex + 1;
  if (nextIndex < 0 || nextIndex >= group.rows.length) return;

  [group.rows[rowIndex], group.rows[nextIndex]] = [group.rows[nextIndex], group.rows[rowIndex]];
  state.currentRows = groups.flatMap((item) => item.rows.map(({ row }) => row));
  renderAssets();
}

function addAssetRow() {
  if (!isAuthenticated()) {
    showSaveNotice("Войдите в аккаунт, чтобы добавлять активы", "error");
    return;
  }

  state.currentRows.push({ category: "Новая категория", name: "Новый актив", amount: 0 });
  renderAssets();
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
    const response = await apiRequest("/auth/me");
    authState.provider = "api";
    authState.user = response.user || null;
  } catch (error) {
    if (shouldUseBrowserAuthFallback(error)) {
      authState.provider = "browser";
      authState.user = getBrowserSessionUser();
    } else if (error.status !== 401) {
      console.error("Session restore failed", error);
      authState.provider = "api";
      authState.user = null;
    } else {
      authState.provider = "api";
      authState.user = null;
    }
  }
  updateAccountStatus();
}

function updateAccountStatus() {
  if (!els.accountStatus || !els.accountNote) return;

  if (isAuthenticated()) {
    els.accountStatus.textContent = `Выполнен вход: ${authState.user.email}`;
    els.accountNote.textContent = authState.provider === "browser"
      ? "Аккаунт и данные хранятся локально в этом браузере, потому что серверный API на этом хостинге недоступен."
      : "Изменения будут сохраняться в вашем персональном аккаунте.";
    if (els.logoutBtn) els.logoutBtn.hidden = false;
  } else {
    els.accountStatus.textContent = "Гостевой режим";
    els.accountNote.textContent = "В гостевом режиме активы и история не сохраняются.";
    if (els.logoutBtn) els.logoutBtn.hidden = true;
  }

  const editingEnabled = isAuthenticated();
  if (els.addRowBtn) els.addRowBtn.disabled = !editingEnabled;
  if (els.saveMonthBtn) els.saveMonthBtn.disabled = !editingEnabled;
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
    const credentials = readAuthCredentials();
    if (authState.provider === "browser") {
      authState.user = await registerBrowserAccount(credentials);
    } else {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: credentials,
      });
      authState.provider = "api";
      authState.user = response.user || null;
    }
    clearAuthPassword();
    updateAccountStatus();
    await reloadStateFromAccount();
    showSaveNotice("Аккаунт создан, вход выполнен");
  } catch (error) {
    console.error("Register failed", error);
    showSaveNotice(error.message || "Не удалось создать аккаунт", "error");
  }
}

async function loginAccount() {
  try {
    const credentials = readAuthCredentials();
    if (authState.provider === "browser") {
      authState.user = await loginBrowserAccount(credentials);
    } else {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: credentials,
      });
      authState.provider = "api";
      authState.user = response.user || null;
    }
    clearAuthPassword();
    updateAccountStatus();
    await reloadStateFromAccount();
    showSaveNotice("Вход выполнен");
  } catch (error) {
    console.error("Login failed", error);
    showSaveNotice(error.message || "Не удалось выполнить вход", "error");
  }
}

async function logoutAccount() {
  try {
    if (authState.provider === "browser") {
      clearBrowserSession();
    } else {
      await apiRequest("/auth/logout", { method: "POST" });
    }
  } catch (error) {
    console.error("Logout failed", error);
  }

  authState.user = null;
  clearAuthPassword();
  updateAccountStatus();
  state = buildGuestState();
  loadSelectedMonth({ preserveDraft: true });
  renderAll();
  showSaveNotice("Вы вышли из аккаунта");
}

function clearAuthPassword() {
  if (els.authPasswordInput) els.authPasswordInput.value = "";
}

async function loadState() {
  if (isAuthenticated()) {
    try {
      return authState.provider === "browser" ? loadStateFromBrowserAccount() : await loadStateFromApi();
    } catch (error) {
      if (error.status === 401) {
        authState.user = null;
        updateAccountStatus();
        showSaveNotice("Сессия истекла, данные аккаунта недоступны", "error");
      } else {
        console.error("API load failed", error);
      }
    }
  }

  return buildGuestState();
}

async function persist() {
  if (isAuthenticated()) {
    if (authState.provider === "browser") {
      state = saveStateToBrowserAccount(state);
      return { remote: true };
    }

    const result = await saveStateToApi(state);
    state = normalizeState(result.state, { fallbackRecords: [] });
    return { remote: true };
  }

  return { remote: false };
}

async function reloadStateFromAccount() {
  state = authState.provider === "browser"
    ? await loadStateFromBrowserAccount()
    : await loadStateFromApi();
  loadSelectedMonth({ preserveDraft: true });
  renderAll();
}

async function loadStateFromApi() {
  const response = await apiRequest("/finance/state");
  if (isOwnerAccount() && (response.initialized === false || needsOwnerHistoryMigration(response.state))) {
    const seeded = await saveStateToApi(await buildOwnerSeedState());
    return normalizeState(seeded.state, { fallbackRecords: [] });
  }
  return normalizeState(response.state, { fallbackRecords: [] });
}

async function saveStateToApi(value) {
  return apiRequest("/finance/state", {
    method: "PUT",
    body: {
      state: value,
    },
  });
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) return {};

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.message || `API error: ${response.status}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload || {};
}

function resolveApiBase() {
  const host = window.location.hostname;
  if (window.location.protocol === "file:") {
    return "http://localhost:3000/api";
  }
  if (window.location.port && window.location.port !== "3000") {
    return `${window.location.protocol}//${host}:3000/api`;
  }
  if (host === "127.0.0.1" || host === "localhost") {
    return `${window.location.protocol}//${host}:3000/api`;
  }
  return "/api";
}

function shouldUseBrowserAuthFallback(error) {
  return isStaticDeployment() && [404, 405, 502].includes(Number(error?.status));
}

function isStaticDeployment() {
  return window.location.protocol.startsWith("http") && window.location.hostname.endsWith("github.io");
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

function writeBrowserAuthStore(store) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(store));
}

function getBrowserSessionUser() {
  const store = readBrowserAuthStore();
  const user = store.users.find((item) => Number(item.id) === Number(store.currentUserId));
  return user ? sanitizeBrowserUser(user) : null;
}

async function registerBrowserAccount(credentials) {
  const store = readBrowserAuthStore();
  const email = String(credentials.email || "").trim().toLowerCase();
  if (store.users.some((item) => item.email === email)) {
    throw new Error("Пользователь с таким email уже существует.");
  }

  const user = {
    id: store.nextUserId,
    email,
    passwordHash: await hashBrowserPassword(credentials.password),
    createdAt: new Date().toISOString(),
  };
  store.nextUserId += 1;
  store.currentUserId = user.id;
  store.users.push(user);
  writeBrowserAuthStore(store);
  return sanitizeBrowserUser(user);
}

async function loginBrowserAccount(credentials) {
  const store = readBrowserAuthStore();
  const email = String(credentials.email || "").trim().toLowerCase();
  const user = store.users.find((item) => item.email === email);
  if (!user) {
    throw new Error("Неверный email или пароль.");
  }

  const passwordHash = await hashBrowserPassword(credentials.password);
  if (user.passwordHash !== passwordHash) {
    throw new Error("Неверный email или пароль.");
  }

  store.currentUserId = user.id;
  writeBrowserAuthStore(store);
  return sanitizeBrowserUser(user);
}

function clearBrowserSession() {
  const store = readBrowserAuthStore();
  store.currentUserId = null;
  writeBrowserAuthStore(store);
}

async function loadStateFromBrowserAccount() {
  const store = readBrowserAuthStore();
  const userKey = String(authState.user.id);
  const storedState = store.financeStates[userKey] || null;
  if (isOwnerAccount() && needsOwnerHistoryMigration(storedState)) {
    store.financeStates[userKey] = await buildOwnerSeedState();
    writeBrowserAuthStore(store);
  }
  const rawState = store.financeStates[userKey] || null;
  return normalizeState(rawState, { fallbackRecords: [] });
}

function saveStateToBrowserAccount(value) {
  const store = readBrowserAuthStore();
  store.financeStates[String(authState.user.id)] = value;
  writeBrowserAuthStore(store);
  return normalizeState(value, { fallbackRecords: [] });
}

function sanitizeBrowserUser(user) {
  return {
    id: Number(user.id),
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function hashBrowserPassword(password) {
  const bytes = new TextEncoder().encode(String(password || ""));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (item) => item.toString(16).padStart(2, "0")).join("");
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
  return !Array.isArray(value?.records)
    || !value.records.some((record) => record?.key === OWNER_SEED_LAST_RECORD_KEY);
}

async function buildOwnerSeedState() {
  try {
    const response = await fetch("finance.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Seed data error: ${response.status}`);
    return normalizeState(await response.json(), { fallbackRecords: [] });
  } catch (error) {
    console.error("Owner seed data load failed", error);
    return {
      records: ownerSeedRecords.map((record) => normalizeRecordState(record)).filter(Boolean),
      currentRows: cloneRows(ownerSeedRows),
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

  return {
    records,
    currentRows: cloneRows(currentRows),
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

function normalizeRowState(row) {
  return {
    category: String(row?.category || "").trim() || "Без категории",
    name: String(row?.name || "").trim() || "Без названия",
    amount: Number.isFinite(Number(row?.amount)) ? Math.round(Number(row.amount)) : 0,
  };
}

function isEmptyState(value) {
  return !Array.isArray(value?.records) || value.records.length === 0;
}

function readAssetRows() {
  return Array.from(els.assetRows.querySelectorAll(".asset-item-row")).map((row) => ({
    category: row.querySelector('[data-field="category"]').value.trim() || "Без категории",
    name: row.querySelector('[data-field="name"]').value.trim() || "Без названия",
    amount: parseAmount(row.querySelector('[data-field="amount"]').value),
  }));
}

function getCategoryTotals(rows) {
  return rows.reduce((result, row) => {
    result[row.category] = (result[row.category] ?? 0) + Number(row.amount || 0);
    return result;
  }, {});
}

function getGroupedRows(rows) {
  const groups = [];
  const byCategory = new Map();
  rows.forEach((row, index) => {
    const category = row.category || "Без категории";
    if (!byCategory.has(category)) {
      const group = { category, total: 0, rows: [] };
      byCategory.set(category, group);
      groups.push(group);
    }
    const group = byCategory.get(category);
    group.total += Number(row.amount || 0);
    group.rows.push({ row, index });
  });
  return groups;
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
