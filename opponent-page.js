const OPPONENT_SPORTS_PAGE = [
  { id: 'cl', name: 'Cầu lông', courts: ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'] },
  { id: 'pb', name: 'Pickleball', courts: ['Sân A', 'Sân B', 'Sân C'] },
  { id: 'fb', name: 'Bóng đá mini', courts: ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'] },
  { id: 'fb7', name: 'Sân 7 người', courts: ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'] },
  { id: 'tn', name: 'Tennis', courts: ['Sân đất nền', 'Sân cứng'] }
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

function updateOpponentAuthUI() {
  currentUser = loadSession();
  opponents = loadOpponents();
  opponentElement('opponentAuthPrompt').hidden = Boolean(currentUser);
  renderOpponentList();
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
  const activeEntries = opponents
    .filter(entry => ['open', 'accepted'].includes(entry.status) && entry.date && dateFromKey(entry.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || Number(a.hour) - Number(b.hour));
  const openCount = activeEntries.filter(entry => entry.status === 'open').length;

  count.textContent = `${openCount} người đang tìm`;
  status.textContent = activeEntries.length ? `${activeEntries.length} lời mời` : '';

  if (!activeEntries.length) {
    list.innerHTML = '<p class="opponent-empty">Chưa có ai đăng ký tìm đối thủ. Hãy là người đầu tiên!</p>';
    return;
  }

  list.innerHTML = activeEntries.map(entry => {
    const sportName = OPPONENT_SPORTS_PAGE.find(item => item.id === entry.sport)?.name || entry.sport || 'Môn thể thao';
    const level = OPPONENT_LEVELS_PAGE[entry.level] || 'Chưa nêu trình độ';
    const isOwner = currentUser?.id === entry.userId;
    const isAcceptedByCurrentUser = currentUser?.id === entry.acceptedBy;
    let action;
    let opponentDetails = '';

    if (entry.status === 'accepted') {
      opponentDetails = isOwner
        ? `<div class="opponent-contact-details" data-opponent-details="${escapeOpponentHtml(entry.id)}" hidden>
            <p><strong>Tên:</strong> ${escapeOpponentHtml(entry.acceptedName || 'Chưa cung cấp')}</p>
            <p><strong>Số điện thoại:</strong> ${escapeOpponentHtml(entry.acceptedContact || 'Chưa cung cấp')}</p>
            ${entry.acceptedNote ? `<p><strong>Ghi chú:</strong> ${escapeOpponentHtml(entry.acceptedNote)}</p>` : ''}
          </div>`
        : '';
      const viewButton = isOwner
        ? `<button class="opponent-action" type="button" data-view-opponent="${escapeOpponentHtml(entry.id)}" aria-expanded="false">Xem thông tin đối thủ</button>`
        : '';

      action = `<span class="opponent-badge opponent-badge--matched">${isAcceptedByCurrentUser ? 'Bạn đã có đối thủ' : 'Đã có đối thủ'}</span>${viewButton}`;
    } else if (isOwner) {
      action = `<button class="opponent-action cancel-opponent" type="button" data-cancel-opponent="${escapeOpponentHtml(entry.id)}">Hủy tìm</button>`;
    } else {
      action = `<button class="opponent-action" type="button" data-accept-opponent="${escapeOpponentHtml(entry.id)}">${currentUser ? 'Nhận đối thủ' : 'Đăng nhập để nhận'}</button>`;
    }

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
            ${escapeOpponentHtml(sportName)} · ${escapeOpponentHtml(entry.court || 'Chưa ghi sân')} · ${formatDate(entry.date)} · ${hourLabel(Number(entry.hour))}–${hourLabel(Number(entry.hour) + 1)}
          </p>
          ${note}
        </div>
        <div class="opponent-item-actions">${action}</div>
        ${opponentDetails}
      </article>
    `;
  }).join('');

  list.querySelectorAll('[data-accept-opponent]').forEach(button => {
    button.onclick = () => showOpponentContactForm(button.dataset.acceptOpponent);
  });
  list.querySelectorAll('[data-cancel-opponent]').forEach(button => {
    button.onclick = () => cancelOpponent(button.dataset.cancelOpponent);
  });
  list.querySelectorAll('[data-view-opponent]').forEach(button => {
    button.onclick = () => {
      const details = [...list.querySelectorAll('[data-opponent-details]')]
        .find(item => item.dataset.opponentDetails === button.dataset.viewOpponent);
      if (!details) return;
      details.hidden = !details.hidden;
      button.textContent = details.hidden ? 'Xem thông tin đối thủ' : 'Ẩn thông tin đối thủ';
      button.setAttribute('aria-expanded', String(!details.hidden));
    };
  });
}

function showOpponentContactForm(id) {
  currentUser = loadSession();
  opponents = loadOpponents();

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

  const article = opponentElement('opponentList')
    .querySelector(`[data-accept-opponent="${CSS.escape(id)}"]`)
    ?.closest('.opponent-item');
  if (!article) return;

  const defaultPhone = /^0\d{9}$/.test(currentUser.contact || '') ? currentUser.contact : '';
  const form = document.createElement('form');
  form.className = 'opponent-contact-form';
  form.innerHTML = `
    <h4>Thông tin của bạn</h4>
    <label class="opponent-contact-field">Tên
      <input name="name" type="text" maxlength="80" value="${escapeOpponentHtml(currentUser.name || '')}" autocomplete="name" required>
    </label>
    <label class="opponent-contact-field">Số điện thoại
      <input name="contact" type="tel" inputmode="tel" pattern="0[0-9]{9}" title="Nhập số điện thoại gồm 10 chữ số, bắt đầu bằng 0" value="${escapeOpponentHtml(defaultPhone)}" placeholder="0901234567" autocomplete="tel" required>
    </label>
    <label class="opponent-contact-field opponent-contact-field--note">Ghi chú cho đối thủ <span class="optional-label">(không bắt buộc)</span>
      <textarea name="note" maxlength="160" rows="2" placeholder="Lời nhắn cho người đăng lời mời"></textarea>
    </label>
    <div class="opponent-contact-form-actions">
      <button class="opponent-action" type="submit">Gửi thông tin và nhận đối thủ</button>
      <button class="opponent-action cancel-opponent" type="button" data-cancel-accept>Hủy</button>
    </div>
  `;

  article.append(form);
  form.elements.name.focus();
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    currentUser = loadSession();
    opponents = loadOpponents();
    const latestEntry = opponents.find(item => item.id === id);
    if (!currentUser || !latestEntry || latestEntry.status !== 'open' || latestEntry.userId === currentUser.id) {
      renderOpponentList();
      setOpponentMessage('Lời mời này không còn nhận đối thủ được.', 'err');
      return;
    }

    const name = form.elements.name.value.trim();
    const contact = form.elements.contact.value.trim();
    if (name.length < 2 || !/^0\d{9}$/.test(contact)) {
      setOpponentMessage('Vui lòng nhập tên hợp lệ và số điện thoại gồm 10 chữ số.', 'err');
      return;
    }

    latestEntry.status = 'accepted';
    latestEntry.acceptedBy = currentUser.id;
    latestEntry.acceptedName = name;
    latestEntry.acceptedContact = contact;
    latestEntry.acceptedNote = form.elements.note.value.trim();
    latestEntry.acceptedAt = new Date().toISOString();
    saveOpponents();
    renderOpponentList();
    setOpponentMessage(`Đã nhận lời làm đối thủ của ${latestEntry.name}.`, 'ok');
  });
  form.querySelector('[data-cancel-accept]').addEventListener('click', () => form.remove());
}

function cancelOpponent(id) {
  if (!currentUser) return;

  const entry = opponents.find(item => item.id === id);
  if (!entry || entry.userId !== currentUser.id || entry.status !== 'open') return;

  opponents = opponents.filter(item => item.id !== id);
  saveOpponents();
  renderOpponentList();
  setOpponentMessage('Đã hủy lời tìm đối thủ.', 'ok');
}

function initOpponentPage() {
  const sportSelect = opponentElement('opponentSport');
  const courtSelect = opponentElement('opponentCourt');
  const timeSelect = opponentElement('opponentTime');
  const dateInput = opponentElement('opponentDate');
  const form = opponentElement('opponentForm');

  OPPONENT_SPORTS_PAGE.forEach(sport => sportSelect.add(new Option(sport.name, sport.id)));
  const updateCourts = () => {
    const sport = OPPONENT_SPORTS_PAGE.find(item => item.id === sportSelect.value);
    courtSelect.replaceChildren(...(sport?.courts || []).map(court => new Option(court, court)));
  };
  sportSelect.addEventListener('change', updateCourts);
  updateCourts();
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
    const court = courtSelect.value;
    const date = dateInput.value;
    const hour = Number(timeSelect.value);
    const level = opponentElement('opponentLevel').value;
    const note = opponentElement('opponentNote').value.trim();
    const selectedDate = date ? dateFromKey(date) : null;

    if (!OPPONENT_SPORTS_PAGE.some(item => item.id === sportId)) {
      setOpponentMessage('Vui lòng chọn môn thể thao hợp lệ.', 'err');
      return;
    }

    if (!OPPONENT_SPORTS_PAGE.find(item => item.id === sportId)?.courts.includes(court)) {
      setOpponentMessage('Vui lòng chọn sân hợp lệ.', 'err');
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
      court,
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

  updateOpponentAuthUI();
}

window.addEventListener('storage', event => {
  if (event.key === 'vk_session' || event.key === OPPONENT_STORAGE_KEY) updateOpponentAuthUI();
});
window.addEventListener('vk-session-change', updateOpponentAuthUI);

initOpponentPage();
