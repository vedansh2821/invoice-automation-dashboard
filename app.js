/* ForgeBooks demo dashboard. All data is sample data, stored only in this browser. */

(function () {
  'use strict';

  var STORAGE_KEY = 'forgebooks_invoices_v1';
  var SESSION_KEY = 'forgebooks_session';
  var DEMO_EMAIL = 'demo@forgebooks.demo';
  var DEMO_PASSWORD = 'demo123';
  var THIS_MONTH = '2026-11';

  /* ---------- Sample data: 16 fictional invoices, Jun to Nov 2026 ---------- */
  var SAMPLE_INVOICES = [
    { id: 'inv-01', invoiceNo: 'INV-2026-0101', vendor: 'Sharma Stationery Co.', date: '2026-11-03', amount: 8450, category: 'Office Supplies', status: 'Paid' },
    { id: 'inv-02', invoiceNo: 'INV-2026-0102', vendor: 'Dewas Cloud Hosting', date: '2026-11-05', amount: 18999, category: 'Cloud Hosting', status: 'Paid' },
    { id: 'inv-03', invoiceNo: 'INV-2026-0103', vendor: 'Malwa Design Studio', date: '2026-11-06', amount: 24500, category: 'Marketing', status: 'Pending' },
    { id: 'inv-04', invoiceNo: 'INV-2026-0104', vendor: 'Shree Office Supplies, Dewas', date: '2026-11-08', amount: 12340, category: 'Office Supplies', status: 'Pending' },
    { id: 'inv-05', invoiceNo: 'INV-2026-0105', vendor: 'Malwa Travels', date: '2026-11-09', amount: 6720, category: 'Travel', status: 'Pending' },
    { id: 'inv-06', invoiceNo: 'INV-2026-0106', vendor: 'Shakti Power Solutions', date: '2026-10-28', amount: 15800, category: 'Utilities', status: 'Overdue' },
    { id: 'inv-07', invoiceNo: 'INV-2026-0107', vendor: 'Dewas Software Works', date: '2026-10-15', amount: 32000, category: 'Software', status: 'Paid' },
    { id: 'inv-08', invoiceNo: 'INV-2026-0108', vendor: 'Malwa Agro Traders', date: '2026-10-20', amount: 9750, category: 'Office Supplies', status: 'Overdue' },
    { id: 'inv-09', invoiceNo: 'INV-2026-0109', vendor: 'Malwa Data Analytics', date: '2026-09-12', amount: 41000, category: 'Software', status: 'Paid' },
    { id: 'inv-10', invoiceNo: 'INV-2026-0110', vendor: 'Sharma Stationery Co.', date: '2026-09-25', amount: 5200, category: 'Office Supplies', status: 'Paid' },
    { id: 'inv-11', invoiceNo: 'INV-2026-0111', vendor: 'Dewas Cloud Hosting', date: '2026-08-04', amount: 18999, category: 'Cloud Hosting', status: 'Paid' },
    { id: 'inv-12', invoiceNo: 'INV-2026-0112', vendor: 'Dewas Legal Consultants', date: '2026-08-19', amount: 27500, category: 'Consulting', status: 'Paid' },
    { id: 'inv-13', invoiceNo: 'INV-2026-0113', vendor: 'Shree Hardware Store, Dewas', date: '2026-07-11', amount: 14990, category: 'Hardware', status: 'Paid' },
    { id: 'inv-14', invoiceNo: 'INV-2026-0114', vendor: 'Shree Office Supplies, Dewas', date: '2026-07-22', amount: 11300, category: 'Office Supplies', status: 'Paid' },
    { id: 'inv-15', invoiceNo: 'INV-2026-0114', vendor: 'Shree Office Supplies, Dewas', date: '2026-11-02', amount: 11300, category: 'Office Supplies', status: 'Draft' },
    { id: 'inv-16', invoiceNo: 'INV-2026-0115', vendor: 'Dewas Fiber Broadband', date: '2026-06-14', amount: 8999, category: 'Utilities', status: 'Paid' }
  ];

  /* ---------- State ---------- */
  var invoices = loadInvoices();
  var searchTerm = '';
  var statusFilter = 'all';
  var sortMode = 'date-desc';

  /* ---------- DOM ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var loginScreen = $('loginScreen');
  var appScreen = $('appScreen');
  var loginForm = $('loginForm');
  var loginEmail = $('loginEmail');
  var loginPassword = $('loginPassword');
  var loginError = $('loginError');
  var tableBody = $('invoiceTableBody');
  var emptyState = $('emptyState');
  var toast = $('toast');

  /* ---------- Helpers ---------- */
  function inr(n) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  }
  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(function () { toast.hidden = true; }, 2600);
  }
  function saveInvoices() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices)); } catch (e) { /* storage unavailable, keep in-memory data */ }
  }
  function loadInvoices() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) { /* fall through to sample data */ }
    return JSON.parse(JSON.stringify(SAMPLE_INVOICES));
  }

  /* ---------- Auth (demo only, nothing leaves the browser) ---------- */
  function showApp() {
    loginScreen.hidden = true;
    appScreen.hidden = false;
    renderAll();
  }
  function showLogin() {
    appScreen.hidden = true;
    loginScreen.hidden = false;
    loginPassword.value = '';
  }
  function loginAsDemo() {
    try { sessionStorage.setItem(SESSION_KEY, 'demo'); } catch (e) { /* session storage unavailable */ }
    showApp();
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = loginEmail.value.trim().toLowerCase();
    var password = loginPassword.value;
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      loginError.hidden = true;
      loginAsDemo();
    } else {
      loginError.hidden = false;
    }
  });
  $('demoLoginBtn').addEventListener('click', loginAsDemo);
  $('logoutBtn').addEventListener('click', function () {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
    showLogin();
  });

  /* ---------- KPIs ---------- */
  function renderKpis() {
    var monthInvoices = invoices.filter(function (inv) { return inv.date.indexOf(THIS_MONTH) === 0; });
    var sum = function (list) { return list.reduce(function (t, inv) { return t + inv.amount; }, 0); };
    var paidMonth = monthInvoices.filter(function (inv) { return inv.status === 'Paid'; });
    var pendingAll = invoices.filter(function (inv) { return inv.status === 'Pending'; });
    var overdueAll = invoices.filter(function (inv) { return inv.status === 'Overdue'; });

    $('kpiTotal').textContent = inr(sum(monthInvoices));
    $('kpiTotalCount').textContent = monthInvoices.length + (monthInvoices.length === 1 ? ' invoice' : ' invoices');
    $('kpiPaid').textContent = inr(sum(paidMonth));
    $('kpiPaidCount').textContent = paidMonth.length + (paidMonth.length === 1 ? ' invoice' : ' invoices');
    $('kpiPending').textContent = inr(sum(pendingAll));
    $('kpiPendingCount').textContent = pendingAll.length + (pendingAll.length === 1 ? ' invoice' : ' invoices');
    $('kpiOverdue').textContent = inr(sum(overdueAll));
    $('kpiOverdueCount').textContent = overdueAll.length + (overdueAll.length === 1 ? ' invoice' : ' invoices');
  }

  /* ---------- Monthly bar chart (plain CSS bars, no library) ---------- */
  var CHART_MONTHS = [
    { key: '2026-06', label: 'Jun' },
    { key: '2026-07', label: 'Jul' },
    { key: '2026-08', label: 'Aug' },
    { key: '2026-09', label: 'Sep' },
    { key: '2026-10', label: 'Oct' },
    { key: '2026-11', label: 'Nov' }
  ];
  function renderChart() {
    var totals = CHART_MONTHS.map(function (m) {
      var total = invoices
        .filter(function (inv) { return inv.date.indexOf(m.key) === 0; })
        .reduce(function (t, inv) { return t + inv.amount; }, 0);
      return { label: m.label, total: total };
    });
    var max = Math.max.apply(null, totals.map(function (t) { return t.total; }).concat([1]));
    var chart = $('barChart');
    chart.innerHTML = '';
    totals.forEach(function (t) {
      var pct = Math.round((t.total / max) * 100);
      var col = document.createElement('div');
      col.className = 'bar-col';
      col.innerHTML =
        '<span class="bar-value">' + (t.total ? inr(t.total) : '₹0') + '</span>' +
        '<div class="bar" style="height:' + Math.max(pct, 2) + '%" title="' + t.label + ' 2026: ' + inr(t.total) + '"></div>' +
        '<span class="bar-month">' + t.label + '</span>';
      chart.appendChild(col);
    });
  }

  /* ---------- Table: filter, sort, render ---------- */
  function getFiltered() {
    var q = searchTerm.trim().toLowerCase();
    var list = invoices.filter(function (inv) {
      var matchesSearch = !q ||
        inv.vendor.toLowerCase().indexOf(q) !== -1 ||
        inv.invoiceNo.toLowerCase().indexOf(q) !== -1;
      var matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    list.sort(function (a, b) {
      if (sortMode === 'date-desc') return b.date.localeCompare(a.date);
      if (sortMode === 'date-asc') return a.date.localeCompare(b.date);
      if (sortMode === 'amount-desc') return b.amount - a.amount;
      if (sortMode === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
    return list;
  }

  function renderTable() {
    var list = getFiltered();
    $('invoiceCount').textContent = '(' + list.length + ' of ' + invoices.length + ')';
    tableBody.innerHTML = '';
    emptyState.hidden = list.length > 0;

    list.forEach(function (inv) {
      var tr = document.createElement('tr');
      tr.dataset.id = inv.id;
      tr.innerHTML =
        '<td class="invoice-no">' + esc(inv.invoiceNo) + '</td>' +
        '<td>' + esc(inv.vendor) + '</td>' +
        '<td>' + fmtDate(inv.date) + '</td>' +
        '<td>' + esc(inv.category) + '</td>' +
        '<td class="num">' + inr(inv.amount) + '</td>' +
        '<td><span class="status-pill status-' + inv.status.toLowerCase() + '">' + esc(inv.status) + '</span></td>' +
        '<td><button type="button" class="row-delete" data-delete="' + inv.id + '" aria-label="Delete invoice ' + esc(inv.invoiceNo) + '" title="Delete invoice">&times;</button></td>';
      tableBody.appendChild(tr);
    });
  }

  tableBody.addEventListener('click', function (e) {
    var delBtn = e.target.closest('[data-delete]');
    if (delBtn) {
      e.stopPropagation();
      var id = delBtn.getAttribute('data-delete');
      var inv = invoices.find(function (x) { return x.id === id; });
      if (inv && confirm('Delete invoice ' + inv.invoiceNo + ' from ' + inv.vendor + '? This only affects the sample data in your browser.')) {
        invoices = invoices.filter(function (x) { return x.id !== id; });
        saveInvoices();
        renderAll();
        showToast('Invoice deleted.');
      }
      return;
    }
    var row = e.target.closest('tr[data-id]');
    if (row) openDetail(row.dataset.id);
  });

  $('searchInput').addEventListener('input', function (e) {
    searchTerm = e.target.value;
    renderTable();
  });
  $('statusFilter').addEventListener('change', function (e) {
    statusFilter = e.target.value;
    renderTable();
  });
  $('sortSelect').addEventListener('change', function (e) {
    sortMode = e.target.value;
    renderTable();
  });

  /* ---------- Rule-based invoice summary (no live AI call) ---------- */
  function categoriseByVendor(vendor) {
    var v = vendor.toLowerCase();
    if (v.indexOf('cloud') !== -1 || v.indexOf('host') !== -1 || v.indexOf('server') !== -1 || v.indexOf('broadband') !== -1 || v.indexOf('fiber') !== -1) return 'Cloud & Hosting';
    if (v.indexOf('stationery') !== -1 || v.indexOf('office') !== -1 || v.indexOf('traders') !== -1) return 'Office Supplies';
    if (v.indexOf('software') !== -1 || v.indexOf('analytics') !== -1 || v.indexOf('data') !== -1 || v.indexOf('code') !== -1) return 'Software & Licenses';
    if (v.indexOf('travel') !== -1 || v.indexOf('cab') !== -1 || v.indexOf('air') !== -1) return 'Travel';
    if (v.indexOf('power') !== -1 || v.indexOf('utilities') !== -1 || v.indexOf('electric') !== -1) return 'Utilities';
    if (v.indexOf('design') !== -1 || v.indexOf('marketing') !== -1 || v.indexOf('ads') !== -1) return 'Marketing';
    if (v.indexOf('consult') !== -1 || v.indexOf('legal') !== -1) return 'Professional Services';
    if (v.indexOf('hardware') !== -1 || v.indexOf('techhub') !== -1) return 'Hardware';
    return 'General';
  }

  function buildSummary(inv) {
    var flags = [];
    var autoCategory = categoriseByVendor(inv.vendor);

    if (inv.status === 'Overdue') {
      flags.push({ cls: 'flag-bad', text: 'Overdue. This invoice is past its expected payment window, follow up with the vendor.' });
    } else if (inv.status === 'Pending') {
      var ageDays = Math.floor((Date.now() - new Date(inv.date + 'T00:00:00').getTime()) / 86400000);
      if (ageDays > 30) {
        flags.push({ cls: 'flag', text: 'Pending for more than 30 days. Worth a reminder to the vendor.' });
      }
    }

    var duplicates = invoices.filter(function (x) { return x.invoiceNo === inv.invoiceNo; });
    if (duplicates.length > 1) {
      flags.push({ cls: 'flag-bad', text: 'Possible duplicate. Invoice number ' + inv.invoiceNo + ' appears ' + duplicates.length + ' times in this data.' });
    }

    if (inv.status === 'Draft') {
      flags.push({ cls: 'flag', text: 'Draft. This invoice has not been sent or finalised yet.' });
    }

    if (!flags.length) {
      flags.push({ cls: 'flag-ok', text: 'No issues found. Amount, category and status look consistent.' });
    }

    var summaryLine = inr(inv.amount) + ' to ' + inv.vendor + ' for ' + inv.category.toLowerCase() +
      ', dated ' + fmtDate(inv.date) + ', currently ' + inv.status.toLowerCase() + '.';

    return { autoCategory: autoCategory, flags: flags, summaryLine: summaryLine };
  }

  function openDetail(id) {
    var inv = invoices.find(function (x) { return x.id === id; });
    if (!inv) return;
    var s = buildSummary(inv);
    var flagsHtml = s.flags.map(function (f) { return '<p class="' + f.cls + '">' + esc(f.text) + '</p>'; }).join('');

    $('detailTitle').textContent = 'Invoice ' + inv.invoiceNo;
    $('detailBody').innerHTML =
      '<dl class="detail-grid">' +
        '<div><dt>Vendor</dt><dd>' + esc(inv.vendor) + '</dd></div>' +
        '<div><dt>Invoice number</dt><dd>' + esc(inv.invoiceNo) + '</dd></div>' +
        '<div><dt>Date</dt><dd>' + fmtDate(inv.date) + '</dd></div>' +
        '<div><dt>Amount</dt><dd>' + inr(inv.amount) + '</dd></div>' +
        '<div><dt>Category</dt><dd>' + esc(inv.category) + '</dd></div>' +
        '<div><dt>Status</dt><dd><span class="status-pill status-' + inv.status.toLowerCase() + '">' + esc(inv.status) + '</span></dd></div>' +
      '</dl>' +
      '<div class="ai-box">' +
        '<h4>AI summary</h4>' +
        '<p class="ai-label">Rule-based demo summary (no live AI call)</p>' +
        '<p><strong>Detected category:</strong> ' + esc(s.autoCategory) + '</p>' +
        '<p>' + esc(s.summaryLine) + '</p>' +
        flagsHtml +
      '</div>';
    openModal('detailModal');
  }

  /* ---------- Add invoice ---------- */
  $('addBtn').addEventListener('click', function () {
    $('addError').hidden = true;
    openModal('addModal');
  });

  $('addForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var vendor = $('fVendor').value.trim();
    var invoiceNo = $('fInvoiceNo').value.trim();
    var date = $('fDate').value;
    var amount = parseFloat($('fAmount').value);
    var category = $('fCategory').value;
    var status = $('fStatus').value;
    var err = $('addError');

    if (!vendor) { err.textContent = 'Vendor is required.'; err.hidden = false; return; }
    if (!invoiceNo) { err.textContent = 'Invoice number is required.'; err.hidden = false; return; }
    if (!date) { err.textContent = 'Date is required.'; err.hidden = false; return; }
    if (!amount || isNaN(amount) || amount <= 0) { err.textContent = 'Amount must be a number greater than 0.'; err.hidden = false; return; }

    invoices.unshift({
      id: 'inv-' + Date.now(),
      invoiceNo: invoiceNo,
      vendor: vendor,
      date: date,
      amount: Math.round(amount),
      category: category,
      status: status
    });
    saveInvoices();
    closeModal('addModal');
    e.target.reset();
    renderAll();
    showToast('Invoice added.');
  });

  /* ---------- Export CSV (currently filtered invoices) ---------- */
  $('exportBtn').addEventListener('click', function () {
    var list = getFiltered();
    if (!list.length) { showToast('Nothing to export. No invoices match the current filter.'); return; }
    var header = ['Invoice No', 'Vendor', 'Date', 'Category', 'Amount (INR)', 'Status'];
    var csvCell = function (v) {
      var s = String(v);
      return (s.indexOf(',') !== -1 || s.indexOf('"') !== -1) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    var lines = [header.map(csvCell).join(',')];
    list.forEach(function (inv) {
      lines.push([inv.invoiceNo, inv.vendor, inv.date, inv.category, inv.amount, inv.status].map(csvCell).join(','));
    });
    var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'forgebooks-invoices.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('CSV downloaded (' + list.length + ' invoices).');
  });

  /* ---------- Reset sample data ---------- */
  $('resetBtn').addEventListener('click', function () {
    if (confirm('Reset to the original 16 sample invoices? Your added or deleted invoices will be lost.')) {
      invoices = JSON.parse(JSON.stringify(SAMPLE_INVOICES));
      saveInvoices();
      renderAll();
      showToast('Sample data reset.');
    }
  });

  /* ---------- Modals ---------- */
  function openModal(id) { $(id).hidden = false; }
  function closeModal(id) { $(id).hidden = true; }
  document.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', function () { closeModal(el.getAttribute('data-close')); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal('detailModal'); closeModal('addModal'); }
  });

  /* ---------- Render all ---------- */
  function renderAll() {
    renderKpis();
    renderChart();
    renderTable();
  }

  /* ---------- Init ---------- */
  var loggedIn = false;
  try { loggedIn = sessionStorage.getItem(SESSION_KEY) === 'demo'; } catch (e) { /* ignore */ }
  if (loggedIn) showApp();
})();
