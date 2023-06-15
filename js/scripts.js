$(document).ready(function () {

    var table = $('#table').DataTable({
        order: [[2, 'desc']],
    });
    const numbers = "0123456789";
    const lowercase = "abcdefghijklmnopqrstuwvxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const special = "!@&#)(%^*?";

    var now = new Date();

    if (window.openDatabase) {
        db = openDatabase('password-generator-db', '1.0', 'Password Generator Web SQL DB', -1);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Passwords', [], function (tx, results) {
                var len = results.rows.length, i;
                for (i = 0; i < len; i++) {
                    //console.log(results.rows.item(i).password ); 
                    table.row.add([i, results.rows.item(i).password, results.rows.item(i).created_at]).draw(false);
                }
            }, null);
        });
    }

    //CLICK ON SUBMIT
    $("#generate-button").click(function (e) {

        e.preventDefault();
        var string = "";
        let numchecked = false;
        let lowerchecked = false;
        let upperchecked = false;
        let specialchecked = false;


        if ($('#numbers').is(":checked"))
            numchecked = true;

        if ($('#lowercase').is(":checked"))
            lowerchecked = true;

        if ($('#uppercase').is(":checked"))
            upperchecked = true;

        if ($('#special').is(":checked"))
            specialchecked = true;

        //If any option is checked
        if (numchecked || lowerchecked || upperchecked || specialchecked) {
            //Build string
            string = buildString(numchecked, lowerchecked, upperchecked, specialchecked);

            let quantity = $("#quantity").val();
            if (quantity < 8) {
                quantity = 8;
                $("#quantity").val(8);
            }

            //Build password
            let password = buildPassword(string, quantity);

            //Show password
            $("#password").val(password);

            // Copy Clipboard
            var copyText = document.getElementById("password");
            copyText.select();
            navigator.clipboard.writeText(copyText.value);
            Toast.fire({ icon: 'success', title: 'Şifre başarıyal oluşturuldu.' });

            // Web SQL
            var now = new Date();

            if (window.openDatabase) {
                db = openDatabase('password-generator-db', '1.0', 'Password Generator Web SQL DB', 2 * 1024 * 1024);

                db.transaction(function (tx) {

                    //tx.executeSql("CREATE TABLE Passwords(ID INTEGER PRIMARY KEY,password TEXT, created_at TEXT)",[], function(tx) {}, null);
                    tx.executeSql("INSERT INTO Passwords(password, created_at) VALUES (?,?)", [password, now], function (tx, result) { }, null);
                    table.row.add([table.rows.length + 1, password, now]).draw(false);
                });
            }

        }
        else {
            Toast.fire({ icon: 'warning', title: 'Şifre özelliği seçiniz...' });
        }

    });

    function buildString(numchecked, lowerchecked, upperchecked, specialchecked) {

        let answer = "";

        if (numchecked)
            answer += numbers;

        if (lowerchecked)
            answer += lowercase;

        if (upperchecked)
            answer += uppercase;

        if (specialchecked)
            answer += special;

        return answer;
    }

    function buildPassword(string, quantity) {
        let answer = "";
        for (let i = 0; i < quantity; i++) {
            //Returns a random integer from 0 to string.length
            const num = Math.floor(Math.random() * string.length);
            const char = string[num];
            answer += char;
        }
        return answer;
    }

    //COPY PASSWORD TO CLIPBOARD
    $("#copy").click(function (e) {
        //this.focus();
        //this.select();
        try {
            var successful = document.execCommand('password');
        } catch (err) {
            Toast.fire({ icon: 'error', title: 'Şifre kopyalanamadı' + err });
        }
        Toast.fire({ icon: 'info', title: 'Şifre kopyalandı' });

    });



    $("#hepsini-sil").click(function (e) {

        if (window.openDatabase) {
            db = openDatabase('password-generator-db', '1.0', 'Password Generator Web SQL DB', 2 * 1024 * 1024);
            db.transaction(function (tx) {

                tx.executeSql('SELECT * FROM Passwords', [], function (tx, results) {
                    tx.executeSql('DROP TABLE Passwords');
                    tx.executeSql("CREATE TABLE Passwords(ID INTEGER PRIMARY KEY,password TEXT, created_at TEXT)", [], function (tx) { }, null);
                    table.clear().draw();
                    Toast.fire({ icon: 'info', title: 'Tüm şifreler silindi.' });
                }, null);
            });
        }




    });


});