import { detailMetricTemplates, metricHeaders } from './report-config.js?v=20260512-1838';

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

const monthlyRows = monthlyChannelGroups.flatMap((group) =>
  group.stores.flatMap((store) =>
    detailMetricTemplates.map((row) => ({
      channel: group.channel,
      secondaryChannel: group.secondaryChannel,
      store,
      ...row,
    })),
  ),
);

function buildMetricCells(seed) {
  return metricHeaders.map((_, index) => {
    const base = seed + index * 6;
    if (index === 2 || index === 4 || index === 7 || index === 9) {
      return `${(base % 34 + 62).toFixed(1)}%`;
    }
    if (index === 5) {
      return `${(base / 9).toFixed(2)}`;
    }
    return `${(base / 10).toFixed(2)}`;
  });
}

export const monthlySummaryRows = monthlyRows.map((row, index) => ({
  ...row,
  metrics: buildMetricCells(48 + index * 4),
}));
