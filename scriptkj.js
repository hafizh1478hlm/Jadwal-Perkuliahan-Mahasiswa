// ================================
// scriptkj.js (NO CRASH VERSION)
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = './api';

  const byId = (id) => document.getElementById(id);

  const calendarGrid = byId('calendarGrid') || document.querySelector('.calendar-grid');
  const currentMonthYear = byId('currentMonthYear');
  const prevMonth = byId('prevMonth');
  const nextMonth = byId('nextMonth');

  const jadwalInputPopup = byId('jadwalInputPopup');
  const kirimBtn = byId('kirimJadwal');
  const batalBtn = byId('batalJadwal');

  // Kalau elemen inti kalender gak ada, stop (biar gak error)
  if (!calendarGrid || !currentMonthYear || !prevMonth || !nextMonth) {
    // Jangan ganggu demo, cuma stop script.
    console.error('Elemen kalender tidak ditemukan. Halaman/DOM tidak cocok.');
    return;
  }

  let currentDate = new Date();
  let activeDay = null;
  let activeDateISO = null;

  async function apiJSON(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Respon bukan JSON:', url, text);
      return null; // ✅ penting: jangan throw
    }
  }

  // ✅ NO CRASH: kalau listEl null -> return
  async function loadDropdownsFromDB() {
    const fillDatalist = async (listId, url) => {
      const listEl = byId(listId);
      if (!listEl) return; // ✅ stop diam-diam (tidak crash)

      const data = await apiJSON(url);
      if (!Array.isArray(data)) return;

      // ✅ aman: reset & append option
      listEl.innerHTML = '';
      for (const x of data) {
        const opt = document.createElement('option');
        opt.value = (x && x.nama) ? x.nama : '';
        listEl.appendChild(opt);
      }
    };

    await fillDatalist('matkulList', `${API_BASE}/mata_kuliah_list.php`);
    await fillDatalist('dosenList', `${API_BASE}/dosen_list.php`);
    await fillDatalist('ruanganList', `${API_BASE}/ruangan_list.php`);
  }

  function resetPopupForm() {
    const ids = [
      'matkulInput',
      'dosenInput',
      'ruanganInput',
      'jamMulaiInput',
      'jamSelesaiInput',
      'manualTimeInput',
      'catatanInput',
    ];
    for (const id of ids) {
      const el = byId(id);
      if (el) el.value = '';
    }
    if (activeDay) activeDay.classList.remove('active');
  }

  function renderCalendar(date) {
    // Header hari
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
        if (activeDay) activeDay.classList.remove('active');
        d.classList.add('active');
        activeDay = d;

        activeDateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // ✅ tampilkan popup dulu (biar elemen di dalamnya pasti ada)
        if (jadwalInputPopup) jadwalInputPopup.style.display = 'flex';

        // ✅ load dropdown TANPA CRASH
        await loadDropdownsFromDB();
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
      const matkul = (byId('matkulInput')?.value || '').trim();
      const dosen = (byId('dosenInput')?.value || '').trim() || '-';
      const ruangan = (byId('ruanganInput')?.value || '').trim() || '-';
      const catatan = (byId('catatanInput')?.value || '').trim() || '-';

      const mulaiPicker = (byId('jamMulaiInput')?.value || '').trim();
      const selesaiPicker = (byId('jamSelesaiInput')?.value || '').trim();
      const manual = (byId('manualTimeInput')?.value || '').trim();

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
        let result = null;
        try { result = JSON.parse(raw); } catch (_) {}

        if (result && (result.status === 'success' || result.status === 'ok')) {
          alert('Mantap! Jadwal tersimpan.');
          location.reload();
        } else {
          alert('Gagal: ' + (result?.message || raw || 'Error tidak diketahui'));
        }
      } catch (e) {
        console.error(e);
        alert('Gagal memproses data.');
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
