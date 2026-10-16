const OPPONENT_SPORTS_PAGE = [
  { id: 'cl', name: 'Cầu lông' },
  { id: 'pb', name: 'Pickleball' },
  { id: 'fb', name: 'Bóng đá mini' },
  { id: 'fb7', name: 'Sân 7 người' },
  { id: 'tn', name: 'Tennis' }
];

const OPPONENT_HOURS_PAGE = Array.from({ length: 20 }, (_, index) => index + 6);
const OPPONENT_LEVELS_PAGE = {
  beginner: 'Mới chơi',
  basic: 'Cơ bản',
  intermediate: 'Trung bình',
  advanced: 'Nâng cao'
};
const OPPONENT_STORAGE_KEY = 'vk_opponents';

const opponentElement = id => document.getElementById(id);
const today = new Date();
today.setHours(0, 0, 0, 0);

const maxBookingDate = new Date(today);
const targetDay = maxBookingDate.getDate();
maxBookingDate.setDate(1);
maxBookingDate.setMonth(maxBookingDate.getMonth() + 1);
maxBookingDate.setDate(Math.min(
  targetDay,
  new Date(maxBookingDate.getFullYear(), maxBookingDate.getMonth() + 1, 0).getDate()
));

let opponents = loadOpponents();
let currentUser = loadSession();

function loadOpponents() {
  try {
    const value = JSON.parse(localStorage.getItem(OPPONENT_STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function loadSession() {
  try {
    const value = JSON.parse(localStorage.getItem('vk_session') || 'null');
    return value && value.id ? value : null;
  } catch (error) {
    return null;
  }
}

function saveOpponents() {
  try {
    localStorage.setItem(OPPONENT_STORAGE_KEY, JSON.stringify(opponents));
  } catch (error) {
  }
}

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

function dateFromKey(value) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(value) {
  return value.split('-').reverse().join('/');
}

function hourLabel(hour) {
  return `${String(hour % 24).padStart(2, '0')}:00`;
}

function escapeOpponentHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[character]));
}

function setOpponentMessage(message, type = '') {
  const messageElement = opponentElement('opponentMsg');
  messageElement.textContent = message;
  messageElement.className = `msg ${type}`.trim();
}

function renderOpponentList() {
  const list = opponentElement('opponentList');
  const count = opponentElement('opponentCount');
  const status = opponentElement('opponentListStatus');
  const openEntries = opponents
    .filter(entry => entry.status === 'open' && entry.date && dateFromKey(entry.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || Number(a.hour) - Number(b.hour));

  count.textContent = `${openEntries.length} người đang tìm`;
  status.textContent = openEntries.length ? `${openEntries.length} lời mời` : '';

  if (!openEntries.length) {
    list.innerHTML = '<p class="opponent-empty">Chưa có ai đăng ký tìm đối thủ. Hãy là người đầu tiên!</p>';
    return;
  }

  list.innerHTML = openEntries.map(entry => {
    const sportName = OPPONENT_SPORTS_PAGE.find(item => item.id === entry.sport)?.name || entry.sport || 'Môn thể thao';
    const level = OPPONENT_LEVELS_PAGE[entry.level] || 'Chưa nêu trình độ';
    const isOwner = currentUser?.id === entry.userId;
    const action = isOwner
      ? `<button class="opponent-action cancel-opponent" type="button" data-cancel-opponent="${escapeOpponentHtml(entry.id)}">Hủy tìm</button>`
      : `<button class="opponent-action" type="button" data-accept-opponent="${escapeOpponentHtml(entry.id)}">${currentUser ? 'Nhận đối thủ' : 'Đăng nhập để nhận'}</button>`;
    const note = entry.note
      ? `<p class="opponent-item-note">${escapeOpponentHtml(entry.note)}</p>`
      : '';

    return `
      <article class="opponent-item">
        <div class="opponent-item-content">
          <div class="opponent-item-top">
            <strong>${escapeOpponentHtml(entry.name || 'Người chơi')}</strong>
            <span class="opponent-badge">${escapeOpponentHtml(level)}</span>
          </div>
          <p class="opponent-item-meta">
            ${escapeOpponentHtml(sportName)} · ${formatDate(entry.date)} · ${hourLabel(Number(entry.hour))}–${hourLabel(Number(entry.hour) + 1)}
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

function acceptOpponent(id) {
  if (!currentUser) {
    setOpponentMessage('Vui lòng đăng nhập ở trang Đặt sân trước khi nhận đối thủ.', 'err');
    return;
  }

  const entry = opponents.find(item => item.id === id);
  if (!entry || entry.status !== 'open') return;

  if (entry.userId === currentUser.id) {
    setOpponentMessage('Bạn không thể nhận chính lời mời của mình.', 'err');
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

function initOpponentPage() {
  const sportSelect = opponentElement('opponentSport');
  const timeSelect = opponentElement('opponentTime');
  const dateInput = opponentElement('opponentDate');
  const form = opponentElement('opponentForm');

  OPPONENT_SPORTS_PAGE.forEach(sport => sportSelect.add(new Option(sport.name, sport.id)));
  OPPONENT_HOURS_PAGE.forEach(hour => timeSelect.add(new Option(`${hourLabel(hour)}–${hourLabel(hour + 1)}`, hour)));
  dateInput.min = dateKey(today);
  dateInput.max = dateKey(maxBookingDate);
  dateInput.value = dateKey(today);

  form.addEventListener('submit', event => {
    event.preventDefault();
    currentUser = loadSession();

    if (!currentUser) {
      setOpponentMessage('Vui lòng đăng nhập hoặc đăng ký ở trang Đặt sân trước khi tìm đối thủ.', 'err');
      return;
    }

    const sportId = sportSelect.value;
    const date = dateInput.value;
    const hour = Number(timeSelect.value);
    const level = opponentElement('opponentLevel').value;
    const note = opponentElement('opponentNote').value.trim();
    const selectedDate = date ? dateFromKey(date) : null;

    if (!OPPONENT_SPORTS_PAGE.some(item => item.id === sportId)) {
      setOpponentMessage('Vui lòng chọn môn thể thao hợp lệ.', 'err');
      return;
    }

    if (!selectedDate || Number.isNaN(selectedDate.getTime()) || selectedDate < today || selectedDate > maxBookingDate) {
      setOpponentMessage('Ngày tìm đối thủ phải nằm trong vòng 1 tháng tới.', 'err');
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
    opponentElement('opponentNote').value = '';
    setOpponentMessage('Đã thêm bạn vào danh sách đang tìm đối thủ.', 'ok');
  });

  renderOpponentList();
}

initOpponentPage();
