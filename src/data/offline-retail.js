import { detailMetricTemplates, metricHeaders } from './report-config.js';

const fixedRows = [
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '销售',
    indicator: '线下收入（亿元）－财务口径',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '销售',
    indicator: '其他业务收入（亿元）--财务口径',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '客流',
    indicator: '进店人数（万人次）',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '客流',
    indicator: '购买人数（万人次）',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '汇总',
    indicator: '销售数量（万件）',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '转化',
    indicator: '转化率',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '转化',
    indicator: '客单价（元/人次）',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '转化',
    indicator: '件单价（元/件）',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '转化',
    indicator: '连带率',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '折扣',
    indicator: '折扣率',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '毛利',
    indicator: '毛利额（亿元）',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '整体',
    category: '毛利',
    indicator: '毛利率',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '主要门店',
    category: '转化',
    indicator: '转化率',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '主要门店',
    category: '转化',
    indicator: '客单价（元/人次）',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '主要门店',
    category: '转化',
    indicator: '件单价（元/件）',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '主要门店',
    category: '转化',
    indicator: '连带率',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '主要门店',
    category: '折扣',
    indicator: '折扣率',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '主要门店',
    category: '毛利',
    indicator: '毛利额（亿元）',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '主要门店',
    category: '毛利',
    indicator: '毛利率',
  },
  {
    channel: '线下渠道',
    secondaryChannel: '其他门店',
    category: '销售',
    indicator: '线下收入（亿元）-财务口径',
  },
];

const stores = ['[1001] 三亚店', '[1002] 新海港店', '[1003] 凤凰机场店', '[1004] 美兰机场店', '[1005] 博鳌店', '[1006] 日月店'];

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

export const fixedOfflineRows = fixedRows.map((row, index) => ({
  ...row,
  metrics: buildMetricCells(36 + index * 5),
}));

export const detailOfflineRows = [
  {
    channel: '全部',
    secondaryChannel: '全部',
    category: '-',
    indicator: '总计数',
    metrics: buildMetricCells(28),
    summary: true,
  },
  ...stores.flatMap((store, storeIndex) =>
    detailMetricTemplates.map((item, metricIndex) => ({
      channel: '线下渠道',
      secondaryChannel: store,
      category: item.category,
      indicator: item.indicator,
      metrics: buildMetricCells(48 + storeIndex * 17 + metricIndex * 3),
    })),
  ),
];
