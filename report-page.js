const REPORT_SPORTS = [
  { id: 'cl', name: 'Cầu lông', courts: ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'] },
  { id: 'pb', name: 'Pickleball', courts: ['Sân A', 'Sân B', 'Sân C'] },
  { id: 'fb', name: 'Bóng đá mini', courts: ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'] },
  { id: 'fb7', name: 'Sân 7 người', courts: ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'] },
  { id: 'tn', name: 'Tennis', courts: ['Sân đất nền', 'Sân cứng'] }
];

const REPORT_STORAGE_KEY = 'vk_reports';
const reportElement = id => document.getElementById(id);

function loadReports() {
  try {
    const reports = JSON.parse(localStorage.getItem(REPORT_STORAGE_KEY) || '[]');
    return Array.isArray(reports) ? reports : [];
  } catch (error) {
    return [];
  }
}

function saveReports(reports) {
  try {
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
  }
}

function normalizePhone(value) {
  const phone = value.trim().replace(/[\s().-]/g, '');
  return phone.startsWith('+84') ? `0${phone.slice(3)}` : phone;
}

function setReportMessage(message, type = '') {
  const messageElement = reportElement('reportMsg');
  messageElement.textContent = message;
  messageElement.className = `msg ${type}`.trim();
}

function renderReportCourts() {
  const sport = REPORT_SPORTS.find(item => item.id === reportElement('reportSport').value);
  const courtSelect = reportElement('reportCourt');
  courtSelect.replaceChildren();

  if (!sport) return;

  sport.courts.forEach(court => courtSelect.add(new Option(court, court)));
}

function initReportForm() {
  const sportSelect = reportElement('reportSport');
  const reportForm = reportElement('reportForm');

  REPORT_SPORTS.forEach(sport => sportSelect.add(new Option(sport.name, sport.id)));
  sportSelect.addEventListener('change', renderReportCourts);
  renderReportCourts();

  reportForm.addEventListener('submit', event => {
    event.preventDefault();

    const sport = REPORT_SPORTS.find(item => item.id === sportSelect.value);
    const court = reportElement('reportCourt').value;
    const issue = reportElement('reportIssue').value;
    const description = reportElement('reportDescription').value.trim();
    const phone = normalizePhone(reportElement('reportPhone').value);

    if (!sport || !court || !issue) {
      setReportMessage('Vui lòng chọn đầy đủ khu sân, sân và tình trạng cần báo cáo.', 'err');
      return;
    }

    if (description.length < 10) {
      setReportMessage('Mô tả cần có ít nhất 10 ký tự để sân xác định sự cố.', 'err');
      return;
    }

    if (!/^0\d{9}$/.test(phone)) {
      setReportMessage('Vui lòng nhập số điện thoại hợp lệ gồm 10 chữ số.', 'err');
      return;
    }

    const reports = loadReports();
    reports.unshift({
      id: `RP-${Date.now()}`,
      sport: sport.id,
      court,
      issue,
      description,
      phone,
      status: 'new',
      createdAt: new Date().toISOString()
    });
    saveReports(reports);

    reportForm.reset();
    sportSelect.value = sport.id;
    renderReportCourts();
    setReportMessage('Đã nhận báo cáo. Sân sẽ liên hệ bạn để xác minh và trao đổi hỗ trợ nếu cần.', 'ok');
  });
}

initReportForm();
