const pageElement = id => document.getElementById(id);

const getCurrentUser = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('vk_session') || 'null');
    return currentUser && currentUser.id ? currentUser : null;
  } catch (error) {
    return null;
  }
};

const updateAuthUI = () => {
  const currentUser = getCurrentUser();
  const authActions = pageElement('authActions');
  const userArea = pageElement('userArea');
  const userName = pageElement('userName');

  if (!authActions || !userArea || !userName) return;

  authActions.hidden = Boolean(currentUser);
  userArea.hidden = !currentUser;

  if (currentUser) {
    userName.textContent = `Xin chào, ${currentUser.name}`;
  }
};

updateAuthUI();

const logoutButton = document.querySelector('[data-logout]');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('vk_session');
    updateAuthUI();
    window.dispatchEvent(new Event('vk-session-change'));
  });
}

window.addEventListener('storage', event => {
  if (event.key === 'vk_session') updateAuthUI();
});

const themeButton = pageElement('theme');
if (themeButton) {
  themeButton.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    root.dataset.theme = isDark ? 'light' : 'dark';
  });
}

const footerNewsletter = pageElement('footerNewsletter');
if (footerNewsletter) {
  footerNewsletter.addEventListener('submit', event => {
    event.preventDefault();
    pageElement('newsletterMsg').textContent = 'Đăng ký nhận ưu đãi thành công.';
    footerNewsletter.reset();
  });
}
