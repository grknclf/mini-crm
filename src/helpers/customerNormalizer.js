// unit testler için normalize islemleri.

function normalizePhone(input) {
  if (input === undefined || input === null) return null;

  const raw = String(input).trim();
  if (!raw) return null;

  let digits = raw.replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('0090')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.startsWith('90')) digits = digits.slice(2);

  if (digits.length !== 10) return null;

  return `+90${digits}`;
}

function normalizeEmail(input) {
  if (input === undefined || input === null) return null;

  const email = String(input).trim().toLowerCase();
  if (!email) return null;

  const ok =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    !email.startsWith('.') &&
    !email.endsWith('.') &&
    !email.includes('..');

  return ok ? email : null;
}

module.exports = { normalizePhone, normalizeEmail };
