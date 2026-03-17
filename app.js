
// =================== DAILY MOTIVATION ===================
const MOTIVATIONS = [
  "כל יום שאתה מתמיד הוא ניצחון קטן 🏆",
  "הגוף משיג מה שהמוח מאמין בו 💡",
  "אתה חזק יותר ממה שאתה חושב 💪",
  "ההרגל של היום הוא הגוף של מחר 🌱",
  "כל צעד קטן מקרב אותך ליעד 👣",
  "אל תשווה את עצמך לאחרים — השווה לאתמול שלך 🔄",
  "המסע מתחיל בצעד אחד 🚀",
  "עקביות מנצחת שלמות בכל פעם ✅",
  "הכאב של היום הוא הכוח של מחר 🔥",
  "אתה לא מפסיד — אתה לומד 📚",
  "הגוף שלך שומע את כל מה שאתה אומר לו — דבר יפה 🌟",
  "שינוי אמיתי לוקח זמן. תן לו זמן ⏳",
  "המוטיבציה מתחילה אותך, ההרגל ממשיך אותך 🎯",
  "כל ארוחה טובה היא השקעה בגוף שלך 🥗",
  "קל לוותר — קשה להצטער. בחר נכון 💎",
  "אתה כבר עשית את הצעד הכי קשה — להתחיל 🎉",
  "גאוה אמיתית היא להסתכל אחורה ולראות כמה עברת 🌅",
  "הגוף שלך הוא הבית שלך — תשמור עליו 🏠",
  "מה שנמדד — משתפר 📊",
  "השינוי לא קורה בחדר כושר — הוא קורה במטבח ובמוח 🧠",
  "יום אחד לא מחליף כלום. כל הימים ביחד — מחליפים הכל 📅",
  "תתמקד בתהליך, לא רק בתוצאה 🎯",
  "כל 'לא' לפינוק מיותר הוא 'כן' ליעד שלך ✋",
  "הגוף מגיב לאיך שאתה מתייחס אליו 💚",
  "אל תמתין ליום המושלם — התחל היום 📆",
  "הדרך הטובה ביותר לחזות את העתיד היא לבנות אותו 🔨",
  "כוח רצון הוא כמו שריר — מתחזק עם שימוש 💪",
  "תאכל כדי לחיות, אל תחיה כדי לאכול 🍎",
  "כל פעם שאתה בוחר נכון — אתה מחזק את הגרסה הטובה של עצמך ⭐",
  "הצלחה היא סכום של מאמצים קטנים שחוזרים על עצמם 🔁",
];

function getDailyMotivation() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return MOTIVATIONS[dayOfYear % MOTIVATIONS.length];
}

// =================== UTILS ===================
function today() {
  return new Date().toISOString().split('T')[0];
}
function formatDate(d) {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}
function weekOf(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return mon.toISOString().split('T')[0];
}
function showToast(msg = '✓ נשמר בהצלחה!') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
function scoreEmoji(s) {
  if (s >= 9) return '🔥';
  if (s >= 7) return '😊';
  if (s >= 5) return '😐';
  if (s >= 3) return '😕';
  return '😞';
}

// =================== TABS ===================
function switchTab(name) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  const tabs = ['today','weekly','measurements','charts','history','goals'];
  const idx = tabs.indexOf(name);
  document.querySelectorAll('.tab-btn')[idx]?.classList.add('active');
  // bottom nav: today/weekly/measurements/charts/goals = indices 0-4 in nav
  const navMap = {today:0, weekly:1, measurements:2, charts:3, goals:4};
  if (navMap[name] !== undefined) document.querySelectorAll('.nav-item')[navMap[name]]?.classList.add('active');
  render();
}

function updateScore(v) {
  document.getElementById('score-val').textContent = v;
}

// =================== WEIGHT (בוקר) ===================
function addWeight() {
  const date = document.getElementById('weight-date').value;
  const val = parseFloat(document.getElementById('weight-input').value);
  if (!date || isNaN(val) || val < 20 || val > 500) {
    alert('אנא הזן תאריך ומשקל תקין'); return;
  }
  const {weights} = getData();
  const existing = weights.findIndex(w => w.date === date);
  if (existing >= 0) {
    if (!confirm('כבר קיים ערך לתאריך זה. להחליף?')) return;
    weights[existing] = { ...weights[existing], date, weight: val };
  } else {
    weights.push({ date, weight: val, score: null });
  }
  weights.sort((a,b) => a.date.localeCompare(b.date));
  saveData('weights', weights);
  showToast('☀️ משקל נשמר!');
  render();
}

