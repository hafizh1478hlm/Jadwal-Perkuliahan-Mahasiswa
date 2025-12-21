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
