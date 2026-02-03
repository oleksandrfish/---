const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");
const splash = document.getElementById("splash");
const enterApp = document.getElementById("enterApp");
const toast = document.getElementById("toast");

const lock = document.getElementById("lock");
const lockTitle = document.getElementById("lockTitle");
const lockSub = document.getElementById("lockSub");
const lockNote = document.getElementById("lockNote");
const pinDots = document.getElementById("pinDots");
const pinGrid = document.getElementById("pinGrid");
const faceIdBtn = document.getElementById("faceIdBtn");

const docModal = document.getElementById("docModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalSub = document.getElementById("modalSub");
const modalNumber = document.getElementById("modalNumber");
const modalIssued = document.getElementById("modalIssued");
const modalExpires = document.getElementById("modalExpires");
const modalStatus = document.getElementById("modalStatus");
const modalCard = docModal ? docModal.querySelector(".modal-card") : null;

const docsSheet = document.getElementById("docsSheet");
const editSheet = document.getElementById("editSheet");
const shareSheet = document.getElementById("shareSheet");
const notifySheet = document.getElementById("notifySheet");
const dataSheet = document.getElementById("dataSheet");

const docCards = document.getElementById("docCards");
const docList = document.getElementById("docList");
const docCardTemplate = document.getElementById("docCardTemplate");
const docSheetTemplate = document.getElementById("docSheetTemplate");

const editForm = document.getElementById("editForm");
const editTitle = document.getElementById("editTitle");

const dataTextarea = document.getElementById("dataTextarea");
const dataTitle = document.getElementById("dataTitle");

const serviceSearch = document.getElementById("serviceSearch");
const serviceCards = document.querySelectorAll(".service-card");
const chips = document.querySelectorAll(".chip");

const qrCanvas = document.getElementById("qrCanvas");
const qrCaption = document.getElementById("qrCaption");

const STORAGE_KEY = "civicnest_docs";
const PIN_KEY = "civicnest_pin";
const UNLOCK_KEY = "civicnest_unlocked";

let pinValue = "";
let pinMode = "unlock";
let docs = [];
let currentDocId = null;

const defaultDocs = [
  {
    id: "doc-1",
    title: "ID картка",
    sub: "Громадянство України",
    number: "№ 0042 881199",
    issued: "12.04.2021",
    expires: "12.04.2031",
    status: "Дійсний",
    accent: "ocean"
  },
  {
    id: "doc-2",
    title: "Водійське",
    sub: "Категорії B, C",
    number: "№ 74 202 661",
    issued: "03.08.2019",
    expires: "03.08.2029",
    status: "Дійсний",
    accent: "mint"
  },
  {
    id: "doc-3",
    title: "Студентський",
    sub: "КНУ ім. Т. Шевченка",
    number: "№ ST 218 039",
    issued: "01.09.2023",
    expires: "30.06.2027",
    status: "Активний",
    accent: "amber"
  }
];

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-show");
  setTimeout(() => toast.classList.remove("is-show"), 1600);
}

function saveDocs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

function loadDocs() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    docs = [...defaultDocs];
    saveDocs();
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    docs = Array.isArray(parsed) ? parsed : [...defaultDocs];
  } catch {
    docs = [...defaultDocs];
  }
}

function renderDocs() {
  if (!docCards || !docList) return;
  docCards.innerHTML = "";
  docList.innerHTML = "";

  docs.forEach((doc) => {
    const card = docCardTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.docId = doc.id;
    const accent = card.querySelector(".doc-accent");
    if (accent) accent.className = `doc-accent ${doc.accent}`;
    card.querySelector(".pill").textContent = doc.status;
    card.querySelector(".pill").className = `pill ${doc.accent}`;
    card.querySelector(".doc-type").textContent = doc.title;
    card.querySelector(".doc-sub").textContent = doc.sub;
    card.querySelector(".doc-number").textContent = doc.number;
    card.querySelector(".doc-meta").textContent = `Діє до ${doc.expires}`;
    card.addEventListener("click", () => openDocModal(doc.id));
    docCards.appendChild(card);

    const item = docSheetTemplate.content.firstElementChild.cloneNode(true);
    item.dataset.docId = doc.id;
    item.querySelector(".sheet-item-title").textContent = doc.title;
    item.querySelector(".sheet-item-sub").textContent = doc.sub;
    const pill = item.querySelector(".pill");
    pill.textContent = doc.status;
    pill.className = `pill ${doc.accent}`;
    item.addEventListener("click", () => {
      closeSheet(docsSheet);
      openDocModal(doc.id);
    });
    docList.appendChild(item);
  });
}

function getDocById(docId) {
  return docs.find((doc) => doc.id === docId);
}

function openDocModal(docId) {
  if (!docModal) return;
  const doc = getDocById(docId);
  if (!doc) return;
  currentDocId = docId;
  modalTitle.textContent = doc.title;
  modalSub.textContent = doc.sub;
  modalNumber.textContent = doc.number;
  modalIssued.textContent = doc.issued;
  modalExpires.textContent = doc.expires;
  modalStatus.textContent = doc.status;
  if (modalCard) modalCard.setAttribute("data-accent", doc.accent);
  docModal.classList.add("is-open");
  docModal.setAttribute("aria-hidden", "false");
}

