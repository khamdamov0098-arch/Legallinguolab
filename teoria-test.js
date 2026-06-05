/* Teoria test — savollar Google Sheets (Test), javoblar → Teoria test otveti */
let QUESTIONS = [];
let testInitialized = false;
let currentQ = 0;
let answers = [];
let checked = [];

function teoriaGradeFromPercent(pct) {
  if (pct >= 90) return { grade: '5', label: 'Оценка: 5 — Отлично', cls: 'grade-5' };
  if (pct >= 75) return { grade: '4', label: 'Оценка: 4 — Хорошо', cls: 'grade-4' };
  if (pct >= 55) return { grade: '3', label: 'Оценка: 3 — Удовлетворительно', cls: 'grade-3' };
  return { grade: '2', label: 'Оценка: 2 — Неудовлетворительно', cls: 'grade-2' };
}

function resetTestState() {
  currentQ = 0;
  answers = new Array(QUESTIONS.length).fill(-1);
  checked = new Array(QUESTIONS.length).fill(false);
  document.getElementById('testResult').classList.remove('show');
  const st = document.getElementById('saveStatus');
  if (st) { st.textContent = ''; st.className = 'save-status'; }
  const btn = document.getElementById('btnSave');
  if (btn) { btn.disabled = false; btn.textContent = 'Сохранить результат'; }
}

async function initTest() {
  const container = document.getElementById('questionsContainer');
  if (!container) return;

  container.innerHTML = '<p style="text-align:center;padding:2.5rem;color:#666;font-family:Raleway,sans-serif;">Загрузка вопросов из Google Sheets…</p>';

  if (typeof isBackendReady !== 'function' || !isBackendReady()) {
    container.innerHTML = '<p class="save-status err" style="padding:2rem;">Подключите URL Apps Script в файле <b>nav.js</b> (SCRIPT_URL).</p>';
    return;
  }

  try {
    const res = await fetch(SCRIPT_URL + '?action=getTeoriaTest');
    const data = await res.json();
    if (!data.ok || !data.questions || !data.questions.length) {
      throw new Error(data.error || 'В листе Test нет вопросов');
    }
    QUESTIONS = data.questions;
    testInitialized = true;
    resetTestState();
    renderAllQuestions();
    showQuestion(0);
    const meta = document.getElementById('testMetaDesc');
    if (meta) meta.textContent = QUESTIONS.length + ' вопросов · Результат сохраняется в «Teoria test otveti»';
  } catch (e) {
    container.innerHTML = '<p class="save-status err" style="padding:2rem;">Ошибка: ' + e.message + '<br><br>Проверьте лист <b>Test</b> (колонки: Savol, A–D variant, To\'g\'ri javob).</p>';
  }
}

function renderAllQuestions() {
  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';
  const letters = ['А', 'Б', 'В', 'Г'];

  QUESTIONS.forEach((q, i) => {
    const block = document.createElement('div');
    block.className = 'question-block' + (i === 0 ? ' active' : '');
    block.id = 'qblock-' + i;

    const optsHTML = q.opts.map((o, j) => `
      <li class="option-item" data-idx="${j}" onclick="selectOption(${i}, ${j})">
        <span class="option-letter">${letters[j] || '?'}</span>
        <span>${o}</span>
      </li>`).join('');

    const last = i === QUESTIONS.length - 1;
    block.innerHTML = `
      <p class="q-counter">Вопрос ${i + 1} из ${QUESTIONS.length}</p>
      <p class="q-text">${q.q}</p>
      <ul class="options-list" id="opts-${i}">${optsHTML}</ul>
      <div class="q-feedback" id="fb-${i}"></div>
      <div class="test-nav">
        <button class="btn-check" id="btnCheck-${i}" onclick="checkAnswer(${i})" disabled>Проверить</button>
        <button class="btn-next" id="btnNext-${i}" onclick="goNext(${i})">${last ? 'Завершить тест' : 'Следующий →'}</button>
      </div>`;
    container.appendChild(block);
  });
}

