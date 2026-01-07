/**
 * Project: Portal Jadwal Kuliah IF Polibatam
 * Script: index-logic.js
 */

// --- 1. POPUP USER DROPDOWN ---
const userToggle = document.getElementById('userToggle');
const userPopup = document.getElementById('userPopup');

if (userToggle) {
    userToggle.addEventListener('click', function(e) {
        // Stop agar tidak langsung tertutup oleh window click
        e.stopPropagation(); 
        
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

// --- 2. SMOOTH SCROLL NAVIGATION ---
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Pastikan link diawali dengan #
        if (targetId.startsWith("#")) {
            e.preventDefault(); // Mencegah loncatan kasar
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Proses scroll otomatis yang mulus dengan offset navbar
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 80px adalah tinggi navbar
                    behavior: 'smooth'
                });
            }
        }
    });
});

// --- 3. MOBILE HAMBURGER MENU ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const menuIcon = hamburger ? hamburger.querySelector('i') : null;

if (hamburger && navLinks) {
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

// Klik di mana saja di luar untuk menutup menu mobile
document.addEventListener('click', (e) => {
    if (hamburger && navLinks) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    }
});