function closeDocModal() {
  if (!docModal) return;
  docModal.classList.remove("is-open");
  docModal.setAttribute("aria-hidden", "true");
}

function openSheet(sheet) {
  if (!sheet) return;
  sheet.classList.add("is-open");
  sheet.setAttribute("aria-hidden", "false");
}

function closeSheet(sheet) {
  if (!sheet) return;
  sheet.classList.remove("is-open");
  sheet.setAttribute("aria-hidden", "true");
}

function openEditSheet(docId) {
  if (!editSheet || !editForm) return;
  const doc = docId ? getDocById(docId) : null;
  editForm.dataset.docId = docId || "";
  editTitle.textContent = doc ? doc.title : "Новий документ";
  editForm.title.value = doc ? doc.title : "";
  editForm.sub.value = doc ? doc.sub : "";
  editForm.number.value = doc ? doc.number : "";
  editForm.issued.value = doc ? doc.issued : "";
  editForm.expires.value = doc ? doc.expires : "";
  editForm.status.value = doc ? doc.status : "";
  editForm.accent.value = doc ? doc.accent : "ocean";
  openSheet(editSheet);
}

function deleteDoc(docId) {
  docs = docs.filter((doc) => doc.id !== docId);
  saveDocs();
  renderDocs();
}

function updatePinDots() {
  if (!pinDots) return;
  const dots = pinDots.querySelectorAll("span");
  dots.forEach((dot, index) => {
    dot.classList.toggle("is-filled", index < pinValue.length);
  });
}

function unlockApp() {
  if (!lock) return;
  lock.classList.add("is-hidden");
  setTimeout(() => lock.remove(), 300);
  localStorage.setItem(UNLOCK_KEY, "1");
}

function handlePinInput(value) {
  if (value === "reset") {
    pinValue = "";
    updatePinDots();
    return;
  }
  if (value === "back") {
    pinValue = pinValue.slice(0, -1);
    updatePinDots();
    return;
  }
  if (pinValue.length >= 4) return;
  pinValue += value;
  updatePinDots();
  if (pinValue.length !== 4) return;
  const savedPin = localStorage.getItem(PIN_KEY);

  if (pinMode === "set") {
    localStorage.setItem(PIN_KEY, pinValue);
    showToast("PIN встановлено");
    pinValue = "";
    updatePinDots();
    unlockApp();
    return;
  }

  if (pinValue === savedPin) {
    showToast("Доступ дозволено");
    unlockApp();
  } else {
    showToast("Невірний PIN");
  }
  pinValue = "";
  updatePinDots();
}

function ensurePinMode() {
  const savedPin = localStorage.getItem(PIN_KEY);
  if (!savedPin) {
    pinMode = "set";
    lockTitle.textContent = "Створи PIN";
    lockSub.textContent = "Задай 4 цифри для входу";
    lockNote.textContent = "Потім можна змінити у профілі";
    return;
  }
  pinMode = "unlock";
  lockTitle.textContent = "Доступ";
  lockSub.textContent = "Введіть PIN або використайте Face ID";
  lockNote.textContent = "Демо PIN: 1234";
}

function activateTab(target) {
  tabs.forEach((t) => {
    t.classList.toggle("is-active", t.dataset.target === target);
    t.setAttribute("aria-selected", t.dataset.target === target ? "true" : "false");
  });

  views.forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === target);
  });

  if (target === "qr") {
    renderQrForCurrentDoc();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQrForCurrentDoc() {
  if (!qrCanvas || !window.qrcodegen) return;
  if (!currentDocId && docs.length > 0) {
    currentDocId = docs[0].id;
  }
  const doc = getDocById(currentDocId);
  if (!doc) return;
  const payload = JSON.stringify({
    title: doc.title,
    number: doc.number,
    status: doc.status,
    issued: doc.issued,
    expires: doc.expires,
    ts: new Date().toISOString()
  });
  const qr = qrcodegen.QrCode.encodeText(payload, qrcodegen.QrCode.Ecc.M);
  drawQrToCanvas(qr, qrCanvas, 4);
  if (qrCaption) {
    qrCaption.textContent = `${doc.title} • оновлено ${new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}`;
  }
}

function drawQrToCanvas(qr, canvas, scale) {
  const size = qr.size;
  const border = 2;
  const canvasSize = (size + border * 2) * scale;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "#10141d";
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (qr.getModule(x, y)) {
        const rx = (x + border) * scale;
        const ry = (y + border) * scale;
        ctx.fillRect(rx, ry, scale, scale);
      }
    }
  }
}

function openDataSheet(mode) {
  if (!dataSheet || !dataTextarea || !dataTitle) return;
  if (mode === "export") {
    dataTitle.textContent = "Експорт JSON";
    dataTextarea.value = JSON.stringify(docs, null, 2);
  } else {
    dataTitle.textContent = "Імпорт JSON";
    dataTextarea.value = "";
  }
  openSheet(dataSheet);
}

