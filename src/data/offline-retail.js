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

export const offlineRetailRows = offlineRows.map((row, index) => ({
  ...row,
  metrics: buildMetricCells(36 + index * 5),
}));
