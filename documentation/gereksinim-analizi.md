# Gereksinim Analizi

## 1. Müşterinin İlettiği Eksik ve Belirsiz Talepler

Müşteri, ürün, sipariş ve veri geçişi süreçlerinde aşağıdaki belirsizlikler bulunmaktadır.

### 1.1 Müşteri Yönetimi
- Bazı müşterilerin soyadı bilgisi bulunmamaktadır.
- Aynı müşterinin birden fazla kez eklenmemesi istenmektedir; ancak aynı isimde farklı kişilerin olabileceği belirtilmiştir.
- Adres bilgisinin olması istenmiştir fakat zorunlu olup olmayacağı net değildir.

### 1.2 Ürün ve Stok Yönetimi
- Ürünlerin stok sayısının takip edilmesi istenmiştir.
- Bazı ürünlerde stok takibi yapılmadığı belirtilmiştir.
- Ürün fiyatlarının birim bazında olduğu söylenmiş; ancak bazı ürünlerde birden fazla fiyat türü olabileceği ifade edilmiştir.

### 1.3 Sipariş Yönetimi
- Müşteri bilgileri sistemde yokken de sipariş oluşturulabilmesi istenmiştir.
- Ürün stokta yoksa sistemin nasıl davranacağı belirtilmemiştir.
- Sipariş durumlarının olması gerektiği söylenmiş; ancak hangi durumların olacağı netleştirilmemiştir.

### 1.4 Veri Geçişi (ETL)
- Müşteri verilerinin yer aldığı Excel/CSV dosyalarında eksik kolonlar olabileceği belirtilmiştir.
- İsim, telefon ve email alanlarında hatalı ve tutarsız veri bulunduğu ifade edilmiştir.
- Duplicate müşteri kayıtlarının nasıl ele alınacağı net değildir.

Bu belirsizlikler nedeniyle, müşteri taleplerini netleştirmek amacıyla bir soru listesi hazırlanmıştır.

---

## 2. Soru Listesi

### 2.1 Müşteri Yönetimi İçin Sorular
1. Müşteri kaydı oluşturmak için minimum hangi alanlar zorunlu olmalıdır?
2. Soyadı olmayan müşteriler sisteme eklenebilir mi?
3. Duplicate müşteri hangi kriterlere göre tespit edilmelidir?
4. Adres bilgisi zorunlu tutulmalı mı?

### 2.2 Ürün ve Stok Yönetimi İçin Sorular
5. Tüm ürünlerde stok takibi yapılmalı mıdır?
6. Stok yetersizliği durumunda sipariş reddedilmeli midir?

### 2.3 Sipariş Yönetimi İçin Sorular
7. Sipariş birden fazla üründen oluşabilir mi?
8. Sipariş durumları detaylı şekilde tanımlanacak mıdır?

### 2.4 ETL Süreci İçin Sorular
9. Excel/CSV dosyalarında eksik kolonlara nasıl davranılmalıdır?

---

## 3.  Alınan Kararlar

Süreç içerisinde yazılımsal olarak optimum sonuçlar için sorulara cevap verilmiş varsayılıp alınan kararlar neticesinde geliştirmelere başlanmıştır.  Bu doğrultuda yapılan uygulamar şunlardır:

### 3.1 Müşteri Gereksinimleri
- Müşteri kaydı oluşturulurken email veya telefon alanlarından **en az biri zorunludur**.
- Email ve telefon bilgilerinin her ikisi de boş olan kayıtlar kabul edilmez.
- Soyadı alanı opsiyoneldir ve boş geçilebilir.
- Duplicate müşteri kontrolü **email veya telefon bilgisi üzerinden** yapılır.
- Email veya telefon bilgisi mevcut bir müşteriyle aynıysa yeni kayıt reddedilir.
- Aynı isimli ancak iletişim bilgileri farklı olan müşteriler sisteme eklenebilir.
- Adres alanı opsiyoneldir.

### 3.2 Ürün ve Stok Gereksinimleri
- Stok takibi yapılan ürünlerde stok değeri negatif olamaz.
- Stok takibi yapılan ürünlerde stok yetersizse sipariş oluşturma işlemi reddedilir.
- Stok takibi yapılmayan ürünlerde stok kontrolü ve stok düşme işlemi uygulanmaz.
- Ürünlerde çoklu fiyat türleri bu proje kapsamında desteklenmemektedir.

### 3.3 Sipariş Gereksinimleri
- Sipariş bir veya birden fazla ürün kaleminden oluşabilir.
- Sipariş oluşturulurken müşteri sistemde kayıtlı değilse, gönderilen müşteri bilgileri kullanılarak otomatik müşteri kaydı oluşturulur.
- Sipariş oluşturma işlemi atomik olacak şekilde tasarlanmıştır.
- Stok düşme, sipariş ve sipariş kalemleri tek bir transaction içerisinde gerçekleştirilir.
- Detaylı sipariş durum yönetimi bu sürümde kapsam dışıdır.

### 3.4 ETL Gereksinimleri
- Excel/CSV dosyaları üzerinden müşteri verileri sisteme aktarılabilir.
- Telefon numaraları normalize edilerek tek bir formata dönüştürülür.
- Email formatı hatalı olan kayıtlar sisteme eklenmez.
- Duplicate müşteri kontrolü, müşteri API’sinde uygulanan kurallarla aynı şekilde yapılır.
- Hatalı ve duplicate kayıtlar ETL süreci sonunda raporlanır.

---
