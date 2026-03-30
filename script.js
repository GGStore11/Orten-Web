const CLIENT_ID = '1397247853163843625';
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1484314863219245116/IKrHGi-ibae9Qx52FOOv31SA79Qe4Lyp8tME75zaj4zIbNZYVaoasgOjuRdLjfnBPBXB';
let user = null;

window.onload = async () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const token = fragment.get('access_token') || localStorage.getItem('dc_token');
  if (token) await authUser(token);
};

async function authUser(token) {
  try {
    const res = await fetch('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error();
    user = await res.json();
    localStorage.setItem('dc_token', token);
    window.location.hash = "";

    document.getElementById('landing-page').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('landing-page').style.display = 'none';
      document.getElementById('main-store').style.display = 'block';
      setTimeout(() => document.getElementById('main-store').style.opacity = '1', 50);
    }, 800);

    document.getElementById('user-name').innerText = user.username;
    document.getElementById('user-img').src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    log("دخول ✅", `المستخدم **${user.username}** فتح المتجر.`);
  } catch { logout(); }
}

function showSection(id) {
  const sections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('nav span');

  sections.forEach(s => {
    if(s.classList.contains('active')) { s.style.opacity='0'; s.style.transform='translateY(-20px)'; }
  });

  setTimeout(() => {
    sections.forEach(s => { s.classList.remove('active'); s.style.display='none'; });
    navItems.forEach(n => n.classList.remove('active'));

    const activeSection = document.getElementById('section-' + id);
    activeSection.style.display='block';
    activeSection.offsetHeight;
    activeSection.classList.add('active');
    activeSection.style.opacity='1';
    activeSection.style.transform='translateY(0)';
    document.getElementById('nav-' + id).classList.add('active');
  }, 300);
}

function login() {
  const redirect = encodeURIComponent(window.location.origin + window.location.pathname);
  window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=token&scope=identify`;
}

function logout() {
  localStorage.removeItem('dc_token');
  window.location.href = window.location.origin + window.location.pathname;
}

function toggleDropdown() {
  const menu = document.getElementById('logout-menu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function buy(item) {
  log("طلب 💰", `المستخدم **${user.username}** طلب: **${item}**`);
  window.open("https://discord.gg/GjzACbTeJT", "_blank");
}

function openFree(item) {
  log("خدمة مجانية ✅", `المستخدم **${user.username}** استخدم: **${item}**`);
  window.open("https://discord.gg/GjzACbTeJT", "_blank");
}

function log(title, msg) {
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [{ title, description: msg, color: 6063574, timestamp: new Date() }] })
  });
}