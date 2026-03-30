const CLIENT_ID = '1397247853163843625';
let user = null;

window.onload = async () => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const token = fragment.get('access_token') || localStorage.getItem('dc_token');
  if (token) await authUser(token);
};

async function authUser(token) {
  try {
    const res = await fetch(`https://discord.com/api/users/@me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
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
    secureLog("دخول ✅", `المستخدم **${user.username}** فتح المتجر.`);
  } catch { logout(); }
}

function showSection(id) {
  const sections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('nav span');
  sections.forEach(s => s.style.display = 'none');
  sections.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));

  const activeSection = document.getElementById('section-' + id);
  activeSection.style.display = 'block';
  activeSection.offsetHeight;
  activeSection.classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
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
  secureLog("طلب 💰", `المستخدم **${user.username}** طلب: **${item}**`);
  window.open("https://discord.gg/GjzACbTeJT", "_blank");
}

// حماية Webhook: ارسال اللوجات عبر السيرفر
async function secureLog(title, msg) {
  try { await fetch(`/log`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title,msg}) }); }
  catch(e){ console.error("Log failed", e); }
}