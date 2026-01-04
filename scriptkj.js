// =================================================================
// === Calendar & Database Logic - FINAL VERSION (PASTE READY) ===
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

  // --- Helper API: paksa baca text dulu, baru parse JSON (biar error PHP kebaca) ---
  async function apiJSON(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Respon Server Bukan JSON:', text);
      throw new Error(`Server Error: ${text.substring(0, 150)}...`);
    }
  }

  // --- Dropdowns Datalist: ambil langsung dari tabel masing-masing (id, nama) ---
  async function loadDropdownsFromDB() {
    const fillDatalist = async (listId, url) => {
      try {
        const data = await apiJSON(url);
        const listEl = document.getElementById(listId);
        if (!listEl) return;

        if (Array.isArray(data)) {
          // Karena API kamu output {id, nama}
          listEl.innerHTML = data
            .map((x) => {
              const val = (x && x.nama) ? x.nama : '';
              return `<option value="${val}"></option>`;
            })
            .join('');
        } else {
          console.warn(`Data ${listId} bukan array:`, data);
        }
      } catch (err) {
        console.error(`Gagal load ${listId}:`, err);
      }
    };

    await Promise.all([
      fillDatalist('matkulList', `${API_BASE}/mata_kuliah_list.php`),
      fillDatalist('dosenList', `${API_BASE}/dosen_list.php`),
      fillDatalist('ruanganList', `${API_BASE}/ruangan_list.php`),
    ]);
  }

  // --- Reset Form ---
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
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    if (activeDay) activeDay.classList.remove('active');
  }

  // --- Render Kalender ---
  function renderCalendar(date) {
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

        await loadDropdownsFromDB();
        jadwalInputPopup.style.display = 'flex';
      };

      calendarGrid.appendChild(d);
    }
  }

  // --- LOGIKA KIRIM JADWAL ---
  kirimBtn.onclick = async () => {
    const inputs = {
      matkul: document.getElementById('matkulInput'),
      dosen: document.getElementById('dosenInput'),
      ruangan: document.getElementById('ruanganInput'),
      mulai: document.getElementById('jamMulaiInput'),
      selesai: document.getElementById('jamSelesaiInput'),
      manual: document.getElementById('manualTimeInput'),
      catatan: document.getElementById('catatanInput'),
    };

    // Olah waktu (Manual vs Picker)
    let finalMulai = inputs.mulai?.value || '';
    let finalSelesai = inputs.selesai?.value || '';

    if ((inputs.manual?.value || '').trim() !== '') {
      const parts = inputs.manual.value.split('-');
      finalMulai = (parts[0] || '').trim() || inputs.manual.value.trim();
      finalSelesai = (parts[1] || '').trim();
    }

    // Payload (key harus sama dengan yang dibaca jadwal_create.php)
    const payload = {
      tanggal: activeDateISO,
      matkul: (inputs.matkul?.value || '').trim(),
      dosen: (inputs.dosen?.value || '').trim() || '-',
      ruangan: (inputs.ruangan?.value || '').trim() || '-',
      jam_mulai: (finalMulai || '').trim(),
      jam_selesai: (finalSelesai || '').trim() || '-',
      catatan: (inputs.catatan?.value || '').trim() || '-',
    };

    // Validasi dasar
    if (!payload.tanggal || !payload.matkul || !payload.jam_mulai) {
      alert('Wajib isi minimal Tanggal, Matkul, dan Jam Mulai!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/jadwal_create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      console.log('Server Response:', rawText);

      const result = JSON.parse(rawText);

      if (result.status === 'success' || result.status === 'ok') {
        alert('Mantap! Jadwal tersimpan.');
        location.reload();
      } else {
        alert('Gagal: ' + (result.message || 'Error tidak diketahui'));
      }
    } catch (e) {
      console.error('Fetch Error:', e);
      alert('Gagal memproses data. Cek tab Console (F12) untuk detail.');
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

  prevMonth.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  };

  nextMonth.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  };
});
