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
    
    // MASUKKAN LINK CSV SHEET "DataGaleri" DI SINI
    const urlCSVGaleri = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL5wQIAMDGcop31TI15DlsFBHNscqMSEAdq23uVqknE7pc4hDPcQ64zlYpgWJ8VKPYoUnJ3FymJgEP/pub?gid=176725659&single=true&output=csv";
    const wadahGaleri = document.getElementById('wadah-galeri-dinamis');

    fetch(urlCSVGaleri)
        .then(response => {
            if (!response.ok) throw new Error("Gagal mengambil data");
            return response.text();
        })
        .then(dataText => {
            const barisData = dataText.replace(/\r/g, '').split('\n');
            let htmlKartu = '';

            for (let i = 1; i < barisData.length; i++) {
                const barisAktif = barisData[i].trim();
                if (barisAktif === '') continue;

                const kolom = barisAktif.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

                const kategori = kolom[0] ? kolom[0].replace(/^"|"$/g, '').trim().toLowerCase() : 'lainnya';
                const judul = kolom[1] ? kolom[1].replace(/^"|"$/g, '').trim() : '';
                const tanggal = kolom[2] ? kolom[2].replace(/^"|"$/g, '').trim() : '';
                const keterangan = kolom[3] ? kolom[3].replace(/^"|"$/g, '').trim() : '';
                let mediaUrl = kolom[4] ? kolom[4].replace(/^"|"$/g, '').trim() : '';

                if (!mediaUrl) { mediaUrl = 'images/logo.png'; } 

                // DETEKSI APAKAH INI VIDEO ATAU GAMBAR
                const isVideo = mediaUrl.toLowerCase().includes('.mp4');

                if (judul) {
                    htmlKartu += `
                    <div class="galeri-item" data-kategori="${kategori}" data-tipe="${isVideo ? 'video' : 'gambar'}">
                        <h3 class="galeri-judul">${judul}</h3>
                        <span class="galeri-tanggal">${tanggal}</span>
                        
                        <div class="media-wadah">
                            ${isVideo 
                                ? `<video src="${mediaUrl}" class="media-galeri" preload="metadata" muted></video>
                                   <i class="fas fa-play-circle play-icon"></i>` 
                                : `<img src="${mediaUrl}" class="media-galeri" alt="${judul}">`
                            }
                        </div>
                        
                        <p class="galeri-ket" data-ket="${keterangan}">${keterangan}</p>
                    </div>
                    `;
                }
            }

            if (htmlKartu !== '') { wadahGaleri.innerHTML = htmlKartu; } 
            else { wadahGaleri.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Belum ada foto/video galeri.</p>'; }

            jalankanFiturGaleri();
        })
        .catch(error => {
            console.error("Error:", error);
            wadahGaleri.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:red;">Gagal memuat galeri.</p>';
        });


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

        // --- MESIN LIGHTBOX MULTIMEDIA ---
        const lightbox = document.getElementById("lightbox");
        if(lightbox){
            const lightboxImg = document.getElementById("lightboxImg");
            const lightboxVid = document.getElementById("lightboxVid"); // ID Video baru
            const lightboxJudul = document.getElementById("lightboxJudul");
            const lightboxTanggal = document.getElementById("lightboxTanggal");
            const lightboxCaption = document.getElementById("lightboxCaption");
            const lightboxClose = document.getElementById("lightboxClose");
            
            const mediaGrid = document.querySelectorAll(".media-galeri");

            let currentIndex = 0;
            let visibleItems = [];

            function showMedia(index){
                const item = visibleItems[index];
                const tipeMedia = item.getAttribute("data-tipe");
                
                const judulEl = item.querySelector(".galeri-judul").innerText;
                const tglEl = item.querySelector(".galeri-tanggal").innerText;
                const ketEl = item.querySelector(".galeri-ket").getAttribute("data-ket");
                const srcMedia = item.querySelector(".media-galeri").getAttribute("src");

                // MATIKAN VIDEO TERLEBIH DAHULU (Biar suara gak tumpang tindih)
                lightboxVid.pause();
                lightboxVid.src = "";

                // ISI TEKS
                lightboxJudul.innerText = judulEl;
                lightboxTanggal.innerText = tglEl;
                lightboxCaption.innerText = ketEl;

                // TAMPILKAN VIDEO ATAU GAMBAR
                if (tipeMedia === 'video') {
                    lightboxImg.style.display = 'none'; // Sembunyikan foto
                    lightboxVid.style.display = 'block'; // Tampilkan Video
                    lightboxVid.src = srcMedia;
                    lightboxVid.play(); // OTOMATIS PLAY SAAT DIBUKA
                } else {
                    lightboxVid.style.display = 'none'; // Sembunyikan Video
                    lightboxImg.style.display = 'block'; // Tampilkan Foto
                    lightboxImg.src = srcMedia;
                }
            }

            mediaGrid.forEach(media => {
                media.addEventListener("click", function() {
                    visibleItems = Array.from(galeriItems).filter(i => !i.classList.contains("hide"));
                    const klikItem = this.closest(".galeri-item");
                    currentIndex = visibleItems.indexOf(klikItem);
                    
                    lightbox.classList.add("show");
                    showMedia(currentIndex);
                });
            });

            // TOMBOL NEXT & PREV
            document.getElementById('lightboxNext').addEventListener("click", (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % visibleItems.length;
                showMedia(currentIndex);
            });

            document.getElementById('lightboxPrev').addEventListener("click", (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
                showMedia(currentIndex);
            });

            // FUNGSI TUTUP (SANGAT PENTING: MATIKAN VIDEO SAAT DITUTUP)
            function tutupLightbox() {
                lightbox.classList.remove("show");
                lightboxVid.pause(); // Video Langsung Berhenti
                lightboxVid.src = "";
            }

            lightboxClose.addEventListener("click", tutupLightbox);
            lightbox.addEventListener("click", (e) => {
                if(e.target === lightbox) tutupLightbox();
            });
            document.addEventListener("keydown", (e) => {
                if(!lightbox.classList.contains("show")) return;
                if(e.key === "Escape") tutupLightbox();
                if(e.key === "ArrowRight") { currentIndex = (currentIndex + 1) % visibleItems.length; showMedia(currentIndex); }
                if(e.key === "ArrowLeft") { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; showMedia(currentIndex); }
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
