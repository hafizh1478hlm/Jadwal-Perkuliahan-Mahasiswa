// Ambil elemen popup user
const userToggle = document.getElementById('userToggle');
const userPopup = document.getElementById('userPopup');

// Fungsi memunculkan dropdown saat icon user diklik
if (userToggle) {
    userToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Stop agar tidak langsung tertutup oleh window click
        if (userPopup.style.display === 'block') {
            userPopup.style.display = 'none';
        } else {
            userPopup.style.display = 'block';
        }
    });
}

// Menutup popup jika user mengklik di luar area menu
window.addEventListener('click', function() {
    if (userPopup) {
        userPopup.style.display = 'none';
    }
});

// Smooth Scroll (Opsional, browser modern sudah support via CSS)
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith("#")) {
            e.preventDefault();
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Fitur Smooth Scroll Otomatis
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Pastikan link diawali dengan #
        const targetId = this.getAttribute('href');
        
        if (targetId.startsWith("#")) {
            e.preventDefault(); // Mencegah loncatan kasar
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Proses scroll otomatis yang mulus
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 80 adalah tinggi navbar kamu
                    behavior: 'smooth'
                });
            }
        }
    });
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const menuIcon = hamburger.querySelector('i');

if (hamburger) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation(); // Biar gak bentrok sama klik body
        navLinks.classList.toggle('active');
        
        // Animasi ganti icon bars ke silang (times)
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });
}

// Klik di mana saja di layar buat nutup menu
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});