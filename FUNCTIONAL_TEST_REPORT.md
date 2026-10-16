# İşlev testi — 16 Ekim 2026

## Kapsam ve yöntem

Gerçek Edge tarayıcısında üretim derlemesi üzerinde 39 senaryo çalıştırıldı:
39 başarılı, 0 başarısız. Yazma/silme işlemleri tarayıcı isteklerini yakalayan,
durum tutan izole Supabase yanıtlarıyla yapıldı. Üretim veritabanına veya
Storage'a bu senaryolarda yazılmadı. Mock başarısı, canlı RLS veya sunucu
işlemlerinin tamamının doğrulandığı anlamına gelmez.

Ayrıca canlı ana sayfada 1440 ve 390 piksel genişlikte salt okunur gezinme
yapıldı. Yedi kategori doğru başlıkları açtı; tamamlanmış resim yüklemelerinde
kırık görsel, geçersiz sayfa içi bağlantı, yatay sayfa taşması veya JavaScript
hatası görülmedi. Kaynak galerideki 47 görsel dosyası bulundu. Canlı veritabanında
49 kayıt okundu; yerel görsel referanslarının dosyaları da repoda bulundu.

## Bulunan ve düzeltilen davranışlar

- Galerinin tamamı silinince otomatik örnek veri ekleme kaldırıldı.
  Galeri boş bırakıldığında tekrar giriş yapmak eski fotoğrafları geri getirmez.
- Ana site, başarılı boş yanıtı artık boş galeri olarak gösterir.
  Bağlantı hatasındaki statik yedek görüntüleme davranışı ayrı tutulur.
- Kapak değişiminden sonraki galeri okuma hatası artık paneli busy durumunda
  bırakmaz; hata gösterilir ve işlemler yeniden kullanılabilir.
- Veritabanı silmesi başarılı, Storage temizliği başarısız olduğunda silinmiş
  fotoğraf kartı ve onay penceresi takılı kalmaz. Kapak yenileme denenir ve
  depodaki dosya temizliği için açık uyarı gösterilir.
- İsim ve silme hataları açık pencerenin içinde de görünür.
- Fotoğraf sıralaması, kayıt sayısı yerine en yüksek position değerinden
  devam eder. Önceden silinen kayıtların bıraktığı boşluklar sıralamayı bozmaz.
- İlk galeri yüklemesi başarısızsa statik örnek kartlar düzenlenebilir veri gibi
  sunulmaz; yükleme kapatılır ve yeniden deneme düğmesi gösterilir.
- İsim düzenleme penceresinde klavye odağı metin alanından başlar; Tab tuşu
  metin alanını da kapsar.
- Başarılı çıkışta seçilmiş ama yüklenmemiş görseller ve eski panel durumu temizlenir.

## Başarılı senaryolar

| Alan | Kontroller |
|---|---|
| Çoklu yükleme | 3 fotoğraf, boş kategoriden tek seferde 20 fotoğraf, mobilde 2 fotoğraf; farklı depo yolları ve tek kapak |
| Sınır | 20 doluyken seçim kapalı; 19 varken 2 seçim reddedilir; 20. fotoğraf kabul edilir |
| Seçim | Yükleme öncesi fotoğraf çıkarma; kategori değişimini iptal/onay |
| İsim | Kaydetme, boş adı engelleme, hata gösterme, ana siteye yansıma |
| Kapak | Kapak değiştirme; yenileme hatasında toparlanma; kapak silinince kalan fotoğraf |
| Silme | İptal; DB hatasında kayıt korunması; Storage hatasında doğru kart durumu; son fotoğraf ve tüm galeri boşken yeniden açma |
| Hatalı yükleme | İkinci yükleme hatası sonrası yalnız kalanları tekrar deneme; DB kayıt hatasında yüklenen dosyayı temizleme |
| Sıra | position boşluklarından sonra yeni fotoğrafın sona eklenmesi |
| Dosyalar | SVG reddi; bozuk PNG reddi; 20 MB üzeri giriş reddi; büyük görseli en fazla 1600 piksele indirme; karışık geçerli/bozuk seçim |
| Ana site | Yedi kategori; galeri büyütme, önceki/sonraki ve Escape; bağlantı hatasında yedek içerik |
| Mobil | Menü açma/Escape; taşma; admin çoklu yükleme |
| Oturum | Hatalı giriş mesajı; hatırlama açık/kapalı depolama; çıkışta token ve seçilmiş görsellerin temizlenmesi |
| Yeniden deneme | İlk okuma başarısızken yüklemeyi engelleme ve başarılı yeniden yükleme |
| Erişilebilirlik | İsim penceresinde odak, Shift+Tab/Tab, Escape |

TypeScript, üretim derlemesi ve ESLint kontrolleri geçti.

## Kanıtlar ve sınırlar

Yerel test çıktıları Codex görev dosyalarında `functional-final.json` ve
`public-functional-smoke-results.json`; tekrar çalıştırılabilir tarayıcı betikleri
`functional-audit.cjs` ve `public-functional-smoke.cjs` olarak saklandı.

Gerçek Supabase oturumuyla ekleme/silme ve gerçek iPhone Safari cihazı üzerinde
test yapılmadı. Mobil test Edge'in 390 piksel dokunmatik emülasyonudur. Gerçek
verilerde tümünü silme, yük testi, eşzamanlı farklı yöneticiler ve yedekten
kurtarma bu test grubunun kapsamına alınmadı. Telefon/WhatsApp bağlantıları
teknik olarak var; doğru işletme numarası oldukları işletme tarafından doğrulanmalı.