// =================== SCORE (ערב) ===================
function addScore() {
  const date = document.getElementById('score-date').value;
  const score = parseInt(document.getElementById('score-input').value);
  if (!date) { alert('אנא בחר תאריך'); return; }
  const {weights} = getData();
  const existing = weights.findIndex(w => w.date === date);
  if (existing >= 0) {
    weights[existing] = { ...weights[existing], score };
  } else {
    // ציון בלי משקל — שמור עם משקל null
    weights.push({ date, weight: null, score });
    weights.sort((a,b) => a.date.localeCompare(b.date));
  }
  saveData('weights', weights);
  showToast('🌙 ציון נשמר!');
  render();
}

// =================== MEASUREMENTS ===================
function addMeasurement() {
  const date = document.getElementById('meas-date').value;
  const waist = parseFloat(document.getElementById('meas-waist').value) || null;
  const chest = parseFloat(document.getElementById('meas-chest').value) || null;
  const armR = parseFloat(document.getElementById('meas-arm-r').value) || null;
  const armL = parseFloat(document.getElementById('meas-arm-l').value) || null;
  if (!date) { alert('אנא בחר תאריך'); return; }
  if (!waist && !chest && !armR && !armL) { alert('אנא הזן לפחות מידה אחת'); return; }
  const {measurements} = getData();
  const existing = measurements.findIndex(m => m.date === date);
  const entry = {date, waist, chest, armR, armL};
  if (existing >= 0) {
    if (!confirm('כבר קיים מדידה לתאריך זה. להחליף?')) return;
    measurements[existing] = entry;
  } else {
    measurements.push(entry);
  }
  measurements.sort((a,b) => a.date.localeCompare(b.date));
  saveData('measurements', measurements);
  showToast('📏 מידות נשמרו!');
  render();
}

// =================== GOALS ===================
function saveGoals() {
  const start = parseFloat(document.getElementById('goal-start').value);
  const target = parseFloat(document.getElementById('goal-target').value);
  if (isNaN(start) || isNaN(target)) { alert('אנא הזן משקל התחלתי ויעד'); return; }
  saveData('goals', {start, target});
  showToast('🎯 יעדים נשמרו!');
  renderGoals();
}

// =================== DELETE PROTECTION ===================
function openDeleteAllModal() {
  document.getElementById('delete-confirm-input').value = '';
  const btn = document.getElementById('btn-confirm-delete');
  btn.disabled = true;
  btn.style.opacity = '0.4';
  document.getElementById('modal-delete-all').classList.add('open');
}
function checkDeleteConfirm() {
  const val = document.getElementById('delete-confirm-input').value.trim();
  const btn = document.getElementById('btn-confirm-delete');
  const ok  = val === 'מחק';
  btn.disabled = !ok;
  btn.style.opacity = ok ? '1' : '0.4';
}
function executeDeleteAll() {
  closeModal('modal-delete-all');
  saveData('weights', []);
  saveData('measurements', []);
  saveData('goals', {});
  showToast('🗑️ כל הנתונים נמחקו');
  render();
}

// =================== MODAL HELPERS ===================
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// =================== EDIT WEIGHT ===================
function openEditWeight(dateStr) {
  const {weights} = getData();
  const entry = weights.find(w => w.date === dateStr);
  if (!entry) return;
  document.getElementById('edit-weight-orig-date').value = dateStr;
  document.getElementById('edit-weight-date').value      = entry.date;
  document.getElementById('edit-weight-val').value       = entry.weight;
  const score = entry.score || 5;
  document.getElementById('edit-score-input').value      = score;
  document.getElementById('edit-score-val').textContent  = score;
  document.getElementById('modal-edit-weight').classList.add('open');
}
function saveEditWeight() {
  const origDate = document.getElementById('edit-weight-orig-date').value;
  const newDate  = document.getElementById('edit-weight-date').value;
  const newVal   = parseFloat(document.getElementById('edit-weight-val').value);
  const newScore = parseInt(document.getElementById('edit-score-input').value);
  if (!newDate || isNaN(newVal) || newVal < 20 || newVal > 500) {
    alert('אנא הזן תאריך ומשקל תקין'); return;
  }
  const {weights} = getData();
  const idx = weights.findIndex(w => w.date === origDate);
  if (idx < 0) return;
  // if date changed, check no conflict
  if (newDate !== origDate && weights.find(w => w.date === newDate)) {
    if (!confirm('כבר קיים ערך לתאריך החדש. להחליף?')) return;
    weights.splice(weights.findIndex(w => w.date === newDate), 1);
  }
  weights[idx] = { date: newDate, weight: newVal, score: newScore };
  weights.sort((a,b) => a.date.localeCompare(b.date));
  saveData('weights', weights);
  closeModal('modal-edit-weight');
  showToast('✏️ רשומה עודכנה!');
  render();
}

