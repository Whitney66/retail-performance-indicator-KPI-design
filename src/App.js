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

function createCell(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function createMultiSelect(label, options) {
  const field = createCell('div', 'filter-field wide');
  const labelEl = createCell('label', 'filter-label', label);
  const select = createCell('select', 'filter-select');
  select.multiple = true;
  options.forEach((option, index) => {
    const item = createCell('option', '', option);
    item.value = option;
    item.selected = index === 0;
    select.appendChild(item);
  });
  field.append(labelEl, select);
  return field;
}

function createSingleSelect(label, options, value) {
  const field = createCell('div', 'filter-field');
  const labelEl = createCell('label', 'filter-label', label);
  const select = createCell('select', 'filter-select single');
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

function renderFixedTable(rows) {
  const tableWrap = createCell('div', 'table-card');
  const head = createCell('div', 'section-head');
  head.append(
    createCell('div', 'section-title', '固定指标口径'),
    createCell('div', 'section-subtitle', '用于展示线下零售基础统计及预算对比字段'),
  );

  const scroll = createCell('div', 'table-scroll');
  const table = createCell('table', 'report-table');

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['渠道', '二级渠道', '类别', '指标', ...metricHeaders].forEach((name, index) => {
    const th = createCell('th', index < 4 ? 'sticky-col sticky-col-head' : '', name);
    if (index === 0) th.style.left = '0px';
    if (index === 1) th.style.left = '148px';
    if (index === 2) th.style.left = '296px';
    if (index === 3) th.style.left = '404px';
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    const cells = [row.channel, row.secondaryChannel, row.category, row.indicator, ...row.metrics];
    cells.forEach((cell, index) => {
      const td = createCell('td', index < 4 ? 'sticky-col' : '', cell);
      if (index === 0) td.style.left = '0px';
      if (index === 1) td.style.left = '148px';
      if (index === 2) td.style.left = '296px';
      if (index === 3) td.style.left = '404px';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  scroll.appendChild(table);
  tableWrap.append(head, scroll);
  return tableWrap;
}

function renderDetailTable(rows) {
  const tableWrap = createCell('div', 'table-card');
  const head = createCell('div', 'section-head');
  head.append(
    createCell('div', 'section-title', '门店明细指标'),
    createCell('div', 'section-subtitle', '按门店展开展示横向预算、同比及剩余预算字段'),
  );

  const scroll = createCell('div', 'table-scroll');
  const table = createCell('table', 'report-table detail-table');

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['渠道', '二级渠道', '类别', '指标', ...metricHeaders].forEach((name, index) => {
    const th = createCell('th', index < 4 ? 'sticky-col sticky-col-head' : '', name);
    if (index === 0) th.style.left = '0px';
    if (index === 1) th.style.left = '148px';
    if (index === 2) th.style.left = '296px';
    if (index === 3) th.style.left = '404px';
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    if (row.summary) tr.classList.add('summary-row');

    const cells = [row.channel, row.secondaryChannel, row.category, row.indicator, ...row.metrics];
    cells.forEach((cell, index) => {
      const td = createCell('td', index < 4 ? 'sticky-col' : '', cell);
      if (index === 0) td.style.left = '0px';
      if (index === 1) td.style.left = '148px';
      if (index === 2) td.style.left = '296px';
      if (index === 3) td.style.left = '404px';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  scroll.appendChild(table);
  tableWrap.append(head, scroll);
  return tableWrap;
}

function renderPlaceholderTab(title, description) {
  const section = createCell('section', 'placeholder-card');
  section.append(
    createCell('h3', 'placeholder-title', title),
    createCell('p', 'placeholder-text', description),
  );

  const metrics = createCell('div', 'placeholder-metrics');
  ['指标概览', '趋势分析', '渠道拆分'].forEach((label, index) => {
    const card = createCell('div', 'metric-mini-card');
    card.append(
      createCell('div', 'metric-mini-label', label),
      createCell('div', 'metric-mini-value', `${82 + index * 6}%`),
      createCell('div', 'metric-mini-note', '待补充真实业务口径'),
    );
    metrics.appendChild(card);
  });

  const board = createCell('div', 'placeholder-board');
  board.append(
    createCell('div', 'board-title', '模块说明'),
    createCell(
      'div',
      'board-text',
      '该模块已预留为独立报表页签，当前保持与整体原型一致的高保真基调，后续补充真实字段后可直接替换卡片与表格内容。',
    ),
  );

  section.append(metrics, board);
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
    const card = createCell('div', 'overview-card');
    card.append(
      createCell('div', 'overview-label', label),
      createCell('div', 'overview-value', value),
      createCell('div', 'overview-note', note),
    );
    stats.appendChild(card);
  });

  wrapper.append(banner, stats, renderFixedTable(fixedOfflineRows), renderDetailTable(detailOfflineRows));
  return wrapper;
}

export function renderApp(root) {
  if (!root) return;

  const app = createCell('div', 'app-shell');

  const topbar = createCell('header', 'platform-header');
  const brand = createCell('div', 'brand-group');
  brand.append(createCell('div', 'brand-mark', 'P'), createCell('div', 'brand-name', '大数据平台'));

  const nav = createCell('nav', 'platform-nav');
  platformNavItems.forEach((item) => {
    const link = createCell('button', item === '数据填报' ? 'nav-item active' : 'nav-item', item);
    nav.appendChild(link);
  });

  const actions = createCell('div', 'platform-actions');
  const search = createCell('input', 'search-input');
  search.placeholder = '搜索...';
  actions.append(search, createCell('div', 'icon-btn', '◦'), createCell('div', 'icon-btn', '◫'), createCell('div', 'avatar-badge', 'cdf'));

  topbar.append(brand, nav, actions);

  const page = createCell('main', 'page-body');
  const reportCard = createCell('section', 'report-card');
  reportCard.appendChild(createCell('h1', 'report-title', '零售运营数据指标模型'));

  const filterBar = createCell('div', 'filter-bar');
  const { field: dimensionField, select: dimensionSelect } = createSingleSelect('时间维度', timeDimensions, 'month');
  const defaultRange = getRangeByDimension('month');
  const { field: startField, input: startInput } = createDateField('开始时间', defaultRange.start, 'month');
  const { field: endField, input: endInput } = createDateField('结束时间', defaultRange.end, 'month');

  function syncDateInputs() {
    const dimension = dimensionSelect.value;
    const range = getRangeByDimension(dimension);
    const type = dimension === 'day' ? 'date' : dimension === 'month' ? 'month' : 'month';
    startInput.type = type;
    endInput.type = type;
    startInput.value = range.start;
    endInput.value = range.end;
  }

  dimensionSelect.addEventListener('change', syncDateInputs);
  syncDateInputs();

  filterBar.append(
    dimensionField,
    startField,
    endField,
    createMultiSelect('渠道', channelOptions),
    createMultiSelect('二级渠道', secondaryChannelOptions),
    createMultiSelect('门店', storeOptions),
  );

  const filterActions = createCell('div', 'filter-actions');
  const queryBtn = createCell('button', 'primary-btn', '查询');
  const resetBtn = createCell('button', 'ghost-btn', '重置');
  resetBtn.addEventListener('click', () => {
    dimensionSelect.value = 'month';
    syncDateInputs();
  });
  filterActions.append(queryBtn, resetBtn);

  const tabBar = createCell('div', 'tab-bar');
  const tabContent = createCell('div', 'tab-content');

  function mountTab(id) {
    tabContent.innerHTML = '';
    if (id === 'offline') {
      tabContent.appendChild(buildOfflineTab());
      return;
    }
    if (id === 'monthly') {
      tabContent.appendChild(renderPlaceholderTab('月度汇总表', '用于承接按月汇总的预算、实际、同比、达成分析等综合展示。'));
      return;
    }
    if (id === 'border') {
      tabContent.appendChild(renderPlaceholderTab('出入境口岸排名与监控', '用于承接口岸排名、预警状态、客流监测及经营异常识别。'));
      return;
    }
    if (id === 'city') {
      tabContent.appendChild(renderPlaceholderTab('市内店零售指标情况', '用于承接市内店核心零售指标、结构占比与样板门店观察。'));
      return;
    }
    tabContent.appendChild(renderPlaceholderTab('中免商贸零售指标情况', '用于承接中免商贸板块的零售经营概览、关键指标和趋势监测。'));
  }

  reportTabs.forEach((tab, index) => {
    const button = createCell('button', index === 0 ? 'tab-btn active' : 'tab-btn', tab.label);
    button.addEventListener('click', () => {
      [...tabBar.children].forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
      mountTab(tab.id);
    });
    tabBar.appendChild(button);
  });

  mountTab('offline');

  reportCard.append(filterBar, filterActions, tabBar, tabContent);
  page.appendChild(reportCard);
  app.append(topbar, page);
  root.innerHTML = '';
  root.appendChild(app);
}
