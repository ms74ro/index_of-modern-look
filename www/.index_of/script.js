/* Apache "Index of" – listare modernă (citește tabelul generat de mod_autoindex) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var raw = $('raw');
  if (!raw) return;

  /* ---------- Iconuri (SVG inline) ---------- */
  var FILE = '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>';
  var ICONS = {
    folder:  '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    parent:  '<path d="M9 10 4 15l5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>',
    file:    FILE,
    image:   FILE + '<circle cx="9.5" cy="12.5" r="1.3"/><path d="m16 18-3-3-4.5 4.5"/>',
    video:   FILE + '<path d="m10 11.5 5 3-5 3z"/>',
    audio:   FILE + '<circle cx="10" cy="17" r="1.6"/><path d="M11.6 17v-6l3.4 1.2"/>',
    archive: FILE + '<path d="M10 5v1.5M10 8.5V10M10 12v1.5"/><rect x="8.8" y="15" width="2.6" height="3.2" rx=".6"/>',
    code:    FILE + '<path d="m10 12-2 2.5 2 2.5M14 12l2 2.5-2 2.5"/>',
    pdf:     FILE + '<path d="M8.5 13h7M8.5 16h7M8.5 19h4"/>',
    doc:     FILE + '<path d="M8.5 13h7M8.5 16h7M8.5 19h4"/>',
    text:    FILE + '<path d="M8.5 13h7M8.5 16h5"/>',
    sheet:   FILE + '<path d="M8 12h8v6.5H8zM8 15.2h8M12 12v6.5"/>',
    slides:  FILE + '<rect x="8" y="12" width="8" height="5" rx=".6"/><path d="M12 17v2"/>',
    exe:     FILE + '<rect x="8.5" y="12" width="7" height="6" rx="1"/><path d="M8.5 14h7"/>',
    disk:    FILE + '<circle cx="12" cy="15" r="3.2"/><circle cx="12" cy="15" r=".7"/>',
    font:    FILE + '<path d="m9 18.5 3-7 3 7M10.2 16h3.6"/>',
    db:      FILE + '<ellipse cx="12" cy="12.6" rx="3.5" ry="1.3"/><path d="M8.5 12.6V17c0 .7 1.6 1.3 3.5 1.3s3.5-.6 3.5-1.3v-4.4"/>'
  };
  var UI = {
    home:  '<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/>',
    chev:  '<path d="m9 6 6 6-6 6"/>',
    sun:   '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon:  '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    auto:  '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    grid:  '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    list:  '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    empty: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8.5 11h5"/>'
  };
  var svg = function (p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; };

  var TYPES = {
    image:   'jpg jpeg png gif bmp webp svg ico tif tiff heic heif avif raw cr2 nef psd ai eps',
    video:   'mp4 mkv avi mov wmv flv webm m4v mpg mpeg 3gp ts vob',
    audio:   'mp3 wav flac aac ogg oga m4a wma opus mid midi',
    archive: 'zip rar 7z tar gz tgz bz2 xz zst lz lzma cab deb rpm apk jar war',
    code:    'html htm css scss less js mjs ts tsx jsx json xml yml yaml toml ini conf cfg php py rb go rs java c h cpp hpp cs sh bash ps1 bat cmd vbs sql lua pl swift kt vue env htaccess',
    pdf:     'pdf',
    doc:     'doc docx odt rtf pages',
    sheet:   'xls xlsx xlsm ods csv tsv numbers',
    slides:  'ppt pptx odp key',
    text:    'txt md markdown log nfo readme',
    exe:     'exe msi dmg pkg appimage bin run com',
    disk:    'iso img vhd vhdx vmdk qcow2 ova ovf',
    font:    'ttf otf woff woff2 eot',
    db:      'db sqlite sqlite3 mdb accdb dbf bak'
  };
  var EXT = {};
  Object.keys(TYPES).forEach(function (t) { TYPES[t].split(' ').forEach(function (e) { EXT[e] = t; }); });

  /* ---------- Utilitare ---------- */
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var dec = function (s) { try { return decodeURIComponent(s); } catch (e) { return s; } };
  var MON = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  var RE_ISO = /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/;
  var RE_OLD = /(\d{2})-([A-Za-z]{3})-(\d{4})\s+(\d{2}):(\d{2})/;
  var RE_SIZE = /^\s*(\d+(?:\.\d+)?)\s*([KMGTP])?\s*$/i;

  function parseDate(s) {
    var m = RE_ISO.exec(s);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
    m = RE_OLD.exec(s);
    if (m && MON[m[2].toLowerCase()] != null) return new Date(+m[3], MON[m[2].toLowerCase()], +m[1], +m[4], +m[5]);
    return null;
  }
  function parseSize(s) {
    var m = RE_SIZE.exec(s);
    if (!m) return -1;
    var mult = { K: 1, M: 2, G: 3, T: 4, P: 5 }[(m[2] || '').toUpperCase()] || 0;
    return parseFloat(m[1]) * Math.pow(1024, mult);
  }
  function fmtSize(b) {
    if (b < 0) return '—';
    if (b < 1024) return Math.round(b) + ' B';
    var u = ['KB', 'MB', 'GB', 'TB', 'PB'], i = -1;
    do { b /= 1024; i++; } while (b >= 1024 && i < u.length - 1);
    return (b < 10 ? b.toFixed(1) : Math.round(b)) + ' ' + u[i];
  }
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  function fmtDate(d) {
    if (!d) return '';
    return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  /* ---------- Citește intrările din tabelul Apache ---------- */
  var path = location.pathname;
  var items = [];

  function addItem(a, cellsText, desc) {
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '?') return;           // linkuri de sortare
    var abs = new URL(href, location.href);
    var isParent = /parent directory/i.test(a.textContent) ||
                   (abs.pathname.length < path.length && path.indexOf(abs.pathname) === 0);
    if (isParent) { items.parent = abs.pathname; return; }
    var isDir = /\/$/.test(abs.pathname);
    var seg = abs.pathname.replace(/\/$/, '').split('/').pop();
    var name = dec(seg) || a.textContent.trim();
    var date = null, size = -1;
    cellsText.forEach(function (t) {
      if (!date) date = parseDate(t);
      if (size < 0 && !RE_ISO.test(t) && !RE_OLD.test(t)) size = parseSize(t);
    });
    var dot = name.lastIndexOf('.');
    var ext = !isDir && dot > 0 ? name.slice(dot + 1).toLowerCase() : (name.charAt(0) === '.' && !isDir ? name.slice(1).toLowerCase() : '');
    items.push({
      name: name, href: href, dir: isDir, date: date, size: isDir ? -1 : size,
      ext: ext, type: isDir ? 'folder' : (EXT[ext] || 'file'), desc: desc || ''
    });
  }

  var table = raw.querySelector('table');
  if (table) {
    Array.prototype.forEach.call(table.querySelectorAll('tr'), function (tr) {
      var tds = tr.querySelectorAll('td');
      if (!tds.length) return;
      var link = null;
      Array.prototype.some.call(tr.querySelectorAll('td a'), function (a) {
        if (a.textContent.trim()) { link = a; return true; }
      });
      if (!link) return;
      var texts = Array.prototype.map.call(tds, function (td) { return td.textContent.replace(/ /g, ' ').trim(); });
      var descCell = tr.querySelector('td.indexcoldesc') || (tds.length >= 4 ? tds[tds.length - 1] : null);
      var desc = descCell ? descCell.textContent.replace(/ /g, ' ').trim() : '';
      addItem(link, texts.filter(function (t) { return t !== link.textContent.trim(); }), desc);
    });
  } else {
    /* Mod <pre> (fără HTMLTable) */
    Array.prototype.forEach.call(raw.querySelectorAll('pre a'), function (a) {
      var rest = '', n = a.nextSibling;
      while (n && n.nodeName !== 'A' && n.nodeName !== 'IMG') { rest += n.textContent; n = n.nextSibling; }
      var line = rest.split('\n')[0];
      var parts = line.trim().split(/\s{2,}/);
      addItem(a, parts.concat(line.trim().split(/\s+/).slice(-1)), '');
    });
  }

  /* ---------- Titlu, breadcrumbs, statistici ---------- */
  var segs = path.split('/').filter(Boolean);
  var here = segs.length ? dec(segs[segs.length - 1]) : location.host;
  document.title = here + ' — Index of ' + dec(path);
  $('title').textContent = here;

  var crumbs = '<a href="/" title="Rădăcină"' + (segs.length ? '' : ' aria-current="page"') + '>' + svg(UI.home) + '<span>' + esc(location.host) + '</span></a>';
  var acc = '/';
  segs.forEach(function (s, i) {
    acc += s + '/';
    crumbs += '<span class="sep">' + svg(UI.chev) + '</span><a href="' + esc(acc) + '"' +
              (i === segs.length - 1 ? ' aria-current="page"' : '') + '>' + esc(dec(s)) + '</a>';
  });
  $('crumbs').innerHTML = crumbs;

  var nDirs = items.filter(function (i) { return i.dir; }).length;
  var nFiles = items.length - nDirs;
  var total = items.reduce(function (s, i) { return s + (i.size > 0 ? i.size : 0); }, 0);
  var plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : (n !== 0 && (n % 100 === 0 || n % 100 > 19) ? 'de ' : '') + many); };
  $('stats').textContent = plural(nDirs, 'folder', 'foldere') + ' · ' + plural(nFiles, 'fișier', 'fișiere') +
    (nFiles ? ' · ' + fmtSize(total) : '');

  /* Semnătura serverului (dacă ServerSignature On) */
  var addr = raw.querySelector('address');
  if (addr) $('footInfo').insertBefore(addr, $('footInfo').firstChild);   // semnătura serverului deasupra copyright-ului

  /* ---------- Sortare & filtrare ---------- */
  var state = { key: 'name', dir: 1, q: '' };
  try {
    var saved = JSON.parse(localStorage.getItem('idx-sort') || 'null');
    if (saved && /^(name|date|size|desc)$/.test(saved.key)) { state.key = saved.key; state.dir = saved.dir === -1 ? -1 : 1; }
  } catch (e) {}

  var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  function sortItems(list) {
    return list.slice().sort(function (a, b) {
      if (a.dir !== b.dir) return a.dir ? -1 : 1;              // folderele mereu primele
      var r = 0;
      if (state.key === 'date') r = (a.date ? +a.date : 0) - (b.date ? +b.date : 0);
      else if (state.key === 'size') r = a.size - b.size;
      else if (state.key === 'desc') r = collator.compare(a.dir ? 'Folder' : a.desc, b.dir ? 'Folder' : b.desc);
      if (r === 0) r = collator.compare(a.name, b.name);
      return r * state.dir;
    });
  }

  function highlight(name, q) {
    if (!q) return esc(name);
    var i = name.toLowerCase().indexOf(q);
    if (i < 0) return esc(name);
    return esc(name.slice(0, i)) + '<mark>' + esc(name.slice(i, i + q.length)) + '</mark>' + esc(name.slice(i + q.length));
  }

  function rowHTML(it, q) {
    var label = '<span class="fname" title="' + esc(it.name) + '">' + highlight(it.name, q) + '</span>';
    var desc = it.dir ? 'Folder' : it.desc;
    return '<a class="row" href="' + esc(it.href) + '"' + (it.dir ? '' : ' data-file') + '>' +
      '<span class="name"><span class="ico ' + it.type + '" style="--ic:var(--c-' + it.type + ')">' + svg(ICONS[it.type]) + '</span>' +
      '<span class="label">' + label + '</span></span>' +
      '<span class="date" title="' + esc(it.date ? it.date.toString() : '') + '">' + fmtDate(it.date) + '</span>' +
      '<span class="size">' + (it.dir ? '—' : fmtSize(it.size)) + '</span>' +
      '<span class="desc" title="' + esc(desc) + '">' + esc(desc) + '</span></a>';
  }

  function render() {
    var q = state.q.trim().toLowerCase();
    var list = sortItems(items).filter(function (it) { return !q || it.name.toLowerCase().indexOf(q) > -1; });
    var html = '';
    if (items.parent && !q) {
      html += '<a class="row parent" href="' + esc(items.parent) + '"><span class="name"><span class="ico" style="--ic:var(--c-text)">' +
              svg(ICONS.parent) + '</span><span class="label"><span class="fname">..</span></span></span><span class="date"></span><span class="size"></span><span class="desc"></span></a>';
    }
    html += list.map(function (it) { return rowHTML(it, q); }).join('');
    $('list').innerHTML = html;

    var empty = $('empty');
    if (!list.length) {
      empty.hidden = false;
      empty.innerHTML = svg(UI.empty) + (q ? 'Nimic nu se potrivește cu „' + esc(state.q.trim()) + '”.' : 'Folderul este gol.');
    } else empty.hidden = true;

    Array.prototype.forEach.call(document.querySelectorAll('#listHead button'), function (b) {
      var on = b.getAttribute('data-sort') === state.key;
      b.classList.toggle('active', on);
      b.querySelector('.arrow').textContent = on ? (state.dir === 1 ? '▲' : '▼') : '';
      b.setAttribute('aria-sort', on ? (state.dir === 1 ? 'ascending' : 'descending') : 'none');
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('#listHead button'), function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-sort');
      if (state.key === k) state.dir = -state.dir;
      else { state.key = k; state.dir = k === 'name' ? 1 : -1; }
      try { localStorage.setItem('idx-sort', JSON.stringify({ key: state.key, dir: state.dir })); } catch (e) {}
      render();
    });
  });

  var filter = $('filter');
  filter.addEventListener('input', function () { state.q = filter.value; render(); });
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); filter.focus(); filter.select(); }
    else if (e.key === 'Escape' && document.activeElement === filter) { filter.value = ''; state.q = ''; render(); filter.blur(); }
    else if (e.key === 'Enter' && document.activeElement === filter) {
      var first = document.querySelector('#list .row:not(.parent)');
      if (first) first.click();
    }
  });

  /* ---------- Temă: auto → luminoasă → întunecată ---------- */
  var root = document.documentElement;
  var themeBtn = $('themeBtn');
  var THEMES = ['auto', 'light', 'dark'];
  var TNAMES = { auto: 'Temă: automată (sistem)', light: 'Temă: luminoasă', dark: 'Temă: întunecată' };
  function currentTheme() { return root.getAttribute('data-theme') || 'auto'; }
  function paintTheme() {
    var t = currentTheme();
    themeBtn.innerHTML = svg(t === 'light' ? UI.sun : t === 'dark' ? UI.moon : UI.auto);
    themeBtn.title = TNAMES[t];
    themeBtn.setAttribute('aria-label', TNAMES[t]);
  }
  themeBtn.addEventListener('click', function () {
    var next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
    if (next === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', next);
    try { next === 'auto' ? localStorage.removeItem('idx-theme') : localStorage.setItem('idx-theme', next); } catch (e) {}
    paintTheme();
  });
  paintTheme();

  /* ---------- Vizualizare: listă / grilă ---------- */
  var viewBtn = $('viewBtn');
  function paintView() {
    var g = root.getAttribute('data-view') === 'grid';
    viewBtn.innerHTML = svg(g ? UI.list : UI.grid);
    viewBtn.title = g ? 'Vizualizare listă' : 'Vizualizare grilă';
  }
  viewBtn.addEventListener('click', function () {
    var g = root.getAttribute('data-view') === 'grid';
    if (g) root.removeAttribute('data-view'); else root.setAttribute('data-view', 'grid');
    try { localStorage.setItem('idx-view', g ? 'list' : 'grid'); } catch (e) {}
    paintView();
  });
  paintView();

  render();
})();
