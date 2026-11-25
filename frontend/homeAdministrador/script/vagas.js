const gradeVagas = document.querySelector("#parking-grid");
const tituloVagaSelecionada = document.querySelector("#selected-title");
const mensagemVagaVazia = document.querySelector("#selected-empty");
const acoesVaga = document.querySelector("#spot-actions");
const statusVagaSelecionada = document.querySelector("#selected-status");
const botaoAdicionarVaga = document.querySelector("#add-spot");
const botaoExcluirVaga = document.querySelector("#delete-spot");
const seletorPiso = document.querySelector("#floor-select");
const seletorSetor = document.querySelector("#sector-select");
const identificacaoPisoMapa = document.querySelector("#map-floor-label");
const identificacaoSetorMapa = document.querySelector("#map-sector-label");

const rotulosStatus = {
  available: "Disponível",
  occupied: "Ocupado",
  maintenance: "Manutenção",
};

const imagensStatus = {
  available: "../assets/DISPONIVEL.svg",
  occupied: "../assets/OCUPADO.svg",
  maintenance: "../assets/MANUTENCAO.svg",
};

let estacionamentoAtual = null;
let pisoSelecionado = null;
let setorSelecionado = null;
let identificadorVagaSelecionada = null;
let vagasDoSetor = [];
let proximoNumeroVaga = 1;

function aplicarClasseStatus(elemento, status) {
  elemento.classList.remove("available", "occupied", "maintenance");
  elemento.classList.add(status);
}

function contarVagas() {
  const totais = { available: 0, occupied: 0, maintenance: 0 };
  vagasDoSetor.forEach((vaga) => {
    totais[vaga.status] += 1;
  });

  document.querySelector("#available-count").textContent = totais.available;
  document.querySelector("#occupied-count").textContent = totais.occupied;
  document.querySelector("#maintenance-count").textContent = totais.maintenance;
}

function renderizarVaga(vaga) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = `parking-spot ${vaga.status}`;
  botao.dataset.spotId = vaga.identificador;
  botao.setAttribute(
    "aria-label",
    `Vaga ${vaga.identificador}: ${rotulosStatus[vaga.status]}`,
  );
  botao.setAttribute(
    "aria-selected",
    String(vaga.identificador === identificadorVagaSelecionada),
  );

  const imagem = document.createElement("img");
  imagem.className = "spot-icon";
  imagem.src = imagensStatus[vaga.status];
  imagem.alt = "";
  imagem.setAttribute("aria-hidden", "true");

  const identificador = document.createElement("span");
  identificador.className = "spot-code";
  identificador.textContent = vaga.identificador;
  botao.append(imagem, identificador);
  return botao;
}

function renderizarSelecao() {
  const vaga = vagasDoSetor.find(
    (item) => item.identificador === identificadorVagaSelecionada,
  );

  if (!vaga) {
    tituloVagaSelecionada.textContent = "Nenhuma vaga";
    mensagemVagaVazia.hidden = false;
    acoesVaga.hidden = true;
    return;
  }

  tituloVagaSelecionada.textContent = `Vaga ${vaga.identificador}`;
  mensagemVagaVazia.hidden = true;
  acoesVaga.hidden = false;
  statusVagaSelecionada.textContent = rotulosStatus[vaga.status];
  aplicarClasseStatus(statusVagaSelecionada, vaga.status);

  const opcaoStatus = document.querySelector(
    `input[name="spot-status"][value="${vaga.status}"]`,
  );
  if (opcaoStatus) {
    opcaoStatus.checked = true;
  }
}

function renderizarMapa() {
  gradeVagas.replaceChildren();
  vagasDoSetor.forEach((vaga) => gradeVagas.append(renderizarVaga(vaga)));
  contarVagas();
  renderizarSelecao();
}

// Converte o enum da API para os rótulos e classes usados pela interface.
function converterStatus(statusApi) {
  const statusPorApi = {
    DISPONIVEL: "available",
    OCUPADO: "occupied",
    OCUPADA: "occupied",
    MANUTENCAO: "maintenance",
  };
  return statusPorApi[statusApi] || "available";
}

function converterStatusParaApi(status) {
  const statusParaApi = {
    available: "DISPONIVEL",
    occupied: "OCUPADO",
    maintenance: "MANUTENCAO",
  };
  return statusParaApi[status];
}

function selecionarVaga(identificador) {
  identificadorVagaSelecionada = identificador;
  renderizarMapa();
}

