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

const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

let currentFocus = -1;
let selectableItems = [];

searchInput.addEventListener("input", function () {
  const keyword = this.value.trim();

  if (keyword.length === 0) {
    suggestions.style.display = "none";
    suggestions.innerHTML = "";
    return;
  }

  clearTimeout(window._searchTimer);
  window._searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(
        "search.php?keyword=" + encodeURIComponent(keyword)
      );

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      console.log("RAW DATA FROM PHP:", data);

      suggestions.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        suggestions.style.display = "none";
        return;
      }

      data.forEach(item => {
        console.log("ITEM:", item);

        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${item.matkul} — ${item.dosen}`;
        li.onclick = () => {
          window.location.href = "jadwalutama.php?id=" + item.id_jadwal;
        };
        suggestions.appendChild(li);
      });

      suggestions.style.display = "block";
      selectableItems = Array.from(suggestions.querySelectorAll("li"));
      currentFocus = -1;

    } catch (err) {
      console.error(err);
      suggestions.style.display = "none";
    }
  }, 220);
});

searchInput.addEventListener("keydown", function (e) {
  if (suggestions.style.display === "none") return;

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
}

function removeActive(items) {
  items.forEach(item => item.classList.remove("active"));
}

document.addEventListener("click", function (e) {
  if (
    !searchInput.contains(e.target) &&
    !suggestions.contains(e.target)
  ) {
    suggestions.style.display = "none";
  }
});

// =================================================================
// === Calendar & Database Logic - FINAL VERSION ===
// =================================================================
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

    // --- Helper Fungsi API (DIPERBAIKI) ---
    async function apiJSON(url, options) {
        const res = await fetch(url, options);
        const text = await res.text(); // Ambil teks mentah dulu
        
        try {
            return JSON.parse(text); // Coba ubah ke JSON
        } catch (e) {
            // Jika gagal, tampilkan error asli dari PHP di console
            console.error("Respon Server Bukan JSON:", text);
            throw new Error(`Server Error: ${text.substring(0, 100)}...`);
        }
    }

    // --- Dropdowns Datalist ---
    async function loadDropdownsFromDB() {
        const fillDatalist = async (listId, url) => {
            try {
                const data = await apiJSON(url);
                const listEl = document.getElementById(listId);
                if (Array.isArray(data) && listEl) {
                    listEl.innerHTML = data.map(x => {
                        const val = x.nama || x.matkul || x.dosen || x.ruangan || Object.values(x)[0];
                        return `<option value="${val}"></option>`;
                    }).join('');
                }
            } catch (err) { 
                console.error(`Gagal load ${listId}:`, err); 
            }
        };

        await Promise.all([
            fillDatalist('matkulList', `${API_BASE}/mata_kuliah_list.php`),
            fillDatalist('dosenList', `${API_BASE}/dosen_list.php`),
            fillDatalist('ruanganList', `${API_BASE}/ruangan_list.php`)
        ]);
    }

    // --- Reset Form Fungsi ---
    function resetPopupForm() {
        document.getElementById('matkulInput').value = "";
        document.getElementById('dosenInput').value = "";
        document.getElementById('ruanganInput').value = "";
        document.getElementById('jamMulaiInput').value = "";
        document.getElementById('jamSelesaiInput').value = "";
        document.getElementById('manualTimeInput').value = "";
        document.getElementById('catatanInput').value = "";
        if (activeDay) activeDay.classList.remove('active');
    }

    // --- Kalender Render ---
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
            d.textContent = day;
            d.onclick = async () => {
                if (activeDay) activeDay.classList.remove('active');
                d.classList.add('active');
                activeDay = d;
                activeDateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                await loadDropdownsFromDB();
                jadwalInputPopup.style.display = 'flex'; 
            };
            calendarGrid.appendChild(d);
        }
    }

    // --- LOGIKA KIRIM (Disesuaikan Input Baru) ---
    kirimBtn.onclick = async () => {
    // 1. Ambil input
    const inputs = {
        matkul: document.getElementById('matkulInput'),
        dosen: document.getElementById('dosenInput'),
        ruangan: document.getElementById('ruanganInput'),
        mulai: document.getElementById('jamMulaiInput'),
        selesai: document.getElementById('jamSelesaiInput'),
        manual: document.getElementById('manualTimeInput'),
        catatan: document.getElementById('catatanInput')
    };

    // 2. Olah Waktu (Manual vs Picker)
    let finalMulai = inputs.mulai.value;
    let finalSelesai = inputs.selesai.value;

    if (inputs.manual.value.trim() !== "") {
        const parts = inputs.manual.value.split('-');
        finalMulai = parts[0]?.trim() || inputs.manual.value;
        finalSelesai = parts[1]?.trim() || "";
    }

    // 3. Payload (Sesuaikan KEY ini dengan yang dibaca file PHP kamu!)
    const payload = {
        tanggal: activeDateISO,
        matkul: inputs.matkul.value.trim(),
        dosen: inputs.dosen.value.trim() || "-",
        ruangan: inputs.ruangan.value.trim() || "-",
        jam_mulai: finalMulai,
        jam_selesai: finalSelesai || "-", // Jangan kirim kosong agar PHP gak error
        catatan: inputs.catatan.value.trim() || "-"
    };

    // 4. Validasi Dasar
    if (!payload.tanggal || !payload.matkul || !payload.jam_mulai) {
        alert("Wajib isi minimal Tanggal, Matkul, dan Jam Mulai!");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/jadwal_create.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const rawText = await response.text();
        console.log("Server Response:", rawText); // Intip ini di F12 jika gagal

        const result = JSON.parse(rawText);
        if (result.status === 'success' || result.status === 'ok') {
            alert('Mantap! Jadwal tersimpan.');
            location.reload();
        } else {
            alert('Gagal: ' + (result.message || 'Error tidak diketahui'));
        }
    } catch (e) {
        console.error("Fetch Error:", e);
        alert("Gagal memproses data. Cek tab Console (F12) untuk detail.");
    }
};
    // --- Event Buttons ---
    batalBtn.onclick = () => { 
        jadwalInputPopup.style.display = 'none'; 
        resetPopupForm();
    };

    window.onclick = (e) => {
        if (e.target === jadwalInputPopup) {
            jadwalInputPopup.style.display = 'none';
            resetPopupForm();
        }
    };

    // --- Init ---
    renderCalendar(currentDate);
    // loadHistoryFromDB(); // Aktifkan jika fungsi ini sudah ada
    
    prevMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate); };
    nextMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate); };
});