// =================== DELETE SINGLE WEIGHT ===================
function deleteWeight(dateStr) {
  if (!confirm(`למחוק את הרשומה מתאריך ${formatDate(dateStr)}?`)) return;
  const {weights} = getData();
  const filtered = weights.filter(w => w.date !== dateStr);
  saveData('weights', filtered);
  showToast('🗑️ רשומה נמחקה');
  render();
}

// =================== EDIT MEASUREMENT ===================
function openEditMeas(dateStr) {
  const {measurements} = getData();
  const entry = measurements.find(m => m.date === dateStr);
  if (!entry) return;
  document.getElementById('edit-meas-orig-date').value  = dateStr;
  document.getElementById('edit-meas-date').value       = entry.date;
  document.getElementById('edit-meas-waist').value      = entry.waist || '';
  document.getElementById('edit-meas-chest').value      = entry.chest || '';
  document.getElementById('edit-meas-armR').value       = entry.armR  || '';
  document.getElementById('edit-meas-armL').value       = entry.armL  || '';
  document.getElementById('modal-edit-meas').classList.add('open');
}
function saveEditMeas() {
  const origDate = document.getElementById('edit-meas-orig-date').value;
  const newDate  = document.getElementById('edit-meas-date').value;
  const waist    = parseFloat(document.getElementById('edit-meas-waist').value) || null;
  const chest    = parseFloat(document.getElementById('edit-meas-chest').value) || null;
  const armR     = parseFloat(document.getElementById('edit-meas-armR').value)  || null;
  const armL     = parseFloat(document.getElementById('edit-meas-armL').value)  || null;
  if (!newDate) { alert('אנא בחר תאריך'); return; }
  const {measurements} = getData();
  const idx = measurements.findIndex(m => m.date === origDate);
  if (idx < 0) return;
  if (newDate !== origDate && measurements.find(m => m.date === newDate)) {
    if (!confirm('כבר קיים מדידה לתאריך החדש. להחליף?')) return;
    measurements.splice(measurements.findIndex(m => m.date === newDate), 1);
  }
  measurements[idx] = { date: newDate, waist, chest, armR, armL };
  measurements.sort((a,b) => a.date.localeCompare(b.date));
  saveData('measurements', measurements);
  closeModal('modal-edit-meas');
  showToast('✏️ מידות עודכנו!');
  render();
}

// =================== EXPORT / IMPORT ===================
function exportData() {
  const data = getData();
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    weights:      data.weights,
    measurements: data.measurements,
    goals:        data.goals
  };
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const date = new Date().toISOString().split('T')[0];
  const a    = document.createElement('a');
  a.href = url; a.download = `weight-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('💾 גיבוי הורד בהצלחה!');
}
async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = '';
  const text = await file.text();
  let backup;
  try { backup = JSON.parse(text); }
  catch(e) { alert('❌ הקובץ אינו תקין'); return; }
  if (!backup.weights || !Array.isArray(backup.weights)) {
    alert('❌ קובץ הגיבוי לא תקין'); return;
  }
  const count     = backup.weights.length;
  const measCount = (backup.measurements || []).length;
  const dateStr   = backup.exportedAt ? backup.exportedAt.split('T')[0] : 'לא ידוע';
  if (!confirm(`⬆️ ייבוא גיבוי מ-${dateStr}\n\n${count} מדידות משקל, ${measCount} מדידות מידות.\n\nיחליף את כל הנתונים הקיימים. להמשיך?`)) return;
  await saveData('weights',      backup.weights      || []);
  await saveData('measurements', backup.measurements || []);
  await saveData('goals',        backup.goals        || {});
  showToast(`✅ יובאו ${count} רשומות!`);
  render();
}

// =================== RENDER ===================
let weightChart = null;

function render() {
  const data = getData();

  // Header greeting + date + motivation
  const now = new Date();
  const hour = now.getHours();
  const days = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
  const months = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];

  const firstName = currentUser?.displayName?.split(' ')[0] || '';
  let greeting;
  if (hour >= 5  && hour < 12) greeting = `☀️ בוקר טוב${firstName ? ', ' + firstName : ''}!`;
  else if (hour >= 12 && hour < 17) greeting = `🌤️ צהריים טובים${firstName ? ', ' + firstName : ''}!`;
  else if (hour >= 17 && hour < 21) greeting = `🌆 ערב טוב${firstName ? ', ' + firstName : ''}!`;
  else                               greeting = `🌙 לילה טוב${firstName ? ', ' + firstName : ''}!`;

  document.getElementById('header-greeting').textContent = greeting;
  document.getElementById('header-date').textContent = `יום ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  document.getElementById('daily-motivation').textContent = getDailyMotivation();

  // Set default dates
  document.getElementById('weight-date').value = document.getElementById('weight-date').value || today();
  document.getElementById('meas-date').value = document.getElementById('meas-date').value || today();
  document.getElementById('score-date').value = document.getElementById('score-date').value || today();

  renderStats(data);
  renderWeightChart(data);
  renderWeekly(data);
  renderMeasurements(data);
  renderHistory(data);
  renderGoals(data);
  renderCharts(data);
}

