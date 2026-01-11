# Mini-CRM

Mini-CRM, müşteri, ürün ve sipariş yönetimi işlemlerini gerçekleştiren, Node.js tabanlı bir backend uygulamasıdır. Uygulama REST mimarisine uygun olarak tasarlanmış olup, veritabanı olarak PostgreSQL kullanmaktadır. PostgreSQL veritabanı bulut ortamında Render platformu üzerinde çalışmaktadır.

Bu proje, yazılım mimarisi, veritabanı tasarımı, ETL süreçleri, test ve dokümantasyon konularını kapsayan akademik bir çalışma kapsamında geliştirilmiştir.

---

## Projenin Amacı

Mini-CRM uygulamasının amacı:
- Müşteri, ürün ve sipariş verilerinin yönetilmesi
- İş kurallarının servis katmanında uygulanması
- Eski müşteri verilerinin ETL süreci ile sisteme aktarılması
- Test edilebilir ve sürdürülebilir bir backend mimarisi oluşturulmasıdır

---

## Kullanılan Teknolojiler

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Jest
- OpenAPI (Swagger)
- Render (PostgreSQL)

---

## Mimari Yapı

Uygulama katmanlı mimari yaklaşımı ile tasarlanmıştır. API katmanı HTTP isteklerini karşılamakta, servis katmanı iş kurallarını uygulamakta, veri erişim katmanı ise Sequelize modelleri aracılığıyla veritabanı işlemlerini gerçekleştirmektedir. Loglama, konfigürasyon ve ETL süreçleri yardımcı bileşenler olarak ele alınmıştır.

---

## Veritabanı

Veritabanı olarak PostgreSQL kullanılmıştır. Veritabanı şeması Sequelize migration yapısı ile yönetilmekte olup, tüm şema değişiklikleri migration dosyaları üzerinden uygulanmaktadır. PostgreSQL servisi Render platformu üzerinde çalışmaktadır.

---

## ETL Süreci

Firma tarafından sağlanan eski müşteri verilerinin sisteme aktarılması için bağımsız bir ETL scripti geliştirilmiştir. Bu script, Excel veya CSV formatındaki dosyaları okuyarak veri temizleme, dönüştürme, hatalı veri tespiti ve duplicate müşteri kontrolü işlemlerini gerçekleştirmektedir.

---

## Testler

Uygulama, Jest test framework’ü kullanılarak test edilmiştir. Birim testler ve entegrasyon testleri yazılmış, test kapsama oranları ölçülerek kritik iş kuralları doğrulanmıştır.

---

## API Dokümantasyonu

Uygulamanın tüm API uçları OpenAPI standardına uygun olarak dokümante edilmiştir. API dokümantasyonu `src/docs/openapi.json` dosyasında yer almaktadır ve Swagger UI gibi araçlar ile görüntülenebilir.

---

## Kurulum ve Çalıştırma

Uygulamanın kurulumu, yapılandırılması ve çalıştırılması için gerekli adımlar `kurulum-rehberi.md` dosyasında detaylı olarak açıklanmıştır.

---

## Geliştirme Süreci

Proje ekip çalışması şeklinde geliştirilmiştir. Kod değişiklikleri Git üzerinden versiyonlanmış, Pull Request ve merge süreçleri ile code review uygulanmıştır. Bu sayede kod kalitesi ve izlenebilirlik sağlanmıştır.
