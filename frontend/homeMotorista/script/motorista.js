const parkingSearch = document.querySelector("#parking-search");
const parkingContent = document.querySelector("#parking-content");
const parkingSearchMessage = document.querySelector("#parking-search-message");
const floorSelect = document.querySelector("#floor-select");
const accessibilityToggle = document.querySelector("#accessibility-toggle");
const sectorButtons = document.querySelectorAll(".sector-button");
const parkingMap = document.querySelector(".parking-map");
const parkingSpots = Array.from(document.querySelectorAll(".parking-spot"));
const mapFeedback = document.querySelector("#map-feedback");
const selectionTitle = document.querySelector("#selection-title");
const selectionDescription = document.querySelector("#selection-description");
const continueButton = document.querySelector("#continue-button");
const availableCount = document.querySelector("#available-count");

let activeSector = "A";
let selectedSpot = null;

function clearSelection() {
  if (selectedSpot) {
    selectedSpot.classList.remove("is-selected");
    selectedSpot.setAttribute("aria-pressed", "false");
    selectedSpot = null;
  }

  selectionTitle.textContent = "Nenhuma vaga selecionada";
  selectionDescription.textContent =
    "Toque em uma vaga disponível no mapa para ver os detalhes.";
  continueButton.setAttribute("aria-disabled", "true");
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function updateParkingSearch() {
  const query = normalizeText(parkingSearch.value.trim());
  const parkingDetails = normalizeText(parkingContent.dataset.parkingSearch);
  const found = !query || parkingDetails.includes(query);

  parkingContent.hidden = !found;
  parkingSearchMessage.textContent = !query
    ? "Ex.: Estácio Natal ou Natal, RN"
    : found
      ? "Estacionamento Estácio Natal · Natal, RN"
      : "Nenhum estacionamento encontrado. Tente Estácio Natal ou Natal, RN.";
}

function updateSpots() {
  const accessibleOnly = accessibilityToggle.getAttribute("aria-pressed") === "true";
  let visibleAvailable = 0;
  let visibleSpots = 0;

  parkingSpots.forEach((spot) => {
    const number = spot.dataset.number;
    const spotCode = `${activeSector}-${number}`;
    const isAccessible = spot.dataset.accessible === "true";
    const isVisible = !accessibleOnly || isAccessible;

    spot.dataset.spot = spotCode;
    spot.querySelector("span:last-child").textContent = spotCode;
    spot.setAttribute(
      "aria-label",
      `Vaga ${spotCode}, ${spot.dataset.available === "true" ? "disponível" : "ocupada"}${
        isAccessible ? " e acessível" : ""
      }`,
    );
    spot.hidden = !isVisible;

    if (isVisible) {
      visibleSpots += 1;
      if (spot.dataset.available === "true") visibleAvailable += 1;
    }
  });

  availableCount.textContent = String(visibleAvailable);
  parkingMap.setAttribute(
    "aria-label",
    `Mapa de vagas do piso ${floorSelect.value}, setor ${activeSector}`,
  );

  if (visibleSpots === 0) {
    mapFeedback.textContent = "Nenhuma vaga disponível com estes filtros.";
  } else if (accessibleOnly) {
    mapFeedback.textContent = `${visibleAvailable} vaga(s) acessível(is) disponível(is) neste setor.`;
  } else {
    mapFeedback.textContent = "Selecione uma vaga disponível no mapa.";
  }
}

parkingSpots.forEach((spot) => {
  const number = spot.dataset.spot.split("-")[1];
  spot.dataset.number = number;
  spot.setAttribute("aria-pressed", "false");

  spot.addEventListener("click", () => {
    if (spot.disabled || spot.hidden) return;

    if (selectedSpot) {
      selectedSpot.classList.remove("is-selected");
      selectedSpot.setAttribute("aria-pressed", "false");
    }

    selectedSpot = spot;
    selectedSpot.classList.add("is-selected");
    selectedSpot.setAttribute("aria-pressed", "true");

    const spotCode = `${activeSector}-${number}`;
    selectionTitle.textContent = `Vaga ${spotCode}`;
    selectionDescription.textContent = `${
      spot.dataset.accessible === "true" ? "Vaga acessível" : "Vaga padrão"
    } · Piso ${floorSelect.value} · Setor ${activeSector}`;
    continueButton.setAttribute("aria-disabled", "false");
    mapFeedback.textContent = `${spotCode} selecionada. Entre para continuar.`;
  });
});

sectorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeSector = button.dataset.sector;
    sectorButtons.forEach((sectorButton) => {
      const isActive = sectorButton === button;
      sectorButton.classList.toggle("is-active", isActive);
      sectorButton.setAttribute("aria-pressed", String(isActive));
    });
    clearSelection();
    updateSpots();
  });
});

parkingSearch.addEventListener("input", () => {
  clearSelection();
  updateParkingSearch();
});

floorSelect.addEventListener("change", () => {
  clearSelection();
  updateSpots();
});

accessibilityToggle.addEventListener("click", () => {
  const isPressed = accessibilityToggle.getAttribute("aria-pressed") === "true";
  accessibilityToggle.setAttribute("aria-pressed", String(!isPressed));
  clearSelection();
  updateSpots();
});

continueButton.addEventListener("click", (event) => {
  if (continueButton.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    mapFeedback.textContent = "Selecione uma vaga disponível antes de continuar.";
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    parkingSearch.focus();
  }
});

updateParkingSearch();
updateSpots();
