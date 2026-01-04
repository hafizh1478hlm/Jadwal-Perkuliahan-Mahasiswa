
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = './api';
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const jadwalInputPopup = document.getElementById('jadwalInputPopup');
    const kirimBtn = document.getElementById('kirimJadwal');
    const batalBtn = document.getElementById('batalJadwal');

    let currentDate = new Date();
    let activeDay = null;
    let activeDateISO = null;

    // --- 1. Fungsi Load Histori & Titik Biru ---
    async function loadHistoryFromDB() {
    const tableContainer = document.getElementById('mainNotesTable');
    if (!tableContainer) return;

    try {
        const res = await fetch(`${API_BASE}/jadwal_list.php`);
        const data = await res.json();

        // Bersihkan data lama, sisakan header
        const header = tableContainer.querySelector('.header-row');
        tableContainer.innerHTML = '';
        tableContainer.appendChild(header);

        data.forEach((item) => {
            const row = document.createElement('div');
            row.className = 'notes-row';
            
            // Format Jam agar rapi
            const jam = `${item.jam_mulai.substring(0,5)}-${item.jam_selesai.substring(0,5)}`;

            row.innerHTML = `
                <div class="notes-col">${item.tanggal}</div>
                <div class="notes-col">${jam}</div>
                <div class="notes-col">${item.ruangan || '-'}</div>
                <div class="notes-col">${item.matkul}</div>
                <div class="notes-col">${item.dosen || '-'}</div>
                <div class="notes-col catatan-col" contenteditable="true" data-id="${item.id}">
                    ${item.catatan || ''}
                </div>
                <div class="notes-col">
                    <button onclick="hapusJadwal(${item.id})" style="border:none; background:none; cursor:pointer; color:#b0b0b0;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            tableContainer.appendChild(row);
        });
    } catch (err) {
        console.error("Gagal muat data:", err);
    }
    const data = await res.json();
markCalendarDots(data);

}

    function markCalendarDots(data) {
    const allDays = document.querySelectorAll('.calendar-day:not(.empty)');

    allDays.forEach(dayEl => {
        const dayNum = dayEl.textContent.trim();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dateStr = `${year}-${month}-${String(dayNum).padStart(2, '0')}`;

        const hasData = data.some(d => d.tanggal === dateStr);
        dayEl.classList.toggle('has-schedule', hasData);
    });
}


    // --- 2. Kalender Render ---
    function renderCalendar(date) {
        calendarGrid.innerHTML = `
            <div class="day-name">SUN</div><div class="day-name">MON</div>
            <div class="day-name">TUE</div><div class="day-name">WED</div>
            <div class="day-name">THU</div><div class="day-name">FRI</div>
            <div class="day-name">SAT</div>`;
            
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        currentMonthYear.textContent = `${date.toLocaleString('id-ID', { month: 'long' })} ${year}`;

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            calendarGrid.appendChild(empty);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const d = document.createElement('div');
            d.className = 'calendar-day';
            d.style.position = 'relative';
            d.textContent = day;
            d.onclick = () => {
                if (activeDay) activeDay.classList.remove('active');
                d.classList.add('active');
                activeDay = d;
                activeDateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                jadwalInputPopup.style.display = 'flex'; 
            };
            calendarGrid.appendChild(d);
        }
        loadHistoryFromDB(); // Tarik data setiap kali bulan berubah
    }

    // --- 3. Logika Kirim ---
    kirimBtn.onclick = async () => {
        const payload = {
            tanggal: activeDateISO,
            matkul: document.getElementById('matkulInput').value.trim(),
            dosen: document.getElementById('dosenInput').value.trim(),
            ruangan: document.getElementById('ruanganInput').value.trim(),
            jam_mulai: document.getElementById('jamMulaiInput').value,
            jam_selesai: document.getElementById('jamSelesaiInput').value,
            catatan: document.getElementById('catatanInput').value.trim()
        };

        if (!payload.matkul || !payload.jam_mulai) {
            alert("Mata Kuliah dan Jam Mulai wajib diisi!");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/jadwal_create.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert("Jadwal tersimpan!");
                jadwalInputPopup.style.display = 'none';
                document.querySelectorAll('input').forEach(i => i.value = ''); // reset form
                loadHistoryFromDB();
            }
        } catch (e) { console.error(e); }
    };

    batalBtn.onclick = () => { jadwalInputPopup.style.display = 'none'; };

    // Init
    renderCalendar(currentDate);
    prevMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate); };
    nextMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate); };
});

// Fungsi Global Hapus
async function hapusJadwal(id) {
    if (!confirm("Hapus jadwal ini?")) return;
    try {
        await fetch(`./api/jadwal_delete.php?id=${id}`);
        location.reload();
    } catch (err) { alert("Gagal hapus"); }
}

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