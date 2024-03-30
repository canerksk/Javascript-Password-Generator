$(document).ready(function () {

    var table = $('#table').DataTable({
        order: [[2, 'desc']],
    });

    var IndexedDVersion = 3;
    var IndexedDBName = "password-generator-db";
    var IndexedDBTableName = "Passwords";

    const numbers = "0123456789";
    const lowercase = "abcdefghijklmnopqrstuwvxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const special = "!@&#)(%^*?";

    var request = window.indexedDB.open(IndexedDBName, IndexedDVersion);
    var db;

    request.onerror = function (event) {
        console.error('Veritabanı açılırken hata oluştu:', event);
    };

    request.onsuccess = function (event) {
        console.log('Veritabanı açıldı:', event);
        db = event.target.result;
        loadPasswordsFromIndexedDB(); // Sayfa yüklendiğinde IndexedDB'den verileri tabloya yükle


    };

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        console.log("onupgradeneeded event occurred, creating object store...");
        const objectStore = db.createObjectStore(IndexedDBTableName, {keyPath: 'id', autoIncrement: true});
        objectStore.createIndex('password', 'password', {unique: false});
        objectStore.createIndex('description', 'description', {unique: false});
        objectStore.createIndex('created_at', 'created_at', {unique: false});
        console.log("Object store created:", IndexedDBTableName);
    };

    $("#generate-button").click(function (e) {
        e.preventDefault();
        var string = "";
        let numchecked = $('#numbers').is(":checked");
        let lowerchecked = $('#lowercase').is(":checked");
        let upperchecked = $('#uppercase').is(":checked");
        let specialchecked = $('#special').is(":checked");

        if (numchecked || lowerchecked || upperchecked || specialchecked) {
            string = buildString(numchecked, lowerchecked, upperchecked, specialchecked);

            let quantity = $("#quantity").val();
            if (quantity < 8) {
                quantity = 8;
                $("#quantity").val(8);
            }

            let password = buildPassword(string, quantity);

            $("#password").val(password);
            var copyText = document.getElementById("password");
            copyText.select();
            navigator.clipboard.writeText(copyText.value);

            savePassword(password);

        } else {
            Toast.fire({icon: 'warning', title: 'Şifre özelliği seçiniz...'});
        }

    });


    function loadPasswordsFromIndexedDB() {
        var transaction = db.transaction([IndexedDBTableName], "readonly");
        var objectStore = transaction.objectStore(IndexedDBTableName);
        var cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                table.row.add([cursor.key, cursor.value.password, cursor.value.created_at]).draw(false);
                cursor.continue();
            } else {
                console.log("Tüm veriler yüklendi.");
            }
        };

        cursorRequest.onerror = function (event) {
            console.error('Veri yüklenirken hata oluştu:', event);
        };
    }

    function buildString(numchecked, lowerchecked, upperchecked, specialchecked) {
        let answer = "";
        if (numchecked) answer += numbers;
        if (lowerchecked) answer += lowercase;
        if (upperchecked) answer += uppercase;
        if (specialchecked) answer += special;
        return answer;
    }

    function buildPassword(string, quantity) {
        let answer = "";
        for (let i = 0; i < quantity; i++) {
            const num = Math.floor(Math.random() * string.length);
            const char = string[num];
            answer += char;
        }
        return answer;
    }

    function savePassword(password) {
        var transaction = db.transaction([IndexedDBTableName], "readwrite");
        var objectStore = transaction.objectStore(IndexedDBTableName);
        var now = new Date();
        const data = {
            password: password,
            description: "",
            created_at: now
        };
        var request = objectStore.add(data);
        request.onsuccess = function (event) {
            console.log('Veri eklendi:', event.target.result);
            Toast.fire({icon: 'success', title: 'Şifre oluşturuldu'});
            table.row.add([table.rows.length + 1, password, now]).draw(false);
        };
        request.onerror = function (event) {
            console.error('Veri eklenirken hata oluştu:', event);
        };
        transaction.oncomplete = function (event) {
            console.log("Transaction tamamlandı.");
        };
    }

    $("#hepsini-sil").click(function (e) {
        var transaction = db.transaction([IndexedDBTableName], "readwrite");
        var objectStore = transaction.objectStore(IndexedDBTableName);
        var request = objectStore.clear();
        request.onsuccess = function (event) {
            table.clear().draw();
            console.log('Tüm veriler silindi:', event);
            Toast.fire({icon: 'info', title: 'Tüm şifreler silindi.'});
        };
        request.onerror = function (event) {
            console.error('Veri silinirken hata oluştu:', event);
        };
        transaction.oncomplete = function (event) {
            console.log("Transaction tamamlandı.");
        };
    });

});
