// ===== HEADER SCROLL =====
window.addEventListener("scroll", function(){
    const header = document.querySelector("header");
    if(header){
        if(window.scrollY > 50){
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
});

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");

if(menuToggle && nav){

    menuToggle.addEventListener("click", function(){
        nav.classList.toggle("active");
        document.body.classList.toggle("menu-open");
    });

    // Klik area gelap untuk menutup
    document.addEventListener("click", function(e){
        if(
            nav.classList.contains("active") &&
            !nav.contains(e.target) &&
            !menuToggle.contains(e.target)
        ){
            nav.classList.remove("active");
            document.body.classList.remove("menu-open");
        }
    });

}

// ===== FADE IN =====
const faders = document.querySelectorAll('.fade-in');

function checkFadeIn(){
    faders.forEach(fade => {
        const rect = fade.getBoundingClientRect();
        if(rect.top < window.innerHeight - 100){
            fade.classList.add('show');
        }
    });
}

window.addEventListener('scroll', checkFadeIn);
window.addEventListener('load', checkFadeIn);

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================================================
    // 1. MASUKKAN LINK CSV SHEET "DataGaleri" DI SINI
    // ==================================================
    const urlCSVGaleri = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL5wQIAMDGcop31TI15DlsFBHNscqMSEAdq23uVqknE7pc4hDPcQ64zlYpgWJ8VKPYoUnJ3FymJgEP/pub?gid=176725659&single=true&output=csv";
    
    const wadahGaleri = document.getElementById('wadah-galeri-dinamis');

    // ==================================================
    // 2. MESIN PENGAMBIL DATA DARI GOOGLE SHEETS
    // ==================================================
    fetch(urlCSVGaleri)
        .then(response => {
            if (!response.ok) throw new Error("Gagal mengambil data");
            return response.text();
        })
        .then(dataText => {
            const barisData = dataText.replace(/\r/g, '').split('\n');
            let htmlKartu = '';

            // Looping dari baris 2
            for (let i = 1; i < barisData.length; i++) {
                const barisAktif = barisData[i].trim();
                if (barisAktif === '') continue;

                const kolom = barisAktif.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

                // Pastikan kategori huruf kecil semua agar filter tidak error (misal ketik OMK jadi omk)
                const kategori = kolom[0] ? kolom[0].replace(/^"|"$/g, '').trim().toLowerCase() : 'lainnya';
                const judul = kolom[1] ? kolom[1].replace(/^"|"$/g, '').trim() : '';
                const tanggal = kolom[2] ? kolom[2].replace(/^"|"$/g, '').trim() : '';
                const keterangan = kolom[3] ? kolom[3].replace(/^"|"$/g, '').trim() : '';
                let foto = kolom[4] ? kolom[4].replace(/^"|"$/g, '').trim() : '';

                if (!foto) { foto = 'images/logo.png'; } // Gambar default jika kosong

                if (judul) {
                    htmlKartu += `
                    <div class="galeri-item" data-kategori="${kategori}">
                        <h3 class="galeri-judul">${judul}</h3>
                        <span class="galeri-tanggal">${tanggal}</span>
                        <img src="${foto}" alt="${judul}" data-ket="${keterangan}">
                        <p class="galeri-ket">${keterangan}</p>
                    </div>
                    `;
                }
            }

            if (htmlKartu !== '') {
                wadahGaleri.innerHTML = htmlKartu;
            } else {
                wadahGaleri.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Belum ada foto galeri.</p>';
            }

            // ==================================================
            // KUNCI RAHASIA: JALANKAN LIGHTBOX & FILTER SETELAH FOTO MUNCUL
            // ==================================================
            jalankanFiturGaleri();

        })
        .catch(error => {
            console.error("Error:", error);
            wadahGaleri.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:red;">Gagal memuat galeri. Periksa koneksi internet.</p>';
        });


    // ==================================================
    // 3. FUNGSI FILTER & LIGHTBOX (Dijalankan belakangan)
    // ==================================================
    function jalankanFiturGaleri() {
        
        // --- MESIN FILTER ---
        const filterBtns = document.querySelectorAll(".filter-btn");
        const galeriItems = document.querySelectorAll(".galeri-item");

        if(filterBtns.length > 0){
            filterBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    filterBtns.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");

                    const filter = btn.getAttribute("data-filter");

                    galeriItems.forEach(item => {
                        const kategori = item.getAttribute("data-kategori");
                        if(filter === "all" || filter === kategori){
                            item.classList.remove("hide");
                        } else {
                            item.classList.add("hide");
                        }
                    });
                });
            });
        }

        // --- MESIN LIGHTBOX ---
        const lightbox = document.getElementById("lightbox");
        if(lightbox){
            const lightboxImg = document.getElementById("lightboxImg");
            const lightboxJudul = document.getElementById("lightboxJudul");
            const lightboxTanggal = document.getElementById("lightboxTanggal");
            const lightboxCaption = document.getElementById("lightboxCaption");
            const lightboxClose = document.getElementById("lightboxClose");
            const lightboxPrev = document.getElementById("lightboxPrev");
            const lightboxNext = document.getElementById("lightboxNext");

            const galeriImg = document.querySelectorAll(".galeri-item img");

            let currentIndex = 0;
            let visibleImages = [];

            function showImage(index, direction){
                const img = visibleImages[index];
                const item = img.closest(".galeri-item"); 

                lightboxImg.classList.remove("slide-next", "slide-prev");
                void lightboxImg.offsetWidth; 

                lightboxImg.src = img.src;
                
                const judulEl = item.querySelector(".galeri-judul");
                lightboxJudul.innerText = judulEl ? judulEl.innerText : "";

                const tglEl = item.querySelector(".galeri-tanggal");
                lightboxTanggal.innerText = tglEl ? tglEl.innerText : "";

                lightboxCaption.innerText = img.getAttribute("data-ket") || "";

                if(direction === "next"){ lightboxImg.classList.add("slide-next"); } 
                else if(direction === "prev"){ lightboxImg.classList.add("slide-prev"); }
            }

            galeriImg.forEach(img => {
                img.addEventListener("click", () => {
                    visibleImages = Array.from(galeriImg).filter(
                        im => !im.closest(".galeri-item").classList.contains("hide")
                    );
                    currentIndex = visibleImages.indexOf(img);
                    lightbox.classList.add("show");
                    showImage(currentIndex, "next");
                });
            });

            lightboxNext.addEventListener("click", (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % visibleImages.length;
                showImage(currentIndex, "next");
            });

            lightboxPrev.addEventListener("click", (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
                showImage(currentIndex, "prev");
            });

            lightboxClose.addEventListener("click", () => { lightbox.classList.remove("show"); });

            lightbox.addEventListener("click", (e) => {
                if(e.target === lightbox){ lightbox.classList.remove("show"); }
            });

            document.addEventListener("keydown", (e) => {
                if(!lightbox.classList.contains("show")) return;
                if(e.key === "Escape"){ lightbox.classList.remove("show"); }
                if(e.key === "ArrowRight"){ 
                    currentIndex = (currentIndex + 1) % visibleImages.length; 
                    showImage(currentIndex, "next"); 
                }
                if(e.key === "ArrowLeft"){ 
                    currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length; 
                    showImage(currentIndex, "prev"); 
                }
            });
        }
    }
});


// ===== MODAL SAMBUTAN =====
const modalSambutan = document.getElementById('modalSambutan');

function openSambutan(){
    if(modalSambutan){
        modalSambutan.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeSambutan(){
    if(modalSambutan){
        modalSambutan.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Tutup modal jika klik area gelap
if(modalSambutan){
    modalSambutan.addEventListener('click', function(e){
        if(e.target === this){
            closeSambutan();
        }
    });
}

// ===== WHATSAPP POPUP (HOVER 2 DETIK) =====
const waPopup = document.getElementById("waPopup");
const waFloat = document.querySelector(".wa-float");

let waTimer = null;

if(waPopup && waFloat){

    // Saat pointer masuk icon
    waFloat.addEventListener("mouseenter", function(){
        waTimer = setTimeout(() => {
            waPopup.classList.add("show");
        }, 2000); // 2 detik
    });

    // Jika pointer keluar sebelum 2 detik → batal
    waFloat.addEventListener("mouseleave", function(){
        clearTimeout(waTimer);
    });

    // Tombol close
    window.closeWAPopup = function(){
        waPopup.classList.remove("show");
    };

}
