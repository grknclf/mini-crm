## 1. ETL Sürecinin Amacı

Firma tarafından sağlanan Excel veya CSV formatındaki müşteri verilerinin:
- Sisteme güvenli şekilde aktarılması,
- Bozuk veya eksik verilerin tespit edilmesi,
- Veri temizleme ve dönüştürme işlemlerinin uygulanması,
- Hatalı kayıtların raporlanması,
- Mükerrer (duplicate) müşteri kayıtlarının engellenmesi

amaçlanmıştır.

---

## 2. ETL Script Yapısı

ETL süreci, uygulamadan bağımsız çalışan bir script aracılığıyla gerçekleştirilmiştir.

### 2.1 ETL Scripti

- Script dosyası: `scripts/importCustomers.js`
- Kullanılan kütüphane: `xlsx`

Bu script:
- Excel/CSV dosyasını okur,
- Satır bazlı müşteri verilerini işler,
- Her kaydı normalize ve doğrulama süreçlerinden geçirir,
- Geçerli kayıtları veritabanına aktarır.

Bu aşama ETL sürecinin **Extract (E)** ve **Load (L)** adımlarını karşılamaktadır.

---

## 3. Veri Temizleme ve Dönüştürme (Transform)

ETL sürecinin **Transform (T)** adımı, yardımcı bir modül üzerinden gerçekleştirilmiştir.

### 3.1 Veri Normalizasyonu

- Dosya: `src/helpers/customerNormalizer.js`
- Bu modül için birim testler: `tests/units/customerNormalizer.test.js`

Uygulanan işlemler:
- Boşlukların temizlenmesi (trim),
- Boş string değerlerin `null` olarak dönüştürülmesi,
- Email alanının normalize edilmesi,
- Telefon numarasının standart formata getirilmesi,
- Büyük/küçük harf uyumunun sağlanması.

Bu sayede ham veri, sistemin domain modeline uygun hale getirilmiştir.

---

## 4. Bozuk ve Eksik Verilerin Tespiti

ETL süreci sırasında aşağıdaki durumlar bozuk veya eksik veri olarak değerlendirilmiştir:
- Email ve telefon bilgilerinin her ikisinin de boş olması,
- Zorunlu alanların eksik olması,
- Formatı geçersiz veri girişleri.

Bu tür kayıtlar:
- Sisteme eklenmemiştir,
- İşlem sırasında tespit edilerek ayrıştırılmıştır.

---

## 5. Duplicate Müşteri Kayıtlarının Engellenmesi

Mükerrer müşteri problemini çözmek amacıyla duplicate kontrolü uygulanmıştır.

Duplicate kontrolü:
- Ham veri üzerinde değil,
- Normalize edilmiş veri üzerinde gerçekleştirilmiştir.

Bu yaklaşım sayesinde:
- Format farklarından kaynaklanan mükerrer kayıtlar önlenmiş,
- Aynı müşterinin birden fazla kez sisteme eklenmesi engellenmiştir.

Duplicate kontrol mantığı servis katmanında uygulanmış ve testlerle doğrulanmıştır.

---

## 6. Hatalı Kayıtların Raporlanması

ETL süreci sırasında hatalı veya geçersiz olarak değerlendirilen kayıtlar:
- Sisteme kaydedilmemiştir,
- Loglama mekanizması aracılığıyla raporlanmıştır.

Bu sayede:
- Hangi kayıtların neden işlenmediği izlenebilir hale gelmiş,
- Veri kalitesi kontrol altına alınmıştır.

---

## 7. ETL Sonuçlarının Değerlendirilmesi

Gerçekleştirilen ETL süreci sonucunda:
- Geçerli müşteri kayıtları başarıyla sisteme aktarılmıştır,
- Hatalı ve eksik kayıtlar ayıklanmıştır,
- Mükerrer kayıt problemi çözülmüştür.

ETL scripti ve yardımcı modüller sayesinde veri aktarımı kontrollü, izlenebilir ve tekrar çalıştırılabilir hale getirilmiştir.

Bu yaklaşım, sistemin veri tutarlılığını ve sürdürülebilirliğini artırmıştır.
