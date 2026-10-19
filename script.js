const SPORTS = [
  {
    id: 'cl',
    name: 'Cầu lông',
    courts: ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'],
    price: 80000
  },
  {
    id: 'pb',
    name: 'Pickleball',
    courts: ['Sân A', 'Sân B', 'Sân C'],
    price: 120000
  },
  {
    id: 'fb',
    name: 'Bóng đá mini',
    courts: ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'],
    price: 200000,
    peakPrice: 250000
  },
  {
    id: 'fb7',
    name: 'Sân 7 người',
    courts: ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'],
    price: 400000,
    peakPrice: 600000
  },
  {
    id: 'tn',
    name: 'Tennis',
    courts: ['Sân đất nền', 'Sân cứng'],
    price: 180000
  }
];

const OPPONENT_SPORTS = [...SPORTS];

const HOURS = Array.from({ length: 20 }, (_, i) => i + 6);
const DOW = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const STORAGE = {
  books: 'vk_books',
  users: 'vk_users',
  session: 'vk_session',
  opponents: 'vk_opponents',
  reports: 'vk_reports'
};
const PAYMENT = {
  bankId: 'TCB',
  bankName: 'Techcombank',
  accountNumber: '1122777163'
};
const RECURRENCE_LABELS = {
  week: 'hàng tuần',
  month: 'hàng tháng'
};
const OPPONENT_LEVELS = {
  beginner: 'Mới chơi',
  basic: 'Cơ bản',
  intermediate: 'Trung bình',
  advanced: 'Nâng cao'
};

const $ = id => document.getElementById(id);
const fmt = number => `${number.toLocaleString('vi-VN')}đ`;
const key = date => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0')
].join('-');
const hh = hour => `${String(hour % 24).padStart(2, '0')}:00`;
const hourLabel = hour => `${hour % 24}h`;
const dateFromKey = dateKey => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
};
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[character]));

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const MAX_BOOKING_DATE = new Date(TODAY);
const targetDay = MAX_BOOKING_DATE.getDate();
MAX_BOOKING_DATE.setDate(1);
MAX_BOOKING_DATE.setMonth(MAX_BOOKING_DATE.getMonth() + 1);
MAX_BOOKING_DATE.setDate(Math.min(
  targetDay,
  new Date(
    MAX_BOOKING_DATE.getFullYear(),
    MAX_BOOKING_DATE.getMonth() + 1,
    0
  ).getDate()
));

const DAYS = [];
for (const date = new Date(TODAY); date <= MAX_BOOKING_DATE; date.setDate(date.getDate() + 1)) {
  DAYS.push(new Date(date));
}

const loadStorage = (name, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(name) || 'null');
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
};

const saveStorage = (name, value) => {
  try {
    localStorage.setItem(name, JSON.stringify(value));
  } catch (error) {
  }
};

const removeStorage = name => {
  try {
    localStorage.removeItem(name);
  } catch (error) {
  }
};

let sport = SPORTS[0];
let di = 0;
let sel = new Set();
let books = loadStorage(STORAGE.books, []);
let users = loadStorage(STORAGE.users, []);
let currentUser = loadStorage(STORAGE.session, null);
let opponents = loadStorage(STORAGE.opponents, []);
let reports = loadStorage(STORAGE.reports, []);
let authMode = 'login';
let activePayment = null;

if (!Array.isArray(books)) books = [];
if (!Array.isArray(users)) users = [];
if (!Array.isArray(opponents)) opponents = [];
if (!Array.isArray(reports)) reports = [];
if (!currentUser || !currentUser.id) currentUser = null;

const saveBooks = () => saveStorage(STORAGE.books, books);
const saveUsers = () => saveStorage(STORAGE.users, users);
const saveOpponents = () => saveStorage(STORAGE.opponents, opponents);
const saveReports = () => saveStorage(STORAGE.reports, reports);
const hash = value => {
  let result = 7;
  for (const character of value) {
    result = (result * 31 + character.charCodeAt(0)) >>> 0;
  }
  return result % 100;
};

const isPeakHour = hour => hour >= 17 && hour < 23;

const price = (selectedSport, hour) => {
  const hourlyPrice = isPeakHour(hour)
    ? (selectedSport.peakPrice ?? selectedSport.price * 1.3)
    : selectedSport.price;

  return Math.round(hourlyPrice / 1000) * 1000;
};

function normalizeContact(value) {
  const contact = value.trim().toLowerCase();

  if (contact.includes('@')) return contact;

  const phone = contact.replace(/[\s().-]/g, '');
  return phone.startsWith('+84') ? `0${phone.slice(3)}` : phone;
}

