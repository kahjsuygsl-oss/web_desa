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
function doGet(e) {
  // Alat diagnosa: buka URL?token=TOKEN_ANDA untuk cek token & tab.
  var p = (e && e.parameter) || {};
  if (p.token !== undefined) {
    var tabs = {};
    Object.keys(HEADERS).forEach(function (n) {
      tabs[n] = ss().getSheetByName(n) ? 'ada' : 'TIDAK ADA';
    });
    return jsonOut({
      ok: true,
      tokenCocok: p.token === TOKEN,
      tabs: tabs,
    });
  }
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

  // 2) Seed settings — data Desa Masbagik Timur, Lombok Timur
  if (s.getSheetByName('settings').getLastRow() < 2) {
    var settings = [
      ['namaDesa','Desa Masbagik Timur'],
      ['slogan','Mandiri, Sejahtera, Religius, dan Berbudaya'],
      ['sejarah','Desa Masbagik Timur merupakan pemekaran dari desa induk Masbagik, terletak di Kecamatan Masbagik, Kabupaten Lombok Timur, Nusa Tenggara Barat. Desa ini terus berkembang menjadi wilayah yang mandiri dengan potensi pertanian dan kerajinan lokal yang kuat. Nama "Masbagik" memiliki akar sejarah yang panjang dalam kebudayaan Sasak di Lombok Timur.'],
      ['visi','Terwujudnya Desa Masbagik Timur yang Mandiri, Sejahtera, Religius, dan Berbudaya melalui Tata Kelola Pemerintahan yang Bersih dan Transparan.'],
      ['misi','Meningkatkan kualitas pelayanan publik; Mengembangkan potensi ekonomi kerakyatan; Membangun infrastruktur desa yang memadai; Meningkatkan kualitas pendidikan dan kesehatan masyarakat.'],
      ['sambutan','Selamat datang di Portal Resmi Desa Masbagik Timur. Melalui website ini, kami berkomitmen menghadirkan informasi yang akurat, transparan, dan terpercaya mengenai kegiatan serta pembangunan desa. Mari bersama membangun Masbagik Timur yang lebih maju.'],
      ['alamat','Jl. Raya Masbagik - Sikur, Desa Masbagik Timur, Kec. Masbagik, Kab. Lombok Timur, NTB 83661'],
      ['telepon','(0376) 000000'],
      ['email','pemdes@kimmasbagiktimur.id'],
      ['jamOperasional','Senin - Kamis 08.00-14.00, Jumat 08.00-11.30, Sabtu 08.00-12.30 WITA'],
      ['whatsapp','6281200000000'],
      ['mapsEmbed','']
    ];
    s.getSheetByName('settings').getRange(2, 1, settings.length, 2).setValues(settings);
  }

  // 3) Seed statistik (penduduk dari data desa; angka lain perkiraan, sesuaikan via menu Statistik)
  if (s.getSheetByName('statistics').getLastRow() < 2) {
    var stats = [
      ['penduduk','Jumlah Penduduk','8500'],
      ['kk','Jumlah KK','2600'],
      ['rt','Jumlah RT','35'],
      ['rw','Jumlah RW','10'],
      ['dusun','Jumlah Dusun','6'],
      ['luas','Luas Wilayah (Ha)','450']
    ];
    s.getSheetByName('statistics').getRange(2, 1, stats.length, 3).setValues(stats);
  }

  // 4) Seed kategori
  if (s.getSheetByName('categories').getLastRow() < 2) {
    var names = ['Pemerintahan','Pendidikan','Kesehatan','Pertanian','Pariwisata','UMKM','Infrastruktur'];
    var cats = names.map(function (n) { return [uid(), n, slugify(n)]; });
    s.getSheetByName('categories').getRange(2, 1, cats.length, 3).setValues(cats);
  }

  // 5) Seed berita contoh — dari prototipe Masbagik Timur
  if (s.getSheetByName('news').getLastRow() < 2) {
    function isoDate(d) { return new Date(d).toISOString(); }
    var berita = [
      [
        uid(),
        'Pembangunan Saluran Irigasi Subak Tuntas 100%',
        'pembangunan-saluran-irigasi-subak-tuntas-100',
        'Infrastruktur',
        'Pemerintah Desa Masbagik Timur mengumumkan selesainya proyek irigasi yang diharapkan meningkatkan hasil panen petani lokal musim ini.',
        '<p>Pemerintah Desa Masbagik Timur dengan bangga mengumumkan selesainya proyek pembangunan saluran irigasi Subak yang telah mencapai 100%. Proyek ini diharapkan dapat meningkatkan hasil panen petani lokal pada musim tanam mendatang.</p><p>Pembangunan irigasi ini merupakan bagian dari komitmen desa dalam mengembangkan potensi ekonomi kerakyatan, khususnya di sektor pertanian.</p>',
        '',
        'Admin Desa',
        0,
        'published',
        isoDate('2026-05-24'), isoDate('2026-05-24'), isoDate('2026-05-24')
      ],
      [
        uid(),
        'Kunjungan Bupati Lombok Timur ke Masbagik Timur',
        'kunjungan-bupati-lombok-timur-ke-masbagik-timur',
        'Pemerintahan',
        'Bupati Lombok Timur melakukan peninjauan langsung terhadap pelayanan administrasi terpadu di kantor desa.',
        '<p>Bupati Lombok Timur melakukan kunjungan kerja ke Desa Masbagik Timur untuk meninjau langsung pelayanan administrasi terpadu di kantor desa. Dalam kunjungannya, Bupati mengapresiasi peningkatan kualitas pelayanan publik di desa.</p>',
        '',
        'Admin Desa',
        0,
        'published',
        isoDate('2026-05-20'), isoDate('2026-05-20'), isoDate('2026-05-20')
      ],
      [
        uid(),
        'Pemda Lotim Buka Beasiswa Berprestasi 2026',
        'pemda-lotim-buka-beasiswa-berprestasi-2026',
        'Pendidikan',
        'Pemerintah Kabupaten Lombok Timur resmi membuka pendaftaran beasiswa bagi mahasiswa asal Lotim.',
        '<p>Pemerintah Kabupaten Lombok Timur resmi membuka pendaftaran beasiswa berprestasi tahun 2026 bagi mahasiswa asal Lombok Timur. Warga Desa Masbagik Timur yang memenuhi syarat dapat segera mendaftar.</p><p>Informasi persyaratan dan pendaftaran dapat ditanyakan langsung ke kantor desa.</p>',
        '',
        'Admin Desa',
        0,
        'published',
        isoDate('2026-05-18'), isoDate('2026-05-18'), isoDate('2026-05-18')
      ]
    ];
    s.getSheetByName('news').getRange(2, 1, berita.length, berita[0].length).setValues(berita);
  }

  // 6) Seed agenda contoh
  if (s.getSheetByName('events').getLastRow() < 2) {
    var events = [
      [uid(),'Penyaluran BLT Dana Desa Tahap II','Penyaluran BLT bagi Keluarga Penerima Manfaat (KPM). Harap membawa KK dan KTP asli.','2026-05-28','Aula Kantor Desa Masbagik Timur','', nowIso()],
      [uid(),'Kerja Bakti Massal Persiapan Lomba Desa','Gotong royong membersihkan lingkungan masing-masing dusun. Diharapkan kehadiran seluruh warga.','2026-06-05','Seluruh Dusun','', nowIso()]
    ];
    s.getSheetByName('events').getRange(2, 1, events.length, events[0].length).setValues(events);
  }

  SpreadsheetApp.flush();
  Logger.log('✅ Setup selesai. Lanjutkan ke Deploy → New deployment → Web app.');
}

/**
 * Reset data contoh (settings, statistik, berita, agenda) lalu isi ulang
 * dengan data Masbagik Timur terbaru. Jalankan ini bila sebelumnya sudah
 * pernah setup dengan data lama. Kategori tidak ikut dihapus.
 */
function resetData() {
  ['settings', 'statistics', 'news', 'events'].forEach(function (n) {
    var sh = ss().getSheetByName(n);
    if (sh && sh.getLastRow() > 1) {
      sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
    }
  });
  setup();
  Logger.log('✅ Data contoh di-reset ke data Desa Masbagik Timur.');
}
