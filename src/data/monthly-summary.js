export const monthlyMetricGroups = [
  '销售收入（万元）',
  '离岛人数（万人次）',
  '进店人数（万人次）',
  '进店率',
  '转化率',
  '客单价（元/人次）',
  '连带率',
  '件单价（元/件）',
  '人均购物额（元/人次）',
];

const monthFields = ['本月目标', '本月完成', '完成率', '上月完成', '环比', '去年同期', '同比'];
const yearFields = ['目标', '实际完成', '完成率', '去年同期', '同比'];

const monthlyChannelGroups = [
  {
    channel: '海南区域',
    secondaryChannel: '实体店合计',
    stores: ['海棠湾店', '新海港店', '日月店', '博鳌店', '美兰机场', '凤凰机场'],
  },
  {
    channel: '海南区域',
    secondaryChannel: '海南线下渠道合计',
    stores: ['线上预定'],
  },
  {
    channel: '出入境口岸',
    secondaryChannel: '出入境口岸合计',
    stores: ['北京机场', '上海机场', '广州机场', '杭州机场', '其他A级店'],
  },
  {
    channel: '海外零售',
    secondaryChannel: '海外主要门店合计',
    stores: ['香港机场店', '澳门市内店', '澳门机场店', '柬中免', '香港市内店', 'DFS'],
  },
  {
    channel: '中免商贸',
    secondaryChannel: '中免商贸合计',
    stores: ['兰州', '成都', '大兴', '上海', '其他门店'],
  },
  {
    channel: '市内店',
    secondaryChannel: '线下合计',
    stores: [
      '深圳市内店',
      '广州市内店',
      '西安市内店',
      '天津市内店',
      '福州市内店',
      '厦门市内店',
      '大连市内店',
      '青岛市内店',
      '成都市内店',
      '三亚市内店（离境）',
      '哈尔滨市内店',
      '北京市内店',
      '上海市内店',
    ],
  },
  {
    channel: '市内店',
    secondaryChannel: '合计',
    stores: ['云仓', '云店'],
  },
];

const monthlyRows = monthlyChannelGroups.flatMap((group) => [
  {
    channel: group.channel,
    secondaryChannel: group.secondaryChannel,
    store: group.secondaryChannel,
    isSecondarySummary: true,
  },
  ...group.stores.map((store) => ({
    channel: group.channel,
    secondaryChannel: group.secondaryChannel,
    store,
    isSecondarySummary: false,
  })),
]);

function formatMonthlyCell(seed, metricName, fieldName) {
  if (fieldName.includes('率') || fieldName === '环比' || fieldName === '同比' || metricName.includes('率')) {
    return `${(seed % 38 + 58).toFixed(1)}%`;
  }
  if (metricName.includes('元')) {
    return `${(seed * 13.6).toFixed(2)}`;
  }
  return `${(seed / 3.8).toFixed(2)}`;
}

function buildMonthlyMetricCells(rowIndex) {
  return monthlyMetricGroups.flatMap((metricName, metricIndex) =>
    [...monthFields, ...yearFields].map((fieldName, fieldIndex) =>
      formatMonthlyCell(32 + rowIndex * 3 + metricIndex * 5 + fieldIndex, metricName, fieldName),
    ),
  );
}

export const monthlySummaryRows = monthlyRows.map((row, index) => ({
  ...row,
  metrics: buildMonthlyMetricCells(index),
}));
