export function mountStructurePage(root) {
  function requireElement(root, selector) {
    const element = root.querySelector(selector);
    if (!element) {
      throw new Error(
        `Elemento obrigatório não encontrado na página de estrutura: ${selector}`,
      );
    }
    return element;
  }

  const elements = {
    structureContent: requireElement(root, "[data-structure-content]"),
    structureForm: requireElement(root, "#structure-form"),
    structureName: requireElement(root, "#structure-name"),
    structureAddress: requireElement(root, "#structure-address"),
    floorCount: requireElement(root, "#floor-count"),
    floorTabs: requireElement(root, "#floor-tabs"),
    floorName: requireElement(root, "#floor-name"),
    sectorId: requireElement(root, "#sector-id"),
    sectorSpotCount: requireElement(root, "#sector-spot-count"),
    addSectorButton: requireElement(root, "#add-sector-button"),
    sectorsList: requireElement(root, "#sectors-list"),
    floorCounter: requireElement(root, "#floor-counter"),
    cancelStructureButton: requireElement(root, "#cancel-structure"),
    savedState: requireElement(root, "#saved-state"),
    savedStateLabel: requireElement(root, "#saved-state-label"),
    structureMessage: requireElement(root, "#structure-message"),
    mapEmpty: requireElement(root, "#map-empty"),
    toggleMapButton: requireElement(root, "#toggle-map-button"),
    mapView: requireElement(root, "#parking-map-view"),
    mapFloorSelect: requireElement(root, "#map-floor-select"),
    mapSectorTabs: requireElement(root, "#map-sector-tabs"),
    mapFloorCaption: requireElement(root, "#map-floor-caption"),
    mapSectorCaption: requireElement(root, "#map-sector-caption"),
    mapSpotTotal: requireElement(root, "#map-spot-total"),
    parkingSpotsGrid: requireElement(root, "#parking-spots-grid"),
  };

  const STRUCTURE_STORAGE_KEY = "estacioNatal.admin.structure.v1";
  const MAX_FLOORS = 20;
  const MAX_SPOTS_PER_SECTOR = 999;

  function createFloor(index) {
    return {
      id: `floor-${index + 1}`,
      name: `Piso ${index + 1}`,
      sectors: [],
    };
  }

  function createEmptyStructure(floorCount = 1) {
    return {
      name: "",
      address: "",
      floors: Array.from({ length: floorCount }, (_, index) =>
        createFloor(index),
      ),
    };
  }

  let draftStructure = createEmptyStructure();
  let savedStructure = null;
  let activeFloorIndex = 0;
  let activeMapFloorIndex = 0;
  let activeMapSectorId = "";
  let mapIsOpen = false;

  function cloneStructure(structure) {
    return JSON.parse(JSON.stringify(structure));
  }

  function isValidStructure(value) {
    return (
      value &&
      typeof value.name === "string" &&
      typeof value.address === "string" &&
      value.name.trim().length > 0 &&
      value.address.trim().length > 0 &&
      Array.isArray(value.floors) &&
      value.floors.length > 0 &&
      value.floors.length <= MAX_FLOORS &&
      value.floors.every(
        (floor) =>
          floor &&
          typeof floor.name === "string" &&
          floor.name.trim().length > 0 &&
          Array.isArray(floor.sectors) &&
          floor.sectors.every(
            (sector) =>
              sector &&
              typeof sector.id === "string" &&
              Number.isInteger(sector.spotCount) &&
              sector.spotCount > 0 &&
              sector.spotCount <= MAX_SPOTS_PER_SECTOR,
          ),
      )
    );
  }

  function showStructureMessage(message, state = "error") {
    elements.structureMessage.textContent = message;
    elements.structureMessage.dataset.state = state;
    elements.structureMessage.hidden = false;
  }

  function clearStructureMessage() {
    elements.structureMessage.textContent = "";
    elements.structureMessage.hidden = true;
    delete elements.structureMessage.dataset.state;
  }

  function loadSavedStructure() {
    try {
      const storedStructure = window.localStorage.getItem(STRUCTURE_STORAGE_KEY);

      if (!storedStructure) {
        return null;
      }

      const parsedStructure = JSON.parse(storedStructure);

      if (!isValidStructure(parsedStructure)) {
        throw new Error("Os dados salvos da estrutura estão em formato inválido.");
      }

      return parsedStructure;
    } catch (error) {
      showStructureMessage(
        `Não foi possível carregar a estrutura salva: ${error.message}`,
      );
      return null;
    }
  }

  function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  }

  function getActiveFloor() {
    return draftStructure.floors[activeFloorIndex];
  }

  function renderFloorTabs() {
    elements.floorTabs.replaceChildren();

    draftStructure.floors.forEach((floor, index) => {
      const button = document.createElement("button");
      button.className = "floor-tab";
      button.type = "button";
      button.dataset.floorIndex = String(index);
      button.setAttribute("aria-pressed", String(index === activeFloorIndex));

      button.append(
        createTextElement(
          "span",
          "floor-tab-number",
          String(index + 1).padStart(2, "0"),
        ),
        createTextElement("span", "floor-tab-name", floor.name || `Piso ${index + 1}`),
        createTextElement(
          "span",
          "floor-tab-count",
          String(floor.sectors.length),
        ),
      );

      elements.floorTabs.append(button);
    });

    const floorCount = draftStructure.floors.length;
    elements.floorCounter.textContent = `${floorCount} ${
      floorCount === 1 ? "piso" : "pisos"
    }`;
  }

  function createSectorCard(sector, sectorIndex) {
    const card = document.createElement("article");
    card.className = "sector-card";

    const content = document.createElement("div");
    content.className = "sector-card-content";

    const title = document.createElement("div");
    title.className = "sector-card-title";
    title.append(
      createTextElement("strong", "", `Setor ${sector.id}`),
      createTextElement(
        "span",
        "",
        `${sector.spotCount} ${sector.spotCount === 1 ? "vaga" : "vagas"}`,
      ),
    );

    content.append(title);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-sector-button";
    removeButton.type = "button";
    removeButton.dataset.removeSector = String(sectorIndex);
    removeButton.setAttribute("aria-label", `Remover setor ${sector.id}`);
    removeButton.textContent = "×";

    card.append(content, removeButton);
    return card;
  }

  function renderSectors() {
    const floor = getActiveFloor();
    elements.sectorsList.replaceChildren();

    if (floor.sectors.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-sectors";
      const icon = createTextElement("span", "empty-sectors-icon", "+");
      icon.setAttribute("aria-hidden", "true");
      const copy = document.createElement("span");
      copy.append(
        createTextElement("strong", "", "Nenhum setor neste piso"),
        createTextElement(
          "small",
          "",
          "Adicione o primeiro setor para começar a distribuir as vagas.",
        ),
      );
      emptyState.append(icon, copy);
      elements.sectorsList.append(emptyState);
      return;
    }

    floor.sectors.forEach((sector, index) => {
      elements.sectorsList.append(createSectorCard(sector, index));
    });
  }

  function renderStructureEditor() {
    elements.structureName.value = draftStructure.name;
    elements.structureAddress.value = draftStructure.address;
    elements.floorCount.value = String(draftStructure.floors.length);
    elements.floorName.value = getActiveFloor().name;
    renderFloorTabs();
    renderSectors();
    updateSavedState();
  }

  function updateSavedState() {
    const isSaved =
      savedStructure !== null &&
      JSON.stringify(draftStructure) === JSON.stringify(savedStructure);

    elements.savedState.dataset.state = isSaved ? "saved" : "draft";
    elements.savedStateLabel.textContent = isSaved
      ? "Salvo neste navegador"
      : "Alterações não salvas";
  }

  function markStructureAsChanged() {
    updateSavedState();
    clearStructureMessage();
  }

  function renderMapFloorOptions() {
    elements.mapFloorSelect.replaceChildren();

    savedStructure.floors.forEach((floor, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = floor.name || `Piso ${index + 1}`;
      elements.mapFloorSelect.append(option);
    });

    activeMapFloorIndex = Math.min(
      activeMapFloorIndex,
      savedStructure.floors.length - 1,
    );
    elements.mapFloorSelect.value = String(activeMapFloorIndex);
  }

  function renderMapSectorTabs() {
    const floor = savedStructure.floors[activeMapFloorIndex];
    elements.mapSectorTabs.replaceChildren();

    if (floor.sectors.length === 0) {
      activeMapSectorId = "";
      return;
    }

    if (!floor.sectors.some((sector) => sector.id === activeMapSectorId)) {
      activeMapSectorId = floor.sectors[0].id;
    }

    floor.sectors.forEach((sector) => {
      const button = document.createElement("button");
      button.className = "map-sector-button";
      button.type = "button";
      button.dataset.mapSector = sector.id;
      button.setAttribute("aria-pressed", String(sector.id === activeMapSectorId));
      button.textContent = sector.id;
      elements.mapSectorTabs.append(button);
    });
  }

  function renderMapSpots() {
    const floor = savedStructure.floors[activeMapFloorIndex];
    const sector = floor.sectors.find((item) => item.id === activeMapSectorId);
    elements.parkingSpotsGrid.replaceChildren();
    elements.mapFloorCaption.textContent = floor.name || `Piso ${activeMapFloorIndex + 1}`;

    if (!sector) {
      elements.mapSectorCaption.textContent = "Nenhum setor cadastrado";
      elements.mapSpotTotal.textContent = "Adicione setores para visualizar as vagas";
      elements.parkingSpotsGrid.setAttribute("aria-label", "Nenhuma vaga cadastrada");
      return;
    }

    elements.mapSectorCaption.textContent = `Setor ${sector.id}`;
    elements.mapSpotTotal.textContent = `${sector.spotCount} ${
      sector.spotCount === 1 ? "vaga cadastrada" : "vagas cadastradas"
    }`;
    elements.parkingSpotsGrid.setAttribute(
      "aria-label",
      `${sector.spotCount} vagas do setor ${sector.id}`,
    );

    for (let index = 1; index <= sector.spotCount; index += 1) {
      const spotCode = `${sector.id}${String(index).padStart(2, "0")}`;
      const spot = document.createElement("div");
      spot.className = "map-spot";
      spot.setAttribute("aria-label", `Vaga ${spotCode}`);

      const car = document.createElement("span");
      car.className = "map-spot-car";
      car.setAttribute("aria-hidden", "true");
      spot.append(car, createTextElement("span", "", spotCode));
      elements.parkingSpotsGrid.append(spot);
    }
  }

  function renderSavedMap() {
    if (!savedStructure) {
      elements.toggleMapButton.hidden = true;
      elements.mapView.hidden = true;
      elements.mapEmpty.hidden = false;
      return;
    }

    elements.toggleMapButton.hidden = false;
    elements.mapEmpty.hidden = true;
    elements.mapView.hidden = !mapIsOpen;
    elements.toggleMapButton.querySelector("span").textContent = mapIsOpen
      ? "Ocultar mapa"
      : "Exibir mapa de vagas";

    if (mapIsOpen) {
      renderMapFloorOptions();
      renderMapSectorTabs();
      renderMapSpots();
    }
  }

  function setActiveFloor(index) {
    if (!Number.isInteger(index) || !draftStructure.floors[index]) {
      return;
    }

    activeFloorIndex = index;
    elements.floorName.value = getActiveFloor().name;
    renderFloorTabs();
    renderSectors();
    clearStructureMessage();
  }

  function resizeDraftFloors() {
    const nextCount = Number(elements.floorCount.value);
    const previousCount = draftStructure.floors.length;

    if (
      !Number.isInteger(nextCount) ||
      nextCount < 1 ||
      nextCount > MAX_FLOORS
    ) {
      showStructureMessage(`Informe uma quantidade entre 1 e ${MAX_FLOORS} pisos.`);
      elements.floorCount.value = String(previousCount);
      return;
    }

    if (nextCount < previousCount) {
      const removedFloors = draftStructure.floors.slice(nextCount);
      const hasConfiguration = removedFloors.some(
        (floor) => floor.sectors.length > 0,
      );

      if (
        hasConfiguration &&
        !window.confirm(
          "Os pisos removidos e seus setores serão excluídos da edição atual. Deseja continuar?",
        )
      ) {
        elements.floorCount.value = String(previousCount);
        return;
      }
    }

    while (draftStructure.floors.length < nextCount) {
      draftStructure.floors.push(createFloor(draftStructure.floors.length));
    }

    draftStructure.floors.length = nextCount;
    activeFloorIndex = Math.min(activeFloorIndex, nextCount - 1);
    renderStructureEditor();
    markStructureAsChanged();
  }

  function addSector() {
    const floor = getActiveFloor();
    const sectorId = elements.sectorId.value.trim().toUpperCase();
    const spotCount = Number(elements.sectorSpotCount.value);

    elements.sectorId.setCustomValidity("");
    elements.sectorSpotCount.setCustomValidity("");

    if (!/^[A-Z0-9]{1,6}$/.test(sectorId)) {
      elements.sectorId.setCustomValidity(
        "Use de 1 a 6 letras ou números, sem espaços.",
      );
      elements.sectorId.reportValidity();
      return;
    }

    if (
      !Number.isInteger(spotCount) ||
      spotCount < 1 ||
      spotCount > MAX_SPOTS_PER_SECTOR
    ) {
      elements.sectorSpotCount.setCustomValidity(
        `Informe uma quantidade entre 1 e ${MAX_SPOTS_PER_SECTOR} vagas.`,
      );
      elements.sectorSpotCount.reportValidity();
      return;
    }

    if (floor.sectors.some((sector) => sector.id === sectorId)) {
      elements.sectorId.setCustomValidity(
        "Este identificador já está cadastrado neste piso.",
      );
      elements.sectorId.reportValidity();
      return;
    }

    floor.sectors.push({ id: sectorId, spotCount });
    elements.sectorId.value = "";
    elements.sectorSpotCount.value = "12";
    renderFloorTabs();
    renderSectors();
    markStructureAsChanged();
  }

  function saveStructure(event) {
    event.preventDefault();

    elements.structureName.value = elements.structureName.value.trim();
    elements.structureAddress.value = elements.structureAddress.value.trim();
    elements.floorName.value = elements.floorName.value.trim();

    if (!elements.structureForm.reportValidity()) {
      return;
    }

    const unnamedFloorIndex = draftStructure.floors.findIndex(
      (floor) => !floor.name.trim(),
    );
    if (unnamedFloorIndex !== -1) {
      setActiveFloor(unnamedFloorIndex);
      elements.floorName.setCustomValidity("Informe um nome para este piso.");
      elements.floorName.reportValidity();
      return;
    }

    elements.floorName.setCustomValidity("");
    draftStructure.name = elements.structureName.value;
    draftStructure.address = elements.structureAddress.value;
    getActiveFloor().name = elements.floorName.value;

    try {
      window.localStorage.setItem(
        STRUCTURE_STORAGE_KEY,
        JSON.stringify(draftStructure),
      );
      savedStructure = cloneStructure(draftStructure);
      mapIsOpen = false;
      renderStructureEditor();
      renderSavedMap();
      showStructureMessage("Estrutura salva neste navegador.", "success");
    } catch (error) {
      showStructureMessage(
        `Não foi possível salvar a estrutura neste navegador: ${error.message}`,
      );
    }
  }

  function cancelStructureChanges() {
    if (savedStructure) {
      draftStructure = cloneStructure(savedStructure);
    } else {
      draftStructure = createEmptyStructure();
    }

    activeFloorIndex = 0;
    mapIsOpen = false;
    renderStructureEditor();
    renderSavedMap();
    showStructureMessage(
      savedStructure
        ? "Edição cancelada. Os dados salvos foram restaurados."
        : "Edição cancelada. O formulário foi limpo.",
      "info",
    );
  }

  function initializeStructureEditor() {
    savedStructure = loadSavedStructure();

    if (savedStructure) {
      draftStructure = cloneStructure(savedStructure);
    }

    renderStructureEditor();
    renderSavedMap();
  }

  function handleStructureClick(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const floorButton = event.target.closest("[data-floor-index]");
    if (floorButton && elements.floorTabs.contains(floorButton)) {
      setActiveFloor(Number(floorButton.dataset.floorIndex));
      return;
    }

    const removeButton = event.target.closest("[data-remove-sector]");
    if (removeButton && elements.sectorsList.contains(removeButton)) {
      const sectorIndex = Number(removeButton.dataset.removeSector);
      const [removedSector] = getActiveFloor().sectors.splice(sectorIndex, 1);
      renderFloorTabs();
      renderSectors();
      markStructureAsChanged();
      showStructureMessage(`Setor ${removedSector.id} removido da edição.`, "info");
      return;
    }

    const mapSectorButton = event.target.closest("[data-map-sector]");
    if (mapSectorButton && elements.mapSectorTabs.contains(mapSectorButton)) {
      activeMapSectorId = mapSectorButton.dataset.mapSector;
      renderMapSectorTabs();
      renderMapSpots();
    }
  }

  elements.floorCount.addEventListener("change", resizeDraftFloors);
  elements.floorName.addEventListener("input", () => {
    elements.floorName.setCustomValidity("");
    const floor = getActiveFloor();
    floor.name = elements.floorName.value;
    const tabName = elements.floorTabs.querySelector(
      `[data-floor-index="${activeFloorIndex}"] .floor-tab-name`,
    );
    if (tabName) {
      tabName.textContent = floor.name || `Piso ${activeFloorIndex + 1}`;
    }
    if (
      savedStructure &&
      savedStructure.floors[activeFloorIndex] &&
      elements.mapFloorSelect.options[activeFloorIndex]
    ) {
      elements.mapFloorSelect.options[activeFloorIndex].textContent =
        floor.name || `Piso ${activeFloorIndex + 1}`;
    }
    markStructureAsChanged();
  });
  elements.structureName.addEventListener("input", () => {
    draftStructure.name = elements.structureName.value;
    markStructureAsChanged();
  });
  elements.structureAddress.addEventListener("input", () => {
    draftStructure.address = elements.structureAddress.value;
    markStructureAsChanged();
  });
  elements.addSectorButton.addEventListener("click", addSector);
  elements.structureForm.addEventListener("submit", saveStructure);
  elements.cancelStructureButton.addEventListener("click", cancelStructureChanges);
  elements.structureContent.addEventListener("click", handleStructureClick);
  elements.mapFloorSelect.addEventListener("change", () => {
    activeMapFloorIndex = Number(elements.mapFloorSelect.value);
    activeMapSectorId = "";
    renderMapSectorTabs();
    renderMapSpots();
  });
  elements.toggleMapButton.addEventListener("click", () => {
    mapIsOpen = !mapIsOpen;
    renderSavedMap();
  });
    initializeStructureEditor();
}