function renderStats(data) {
  const {weights} = data;
  if (!weights.length) return;

  // רק רשומות עם משקל
  const withWeight = weights.filter(w => w.weight != null);
  if (withWeight.length) {
    const last = withWeight[withWeight.length - 1];
    document.getElementById('stat-current').textContent = last.weight.toFixed(1);

    // Weekly diff
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    const weekOld = withWeight.filter(w => w.date <= weekAgoStr);
    if (weekOld.length) {
      const oldW = weekOld[weekOld.length-1].weight;
      const diff = last.weight - oldW;
      const el = document.getElementById('stat-diff');
      el.textContent = (diff > 0 ? '+' : '') + diff.toFixed(1);
      el.style.color = diff <= 0 ? 'var(--accent)' : 'var(--danger)';
    }
  }

  // Weekly score avg (כולל רשומות עם ציון בלבד)
  const weekStart = weekOf(today());
  const thisWeek = weights.filter(w => weekOf(w.date) === weekStart && w.score);
  if (thisWeek.length) {
    const avg = thisWeek.reduce((s,w) => s + w.score, 0) / thisWeek.length;
    document.getElementById('stat-score-avg').textContent = avg.toFixed(1);
  }
}

function renderWeightChart(data) {
  const {weights} = data;
  const ctx = document.getElementById('weight-chart');
  if (!ctx) return;
  const last14 = weights.filter(w => w.weight != null).slice(-14);
  if (last14.length < 2) {
    ctx.style.display = 'none'; return;
  }
  ctx.style.display = 'block';

  const isLight = document.body.classList.contains('light');
  const accentColor = isLight ? '#059669' : '#6ee7b7';
  const gridColor = isLight ? '#cdd5e0' : '#2a2f40';
  const tickColor = '#64748b';
  const fillColor = isLight ? 'rgba(5,150,105,0.08)' : 'rgba(110,231,183,0.08)';

  const labels = last14.map(w => formatDate(w.date));
  const vals = last14.map(w => w.weight);
  const min = Math.min(...vals) - 0.5;
  const max = Math.max(...vals) + 0.5;

  if (weightChart) weightChart.destroy();
  weightChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: vals,
        borderColor: accentColor,
        backgroundColor: fillColor,
        borderWidth: 2.5,
        pointBackgroundColor: accentColor,
        pointRadius: 4,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: tickColor, font: { size: 9 }, maxRotation: 45 },
          grid: { color: gridColor }
        },
        y: {
          min, max,
          ticks: { color: tickColor, font: { family: 'Space Mono', size: 10 } },
          grid: { color: gridColor }
        }
      }
    }
  });
}

function renderWeekly(data) {
  const {weights} = data;
  const container = document.getElementById('weekly-list');
  if (!weights.length) return;

  // Group by week
  const weeks = {};
  weights.forEach(w => {
    const wk = weekOf(w.date);
    if (!weeks[wk]) weeks[wk] = [];
    weeks[wk].push(w);
  });

  const weekKeys = Object.keys(weeks).sort().reverse();
  if (weekKeys.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><p>עוד אין נתונים שבועיים.</p></div>';
    return;
  }

  container.innerHTML = weekKeys.map(wk => {
    const entries = weeks[wk];
    const avgWeight = entries.reduce((s,e) => s + e.weight, 0) / entries.length;
    const scoredEntries = entries.filter(e => e.score);
    const avgScore = scoredEntries.length ? scoredEntries.reduce((s,e) => s + e.score, 0) / scoredEntries.length : null;

    const wkEnd = new Date(wk); wkEnd.setDate(wkEnd.getDate() + 6);
    const wkStr = `${formatDate(wk)} — ${formatDate(wkEnd.toISOString().split('T')[0])}`;

    const dots = avgScore ? Array.from({length:10}, (_,i) =>
      `<div class="dot ${i < Math.round(avgScore) ? 'filled' : ''}"></div>`
    ).join('') : '';

    return `<div class="week-card">
      <div class="week-header">
        <div>
          <div class="week-title">${wkStr}</div>
          <div style="font-size:0.72rem;color:var(--text-muted)">${entries.length} מדידות</div>
        </div>
        <div class="week-avg">${avgWeight.toFixed(1)} ק"ג</div>
      </div>
      ${avgScore ? `
        <div class="week-row">
          <span>ציון שבועי: ${scoreEmoji(avgScore)} ${avgScore.toFixed(1)}/10</span>
        </div>
        <div class="score-dots">${dots}</div>
      ` : ''}
    </div>`;
  }).join('');
}