function isValidContact(contact) {
  const isPhone = /^0\d{9}$/.test(contact);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(contact);
  return isPhone || isEmail;
}

function isValidPhone(contact) {
  return /^0\d{9}$/.test(contact);
}

function taken(selectedSport, court, dateKey, hour) {
  const now = new Date();

  if (dateKey === key(now) && hour <= now.getHours()) return true;

  return books.some(booking => (
    booking.sport === selectedSport.id &&
    booking.date === dateKey &&
    booking.items.some(item => item.c === court && item.h === hour)
  )) || hash(`${selectedSport.id}${court}${dateKey}${hour}`) < 30;
}

function renderTabs() {
  $('sports').innerHTML = '';

  SPORTS.forEach(selectedSport => {
    const button = document.createElement('button');
    button.className = 'tab';
    button.textContent = selectedSport.name;
    button.setAttribute('aria-pressed', selectedSport === sport);
    button.onclick = () => {
      sport = selectedSport;
      sel.clear();
      renderAll();
    };
    $('sports').append(button);
  });
}

function renderVenueMap() {
  const map = $('venueMap');
  if (!map) return;

  map.querySelectorAll('[data-map-sport]').forEach(place => {
    const isActive = place.dataset.mapSport === sport.id;
    place.classList.toggle('is-active', isActive);

    if (place.classList.contains('map-zone')) {
      if (isActive) {
        place.setAttribute('aria-current', 'true');
      } else {
        place.removeAttribute('aria-current');
      }
    }
  });

  const current = $('venueMapCurrent');
  if (current) current.textContent = `Đang xem: ${sport.name}`;

  const zoneLabels = {
    cl: 'Khu A',
    pb: 'Khu B',
    fb: 'Khu C',
    fb7: 'Khu D',
    tn: 'Khu E'
  };
  const quickTitle = $('venueQuickTitle');
  if (quickTitle) quickTitle.textContent = `${zoneLabels[sport.id] || ''} · ${sport.name}`;
}

function renderReportCourts() {
  const sportSelect = $('reportSport');
  const courtSelect = $('reportCourt');
  if (!sportSelect || !courtSelect) return;

  const selectedSport = SPORTS.find(item => item.id === sportSelect.value) || sport;
  const previousCourt = courtSelect.value;

  courtSelect.innerHTML = selectedSport.courts
    .map(court => `<option value="${escapeHtml(court)}">${escapeHtml(court)}</option>`)
    .join('');

  if (selectedSport.courts.includes(previousCourt)) {
    courtSelect.value = previousCourt;
  }
}

function syncReportSport() {
  const sportSelect = $('reportSport');
  if (!sportSelect) return;

  sportSelect.value = sport.id;
  renderReportCourts();
}

function setReportMessage(message, className = '') {
  const messageElement = $('reportMsg');
  messageElement.textContent = message;
  messageElement.className = `msg ${className}`.trim();
}

function submitReport() {
  const sportId = $('reportSport').value;
  const selectedSport = SPORTS.find(item => item.id === sportId);
  const court = $('reportCourt').value;
  const issue = $('reportIssue').value;
  const description = $('reportDescription').value.trim();
  const phone = normalizeContact($('reportPhone').value);

  if (!selectedSport || !selectedSport.courts.includes(court)) {
    setReportMessage('Vui lòng chọn đúng khu sân và sân gặp sự cố.', 'err');
    return;
  }

  if (!issue) {
    setReportMessage('Vui lòng chọn tình trạng cần báo cáo.', 'err');
    return;
  }

  if (description.length < 10) {
    setReportMessage('Vui lòng mô tả sự cố chi tiết hơn (ít nhất 10 ký tự).', 'err');
    return;
  }

  if (!isValidPhone(phone)) {
    setReportMessage('Vui lòng nhập số điện thoại hợp lệ gồm 10 chữ số.', 'err');
    return;
  }

  reports.unshift({
    id: `RP${Date.now().toString(36).toUpperCase()}`,
    sport: sportId,
    court,
    issue,
    description,
    phone,
    status: 'new',
    createdAt: new Date().toISOString()
  });
  saveReports();

  $('reportForm').reset();
  $('reportSport').value = sportId;
  renderReportCourts();
  setReportMessage('Đã nhận báo cáo. Sân sẽ liên hệ bạn để xác minh và trao đổi hỗ trợ nếu cần.', 'ok');
}

