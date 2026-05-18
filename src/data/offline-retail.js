import { metricHeaders } from './report-config.js';

const hainanStores = ['三亚店', '新海港店', '凤凰机场店', '美兰机场店', '博鳌店', '日月店'];

const hainanRows = [
  { category: '销售', indicator: '线下收入（亿元）' },
  { category: '销售', indicator: '销售收入（亿元）' },
  { category: '销售', indicator: '含税销售额（亿元）' },
  { category: '客流', indicator: '离岛客流（万人次）' },
  { category: '客流', indicator: '进店人数（万人次）' },
  { category: '客流', indicator: '购买人数（万人次）' },
  { category: '客流', indicator: '销售数量（万件）' },
  { category: '转化', indicator: '转化率' },
  { category: '转化', indicator: '客单价（元/人次）' },
  { category: '转化', indicator: '件单价（元/件）' },
  { category: '转化', indicator: '连带率' },
  { category: '折扣', indicator: '售价金额（亿元）' },
  { category: '折扣', indicator: '成交金额（亿元）' },
  { category: '折扣', indicator: '折扣率' },
  { category: '毛利', indicator: '毛利额（亿元）' },
  { category: '毛利', indicator: '毛利率' },
];

const hainanSummaryRows = hainanRows.map((row) => ({ ...row }));

const rowGroups = [
  {
    channel: '汇总',
    secondaryChannel: '线下渠道-整体',
    store: '',
    rows: [
      { category: '销售', indicator: '线下收入（亿元）－财务口径' },
      { category: '销售', indicator: '其他业务收入（亿元）--财务口径' },
      { category: '客流', indicator: '进店人数（万人次）' },
      { category: '客流', indicator: '购买人数（万人次）' },
      { category: '客流', indicator: '销售数量（万件）' },
      { category: '转化', indicator: '转化率' },
      { category: '转化', indicator: '客单价（元/人次）' },
      { category: '转化', indicator: '件单价（元/件）' },
      { category: '转化', indicator: '连带率' },
      { category: '折扣', indicator: '折扣率' },
      { category: '毛利', indicator: '毛利额（亿元）' },
      { category: '毛利', indicator: '毛利率' },
    ],
  },
  {
    channel: '汇总',
    secondaryChannel: '线下渠道主要门店',
    store: '',
    rows: [
      { category: '转化', indicator: '转化率' },
      { category: '转化', indicator: '客单价（元/人次）' },
      { category: '转化', indicator: '件单价（元/件）' },
      { category: '转化', indicator: '连带率' },
      { category: '折扣', indicator: '折扣率' },
      { category: '毛利', indicator: '毛利额（亿元）' },
      { category: '毛利', indicator: '毛利率' },
    ],
  },
  {
    channel: '汇总',
    secondaryChannel: '线下渠道其他门店',
    store: '',
    rows: [
      { category: '销售', indicator: '线下收入（亿元）-财务口径' },
    ],
  },
  {
    channel: '海南区域',
    secondaryChannel: '海南区域小计',
    store: '',
    rows: hainanSummaryRows,
  },
  ...hainanStores.map((store) => ({
    channel: '海南区域',
    secondaryChannel: '',
    store,
    rows: hainanRows,
  })),
];

const offlineRows = rowGroups.flatMap((group) =>
  group.rows.map((row) => ({
    channel: group.channel,
    secondaryChannel: group.secondaryChannel,
    store: group.store,
    ...row,
  })),
);

function buildMetricCells(seed) {
  return metricHeaders.map((_, index) => {
    const base = seed + index * 7;
    if (index === 2 || index === 4 || index === 7 || index === 9) {
      return `${(base % 36 + 64).toFixed(1)}%`;
    }
    if (index === 5) {
      return `${(base / 10).toFixed(2)}`;
    }
    return `${(base / 11).toFixed(2)}`;
  });
}

const offlineRetailBaseRows = offlineRows.map((row, index) => ({
  ...row,
  metrics: buildMetricCells(36 + index * 5),
}));

function normalizeStoreLabel(value) {
  return String(value).replace(/^\[\d+\]\s*/, '').trim();
}

function getSelectedHainanStores(selectedStores = []) {
  const normalized = selectedStores.map(normalizeStoreLabel).filter(Boolean);
  if (!normalized.length || normalized.includes('全部')) return [...hainanStores];
  const matched = hainanStores.filter((store) => normalized.includes(store));
  return matched.length ? matched : [...hainanStores];
}

function parseMetricValue(value) {
  const numeric = Number(String(value).replace(/,/g, '').replace(/%/g, ''));
  return Number.isFinite(numeric) ? numeric : null;
}

const aggregatePercentIndexes = new Set([2, 4, 7, 9]);

function aggregateMetricCells(rows) {
  return metricHeaders.map((_, index) => {
    const values = rows.map((row) => parseMetricValue(row.metrics[index])).filter((value) => value !== null);
    if (!values.length) return '--';
    const total = values.reduce((sum, value) => sum + value, 0);
    if (aggregatePercentIndexes.has(index)) {
      return `${(total / values.length).toFixed(1)}%`;
    }
    return `${total.toFixed(2)}`;
  });
}

export function buildOfflineRetailRows(selectedStores = []) {
  const selectedStoreNames = getSelectedHainanStores(selectedStores);
  const selectedStoreSet = new Set(selectedStoreNames);
  const summaryRows = offlineRetailBaseRows.filter((row) => row.channel !== '海南区域');
  const hainanSummaryTemplates = offlineRetailBaseRows.filter((row) => row.channel === '海南区域' && row.secondaryChannel === '海南区域小计');
  const selectedStoreRows = offlineRetailBaseRows.filter((row) => row.channel === '海南区域' && row.store && selectedStoreSet.has(row.store));
  const rowsByIndicator = new Map();

  selectedStoreRows.forEach((row) => {
    if (!rowsByIndicator.has(row.indicator)) rowsByIndicator.set(row.indicator, []);
    rowsByIndicator.get(row.indicator).push(row);
  });

  const resolvedSummaryRows = hainanSummaryTemplates.map((template) => ({
    ...template,
    metrics: aggregateMetricCells(rowsByIndicator.get(template.indicator) || []),
  }));

  return [...summaryRows, ...resolvedSummaryRows, ...selectedStoreRows];
}

export const offlineRetailRows = buildOfflineRetailRows();