function renderMeasurements(data) {
  const {measurements} = data;
  const container = document.getElementById('measurements-list');
  if (!measurements.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📏</div><p>עוד לא הוספת מידות.<br>מומלץ למדוד פעם בשבועיים.</p></div>';
    return;
  }
  const sorted = [...measurements].reverse();
  container.innerHTML = sorted.map(m => `
    <div class="card" style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-weight:700;font-size:0.9rem">${formatDate(m.date)}</div>
        <button class="btn-edit" onclick="openEditMeas('${m.date}')">✏️ עריכה</button>
      </div>
      <div class="meas-grid">
        ${m.waist ? `<div class="meas-item"><div class="meas-label">⭕ מותניים</div><div class="meas-val">${m.waist} ס"מ</div></div>` : ''}
        ${m.chest ? `<div class="meas-item"><div class="meas-label">💪 חזה</div><div class="meas-val">${m.chest} ס"מ</div></div>` : ''}
        ${m.armR  ? `<div class="meas-item"><div class="meas-label">💪 יד ימין</div><div class="meas-val">${m.armR} ס"מ</div></div>` : ''}
        ${m.armL  ? `<div class="meas-item"><div class="meas-label">💪 יד שמאל</div><div class="meas-val">${m.armL} ס"מ</div></div>` : ''}
      </div>
    </div>
  `).join('');
}

function renderHistory(data) {
  const {weights} = data;
  const container = document.getElementById('history-list');
  if (!weights.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🗂️</div><p>עוד אין רשומות.</p></div>';
    return;
  }
  const sorted = [...weights].reverse();
  container.innerHTML = '<div class="entry-list">' + sorted.map(w => `
    <div class="entry-item">
      <div class="entry-meta">
        <div style="font-weight:600;font-size:0.88rem">${formatDate(w.date)}</div>
        ${w.score ? `<div style="font-size:0.75rem;color:var(--text-muted)">${scoreEmoji(w.score)} ציון: ${w.score}/10</div>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        <div class="entry-val">${w.weight != null ? w.weight.toFixed(1) + ' ק"ג' : '— ק"ג'}</div>
        <button class="btn-edit" onclick="openEditWeight('${w.date}')">✏️</button>
        <button class="btn-delete-entry" onclick="deleteWeight('${w.date}')">🗑️</button>
      </div>
    </div>
  `).join('') + '</div>';
}

function renderGoals(data) {
  if (!data) data = getData();
  const {goals, weights} = data;

  // Fill inputs
  if (goals.start) document.getElementById('goal-start').value = goals.start;
  if (goals.target) document.getElementById('goal-target').value = goals.target;

  const section = document.getElementById('goal-progress-section');
  if (!goals.start || !goals.target || !weights.length) {
    section.style.display = 'none'; return;
  }
  section.style.display = 'block';

  const current = weights[weights.length-1].weight;
  const total = goals.start - goals.target;
  const done = goals.start - current;
  const pct = total > 0 ? Math.min(100, Math.max(0, (done / total) * 100)) : 0;

  document.getElementById('goal-banner-text').textContent =
    `${done.toFixed(1)} ק"ג ירדת מתוך ${total.toFixed(1)} ק"ג`;
  document.getElementById('goal-banner-sub').textContent =
    `נשאר ${Math.max(0, (current - goals.target)).toFixed(1)} ק"ג ליעד ${scoreEmoji(Math.round(pct/10))}`;

  document.getElementById('goal-details').innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.8rem">
      <span style="color:var(--text-muted)">התחלה: <b style="color:var(--text)">${goals.start} ק"ג</b></span>
      <span style="color:var(--text-muted)">עכשיו: <b style="color:var(--accent)">${current.toFixed(1)} ק"ג</b></span>
      <span style="color:var(--text-muted)">יעד: <b style="color:var(--accent3)">${goals.target} ק"ג</b></span>
    </div>
    <div class="prog-bar">
      <div class="prog-fill" style="width:${pct}%"></div>
    </div>
    <div style="text-align:left;font-family:'Space Mono',monospace;font-size:0.8rem;color:var(--accent2);margin-top:6px">${pct.toFixed(0)}%</div>
  `;
}

// =================== CHARTS STATE ===================
let chartRange = 30;
let activeMeasLines = { waist: true, chest: true, armR: true, armL: true };
let trendChartInst = null, dowChartInst = null, measChartInst = null, scoreChartInst = null;

function setChartRange(days, btn) {
  chartRange = days;
  document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCharts(getData());
}

function toggleMeasLine(key, btn) {
  activeMeasLines[key] = !activeMeasLines[key];
  btn.classList.toggle('active', activeMeasLines[key]);
  renderMeasChart(getData());
}

function getColors() {
  const light = document.body.classList.contains('light');
  return {
    accent:  light ? '#059669' : '#6ee7b7',
    accent2: light ? '#6366f1' : '#818cf8',
    accent3: light ? '#db2777' : '#f472b6',
    accent4: light ? '#d97706' : '#fbbf24',
    danger:  light ? '#dc2626' : '#f87171',
    grid:    light ? '#cdd5e0' : '#2a2f40',
    tick:    '#64748b',
    bg:      light ? '#f0f4f8' : '#0d0f14',
  };
}

function filterByRange(weights) {
  const withWeight = weights.filter(w => w.weight != null);
  if (!chartRange) return withWeight;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - chartRange);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  return withWeight.filter(w => w.date >= cutoffStr);
}

function renderCharts(data) {
  if (!document.getElementById('tab-charts').classList.contains('active')) return;
  renderTrendChart(data);
  renderDowChart(data);
  renderMeasChart(data);
  renderScoreChart(data);
}

// ---- Chart 1: Weight trend ----
function renderTrendChart(data) {
  const c = getColors();
  const filtered = filterByRange(data.weights);
  const ctx = document.getElementById('trend-chart');
  if (!ctx) return;

  if (filtered.length < 2) {
    ctx.closest('.card').querySelector('#trend-insight').textContent = 'צריך לפחות 2 מדידות בטווח הנבחר';
    if (trendChartInst) { trendChartInst.destroy(); trendChartInst = null; }
    return;
  }

  const labels = filtered.map(w => formatDate(w.date));
  const vals   = filtered.map(w => w.weight);

  // Trendline (linear regression)
  const n = vals.length;
  const sumX = vals.reduce((_,__,i) => _ + i, 0);
  const sumY = vals.reduce((s,v) => s + v, 0);
  const sumXY = vals.reduce((s,v,i) => s + i*v, 0);
  const sumX2 = vals.reduce((s,_,i) => s + i*i, 0);
  const slope = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX);
  const intercept = (sumY - slope*sumX) / n;
  const trendVals = vals.map((_,i) => +(intercept + slope*i).toFixed(2));

  const minY = Math.min(...vals, ...trendVals) - 0.5;
  const maxY = Math.max(...vals, ...trendVals) + 0.5;

  if (trendChartInst) trendChartInst.destroy();
  trendChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'משקל',
          data: vals,
          borderColor: c.accent,
          backgroundColor: c.accent + '15',
          borderWidth: 2,
          pointRadius: vals.length > 30 ? 2 : 4,
          pointBackgroundColor: c.accent,
          tension: 0.3,
          fill: true,
          order: 1
        },
        {
          label: 'מגמה',
          data: trendVals,
          borderColor: c.accent4,
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          tension: 0,
          fill: false,
          order: 2
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: c.tick, font: { family: 'Heebo', size: 11 }, boxWidth: 16 }
        }
      },
      scales: {
        x: { ticks: { color: c.tick, font: { size: 9 }, maxRotation: 45, maxTicksLimit: 10 }, grid: { color: c.grid } },
        y: { min: minY, max: maxY, ticks: { color: c.tick, font: { family: 'Space Mono', size: 10 } }, grid: { color: c.grid } }
      }
    }
  });

  // Insight
  const totalChange = vals[vals.length-1] - vals[0];
  const perWeek = (slope * 7).toFixed(2);
  const insightEl = document.getElementById('trend-insight');
  const dir = totalChange < 0 ? '📉' : '📈';
  insightEl.className = 'chart-insight' + (totalChange > 0 ? ' warn' : '');
  insightEl.innerHTML = `${dir} שינוי כולל בטווח: <b>${totalChange > 0 ? '+' : ''}${totalChange.toFixed(1)} ק"ג</b> | קצב: <b>${perWeek > 0 ? '+' : ''}${perWeek} ק"ג/שבוע</b>`;
}

// ---- Chart 2: Day-of-week avg weight ----
function renderDowChart(data) {
  const c = getColors();
  const filtered = filterByRange(data.weights);
  const ctx = document.getElementById('dayofweek-chart');
  if (!ctx) return;

  const dayNames = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
  const buckets = Array.from({length:7}, () => []);
  filtered.forEach(w => {
    const d = new Date(w.date).getDay();
    buckets[d].push(w.weight);
  });
  const avgs = buckets.map(b => b.length ? +(b.reduce((s,v)=>s+v,0)/b.length).toFixed(2) : null);
  const validAvgs = avgs.filter(v => v !== null);

  if (validAvgs.length < 2) {
    document.getElementById('hardday-insight').textContent = 'צריך נתונים ממספר ימים שונים בשבוע';
    if (dowChartInst) { dowChartInst.destroy(); dowChartInst = null; }
    return;
  }

  const globalAvg = validAvgs.reduce((s,v)=>s+v,0)/validAvgs.length;
  const bgColors = avgs.map(v => v === null ? c.grid :
    v > globalAvg + 0.3 ? c.danger + 'cc' :
    v < globalAvg - 0.3 ? c.accent + 'cc' : c.accent2 + 'cc'
  );

  if (dowChartInst) dowChartInst.destroy();
  dowChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dayNames,
      datasets: [{
        label: 'ממוצע משקל',
        data: avgs,
        backgroundColor: bgColors,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: c.tick, font: { family: 'Heebo', size: 10 } }, grid: { display: false } },
        y: {
          min: Math.min(...validAvgs) - 1,
          max: Math.max(...validAvgs) + 1,
          ticks: { color: c.tick, font: { family: 'Space Mono', size: 10 } },
          grid: { color: c.grid }
        }
      }
    }
  });

  // Find hardest day
  const maxAvg = Math.max(...validAvgs);
  const hardDayIdx = avgs.indexOf(maxAvg);
  const minAvg = Math.min(...validAvgs);
  const easyDayIdx = avgs.indexOf(minAvg);
  const insightEl = document.getElementById('hardday-insight');
  insightEl.className = 'chart-insight warn';
  insightEl.innerHTML = `⚠️ יום <b>${dayNames[hardDayIdx]}</b> — ממוצע המשקל הגבוה ביותר (${maxAvg.toFixed(1)}). שים עליו דגש! ✅ יום <b>${dayNames[easyDayIdx]}</b> — הכי קל לך (${minAvg.toFixed(1)})`;
}

// ---- Chart 3: Measurements trend ----
function renderMeasChart(data) {
  const c = getColors();
  const ctx = document.getElementById('meas-chart');
  if (!ctx) return;
  const meas = data.measurements;

  if (meas.length < 2) {
    document.getElementById('meas-insight').textContent = 'צריך לפחות 2 מדידות מידות';
    if (measChartInst) { measChartInst.destroy(); measChartInst = null; }
    return;
  }

  const measConfig = {
    waist: { label: 'מותניים', color: c.accent },
    chest: { label: 'חזה',     color: c.accent2 },
    armR:  { label: 'יד ימין', color: c.accent3 },
    armL:  { label: 'יד שמאל', color: c.accent4 },
  };

  const labels = meas.map(m => formatDate(m.date));
  const datasets = Object.entries(measConfig)
    .filter(([key]) => activeMeasLines[key])
    .map(([key, cfg]) => ({
      label: cfg.label,
      data: meas.map(m => m[key] || null),
      borderColor: cfg.color,
      backgroundColor: cfg.color + '15',
      borderWidth: 2.5,
      pointRadius: 5,
      pointBackgroundColor: cfg.color,
      tension: 0.3,
      spanGaps: true,
    }));

  if (!datasets.length) return;

  if (measChartInst) measChartInst.destroy();
  measChartInst = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: c.tick, font: { family: 'Heebo', size: 11 }, boxWidth: 14 } }
      },
      scales: {
        x: { ticks: { color: c.tick, font: { size: 9 }, maxRotation: 45 }, grid: { color: c.grid } },
        y: { ticks: { color: c.tick, font: { family: 'Space Mono', size: 10 } }, grid: { color: c.grid } }
      }
    }
  });

  // Insight: show change per active line
  const insights = Object.entries(measConfig)
    .filter(([key]) => activeMeasLines[key])
    .map(([key, cfg]) => {
      const pts = meas.map(m => m[key]).filter(Boolean);
      if (pts.length < 2) return null;
      const diff = pts[pts.length-1] - pts[0];
      return `${cfg.label}: <b>${diff > 0 ? '+' : ''}${diff.toFixed(1)} ס"מ</b>`;
    }).filter(Boolean).join(' | ');
  const insightEl = document.getElementById('meas-insight');
  insightEl.className = 'chart-insight';
  insightEl.innerHTML = insights ? `📏 שינוי כולל — ${insights}` : '';
}

