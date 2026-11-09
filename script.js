const T = {
    en: {
      pageTitle: 'Smart Warehouse – Purchase orders',
      brand1: 'Smart ', brand2: 'Warehouse',
      operations: 'Operations', planning: 'Planning',
      dashboard: 'Dashboard', alerts: 'Alerts', inventory: 'Inventory', products: 'Products',
      forecast: 'AI forecast', purchaseOrders: 'Purchase orders', suppliers: 'Suppliers', reports: 'Reports',
      initials: 'WM', userName: 'Warehouse', userRole: 'Manager',
      title: 'Purchase orders', subtitle: 'Orders sent to suppliers and their status',
      search: 'Search products, SKUs...', newPO: 'New Purchase Order',
      all: 'All', pending: 'Pending', approved: 'Approved', delivered: 'Delivered',
      openOrders: 'Open orders', beingProcessed: 'Being Processed',
      awaiting: 'Awaiting approval', systemEquals: 'System equals count',
      deliveredMonth: 'Delivered this month', onTime: 'All on time',
      orders: 'Orders', thOrder: 'Order', thSupplier: 'Supplier', thItem: 'Item',
      thQty: 'Qty', thExpected: 'Expected', thStatus: 'Status',
      company: 'Company name', view: 'View', approve: 'Approve',
      needsApproval: 'Needs your approval', aiTag: 'Suggested by AI forecast',
      nile: 'Nile Foods Co.', sweet: 'Sweet Land',
      n: '{n}', po: 'PO-{n}', product: 'Product {n}', date: '{n} Oct',
      poProd: 'PO-{n} · Product {p}', supUnits: '{s} · {n} units',
      activeUsers: 'Active users', signedIn: 'Signed in to the website', onlineCount: '{n} online',
      employee: 'Employee', merchant: 'Merchant', activeAgo: 'Active {n} min ago',
      popupName: 'Warehouse Manager', admin: 'Admin'
    },
    ar: {
      pageTitle: 'Smart Warehouse – أوامر الشراء',
      brand1: 'Smart ', brand2: 'Warehouse',
      operations: 'العمليات', planning: 'التخطيط',
      dashboard: 'لوحة التحكم', alerts: 'التنبيهات', inventory: 'المخزون', products: 'المنتجات',
      forecast: 'توقعات الذكاء الاصطناعي', purchaseOrders: 'أوامر الشراء', suppliers: 'الموردون', reports: 'التقارير',
      initials: 'م\u200Cا', userName: 'مدير المستودع', userRole: 'مدير',
      title: 'أوامر الشراء', subtitle: 'الأوامر المرسلة إلى الموردين وحالتها',
      search: 'ابحث عن المنتجات ورموز SKU...', newPO: 'أمر شراء جديد',
      all: 'الكل', pending: 'قيد الانتظار', approved: 'معتمد', delivered: 'تم التسليم',
      openOrders: 'الأوامر المفتوحة', beingProcessed: 'قيد المعالجة',
      awaiting: 'بانتظار الاعتماد', systemEquals: 'العدد مطابق للنظام',
      deliveredMonth: 'تم تسليمها هذا الشهر', onTime: 'الكل في الموعد',
      orders: 'الأوامر', thOrder: 'الأمر', thSupplier: 'المورد', thItem: 'الصنف',
      thQty: 'الكمية', thExpected: 'المتوقع', thStatus: 'الحالة',
      company: 'اسم الشركة', view: 'عرض', approve: 'اعتماد',
      needsApproval: 'بانتظار اعتمادك', aiTag: 'مقترح من توقعات الذكاء الاصطناعي',
      nile: 'شركة النيل للأغذية', sweet: 'سويت لاند',
      n: '{n}', po: 'PO-{n}', product: 'منتج {n}', date: '{n} أكتوبر',
      poProd: 'PO-{n} · منتج {p}', supUnits: '{s} · {n} وحدة',
      activeUsers: 'المستخدمون النشطون', signedIn: 'المستخدمون المسجلون في الموقع', onlineCount: '{n} متصل',
      employee: 'موظف', merchant: 'تاجر', activeAgo: 'نشطة منذ {n} دقائق',
      popupName: 'مدير المخزن', admin: 'مدير'
    }
  };
  const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
  // Keep purchase order IDs unchanged when formatting Arabic digits.
  const toAr = s => s.replace(/PO-\d+|\d/g, m => m.startsWith('PO') ? m : AR_DIGITS[m]);

  function render(lang) {
    if (!Object.prototype.hasOwnProperty.call(T, lang)) lang = 'en';
    const dict = T[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = dict.pageTitle;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      let txt = dict[el.dataset.i18n] || '';
      txt = txt.replace('{n}', el.dataset.n || '')
               .replace('{p}', el.dataset.p || '')
               .replace('{s}', dict[el.dataset.s] || '');
      el.textContent = lang === 'ar' ? toAr(txt) : txt;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = dict[el.dataset.i18nPh];
    });
    document.querySelectorAll('.lang button').forEach(b =>
      b.classList.toggle('on', b.dataset.lang === lang));
    applyFilters();
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  document.querySelectorAll('.lang button').forEach(b =>
    b.addEventListener('click', () => render(b.dataset.lang)));

  // Apply the selected status and search filters.
  const tabs = document.querySelectorAll('#tabs button');
  const rows = document.querySelectorAll('#orders tr');
  const searchInput = document.querySelector('.search input');
  const allowedFilters = new Set(['all', 'pending', 'approved', 'delivered']);
  let activeFilter = 'all';

  function applyFilters() {
    const lang = document.documentElement.lang || 'en';
    const query = (searchInput?.value || '').trim().slice(0, 100).toLocaleLowerCase(lang);
    rows.forEach(row => {
      const matchesFilter = activeFilter === 'all' || row.dataset.status === activeFilter;
      const matchesSearch = !query || row.textContent.toLocaleLowerCase(lang).includes(query);
      row.hidden = !(matchesFilter && matchesSearch);
    });
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    const selected = tab.dataset.filter;
    if (!allowedFilters.has(selected)) return;
    activeFilter = selected;
    tabs.forEach(item => item.classList.toggle('on', item === tab));
    applyFilters();
  }));
  searchInput?.addEventListener('input', applyFilters);

  let saved = 'en';
  try { saved = localStorage.getItem('lang') || 'en'; } catch (e) {}
  render(saved);

  // ---- Active users popup (opens from the user button in the sidebar) ----
  const usersPopup = document.getElementById('usersPopup');
  const usersTrigger = document.querySelector('.user-count');
  const usersList = usersPopup.querySelector('.active-users-list');
  const usersTrack = usersPopup.querySelector('.users-custom-scrollbar');
  const usersThumb = usersTrack.querySelector('.users-custom-scrollbar-thumb');
  const sidebar = document.querySelector('.sidebar');
  let dragging = false, dragOffset = 0;

  function positionUsersPopup() {
    const width = Math.min(270, window.innerWidth - 24);
    const sb = sidebar.getBoundingClientRect();
    const userRow = document.querySelector('.user').getBoundingClientRect();
    const t = usersTrigger.getBoundingClientRect();
    const rtl = document.documentElement.dir === 'rtl';
    // LTR: align to the sidebar's left edge. RTL: align to its right edge.
    const left = rtl ? Math.round(sb.width - width - 6) : 6;
    usersPopup.style.width = width + 'px';
    usersPopup.style.left = left + 'px';
    usersPopup.style.bottom = Math.round(sb.bottom - userRow.top + 6) + 'px';
    const arrow = t.left + t.width / 2 - (sb.left + left) - 4;
    usersPopup.style.setProperty('--users-arrow-left', Math.max(12, Math.min(width - 20, arrow)) + 'px');
  }

  function syncUsersScrollbar() {
    const viewport = usersList.clientHeight, content = usersList.scrollHeight, track = usersTrack.clientHeight;
    if (!viewport || !track || content <= viewport + 1) { usersTrack.hidden = true; return; }
    usersTrack.hidden = false;
    const thumbH = Math.min(track, Math.max(22, track * viewport / content));
    const maxTop = Math.max(0, track - thumbH);
    usersThumb.style.height = thumbH + 'px';
    usersThumb.style.transform = 'translateY(' + (maxTop * usersList.scrollTop / Math.max(1, content - viewport)) + 'px)';
  }

  function scrollUsersToPointer(clientY, center) {
    const r = usersTrack.getBoundingClientRect();
    const thumbH = usersThumb.offsetHeight;
    const maxTop = Math.max(1, r.height - thumbH);
    const top = Math.max(0, Math.min(maxTop, clientY - r.top - (center ? thumbH / 2 : dragOffset)));
    usersList.scrollTop = (usersList.scrollHeight - usersList.clientHeight) * top / maxTop;
  }

  function setUsersPopup(open) {
    usersPopup.hidden = !open;
    usersPopup.setAttribute('aria-hidden', String(!open));
    usersTrigger.setAttribute('aria-expanded', String(open));
    if (open) { positionUsersPopup(); requestAnimationFrame(syncUsersScrollbar); }
  }

  usersTrigger.addEventListener('click', e => { e.stopPropagation(); setUsersPopup(usersPopup.hidden); });
  usersPopup.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => { if (!usersPopup.hidden) setUsersPopup(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !usersPopup.hidden) setUsersPopup(false); });
  usersTrack.addEventListener('pointerdown', e => {
    if (usersTrack.hidden) return;
    if (e.target === usersThumb) {
      dragging = true;
      dragOffset = e.clientY - usersThumb.getBoundingClientRect().top;
      usersThumb.setPointerCapture(e.pointerId);
      e.preventDefault();
    } else {
      scrollUsersToPointer(e.clientY, true);
    }
  });
  usersThumb.addEventListener('pointermove', e => { if (dragging) scrollUsersToPointer(e.clientY, false); });
  const stopDrag = () => { dragging = false; };
  usersThumb.addEventListener('pointerup', stopDrag);
  usersThumb.addEventListener('pointercancel', stopDrag);
  usersList.addEventListener('scroll', syncUsersScrollbar, { passive: true });
  window.addEventListener('resize', () => { if (!usersPopup.hidden) { positionUsersPopup(); syncUsersScrollbar(); } }, { passive: true });
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (!usersPopup.hidden) { positionUsersPopup(); requestAnimationFrame(syncUsersScrollbar); }
    usersTrigger.setAttribute('aria-label', document.documentElement.lang === 'ar' ? 'المستخدمون النشطون: ٥' : 'Active users: 5');
    usersPopup.setAttribute('aria-label', document.documentElement.lang === 'ar' ? 'المستخدمون النشطون' : 'Active users');
  }));
