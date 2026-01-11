TEKNİK DOKÜMANTASYON (MİMARİ VE TASARIM KARARLARI)

Mini-CRM uygulaması katmanlı mimari yaklaşımı benimsemektedir. Bu yaklaşım sayesinde sistemin farklı sorumlulukları birbirinden ayrılmış, kodun okunabilirliği ve sürdürülebilirliği artırılmıştır. Mimari yapı temel olarak API katmanı, servis katmanı, veri erişim katmanı ve yardımcı/cross-cutting bileşenlerden oluşmaktadır.

API katmanı, HTTP isteklerini karşılayan ve ilgili servis katmanına yönlendiren uç noktaları içermektedir. Bu katmanda iş kuralı barındırılmamış, yalnızca istek doğrulama ve yönlendirme işlemleri yapılmıştır. API katmanı, REST prensiplerine uygun olarak tasarlanmıştır.

Servis katmanı, uygulamanın iş kurallarının uygulandığı ana katmandır. Müşteri oluşturma, ürün stok kontrolü, sipariş oluşturma, duplicate kontrolü gibi tüm kritik iş kuralları bu katmanda ele alınmıştır. Bu tercih, iş mantığının merkezi bir noktada toplanmasını ve tekrar kullanılabilir olmasını sağlamıştır.

Veri erişim katmanı Sequelize ORM kullanılarak tasarlanmıştır. Veritabanı işlemleri Sequelize modelleri üzerinden gerçekleştirilmiştir. ORM kullanımı sayesinde veritabanı bağımlılığı azaltılmış, migration yapısı ile şema değişiklikleri kontrollü ve versiyonlanabilir hale getirilmiştir.

Veritabanı olarak PostgreSQL tercih edilmiştir. PostgreSQL, ilişkisel veri modeline uygunluğu ve güçlü transaction desteği nedeniyle seçilmiştir. Veritabanı bulut ortamında Render platformu üzerinde çalışmaktadır. Bu tercih, kurulum kolaylığı ve çevrimdışı bağımlılıkların azaltılması amacıyla yapılmıştır.

Veritabanı şeması migration’lar aracılığıyla yönetilmektedir. Her migration dosyası tek bir şema değişikliğini temsil edecek şekilde tasarlanmıştır. Bu sayede veritabanı şemasının zaman içerisindeki evrimi izlenebilir hale gelmiştir ve farklı ortamlarda tutarlı kurulum sağlanmıştır.

ETL süreci, ana uygulamadan bağımsız bir script olarak tasarlanmıştır. Bu yaklaşım, eski müşteri verilerinin sisteme tek seferlik veya ihtiyaç duyulduğunda kontrollü bir şekilde aktarılmasını sağlamaktadır. ETL sürecinde veri temizleme, dönüştürme, bozuk veri tespiti ve duplicate kontrolü uygulanmıştır. Bu işlemler, yardımcı modüller ve servis katmanı ile entegre şekilde gerçekleştirilmiştir.

Loglama mekanizması merkezi bir yapı üzerinden ele alınmıştır. Uygulama genelinde oluşan olaylar ve hatalar tek bir logger üzerinden kayıt altına alınmıştır. Ayrıca istek bazlı izlenebilirlik sağlamak amacıyla request context yaklaşımı kullanılmıştır. Bu sayede hata ayıklama ve sistem davranışının izlenmesi kolaylaştırılmıştır.

Konfigürasyon yönetimi ortam değişkenleri üzerinden yapılmıştır. Bu yaklaşım ile hassas bilgiler koddan ayrılmış ve farklı ortamlar için esnek bir yapı sağlanmıştır. Aynı kod tabanı, farklı ortamlarda yalnızca ortam değişkenleri değiştirilerek çalıştırılabilmektedir.

Test süreçlerinde Jest test framework’ü kullanılmıştır. Uygulama hem birim testler hem de entegrasyon testleri ile doğrulanmıştır. Kritik iş kuralları testler ile güvence altına alınmış, test kapsama oranları ile kod kalitesi ölçülmüştür. Bu yaklaşım, yapılan değişikliklerin sistem davranışını olumsuz etkilememesini sağlamaktadır.

Sonuç olarak Mini-CRM uygulaması; katmanlı mimari yapısı, kontrollü veritabanı yönetimi, bağımsız ETL süreci, merkezi loglama ve test odaklı geliştirme yaklaşımı ile sürdürülebilir ve genişletilebilir bir backend sistemi olarak tasarlanmıştır.
