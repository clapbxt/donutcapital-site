/* ============================================================
   DONUT CAPITAL — SCRIPT.JS
   Loads JSON data and renders all sections
   ============================================================ */

// ── MOB ICONS FALLBACK MAP ──────────────────────────────────
const MOB_ICONS = {
  'skeleton':      '💀',
  'pig':           '🐷',
  'iron golem':    '🤖',
  'zombie':        '🧟',
  'zombie pigman': '🐷',
  'cow':           '🐄',
  'spider':        '🕷️',
  'creeper':       '💣',
  'blaze':         '🔥',
  'default':       '◈',
};

function getMobIcon(name) {
  const key = name.toLowerCase();
  for (const [mob, icon] of Object.entries(MOB_ICONS)) {
    if (key.includes(mob)) return icon;
  }
  return MOB_ICONS.default;
}

// ── STOCK STATUS ────────────────────────────────────────────
function getStockInfo(stock) {
  if (typeof stock === 'number') {
    if (stock === 0) return { cls: 'out-of-stock', label: 'Out of Stock' };
    if (stock <= 3)  return { cls: 'low-stock',    label: `Low — ${stock} left` };
    return                  { cls: 'in-stock',     label: `${stock} in Stock` };
  }
  const lower = String(stock).toLowerCase();
  if (lower === 'out' || lower === '0' || lower === 'out of stock') return { cls: 'out-of-stock', label: 'Out of Stock' };
  if (lower.startsWith('low') || lower === 'limited') return { cls: 'low-stock', label: stock };
  return { cls: 'in-stock', label: stock };
}

// ── FORMAT PRICE ────────────────────────────────────────────
function formatPrice(val) {
  if (typeof val === 'number') return val.toLocaleString();
  return String(val);
}

// ── SPAWNER FACE: image if available, else emoji ─────────────
function spawnerFaceHTML(sp) {
  if (sp.image) {
    return `<img class="spawner-face" src="${escHtml(sp.image)}" alt="${escHtml(sp.name)}" loading="lazy" onerror="this.outerHTML='<span class=\\'spawner-face-emoji\\'>${getMobIcon(sp.name)}</span>'">`;
  }
  return `<span class="spawner-face-emoji">${getMobIcon(sp.name)}</span>`;
}

// ── RENDER SPAWNERS ─────────────────────────────────────────
function renderSpawners(spawners) {
  const grid = document.getElementById('spawner-grid');
  const statEl = document.getElementById('stat-spawners');

  if (!spawners || spawners.length === 0) {
    grid.innerHTML = '<div class="empty-state">No spawners listed yet.</div>';
    return;
  }

  statEl.textContent = spawners.length;

  grid.innerHTML = spawners.map((sp, i) => {
    const { cls, label } = getStockInfo(sp.stock);
    return `
      <div class="spawner-card fade-in stagger-${Math.min(i + 1, 9)}">
        ${spawnerFaceHTML(sp)}
        <div class="spawner-name">${escHtml(sp.name)}</div>
        <div>
          <div class="spawner-price">${formatPrice(sp.price)}</div>
          <div class="spawner-price-unit">Diamonds / unit</div>
        </div>
        <div class="spawner-stock ${cls}">${label}</div>
      </div>
    `;
  }).join('');
}