function initReportForm() {
  const reportSport = $('reportSport');
  const reportForm = $('reportForm');
  if (!reportSport || !reportForm) return;

  reportSport.innerHTML = SPORTS
    .map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`)
    .join('');
  reportSport.onchange = renderReportCourts;
  reportForm.onsubmit = event => {
    event.preventDefault();
    submitReport();
  };

  syncReportSport();
}

function renderDays() {
  $('days').innerHTML = '';

  const repeatStart = $('repeatStart');
  repeatStart.min = key(TODAY);
  repeatStart.max = key(MAX_BOOKING_DATE);
  if (!repeatStart.value) repeatStart.value = key(DAYS[di]);

  DAYS.forEach((date, index) => {
    const button = document.createElement('button');
    button.className = 'day';
    button.setAttribute('aria-pressed', index === di);
    button.innerHTML = `<small>${index === 0 ? 'Nay' : DOW[date.getDay()]}</small>
      <span class="num">${date.getDate()}/${date.getMonth() + 1}</span>`;
    button.onclick = () => {
      di = index;
      sel.clear();
      $('repeatStart').value = key(date);
      renderAll();
    };
    $('days').append(button);
  });
}

function renderGrid() {
  const grid = $('grid');
  const dateKey = key(DAYS[di]);

  grid.innerHTML = '<div></div>';

  HOURS.forEach(hour => {
    grid.insertAdjacentHTML('beforeend', `<div class="hd">${hourLabel(hour)}</div>`);
  });

  sport.courts.forEach(court => {
    grid.insertAdjacentHTML('beforeend', `<div class="cn">${court}</div>`);

    HOURS.forEach(hour => {
      const button = document.createElement('button');
      const selectionKey = `${court}|${hour}`;
      const isTaken = taken(sport, court, dateKey, hour);
      const isSelected = sel.has(selectionKey);
      const selectedPrice = price(sport, hour);

      button.className = `cell${isPeakHour(hour) ? ' peak' : ''}`;
      button.disabled = isTaken;
      button.textContent = isTaken ? 'Kín' : isSelected ? 'Đã chọn' : 'Trống';
      button.setAttribute('aria-pressed', isSelected);
      button.setAttribute(
        'aria-label',
        `${court}, ${hh(hour)} đến ${hh(hour + 1)}, ${isTaken
          ? 'đã kín'
          : `còn trống, giá ${fmt(selectedPrice)}`}`
      );

      button.onclick = () => {
        if (isTaken) return;

        if (sel.has(selectionKey)) {
          sel.delete(selectionKey);
        } else {
          sel.add(selectionKey);
        }

        renderGrid();
        renderSum();
      };

      grid.append(button);
    });
  });
}

function items() {
  return [...sel]
    .map(selectionKey => {
      const [court, hour] = selectionKey.split('|');
      return { c: court, h: Number(hour) };
    })
    .sort((a, b) => a.c.localeCompare(b.c) || a.h - b.h);
}

function renderSum() {
  const selectedItems = items();

  $('sum').innerHTML = selectedItems.length
    ? selectedItems.map(item => `
        <div class="line">
          <span>${escapeHtml(item.c)} · ${hh(item.h)}–${hh(item.h + 1)}</span>
          <span>${fmt(price(sport, item.h))}</span>
        </div>
      `).join('')
    : '<p class="empty">Chọn các ô còn trống trên lịch để bắt đầu.</p>';

  $('total').textContent = fmt(
    selectedItems.reduce((sum, item) => sum + price(sport, item.h), 0)
  );
  $('go').disabled = !selectedItems.length;
}

function updateRepeatUI() {
  const cycle = $('repeatCycle').value;
  const isRecurring = cycle !== 'none';

  $('repeatFields').hidden = !isRecurring;
  $('repeatCount').required = isRecurring;

  if (!isRecurring) return;

  $('repeatHint').textContent = `Tính cả lượt đầu tiên, tối đa 52 lượt ${RECURRENCE_LABELS[cycle]}.`;
}

function addMonths(date, months) {
  const result = new Date(date);
  const targetDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();
  result.setDate(Math.min(targetDay, lastDay));
  return result;
}

function recurringDates(startKey, cycle, count) {
  const start = dateFromKey(startKey);
  const dates = [];

  for (let index = 0; index < count; index += 1) {
    let date;

    if (cycle === 'week') {
      date = new Date(start);
      date.setDate(start.getDate() + index * 7);
    } else if (cycle === 'month') {
      date = addMonths(start, index);
    } else {
      return [];
    }

    dates.push(key(date));
  }

  return dates;
}

function formatDateKey(dateKey) {
  return dateKey.split('-').reverse().join('/');
}

function setOpponentMessage(message, className = '') {
  const messageElement = $('opponentMsg');
  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.className = `msg ${className}`.trim();
}

function initOpponentForm() {
  const sportSelect = $('opponentSport');
  const timeSelect = $('opponentTime');
  const dateInput = $('opponentDate');
  if (!sportSelect || !timeSelect || !dateInput) return;

  sportSelect.innerHTML = OPPONENT_SPORTS
    .map(item => `<option value="${item.id}">${escapeHtml(item.name)}</option>`)
    .join('');
  timeSelect.innerHTML = HOURS
    .map(hour => `<option value="${hour}">${hh(hour)}–${hh(hour + 1)}</option>`)
    .join('');
  dateInput.min = key(TODAY);
  dateInput.max = key(MAX_BOOKING_DATE);
  dateInput.value = key(DAYS[di]);
}

function renderOpponentList() {
  const list = $('opponentList');
  const count = $('opponentCount');
  const status = $('opponentListStatus');
  if (!list || !count || !status) return;

  const openEntries = opponents
    .filter(entry => entry.status === 'open' && entry.date && dateFromKey(entry.date) >= TODAY)
    .sort((a, b) => a.date.localeCompare(b.date) || Number(a.hour) - Number(b.hour));

  count.textContent = `${openEntries.length} người đang tìm`;
  status.textContent = openEntries.length ? `${openEntries.length} lời mời` : '';

  if (!openEntries.length) {
    list.innerHTML = '<p class="opponent-empty">Chưa có ai đăng ký tìm đối thủ. Hãy là người đầu tiên!</p>';
    return;
  }

  list.innerHTML = openEntries.map(entry => {
    const selectedSport = OPPONENT_SPORTS.find(item => item.id === entry.sport);
    const sportName = selectedSport?.name || entry.sport || 'Môn thể thao';
    const level = OPPONENT_LEVELS[entry.level] || 'Chưa nêu trình độ';
    const isOwner = currentUser?.id === entry.userId;
    const action = isOwner
      ? `<button class="opponent-action cancel-opponent" type="button" data-cancel-opponent="${escapeHtml(entry.id)}">Hủy tìm</button>`
      : `<button class="opponent-action" type="button" data-accept-opponent="${escapeHtml(entry.id)}">Nhận đối thủ</button>`;
    const note = entry.note
      ? `<p class="opponent-item-note">${escapeHtml(entry.note)}</p>`
      : '';

    return `
      <article class="opponent-item">
        <div class="opponent-item-content">
          <div class="opponent-item-top">
            <strong>${escapeHtml(entry.name || 'Người chơi')}</strong>
            <span class="opponent-badge">${escapeHtml(level)}</span>
          </div>
          <p class="opponent-item-meta">
            ${escapeHtml(sportName)} · ${formatDateKey(entry.date)} · ${hh(Number(entry.hour))}–${hh(Number(entry.hour) + 1)}
          </p>
          ${note}
        </div>
        <div class="opponent-item-actions">${action}</div>
      </article>
    `;
  }).join('');

  list.querySelectorAll('[data-accept-opponent]').forEach(button => {
    button.onclick = () => acceptOpponent(button.dataset.acceptOpponent);
  });
  list.querySelectorAll('[data-cancel-opponent]').forEach(button => {
    button.onclick = () => cancelOpponent(button.dataset.cancelOpponent);
  });
}

function registerOpponent() {
  if (!currentUser) {
    setOpponentMessage('Vui lòng đăng nhập hoặc đăng ký trước khi tìm đối thủ.', 'err');
    openAuth('login');
    return;
  }

  const sportId = $('opponentSport').value;
  const date = $('opponentDate').value;
  const hour = Number($('opponentTime').value);
  const level = $('opponentLevel').value;
  const note = $('opponentNote').value.trim();
  const selectedDate = date ? dateFromKey(date) : null;

  if (!OPPONENT_SPORTS.some(item => item.id === sportId)) {
    setOpponentMessage('Vui lòng chọn môn thể thao hợp lệ.', 'err');
    return;
  }

  if (
    !selectedDate ||
    Number.isNaN(selectedDate.getTime()) ||
    selectedDate < TODAY ||
    selectedDate > MAX_BOOKING_DATE
  ) {
    setOpponentMessage('Ngày tìm đối thủ phải nằm trong vòng 1 tháng tới.', 'err');
    return;
  }

  if (!HOURS.includes(hour)) {
    setOpponentMessage('Vui lòng chọn khung giờ hợp lệ.', 'err');
    return;
  }

  const duplicate = opponents.some(entry => (
    entry.status === 'open' &&
    entry.userId === currentUser.id &&
    entry.sport === sportId &&
    entry.date === date &&
    Number(entry.hour) === hour
  ));

  if (duplicate) {
    setOpponentMessage('Bạn đã đăng ký tìm đối thủ ở khung giờ này.', 'err');
    return;
  }

  opponents.unshift({
    id: `OP${Date.now().toString(36).toUpperCase()}`,
    userId: currentUser.id,
    name: currentUser.name,
    sport: sportId,
    date,
    hour,
    level,
    note,
    status: 'open',
    acceptedBy: null,
    createdAt: new Date().toISOString()
  });
  saveOpponents();
  renderOpponentList();
  $('opponentNote').value = '';
  setOpponentMessage('Đã thêm bạn vào danh sách đang tìm đối thủ.', 'ok');
}

function acceptOpponent(id) {
  if (!currentUser) {
    setOpponentMessage('Vui lòng đăng nhập hoặc đăng ký để nhận đối thủ.', 'err');
    openAuth('login');
    return;
  }

  const entry = opponents.find(item => item.id === id);
  if (!entry || entry.status !== 'open') return;

  if (entry.userId === currentUser.id) {
    setOpponentMessage('Bạn không thể nhận chính bài đăng của mình.', 'err');
    return;
  }

  entry.status = 'accepted';
  entry.acceptedBy = currentUser.id;
  entry.acceptedName = currentUser.name;
  entry.acceptedAt = new Date().toISOString();
  saveOpponents();
  renderOpponentList();
  setOpponentMessage(`Đã nhận lời làm đối thủ của ${entry.name}.`, 'ok');
}

function cancelOpponent(id) {
  if (!currentUser) return;

  const entry = opponents.find(item => item.id === id);
  if (!entry || entry.userId !== currentUser.id) return;

  opponents = opponents.filter(item => item.id !== id);
  saveOpponents();
  renderOpponentList();
  setOpponentMessage('Đã hủy lời tìm đối thủ.', 'ok');
}

function say(message, className = '') {
  const messageElement = $('msg');
  messageElement.textContent = message;
  messageElement.className = `msg ${className}`.trim();
}

function setAuthMessage(message, className = 'err') {
  const messageElement = $('authMsg');
  messageElement.textContent = message;
  messageElement.className = `msg ${className}`.trim();
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === 'register';

  $('authTitle').textContent = isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập';
  $('authHint').textContent = isRegister
    ? 'Tạo tài khoản bằng email hoặc số điện thoại để đặt sân nhanh hơn.'
    : 'Đăng nhập để xác nhận và quản lý lịch đặt sân.';
  $('authNameGroup').hidden = !isRegister;
  $('authName').required = isRegister;
  $('authConfirmGroup').hidden = !isRegister;
  $('authPassword').autocomplete = isRegister ? 'new-password' : 'current-password';
  $('authSubmit').textContent = isRegister ? 'Tạo tài khoản' : 'Đăng nhập';
  $('authSwitchText').firstChild.textContent = isRegister
    ? 'Đã có tài khoản? '
    : 'Chưa có tài khoản? ';
  $('authSwitch').textContent = isRegister ? 'Đăng nhập' : 'Đăng ký ngay';
}

function updateModalLock() {
  const authIsOpen = !$('authModal').hidden;
  const paymentIsOpen = !$('paymentModal').hidden;
  const contactIsOpen = !$('contactModal').hidden;
  document.body.classList.toggle('modal-open', authIsOpen || paymentIsOpen || contactIsOpen);
}

function openAuth(mode = 'login') {
  setAuthMode(mode);
  setAuthMessage('');
  $('authModal').hidden = false;
  updateModalLock();

  window.setTimeout(() => {
    $(mode === 'register' ? 'authName' : 'authContact').focus();
  }, 0);
}

function closeAuth() {
  $('authModal').hidden = true;
  updateModalLock();
}

function openContact() {
  $('contactModal').hidden = false;
  updateModalLock();
  window.setTimeout(() => $('contactClose').focus(), 0);
}

function closeContact() {
  $('contactModal').hidden = true;
  updateModalLock();
}

function paymentQrUrl(amount, phone) {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: phone
  });

  return `https://img.vietqr.io/image/${PAYMENT.bankId}-${PAYMENT.accountNumber}-compact2.png?${params}`;
}

