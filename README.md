# Javascript Password Generator

TR:
Hem çevrimiçi hem de çevrimdışı kullanabileceğiniz yerel bir şifre oluşturucudur. Oluşturulan şifreler tarayıcı IndexedDB'de depolanır, tarayıcı sıfırlamadığınız veya uygulama içinden Hepsini sil seçeneğini seçmediğiniz sürece oluşturulan şifreler tarayıcı veritabanında süresiz olarak kalır.

Tarayıcınızın araç çubuğuna ekleyerek hızlı bir şekilde ulaşarak hızlı bir şekilde güvenli şifreler oluşturabilirsiniz.

CDN kullanılmıştır, bu sebeple internet bağlantısı ihtiyacı olabilir, isteğe göre CDNler yerel depoya çekilerek çevrimdışı olarak da kullanılabilir.

Bootstrap 5.3, JQuery 3.6.0, SweetAlert2 kullanılmıştır.
Şifre kombinasyonları mevcuttur.


*Yapılacaklar;

IndexedDB depolanan şifreler güvenlik amaçlı tekrar şifrelenecektir.
Oluşturulan şifrelere, nerede kullanıldığını hatırlama amacı ile not/açıklama eklenecek.


EN:

It is a password generator that can be used both online and offline. The generated passwords are stored in the browser's IndexedDB, and they will remain in the browser's database indefinitely unless you reset the browser or choose the option to delete all passwords from within the application.

By adding it to your browser's toolbar, you can quickly access it and generate secure passwords.

A CDN is used, so an internet connection may be required, but you can also cache the CDNs locally and use it offline if desired.

Bootstrap 5.3, JQuery 3.6.0, and SweetAlert2 are used.
There are password combinations available.

*To-do:

The passwords stored in IndexedDB will be re-encrypted for security purposes.
A note/description will be added to the generated passwords to remember where they are used.
