/**
 * ============================================================
 *  BACKEND WEBSITE DESA — Google Apps Script (Web App)
 * ============================================================
 *  Cara pakai (sekali saja):
 *  1. Buka Spreadsheet Anda → menu Extensions → Apps Script.
 *  2. Hapus semua isi file bawaan, tempel SELURUH file ini.
 *  3. Ganti nilai TOKEN di bawah dengan kata sandi acak Anda
 *     (nanti nilai yang sama dipakai di .env → APPS_SCRIPT_TOKEN).
 *  4. Klik Save. Pilih fungsi "setup" di dropdown atas → klik Run.
 *     (Akan diminta izin akses spreadsheet → Allow.) Ini membuat
 *     semua tab + header + data contoh.
 *  5. Klik Deploy → New deployment → pilih jenis "Web app":
 *        - Execute as: Me
 *        - Who has access: Anyone
 *     Klik Deploy → salin "Web app URL" (berakhiran /exec).
 *     URL itu → isi ke .env sebagai APPS_SCRIPT_URL.
 *  6. Setiap kali mengubah Code.gs, lakukan Deploy → Manage
 *     deployments → Edit → Version: New version → Deploy.
 * ============================================================
 */

// >>> GANTI nilai ini, samakan dengan APPS_SCRIPT_TOKEN di .env <<<
var TOKEN = 'GANTI_TOKEN_RAHASIA_INI';

var HEADERS = {
  news: ['id','title','slug','category','excerpt','content','thumbnail','author','views','status','publishedAt','createdAt','updatedAt'],
  events: ['id','title','description','eventDate','location','poster','createdAt'],
  photos: ['id','title','imageUrl','createdAt'],
  videos: ['id','title','youtubeUrl','createdAt'],
  documents: ['id','name','category','fileUrl','downloadCount','createdAt'],
  statistics: ['key','label','value'],
  settings: ['key','value'],
  categories: ['id','name','slug']
};

var NUMERIC = { news: ['views'], documents: ['downloadCount'] };

function ss() { return SpreadsheetApp.getActiveSpreadsheet(); }

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Cek kesehatan: buka URL /exec di browser → tampil pesan aktif.
function doGet() {
  return jsonOut({ ok: true, message: 'API Website Desa aktif' });
}

function doPost(e) {
  var out;
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.token !== TOKEN) {
      out = { error: 'unauthorized' };
    } else {
      var name = body.sheet;
      var p = body.payload || {};
      switch (body.action) {
        case 'readAll': out = { data: readAll(name) }; break;
        case 'append':  out = { data: append(name, p.obj) }; break;
        case 'update':  out = { data: update(name, p.keyValue, p.obj, p.keyColumn || 'id') }; break;
        case 'delete':  out = { data: remove(name, p.keyValue, p.keyColumn || 'id') }; break;
        case 'patch':   out = { data: patch(name, p.keyValue, p.patch, p.keyColumn || 'id') }; break;
        default: out = { error: 'aksi tidak dikenal: ' + body.action };
      }
    }
  } catch (err) {
    out = { error: String((err && err.message) || err) };
  }
  return jsonOut(out);
}

// ---------------- Operasi tabel ----------------

function sheetByName(name) {
  var sh = ss().getSheetByName(name);
  if (!sh) throw new Error('Tab "' + name + '" tidak ditemukan');
  return sh;
}

function readAll(name) {
  var headers = HEADERS[name];
  if (!headers) throw new Error('Tabel tidak dikenal: ' + name);
  var sh = sheetByName(name);
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(2, 1, last - 1, headers.length).getValues();
  var numeric = NUMERIC[name] || [];
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (row[0] === '' || row[0] === null) continue;
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var h = headers[c];
      var v = row[c];
      obj[h] = numeric.indexOf(h) >= 0 ? Number(v || 0) : (v === null ? '' : String(v));
    }
    rows.push(obj);
  }
  return rows;
}

function toRow(name, obj) {
  return HEADERS[name].map(function (h) {
    var v = obj ? obj[h] : '';
    return (v === undefined || v === null) ? '' : v;
  });
}

function append(name, obj) {
  sheetByName(name).appendRow(toRow(name, obj));
  return true;
}

function findRowIndex(name, keyColumn, keyValue) {
  var headers = HEADERS[name];
  var col = headers.indexOf(keyColumn);
  if (col < 0) throw new Error('Kolom "' + keyColumn + '" tidak ada di ' + name);
  var sh = sheetByName(name);
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var values = sh.getRange(2, col + 1, last - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(keyValue)) return i + 2;
  }
  return -1;
}