function openPayment(order) {
  activePayment = order;
  const phone = order.phone;
  const transferText = phone;

  $('paymentOrderId').textContent = order.id;
  $('paymentAmount').textContent = fmt(order.total);
  $('paymentSchedule').textContent = order.schedule;
  $('paymentContent').textContent = transferText;
  $('paymentQr').src = paymentQrUrl(order.total, transferText);
  $('paymentQr').alt = `Mã QR thanh toán ${fmt(order.total)} cho đơn ${order.id}`;
  $('paymentMsg').textContent = '';
  $('paymentMsg').className = 'msg';
  $('paymentModal').hidden = false;
  updateModalLock();
}

function closePayment() {
  $('paymentModal').hidden = true;
  updateModalLock();
}

function updateAuthUI() {
  const loggedIn = Boolean(currentUser);

  $('authActions').hidden = loggedIn;
  $('userArea').hidden = !loggedIn;

  if (loggedIn) {
    $('userName').textContent = `Xin chào, ${currentUser.name}`;

    if (!$('nm').value) $('nm').value = currentUser.name;
    if (!$('ph').value && /^0\d{9}$/.test(currentUser.contact)) {
      $('ph').value = currentUser.contact;
    }
  }

  renderMine();
  renderOpponentList();
}

$('authForm').onsubmit = event => {
  event.preventDefault();

  const contact = normalizeContact($('authContact').value);
  const password = $('authPassword').value;

  if (!isValidContact(contact)) {
    setAuthMessage('Hãy nhập email hoặc số điện thoại hợp lệ.');
    return;
  }

  if (password.length < 6) {
    setAuthMessage('Mật khẩu cần có ít nhất 6 ký tự.');
    return;
  }

  if (authMode === 'register') {
    const name = $('authName').value.trim();
    const confirmPassword = $('authPasswordConfirm').value;

    if (name.length < 2) {
      setAuthMessage('Hãy nhập họ tên của bạn.');
      return;
    }

    if (password !== confirmPassword) {
      setAuthMessage('Mật khẩu nhập lại chưa khớp.');
      return;
    }

    if (users.some(user => user.contact === contact)) {
      setAuthMessage('Email hoặc số điện thoại này đã được đăng ký.');
      return;
    }

    const user = {
      id: `U${Date.now().toString(36)}`,
      name,
      contact,
      password
    };

    users.push(user);
    saveUsers();
    currentUser = { id: user.id, name: user.name, contact: user.contact };
    saveStorage(STORAGE.session, currentUser);
    closeAuth();
    updateAuthUI();
    say('Đăng ký thành công. Bạn có thể đặt sân ngay.', 'ok');
    return;
  }

  const user = users.find(item => (
    item.contact === contact && item.password === password
  ));

  if (!user) {
    setAuthMessage('Thông tin đăng nhập chưa đúng.');
    return;
  }

  currentUser = { id: user.id, name: user.name, contact: user.contact };
  saveStorage(STORAGE.session, currentUser);
  closeAuth();
  updateAuthUI();
  say('Đăng nhập thành công.', 'ok');
};