// ---- Chart 4: Score — daily line + weekly avg bars ----
function renderScoreChart(data) {
  const c = getColors();
  const ctx = document.getElementById('score-chart');
  if (!ctx) return;

  // Daily scores (filtered by range)
  const dailyFiltered = filterByRange(data.weights).filter(w => w.score);
  if (!dailyFiltered.length) {
    document.getElementById('score-insight').textContent = 'הזן ציונים כדי לראות את הגרף';
    if (scoreChartInst) { scoreChartInst.destroy(); scoreChartInst = null; }
    return;
  }

  // Group into weekly averages
  const weeks = {};
  dailyFiltered.forEach(w => {
    const wk = weekOf(w.date);
    if (!weeks[wk]) weeks[wk] = { scores: [], start: wk };
    weeks[wk].scores.push(w.score);
  });
  const weekKeys = Object.keys(weeks).sort();

  // Build unified daily x-axis
  const dailyLabels = dailyFiltered.map(w => formatDate(w.date));
  const dailyScores = dailyFiltered.map(w => w.score);

  // Map weekly avg back to a point on the daily x-axis (last day of each week in the filtered set)
  const weeklyBarData = dailyLabels.map(() => null);
  weekKeys.forEach(wk => {
    const avg = +(weeks[wk].scores.reduce((s,v)=>s+v,0)/weeks[wk].scores.length).toFixed(1);
    // find last index in dailyFiltered that belongs to this week
    let lastIdx = -1;
    dailyFiltered.forEach((w, i) => { if (weekOf(w.date) === wk) lastIdx = i; });
    if (lastIdx >= 0) weeklyBarData[lastIdx] = avg;
  });

  // Color bars by score level
  const barColors = weeklyBarData.map(v => v === null ? 'transparent' :
    v >= 8 ? c.accent + 'dd' :
    v >= 5 ? c.accent2 + 'dd' :
    c.danger + 'dd'
  );

  if (scoreChartInst) scoreChartInst.destroy();
  scoreChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dailyLabels,
      datasets: [
        {
          type: 'bar',
          label: 'ממוצע שבועי',
          data: weeklyBarData,
          backgroundColor: barColors,
          borderRadius: 6,
          barThickness: 18,
          order: 2,
        },
        {
          type: 'line',
          label: 'ציון יומי',
          data: dailyScores,
          borderColor: c.accent4,
          backgroundColor: c.accent4 + '20',
          borderWidth: 2,
          pointRadius: dailyScores.length > 30 ? 2 : 4,
          pointBackgroundColor: dailyScores.map(s =>
            s >= 8 ? c.accent :
            s >= 5 ? c.accent4 :
            c.danger
          ),
          pointBorderColor: 'transparent',
          tension: 0.35,
          fill: true,
          order: 1,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: { color: c.tick, font: { family: 'Heebo', size: 11 }, boxWidth: 14,
            filter: item => item.text !== 'ממוצע שבועי' || weeklyBarData.some(v => v !== null)
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              if (ctx.raw === null) return null;
              return `${ctx.dataset.label}: ${ctx.raw}/10 ${scoreEmoji(ctx.raw)}`;
            }
          },
          filter: item => item.raw !== null
        }
      },
      scales: {
        x: {
          ticks: { color: c.tick, font: { size: 9 }, maxRotation: 45, maxTicksLimit: 12 },
          grid: { display: false }
        },
        y: {
          min: 0, max: 10,
          ticks: { color: c.tick, font: { family: 'Space Mono', size: 10 }, stepSize: 2 },
          grid: { color: c.grid }
        }
      }
    }
  });

  // Insight
  const allAvgs = weekKeys.map(wk => +(weeks[wk].scores.reduce((s,v)=>s+v,0)/weeks[wk].scores.length).toFixed(1));
  const maxScore = Math.max(...allAvgs);
  const minScore = Math.min(...allAvgs);
  const minWkIdx = allAvgs.indexOf(minScore);
  const minWkLabel = weekKeys[minWkIdx] ? (() => { const [,m,d] = weekKeys[minWkIdx].split('-'); return `${d}/${m}`; })() : '';
  const insightEl = document.getElementById('score-insight');
  insightEl.className = 'chart-insight' + (minScore < 5 ? ' warn' : '');
  insightEl.innerHTML = `🔥 שבוע הכי טוב: <b>${maxScore}/10</b> ${scoreEmoji(maxScore)} &nbsp;|&nbsp; 😓 שבוע הכי קשה: <b>${minScore}/10</b> ${scoreEmoji(minScore)} (שבוע ${minWkLabel})`;
}

// =================== THEME ===================
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('wt_theme', isLight ? 'light' : 'dark');
  document.getElementById('theme-label').textContent = isLight ? 'מצב כהה' : 'מצב בהיר';
  document.querySelector('.toggle-icon').textContent = isLight ? '☀️' : '🌙';
  // Redraw charts to pick up new grid colors
  const d = getData();
  renderWeightChart(d);
  renderCharts(d);
}

// =================== INIT ===================
(function() {
  const saved = localStorage.getItem('wt_theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    const lbl = document.getElementById('theme-label');
    const ico = document.querySelector('.toggle-icon');
    if (lbl) lbl.textContent = 'מצב כהה';
    if (ico) ico.textContent = '☀️';
  }
  // render() is triggered by onSnapshot once user logs in
})();