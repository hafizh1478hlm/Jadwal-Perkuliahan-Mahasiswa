document.addEventListener("DOMContentLoaded", () => {
  // === Navbar Popup Logic ===
  const menuIcon = document.querySelector('.menu-icon');
  const userIcon = document.querySelector('.user-icon');
  const menuPopup = document.getElementById('menuPopup');
  const userPopup = document.getElementById('userPopup');

  menuIcon.addEventListener('click', () => {
    menuPopup.style.display = menuPopup.style.display === 'block' ? 'none' : 'block';
    userPopup.style.display = 'none';
  });

  userIcon.addEventListener('click', () => {
    userPopup.style.display = userPopup.style.display === 'block' ? 'none' : 'block';
    menuPopup.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (
      !menuPopup.contains(e.target) &&
      !menuIcon.contains(e.target) &&
      !userPopup.contains(e.target) &&
      !userIcon.contains(e.target)
    ) {
      menuPopup.style.display = 'none';
      userPopup.style.display = 'none';
    }
  });

  // Contoh: klik baris untuk menampilkan alert detail
  document.querySelectorAll(".jadwal-table tbody tr").forEach(row => {
    row.addEventListener("click", () => {
      const mataKuliah = row.cells[3]?.textContent;
      const dosen = row.cells[4]?.textContent;
      if (mataKuliah && dosen) {
        alert(`Mata Kuliah: ${mataKuliah}\nDosen: ${dosen}`);
      }
    });
  });

  const searchInput = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");

  let currentFocus = -1;
  let selectableItems = [];

// Ganti bagian input listener kamu dengan ini ya, Zaraa
searchInput.addEventListener("input", function () {
  const keyword = this.value.trim();

  if (keyword.length === 0) {
    suggestions.style.display = "none";
    suggestions.innerHTML = "";
    return;
  }

  // Pakai timer (debounce) biar gak berat pas ngetik
  clearTimeout(window._searchTimer);
  window._searchTimer = setTimeout(async () => {
    try {
      // Ambil data dari file PHP temenmu
      const response = await fetch("search.php?keyword=" + encodeURIComponent(keyword));
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      suggestions.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        suggestions.style.display = "none";
        return;
      }

      // Looping hasil dari database
      data.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item"; // Sesuaikan class CSS kamu
        li.textContent = `${item.matkul} — ${item.dosen}`;
        li.onclick = () => {
          // Pindah ke halaman detail sesuai ID dari database
          window.location.href = "jadwalutama.php?id=" + item.id_jadwal;
        };
        suggestions.appendChild(li);
      });

      suggestions.style.display = "block";
      
      // Update list buat navigasi keyboard
      selectableItems = Array.from(suggestions.querySelectorAll("li"));
      currentFocus = -1;

    } catch (err) {
      console.error("Gagal ambil data:", err);
      suggestions.style.display = "none";
    }
  }, 220);
});

  searchInput.addEventListener("keydown", function (e) {
    if (!suggestions.style.display || suggestions.style.display === "none") return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentFocus++;
      addActive(selectableItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentFocus--;
      addActive(selectableItems);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentFocus > -1 && selectableItems[currentFocus]) {
        selectableItems[currentFocus].click();
      }
    }
  });

  function addActive(items) {
    if (!items.length) return;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    items[currentFocus].classList.add("active");
    items[currentFocus].scrollIntoView({ block: "nearest" });
  }

  function removeActive(items) {
    items.forEach(item => item.classList.remove("active"));
  }
});


// --- POP-UP UBAH SADI ---

const modal = document.getElementById("changePasswordModal");
const openBtn = document.getElementById("btnUbahSandi"); // ⬅️ INI YANG BENER
const closeBtn = modal.querySelector(".close");

openBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
  userPopup.style.display = "none";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
// --- END POP-UP UBAH SANDI ---