function showQuestion(i) {
  document.querySelectorAll('.question-block').forEach(b => b.classList.remove('active'));
  const block = document.getElementById('qblock-' + i);
  if (block) block.classList.add('active');
  const pct = QUESTIONS.length ? Math.round(((i + 1) / QUESTIONS.length) * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
}

function selectOption(qIdx, optIdx) {
  if (checked[qIdx]) return;
  answers[qIdx] = optIdx;
  document.querySelectorAll('#opts-' + qIdx + ' .option-item').forEach(el => el.classList.remove('selected'));
  const el = document.querySelector('#opts-' + qIdx + ' [data-idx="' + optIdx + '"]');
  if (el) el.classList.add('selected');
  document.getElementById('btnCheck-' + qIdx).disabled = false;
}

function checkAnswer(qIdx) {
  if (checked[qIdx]) return;
  checked[qIdx] = true;
  const q = QUESTIONS[qIdx];
  const chosen = answers[qIdx];
  const fb = document.getElementById('fb-' + qIdx);
  const letters = ['А', 'Б', 'В', 'Г'];

  document.querySelectorAll('#opts-' + qIdx + ' .option-item').forEach(el => {
    const idx = parseInt(el.dataset.idx, 10);
    if (idx === q.ans) el.classList.add('correct');
    else if (idx === chosen && chosen !== q.ans) el.classList.add('wrong');
  });

  if (chosen === q.ans) {
    fb.className = 'q-feedback show ok';
    fb.textContent = '✓ Верно!';
  } else {
    fb.className = 'q-feedback show err';
    fb.textContent = '✗ Неверно. Правильный ответ: ' + (letters[q.ans] || '') + '.';
  }

  document.getElementById('btnCheck-' + qIdx).disabled = true;
  document.getElementById('btnNext-' + qIdx).classList.add('visible');
}

function goNext(qIdx) {
  if (!checked[qIdx]) { checkAnswer(qIdx); return; }
  if (qIdx < QUESTIONS.length - 1) {
    currentQ = qIdx + 1;
    showQuestion(currentQ);
  } else {
    showResult();
  }
}

function getScore() {
  const correct = answers.filter((a, i) => a === QUESTIONS[i].ans).length;
  const total = QUESTIONS.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return { correct, total, pct };
}

function showResult() {
  document.querySelectorAll('.question-block').forEach(b => b.classList.remove('active'));
  document.getElementById('progressBar').style.width = '100%';

  const { correct, total, pct } = getScore();
  const g = teoriaGradeFromPercent(pct);

  document.getElementById('resultScore').innerHTML = correct + ' <span>/ ' + total + '</span>';
  document.getElementById('resultLabel').textContent = 'Правильных ответов: ' + correct + ' из ' + total + ' (' + pct + '%)';
  document.getElementById('resultGrade').textContent = g.label;
  document.getElementById('resultGrade').className = 'result-grade ' + g.cls;
  document.getElementById('testResult').classList.add('show');

  const user = JSON.parse(localStorage.getItem('lll_user') || 'null');
  const nameInp = document.getElementById('saveNameInput');
  const groupInp = document.getElementById('saveGroupInput');
  if (user && nameInp && groupInp) {
    nameInp.value = user.name || '';
    groupInp.value = user.group || '';
    nameInp.readOnly = true;
    groupInp.readOnly = true;
  }
}

function retryTest() {
  testInitialized = false;
  QUESTIONS = [];
  initTest();
}

async function saveResult() {
  const user = JSON.parse(localStorage.getItem('lll_user') || 'null');
  const status = document.getElementById('saveStatus');
  const btn = document.getElementById('btnSave');

  if (!user) {
    status.className = 'save-status err';
    status.textContent = 'Войдите в систему, чтобы сохранить результат.';
    return;
  }

  if (!QUESTIONS.length) {
    status.className = 'save-status err';
    status.textContent = 'Сначала пройдите тест.';
    return;
  }

  const { correct, total, pct } = getScore();
  const g = teoriaGradeFromPercent(pct);
  const letters = ['A', 'B', 'C', 'D'];
  const answersLine = answers.map((a, i) => (i + 1) + '-' + (a >= 0 ? letters[a] : '—')).join(', ');

  btn.disabled = true;
  btn.textContent = 'Сохранение...';
  status.className = 'save-status';
  status.textContent = '';

  try {
    if (!isBackendReady()) throw new Error('SCRIPT_URL не настроен');

    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submitTeoriaTest',
        name: user.name,
        group: user.group,
        telefon: user.telefon || '',
        correct: correct,
        total: total,
        percent: pct,
        grade: g.grade,
        answersLine: answersLine
      })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Ошибка сервера');

    status.className = 'save-status ok';
    status.textContent = '✓ Результат сохранён в лист «Teoria test otveti»!';
    btn.textContent = 'Сохранено ✓';
  } catch (e) {
    status.className = 'save-status err';
    status.textContent = 'Ошибка: ' + e.message;
    btn.textContent = 'Сохранить результат';
    btn.disabled = false;
  }
}