function update(name, keyValue, obj, keyColumn) {
  var idx = findRowIndex(name, keyColumn, keyValue);
  if (idx < 0) return false;
  sheetByName(name).getRange(idx, 1, 1, HEADERS[name].length).setValues([toRow(name, obj)]);
  return true;
}

function remove(name, keyValue, keyColumn) {
  var idx = findRowIndex(name, keyColumn, keyValue);
  if (idx < 0) return false;
  sheetByName(name).deleteRow(idx);
  return true;
}

function patch(name, keyValue, patchObj, keyColumn) {
  var idx = findRowIndex(name, keyColumn, keyValue);
  if (idx < 0) return false;
  var headers = HEADERS[name];
  var sh = sheetByName(name);
  var current = sh.getRange(idx, 1, 1, headers.length).getValues()[0];
  var obj = {};
  for (var c = 0; c < headers.length; c++) obj[headers[c]] = current[c];
  for (var k in patchObj) obj[k] = patchObj[k];
  sh.getRange(idx, 1, 1, headers.length).setValues([toRow(name, obj)]);
  return true;
}

// ---------------- Setup awal (jalankan sekali) ----------------

function uid() {
  return Utilities.getUuid().replace(/-/g, '').slice(0, 10);
}

function slugify(s) {
  return String(s).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/[\s-]+/g, '-');
}

function nowIso() { return new Date().toISOString(); }

function setup() {
  var s = ss();
  // 1) Buat tab + tulis header
  Object.keys(HEADERS).forEach(function (name) {
    var sh = s.getSheetByName(name) || s.insertSheet(name);
    sh.getRange(1, 1, 1, HEADERS[name].length).setValues([HEADERS[name]]);
  });

  // 2) Seed settings
  if (s.getSheetByName('settings').getLastRow() < 2) {
    var settings = [
      ['namaDesa','Desa Sukamaju'],
      ['slogan','Desa Transparan, Desa Digital, Desa Maju'],
      ['sejarah','Tuliskan sejarah desa di sini melalui menu Pengaturan.'],
      ['visi','Mewujudkan desa yang maju, mandiri, dan sejahtera.'],
      ['misi','Meningkatkan pelayanan publik; mengembangkan potensi desa; mendorong transparansi.'],
      ['sambutan','Selamat datang di website resmi desa kami.'],
      ['alamat','Jl. Raya Desa No. 1, Kecamatan, Kabupaten'],
      ['telepon','(021) 1234-5678'],
      ['email','info@desaku.id'],
      ['jamOperasional','Senin - Jumat, 08.00 - 16.00 WIB'],
      ['whatsapp','628123456789'],
      ['mapsEmbed','']
    ];
    s.getSheetByName('settings').getRange(2, 1, settings.length, 2).setValues(settings);
  }

  // 3) Seed statistik
  if (s.getSheetByName('statistics').getLastRow() < 2) {
    var stats = [
      ['penduduk','Jumlah Penduduk','4500'],
      ['kk','Jumlah KK','1200'],
      ['rt','Jumlah RT','24'],
      ['rw','Jumlah RW','6'],
      ['dusun','Jumlah Dusun','4'],
      ['luas','Luas Wilayah (Ha)','850']
    ];
    s.getSheetByName('statistics').getRange(2, 1, stats.length, 3).setValues(stats);
  }

  // 4) Seed kategori
  if (s.getSheetByName('categories').getLastRow() < 2) {
    var names = ['Pemerintahan','Pendidikan','Kesehatan','Pertanian','Pariwisata','UMKM','Infrastruktur'];
    var cats = names.map(function (n) { return [uid(), n, slugify(n)]; });
    s.getSheetByName('categories').getRange(2, 1, cats.length, 3).setValues(cats);
  }

  // 5) Seed 1 berita contoh
  if (s.getSheetByName('news').getLastRow() < 2) {
    var t = nowIso();
    var row = [
      uid(),
      'Selamat Datang di Website Desa Digital',
      'selamat-datang-di-website-desa-digital',
      'Pemerintahan',
      'Website resmi desa kini hadir sebagai pusat informasi dan transparansi pemerintahan.',
      '<p>Dengan bangga kami meluncurkan website resmi desa sebagai sarana informasi, transparansi, dan pelayanan kepada masyarakat.</p>',
      '',
      'Admin Desa',
      0,
      'published',
      t, t, t
    ];
    s.getSheetByName('news').getRange(2, 1, 1, row.length).setValues([row]);
  }

  SpreadsheetApp.flush();
  Logger.log('✅ Setup selesai. Lanjutkan ke Deploy → New deployment → Web app.');
}
