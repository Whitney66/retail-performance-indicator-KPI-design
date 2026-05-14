import {
  platformNavItems,
  reportTabs,
  timeDimensions,
  channelOptions,
  secondaryChannelOptions,
  storeOptions,
  metricHeaders,
} from './data/report-config.js?v=20260512-1948';
import { offlineRetailRows } from './data/offline-retail.js?v=20260512-1825';
import { monthlyMetricGroups, monthlySummaryRows } from './data/monthly-summary.js?v=20260512-1948';

const stickyLeftOffsets = ['0px', '160px', '300px', '480px', '600px'];
const monitorReportYear = 2026;
const monitorComparisonYear = monitorReportYear - 1;

const borderRankingProjects = [
  { name: '转化率', unit: '%', base: 68.4, step: 1.7 },
  { name: '客单价（元/人次）', unit: '', base: 1280, step: 36 },
  { name: '坪效（元/平方米）', unit: '', base: 9200, step: 215 },
  { name: '劳效（元/人）', unit: '', base: 18600, step: 430 },
];

const departureStores = [
  '北京大兴',
  '沈阳',
  '北京首都',
  '上海港',
  '武汉',
  '广州',
  '大连',
  '成都天府',
  '天津',
  '湖南',
  '昆明',
  '上海浦东',
  '海口',
  '杭州',
  '厦门',
  '西安',
  '上海虹桥',
  '青岛',
  '满洲里',
  '黑河',
];

const arrivalStores = ['北京首都', '上海虹桥', '上海浦东', '广州', '杭州', '成都天府', '大连', '青岛', '厦门', '海口'];

function buildBorderRankingRows(stores, offset = 0) {
  return borderRankingProjects.flatMap((project, projectIndex) =>
    stores.map((store, storeIndex) => {
      const value = project.base - storeIndex * project.step - projectIndex * 2.5 - offset;
      return {
        project: project.name,
        store,
        value: project.unit ? `${value.toFixed(1)}${project.unit}` : `${Math.round(value).toLocaleString('zh-CN')}`,
      };
    }),
  );
}

const borderRankingData = {
  departure: {
    label: '出境门店',
    rows: buildBorderRankingRows(departureStores),
  },
  arrival: {
    label: '进境门店',
    rows: buildBorderRankingRows(arrivalStores, 3.2),
  },
};

const borderMonitorStoreGroups = {
  departure: {
    label: '出境门店',
    summary: '主要口岸出境合计',
    stores: ['北京大兴', '北京首都', '上海浦东', '广州', '成都天府'],
    revenueLabel: '出境收入（万元）',
  },
  arrival: {
    label: '进境门店',
    summary: '主要口岸进境合计',
    stores: ['北京首都', '上海虹桥', '上海浦东', '广州', '杭州'],
    revenueLabel: '进境收入（万元）',
  },
};

function buildBorderMonitorMetrics(type) {
  const config = borderMonitorStoreGroups[type] || borderMonitorStoreGroups.departure;
  const summaryMetrics = [
    { item: '客流人数（人次）' },
    { item: config.revenueLabel },
    { item: '毛利额（万元）' },
    { item: '购买人数（人次）' },
    { item: '小票数（张）' },
    { item: '销售数量（件）' },
    { item: '转化率' },
    { item: '毛利率' },
    { item: '票单价（元/张）' },
    { item: '客单价（元/人次）' },
    { item: '人均购物额（元/人次）' },
    { item: '连带率' },
    { item: '经营面积（平方米）' },
    { item: '坪效（元/平方米）' },
    { item: '营业人员（人）' },
    { item: '劳效（元/人）' },
  ];
  const storeMetrics = ['客流人数（人次）', config.revenueLabel, '毛利额（万元）', '购买人数（人次）', '转化率', '客单价（元/人次）'];

  return [
    ...summaryMetrics.map((metric) => ({ section: config.summary, ...metric })),
    ...config.stores.flatMap((store) => storeMetrics.map((item) => ({ section: store, item }))),
  ];
}

function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

function buildMonthColumns(maxMonth = 12) {
  return Array.from({ length: maxMonth }, (_, index) => `${index + 1}月`);
}

function formatBorderMonitorCell(seed, item, type) {
  if (type === 'yoy') return `${((seed % 35) - 8).toFixed(1)}%`;
  if (item.includes('率')) return `${(seed % 42 + 46).toFixed(1)}%`;
  if (item.includes('人员') || item.includes('人数') || item.includes('小票') || item.includes('数量')) return `${Math.round(seed * 42).toLocaleString('zh-CN')}`;
  if (item.includes('面积')) return `${Math.round(seed * 9).toLocaleString('zh-CN')}`;
  if (item.includes('单价') || item.includes('购物额') || item.includes('坪效') || item.includes('劳效')) return `${Math.round(seed * 18).toLocaleString('zh-CN')}`;
  return `${(seed / 2.6).toFixed(2)}`;
}

function buildBorderMonitorCells(rowIndex, item, columns) {
  return columns.map((column, columnIndex) => {
    if (column.label === '合计' && column.type === 'yoy') return `${((rowIndex * 3) % 28 - 6).toFixed(1)}%`;
    const seed = 24 + rowIndex * 5 + columnIndex * 2;
    return formatBorderMonitorCell(seed, item, column.type);
  });
}

