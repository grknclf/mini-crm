KURULUM REHBERİ

Bu doküman, Mini-CRM uygulamasının kurulumu, yapılandırılması ve çalıştırılması için gerekli adımları açıklamaktadır. Uygulama Node.js tabanlı bir backend servisidir ve PostgreSQL veritabanı kullanmaktadır. Proje kapsamında PostgreSQL veritabanı bulut ortamında Render platformu üzerinde çalışmaktadır. Uygulama, konfigürasyon bilgilerini ortam değişkenleri üzerinden almakta ve Sequelize ORM aracılığıyla veritabanı ile haberleşmektedir.

Uygulamanın çalıştırılabilmesi için Node.js (v18 veya üzeri) ve npm kurulu olmalıdır. Veritabanı olarak PostgreSQL kullanılmaktadır ancak veritabanı Render üzerinde çalıştığı için yerel ortamda PostgreSQL kurulması zorunlu değildir.

Proje kaynak kodları GitHub üzerinden veya teslim edilen proje klasörü aracılığıyla edinilir. Proje dizinine geçildikten sonra gerekli bağımlılıklar npm üzerinden yüklenir.

Kurulum adımları aşağıdaki gibidir:

1. Proje dizinine girilir.
2. Gerekli bağımlılıklar yüklenir.
3. Ortam değişkenleri tanımlanır.
4. Veritabanı migration işlemleri çalıştırılır.
5. Uygulama başlatılır.

Bağımlılıkların kurulması için proje dizininde aşağıdaki komut çalıştırılır:

npm install

Uygulamanın çalışabilmesi için proje kök dizininde bir .env dosyası oluşturulmalıdır. Bu dosya, Render platformu üzerinde çalışan PostgreSQL veritabanına ait bağlantı bilgilerini içermelidir. Örnek .env dosyası aşağıdaki gibidir:

NODE_ENV=development
DB_HOST=<render_postgres_host>
DB_PORT=5432
DB_NAME=<render_postgres_database>
DB_USER=<render_postgres_user>
DB_PASSWORD=<render_postgres_password>

Veritabanı şeması Sequelize ORM kullanılarak migration yapısı ile yönetilmektedir. Gerekli tabloların oluşturulması ve şema güncellemelerinin uygulanması için aşağıdaki komut çalıştırılır:

npm run migrate

Uygulama geliştirme ortamında aşağıdaki komut ile başlatılır:

npm run dev

Uygulama varsayılan olarak http://localhost:3000 adresinde çalışmaktadır.

Uygulama testleri Jest test framework’ü kullanılarak yazılmıştır. Testleri çalıştırmak için aşağıdaki komut kullanılabilir:

npm test

Test kapsama raporu almak için aşağıdaki komut çalıştırılır:

npm run test:coverage

Bu işlem sonucunda kapsama raporu coverage dizini altında oluşturulur.

Firma tarafından sağlanan eski müşteri verilerinin sisteme aktarılması için bağımsız bir ETL scripti geliştirilmiştir. Bu script, Excel veya CSV formatındaki dosyaları okuyarak veri temizleme, dönüştürme ve duplicate kontrolü işlemlerini gerçekleştirir. ETL scripti aşağıdaki komut ile çalıştırılır:

node scripts/importCustomers.js

Geçerli müşteri kayıtları veritabanına eklenirken, hatalı veya eksik kayıtlar sisteme dahil edilmez ve loglama mekanizması aracılığıyla raporlanır.

Uygulamada kullanılan PostgreSQL veritabanı Render platformu üzerinde çalışmaktadır. Tüm veritabanı şema değişiklikleri migration’lar aracılığıyla yönetilmekte, konfigürasyon bilgileri koddan bağımsız olarak ortam değişkenleri üzerinden sağlanmaktadır.
