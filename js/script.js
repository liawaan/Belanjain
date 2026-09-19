// ======================================================
// BELANJAIN - script.js
// DOM + BOM + Web API
// ======================================================


// ======================================================
// 1. DOM - Mengambil elemen HTML
// ======================================================

const searchForm = document.querySelector(".kolom-pencarian");
const searchInput = document.querySelector(".kolom-pencarian input");

const productCards = document.querySelectorAll(".product-card");

const openPartnerButton = document.querySelector(".open-partner-button");


// ======================================================
// 2. DOM - Pencarian Produk
// ======================================================

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase().trim();

        productCards.forEach(product => {
            const productName = product
                .querySelector(".product-title")
                .textContent
                .toLowerCase();

            if (productName.includes(keyword)) {
                product.style.display = "";
            } else {
                product.style.display = "none";
            }
        });
    });
}


// ======================================================
// 3. DOM - Klik Produk
// ======================================================

productCards.forEach(product => {
    product.addEventListener("click", event => {
        // Karena <a href=""> belum memiliki tujuan,
        // kita cegah halaman berpindah/reload.
        event.preventDefault();

        const productName = product
            .querySelector(".product-title")
            .textContent;

        const productPrice = product
            .querySelector(".price-text")
            .textContent;

        console.log("Produk dipilih:");
        console.log("Nama:", productName);
        console.log("Harga:", productPrice);

        alert(`${productName}\nHarga: ${productPrice}`);
    });
});


// ======================================================
// 4. BOM - Mengetahui ukuran layar
// ======================================================

function checkScreenSize() {
    if (window.innerWidth < 768) {
        console.log("Mode: Mobile");
    } else {
        console.log("Mode: Desktop");
    }
}

checkScreenSize();


// Ketika ukuran browser berubah
window.addEventListener("resize", checkScreenSize);


// ======================================================
// 5. BOM - Navigasi ke halaman buka toko
// ======================================================

if (openPartnerButton) {
    openPartnerButton.addEventListener("click", event => {
        event.preventDefault();

        // Contoh navigasi menggunakan BOM
        window.location.href = "buka-toko.html";
    });
}


// ======================================================
// 6. BOM / Web API - Local Storage
//    Menyimpan data keranjang
// ======================================================

let cart = JSON.parse(localStorage.getItem("belanjainCart")) || [];


// Fungsi menyimpan keranjang
function saveCart() {
    localStorage.setItem(
        "belanjainCart",
        JSON.stringify(cart)
    );
}


// ======================================================
// 7. DOM - Membuat tombol "Tambah ke Keranjang"
// ======================================================

productCards.forEach(product => {

    // Jangan membuat tombol kalau sudah ada
    if (product.querySelector(".btn-cart")) {
        return;
    }

    const button = document.createElement("button");

    button.textContent = "Tambah ke Keranjang";
    button.classList.add("btn-cart");

    product.appendChild(button);


    // ==================================================
    // 8. DOM - Event tombol keranjang
    // ==================================================

    button.addEventListener("click", event => {

        // Jangan sampai klik tombol dianggap
        // sebagai klik product-card
        event.preventDefault();
        event.stopPropagation();


        const productName = product
            .querySelector(".product-title")
            .textContent;

        const productPriceText = product
            .querySelector(".price-text")
            .textContent;


        // Mengubah:
        // "Rp95.000"
        // menjadi:
        // 95000

        const productPrice = Number(
            productPriceText
                .replace("Rp", "")
                .replace(/\./g, "")
                .trim()
        );


        // Masukkan produk ke keranjang

        const productData = {
            id: Date.now(),
            nama: productName,
            harga: productPrice
        };


        cart.push(productData);

        saveCart();


        console.log("Keranjang:", cart);

        alert(`${productName} berhasil ditambahkan ke keranjang!`);
    });
});


// ======================================================
// 9. DOM - Menampilkan jumlah keranjang
// ======================================================

function updateCartCount() {

    const cartLink = document.querySelector(
        ".user-header a:first-child"
    );

    if (!cartLink) {
        return;
    }


    // Cari badge yang sudah ada
    let cartCount = cartLink.querySelector(".cart-count");


    // Kalau belum ada, buat
    if (!cartCount) {

        cartCount = document.createElement("span");

        cartCount.classList.add("cart-count");

        cartLink.appendChild(cartCount);
    }


    cartCount.textContent = cart.length;
}


updateCartCount();


// ======================================================
// 10. Web API - Fetch
// ======================================================

// Contoh penggunaan fetch.
//
// Saat backend/API Belanjain sudah tersedia,
// bagian ini dapat digunakan untuk mengambil
// data produk dari server.
//
// Untuk sekarang kita tidak menjalankannya
// agar tidak error karena endpoint belum tersedia.

async function getProductsFromAPI() {

    try {

        const response = await fetch("/api/products");


        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }


        const products = await response.json();

        console.log("Produk dari API:", products);

        return products;

    } catch (error) {

        console.error(
            "Gagal mengambil produk dari API:",
            error
        );

        return [];
    }
}


// ======================================================
// 11. Web API - Geolocation
// ======================================================

// Contoh fitur:
// mengetahui lokasi user.
//
// Fungsi ini tidak otomatis dijalankan agar
// website tidak langsung meminta izin lokasi.

function getUserLocation() {

    if (!navigator.geolocation) {

        console.log(
            "Browser tidak mendukung Geolocation."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log("Lokasi user:");

            console.log("Latitude:", latitude);

            console.log("Longitude:", longitude);
        },

        error => {

            console.log(
                "User tidak memberikan akses lokasi."
            );

            console.log(error.message);
        }
    );
}


// ======================================================
// 12. Web API - Microphone
// ======================================================

// Contoh untuk fitur voice search / voice recorder.
//
// Fungsi ini juga tidak otomatis dijalankan karena
// browser akan meminta izin microphone.

async function startMicrophone() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });


        console.log(
            "Microphone berhasil diakses."
        );


        return stream;

    } catch (error) {

        console.error(
            "Gagal mengakses microphone:",
            error
        );

        return null;
    }
}


// ======================================================
// 13. Web API - MediaRecorder
// ======================================================
//
// Contoh fungsi untuk merekam suara.
// Bisa dikembangkan menjadi fitur voice search
// atau voice recorder di Belanjain.

async function recordVoice() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });


        const recorder =
            new MediaRecorder(stream);


        const audioChunks = [];


        recorder.addEventListener(
            "dataavailable",
            event => {

                audioChunks.push(event.data);
            }
        );


        recorder.addEventListener(
            "stop",
            () => {

                const audioBlob =
                    new Blob(audioChunks, {
                        type: "audio/webm"
                    });


                const audioURL =
                    URL.createObjectURL(audioBlob);


                console.log(
                    "Rekaman selesai:",
                    audioURL
                );


                // Setelah selesai,
                // microphone harus dimatikan.

                stream
                    .getTracks()
                    .forEach(track => track.stop());
            }
        );


        recorder.start();


        console.log("Recording dimulai.");


        // Contoh:
        // rekam selama 5 detik

        setTimeout(() => {

            recorder.stop();

            console.log(
                "Recording dihentikan."
            );

        }, 5000);


    } catch (error) {

        console.error(
            "Gagal melakukan recording:",
            error
        );
    }
}


// ======================================================
// 14. Informasi awal aplikasi
// ======================================================

console.log("================================");
console.log("Belanjain JavaScript aktif!");
console.log("Jumlah produk:", productCards.length);
console.log("Isi keranjang:", cart);
console.log("================================");