const modulePlaceholders = {
  monthly: {
    title: '月度汇总表',
    description: '用于承接按月汇总的预算、实际、同比、达成分析等综合展示。',
    metrics: [
      ['月累计实际', '268.42', '亿元'],
      ['预算达成率', '84.6%', '较上月 +3.1%'],
      ['同比增幅', '12.8%', '较同期提升'],
    ],
    listTitle: '月度经营重点',
    list: ['预算进度保持稳定提升', '客流恢复带动销售增长', '重点门店贡献持续扩大'],
  },
  border: {
    title: '出入境口岸排名与监控',
    description: '用于承接口岸排名、预警状态、客流监测及经营异常识别。',
    metrics: [
      ['重点口岸', '14', '个'],
      ['预警门店', '3', '个'],
      ['客流恢复率', '91.2%', '同比口径'],
    ],
    listTitle: '口岸排名观察',
    list: ['广州口岸经营贡献排名第一', '昆明口岸客流恢复较快', '上海口岸免税销售增长明显'],
  },
  city: {
    title: '市内店零售指标情况',
    description: '用于承接市内店核心零售指标、结构占比与样板门店观察。',
    metrics: [
      ['市内店销售额', '42.86', '亿元'],
      ['有税占比', '38.5%', '结构占比'],
      ['外国人消费占比', '11.2%', '含免税及退税'],
    ],
    listTitle: '市内店经营观察',
    list: ['深圳市内店销售额领先', '广州市内店有税销售占比提升', '成都店客单价表现稳定'],
  },
  commerce: {
    title: '中免商贸零售指标情况',
    description: '用于承接中免商贸板块的零售经营概览、关键指标和趋势监测。',
    metrics: [
      ['商贸收入', '31.75', '亿元'],
      ['毛利率', '27.4%', '模拟口径'],
      ['预算剩余', '8.96', '亿元'],
    ],
    listTitle: '商贸板块观察',
    list: ['核心品牌收入贡献稳定', '毛利结构保持合理区间', '预算缺口集中在个别区域'],
  },
};

function getRangeByDimension(dimension) {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');

  if (dimension === 'year') {
    return { start: `${year}`, end: `${year}` };
  }
  if (dimension === 'month') {
    return { start: `${year}-${month}`, end: `${year}-${month}` };
  }
  return { start: `${year}-${month}-${day}`, end: `${year}-${month}-${day}` };
}

function formatBudgetPeriod(dimension, startValue, endValue) {
  if (!startValue || !endValue) return '本期预算';

  function formatValue(value) {
    if (dimension === 'year') return `${Number(value)}年`;
    const [, month, day] = value.split('-');
    if (dimension === 'day') return `${Number(month)}月${Number(day)}日`;
    return `${Number(month)}月`;
  }

  return `本期预算（${formatValue(startValue)}–${formatValue(endValue)}）`;
}

function formatMonthLabel(year, month) {
  return `${year}年${month}月`;
}

function formatDayLabel(year, month, day) {
  return `${year}年${month}月${day}日`;
}

function createDetailColumnsForPeriod(label, previousLabel, periodIndex) {
  return [
    { groupLabel: label, label: '预算', type: 'budget', periodIndex },
    { groupLabel: label, label: `${previousLabel}同期`, type: 'same', periodIndex },
    { groupLabel: label, label: '同比', type: 'yoy', periodIndex },
  ];
}

function createDailyColumnsForPeriod(label, periodIndex) {
  return [
    { groupLabel: label, label: '当天完成', type: 'complete', periodIndex },
    { groupLabel: label, label: '去年同期', type: 'same', periodIndex },
    { groupLabel: label, label: '同比', type: 'yoy', periodIndex },
    { groupLabel: label, label: '环比', type: 'mom', periodIndex },
  ];
}

function buildMonthReportColumns() {
  return [
    { label: '本月累计完成', type: 'complete', periodIndex: 0 },
    { label: '完成率', type: 'rate', periodIndex: 1 },
    { label: '去年同期', type: 'same', periodIndex: 2 },
    { label: '同比', type: 'yoy', periodIndex: 3 },
    { label: 'Month-To-Go（当月目标-本月完成）', type: 'mtg', periodIndex: 4 },
  ];
}

