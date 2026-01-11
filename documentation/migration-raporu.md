## 1. Migration Yaklaşımı

Migration yapısı, veritabanı şemasının kod ile birlikte versiyonlanmasını sağlamak amacıyla kullanılmıştır. Her migration dosyası, veritabanında yapılan yapısal bir değişikliği temsil etmektedir.

Migration dosyaları aşağıdaki prensiplere göre tasarlanmıştır:
- Her migration tek bir sorumluluğa sahiptir.
- Şema değişiklikleri geri alınabilir olacak şekilde (`up` / `down`) tanımlanmıştır.
- Migration’lar sıralı ve idempotent olacak şekilde çalıştırılmıştır.

---

## 2. Şema Oluşturma ve Güncelleme Adımları

### 2.1 Customers Tablosu

İlk migration adımında müşteri bilgilerini tutmak amacıyla **customers** tablosu oluşturulmuştur.

Bu tabloda:
- Müşteri temel bilgileri (ad, soyad, email, phone) tutulmaktadır.
- Email ve telefon alanları opsiyonel tanımlanmış, ancak uygulama seviyesinde en az birinin zorunlu olması kuralı uygulanmıştır.

Amaç:
- Farklı müşteri tanımlama senaryolarını desteklemek,
- Esnek ama kontrollü bir müşteri veri modeli oluşturmaktır.

---

### 2.2 Products Tablosu

İkinci aşamada ürün bilgilerini ve stok durumunu tutmak için **products** tablosu oluşturulmuştur.

Bu tabloda:
- Ürün adı ve fiyat bilgileri,
- Stok miktarı bilgisi yer almaktadır.

Amaç:
- Sipariş oluşturma sürecinde stok kontrolünün sağlanması,
- Ürün bazlı envanter yönetiminin desteklenmesidir.

---

### 2.3 Orders Tablosu

Sipariş üst bilgilerini tutmak amacıyla **orders** tablosu oluşturulmuştur.

Bu tabloda:
- Siparişin hangi müşteriye ait olduğu,
- Sipariş oluşturulma zamanı
bilgileri tutulmaktadır.

Amaç:
- Sipariş işlemlerinin müşteri bazlı olarak izlenebilmesini sağlamak,
- Sipariş yaşam döngüsünü yönetmektir.

---

### 2.4 Order_Items Tablosu

Sipariş ile ürün arasındaki çoktan çoğa ilişkiyi modellemek amacıyla **order_items** tablosu oluşturulmuştur.

Bu tabloda:
- Sipariş ve ürün ilişkisi,
- Sipariş edilen ürün miktarı,
- Sipariş anındaki birim fiyat bilgisi
yer almaktadır.

Amaç:
- Bir siparişin birden fazla ürün içerebilmesini sağlamak,
- Sipariş anındaki fiyat bilgisinin korunmasıdır.

---

## 3. İlişkiler ve Kısıtlar

Migration’lar sırasında tablolar arası ilişkiler ve temel kısıtlar tanımlanmıştır:

- `orders.customer_id` alanı ile customers tablosuna yabancı anahtar ilişkisi kurulmuştur.
- `order_items.order_id` alanı ile orders tablosuna ilişki tanımlanmıştır.
- `order_items.product_id` alanı ile products tablosuna ilişki tanımlanmıştır.
- Aynı sipariş içerisinde aynı ürünün tekrar edilmesini önlemek amacıyla benzersiz kombinasyon kısıtı uygulanmıştır.
- Stok ve miktar alanları için mantıksal bütünlük kuralları dikkate alınmıştır.

---
