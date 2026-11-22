// Prepara os controles locais da tela de configuração da estrutura.
function mountStructurePage(root) {
  // Localiza um elemento obrigatório ou informa claramente qual não foi encontrado.
  function requireElement(selector) {
    const element = root.querySelector(selector);
    if (!element) {
      throw new Error(
        `Elemento obrigatório não encontrado na página de estrutura: ${selector}`,
      );
    }
    return element;
  }

  const elements = {
    structureContent: requireElement("[data-structure-content]"),
    structureForm: requireElement("#structure-form"),
    structureName: requireElement("#structure-name"),
    structureAddress: requireElement("#structure-address"),
    floorCount: requireElement("#floor-count"),
    floorTabs: requireElement("#floor-tabs"),
    floorName: requireElement("#floor-name"),
    sectorId: requireElement("#sector-id"),
    sectorSpotCount: requireElement("#sector-spot-count"),
    addSectorButton: requireElement("#add-sector-button"),
    sectorsList: requireElement("#sectors-list"),
    floorCounter: requireElement("#floor-counter"),
    cancelStructureButton: requireElement("#cancel-structure"),
    structureMessage: requireElement("#structure-message"),
  };

  const MAX_FLOORS = 20;
  const MAX_SPOTS_PER_SECTOR = 999;

  // Cria um piso com um nome inicial e sem setores.
  function createFloor(index) {
    return {
      name: `Piso ${index + 1}`,
      sectors: [],
    };
  }

  let floors = [createFloor(0)];
  let activeFloorIndex = 0;
  let structureName = "";
  let structureAddress = "";

  // Exibe uma mensagem de validação ou informa que o salvamento ainda não existe.
  function showStructureMessage(message, state = "error") {
    elements.structureMessage.textContent = message;
    elements.structureMessage.dataset.state = state;
    elements.structureMessage.hidden = false;
  }

  // Oculta a mensagem atual quando o usuário volta a editar os campos.
  function clearStructureMessage() {
    elements.structureMessage.textContent = "";
    elements.structureMessage.hidden = true;
    delete elements.structureMessage.dataset.state;
  }

  // Cria um elemento HTML usando texto simples.
  function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  }

  // Retorna o piso selecionado no editor.
  function getActiveFloor() {
    return floors[activeFloorIndex];
  }

  // Atualiza as opções de pisos e o contador.
  function renderFloorTabs() {
    elements.floorTabs.replaceChildren();

    floors.forEach((floor, index) => {
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
        createTextElement(
          "span",
          "floor-tab-name",
          floor.name || `Piso ${index + 1}`,
        ),
        createTextElement("span", "floor-tab-count", String(floor.sectors.length)),
      );
      elements.floorTabs.append(button);
    });

    elements.floorCounter.textContent = `${floors.length} ${
      floors.length === 1 ? "piso" : "pisos"
    }`;
  }

  // Cria o cartão de um setor com identificador, quantidade e opção de remoção.
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

  // Renderiza os setores cadastrados no piso ativo ou o estado vazio.
  function renderSectors() {
    const sectors = getActiveFloor().sectors;
    elements.sectorsList.replaceChildren();

    if (sectors.length === 0) {
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

    sectors.forEach((sector, index) => {
      elements.sectorsList.append(createSectorCard(sector, index));
    });
  }

  // Sincroniza os campos e redesenha os pisos e setores.
  function renderEditor() {
    elements.structureName.value = structureName;
    elements.structureAddress.value = structureAddress;
    elements.floorCount.value = String(floors.length);
    elements.floorName.value = getActiveFloor().name;
    renderFloorTabs();
    renderSectors();
  }

  // Seleciona o piso e atualiza os dados exibidos.
  function setActiveFloor(index) {
    if (!Number.isInteger(index) || !floors[index]) {
      return;
    }

    activeFloorIndex = index;
    elements.floorName.value = getActiveFloor().name;
    renderFloorTabs();
    renderSectors();
    clearStructureMessage();
  }

  // Ajusta a quantidade de pisos e confirma antes de descartar setores.
  function resizeFloors() {
    const nextCount = Number(elements.floorCount.value);
    const previousCount = floors.length;

    if (!Number.isInteger(nextCount) || nextCount < 1 || nextCount > MAX_FLOORS) {
      showStructureMessage(
        `Informe uma quantidade entre 1 e ${MAX_FLOORS} pisos.`,
      );
      elements.floorCount.value = String(previousCount);
      return;
    }

    const removedFloors = floors.slice(nextCount);
    const hasConfiguration = removedFloors.some(
      (floor) => floor.sectors.length > 0,
    );
    if (
      nextCount < previousCount &&
      hasConfiguration &&
      !window.confirm("Os pisos removidos e seus setores serão descartados. Deseja continuar?")
    ) {
      elements.floorCount.value = String(previousCount);
      return;
    }

    while (floors.length < nextCount) {
      floors.push(createFloor(floors.length));
    }
    floors.length = nextCount;
    activeFloorIndex = Math.min(activeFloorIndex, nextCount - 1);
    renderEditor();
    clearStructureMessage();
  }

  // Valida e adiciona o setor ao piso selecionado.
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
    clearStructureMessage();
  }

  // Descarta as alterações da prévia e restaura um piso vazio.
  function cancelChanges() {
    floors = [createFloor(0)];
    activeFloorIndex = 0;
    structureName = "";
    structureAddress = "";
    elements.sectorId.value = "";
    elements.sectorSpotCount.value = "12";
    elements.floorName.setCustomValidity("");
    elements.sectorId.setCustomValidity("");
    elements.sectorSpotCount.setCustomValidity("");
    renderEditor();
    showStructureMessage("Alterações descartadas nesta prévia.", "info");
  }

  // Mantém a tela sem envio nem persistência e informa isso ao usuário.
  function handleSubmit(event) {
    event.preventDefault();
    elements.structureName.value = elements.structureName.value.trim();
    elements.structureAddress.value = elements.structureAddress.value.trim();
    elements.floorName.value = elements.floorName.value.trim();

    structureName = elements.structureName.value;
    structureAddress = elements.structureAddress.value;
    getActiveFloor().name = elements.floorName.value;

    if (!elements.structureForm.reportValidity()) {
      return;
    }

    const unnamedFloorIndex = floors.findIndex((floor) => !floor.name.trim());
    if (unnamedFloorIndex !== -1) {
      setActiveFloor(unnamedFloorIndex);
      elements.floorName.setCustomValidity("Informe um nome para este piso.");
      elements.floorName.reportValidity();
      return;
    }

    renderFloorTabs();
    showStructureMessage(
      "Esta tela é apenas uma prévia; o salvamento ainda não está implementado.",
      "info",
    );
  }

  // Trata cliques nos controles dinâmicos de pisos e setores.
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
      getActiveFloor().sectors.splice(sectorIndex, 1);
      renderFloorTabs();
      renderSectors();
      clearStructureMessage();
    }
  }

  elements.floorCount.addEventListener("change", resizeFloors);
  elements.floorName.addEventListener("input", () => {
    elements.floorName.setCustomValidity("");
    getActiveFloor().name = elements.floorName.value;
    const tabName = elements.floorTabs.querySelector(
      `[data-floor-index="${activeFloorIndex}"] .floor-tab-name`,
    );
    if (tabName) {
      tabName.textContent =
        elements.floorName.value || `Piso ${activeFloorIndex + 1}`;
    }
    clearStructureMessage();
  });
  elements.structureName.addEventListener("input", () => {
    structureName = elements.structureName.value;
    clearStructureMessage();
  });
  elements.structureAddress.addEventListener("input", () => {
    structureAddress = elements.structureAddress.value;
    clearStructureMessage();
  });
  elements.sectorId.addEventListener("input", () => {
    elements.sectorId.setCustomValidity("");
  });
  elements.sectorSpotCount.addEventListener("input", () => {
    elements.sectorSpotCount.setCustomValidity("");
  });
  elements.addSectorButton.addEventListener("click", addSector);
  elements.structureForm.addEventListener("submit", handleSubmit);
  elements.cancelStructureButton.addEventListener("click", cancelChanges);
  elements.structureContent.addEventListener("click", handleStructureClick);
  renderEditor();
}

mountStructurePage(document);
