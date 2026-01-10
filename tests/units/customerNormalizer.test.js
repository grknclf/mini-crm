const {
  normalizePhone,
  normalizeEmail
} = require('../../src/helpers/customerNormalizer');

describe('customerNormalizer', () => {
  describe('normalizePhone', () => {
    test('null / undefined / empty => null', () => {
      expect(normalizePhone(null)).toBeNull();
      expect(normalizePhone(undefined)).toBeNull();
      expect(normalizePhone('   ')).toBeNull();
    });

    test('turkish phone formats', () => {
      expect(normalizePhone('0532 111 22 33')).toBe('+905321112233');
      expect(normalizePhone('+90 (532) 111-22-33')).toBe('+905321112233');
      expect(normalizePhone('00905321112233')).toBe('+905321112233');
      expect(normalizePhone('905321112233')).toBe('+905321112233');
    });

    test('invalid length returns null', () => {
      expect(normalizePhone('1112233')).toBeNull();
      expect(normalizePhone('123')).toBeNull();
    });
  });

  describe('normalizeEmail', () => {
    test('null / undefined / empty => null', () => {
      expect(normalizeEmail(null)).toBeNull();
      expect(normalizeEmail(undefined)).toBeNull();
      expect(normalizeEmail('   ')).toBeNull();
    });

    test('lowercase + trim', () => {
      expect(
        normalizeEmail('  AHMET.YILMAZ@MAIL.COM ')
      ).toBe('ahmet.yilmaz@mail.com');
    });

    test('invalid emails', () => {
      expect(normalizeEmail('ceren@@mail.com')).toBeNull();
      expect(normalizeEmail('esra_arslanmail.com')).toBeNull();
      expect(normalizeEmail('.a@b.com')).toBeNull();
      expect(normalizeEmail('a@b.com.')).toBeNull();
      expect(normalizeEmail('a..b@c.com')).toBeNull();
    });
  });
});
