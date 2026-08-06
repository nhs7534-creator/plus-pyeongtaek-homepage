(() => {
  const config = window.PLUS_SITE_CONFIG;
  if (!config) return;

  const textAll = (selector, value) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  textAll('[data-org]', config.organization);
  textAll('[data-org-en]', config.organizationEnglish);
  textAll('[data-tagline]', config.tagline);
  textAll('[data-lead]', config.lead);
  textAll('[data-mission]', config.mission);
  textAll('[data-address]', config.address);
  textAll('[data-tel]', config.telephone);
  textAll('[data-fax]', config.fax);
  textAll('[data-email]', config.email);
  textAll('[data-hours]', config.businessHours);

  document.querySelectorAll('[data-tel-link]').forEach((a) => {
    a.href = `tel:${config.telephone.replace(/[^0-9+]/g, '')}`;
  });
  document.querySelectorAll('[data-email-link]').forEach((a) => {
    const valid = config.email.includes('@');
    a.href = valid ? `mailto:${config.email}` : '#contact';
  });

  document.getElementById('vision-list').innerHTML = config.vision
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  document.getElementById('project-grid').innerHTML = config.projects
    .map((item) => `
      <article class="card">
        <span class="category">${escapeHtml(item.category)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </article>
    `)
    .join('');

  document.getElementById('branch-grid').innerHTML = config.branches
    .map((item) => `
      <article class="card">
        <span class="category">${escapeHtml(item.category)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        ${item.url ? `<a class="more" href="${escapeAttribute(item.url)}" target="_blank" rel="noopener">홈페이지 보기 →</a>` : ''}
      </article>
    `)
    .join('');

  document.getElementById('history-list').innerHTML = config.history
    .map((item) => `<li><time>${escapeHtml(item.year)}</time><span>${escapeHtml(item.text)}</span></li>`)
    .join('');

  document.getElementById('notice-list').innerHTML = config.notices
    .map((item) => `
      <article class="notice">
        <time datetime="${escapeAttribute(item.date)}">${escapeHtml(item.date)}</time>
        <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></div>
      </article>
    `)
    .join('');

  document.getElementById('map-link').href = `https://map.naver.com/p/search/${encodeURIComponent(config.mapQuery || config.address)}`;
  document.getElementById('year').textContent = new Date().getFullYear();

  const menuButton = document.querySelector('.menu-button');
  const nav = document.getElementById('main-nav');
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[char]);
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#096;');
  }
})();
