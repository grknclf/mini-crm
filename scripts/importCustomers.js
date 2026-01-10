// Excel dosyasından müşteri verisi okuyup sisteme aktarma işlemi yaptım.
// Tüm iş kuralları CustomerService üzerinden çalıştırdım. Rapor ürettim.

const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

const customerService = require('../src/services/customerService');
const { sequelize } = require('../src/models');

function normalizeHeader(h) {
  return String(h || '')
    .trim()
    .toLowerCase()
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c');
}

function pick(row, key) {
  const normKey = normalizeHeader(key);
  const found = Object.keys(row).find(k => normalizeHeader(k) === normKey);
  return found ? row[found] : undefined;
}

function toStringOrNull(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s || null;
}

function splitAddressAndNote(addressRaw, noteRaw) {
  let address = toStringOrNull(addressRaw);
  let note = toStringOrNull(noteRaw);

  if (!address) {
    return { address: null, note: note ?? null };
  }

  const re = /(?:\s*[|,-]\s*)?\bnot\s*:\s*/i;
  if (!re.test(address)) {
    return { address, note };
  }

  const parts = address.split(re);
  const addrPart = toStringOrNull(parts[0]);
  const noteFromAddress = toStringOrNull(parts.slice(1).join(' '));

  if (noteFromAddress) {
    note = note ? `${note}; ${noteFromAddress}` : noteFromAddress;
  }

  return { address: addrPart, note };
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Kullanım: node scripts/importCustomers.js <dosya.xlsx>');
    process.exit(1);
  }

  const fullPath = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(fullPath)) {
    console.error('Dosya bulunamadı:', fullPath);
    process.exit(1);
  }

  await sequelize.authenticate();

  const workbook = xlsx.readFile(fullPath);
  const sheetName = workbook.SheetNames[0];
  const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

  const report = {
    file: fullPath,
    sheet: sheetName,
    totalRows: rows.length,
    inserted: 0,
    skippedDuplicate: 0,
    skippedInvalid: 0,
    errors: 0,
    details: []
  };

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    const firstName = toStringOrNull(pick(r, 'Ad'));
    const lastName = toStringOrNull(pick(r, 'Soyad'));
    const phone = toStringOrNull(pick(r, 'Telefon'));
    const email = toStringOrNull(pick(r, 'Mail'));

    const { address, note } = splitAddressAndNote(
      pick(r, 'Adres'),
      pick(r, 'Not')
    );

    if (!firstName || (!email && !phone)) {
      report.skippedInvalid++;
      report.details.push({
        row: i + 2,
        status: 'SKIPPED_INVALID',
        reason: !firstName
          ? 'Ad (firstName) boş'
          : 'Mail veya telefon alanlarından en az biri zorunlu'
      });
      continue;
    }

    try {
      const created = await customerService.createCustomer({
        firstName,
        lastName,
        phone,
        email,
        address,
        note
      });

      report.inserted++;
      report.details.push({ row: i + 2, status: 'INSERTED', id: created.id });
    } catch (err) {
      const statusCode = Number(err?.statusCode) || 500;

      if (statusCode === 409) {
        report.skippedDuplicate++;
        report.details.push({
          row: i + 2,
          status: 'SKIPPED_DUPLICATE',
          reason: err.message
        });
        continue;
      }

      report.errors++;
      report.details.push({
        row: i + 2,
        status: 'ERROR',
        statusCode,
        message: err.message
      });
    }
  }

  const outDir = path.resolve(process.cwd(), 'etl_reports');
  fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, `customers_import_report_${Date.now()}.json`);
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf-8');

  console.log('ETL tamamlandı.');
  console.log('Toplam satır:', report.totalRows);
  console.log('Eklendi:', report.inserted);
  console.log('Duplicate atlandı:', report.skippedDuplicate);
  console.log('Geçersiz atlandı:', report.skippedInvalid);
  console.log('Hata:', report.errors);
  console.log('Rapor:', outFile);

  await sequelize.close();
}

main().catch(async (e) => {
  console.error('ETL fatal hata:', e);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});
