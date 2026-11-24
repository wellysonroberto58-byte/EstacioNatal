const parkingSearch = document.querySelector("#parking-search");
const parkingContent = document.querySelector("#parking-content");
const parkingSearchMessage = document.querySelector("#parking-search-message");
const floorSelect = document.querySelector("#floor-select");
const accessibilityToggle = document.querySelector("#accessibility-toggle");
const parkingMap = document.querySelector(".parking-map");
const mapFeedback = document.querySelector("#map-feedback");
const availableCount = document.querySelector("#available-count");
const parkingRowTop = document.querySelector("#parking-row-top");
const parkingRowBottom = document.querySelector("#parking-row-bottom");
const sectorOptions = document.querySelector("#sector-options");

let estacionamento = null;
let pisoSelecionado = null;
let setorSelecionado = null;
let activeSector = null;
let spots = [];

// fAZ A REQUSIÇÃO PARA API E DEVOLVE O ESTACIONAMENTO em json
async function carregarEstacionamento() {
  try {
    const resposta = await fetch(
      "http://localhost:8080/estacioNatal/estacionamentos/1",
    );

    if (!resposta.ok) {
      throw new Error("Erro ao carregar estacionamento.");
    }

    estacionamento = await resposta.json();

    console.log("Estacionamento recebido:", estacionamento);

    carregarPisos();
  } catch (erro) {
    console.error("Erro:", erro);
    mapFeedback.textContent =
      "Não foi possível carregar os dados do estacionamento.";
  }
}

function carregarPisos() {
  // TROCA TODOS OS FILHOS DO HTML ESPECIFICADO
  floorSelect.replaceChildren();

  // EM ESTACIONAMENTO, PECORRE CADA PISO
  estacionamento.pisos.forEach((piso, index) => {
    // PARA CADA PISO, SEPARA UMA REFERÊNCIA NA MEMÓRIA UM ELEMENTO HTML COM TAG OPTION E ATRIBUI OS VALORES
    const option = document.createElement("option");

    option.value = index;
    option.textContent = piso.identificador;

    // ADICIONA O PISO COM SEU HTML
    floorSelect.append(option);
  });

  // VERIFICA SE O ESTACIONAMENTO TEM PELO MENOS UM PISO CADASTRADO
  if (estacionamento.pisos.length > 0) {
    floorSelect.disabled = false;
    selecionarPiso(0);
  }
}

// FUNÇÃO RESPONSÁVEL POR SELECIONAR O PISO
function selecionarPiso(index) {
  pisoSelecionado = estacionamento.pisos[index];

  carregarSetores();
}

// FUNÇÃO RESPONSÁVEL POR LIMPAR E CARREGAR OS SETORES
function carregarSetores() {
  sectorOptions.replaceChildren();

  pisoSelecionado.setores.forEach((setor, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.classList.add("sector-button");
    button.textContent = setor.identificador;
    button.dataset.index = index;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      selecionarSetor(index);
    });

    sectorOptions.append(button);
  });

  if (pisoSelecionado.setores.length > 0) {
    selecionarSetor(0);
  } else {
    setorSelecionado = null;
    spots = [];
    parkingRowTop.replaceChildren();
    parkingRowBottom.replaceChildren();
    availableCount.textContent = "0";
    mapFeedback.textContent = "Este piso não possui setores cadastrados.";
  }
}

function selecionarSetor(index) {
  setorSelecionado = pisoSelecionado.setores[index];

  activeSector = setorSelecionado.identificador;

  const buttons = sectorOptions.querySelectorAll(".sector-button");

  buttons.forEach((button, i) => {
    const isActive = i === index;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  console.log("Setor selecionado:", setorSelecionado);

  carregarVagas();
}

function carregarVagas() {
  spots = setorSelecionado.vagas;

  parkingRowTop.replaceChildren();
  parkingRowBottom.replaceChildren();

  spots.forEach((vaga, index) => {
    const spot = document.createElement("div");

    spot.classList.add("parking-spot");

    const status = converterStatus(vaga.status);

    spot.classList.add(`is-${status}`);

    spot.dataset.spot = vaga.identificador;
    spot.dataset.status = vaga.status;
    spot.dataset.tipo = vaga.tipo;

    if (vaga.tipo === "ACESSIVEL") {
      spot.classList.add("is-accessible");
    }

    const identificador = document.createElement("span");
    identificador.textContent = vaga.identificador;

    spot.append(identificador);

    if (index < Math.ceil(spots.length / 2)) {
      parkingRowTop.append(spot);
    } else {
      parkingRowBottom.append(spot);
    }
  });

  filtrarVagasAcessiveis();
  atualizarContagem();

  parkingMap.setAttribute(
    "aria-label",
    `Mapa de vagas do piso ${pisoSelecionado.identificador}, setor ${activeSector}`,
  );

  mapFeedback.textContent = `${spots.length} vaga(s) cadastrada(s) neste setor.`;

  console.log("Vagas carregadas:", spots);
}

function converterStatus(statusJava) {
  const status = {
    DISPONIVEL: "available",
    OCUPADO: "occupied",
    MANUTENCAO: "maintenance",
  };

  return status[statusJava] || "available";
}

function atualizarContagem() {
  const accessibleOnly =
    accessibilityToggle.getAttribute("aria-pressed") === "true";

  const vagasVisiveis = spots.filter((vaga) => {
    return !accessibleOnly || vaga.tipo === "ACESSIVEL";
  });

  const disponiveis = vagasVisiveis.filter(
    (vaga) => vaga.status === "DISPONIVEL",
  ).length;

  availableCount.textContent = disponiveis;
}

function filtrarVagasAcessiveis() {
  const accessibleOnly =
    accessibilityToggle.getAttribute("aria-pressed") === "true";

  const todasVagas = document.querySelectorAll(".parking-spot");

  todasVagas.forEach((spot) => {
    const isAccessible = spot.dataset.tipo === "ACESSIVEL";

    spot.hidden = accessibleOnly && !isAccessible;
  });

  atualizarContagem();
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

  filtrarVagasAcessiveis();
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    parkingSearch.focus();
  }
});

// Pesquisa de estacionamento
parkingSearch.addEventListener("input", updateParkingSearch);

// Mudança de piso
floorSelect.addEventListener("change", () => {
  selecionarPiso(Number(floorSelect.value));
});

// Filtro de acessibilidade
accessibilityToggle.addEventListener("click", () => {
  const isPressed = accessibilityToggle.getAttribute("aria-pressed") === "true";

  accessibilityToggle.setAttribute("aria-pressed", String(!isPressed));

  filtrarVagasAcessiveis();
});

// Atalho Ctrl + K para pesquisa
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    parkingSearch.focus();
  }
});

// Inicialização
updateParkingSearch();
carregarEstacionamento();