function buildTimeRangeDetailColumns(dimension, startValue, endValue) {
  if (!startValue || !endValue) return [];

  if (dimension === 'year') {
    const startYear = Number(startValue);
    const endYear = Number(endValue);
    if (!Number.isFinite(startYear) || !Number.isFinite(endYear) || startYear > endYear) return [];

    return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
      const year = startYear + index;
      return createDetailColumnsForPeriod(`${year}年`, `${year - 1}年`, index);
    });
  }

  if (dimension === 'month') {
    const [startYear, startMonth] = startValue.split('-').map(Number);
    const [endYear, endMonth] = endValue.split('-').map(Number);
    if (![startYear, startMonth, endYear, endMonth].every(Number.isFinite)) return [];

    const startIndex = startYear * 12 + startMonth;
    const endIndex = endYear * 12 + endMonth;
    if (startIndex > endIndex) return [];

    return Array.from({ length: endIndex - startIndex + 1 }, (_, index) => {
      const monthIndex = startIndex + index;
      const year = Math.floor((monthIndex - 1) / 12);
      const month = ((monthIndex - 1) % 12) + 1;
      return createDetailColumnsForPeriod(formatMonthLabel(year, month), formatMonthLabel(year - 1, month), index);
    });
  }

  const [startYear, startMonth, startDay] = startValue.split('-').map(Number);
  const [endYear, endMonth, endDay] = endValue.split('-').map(Number);
  if (![startYear, startMonth, startDay, endYear, endMonth, endDay].every(Number.isFinite)) return [];

  const startDate = Date.UTC(startYear, startMonth - 1, startDay);
  const endDate = Date.UTC(endYear, endMonth - 1, endDay);
  if (startDate > endDate) return [];

  const dayMs = 24 * 60 * 60 * 1000;
  return Array.from({ length: Math.floor((endDate - startDate) / dayMs) + 1 }, (_, index) => {
    const date = new Date(startDate + index * dayMs);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return createDailyColumnsForPeriod(formatDayLabel(year, month, day), index);
  });
}

function formatDetailMetricCell(rowIndex, column, columnIndex) {
  const base = 34 + rowIndex * 5 + column.periodIndex * 4 + columnIndex;
  if (column.type === 'yoy' || column.type === 'mom' || column.type === 'rate') return `${((base % 32) - 6).toFixed(1)}%`;
  if (column.type === 'same') return `${((base + 12) / 12).toFixed(2)}`;
  if (column.type === 'mtg') return `${((base + 26) / 13).toFixed(2)}`;
  return `${((base + 18) / 11).toFixed(2)}`;
}

function getDetailHeadClass(type) {
  if (type === 'budget' || type === 'complete' || type === 'mtg') return 'detail-head detail-budget-head';
  if (type === 'same') return 'detail-head detail-same-head';
  return 'detail-head detail-yoy-head';
}

