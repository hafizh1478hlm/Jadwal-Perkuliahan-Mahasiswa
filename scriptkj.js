// ================================
// scriptkj.js (ANTI NULL + DEBUG)
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = './api';

  // Helper ambil elemen (kalau tidak ada, kasih error jelas)
  const $id = (id) => {
    const el = document.getElementById(id);
    if (!el) console.error(`[MISSING ELEMENT] id="${id}" tidak ditemukan di halaman ini.`);
    return el;
  };

  const $q = (sel) => {
    const el = document.querySelector(sel);
    if (!el) console.error(`[MISSING ELEMENT] selector="${sel}" tidak ditemukan di halaman ini.`);
    return el;
  };

  // Pastikan ini benar-benar script yang ke-load
  console.log('SCRIPTKJ LOADED ✅', window.location.href);

  // Ambil element penting
  const calendarGrid = $id('calendarGrid') || $q('.calendar-grid');
  const currentMonthYear = $id('currentMonthYear');
  const prevMonth = $id('prevMonth');
  const nextMonth = $id('nextMonth');

  const jadwalInputPopup = $id('jadwalInputPopup');
  const kirimBtn = $id('kirimJadwal');
  const batalBtn = $id('batalJadwal');

  // Kalau elemen inti kalender aja nggak ada, stop biar nggak error
  if (!calendarGrid || !currentMonthYear || !prevMonth || !nextMonth) {
    alert('Halaman yang kebuka tidak cocok dengan scriptkj.js (elemen kalender tidak ditemukan). Cek kamu buka file yang benar (duplikat folder?)');
    return;
  }

  let currentDate = new Date();
  let activeDay = null;
  let activeDateISO = null;

  // API helper: ambil text dulu, parse JSON, kalau gagal tampilkan raw
  async function apiJSON(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Respon Server Bukan JSON:', url, text);
      throw new Error(`Server bukan JSON dari ${url}: ${text.substring(0, 150)}...`);
    }
  }

  // Load dropdown (id, nama)
  async function loadDropdownsFromDB() {
    const fillDatalist = async (listId, url) => {
      const listEl = $id(listId);
      if (!listEl) throw new Error(`Datalist "${listId}" tidak ditemukan di HTML`);

      const data = await apiJSON(url);
      if (!Array.isArray(data)) throw new Error(`Response ${url} bukan array`);

      listEl.innerHTML = data
        .map((x) => `<option value="${x?.nama ?? ''}"></option>`)
        .join('');
    };

    await Promise.all([
      fillDatalist('matkulList', `${API_BASE}/mata_kuliah_list.php`),
      fillDatalist('dosenList', `${API_BASE}/dosen_list.php`),
      fillDatalist('ruanganList', `${API_BASE}/ruangan_list.php`),
    ]);
  }

  function resetPopupForm() {
    ['matkulInput', 'dosenInput', 'ruanganInput', 'jamMulaiInput', 'jamSelesaiInput', 'manualTimeInput', 'catatanInput']
      .forEach((id) => {
        const el = $id(id);
        if (el) el.value = '';
      });

    if (activeDay) activeDay.classList.remove('active');
  }

  function renderCalendar(date) {
    // kalender header hari
    calendarGrid.innerHTML = `
      <div class="day-name">SUN</div><div class="day-name">MON</div>
      <div class="day-name">TUE</div><div class="day-name">WED</div>
      <div class="day-name">THU</div><div class="day-name">FRI</div>
      <div class="day-name">SAT</div>
    `;

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
        if (!jadwalInputPopup) {
          alert('Popup jadwalInputPopup tidak ditemukan di HTML.');
          return;
        }

        if (activeDay) activeDay.classList.remove('active');
        d.classList.add('active');
        activeDay = d;

        activeDateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        try {
          await loadDropdownsFromDB();
        } catch (e) {
          alert('Gagal load dropdown: ' + e.message);
          console.error(e);
          return;
        }

        jadwalInputPopup.style.display = 'flex';
      };

      calendarGrid.appendChild(d);
    }
  }

  // Tombol batal popup
  if (batalBtn && jadwalInputPopup) {
    batalBtn.onclick = () => {
      jadwalInputPopup.style.display = 'none';
      resetPopupForm();
    };
  }

  // Klik luar popup
  if (jadwalInputPopup) {
    window.addEventListener('click', (e) => {
      if (e.target === jadwalInputPopup) {
        jadwalInputPopup.style.display = 'none';
        resetPopupForm();
      }
    });
  }

  // Tombol kirim
  if (kirimBtn) {
    kirimBtn.onclick = async () => {
      const matkul = ($id('matkulInput')?.value || '').trim();
      const dosen = ($id('dosenInput')?.value || '').trim() || '-';
      const ruangan = ($id('ruanganInput')?.value || '').trim() || '-';
      const catatan = ($id('catatanInput')?.value || '').trim() || '-';

      const mulaiPicker = ($id('jamMulaiInput')?.value || '').trim();
      const selesaiPicker = ($id('jamSelesaiInput')?.value || '').trim();
      const manual = ($id('manualTimeInput')?.value || '').trim();

      let jam_mulai = mulaiPicker;
      let jam_selesai = selesaiPicker;

      if (manual !== '') {
        const parts = manual.split('-');
        jam_mulai = (parts[0] || '').trim() || manual;
        jam_selesai = (parts[1] || '').trim() || '-';
      }

      const payload = {
        tanggal: activeDateISO,
        matkul,
        dosen,
        ruangan,
        jam_mulai: jam_mulai || '',
        jam_selesai: jam_selesai || '-',
        catatan,
      };

      if (!payload.tanggal || !payload.matkul || !payload.jam_mulai) {
        alert('Wajib isi minimal Tanggal, Matkul, dan Jam Mulai!');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/jadwal_create.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const raw = await res.text();
        console.log('Server Response:', raw);

        const result = JSON.parse(raw);
        if (result.status === 'success' || result.status === 'ok') {
          alert('Mantap! Jadwal tersimpan.');
          location.reload();
        } else {
          alert('Gagal: ' + (result.message || 'Error tidak diketahui'));
        }
      } catch (e) {
        console.error(e);
        alert('Gagal memproses data. Cek Console (F12).');
      }
    };
  }

  // Navigasi bulan
  prevMonth.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  };

  nextMonth.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  };

  // Init
  renderCalendar(currentDate);
});
