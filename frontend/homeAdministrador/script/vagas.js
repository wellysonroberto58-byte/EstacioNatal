const parkingGrid = document.querySelector("#parking-grid");
const selectedTitle = document.querySelector("#selected-title");
const selectedEmpty = document.querySelector("#selected-empty");
const spotActions = document.querySelector("#spot-actions");
const selectedStatus = document.querySelector("#selected-status");
const addSpotButton = document.querySelector("#add-spot");
const deleteSpotButton = document.querySelector("#delete-spot");

const floorSelect = document.querySelector("#floor-select");
const sectorSelect = document.querySelector("#sector-select");

const mapFloorLabel = document.querySelector("#map-floor-label");
const mapSectorLabel = document.querySelector("#map-sector-label");

const statusLabels = {
  available: "Disponível",
  occupied: "Ocupado",
  maintenance: "Manutenção",
};

let estacionamento = null;
let pisoSelecionado = null;
let setorSelecionado = null;

let selectedId = null;
let spots = [];

function statusClass(element, status) {
  element.classList.remove("available", "occupied", "maintenance");
  element.classList.add(status);
}

function renderSummary() {
  const counts = { available: 0, occupied: 0, maintenance: 0 };
  spots.forEach((spot) => counts[spot.status]++);
  document.querySelector("#available-count").textContent = counts.available;
  document.querySelector("#occupied-count").textContent = counts.occupied;
  document.querySelector("#maintenance-count").textContent = counts.maintenance;
}

function renderSelection() {
  const spot = spots.find((item) => item.id === selectedId);
  if (!spot) {
    selectedTitle.textContent = "Nenhuma vaga";
    selectedEmpty.hidden = false;
    spotActions.hidden = true;
    return;
  }

  selectedTitle.textContent = `Vaga ${spot.id}`;
  selectedEmpty.hidden = true;
  spotActions.hidden = false;
  selectedStatus.textContent = statusLabels[spot.status];
  statusClass(selectedStatus, spot.status);

  const statusInput = document.querySelector(
    `input[name="spot-status"][value="${spot.status}"]`,
  );
  if (statusInput) statusInput.checked = true;
}

function renderGrid() {
  parkingGrid.replaceChildren();
  spots.forEach((spot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `parking-spot ${spot.status}`;
    button.dataset.spotId = spot.id;
    button.setAttribute(
      "aria-label",
      `Vaga ${spot.id}: ${statusLabels[spot.status]}`,
    );
    button.setAttribute("aria-selected", String(spot.id === selectedId));

    const code = document.createElement("span");
    code.className = "spot-code";
    code.textContent = spot.id;
    const car = document.createElement("span");
    car.className = "spot-car";
    car.setAttribute("aria-hidden", "true");
    const mark = document.createElement("span");
    mark.className = "spot-status-mark";
    mark.setAttribute("aria-hidden", "true");
    button.append(code, car, mark);
    parkingGrid.append(button);
  });

  renderSummary();
  renderSelection();
}

parkingGrid.addEventListener("click", (event) => {
  const spotButton = event.target.closest("[data-spot-id]");
  if (!spotButton) return;
  selectedId = spotButton.dataset.spotId;
  renderGrid();
});

document.querySelectorAll('input[name="spot-status"]').forEach((input) => {
  input.addEventListener("change", async () => {
    const spot = spots.find((item) => item.id === selectedId);

    if (!spot) return;

    // Converte o status do frontend para o enum Java
    const novoStatus = converterStatusParaJava(input.value);

    try {
      // Envia a atualização para o backend
      const resposta = await fetch(
        `http://localhost:8080/estacioNatal/vagas/${spot.backendId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(novoStatus),
        },
      );

      if (!resposta.ok) {
        throw new Error("Não foi possível atualizar o status.");
      }

      // Atualiza a interface somente após a confirmação do servidor
      spot.status = input.value;

      renderGrid();

      console.log("Status atualizado com sucesso!");
    } catch (erro) {
      console.error("Erro ao atualizar status:", erro);

      alert("Não foi possível atualizar o status da vaga.");

      // Restaura a interface para o status anterior
      renderGrid();
    }
  });
});

addSpotButton.addEventListener("click", () => {
  const id = `A-${String(nextNumber).padStart(2, "0")}`;
  nextNumber++;
  spots.push({ id, status: "available" });
  selectedId = id;
  renderGrid();
});

deleteSpotButton.addEventListener("click", () => {
  if (!selectedId) return;
  if (!window.confirm(`Deseja excluir a vaga ${selectedId}?`)) return;
  spots = spots.filter((spot) => spot.id !== selectedId);
  selectedId = spots[0]?.id ?? null;
  renderGrid();
});

carregarEstacionamento();

async function carregarEstacionamento() {
  try {
    const resposta = await fetch(
      "http://localhost:8080/estacioNatal/estacionamentos/1",
    );

    if (!resposta.ok) {
      throw new Error("Erro ao carregar o estacionamento.");
    }

    estacionamento = await resposta.json();

    console.log("Estacionamento carregado:", estacionamento);

    carregarPisos();
  } catch (erro) {
    console.log("ERRO:", erro);
  }
}

function converterStatus(statusJava) {
  const status = {
    DISPONIVEL: "available",
    OCUPADA: "occupied",
    MANUTENCAO: "maintenance",
  };
  return status[statusJava] || "available";
}

function converterStatusParaJava(statusFrontend) {
  const status = {
    available: "DISPONIVEL",
    occupied: "OCUPADO",
    maintenance: "MANUTENCAO",
  };

  return status[statusFrontend];
}

function carregarPisos() {
  floorSelect.replaceChildren();

  estacionamento.pisos.forEach((piso, index) => {
    const option = document.createElement("option");

    option.value = index;
    option.textContent = piso.identificador;

    floorSelect.append(option);
  });

  if (estacionamento.pisos.length > 0) {
    floorSelect.disabled = false;
    selecionarPiso(0);
  }
}

function selecionarPiso(index) {
  pisoSelecionado = estacionamento.pisos[index];

  mapFloorLabel.textContent = pisoSelecionado.identificador;

  carregarSetores();
}

function carregarSetores() {
  sectorSelect.replaceChildren();

  pisoSelecionado.setores.forEach((setor, index) => {
    const option = document.createElement("option");

    option.value = index;
    option.textContent = setor.identificador;

    sectorSelect.append(option);
  });

  if (pisoSelecionado.setores.length > 0) {
    sectorSelect.disabled = false;
    selecionarSetor(0);
  } else {
    sectorSelect.disabled = true;
    mapSectorLabel.textContent = "Nenhum setor";

    spots = [];
    selectedId = null;

    renderGrid();
  }
}

function selecionarSetor(index) {
  setorSelecionado = pisoSelecionado.setores[index];

  console.log("Piso selecionado:", pisoSelecionado);
  console.log("Setor selecionado:", setorSelecionado);

  mapSectorLabel.textContent = "Setor " + setorSelecionado.identificador;

  spots = setorSelecionado.vagas.map((vaga) => ({
    backendId: vaga.id,
    id: vaga.identificador,
    status: converterStatus(vaga.status),
  }));

  selectedId = spots[0]?.id ?? null;

  renderGrid();
}

// Eventos dos seletores
floorSelect.addEventListener("change", () => {
  selecionarPiso(Number(floorSelect.value));
});

sectorSelect.addEventListener("change", () => {
  selecionarSetor(Number(sectorSelect.value));
});

carregarEstacionamento();