$('loginBtn').onclick = () => openAuth('login');
const registerBtn = $('registerBtn');
if (registerBtn) registerBtn.onclick = () => openAuth('register');
$('authSwitch').onclick = () => openAuth(authMode === 'login' ? 'register' : 'login');
$('authClose').onclick = closeAuth;
$('logoutBtn').onclick = () => {
  currentUser = null;
  removeStorage(STORAGE.session);
  updateAuthUI();
  say('Bạn đã đăng xuất.');
};
window.addEventListener('storage', event => {
  if (event.key !== STORAGE.session) return;

  currentUser = loadStorage(STORAGE.session, null);
  if (!currentUser || !currentUser.id) currentUser = null;
  updateAuthUI();
});

document.querySelector('[data-close-auth]').onclick = closeAuth;
document.querySelector('[data-close-payment]').onclick = closePayment;
document.querySelector('[data-close-contact]').onclick = closeContact;
$('contactClose').onclick = closeContact;
document.querySelectorAll('[data-open-contact]').forEach(link => {
  link.onclick = event => {
    event.preventDefault();
    openContact();
  };
});
$('paymentClose').onclick = closePayment;
$('paymentDone').onclick = () => {
  const orderId = activePayment?.id || $('paymentOrderId').textContent;
  const bookingIds = activePayment?.bookingIds || [orderId];

  books.forEach(booking => {
    if (bookingIds.includes(booking.id)) booking.paymentStatus = 'submitted';
  });

  if (bookingIds.length) {
    saveBooks();
    renderMine();
  }

  closePayment();
  say(`Đã ghi nhận bạn báo chuyển khoản cho đơn ${orderId}.`, 'ok');
};
$('copyPaymentInfo').onclick = async () => {
  const text = [
    PAYMENT.bankName,
    `STK ${PAYMENT.accountNumber}`,
    `Số tiền ${$('paymentAmount').textContent}`,
    `Nội dung ${$('paymentContent').textContent}`
  ].join(' - ');

  try {
    await navigator.clipboard.writeText(text);
    $('paymentMsg').textContent = 'Đã sao chép thông tin chuyển khoản.';
    $('paymentMsg').className = 'msg ok';
  } catch (error) {
    $('paymentMsg').textContent = 'Không thể sao chép tự động. Bạn hãy nhập theo thông tin bên dưới.';
    $('paymentMsg').className = 'msg err';
  }
};
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!$('paymentModal').hidden) {
    closePayment();
  } else if (!$('authModal').hidden) {
    closeAuth();
  } else if (!$('contactModal').hidden) {
    closeContact();
  }
});

