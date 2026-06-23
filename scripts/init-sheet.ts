/**
 * Inisialisasi Spreadsheet: buat semua tab, isi baris header,
 * dan seed data contoh (settings, statistik, kategori, 2 berita).
 *
 * Jalankan: npm run init-sheet
 * Prasyarat: .env terisi (GOOGLE_*), dan spreadsheet sudah di-share
 * ke email service account dengan akses Editor.
 */
import { config } from "dotenv";
import { google } from "googleapis";
import { SHEET_HEADERS, SHEETS } from "../packages/lib/src/types";
import { generateId, slugify } from "../packages/lib/src/utils";

config();

function client() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  const id = process.env.GOOGLE_SHEET_ID;
  if (!email || !key || !id) {
    throw new Error(
      "Env GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID wajib diisi di .env",
    );
  }
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return { sheets: google.sheets({ version: "v4", auth }), id };
}

const now = () => new Date().toISOString();

async function main() {
  const { sheets, id } = client();

  // 1. Ambil tab yang sudah ada
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: id,
    fields: "sheets.properties(title)",
  });
  const existing = new Set(
    meta.data.sheets?.map((s) => s.properties?.title) ?? [],
  );

  // 2. Buat tab yang belum ada
  const toCreate = Object.values(SHEETS).filter((t) => !existing.has(t));
  if (toCreate.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: id,
      requestBody: {
        requests: toCreate.map((title) => ({
          addSheet: { properties: { title } },
        })),
      },
    });
    console.log(`✅ Tab dibuat: ${toCreate.join(", ")}`);
  } else {
    console.log("ℹ️  Semua tab sudah ada, hanya memastikan header & seed.");
  }

  // 3. Tulis header di tiap tab
  for (const [name, headers] of Object.entries(SHEET_HEADERS)) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: id,
      range: `${name}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    });
  }
  console.log("✅ Header ditulis di semua tab.");

  // 4. Seed settings (hanya jika kosong)
  const settingsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: `${SHEETS.settings}!A2:B`,
  });
  if ((settingsRes.data.values ?? []).length === 0) {
    const settings: [string, string][] = [
      ["namaDesa", "Desa Sukamaju"],
      ["slogan", "Desa Transparan, Desa Digital, Desa Maju"],
      ["sejarah", "Tuliskan sejarah desa di sini melalui menu Pengaturan."],
      ["visi", "Mewujudkan desa yang maju, mandiri, dan sejahtera."],
      ["misi", "Meningkatkan pelayanan publik; mengembangkan potensi desa; mendorong transparansi."],
      ["sambutan", "Selamat datang di website resmi desa kami."],
      ["alamat", "Jl. Raya Desa No. 1, Kecamatan, Kabupaten"],
      ["telepon", "(021) 1234-5678"],
      ["email", "info@desaku.id"],
      ["jamOperasional", "Senin - Jumat, 08.00 - 16.00 WIB"],
      ["whatsapp", "628123456789"],
      ["mapsEmbed", ""],
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: id,
      range: `${SHEETS.settings}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: settings },
    });
    console.log("✅ Seed pengaturan ditambahkan.");
  }

  // 5. Seed statistik (hanya jika kosong)
  const statRes = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: `${SHEETS.statistics}!A2:C`,
  });
  if ((statRes.data.values ?? []).length === 0) {
    const stats: [string, string, string][] = [
      ["penduduk", "Jumlah Penduduk", "4500"],
      ["kk", "Jumlah KK", "1200"],
      ["rt", "Jumlah RT", "24"],
      ["rw", "Jumlah RW", "6"],
      ["dusun", "Jumlah Dusun", "4"],
      ["luas", "Luas Wilayah (Ha)", "850"],
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: id,
      range: `${SHEETS.statistics}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: stats },
    });
    console.log("✅ Seed statistik ditambahkan.");
  }

  // 6. Seed kategori (hanya jika kosong)
  const catRes = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: `${SHEETS.categories}!A2:C`,
  });
  if ((catRes.data.values ?? []).length === 0) {
    const cats = [
      "Pemerintahan",
      "Pendidikan",
      "Kesehatan",
      "Pertanian",
      "Pariwisata",
      "UMKM",
      "Infrastruktur",
    ].map((name) => [generateId(), name, slugify(name)]);
    await sheets.spreadsheets.values.append({
      spreadsheetId: id,
      range: `${SHEETS.categories}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: cats },
    });
    console.log("✅ Seed kategori berita ditambahkan.");
  }

  // 7. Seed 1 berita contoh (hanya jika kosong)
  const newsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: `${SHEETS.news}!A2:A`,
  });
  if ((newsRes.data.values ?? []).length === 0) {
    const t = now();
    const row = [
      generateId(),
      "Selamat Datang di Website Desa Digital",
      "selamat-datang-di-website-desa-digital",
      "Pemerintahan",
      "Website resmi desa kini hadir sebagai pusat informasi dan transparansi pemerintahan.",
      "<p>Dengan bangga kami meluncurkan website resmi desa sebagai sarana informasi, transparansi, dan pelayanan kepada masyarakat. Melalui website ini, warga dapat mengakses berita terbaru, agenda kegiatan, dokumen publik, serta potensi desa.</p>",
      "",
      "Admin Desa",
      "0",
      "published",
      t,
      t,
      t,
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: id,
      range: `${SHEETS.news}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
    console.log("✅ Seed berita contoh ditambahkan.");
  }

  console.log("\n🎉 Inisialisasi spreadsheet selesai!");
}

main().catch((err) => {
  console.error("❌ Gagal inisialisasi:", err.message ?? err);
  process.exit(1);
});
