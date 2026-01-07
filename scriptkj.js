document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = './api';

    // --- 1. ELEMENT SELECTORS ---
    const menuIcon = document.querySelector('.menu-icon');
    const userIcon = document.querySelector('.user-icon');
    const menuPopup = document.getElementById('menuPopup');
    const userPopup = document.getElementById('userPopup');

    const btnUbahSandi = document.getElementById('btnUbahSandi');
    const modalSandi = document.getElementById('changePasswordModal');
    const closeSandi = document.querySelector('.modal-password .close');

    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const jadwalInputPopup = document.getElementById('jadwalInputPopup');
    const btnKirim = document.getElementById('kirimJadwal');

    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');
    
    let currentDate = new Date();
    let activeDateISO = null;
    let selectedIndex = -1; 

    // --- 2. LOGIKA DROPDOWN & MODAL ---
    if (menuIcon && menuPopup) {
        menuIcon.onclick = (e) => {
            e.stopPropagation();
            menuPopup.style.display = (menuPopup.style.display === 'block') ? 'none' : 'block';
            if (userPopup) userPopup.style.display = 'none';
        };
    }

    if (userIcon && userPopup) {
        userIcon.onclick = (e) => {
            e.stopPropagation();
            userPopup.style.display = (userPopup.style.display === 'block') ? 'none' : 'block';
            if (menuPopup) menuPopup.style.display = 'none';
        };
    }

    if (btnUbahSandi && modalSandi) {
        btnUbahSandi.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            modalSandi.style.display = 'flex';
            if (userPopup) userPopup.style.display = 'none';
        };
    }

    if (closeSandi) {
        closeSandi.onclick = () => { modalSandi.style.display = 'none'; };
    }

    window.onclick = (event) => {
        if (event.target == modalSandi) modalSandi.style.display = 'none';
        if (event.target == jadwalInputPopup) jadwalInputPopup.style.display = 'none';
        if (!event.target.closest('.menu-icon') && !event.target.closest('.user-icon')) {
            if (menuPopup) menuPopup.style.display = 'none';
            if (userPopup) userPopup.style.display = 'none';
        }
    };

    // --- 3. FUNGSI LOAD & KALENDER ---
    async function loadHistoryFromDB() {
        const tableContainer = document.getElementById('mainNotesTable');
        if (!tableContainer) return;
        try {
            const res = await fetch(`${API_BASE}/jadwal_list.php`);
            const data = await res.json();
            const header = tableContainer.querySelector('.header-row');
            tableContainer.innerHTML = '';
            if (header) tableContainer.appendChild(header);

            data.forEach((item) => {
                const row = document.createElement('div');
                row.className = 'notes-row';
                row.setAttribute('data-id', item.id); 

                const jam = `${item.jam_mulai.substring(0,5)}-${item.jam_selesai.substring(0,5)}`;
                row.innerHTML = `
                    <div class="notes-col">${item.tanggal}</div>
                    <div class="notes-col">${jam}</div>
                    <div class="notes-col">${item.ruangan || '-'}</div>
                    <div class="notes-col">${item.matkul}</div>
                    <div class="notes-col">${item.dosen || '-'}</div>
                    <div class="notes-col catatan-col edit-catatan" contenteditable="true" style="background: #fffdf0; border: 1px dashed #ccc; border-radius: 4px;">${item.catatan || ''}</div>
                    <div class="notes-col">
                        <button onclick="hapusJadwal(${item.id})" style="border:none; background:none; cursor:pointer; color:#b0b0b0;">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>`;
                tableContainer.appendChild(row);
            });
            markCalendarDots(data);
        } catch (err) { console.error("Gagal muat data:", err); }
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

    function renderCalendar(date) {
        if (!calendarGrid) return;
        calendarGrid.innerHTML = `<div class="day-name">SUN</div><div class="day-name">MON</div><div class="day-name">TUE</div><div class="day-name">WED</div><div class="day-name">THU</div><div class="day-name">FRI</div><div class="day-name">SAT</div>`;
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
            d.onclick = () => {
                activeDateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                jadwalInputPopup.style.display = 'flex';
            };
            calendarGrid.appendChild(d);
        }
        loadHistoryFromDB();
    }

    // --- 4. DROPDOWN & SIMPAN DATA BARU ---
    async function loadDropdownData() {
        const types = ['matkul', 'dosen', 'ruangan'];
        for (const type of types) {
            try {
                const res = await fetch(`${API_BASE}/get_dropdown_data.php?type=${type}`);
                const data = await res.json();
                const listElement = document.getElementById(`${type}List`);
                if (listElement) {
                    listElement.innerHTML = data.map(item => `<option value="${item}">`).join('');
                }
            } catch (err) { console.error(`Gagal muat data ${type}:`, err); }
        }
    }

    if (btnKirim) {
        btnKirim.onclick = async () => {
            const data = {
                tanggal: activeDateISO,
                matkul: document.getElementById('matkulInput').value,
                dosen: document.getElementById('dosenInput').value,
                ruangan: document.getElementById('ruanganInput').value,
                jam_mulai: document.getElementById('jamMulaiInput').value,
                jam_selesai: document.getElementById('jamSelesaiInput').value,
                catatan: document.getElementById('catatanInput').value
            };
            if (!data.matkul || !data.jam_mulai) {
                alert("Mata Kuliah dan Jam Mulai wajib diisi!");
                return;
            }
            try {
                const res = await fetch(`${API_BASE}/jadwal_create.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.status === 'success') {
                    alert("Berhasil disimpan!");
                    jadwalInputPopup.style.display = 'none';
                    ['matkulInput', 'dosenInput', 'ruanganInput', 'jamMulaiInput', 'jamSelesaiInput', 'catatanInput'].forEach(id => {
                        document.getElementById(id).value = '';
                    });
                    loadHistoryFromDB();
                }
            } catch (err) { alert("Gagal menyimpan data."); }
        };
    }

    // --- 5. LOGIKA SEARCH FINAL ---
    if (searchInput && suggestions) {
        searchInput.addEventListener('input', async () => {
            const query = searchInput.value.trim();
            selectedIndex = -1; 
            if (query.length < 2) {
                suggestions.style.display = 'none';
                return;
            }
            try {
                const res = await fetch(`search.php?keyword=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (data.length > 0) {
                    suggestions.innerHTML = data.map((item, index) => `
                        <li class="list-group-item list-group-item-action suggestion-item" 
                            data-index="${index}" data-value="${item.matkul}" style="cursor:pointer; font-size: 13px;">
                            <strong>${item.matkul}</strong> <br>
                            <small class="text-muted">${item.dosen} | ${item.hari}</small>
                        </li>`).join('');
                    suggestions.style.display = 'block';
                } else { suggestions.style.display = 'none'; }
            } catch (err) { console.error("Error search:", err); }
        });

        searchInput.addEventListener('keydown', (e) => {
            const items = suggestions.querySelectorAll('.suggestion-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateSelection(items);
            } else if (e.key === 'Enter') {
                if (selectedIndex > -1) {
                    goToJadwalUtama(items[selectedIndex].getAttribute('data-value'));
                } else if (searchInput.value.trim() !== "") {
                    goToJadwalUtama(searchInput.value);
                }
            }
        });

        suggestions.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li) goToJadwalUtama(li.getAttribute('data-value'));
        });
    }

    function updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('active', index === selectedIndex);
            if (index === selectedIndex) item.scrollIntoView({ block: 'nearest' });
        });
    }

    function goToJadwalUtama(query) {
        if (!query) return;
        window.location.href = `jadwalutama.php?search=${encodeURIComponent(query)}`;
    }

    // --- 6. FIX SIMPAN CATATAN (DIPINDAHKAN KE SINI) ---
    const btnSaveMainNotes = document.getElementById('saveMainNotes');
    if (btnSaveMainNotes) {
        btnSaveMainNotes.onclick = async () => {
            const rows = document.querySelectorAll('.notes-row[data-id]');
            let successCount = 0;

            for (const row of rows) {
                const id = row.getAttribute('data-id');
                const catatan = row.querySelector('.edit-catatan').innerText.trim();

                try {
                    const res = await fetch(`${API_BASE}/jadwal_update_catatan.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: id, catatan: catatan })
                    });
                    const result = await res.json();
                    if (result.ok) successCount++;
                } catch (err) {
                    console.error(`Gagal update ID ${id}:`, err);
                }
            }

            if (successCount > 0) {
                alert(`Berhasil menyimpan ${successCount} catatan!`);
                loadHistoryFromDB(); 
            }
        };
    }

    // Klik luar search untuk tutup saran
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            if (suggestions) suggestions.style.display = 'none';
        }
    });

    // Navigasi Kalender
    if (prevMonth) prevMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate); };
    if (nextMonth) nextMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate); };
    if (document.getElementById('batalJadwal')) {
        document.getElementById('batalJadwal').onclick = () => { jadwalInputPopup.style.display = 'none'; };
    }

    renderCalendar(currentDate);
    loadDropdownData();
});

// FUNGSI GLOBAL (Tetap di luar)
async function hapusJadwal(id) {
    if (!id || !confirm("Hapus jadwal ini?")) return;
    try {
        const res = await fetch(`./api/jadwal_delete.php?id=${id}`);
        const result = await res.json();
        if (result.status === 'success') {
            alert("Data terhapus");
            location.reload(); 
        }
    } catch (err) { alert("Gagal menghapus."); }
}