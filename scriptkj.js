// ======================================================
// NAVBAR POPUP
// ======================================================
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

// ======================================================
// SEARCH AUTOCOMPLETE
// ======================================================
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

let currentFocus = -1;
let selectableItems = [];

searchInput.addEventListener("input", function () {
  const keyword = this.value.trim();
  if (!keyword) {
    suggestions.style.display = "none";
    suggestions.innerHTML = "";
    return;
  }

  clearTimeout(window._searchTimer);
  window._searchTimer = setTimeout(async () => {
    try {
      const res = await fetch("search.php?keyword=" + encodeURIComponent(keyword));
      const data = await res.json();

      suggestions.innerHTML = "";
      if (!Array.isArray(data) || !data.length) {
        suggestions.style.display = "none";
        return;
      }

      data.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${item.matkul} — ${item.dosen}`;
        li.onclick = () => window.location.href = "jadwalutama.php?id=" + item.id_jadwal;
        suggestions.appendChild(li);
      });

      suggestions.style.display = "block";
      selectableItems = Array.from(suggestions.querySelectorAll("li"));
      currentFocus = -1;
    } catch {
      suggestions.style.display = "none";
    }
  }, 250);
});

searchInput.addEventListener("keydown", function (e) {
  if (suggestions.style.display === "none") return;

  if (e.key === "ArrowDown") {
    currentFocus++;
  } else if (e.key === "ArrowUp") {
    currentFocus--;
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (currentFocus > -1 && selectableItems[currentFocus]) {
      selectableItems[currentFocus].click();
    }
    return;
  } else return;

  selectableItems.forEach(i => i.classList.remove("active"));
  if (currentFocus >= selectableItems.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = selectableItems.length - 1;
  selectableItems[currentFocus].classList.add("active");
});

// ======================================================
// CALENDAR + POPUP + DATABASE
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = './api';

  const calendarGrid = document.getElementById('calendarGrid');
  const currentMonthYear = document.getElementById('currentMonthYear');
  const prevMonth = document.getElementById('prevMonth');
  const nextMonth = document.getElementById('nextMonth');

  const jadwalInputPopup = document.getElementById('jadwalInputPopup');
  const kirimBtn = document.getElementById('kirimJadwal');
  const batalBtn = document.getElementById('batalJadwal');

  let currentDate = new Date();
  let activeDay = null;
  let activeDateISO = null;

  // ---------------- API JSON HELPER ----------------
  async function apiJSON(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { throw new Error(text); }
  }

  // ---------------- CUSTOM DROPDOWN ----------------
  function createDropdown(inputId, menuId, apiUrl, fields) {
    const input = document.getElementById(inputId);
    const menu = document.getElementById(menuId);
    let cache = [];
    let idx = -1;

    function getVal(o) {
      if (typeof o === "string") return o;
      for (let f of fields) if (o[f]) return o[f];
      return Object.values(o)[0];
    }

    function render(list) {
      menu.innerHTML = list.map((v, i) =>
        `<div class="dd-item" data-i="${i}">${v}</div>`
      ).join("");
      menu.style.display = list.length ? "block" : "none";
      idx = -1;

      menu.querySelectorAll(".dd-item").forEach(el => {
        el.onclick = () => {
          input.value = el.textContent;
          menu.style.display = "none";
        };
      });
    }

    function filter() {
      const q = input.value.toLowerCase();
      render(cache.filter(x => x.toLowerCase().includes(q)).slice(0, 8));
    }

    async function load() {
      const data = await apiJSON(apiUrl);
      cache = (Array.isArray(data) ? data : []).map(getVal);
    }

    input.oninput = filter;
    input.onfocus = () => render(cache.slice(0, 8));

    input.onkeydown = (e) => {
      const items = menu.querySelectorAll(".dd-item");
      if (!items.length) return;

      if (e.key === "ArrowDown") idx = (idx + 1) % items.length;
      else if (e.key === "ArrowUp") idx = (idx - 1 + items.length) % items.length;
      else if (e.key === "Enter" && idx >= 0) items[idx].click();
      else return;

      items.forEach(i => i.classList.remove("active"));
      items[idx]?.classList.add("active");
      e.preventDefault();
    };

    document.addEventListener("click", e => {
      if (!e.target.closest(`#${inputId}`) && !e.target.closest(`#${menuId}`))
        menu.style.display = "none";
    });

    return { load, hide: () => menu.style.display = "none" };
  }

  const ddMatkul = createDropdown(
    "matkulInput", "matkulDropdown",
    `${API_BASE}/mata_kuliah_list.php`,
    ["matkul", "nama", "nama_matkul"]
  );

  const ddDosen = createDropdown(
    "dosenInput", "dosenDropdown",
    `${API_BASE}/dosen_list.php`,
    ["dosen", "nama", "nama_dosen"]
  );

  const ddRuangan = createDropdown(
    "ruanganInput", "ruanganDropdown",
    `${API_BASE}/ruangan_list.php`,
    ["ruangan", "nama", "nama_ruangan"]
  );

  // ---------------- RESET FORM ----------------
  function resetPopup() {
    ["matkulInput","dosenInput","ruanganInput",
     "jamMulaiInput","jamSelesaiInput",
     "manualTimeInput","catatanInput"]
      .forEach(id => document.getElementById(id).value = "");

    ddMatkul.hide(); ddDosen.hide(); ddRuangan.hide();
    if (activeDay) activeDay.classList.remove("active");
  }

  // ---------------- RENDER CALENDAR ----------------
  function renderCalendar(date) {
    calendarGrid.innerHTML = `
      <div class="day-name">SUN</div><div class="day-name">MON</div>
      <div class="day-name">TUE</div><div class="day-name">WED</div>
      <div class="day-name">THU</div><div class="day-name">FRI</div>
      <div class="day-name">SAT</div>`;

    const y = date.getFullYear();
    const m = date.getMonth();
    const first = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();

    currentMonthYear.textContent =
      date.toLocaleString('id-ID', { month: 'long' }) + " " + y;

    for (let i = 0; i < first; i++)
      calendarGrid.appendChild(document.createElement('div'));

    for (let d = 1; d <= total; d++) {
      const el = document.createElement('div');
      el.className = 'calendar-day';
      el.textContent = d;
      el.onclick = async () => {
        activeDateISO = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        activeDay?.classList.remove("active");
        el.classList.add("active");
        activeDay = el;

        await Promise.all([ddMatkul.load(), ddDosen.load(), ddRuangan.load()]);
        jadwalInputPopup.style.display = "flex";
      };
      calendarGrid.appendChild(el);
    }
  }

  // ---------------- SUBMIT ----------------
  kirimBtn.onclick = async () => {
    const payload = {
      tanggal: activeDateISO,
      matkul: matkulInput.value.trim(),
      dosen: dosenInput.value.trim() || "-",
      ruangan: ruanganInput.value.trim() || "-",
      jam_mulai: jamMulaiInput.value,
      jam_selesai: jamSelesaiInput.value || "-",
      catatan: catatanInput.value || "-"
    };

    if (!payload.tanggal || !payload.matkul || !payload.jam_mulai)
      return alert("Tanggal, Matkul, dan Jam Mulai wajib!");

    const res = await apiJSON(`${API_BASE}/jadwal_create.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.status === "success") {
      alert("Jadwal tersimpan!");
      location.reload();
    } else alert(res.message || "Gagal");
  };

  batalBtn.onclick = () => {
    jadwalInputPopup.style.display = "none";
    resetPopup();
  };

  window.onclick = e => {
    if (e.target === jadwalInputPopup) {
      jadwalInputPopup.style.display = "none";
      resetPopup();
    }
  };

  renderCalendar(currentDate);
  prevMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate); };
  nextMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate); };
});
