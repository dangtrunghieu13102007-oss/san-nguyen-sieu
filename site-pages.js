const pageElement = id => document.getElementById(id);

const authCta = document.querySelector('[data-auth-cta]');
if (authCta) {
  let currentUser = null;

  try {
    currentUser = JSON.parse(localStorage.getItem('vk_session') || 'null');
  } catch (error) {
    currentUser = null;
  }

  if (currentUser && currentUser.id) {
    authCta.textContent = authCta.dataset.loggedLabel || 'Đặt sân ngay';
    authCta.href = authCta.dataset.loggedHref || 'index.html';
  } else {
    authCta.textContent = 'Đăng nhập';
    authCta.href = 'index.html?auth=login';
  }
}

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
