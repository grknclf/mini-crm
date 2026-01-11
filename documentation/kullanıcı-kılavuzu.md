KULLANICI KILAVUZU
 Mini-CRM, müşteri, ürün ve sipariş yönetimi işlemlerini REST tabanlı bir API üzerinden gerçekleştiren bir backend uygulamasıdır. Uygulama bir grafik arayüz içermemekte olup, kullanıcı etkileşimi API çağrıları üzerinden sağlanmaktadır.

Bu kılavuzda “kullanıcı” terimi, API’yi kullanan geliştirici veya sistem entegratörünü ifade etmektedir.

Sistem temel olarak üç ana işlev sunmaktadır: müşteri yönetimi, ürün yönetimi ve sipariş yönetimi.

Müşteri yönetimi kapsamında kullanıcılar sisteme yeni müşteri ekleyebilir ve mevcut müşterileri listeleyebilir. Yeni müşteri oluşturulurken müşteriye ait ad, soyad, e-posta ve telefon bilgileri gönderilir. E-posta veya telefon bilgilerinden en az birinin gönderilmesi zorunludur. Sistem, normalize edilmiş veriler üzerinden duplicate müşteri kontrolü yapar ve aynı müşterinin birden fazla kez sisteme eklenmesini engeller.

Ürün yönetimi kapsamında kullanıcılar sisteme ürün ekleyebilir ve ürünleri listeleyebilir. Ürün ekleme işlemi sırasında ürün adı, fiyat ve stok bilgileri gönderilir. Stok değeri negatif olamaz. Ürünler, sipariş oluşturma sürecinde stok kontrolü amacıyla kullanılmaktadır.

Sipariş yönetimi kapsamında kullanıcılar yeni sipariş oluşturabilir ve mevcut siparişleri görüntüleyebilir. Sipariş oluşturma işlemi sırasında siparişin ait olduğu müşteri bilgisi ve sipariş kalemleri gönderilir. Her sipariş kalemi için ürün ve miktar bilgisi belirtilir. Sipariş oluşturulmadan önce ürün stokları kontrol edilir. Stok yetersizliği durumunda sipariş oluşturulmaz. Başarılı bir sipariş oluşturma işleminden sonra ürün stokları otomatik olarak güncellenir.

Sistem, API çağrıları sırasında oluşabilecek hatalı durumlar için anlamlı hata mesajları döndürmektedir. Eksik alanlar, geçersiz veriler veya iş kuralı ihlalleri durumunda ilgili hata yanıtları kullanıcıya iletilir.

Eski müşteri verilerinin sisteme aktarılması için ayrıca bir ETL süreci bulunmaktadır. Firma tarafından sağlanan Excel veya CSV dosyaları, bağımsız bir ETL scripti aracılığıyla sisteme aktarılır. Bu süreçte veriler temizlenir, dönüştürülür, hatalı kayıtlar ayıklanır ve duplicate müşteri kayıtları engellenir. Bu işlem, API kullanımından bağımsız olarak terminal üzerinden gerçekleştirilir.

Mini-CRM uygulaması, temel CRM işlevlerini sağlayacak şekilde tasarlanmış olup, geliştiricilerin veya farklı sistemlerin entegrasyonuna uygun bir yapı sunmaktadır.
