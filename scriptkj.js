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
// === Calendar & FULL DB Logic ===
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

  const mainNotesTable = document.getElementById('mainNotesTable');
  const saveMainNotesBtn = document.getElementById('saveMainNotes');

  const selMatkul = document.getElementById('mataKuliahSelect');
  
  const selDosen = document.getElementById('dosenSelect');
  
  const selRuangan = document.getElementById('ruanganSelect');
  
  const selWaktu = document.getElementById('waktuSelect');
  
  const catatanInput = document.getElementById('catatanInput');

  let currentDate = new Date();
  let activeDay = null;
  let activeDateISO = null; // YYYY-MM-DD

  // ---------- helpers ----------
  async function apiJSON(url, options) {
    const res = await fetch(url, options);

    // ambil text dulu supaya kalau PHP error (HTML) ketahuan
    const text = await res.text();

    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      throw new Error(`Response bukan JSON dari ${url}. Isi awal: ${text.slice(0, 120)}...`);
    }

    if (!res.ok) {
      const msg = (data && data.message) ? data.message : `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return data;
  }

  const fmtTanggalID = (iso) =>
    new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
      .format(new Date(iso));

  const fmtWaktu = (mulai, selesai) => `${mulai.replace(':', '.')}-${selesai.replace(':', '.')}`;

  function clearHistoryRows() {
    mainNotesTable.querySelectorAll('.notes-row.editable-row').forEach(r => r.remove());
  }

  // ---------- render 1 row history ----------
  function renderScheduleRow(row) {
    const newRow = document.createElement('div');
    newRow.classList.add('notes-row', 'editable-row');
    newRow.setAttribute('data-id', row.id);

    newRow.innerHTML = `
      <div class="notes-col">${fmtTanggalID(row.tanggal)}</div>
      <div class="notes-col">${fmtWaktu(row.mulai, row.selesai)}</div>
      <div class="notes-col">${row.ruangan}</div>
      <div class="notes-col">${row.matkul}</div>
      <div class="notes-col">${row.dosen}</div>
      <div class="notes-col catatan" contenteditable="true">${row.catatan ?? ''}</div>
      <div class="notes-col delete-btn" style="text-align:center; cursor:pointer;">🗑️</div>
    `;

    // hapus DB
    newRow.querySelector('.delete-btn').addEventListener('click', async () => {
      const id = newRow.getAttribute('data-id');
      if (!confirm('Hapus jadwal ini?')) return;

      try {
        await apiJSON(`${API_BASE}/jadwal_delete.php?id=${encodeURIComponent(id)}`);
        newRow.remove();
        await highlightScheduledDates();
      } catch (e) {
        alert('Gagal hapus: ' + e.message);
      }
    });

    // update catatan DB saat blur
    newRow.querySelector('.notes-col.catatan').addEventListener('blur', async (e) => {
      const id = newRow.getAttribute('data-id');
      const catatan = e.target.textContent;

      try {
        await apiJSON(`${API_BASE}/jadwal_update_catatan.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, catatan })
        });
      } catch (err) {
        alert('Gagal simpan catatan: ' + err.message);
      }
    });

    mainNotesTable.appendChild(newRow);
  }

  // ---------- load history ----------
  async function loadHistoryFromDB() {
    clearHistoryRows();
    const rows = await apiJSON(`${API_BASE}/jadwal_list.php`);

    // ini kunci biar ga error forEach
    if (!Array.isArray(rows)) {
      console.error('jadwal_list.php mengembalikan:', rows);
      throw new Error('Data histori bukan array (cek jadwal_list.php / db.php).');
    }

    rows.forEach(renderScheduleRow);
  }

  // ---------- dropdowns ----------
  async function loadDropdownsFromDB() {
    const fill = async (selectEl, url, placeholder) => {
      const data = await apiJSON(url);

      if (!Array.isArray(data)) {
        console.error('Dropdown API return:', url, data);
        throw new Error(`Data dropdown bukan array (${url})`);
      }

      selectEl.innerHTML =
        `<option value="" disabled selected>${placeholder}</option>` +
        data.map(x => {
          const id = x.id ?? x.matkul ?? x.dosen;
          const nama = x.nama ?? x.matkul ?? x.dosen;
          return `<option value="${id}">${nama}</option>`;
        }).join('');
    };

    await fill(selMatkul, `${API_BASE}/mata_kuliah_list.php`, 'Pilih Mata Kuliah');
    await fill(selDosen, `${API_BASE}/dosen_list.php`, 'Pilih Dosen');
    await fill(selRuangan, `${API_BASE}/ruangan_list.php`, 'Pilih Ruangan');

    const waktu = await apiJSON(`${API_BASE}/waktu_slot_list.php`);
    if (!Array.isArray(waktu)) {
      console.error('waktu_slot_list.php return:', waktu);
      throw new Error('Data waktu bukan array (cek waktu_slot_list.php).');
    }

    selWaktu.innerHTML =
      `<option value="" disabled selected>Pilih Waktu</option>` +
      waktu.map(w => `<option value="${w.id}">${fmtWaktu(w.mulai, w.selesai)}</option>`).join('');
  }

  // ---------- calendar ----------
  function renderCalendar(date) {
    calendarGrid.innerHTML = `
      <div class="day-name">SUN</div>
      <div class="day-name">MON</div>
      <div class="day-name">TUE</div>
      <div class="day-name">WED</div>
      <div class="day-name">THU</div>
      <div class="day-name">FRI</div>
      <div class="day-name">SAT</div>
    `;

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    currentMonthYear.textContent = `${date.toLocaleString('id-ID', { month: 'long' })} ${year}`;

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.classList.add('calendar-day', 'empty');
      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = document.createElement('div');
      d.classList.add('calendar-day');
      d.textContent = day;

      d.addEventListener('click', async () => {
        if (activeDay) activeDay.classList.remove('active');
        d.classList.add('active');
        activeDay = d;

        // set ISO date
        const mm = String(month + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        activeDateISO = `${year}-${mm}-${dd}`;

        try {
          await loadDropdownsFromDB();
          jadwalInputPopup.style.display = 'flex';
        } catch (e) {
          alert('Gagal load dropdown: ' + e.message);
        }
      });

      calendarGrid.appendChild(d);
    }
  }

  // highlight dates with schedules (DB)
  async function highlightScheduledDates() {
    // bersihin highlight lama
    document.querySelectorAll('.calendar-day.has-schedule').forEach(el => el.classList.remove('has-schedule'));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const days = await apiJSON(`${API_BASE}/jadwal_days_in_month.php?year=${year}&month=${month}`);
    if (!Array.isArray(days)) {
      console.error('jadwal_days_in_month.php return:', days);
      throw new Error('Data highlight bukan array (cek jadwal_days_in_month.php).');
    }

    const setDays = new Set(days);

    document.querySelectorAll('.calendar-day').forEach(dayEl => {
      if (dayEl.classList.contains('empty')) return;
      const dayNum = parseInt(dayEl.textContent, 10);
      if (setDays.has(dayNum)) dayEl.classList.add('has-schedule');
    });
  }

  // ---------- init ----------
  renderCalendar(currentDate);
  loadHistoryFromDB().catch(e => alert('Gagal load histori: ' + e.message));
  highlightScheduledDates().catch(() => {});

  // prev / next month
  prevMonth.addEventListener('click', async () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
    await highlightScheduledDates();
  });

  nextMonth.addEventListener('click', async () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
    await highlightScheduledDates();
  });

  // batal
  batalBtn.addEventListener('click', () => {
    jadwalInputPopup.style.display = 'none';
  });

  // close popup klik luar
  jadwalInputPopup.addEventListener('click', (e) => {
    if (e.target === jadwalInputPopup) jadwalInputPopup.style.display = 'none';
  });

  // KIRIM -> simpan ke DB
  kirimBtn.addEventListener('click', async () => {
    if (!activeDateISO) {
      alert('Pilih tanggal dulu dari kalender.');
      return;
    }

    const payload = {
      tanggal: activeDateISO,
      mata_kuliah_id: selMatkul.value,
      dosen_id: selDosen.value,
      ruangan_id: selRuangan.value,
      waktu_slot_id: selWaktu.value,
      catatan: catatanInput.value || ''
    };

    if (!payload.mata_kuliah_id || !payload.dosen_id || !payload.ruangan_id || !payload.waktu_slot_id) {
      alert('Lengkapi semua field (Mata Kuliah, Dosen, Ruangan, Waktu) sebelum mengirim.');
      return;
    }

    try {
      const out = await apiJSON(`${API_BASE}/jadwal_create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      renderScheduleRow(out.data);
      await highlightScheduledDates();

      // reset input
      selMatkul.selectedIndex = 0;
      selDosen.selectedIndex = 0;
      selRuangan.selectedIndex = 0;
      selWaktu.selectedIndex = 0;
      catatanInput.value = '';

      if (activeDay) activeDay.classList.remove('active');
      activeDay = null;
      activeDateISO = null;

      jadwalInputPopup.style.display = 'none';
      alert('Jadwal berhasil disimpan ke database!');
    } catch (e) {
      alert('Gagal simpan: ' + e.message);
    }
  });

  // tombol simpan catatan (sekarang catatan autosave)
  saveMainNotesBtn.addEventListener('click', () => {
    alert('Catatan tersimpan otomatis saat kamu selesai edit (klik di luar kolom catatan).');
  });
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