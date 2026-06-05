// ============================================================
//  LegalLinguoLab — Google Apps Script
//  Google Sheets ID: 15C_EcEPFRrvlZwnjWf7sJ2L0g63q9R8COw-8g_YTgUI
//  Telegram bot: @LegalLinguoLab_bot
//  Telegram group: -5201165555
// ============================================================

var SS_ID     = '15C_EcEPFRrvlZwnjWf7sJ2L0g63q9R8COw-8g_YTgUI';
var BOT_TOKEN = '8944114238:AAHZyB0-jNWDaAXJTEVgkKpAmiH0iPf_EI4';
var GROUP_ID  = '-5201165555';
var ADMIN_PWD = 'legal2024admin';

// ============================================================
//  doGet  — sayt so'rovlari (register, login, getGrades, leaderboard, getKazusy)
// ============================================================
function doGet(e) {
  var action = e.parameter.action;

  if (action === 'register')    return registerUser(e.parameter.name, e.parameter.group, e.parameter.telefon);
  if (action === 'login')       return loginUser(e.parameter.telefon);
  if (action === 'getGrades')   return getGrades(e.parameter.name);
  if (action === 'leaderboard') return getLeaderboard();
  if (action === 'getKazusy')      return getKazusy();
  if (action === 'getTeoriaTest')  return getTeoriaTest();

  return json({ ok: true, msg: 'LegalLinguoLab API' });
}

// ============================================================
//  doPost — sayt so'rovlari (submitAnswer, submitKazus)
// ============================================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action === 'submitAnswer')     return submitAnswer(data);
    if (action === 'submitKazus')      return submitKazus(data);
    if (action === 'submitTeoriaTest') return submitTeoriaTest(data);

    return json({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json({ ok: false, error: err.message });
  }
}

// ============================================================
//  REGISTER
// ============================================================
function registerUser(name, group, telefon) {
  var ss     = SpreadsheetApp.openById(SS_ID);
  var sheet  = ss.getSheetByName('Студенты');
  var data   = sheet.getDataRange().getValues();

  // Tekshir: telefon allaqachon bor
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][3]) === String(telefon)) {
      return json({ ok: false, error: 'Этот номер уже зарегистрирован' });
    }
  }

  var userId = 'U' + Date.now();
  sheet.appendRow([userId, name, group, telefon, new Date()]);
  return json({ ok: true, name: name, group: group, telefon: telefon });
}

// ============================================================
//  LOGIN
// ============================================================
function loginUser(telefon) {
  var ss    = SpreadsheetApp.openById(SS_ID);
  var sheet = ss.getSheetByName('Студенты');
  var data  = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][3]) === String(telefon)) {
      return json({ ok: true, name: data[i][1], group: data[i][2], telefon: data[i][3] });
    }
  }
  return json({ ok: false, error: 'Номер не найден. Зарегистрируйтесь.' });
}

// ============================================================
//  GET GRADES
// ============================================================
function getGrades(name) {
  var ss    = SpreadsheetApp.openById(SS_ID);
  var sheet = ss.getSheetByName('Ответы');
  var data  = sheet.getDataRange().getValues();

  var grades = [];
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]) === String(name) && data[i][6]) {
      grades.push({
        section:  data[i][3],
        topic:    data[i][4],
        exercise: data[i][5],
        grade:    data[i][6],
        comment:  data[i][7] || ''
      });
    }
  }
  return json({ ok: true, grades: grades });
}

// ============================================================
//  LEADERBOARD
// ============================================================
function getLeaderboard() {
  var ss      = SpreadsheetApp.openById(SS_ID);
  var answers = ss.getSheetByName('Ответы').getDataRange().getValues();
  var students = ss.getSheetByName('Студенты').getDataRange().getValues();

  // Talabalar soni
  var totalStudents = Math.max(0, students.length - 1);

  // Javoblar soni
  var totalAnswers = Math.max(0, answers.length - 1);

  // Reyting: baholar bo'yicha
  var scores = {};
  for (var i = 1; i < answers.length; i++) {
    var name  = answers[i][1];
    var group = answers[i][2];
    var grade = parseFloat(answers[i][6]);
    if (!name || isNaN(grade)) continue;
    if (!scores[name]) scores[name] = { name: name, group: group, total: 0, count: 0 };
    scores[name].total += grade;
    scores[name].count++;
  }

  var leaders = Object.values(scores)
    .filter(function(s) { return s.count > 0; })
    .map(function(s) {
      return {
        name:     s.name,
        group:    s.group,
        avgScore: (s.total / s.count).toFixed(1),
        tasks:    s.count
      };
    })
    .sort(function(a, b) { return parseFloat(b.avgScore) - parseFloat(a.avgScore); })
    .slice(0, 10);

  return json({ ok: true, leaders: leaders, totalStudents: totalStudents, totalAnswers: totalAnswers });
}

