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

// ===== FADE IN =====
const faders = document.querySelectorAll('.fade-in');
window.addEventListener('scroll', () => {
    faders.forEach(fade => {
        const rect = fade.getBoundingClientRect();
        if(rect.top < window.innerHeight - 100){
            fade.classList.add('show');
        }
    });
});

// ===== LIGHTBOX =====
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

    // Fungsi tampilkan gambar berdasarkan index + arah animasi
	function showImage(index, direction){
    const img = visibleImages[index];
    const item = img.parentElement;

    // Reset animasi dulu
    lightboxImg.classList.remove("slide-next", "slide-prev");

    // Paksa browser membaca ulang (biar animasi bisa diulang)
    void lightboxImg.offsetWidth;

    // Ganti gambar & teks
    lightboxImg.src = img.src;

    const judulEl = item.querySelector(".galeri-judul");
    lightboxJudul.innerText = judulEl ? judulEl.innerText : "";

    const tglEl = item.querySelector(".galeri-tanggal");
    lightboxTanggal.innerText = tglEl ? tglEl.innerText : "";

    lightboxCaption.innerText = img.getAttribute("data-ket") || "";

    // Tambahkan animasi sesuai arah
    if(direction === "next"){
        lightboxImg.classList.add("slide-next");
    } else if(direction === "prev"){
        lightboxImg.classList.add("slide-prev");
    }
}

    // Saat gambar diklik
    galeriImg.forEach(img => {
    img.addEventListener("click", () => {
        visibleImages = Array.from(galeriImg).filter(
            im => !im.parentElement.classList.contains("hide")
        );

        currentIndex = visibleImages.indexOf(img);

        lightbox.classList.add("show");
        showImage(currentIndex, "next"); // animasi awal
    });
});

    // Tombol NEXT
    lightboxNext.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % visibleImages.length;
        showImage(currentIndex);
    });

    // Tombol PREV
    lightboxPrev.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
        showImage(currentIndex);
    });

    // Tutup
    lightboxClose.addEventListener("click", () => {
        lightbox.classList.remove("show");
    });

    // Klik area gelap menutup
    lightbox.addEventListener("click", (e) => {
        if(e.target === lightbox){
            lightbox.classList.remove("show");
        }
    });

    // Keyboard: ESC, panah kiri/kanan
    document.addEventListener("keydown", (e) => {
        if(!lightbox.classList.contains("show")) return;

        if(e.key === "Escape"){
            lightbox.classList.remove("show");
        }
        if(e.key === "ArrowRight"){
            currentIndex = (currentIndex + 1) % visibleImages.length;
            showImage(currentIndex);
        }
        if(e.key === "ArrowLeft"){
            currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
            showImage(currentIndex);
        }
    });
}

// ===== FILTER GALERI =====
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