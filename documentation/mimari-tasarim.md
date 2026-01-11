## 1. Veritabanı Şeması

Uygulamada ilişkisel bir veritabanı modeli kullanılmıştır. Veritabanı olarak PostgreSQL tercih edilmiş ve bulut ortamında Render platformu üzerinde kurulmuştur. Uygulama, veritabanı ile Sequelize ORM aracılığıyla haberleşmektedir.
customers: Müşteri bilgilerini tutar.
products: Ürün ve stok bilgilerini tutar.
orders: Siparişe ait üst bilgileri tutar.
order_items: Sipariş ile ürün arasındaki ilişkiyi temsil eden sipariş kalemlerini tutar.

### İlişkiler
- Bir müşteri birden fazla sipariş verebilir (customers - orders).
- Bir sipariş birden fazla sipariş kalemi içerebilir (orders - order_items).
- Bir ürün birden fazla sipariş kaleminde yer alabilir (products - order_items).

### Temel Kısıtlar
- Müşteri için email veya phone alanlarından en az biri zorunludur.
- Ürün stok değeri negatif olamaz.
- Sipariş kalemi miktarı sıfırdan büyük olmalıdır.
- Aynı sipariş içerisinde aynı ürün yalnızca bir kez yer alabilir.

## 2. Modüller ve Servisler

### 2.1 Katmanlı Mimari Yapı

- **API Katmanı (Routes):**  
  HTTP isteklerini karşılar ve ilgili servisleri çağırır.  
  Dizin: `src/routes/`

- **Service Katmanı:**  
  İş kuralları bu katmanda uygulanır (stok kontrolü, duplicate kontrolü, sipariş oluşturma).  
  Dizin: `src/services/`

- **Veri Erişim Katmanı (Models):**  
  Sequelize modelleri üzerinden veritabanı işlemleri gerçekleştirilir.  
  Dizin: `src/models/`

- **Cross-cutting Bileşenler:**  
  Logging, request context, konfigürasyon ve yardımcı fonksiyonlar.  
  Dizinler: `src/lib/`, `src/middlewares/`, `src/config/`, `src/helpers/`

- **ETL / Script Katmanı:**  
  Dış kaynaktan veri içe aktarma işlemleri.  
  Dizin: `scripts/`

---

### 2.2 Customer Modülü

**Amaç:**  
Müşteri CRUD işlemlerinin ve müşteri verisinin normalize edilmesi.

**Bileşenler:**
- Route: `src/routes/customers.js`
- Service: `src/services/customerService.js`
- Model: `src/models/customer.js`
- Helper: `src/helpers/customerNormalizer.js`

**İş Kuralları:**
- Email veya telefon alanlarından en az biri zorunludur.
- Müşteri verisi normalize edilerek tekrarlanan kayıtlar engellenir.

---

### 2.3 Product Modülü

**Amaç:**  
Ürün yönetimi ve stok kontrolü.

**Bileşenler:**
- Route: `src/routes/products.js`
- Service: `src/services/productService.js`
- Model: `src/models/product.js`

**İş Kuralları:**
- Stok değeri negatif olamaz.
- Stok güncellemeleri servis katmanında yönetilir.

---

### 2.4 Order Modülü

**Amaç:**  
Sipariş oluşturma ve sipariş detaylarının yönetimi.

**Bileşenler:**
- Route: `src/routes/orders.js`
- Service: `src/services/orderService.js`
- Models: `src/models/order.js`, `src/models/orderItem.js`

**İş Kuralları:**
- Sipariş oluşturulmadan önce ürün stokları kontrol edilir.
- Sipariş kalemleri order_items tablosuna kaydedilir.
- Başarılı işlem sonrası ürün stokları düşülür.

---

### 2.5 ETL / Veri İçe Aktarma Modülü

**Amaç:**  
Excel dosyası üzerinden müşteri verisini sisteme aktarmak.

**Bileşen:**
- Script: `scripts/importCustomers.js`

---

## 3. API Uçlarının Listesi

API uçları OpenAPI standardına uygun olarak tanımlanmıştır.  
Tanım dosyası: `src/docs/openapi.json`

### Customers
- `GET /api/customers`
- `POST /api/customers`

### Products
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`

### Orders
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders`

---

## 4. Logging, Konfigürasyon ve Migration Yapıları

### 4.1 Logging

Uygulamada merkezi bir loglama altyapısı kullanılmıştır. Loglama işlemleri "src/lib/logger.js" dosyasında tanımlanan logger üzerinden gerçekleştirilmektedir. Bu yapı sayesinde uygulama genelinde tutarlı ve standart bir log formatı sağlanmıştır.

İstek bazlı izlenebilirliği artırmak amacıyla "src/middlewares/requestContext.js" middleware’i kullanılmıştır. Bu middleware her HTTP isteği için bir bağlam (örneğin request kimliği) oluşturarak, aynı isteğe ait logların ilişkilendirilebilir şekilde tutulmasını sağlar. Böylece hata ayıklama ve izleme süreçleri kolaylaştırılmıştır.

Loglama altyapısı özellikle:
- API isteklerinin başlangıç ve bitiş noktalarının izlenmesi,
- İş kuralı hatalarının kaydedilmesi,
- Beklenmeyen sistem hatalarının tespit edilmesi  
amaçlarıyla kullanılmıştır.

---

### 4.2 Konfigürasyon

Uygulama konfigürasyonu ortam değişkenleri ve merkezi bir konfigürasyon dosyası üzerinden yönetilmektedir. Bu yaklaşım, farklı çalışma ortamlarında (development, test, production) aynı kod tabanının kullanılabilmesini sağlar.

Konfigürasyon yönetiminde:
- "src/config/index.js" dosyası, uygulama genelinde kullanılacak ayarları merkezi olarak tanımlar.
- ".env" dosyası üzerinden veritabanı bağlantı bilgileri, uygulama portu ve ortam bilgileri (NODE_ENV) yönetilir.

Bu yapı sayesinde:
- Hassas bilgiler (veritabanı şifresi vb.) kod içerisine gömülmemiştir,
- Ortam bazlı konfigürasyon değişiklikleri kolaylaştırılmıştır,
- Bulut ortamında (Render) çalışan uygulama için esnek bir yapı sağlanmıştır.

---

### 4.3 Migration

Veritabanı şeması, Sequelize ORM’in sunduğu migration mekanizması kullanılarak yönetilmiştir. Migration yaklaşımı, veritabanı yapısının kod ile birlikte versiyonlanmasını ve kontrol altında tutulmasını sağlar.

Her migration dosyası, veritabanında yapılacak yapısal bir değişikliği (tablo oluşturma, alan ekleme, ilişki tanımlama vb.) temsil eder. Bu dosyalar iki temel fonksiyon içerir:

- up: Veritabanı şemasında ileri yönde yapılacak değişiklikleri tanımlar.
- down: İlgili değişikliklerin geri alınmasını sağlar.

Bu sayede migration’lar geri alınabilir (rollback) nitelikte tasarlanmıştır.

Uygulamada migration dosyaları `migrations/` klasörü altında tutulmakta ve Sequelize CLI aracılığıyla çalıştırılmaktadır. Migration işlemi aşağıdaki npm run migrate ile gerçekleştirilmiştir.

