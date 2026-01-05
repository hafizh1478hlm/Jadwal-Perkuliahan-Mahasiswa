document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = './api';
    
    // --- 1. ELEMENT SELECTORS ---
    const menuIcon = document.querySelector('.menu-icon');
    const userIcon = document.querySelector('.user-icon');
    const menuPopup = document.getElementById('menuPopup');
    const userPopup = document.getElementById('userPopup');
    
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const jadwalInputPopup = document.getElementById('jadwalInputPopup');
    
    let currentDate = new Date();
    let activeDateISO = null;

    // --- 2. LOGIKA DROPDOWN (PASTI JALAN) ---
    if (menuIcon && menuPopup) {
        menuIcon.onclick = (e) => {
            e.stopPropagation();
            menuPopup.style.display = (menuPopup.style.display === 'block') ? 'none' : 'block';
            userPopup.style.display = 'none';
        };
    }

    if (userIcon && userPopup) {
        userIcon.onclick = (e) => {
            e.stopPropagation();
            userPopup.style.display = (userPopup.style.display === 'block') ? 'none' : 'block';
            menuPopup.style.display = 'none';
        };
    }

    window.onclick = () => {
        if (menuPopup) menuPopup.style.display = 'none';
        if (userPopup) userPopup.style.display = 'none';
    };

    // --- 3. FUNGSI LOAD DATA & TITIK KALENDER ---
    async function loadHistoryFromDB() {
        const tableContainer = document.getElementById('mainNotesTable');
        if (!tableContainer) return;

        try {
            const res = await fetch(`${API_BASE}/jadwal_list.php`);
            const data = await res.json();

            // Render Tabel
            const header = tableContainer.querySelector('.header-row');
            tableContainer.innerHTML = '';
            tableContainer.appendChild(header);

            data.forEach((item) => {
                const row = document.createElement('div');
                row.className = 'notes-row';
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

            // Tandai Titik Biru di Kalender
            markCalendarDots(data);

        } catch (err) {
            console.error("Gagal muat data:", err);
        }
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

    // --- 4. RENDER KALENDER ---
    function renderCalendar(date) {
        if (!calendarGrid) return;
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
            d.onclick = () => {
                activeDateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                jadwalInputPopup.style.display = 'flex'; 
            };
            calendarGrid.appendChild(d);
        }
        loadHistoryFromDB();
    }

    // --- 5. EVENT LISTENERS ---
    if (prevMonth) prevMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate); };
    if (nextMonth) nextMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate); };
    
    if (document.getElementById('batalJadwal')) {
        document.getElementById('batalJadwal').onclick = () => { jadwalInputPopup.style.display = 'none'; };
    }

    renderCalendar(currentDate);
});

// FUNGSI GLOBAL (Taruh di luar DOMContentLoaded)
async function hapusJadwal(id) {
    if (!confirm("Hapus jadwal ini?")) return;
    try {
        const res = await fetch(`./api/jadwal_delete.php?id=${id}`);
        const result = await res.json();
        if(result.status === 'success') location.reload();
    } catch (err) { alert("Gagal hapus"); }
}