function formatUpdateTime() {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

function createCell(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function applyStickyOffset(cell, index) {
  if (index >= stickyLeftOffsets.length) return;
  cell.classList.add('sticky-col');
  cell.style.left = stickyLeftOffsets[index];
}

function createSingleSelect(label, options, value) {
  const field = createCell('div', 'filter-field');
  const labelEl = createCell('label', 'filter-label', label);
  const select = createCell('select', 'filter-input filter-select-single');

  options.forEach((option) => {
    const item = createCell('option', '', option.label);
    item.value = option.value;
    item.selected = option.value === value;
    select.appendChild(item);
  });

  field.append(labelEl, select);
  return { field, select };
}

function createDateField(label, value, type) {
  const field = createCell('div', 'filter-field');
  const labelEl = createCell('label', 'filter-label', label);
  const input = createCell('input', 'filter-input');
  input.type = type;
  input.value = value;
  field.append(labelEl, input);
  return { field, input };
}

function createDropdownMultiSelect(label, options) {
  const field = createCell('div', 'filter-field');
  const labelEl = createCell('label', 'filter-label', label);
  const wrapper = createCell('div', 'multi-select');
  const trigger = createCell('button', 'multi-select-trigger');
  const valueEl = createCell('span', 'multi-select-value');
  const arrow = createCell('span', 'multi-select-arrow', '▾');
  const panel = createCell('div', 'multi-select-panel');
  const toolbar = createCell('div', 'multi-select-toolbar');
  const selectAllBtn = createCell('button', 'multi-select-tool', '全选');
  const clearBtn = createCell('button', 'multi-select-tool', '清空');
  const optionList = createCell('div', 'multi-select-options');

  let selected = new Set([options[0] || '全部']);

  trigger.type = 'button';
  trigger.setAttribute('aria-expanded', 'false');
  selectAllBtn.type = 'button';
  clearBtn.type = 'button';

  function getSelected() {
    return [...selected];
  }

  function getSummary() {
    if (!selected.size || selected.has('全部')) return '全部';
    const labels = getSelected();
    return labels.length <= 2 ? labels.join('、') : `已选${labels.length}项`;
  }

  function setOpen(open) {
    wrapper.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function updateTrigger() {
    valueEl.textContent = getSummary();
  }

  function normalize(nextSelected, sourceValue) {
    if (!nextSelected.size) {
      selected = new Set(['全部']);
      return;
    }
    if (sourceValue === '全部' && nextSelected.has('全部')) {
      selected = new Set(['全部']);
      return;
    }
    if (nextSelected.size > 1 && nextSelected.has('全部')) {
      nextSelected.delete('全部');
    }
    selected = nextSelected.size ? nextSelected : new Set(['全部']);
  }

  function renderOptions() {
    optionList.innerHTML = '';
    options.forEach((option) => {
      const optionLabel = createCell('label', 'multi-select-option');
      const checkbox = createCell('input', '');
      const text = createCell('span', '', option);
      checkbox.type = 'checkbox';
      checkbox.value = option;
      checkbox.checked = selected.has(option);
      optionLabel.append(checkbox, text);
      optionList.appendChild(optionLabel);
    });
  }

  function applySelection(nextSelected, sourceValue) {
    normalize(nextSelected, sourceValue);
    renderOptions();
    updateTrigger();
    wrapper.dispatchEvent(new CustomEvent('multi-select-change', { bubbles: true }));
  }

  function reset() {
    selected = new Set([options[0] || '全部']);
    renderOptions();
    updateTrigger();
    setOpen(false);
  }

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const nextOpen = !wrapper.classList.contains('open');
    window.dispatchEvent(new CustomEvent('prototype-multiselect-open', { detail: wrapper }));
    setOpen(nextOpen);
  });

  panel.addEventListener('click', (event) => event.stopPropagation());
  optionList.addEventListener('change', (event) => {
    if (!event.target.matches('input[type="checkbox"]')) return;
    const nextSelected = new Set(selected);
    if (event.target.checked) {
      nextSelected.add(event.target.value);
    } else {
      nextSelected.delete(event.target.value);
    }
    applySelection(nextSelected, event.target.value);
  });

  selectAllBtn.addEventListener('click', () => {
    applySelection(new Set(options.filter((option) => option !== '全部')), '');
  });

  clearBtn.addEventListener('click', () => {
    applySelection(new Set(['全部']), '全部');
  });

  window.addEventListener('prototype-multiselect-open', (event) => {
    if (event.detail !== wrapper) setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  trigger.append(valueEl, arrow);
  toolbar.append(selectAllBtn, clearBtn);
  panel.append(toolbar, optionList);
  wrapper.append(trigger, panel);
  field.append(labelEl, wrapper);
  renderOptions();
  updateTrigger();

  return {
    field,
    reset,
    close: () => setOpen(false),
    getSelected,
    getSummary,
  };
}

function createMetricCard(label, value, note) {
  const card = createCell('div', 'overview-card');
  card.append(
    createCell('div', 'overview-label', label),
    createCell('div', 'overview-value', value),
    createCell('div', 'overview-note', note),
  );
  return card;
}

function createTableToolbar(unitText) {
  const toolbar = createCell('div', 'table-toolbar');
  toolbar.append(
    createCell('span', 'table-badge', unitText),
    createCell('span', 'table-meta', '数据口径：模拟原型数据'),
    createCell('span', 'table-meta', `最后更新：${formatUpdateTime()}`),
  );
  return toolbar;
}

function renderReportTable(rows, title, subtitle, unitText, tableClassName = '', options = {}) {
  const tableWrap = createCell('div', 'table-card');
  const head = createCell('div', 'section-head');
  if (options.hideTitle) {
    head.classList.add('compact');
  } else {
    const titleGroup = createCell('div', 'section-title-group');
    titleGroup.append(createCell('div', 'section-title', title), createCell('div', 'section-subtitle', subtitle));
    head.append(titleGroup, createTableToolbar(unitText));
  }

  const scroll = createCell('div', 'table-scroll');
  const table = createCell('table', `report-table ${tableClassName}`.trim());
  const thead = document.createElement('thead');
  const groupRow = document.createElement('tr');

  ['渠道', '二级渠道', '门店', '类别', '指标'].forEach((name, index) => {
    const th = createCell('th', 'sticky-col-head', name);
    th.rowSpan = 2;
    applyStickyOffset(th, index);
    groupRow.appendChild(th);
  });

  const detailPeriods = options.detailPeriods || [];
  const detailColumns = detailPeriods.flat();
  const monthReportColumns = options.dimension === 'day' ? buildMonthReportColumns() : [];
  const metricRow = document.createElement('tr');
  const dynamicMetricHeaders = [...metricHeaders];
  if (options.budgetHeader) dynamicMetricHeaders[0] = options.budgetHeader;

  if (options.dimension === 'day') {
    const targetGroup = createCell('th', 'metric-group total-group', '月度目标');
    targetGroup.colSpan = dynamicMetricHeaders.length;
    groupRow.appendChild(targetGroup);
    detailPeriods.forEach((periodColumns) => {
      const th = createCell('th', 'detail-period-head', periodColumns[0].groupLabel);
      th.colSpan = periodColumns.length;
      groupRow.appendChild(th);
    });
    const monthGroup = createCell('th', 'metric-group total-group', '月报');
    monthGroup.colSpan = monthReportColumns.length;
    groupRow.appendChild(monthGroup);

    dynamicMetricHeaders.forEach((name) => {
      metricRow.appendChild(createCell('th', 'total-head', name));
    });
    detailColumns.forEach((column) => {
      metricRow.appendChild(createCell('th', getDetailHeadClass(column.type), column.label));
    });
    monthReportColumns.forEach((column) => {
      metricRow.appendChild(createCell('th', getDetailHeadClass(column.type), column.label));
    });
  } else {
    const totalGroup = createCell('th', 'metric-group total-group', '截至本月合计');
    totalGroup.colSpan = metricHeaders.length;
    groupRow.appendChild(totalGroup);
    detailPeriods.forEach((periodColumns) => {
      const th = createCell('th', 'detail-period-head', periodColumns[0].groupLabel);
      th.colSpan = periodColumns.length;
      groupRow.appendChild(th);
    });

    dynamicMetricHeaders.forEach((name) => {
      metricRow.appendChild(createCell('th', 'total-head', name));
    });
    detailColumns.forEach((column) => {
      metricRow.appendChild(createCell('th', getDetailHeadClass(column.type), column.label));
    });
  }
  thead.append(groupRow, metricRow);

  const tbody = document.createElement('tbody');
  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    const mergeColumns = [
      { key: 'channel', className: 'channel-merged-cell' },
      { key: 'secondaryChannel', className: 'dimension-merged-cell' },
      { key: 'store', className: 'dimension-merged-cell' },
      { key: 'category', className: 'category-merged-cell' },
    ];

    mergeColumns.forEach(({ key, className }, index) => {
      const previousRow = rows[rowIndex - 1];
      const shouldMerge = previousRow && mergeColumns.slice(0, index + 1).every((column) => previousRow[column.key] === row[column.key]);
      if (shouldMerge) return;

      const rowSpan = rows.filter((item) => mergeColumns.slice(0, index + 1).every((column) => item[column.key] === row[column.key])).length;
      const td = createCell('td', className, row[key]);
      td.rowSpan = rowSpan;
      applyStickyOffset(td, index);
      tr.appendChild(td);
    });

    const detailCells = detailColumns.map((column, columnIndex) => formatDetailMetricCell(rowIndex, column, columnIndex));
    const monthReportCells = monthReportColumns.map((column, columnIndex) => formatDetailMetricCell(rowIndex, column, detailCells.length + columnIndex));
    [row.indicator, ...row.metrics, ...detailCells, ...monthReportCells].forEach((cell, index) => {
      const td = createCell('td', '', cell);
      applyStickyOffset(td, index + 4);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  scroll.appendChild(table);
  tableWrap.append(head, scroll);
  return tableWrap;
}

function renderMonthlySummaryTable(rows) {
  const tableWrap = createCell('div', 'table-card');
  const head = createCell('div', 'section-head compact');
  const scroll = createCell('div', 'table-scroll');
  const table = createCell('table', 'report-table monthly-summary-table');
  const thead = document.createElement('thead');
  const metricGroupRow = document.createElement('tr');
  const periodRow = document.createElement('tr');
  const fieldRow = document.createElement('tr');
  const monthFields = ['本月目标', '本月完成', '完成率', '上月完成', '环比', '去年同期', '同比'];
  const yearFields = ['目标', '实际完成', '完成率', '去年同期', '同比'];

  ['渠道', '二级渠道', '门店'].forEach((name, index) => {
    const th = createCell('th', 'sticky-col-head', name);
    th.rowSpan = 3;
    applyStickyOffset(th, index);
    metricGroupRow.appendChild(th);
  });

  monthlyMetricGroups.forEach((name) => {
    const th = createCell('th', 'metric-group monthly-metric-group', name);
    th.colSpan = monthFields.length + yearFields.length;
    metricGroupRow.appendChild(th);

    const monthTh = createCell('th', 'monthly-period-head', '本月');
    monthTh.colSpan = monthFields.length;
    periodRow.appendChild(monthTh);
    const yearTh = createCell('th', 'monthly-period-head', '本年累计');
    yearTh.colSpan = yearFields.length;
    periodRow.appendChild(yearTh);

    [...monthFields, ...yearFields].forEach((field) => {
      fieldRow.appendChild(createCell('th', 'monthly-field-head', field));
    });
  });
  thead.append(metricGroupRow, periodRow, fieldRow);

  const tbody = document.createElement('tbody');
  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    const mergeColumns = [
      { key: 'channel', className: 'channel-merged-cell' },
      { key: 'secondaryChannel', className: 'dimension-merged-cell', mergeKey: 'secondaryMergeKey' },
      { key: 'store', className: 'dimension-merged-cell' },
    ];

    mergeColumns.forEach(({ key, className, mergeKey }, index) => {
      const previousRow = rows[rowIndex - 1];
      const columnsToMerge = mergeColumns.slice(0, index + 1);
      const getMergeValue = (item, column) => item[column.mergeKey || column.key];
      const shouldMerge = previousRow && columnsToMerge.every((column) => getMergeValue(previousRow, column) === getMergeValue(row, column));
      if (shouldMerge) return;

      const rowSpan = rows.filter((item) => columnsToMerge.every((column) => getMergeValue(item, column) === getMergeValue(row, column))).length;
      const td = createCell('td', row.isSecondarySummary && key === 'store' ? `${className} monthly-summary-cell` : className, row[key]);
      td.rowSpan = rowSpan;
      applyStickyOffset(td, index);
      tr.appendChild(td);
    });

    row.metrics.forEach((cell) => {
      tr.appendChild(createCell('td', '', cell));
    });
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  scroll.appendChild(table);
  tableWrap.append(head, scroll);
  return tableWrap;
}

function renderBorderRankingTable(rows) {
  const tableWrap = createCell('div', 'table-card border-ranking-card');
  const scroll = createCell('div', 'table-scroll');
  const table = createCell('table', 'border-ranking-table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['序号', '项目', '排名', '门店名称', '指标数据'].forEach((name) => {
    headerRow.appendChild(createCell('th', '', name));
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement('tbody');
  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    const previousRow = rows[rowIndex - 1];
    const projectRows = rows.filter((item) => item.project === row.project);
    const projectRowIndex = projectRows.indexOf(row);
    if (!previousRow || previousRow.project !== row.project) {
      const projectIndex = borderRankingProjects.findIndex((project) => project.name === row.project) + 1;
      const indexCell = createCell('td', 'border-project-index-cell', `${projectIndex}`);
      indexCell.rowSpan = projectRows.length;
      tr.appendChild(indexCell);
      const projectCell = createCell('td', 'border-project-cell', row.project);
      projectCell.rowSpan = projectRows.length;
      tr.appendChild(projectCell);
    }
    tr.append(
      createCell('td', 'border-rank-cell', `${projectRowIndex + 1}`),
      createCell('td', 'border-store-cell', row.store),
      createCell('td', 'border-value-cell', row.value),
    );
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  scroll.appendChild(table);
  tableWrap.appendChild(scroll);
  return tableWrap;
}

function renderBorderMonitorTable(type = 'departure') {
  const metrics = buildBorderMonitorMetrics(type);
  const storeLabel = borderMonitorStoreGroups[type]?.label || borderMonitorStoreGroups.departure.label;
  const currentMonth = getCurrentMonth();
  const currentYearMonths = buildMonthColumns(currentMonth);
  const fullYearMonths = buildMonthColumns(12);
  const dataColumns = [
    ...currentYearMonths.map((label) => ({ group: `${monitorReportYear}年`, label, type: 'current' })),
    { group: `${monitorReportYear}年`, label: '合计', type: 'current' },
    ...fullYearMonths.map((label) => ({ group: `${monitorComparisonYear}年`, label, type: 'lastYear' })),
    { group: `${monitorComparisonYear}年`, label: '合计', type: 'lastYear' },
    ...fullYearMonths.map((label) => ({ group: `同比${monitorComparisonYear}年`, label, type: 'yoy' })),
    { group: `同比${monitorComparisonYear}年`, label: '合计', type: 'yoy' },
  ];
  const tableWrap = createCell('div', 'table-card border-monitor-card');
  const scroll = createCell('div', 'table-scroll');
  const table = createCell('table', 'border-monitor-table');
  const thead = document.createElement('thead');
  const groupRow = document.createElement('tr');
  const monthRow = document.createElement('tr');

  [storeLabel, '项目'].forEach((name) => {
    const th = createCell('th', 'monitor-sticky-head', name);
    th.rowSpan = 2;
    groupRow.appendChild(th);
  });
  [`${monitorReportYear}年`, `${monitorComparisonYear}年`, `同比${monitorComparisonYear}年`].forEach((name) => {
    const th = createCell('th', 'monitor-year-head', name);
    th.colSpan = dataColumns.filter((column) => column.group === name).length;
    groupRow.appendChild(th);
  });
  dataColumns.forEach((column) => {
    monthRow.appendChild(createCell('th', column.label === '合计' ? 'monitor-total-head' : 'monitor-month-head', column.label));
  });
  thead.append(groupRow, monthRow);

  const tbody = document.createElement('tbody');
  metrics.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    const previousRow = metrics[rowIndex - 1];
    if (!previousRow || previousRow.section !== row.section) {
      const sectionCell = createCell('td', 'monitor-section-cell', row.section);
      sectionCell.rowSpan = metrics.filter((item) => item.section === row.section).length;
      tr.appendChild(sectionCell);
    }
    tr.appendChild(createCell('td', 'monitor-item-cell', row.item));
    buildBorderMonitorCells(rowIndex, row.item, dataColumns).forEach((cell, cellIndex) => {
      const column = dataColumns[cellIndex];
      tr.appendChild(createCell('td', column.label === '合计' ? 'monitor-total-cell' : '', cell));
    });
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  scroll.appendChild(table);
  tableWrap.appendChild(scroll);
  return tableWrap;
}

function buildBorderRankingPane() {
  const wrapper = createCell('div', 'tab-pane');
  const switcher = createCell('div', 'subtab-switcher nested-switcher border-store-switcher');
  const content = createCell('div', 'subtab-content');

  function mountRanking(type) {
    [...switcher.children].forEach((button) => button.classList.toggle('active', button.dataset.type === type));
    content.innerHTML = '';
    content.appendChild(renderBorderRankingTable(borderRankingData[type].rows));
  }

  Object.entries(borderRankingData).forEach(([type, config], index) => {
    const button = createCell('button', index === 0 ? 'subtab-btn active' : 'subtab-btn', config.label);
    button.type = 'button';
    button.dataset.type = type;
    button.addEventListener('click', () => mountRanking(type));
    switcher.appendChild(button);
  });

  wrapper.append(switcher, content);
  mountRanking('departure');
  return wrapper;
}

function createBorderMonitorStoreSwitcher(onChange) {
  const switcher = createCell('div', 'subtab-switcher border-store-switcher');

  Object.entries(borderMonitorStoreGroups).forEach(([type, config], index) => {
    const button = createCell('button', index === 0 ? 'subtab-btn active' : 'subtab-btn', config.label);
    button.type = 'button';
    button.dataset.type = type;
    button.addEventListener('click', () => {
      [...switcher.children].forEach((node) => node.classList.toggle('active', node.dataset.type === type));
      onChange(type);
    });
    switcher.appendChild(button);
  });

  return switcher;
}

function buildBorderTab() {
  const wrapper = createCell('div', 'tab-pane');
  const header = createCell('div', 'border-subtab-header');
  const switcher = createCell('div', 'subtab-switcher');
  const content = createCell('div', 'subtab-content');
  let monitorType = 'departure';
  const tabs = [
    { id: 'ranking', label: '出入境口岸排名' },
    { id: 'monitor', label: '客源及零售指标监控' },
  ];

  function mountBorderSubtab(id) {
    [...switcher.children].forEach((button) => button.classList.toggle('active', button.dataset.id === id));
    content.innerHTML = '';
    header.classList.toggle('show-store-switcher', id === 'monitor');
    if (id === 'ranking') {
      content.appendChild(buildBorderRankingPane());
      return;
    }
    content.appendChild(renderBorderMonitorTable(monitorType));
  }

  const monitorSwitcher = createBorderMonitorStoreSwitcher((type) => {
    monitorType = type;
    const activeSubtab = [...switcher.children].find((button) => button.classList.contains('active'));
    if (activeSubtab?.dataset.id === 'monitor') mountBorderSubtab('monitor');
  });

  tabs.forEach((tab, index) => {
    const button = createCell('button', index === 0 ? 'subtab-btn active' : 'subtab-btn', tab.label);
    button.type = 'button';
    button.dataset.id = tab.id;
    button.addEventListener('click', () => mountBorderSubtab(tab.id));
    switcher.appendChild(button);
  });

  header.append(switcher, monitorSwitcher);
  wrapper.append(header, content);
  mountBorderSubtab('ranking');
  return wrapper;
}

function renderPlaceholderTab(config) {
  const section = createCell('section', 'placeholder-card');
  const head = createCell('div', 'section-head');
  const titleGroup = createCell('div', 'section-title-group');
  titleGroup.append(createCell('div', 'section-title', config.title), createCell('div', 'section-subtitle', config.description));
  head.appendChild(titleGroup);

  const metrics = createCell('div', 'placeholder-metrics');
  config.metrics.forEach(([label, value, note]) => {
    metrics.appendChild(createMetricCard(label, value, note));
  });

  const body = createCell('div', 'placeholder-body');
  const chart = createCell('div', 'mock-chart');
  [58, 72, 64, 86, 76, 92, 84].forEach((height, index) => {
    const bar = createCell('span', 'mock-bar');
    bar.style.height = `${height}%`;
    bar.style.animationDelay = `${index * 80}ms`;
    chart.appendChild(bar);
  });

  const list = createCell('div', 'ranking-list');
  list.appendChild(createCell('div', 'ranking-title', config.listTitle));
  config.list.forEach((item, index) => {
    const row = createCell('div', 'ranking-row');
    row.append(createCell('span', 'ranking-index', `${index + 1}`), createCell('span', 'ranking-text', item));
    list.appendChild(row);
  });
  body.append(chart, list);

  section.append(head, metrics, body);
  return section;
}

function buildOfflineTab(budgetHeader, detailPeriods, dimension) {
  const wrapper = createCell('div', 'tab-pane');
  wrapper.appendChild(
    renderReportTable(offlineRetailRows, '线下零售', '固定展示字段', '单位：亿元 / 万人次 / %', '', {
      hideTitle: true,
      budgetHeader,
      detailPeriods,
      dimension,
    }),
  );
  return wrapper;
}

function buildMonthlyTab() {
  const wrapper = createCell('div', 'tab-pane');
  wrapper.appendChild(renderMonthlySummaryTable(monthlySummaryRows));
  return wrapper;
}

function createPlatformHeader() {
  const header = createCell('header', 'platform-header');
  const main = createCell('div', 'platform-header-main');
  const brand = createCell('div', 'brand-group');
  brand.append(createCell('div', 'brand-mark'), createCell('div', 'brand-name', '大数据平台'));

  const nav = createCell('nav', 'platform-nav');
  platformNavItems.forEach((item) => {
    nav.appendChild(createCell('span', item === '数据填报' ? 'nav-item active' : 'nav-item', item));
  });

  const actions = createCell('div', 'platform-actions');
  const search = createCell('input', 'search-input');
  search.placeholder = '搜索';
  actions.append(search, createCell('span', 'icon-btn', '工'), createCell('span', 'icon-btn', '铃'), createCell('span', 'icon-btn', '全'));

  const crumbs = createCell('div', 'platform-crumbs');
  crumbs.append(
    createCell('span', 'crumb', '经营看板'),
    createCell('span', 'crumb', '渠道经营情况及主要零售指标'),
    createCell('span', 'crumb active', '零售运营数据指标模型'),
  );

  main.append(brand, nav, actions);
  header.append(main, crumbs);
  return header;
}

export function renderApp(root) {
  if (!root) return;

  const app = createCell('div', 'app-shell');
  const page = createCell('main', 'page-body');
  const reportCard = createCell('section', 'report-card');
  const titleRow = createCell('div', 'report-title-row');
  const titleGroup = createCell('div', 'report-heading');
  titleGroup.appendChild(createCell('p', 'report-subtitle', `数据更新时间：${formatUpdateTime()}`));
  titleRow.append(titleGroup, createCell('button', 'outline-btn', '需求说明'));

  const filterPanel = createCell('section', 'filter-panel');
  const filterBody = createCell('div', 'filter-panel-body');
  const filterBar = createCell('div', 'filter-bar');
  const { field: dimensionField, select: dimensionSelect } = createSingleSelect('时间维度', timeDimensions, 'month');
  const defaultRange = getRangeByDimension('month');
  const { field: startField, input: startInput } = createDateField('开始时间', defaultRange.start, 'month');
  const { field: endField, input: endInput } = createDateField('结束时间', defaultRange.end, 'month');
  const channelMulti = createDropdownMultiSelect('渠道', channelOptions);
  const secondaryChannelMulti = createDropdownMultiSelect('二级渠道', secondaryChannelOptions);
  const storeMulti = createDropdownMultiSelect('门店', storeOptions);
  const multiControls = [channelMulti, secondaryChannelMulti, storeMulti];

  function syncDateInputs() {
    const dimension = dimensionSelect.value;
    const range = getRangeByDimension(dimension);
    const typeByDimension = {
      year: 'number',
      month: 'month',
      day: 'date',
    };
    const type = typeByDimension[dimension] || 'month';
    startInput.type = type;
    endInput.type = type;
    startInput.min = dimension === 'year' ? '2000' : '';
    endInput.min = dimension === 'year' ? '2000' : '';
    startInput.max = dimension === 'year' ? '2099' : '';
    endInput.max = dimension === 'year' ? '2099' : '';
    startInput.step = dimension === 'year' ? '1' : '';
    endInput.step = dimension === 'year' ? '1' : '';
    startInput.value = range.start;
    endInput.value = range.end;
    updateFilterSummary();
  }

  function getBudgetHeader() {
    return formatBudgetPeriod(dimensionSelect.value, startInput.value, endInput.value);
  }

  function getDetailPeriods() {
    return buildTimeRangeDetailColumns(dimensionSelect.value, startInput.value, endInput.value);
  }

  function refreshCurrentTab() {
    const activeTab = [...tabBar.children].find((node) => node.classList.contains('active'));
    const activeTabConfig = reportTabs[[...tabBar.children].indexOf(activeTab)];
    mountTab(activeTabConfig?.id || 'offline');
  }

  function updateFilterSummary() {
    refreshCurrentTab();
  }

  dimensionSelect.addEventListener('change', syncDateInputs);
  startInput.addEventListener('change', () => updateFilterSummary());
  endInput.addEventListener('change', () => updateFilterSummary());
  multiControls.forEach((control) => {
    control.field.addEventListener('multi-select-change', () => updateFilterSummary());
  });

  const filterActions = createCell('div', 'filter-actions');
  const queryBtn = createCell('button', 'primary-btn', '查询');
  const resetBtn = createCell('button', 'ghost-btn', '重置');
  queryBtn.type = 'button';
  resetBtn.type = 'button';
  queryBtn.addEventListener('click', () => {
    multiControls.forEach((control) => control.close());
    refreshCurrentTab();
  });
  resetBtn.addEventListener('click', () => {
    dimensionSelect.value = 'month';
    multiControls.forEach((control) => control.reset());
    syncDateInputs();
  });
  filterActions.append(queryBtn, resetBtn);
  filterBar.append(dimensionField, startField, endField, channelMulti.field, secondaryChannelMulti.field, storeMulti.field, filterActions);
  filterBody.appendChild(filterBar);
  filterPanel.appendChild(filterBody);

  const tabBar = createCell('div', 'tab-bar');
  const tabContent = createCell('div', 'tab-content');

  function mountTab(id) {
    tabContent.innerHTML = '';
    if (id === 'offline') {
      tabContent.appendChild(buildOfflineTab(getBudgetHeader(), getDetailPeriods(), dimensionSelect.value));
      return;
    }
    if (id === 'monthly') {
      tabContent.appendChild(buildMonthlyTab());
      return;
    }
    if (id === 'border') {
      tabContent.appendChild(buildBorderTab());
      return;
    }
    tabContent.appendChild(renderPlaceholderTab(modulePlaceholders[id] || modulePlaceholders.monthly));
  }

  reportTabs.forEach((tab, index) => {
    const button = createCell('button', index === 0 ? 'tab-btn active' : 'tab-btn', tab.label);
    button.type = 'button';
    button.addEventListener('click', () => {
      [...tabBar.children].forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
      mountTab(tab.id);
    });
    tabBar.appendChild(button);
  });
  tabBar.appendChild(createCell('button', 'export-btn', '导出数据'));

  syncDateInputs();
  mountTab('offline');

  reportCard.append(titleRow, filterPanel, tabBar, tabContent);
  page.appendChild(reportCard);
  app.append(createPlatformHeader(), page);
  root.innerHTML = '';
  root.appendChild(app);
}