// ── RENDER BUILDS ───────────────────────────────────────────
function renderBuilds(builds) {
  const grid = document.getElementById('builds-grid');
  const statEl = document.getElementById('stat-builds');

  if (!builds || builds.length === 0) {
    grid.innerHTML = '<div class="empty-state">No builds listed yet.</div>';
    return;
  }

  statEl.textContent = builds.length;

  grid.innerHTML = builds.map((b, i) => {
    const imgTag = b.image
      ? `<img class="build-image" src="${escHtml(b.image)}" alt="${escHtml(b.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'build-image-placeholder\\'>🏗️</div>'">`
      : `<div class="build-image-placeholder">🏗️</div>`;

    return `
      <div class="build-card fade-in stagger-${Math.min(i + 1, 9)}">
        ${imgTag}
        <div class="build-body">
          <div class="build-badges">
            <span class="badge badge-type">${escHtml(b.type || 'Build')}</span>
            ${b.rate ? `<span class="badge badge-rate">${escHtml(b.rate)}</span>` : ''}
          </div>
          <div class="build-name">${escHtml(b.name)}</div>
          ${b.rate ? `
            <div>
              <div class="build-rate-label">Output Rate</div>
              <div class="build-rate-val">${escHtml(b.rate)}</div>
            </div>
          ` : ''}
          <div class="build-footer">
            <div>
              <div class="build-price-label">Price</div>
              <div class="build-price-unit">Diamonds</div>
            </div>
            <div class="build-price">${formatPrice(b.price)}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── RENDER DIGGING ──────────────────────────────────────────
function renderDigging(digging) {
  const layout = document.getElementById('digging-layout');

  if (!digging) {
    layout.innerHTML = '<div class="empty-state">No digging info available.</div>';
    return;
  }

  const examples = Array.isArray(digging.examples) ? digging.examples : [];

  layout.innerHTML = `
    <div class="digging-main fade-in stagger-1">
      <div class="digging-rate-label">Rate per block</div>
      <div class="digging-rate">
        <span class="digging-rate-num">${escHtml(String(digging.price_per_block))}</span>
        <span class="digging-rate-suffix">◈ / block</span>
      </div>
      <p class="digging-desc">${escHtml(digging.description || '')}</p>
    </div>
    <div class="digging-examples fade-in stagger-2">
      <div class="digging-examples-title">Price Examples</div>
      ${examples.map(ex => `
        <div class="digging-example-row">
          <div class="digging-ex-blocks">${escHtml(ex.blocks || ex.label || '')}</div>
          <div class="digging-ex-arrow">→</div>
          <div>
            <div class="digging-ex-price">${escHtml(String(ex.price || ex.cost || ''))}</div>
            <div class="digging-ex-unit">Diamonds</div>
          </div>
        </div>
      `).join('')}
      ${examples.length === 0 ? '<div style="color:var(--grey-400);font-family:var(--font-mono);font-size:12px;padding:16px 0;">No examples added yet.</div>' : ''}
    </div>
  `;
}

// ── TICKER ──────────────────────────────────────────────────
function buildTicker(spawners, builds, digging) {
  const parts = [];

  if (spawners) {
    spawners.forEach(sp => {
      parts.push(`${getMobIcon(sp.name)} ${sp.name.toUpperCase()} — ${formatPrice(sp.price)} ◈`);
    });
  }
  if (builds) {
    builds.forEach(b => {
      parts.push(`🏗️ ${b.name.toUpperCase()} — ${formatPrice(b.price)} ◈`);
    });
  }
  if (digging) {
    parts.push(`⛏️ DIGGING — ${formatPrice(digging.price_per_block)} ◈ / BLOCK`);
  }

  if (parts.length === 0) return;

  const full = [...parts, ...parts].join('   ·   ');
  const ticker = document.getElementById('ticker-content');
  ticker.textContent = full;

  const dur = Math.max(20, parts.length * 3);
  ticker.style.animationDuration = dur + 's';
}

// ── HELPERS ─────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── MAIN INIT ───────────────────────────────────────────────
async function init() {
  try {
    const [spawnerRes, buildsRes, diggingRes] = await Promise.allSettled([
      fetch('data/spawners.json'),
      fetch('data/builds.json'),
      fetch('data/digging.json'),
    ]);

    let spawners = null, builds = null, digging = null;

    if (spawnerRes.status === 'fulfilled' && spawnerRes.value.ok) {
      const raw = await spawnerRes.value.json();
      spawners = Array.isArray(raw) ? raw : (raw.items || []);
    }
    if (buildsRes.status === 'fulfilled' && buildsRes.value.ok) {
      const raw = await buildsRes.value.json();
      builds = Array.isArray(raw) ? raw : (raw.items || []);
    }
    if (diggingRes.status === 'fulfilled' && diggingRes.value.ok) {
      digging = await diggingRes.value.json();
    }

    renderSpawners(spawners);
    renderBuilds(builds);
    renderDigging(digging);
    buildTicker(spawners, builds, digging);

  } catch (err) {
    console.error('Failed to load market data:', err);
  }
}

// ── SMOOTH SCROLL ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── INTERSECTION OBSERVER ─────────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

window.addEventListener('DOMContentLoaded', () => {
  init().then(() => {
    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
  });
});