// ============================================================
//  TEORIA TEST — savollar (varaq: Test) va javoblar (Teoria test otveti)
// ============================================================
var SHEET_TEORIA_TEST    = 'Test';
var SHEET_TEORIA_ANSWERS = 'Teoria test otveti';

function getTeoriaTestSheet_() {
  var ss = SpreadsheetApp.openById(SS_ID);
  var sheet = ss.getSheetByName(SHEET_TEORIA_TEST);
  if (!sheet) sheet = ss.getSheetByName('test');
  if (!sheet) sheet = ss.getSheetByName('Тест');
  return sheet;
}

function parseCorrectAnswer_(cell, opts) {
  var s = String(cell || '').trim();
  if (!s) return 0;
  var up = s.toUpperCase();
  if (up === 'A' || up.indexOf('A ') === 0) return 0;
  if (up === 'B' || up.indexOf('B ') === 0) return 1;
  if (up === 'C' || up.indexOf('C ') === 0) return 2;
  if (up === 'D' || up.indexOf('D ') === 0) return 3;
  for (var j = 0; j < opts.length; j++) {
    if (opts[j] && s === String(opts[j]).trim()) return j;
  }
  for (var k = 0; k < opts.length; k++) {
    if (opts[k] && s.indexOf(String(opts[k]).trim()) >= 0) return k;
  }
  return 0;
}

function getTeoriaTest() {
  var sheet = getTeoriaTestSheet_();
  if (!sheet) {
    return json({ ok: false, error: 'Лист «Test» не найден в таблице' });
  }

  var data = sheet.getDataRange().getValues();
  var questions = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var qText = String(row[0] || '').trim();
    if (!qText) continue;

    var opts = [
      String(row[1] || '').trim(),
      String(row[2] || '').trim(),
      String(row[3] || '').trim(),
      String(row[4] || '').trim()
    ];
    if (!opts[0] && !opts[1]) continue;

    questions.push({
      id:  questions.length + 1,
      q:   qText,
      opts: opts,
      ans: parseCorrectAnswer_(row[5], opts)
    });
  }

  return json({ ok: true, questions: questions, total: questions.length });
}

function ensureTeoriaAnswersSheet_() {
  var ss = SpreadsheetApp.openById(SS_ID);
  var sheet = ss.getSheetByName(SHEET_TEORIA_ANSWERS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_TEORIA_ANSWERS);
    sheet.appendRow([
      'ID', 'Дата', 'Имя', 'Группа', 'Телефон',
      'Правильно', 'Всего', 'Процент', 'Оценка', 'Ответы (1-A,2-B…)'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  }
  return sheet;
}

function submitTeoriaTest(data) {
  var sheet = ensureTeoriaAnswersSheet_();
  var id = 'T' + Date.now();

  sheet.appendRow([
    id,
    new Date(),
    data.name     || '',
    data.group    || '',
    data.telefon  || '',
    data.correct  || 0,
    data.total    || 0,
    data.percent  || 0,
    data.grade    || '',
    data.answersLine || ''
  ]);

  var msg = '📝 <b>Тест — Теория</b>\n'
    + '👤 ' + (data.name || '?') + ' · ' + (data.group || '?') + '\n'
    + '📊 ' + (data.correct || 0) + ' / ' + (data.total || 0)
    + ' (' + (data.percent || 0) + '%) · Оценка: ' + (data.grade || '—') + '\n'
    + '📋 ' + String(data.answersLine || '').substring(0, 400);
  sendTelegramMessage(msg);

  return json({ ok: true });
}

// ============================================================
//  GET KAZUSY  (Sheets → sayt)
// ============================================================
function getKazusy() {
  var ss    = SpreadsheetApp.openById(SS_ID);
  var sheet = ss.getSheetByName('Казусы');
  var data  = sheet.getDataRange().getValues();

  var kazusy = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][1]) {
      kazusy.push({
        num:    Number(data[i][0]),
        text:   String(data[i][1]),
        task:   data[i][2] ? String(data[i][2]) : ''
      });
    }
  }
  return json({ ok: true, kazusy: kazusy });
}