$('go').onclick = () => {
  if (!currentUser) {
    say('Vui lòng đăng nhập hoặc đăng ký trước khi đặt sân.', 'err');
    openAuth('login');
    return;
  }

  const name = $('nm').value.trim();
  const phone = normalizeContact($('ph').value);
  const selectedItems = items();
  const cycle = $('repeatCycle').value;
  const isRecurring = cycle !== 'none';
  const repeatCount = isRecurring ? Number($('repeatCount').value) : 1;
  const startKey = isRecurring ? $('repeatStart').value : key(DAYS[di]);

  if (!['none', 'week', 'month'].includes(cycle)) {
    say('Chu kỳ đặt sân không hợp lệ.', 'err');
    return;
  }

  if (name.length < 2) {
    say('Hãy nhập họ tên của bạn.', 'err');
    return;
  }

  if (!/^0\d{9}$/.test(phone)) {
    say('Số điện thoại gồm 10 chữ số và bắt đầu bằng 0.', 'err');
    return;
  }

  if (!selectedItems.length) return;

  const startDate = startKey ? dateFromKey(startKey) : null;

  if (
    !startDate ||
    Number.isNaN(startDate.getTime()) ||
    startDate < TODAY ||
    startDate > MAX_BOOKING_DATE
  ) {
    say('Ngày đặt sân phải nằm trong vòng 1 tháng tới.', 'err');
    return;
  }

  if (isRecurring && (!Number.isInteger(repeatCount) || repeatCount < 2 || repeatCount > 52)) {
    say('Số lượt lặp phải nằm trong khoảng từ 2 đến 52.', 'err');
    return;
  }

  const dates = isRecurring
    ? recurringDates(startKey, cycle, repeatCount)
    : [startKey];

  if (dates.some(dateKey => dateFromKey(dateKey) > MAX_BOOKING_DATE)) {
    say('Lịch lặp không được có lượt đặt vượt quá thời hạn 1 tháng.', 'err');
    return;
  }

  const conflicts = [];

  dates.forEach(dateKey => {
    selectedItems.forEach(item => {
      if (taken(sport, item.c, dateKey, item.h)) {
        conflicts.push({ dateKey, item });
      }
    });
  });

  if (conflicts.length) {
    const conflictDates = [...new Set(conflicts.map(item => formatDateKey(item.dateKey)))];
    const visibleDates = conflictDates.slice(0, 3).join(', ');
    const extraDates = conflictDates.length > 3 ? ' và các ngày khác' : '';
    say(`Không thể tạo lịch lặp vì ngày ${visibleDates}${extraDates} có khung giờ đã kín.`, 'err');
    return;
  }

  const seriesId = `VK${Date.now().toString().slice(-6)}`;
  const bookingItems = dates.map((dateKey, index) => ({
    id: isRecurring ? `${seriesId}-${String(index + 1).padStart(2, '0')}` : seriesId,
    recurringId: isRecurring ? seriesId : null,
    recurrence: isRecurring
      ? { cycle, count: repeatCount, startDate: startKey }
      : null,
    userId: currentUser.id,
    sport: sport.id,
    date: dateKey,
    items: selectedItems,
    total: selectedItems.reduce((sum, item) => sum + price(sport, item.h), 0),
    name,
    phone,
    paymentStatus: 'pending'
  }));
  const orderTotal = bookingItems.reduce((sum, booking) => sum + booking.total, 0);

  books.unshift(...[...bookingItems].reverse());
  saveBooks();
  sel.clear();
  say(`Đã tạo ${bookingItems.length > 1 ? 'lịch đặt lặp' : 'đơn đặt sân'} ${seriesId}.`, 'ok');
  renderGrid();
  renderSum();
  renderMine();
  openPayment({
    id: seriesId,
    phone,
    total: orderTotal,
    bookingIds: bookingItems.map(booking => booking.id),
    schedule: isRecurring
      ? `${bookingItems.length} lượt ${RECURRENCE_LABELS[cycle]}`
      : 'Một lượt'
  });
};

