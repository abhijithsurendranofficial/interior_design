const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}
document.querySelectorAll('[data-year], #year').forEach(node => node.textContent = new Date().getFullYear());
const form = document.getElementById('quote-form');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const details = [
      'Name: ' + data.get('name'),
      data.get('company') ? 'Company: ' + data.get('company') : null,
      'Email: ' + data.get('email'),
      data.get('phone') ? 'Phone: ' + data.get('phone') : null,
      '',
      'Project details:',
      data.get('project')
    ].filter(line => line !== null);
    const subject = encodeURIComponent('Project enquiry from ' + data.get('name'));
    const body = encodeURIComponent(details.join('\n'));
    window.location.href = 'mailto:hello@yourcompany.com?subject=' + subject + '&body=' + body;
  });
}
