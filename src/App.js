import {
  platformNavItems,
  reportTabs,
  timeDimensions,
  channelOptions,
  secondaryChannelOptions,
  storeOptions,
  metricHeaders,
} from './data/report-config.js';
import { fixedOfflineRows, detailOfflineRows } from './data/offline-retail.js';

const stickyLeftOffsets = ['0px', '148px', '296px', '404px'];

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
    return { start: `${year}-01`, end: `${year}-12` };
  }
  if (dimension === 'month') {
    return { start: `${year}-${month}`, end: `${year}-${month}` };
  }
  return { start: `${year}-${month}-${day}`, end: `${year}-${month}-${day}` };
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

function renderReportTable(rows, title, subtitle, unitText, tableClassName = '') {
  const tableWrap = createCell('div', 'table-card');
  const head = createCell('div', 'section-head');
  const titleGroup = createCell('div', 'section-title-group');
  titleGroup.append(createCell('div', 'section-title', title), createCell('div', 'section-subtitle', subtitle));
  head.append(titleGroup, createTableToolbar(unitText));

  const scroll = createCell('div', 'table-scroll');
  const table = createCell('table', `report-table ${tableClassName}`.trim());
  const thead = document.createElement('thead');
  const groupRow = document.createElement('tr');

  ['渠道', '二级渠道', '类别', '指标'].forEach((name, index) => {
    const th = createCell('th', 'sticky-col-head', name);
    th.rowSpan = 2;
    applyStickyOffset(th, index);
    groupRow.appendChild(th);
  });

  const budgetGroup = createCell('th', 'metric-group budget-group', '预算进度');
  budgetGroup.colSpan = 6;
  const compareGroup = createCell('th', 'metric-group compare-group', '同比分析');
  compareGroup.colSpan = 4;
  groupRow.append(budgetGroup, compareGroup);

  const metricRow = document.createElement('tr');
  metricHeaders.forEach((name, index) => {
    const th = createCell('th', index < 6 ? 'budget-head' : 'compare-head', name);
    metricRow.appendChild(th);
  });
  thead.append(groupRow, metricRow);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    if (row.summary) tr.classList.add('summary-row');
    [row.channel, row.secondaryChannel, row.category, row.indicator, ...row.metrics].forEach((cell, index) => {
      const td = createCell('td', '', cell);
      applyStickyOffset(td, index);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  scroll.appendChild(table);
  tableWrap.append(head, scroll);
  return tableWrap;
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

function buildOfflineTab() {
  const wrapper = createCell('div', 'tab-pane');
  const banner = createCell('div', 'insight-banner');
  banner.append(
    createCell('div', 'insight-title', '线下零售经营驾驶舱'),
    createCell('div', 'insight-text', '聚焦预算进度、收入质量、客流转化和门店经营表现，支持按时间、渠道与门店快速查看。'),
  );

  const stats = createCell('div', 'overview-grid');
  [
    ['预算完成率', '84.6%', '较上月 +3.1%'],
    ['累计实际', '268.42', '单位：亿元'],
    ['剩余预算', '48.75', 'Year-To-Go'],
    ['主要门店表现', '6 家', '核心样板门店'],
  ].forEach(([label, value, note]) => {
    stats.appendChild(createMetricCard(label, value, note));
  });

  wrapper.append(
    banner,
    stats,
    renderReportTable(fixedOfflineRows, '固定指标口径', '用于展示线下零售基础统计及预算对比字段', '单位：亿元 / 万人次 / %'),
    renderReportTable(detailOfflineRows, '门店明细指标', '按门店展开展示横向预算、同比及剩余预算字段', '单位：亿元 / 万人次 / %', 'detail-table'),
  );
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
  titleGroup.append(
    createCell('h1', 'report-title', '零售运营数据指标模型'),
    createCell('p', 'report-subtitle', `数据更新时间：${formatUpdateTime()}`),
  );
  titleRow.append(titleGroup, createCell('button', 'outline-btn', '需求说明'));

  const filterPanel = createCell('section', 'filter-panel');
  const filterHead = createCell('div', 'filter-panel-head');
  const filterTitle = createCell('div', 'filter-panel-title', '查询条件');
  const filterSummary = createCell('div', 'filter-panel-summary');
  const collapseBtn = createCell('button', 'filter-collapse-btn', '收起');
  collapseBtn.type = 'button';
  filterHead.append(filterTitle, filterSummary, collapseBtn);

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
    const type = dimension === 'day' ? 'date' : 'month';
    startInput.type = type;
    endInput.type = type;
    startInput.value = range.start;
    endInput.value = range.end;
    updateFilterSummary();
  }

  function updateFilterSummary(message = '') {
    const dimensionLabel = timeDimensions.find((item) => item.value === dimensionSelect.value)?.label || '月';
    const summary = [
      `时间维度：${dimensionLabel}`,
      `开始：${startInput.value}`,
      `结束：${endInput.value}`,
      `渠道：${channelMulti.getSummary()}`,
      `二级渠道：${secondaryChannelMulti.getSummary()}`,
      `门店：${storeMulti.getSummary()}`,
    ].join('；');
    filterSummary.textContent = message ? `${message}｜${summary}` : summary;
  }

  dimensionSelect.addEventListener('change', syncDateInputs);
  startInput.addEventListener('change', () => updateFilterSummary());
  endInput.addEventListener('change', () => updateFilterSummary());
  multiControls.forEach((control) => {
    control.field.addEventListener('multi-select-change', () => updateFilterSummary());
  });

  filterBar.append(dimensionField, startField, endField, channelMulti.field, secondaryChannelMulti.field, storeMulti.field);

  const filterActions = createCell('div', 'filter-actions');
  const queryBtn = createCell('button', 'primary-btn', '查询');
  const resetBtn = createCell('button', 'ghost-btn', '重置');
  queryBtn.type = 'button';
  resetBtn.type = 'button';
  queryBtn.addEventListener('click', () => updateFilterSummary('已按当前条件刷新'));
  resetBtn.addEventListener('click', () => {
    dimensionSelect.value = 'month';
    multiControls.forEach((control) => control.reset());
    syncDateInputs();
    updateFilterSummary('已恢复默认条件');
  });
  filterActions.append(queryBtn, resetBtn);
  filterBody.append(filterBar, filterActions);
  filterPanel.append(filterHead, filterBody);

  let filterCollapsed = false;
  collapseBtn.addEventListener('click', () => {
    filterCollapsed = !filterCollapsed;
    filterPanel.classList.toggle('collapsed', filterCollapsed);
    collapseBtn.textContent = filterCollapsed ? '展开' : '收起';
    multiControls.forEach((control) => control.close());
  });

  const tabBar = createCell('div', 'tab-bar');
  const tabContent = createCell('div', 'tab-content');

  function mountTab(id) {
    tabContent.innerHTML = '';
    if (id === 'offline') {
      tabContent.appendChild(buildOfflineTab());
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