// ============================================================
//  SUBMIT ANSWER  (Теория / Практика / Контроль тест)
// ============================================================
function submitAnswer(data) {
  var ss    = SpreadsheetApp.openById(SS_ID);
  var sheet = ss.getSheetByName('Ответы');

  var id = 'A' + Date.now();
  sheet.appendRow([
    id,
    data.name     || '',
    data.group    || '',
    data.section  || '',
    data.topic    || '',
    data.exercise || '',
    '',            // Оценка — o'qituvchi to'ldiradi
    '',            // Комментарий — o'qituvchi to'ldiradi
    data.answer   || '',
    new Date()
  ]);

  // Telegram guruhga xabar
  var msg = '📝 <b>Новый ответ</b>\n'
    + '👤 ' + (data.name || '?') + ' · ' + (data.group || '?') + '\n'
    + '📚 ' + (data.section || '') + ' · ' + (data.topic || '') + '\n'
    + '✏️ ' + (data.exercise || '') + '\n\n'
    + '💬 ' + (data.answer || '').substring(0, 500);
  sendTelegramMessage(msg);

  return json({ ok: true });
}

// ============================================================
//  SUBMIT KAZUS  (Word fayl → Google Drive + Telegram)
// ============================================================
function submitKazus(data) {
  var ss    = SpreadsheetApp.openById(SS_ID);
  var sheet = ss.getSheetByName('Ответы');

  // 1. Faylni Google Drive'ga saqlash
  var fileUrl = '';
  try {
    var bytes    = Utilities.base64Decode(data.fileData);
    var blob     = Utilities.newBlob(bytes, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', data.fileName);
    var folder   = getOrCreateFolder('LegalLinguoLab_Kazusy');
    var file     = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    fileUrl = file.getUrl();
  } catch (err) {
    fileUrl = 'Ошибка сохранения: ' + err.message;
  }

  // 2. Sheets'ga yozish
  var id = 'K' + Date.now();
  sheet.appendRow([
    id,
    data.name     || '',
    data.group    || '',
    'Контроль',
    'Казус ' + data.kazus,
    'Файл',
    '',            // Оценка
    '',            // Комментарий
    fileUrl,
    new Date()
  ]);

  // 3. Telegram guruhga fayl yuborish
  try {
    var bytes = Utilities.base64Decode(data.fileData);
    var blob  = Utilities.newBlob(bytes, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', data.fileName);

    var caption = '📎 <b>Казус ' + data.kazus + '</b>\n'
      + '👤 ' + (data.name  || '?') + '\n'
      + '🎓 ' + (data.group || '?') + '\n'
      + '📁 ' + (data.fileName || 'file.docx');

    sendTelegramFile(blob, caption);
  } catch (err) {
    // Fayl yuborilmasa ham Sheets'ga yozilgan, xatolik qaytarilmaydi
    sendTelegramMessage('⚠️ Казус ' + data.kazus + ' юкланди, лекин файл юборилмади: ' + err.message);
  }

  return json({ ok: true, fileUrl: fileUrl });
}

// ============================================================
//  HELPERS
// ============================================================
function getOrCreateFolder(name) {
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}

function sendTelegramMessage(text) {
  var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ chat_id: GROUP_ID, text: text, parse_mode: 'HTML' }),
    muteHttpExceptions: true
  });
}

function sendTelegramFile(blob, caption) {
  var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendDocument';
  UrlFetchApp.fetch(url, {
    method: 'post',
    payload: {
      chat_id: GROUP_ID,
      caption: caption,
      parse_mode: 'HTML',
      document: blob
    },
    muteHttpExceptions: true
  });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
