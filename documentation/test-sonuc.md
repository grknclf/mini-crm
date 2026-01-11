### Test Yaklaşımı

Uygulamada test süreçleri Jest test framework’ü kullanılarak gerçekleştirilmiştir. Testler hem birim (unit test) hem de entegrasyon (integration test) seviyesinde ele alınmıştır.

- **Birim Testler:**  
  Yardımcı fonksiyonlar ve iş kurallarının doğruluğunu test etmek amacıyla yazılmıştır.  
  Örnek: `customerNormalizer` fonksiyonunun farklı giriş senaryoları.

- **Entegrasyon Testleri:**  
  API uçlarının uçtan uca çalışmasını doğrulamak amacıyla yazılmıştır.  
  Örnek: müşteri oluşturma ve müşteri listeleme uçları.

Testler, izole bir test ortamında (`NODE_ENV=test`) çalıştırılmıştır.

---

### Test Kapsamı (Coverage) Sonuçları

Test kapsama ölçümü Jest’in `--coverage` özelliği kullanılarak alınmıştır. Elde edilen genel kapsama oranları aşağıda verilmiştir:

- **Line Coverage:** %66.51  
- **Function Coverage:** %72.92  
- **Branch Coverage:** %48.89  

---

### Değerlendirme

Elde edilen kapsama oranları, proje ölçeği ve kapsamı dikkate alındığında yeterli seviyededir. Kritik iş kuralları (müşteri doğrulama, sipariş oluşturma akışı, stok kontrolü) testler ile doğrulanmıştır.

Branch coverage oranının diğer kapsama metriklerine göre daha düşük olması, bazı koşullu akışların (hata senaryoları ve istisnai durumlar) sınırlı sayıda test edilmesinden kaynaklanmaktadır. Buna rağmen sistemin temel fonksiyonlarının güvenilir şekilde çalıştığı testler ile doğrulanmıştır.