async function atualizarStatusVaga(status) {
  const vaga = vagasDoSetor.find(
    (item) => item.identificador === identificadorVagaSelecionada,
  );
  if (!vaga) {
    return;
  }

  const statusAnterior = vaga.status;
  const novoStatus = status;
  const setorDaVaga = setorSelecionado;

  // Vagas adicionadas nesta prévia ainda não possuem identificador no servidor.
  if (vaga.idApi === null) {
    vaga.status = novoStatus;
    renderizarMapa();
    return;
  }

  try {
    const resposta = await fetch(
      `http://localhost:8080/estacioNatal/vagas/${vaga.idApi}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(converterStatusParaApi(novoStatus)),
      },
    );
    if (!resposta.ok) {
      throw new Error("Não foi possível atualizar o status da vaga.");
    }

    const vagaOriginal = setorDaVaga.vagas?.find(
      (item) => item.id === vaga.idApi,
    );
    if (vagaOriginal) {
      vagaOriginal.status = converterStatusParaApi(novoStatus);
    }

    vaga.status = novoStatus;
    renderizarMapa();
  } catch (erro) {
    console.error("Erro ao atualizar o status da vaga:", erro);
    alert(erro.message || "Não foi possível atualizar o status da vaga.");
    vaga.status = statusAnterior;
    renderizarMapa();
  }
}

async function carregarEstacionamento() {
  try {
    const resposta = await fetch(
      "http://localhost:8080/estacioNatal/estacionamentos/1",
    );
    if (!resposta.ok) {
      throw new Error("Não foi possível carregar o estacionamento.");
    }

    estacionamentoAtual = await resposta.json();
    carregarPisos();
  } catch (erro) {
    console.error("Erro ao carregar estacionamento:", erro);
    mensagemVagaVazia.textContent =
      erro.message || "Não foi possível carregar o estacionamento.";
  }
}

function carregarPisos() {
  seletorPiso.replaceChildren();
  estacionamentoAtual.pisos.forEach((piso, indice) => {
    const opcao = document.createElement("option");
    opcao.value = String(indice);
    opcao.textContent = piso.identificador;
    seletorPiso.append(opcao);
  });

  seletorPiso.disabled = estacionamentoAtual.pisos.length === 0;
  if (estacionamentoAtual.pisos.length > 0) {
    selecionarPiso(0);
  }
}

function selecionarPiso(indice) {
  pisoSelecionado = estacionamentoAtual.pisos[indice];
  if (!pisoSelecionado) {
    return;
  }

  identificacaoPisoMapa.textContent = pisoSelecionado.identificador;
  carregarSetores();
}

function carregarSetores() {
  seletorSetor.replaceChildren();
  const setores = Array.isArray(pisoSelecionado.setores)
    ? pisoSelecionado.setores
    : [];

  setores.forEach((setor, indice) => {
    const opcao = document.createElement("option");
    opcao.value = String(indice);
    opcao.textContent = setor.identificador;
    seletorSetor.append(opcao);
  });

  seletorSetor.disabled = setores.length === 0;
  if (setores.length > 0) {
    selecionarSetor(0);
    return;
  }

  identificacaoSetorMapa.textContent = "Nenhum setor";
  vagasDoSetor = [];
  identificadorVagaSelecionada = null;
  renderizarMapa();
}

function selecionarSetor(indice) {
  setorSelecionado = pisoSelecionado.setores[indice];
  if (!setorSelecionado) {
    return;
  }

  identificacaoSetorMapa.textContent = `Setor ${setorSelecionado.identificador}`;
  vagasDoSetor = (setorSelecionado.vagas || []).map((vaga) => ({
    idApi: vaga.id,
    identificador: vaga.identificador,
    status: converterStatus(vaga.status),
  }));
  identificadorVagaSelecionada = vagasDoSetor[0]?.identificador ?? null;
  proximoNumeroVaga = 1;
  renderizarMapa();
}

gradeVagas.addEventListener("click", (evento) => {
  if (!(evento.target instanceof Element)) {
    return;
  }

  const botaoVaga = evento.target.closest("[data-spot-id]");
  if (botaoVaga) {
    selecionarVaga(botaoVaga.dataset.spotId);
  }
});

document.querySelectorAll('input[name="spot-status"]').forEach((opcao) => {
  opcao.addEventListener("change", () => atualizarStatusVaga(opcao.value));
});

botaoAdicionarVaga.addEventListener("click", () => {
  let identificador = `A-${String(proximoNumeroVaga).padStart(2, "0")}`;
  while (vagasDoSetor.some((vaga) => vaga.identificador === identificador)) {
    proximoNumeroVaga += 1;
    identificador = `A-${String(proximoNumeroVaga).padStart(2, "0")}`;
  }
  proximoNumeroVaga += 1;
  vagasDoSetor.push({
    idApi: null,
    identificador,
    status: "available",
  });
  selecionarVaga(identificador);
});

botaoExcluirVaga.addEventListener("click", () => {
  if (!identificadorVagaSelecionada) {
    return;
  }
  if (!window.confirm(`Deseja excluir a vaga ${identificadorVagaSelecionada}?`)) {
    return;
  }

  vagasDoSetor = vagasDoSetor.filter(
    (vaga) => vaga.identificador !== identificadorVagaSelecionada,
  );
  identificadorVagaSelecionada = vagasDoSetor[0]?.identificador ?? null;
  renderizarMapa();
});

seletorPiso.addEventListener("change", () => {
  selecionarPiso(Number(seletorPiso.value));
});

seletorSetor.addEventListener("change", () => {
  selecionarSetor(Number(seletorSetor.value));
});

carregarEstacionamento();
