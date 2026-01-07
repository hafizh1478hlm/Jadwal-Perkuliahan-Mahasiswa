document.addEventListener("DOMContentLoaded", () => {
  // === 1. Navbar Popup Logic ===
  const menuIcon = document.querySelector('.menu-icon');
  const userIcon = document.querySelector('.user-icon');
  const menuPopup = document.getElementById('menuPopup');
  const userPopup = document.getElementById('userPopup');

  if (menuIcon && menuPopup) {
    menuIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      menuPopup.style.display = menuPopup.style.display === 'block' ? 'none' : 'block';
      if (userPopup) userPopup.style.display = 'none';
    });
  }

  if (userIcon && userPopup) {
    userIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      userPopup.style.display = userPopup.style.display === 'block' ? 'none' : 'block';
      if (menuPopup) menuPopup.style.display = 'none';
    });
  }

  // === 2. Pop-up Ubah Sandi Logic ===
  const modalSandi = document.getElementById("changePasswordModal");
  const openBtnSandi = document.getElementById("btnUbahSandi");
  const closeBtnSandi = modalSandi ? modalSandi.querySelector(".close") : null;

  if (openBtnSandi && modalSandi) {
    openBtnSandi.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      modalSandi.style.display = "flex";
      if (userPopup) userPopup.style.display = "none";
    });
  }

  if (closeBtnSandi) {
    closeBtnSandi.addEventListener("click", () => {
      modalSandi.style.display = "none";
    });
  }

  // Klik di luar untuk menutup popup/modal
  window.addEventListener('click', (e) => {
    if (menuPopup && !menuPopup.contains(e.target) && !menuIcon.contains(e.target)) {
      menuPopup.style.display = 'none';
    }
    if (userPopup && !userPopup.contains(e.target) && !userIcon.contains(e.target)) {
      userPopup.style.display = 'none';
    }
    if (e.target === modalSandi) {
      modalSandi.style.display = "none";
    }
  });

  // Fitur Auto-Scroll ke baris highlight dengan Jarak Aman (Offset)
  const highlightedRow = document.getElementById('targetHighlight');
  if (highlightedRow) {
    setTimeout(() => {
      // Hitung posisi elemen dikurangi tinggi navbar (sekitar 80px-100px)
      const navbarHeight = document.querySelector('.navbar').offsetHeight || 80;
      const elementPosition = highlightedRow.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight - 20; // 20px extra biar gak mepet banget

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 500);
  }


// === 4. Search Bar Logic (SAMAKAN DENGAN KELOLA JADWAL) ===
  const searchInput = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");
  let currentFocus = -1;
  let selectableItems = [];

  if (searchInput && suggestions) {
    searchInput.addEventListener("input", function () {
      const keyword = this.value.trim();
      currentFocus = -1; // Reset fokus setiap ngetik

      if (keyword.length < 1) {
        suggestions.style.display = "none";
        suggestions.innerHTML = "";
        return;
      }

      clearTimeout(window._searchTimer);
      window._searchTimer = setTimeout(async () => {
        try {
          const response = await fetch("search.php?keyword=" + encodeURIComponent(keyword));
          if (!response.ok) throw new Error("Network error");

          const data = await response.json();
          
          if (!Array.isArray(data) || data.length === 0) {
            suggestions.style.display = "none";
            suggestions.innerHTML = "";
            return;
          }

          // Render HTML yang sama persis dengan Kelola Jadwal
          suggestions.innerHTML = data.map((item, index) => `
            <li class="suggestion-item" 
                data-index="${index}" 
                data-value="${item.matkul}">
                <strong>${item.matkul}</strong>
                <small class="text-muted">${item.ruangan} | ${item.dosen} | ${item.hari}</small>
            </li>`).join('');

          suggestions.style.display = "block";
          selectableItems = Array.from(suggestions.querySelectorAll(".suggestion-item"));
          
          // Tambahkan event click manual untuk setiap li yang baru dibuat
          selectableItems.forEach(li => {
            li.onclick = () => {
              window.location.href = "jadwalutama.php?search=" + encodeURIComponent(li.getAttribute('data-value'));
            };
          });

        } catch (err) {
          console.error("Gagal ambil data:", err);
          suggestions.style.display = "none";
        }
      }, 220);
    });

    // Logika Keyboard (ArrowUp, ArrowDown, Enter)
    searchInput.addEventListener("keydown", function (e) {
      const items = suggestions.querySelectorAll(".suggestion-item");
      if (suggestions.style.display === "none" || items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentFocus = (currentFocus + 1) % items.length;
        updateActive(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentFocus = (currentFocus - 1 + items.length) % items.length;
        updateActive(items);
      } else if (e.key === "Enter") {
        if (currentFocus > -1 && items[currentFocus]) {
          e.preventDefault();
          items[currentFocus].click();
        } else if (this.value.trim() !== "") {
          // Jika tidak ada yang dipilih tapi tekan enter, cari keyword yang diketik
          window.location.href = "jadwalutama.php?search=" + encodeURIComponent(this.value.trim());
        }
      }
    });
  }

  // Fungsi Helper untuk highlight (mirip updateSelection di KJ)
  function updateActive(items) {
    items.forEach((item, index) => {
      item.classList.toggle("active", index === currentFocus);
      if (index === currentFocus) {
        item.scrollIntoView({ block: "nearest" });
      }
    });
  }
});