function renderMine() {
  const element = $('mine');

  if (!currentUser) {
    element.innerHTML = '<p class="empty">Đăng nhập để xem và quản lý lịch đặt sân của bạn.</p>';
    return;
  }

  const myBooks = books.filter(booking => booking.userId === currentUser.id);

  if (!myBooks.length) {
    element.innerHTML = '<p class="empty">Bạn chưa có lịch đặt nào. Chọn sân và giờ ở trên để bắt đầu.</p>';
    return;
  }

  const groups = new Map();
  myBooks.forEach(booking => {
    const groupId = booking.recurringId || booking.id;

    if (!groups.has(groupId)) {
      groups.set(groupId, []);
    }

    groups.get(groupId).push(booking);
  });

  element.innerHTML = '';

  [...groups.entries()]
    .sort(([, a], [, b]) => a[0].date.localeCompare(b[0].date))
    .forEach(([groupId, groupBookings]) => {
    groupBookings.sort((a, b) => a.date.localeCompare(b.date));
    const firstBooking = groupBookings[0];
    const lastBooking = groupBookings[groupBookings.length - 1];
    const selectedSport = SPORTS.find(item => item.id === firstBooking.sport);
    const isRecurring = Boolean(firstBooking.recurringId && firstBooking.recurrence);
    const paymentSubmitted = groupBookings.every(item => item.paymentStatus === 'submitted');
    const total = groupBookings.reduce((sum, item) => sum + item.total, 0);
    const schedule = isRecurring
      ? `${groupBookings.length} lượt ${RECURRENCE_LABELS[firstBooking.recurrence.cycle] || 'định kỳ'}`
      : 'Một lượt';
    const date = isRecurring
      ? `${formatDateKey(firstBooking.date)} → ${formatDateKey(lastBooking.date)}`
      : formatDateKey(firstBooking.date);
    const selectedItems = firstBooking.items
      .map(item => `${escapeHtml(item.c)} ${hh(item.h)}`)
      .join(', ');
    const row = document.createElement('div');
    const details = document.createElement('div');
    const cancelButton = document.createElement('button');

    row.className = 'bk';
    details.innerHTML = `
      <b>${escapeHtml(selectedSport.name)} · ${date}</b>
      <small>${selectedItems}</small>
      <small>${escapeHtml(groupId)} · ${fmt(total)} · ${schedule}</small>
      <small class="payment-status ${paymentSubmitted ? 'submitted' : 'pending'}">
        ${paymentSubmitted ? 'Đã báo chuyển khoản' : 'Chờ thanh toán'}
      </small>
    `;
    cancelButton.className = 'cancel';
    cancelButton.textContent = isRecurring ? 'Hủy lịch' : 'Hủy đặt';
    cancelButton.onclick = () => {
      const groupIds = new Set(groupBookings.map(item => item.id));
      books = books.filter(item => !groupIds.has(item.id));
      saveBooks();
      renderAll();
      say(`Đã hủy ${isRecurring ? 'lịch lặp' : 'đơn'} ${groupId}.`);
    };

    row.append(details, cancelButton);
    element.append(row);
  });
}

function renderAll() {
  renderTabs();
  renderVenueMap();
  syncReportSport();
  renderDays();
  renderGrid();
  renderSum();
  renderOpponentList();
  renderMine();
}

setAuthMode('login');
$('repeatCycle').onchange = updateRepeatUI;
updateRepeatUI();
initOpponentForm();
initReportForm();
const opponentForm = $('opponentForm');
if (opponentForm) {
  opponentForm.onsubmit = event => {
    event.preventDefault();
    registerOpponent();
  };
}

$('theme').onclick = () => {
  const root = document.documentElement;
  const isDark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

  root.dataset.theme = isDark ? 'light' : 'dark';
};

const footerNewsletter = $('footerNewsletter');
if (footerNewsletter) {
  footerNewsletter.onsubmit = event => {
    event.preventDefault();
    $('newsletterMsg').textContent = 'Đăng ký nhận ưu đãi thành công.';
    footerNewsletter.reset();
  };
}

renderAll();
updateAuthUI();

const authQuery = new URLSearchParams(window.location.search);
if (!currentUser && authQuery.get('auth') === 'login') {
  openAuth('login');
}
