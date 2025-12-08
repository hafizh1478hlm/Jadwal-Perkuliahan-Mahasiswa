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

  // debounce sederhana (bisa di-improve)
  clearTimeout(window._searchTimer);
  window._searchTimer = setTimeout(async () => {
    try {
      const res = await fetch("search.php?keyword=" + encodeURIComponent(keyword));
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();

      suggestions.innerHTML = "";
      if (!data.length) {
        suggestions.style.display = "none";
        return;
      }

      data.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${item.nama_matkul} — ${item.nama_dosen}`;
        li.dataset.id = item.id;
        li.addEventListener("click", () => {
          // contoh: buka halaman detail jadwal atau jadwal utama dengan id
          window.location.href = "jadwalutama.php?id=" + item.id;
        });
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
    } else {
      // jika tekan enter tanpa memilih suggestion, bisa redirect ke halaman hasil
      window.location.href = "jadwalutama.php?search=" + encodeURIComponent(searchInput.value.trim());
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