function applyImportedData() {
  const raw = dataTextarea.value.trim();
  if (!raw) {
    showToast("Встав JSON");
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid");
    docs = parsed;
    saveDocs();
    renderDocs();
    closeSheet(dataSheet);
    showToast("Дані оновлено");
  } catch {
    showToast("Некоректний JSON");
  }
}

function setupEvents() {
  if (pinGrid) {
    pinGrid.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || !button.dataset.pin) return;
      handlePinInput(button.dataset.pin);
    });
  }

  if (faceIdBtn) {
    faceIdBtn.addEventListener("click", () => {
      showToast("Face ID успішний");
      unlockApp();
    });
  }

  if (enterApp && splash) {
    enterApp.addEventListener("click", () => {
      splash.classList.add("is-hidden");
      setTimeout(() => splash.remove(), 380);
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", closeDocModal);
  }

  if (docModal) {
    docModal.addEventListener("click", (event) => {
      if (event.target === docModal) closeDocModal();
    });
  }

  const actionButtons = document.querySelectorAll("[data-action]");
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action === "qr") activateTab("qr");
      if (action === "share") openSheet(shareSheet);
      if (action === "refresh") showToast("Дані оновлено");
      if (action === "all-docs") openSheet(docsSheet);
      if (action === "notifications") openSheet(notifySheet);
      if (action === "share-copy") showToast("Посилання скопійовано");
      if (action === "share-qr") {
        closeSheet(shareSheet);
        activateTab("qr");
      }
      if (action === "share-email") showToast("Відкрито пошту");
      if (action === "share-audio") showToast("Виклик створено");
      if (action === "modal-qr") {
        closeDocModal();
        activateTab("qr");
      }
      if (action === "modal-edit") {
        closeDocModal();
        openEditSheet(currentDocId);
      }
      if (action === "add-doc") {
        openEditSheet(null);
      }
      if (action === "edit-docs") {
        openSheet(docsSheet);
      }
      if (action === "export-data") {
        openDataSheet("export");
      }
      if (action === "import-data") {
        openDataSheet("import");
      }
      if (action === "copy-data") {
        dataTextarea.select();
        document.execCommand("copy");
        showToast("Скопійовано");
      }
      if (action === "apply-data") {
        applyImportedData();
      }
      if (action === "reset-pin") {
        localStorage.removeItem(PIN_KEY);
        localStorage.removeItem(UNLOCK_KEY);
        showToast("PIN скинуто");
        location.reload();
      }
      if (action === "delete-doc") {
        const docId = editForm.dataset.docId;
        if (docId) {
          deleteDoc(docId);
          closeSheet(editSheet);
          showToast("Документ видалено");
        }
      }
      if (action === "refresh-qr") {
        renderQrForCurrentDoc();
      }
    });
  });

  const closeButtons = document.querySelectorAll("[data-close]");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeSheet(btn.closest(".sheet"));
    });
  });

  [docsSheet, shareSheet, notifySheet, editSheet, dataSheet].forEach((sheet) => {
    if (!sheet) return;
    sheet.addEventListener("click", (event) => {
      if (event.target === sheet) closeSheet(sheet);
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.target);
    });
  });

  if (editForm) {
    editForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(editForm);
      const data = Object.fromEntries(formData.entries());
      const docId = editForm.dataset.docId;
      if (docId) {
        const doc = getDocById(docId);
        if (!doc) return;
        doc.title = data.title;
        doc.sub = data.sub;
        doc.number = data.number;
        doc.issued = data.issued;
        doc.expires = data.expires;
        doc.status = data.status;
        doc.accent = data.accent;
      } else {
        docs.unshift({
          id: `doc-${Date.now()}`,
          title: data.title,
          sub: data.sub,
          number: data.number,
          issued: data.issued,
          expires: data.expires,
          status: data.status,
          accent: data.accent
        });
      }
      saveDocs();
      renderDocs();
      closeSheet(editSheet);
      showToast("Зміни збережено");
    });
  }

  let activeFilter = "all";
  function applyServiceFilter() {
    const query = serviceSearch ? serviceSearch.value.trim().toLowerCase() : "";
    serviceCards.forEach((card) => {
      const text = (
        card.querySelector(".service-title").textContent + " " +
        card.querySelector(".service-sub").textContent
      ).toLowerCase();
      const matchesText = text.includes(query);
      const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
      card.style.display = matchesText && matchesFilter ? "" : "none";
    });
  }

  if (serviceSearch) {
    serviceSearch.addEventListener("input", applyServiceFilter);
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.toggle("is-active", c === chip);
        c.setAttribute("aria-selected", c === chip ? "true" : "false");
      });
      activeFilter = chip.dataset.filter || "all";
      applyServiceFilter();
    });
  });
}

function init() {
  loadDocs();
  renderDocs();
  ensurePinMode();
  setupEvents();
  if (lock && localStorage.getItem(UNLOCK_KEY) === "1") {
    lock.remove();
  }
}

init();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}
