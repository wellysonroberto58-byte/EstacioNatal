const campoBusca = document.querySelector("#parking-search");
const conteudoEstacionamento = document.querySelector("#parking-content");
const mensagemBusca = document.querySelector("#parking-search-message");
const seletorPiso = document.querySelector("#floor-select");
const filtroAcessibilidade = document.querySelector("#accessibility-toggle");
const mensagemMapa = document.querySelector("#map-feedback");
const vagasDisponiveis = document.querySelector("#available-count");
const medidorOcupacao = document.querySelector("#occupancy-meter");
const percentualOcupacao = document.querySelector("#occupancy-percent");
const localEstacionamento = document.querySelector("#parking-location");
const linhaSuperior = document.querySelector("#parking-row-top");
const linhaInferior = document.querySelector("#parking-row-bottom");
const opcoesSetor = document.querySelector("#sector-options");

// Relaciona os estados enviados pela API aos rótulos e assets exibidos no mapa.
const estadosVaga = {
  DISPONIVEL: {
    classe: "available",
    rotulo: "Disponível",
    imagem: "../assets/DISPONIVEL.svg",
  },
  OCUPADO: {
    classe: "occupied",
    rotulo: "Ocupada",
    imagem: "../assets/OCUPADO.svg",
  },
  OCUPADA: {
    classe: "occupied",
    rotulo: "Ocupada",
    imagem: "../assets/OCUPADO.svg",
  },
  MANUTENCAO: {
    classe: "maintenance",
    rotulo: "Em manutenção",
    imagem: "../assets/MANUTENCAO.svg",
  },
};

let estacionamentoAtual = null;
let pisoAtual = null;
let vagasDoSetor = [];

function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function obterEstadoVaga(status) {
  return estadosVaga[status] || estadosVaga.MANUTENCAO;
}

// Mantém a contagem e a ocupação alinhadas com o filtro de acessibilidade.
function atualizarResumo() {
  const vagasVisiveis = vagasDoSetor.filter(
    (vaga) =>
      filtroAcessibilidade.getAttribute("aria-pressed") !== "true" ||
      vaga.tipo === "ACESSIVEL",
  );
  const disponiveis = vagasVisiveis.filter(
    (vaga) => vaga.status === "DISPONIVEL",
  ).length;
  const ocupadas = vagasVisiveis.filter(
    (vaga) => vaga.status === "OCUPADO" || vaga.status === "OCUPADA",
  ).length;
  const percentual = vagasVisiveis.length
    ? Math.round((ocupadas / vagasVisiveis.length) * 100)
    : 0;

  vagasDisponiveis.textContent = String(disponiveis);
  percentualOcupacao.textContent = `${percentual}%`;
  medidorOcupacao.style.width = `${percentual}%`;
}

function criarVaga(vaga) {
  const estado = obterEstadoVaga(vaga.status);
  const vagaVisual = document.createElement("div");
  vagaVisual.className = `parking-spot is-${estado.classe}`;
  if (vaga.tipo === "ACESSIVEL") {
    vagaVisual.classList.add("is-accessible");
  }
  vagaVisual.setAttribute(
    "role",
    "img",
  );
  vagaVisual.setAttribute(
    "aria-label",
    `Vaga ${vaga.identificador}: ${estado.rotulo}${
      vaga.tipo === "ACESSIVEL" ? ", acessível" : ""
    }`,
  );

  const imagem = document.createElement("img");
  imagem.className = "spot-icon";
  imagem.src = estado.imagem;
  imagem.alt = "";
  imagem.setAttribute("aria-hidden", "true");

  const identificador = document.createElement("span");
  identificador.className = "spot-code";
  identificador.textContent = vaga.identificador;
  vagaVisual.append(imagem, identificador);

  if (vaga.tipo === "ACESSIVEL") {
    const marcador = document.createElement("span");
    marcador.className = "accessible-mark";
    marcador.setAttribute("aria-hidden", "true");
    marcador.textContent = "A";
    vagaVisual.append(marcador);
  }

  return vagaVisual;
}

function renderizarVagas() {
  linhaSuperior.replaceChildren();
  linhaInferior.replaceChildren();

  const vagasVisiveis = vagasDoSetor.filter(
    (vaga) =>
      filtroAcessibilidade.getAttribute("aria-pressed") !== "true" ||
      vaga.tipo === "ACESSIVEL",
  );
  const limiteLinhaSuperior = Math.ceil(vagasVisiveis.length / 2);

  vagasVisiveis.forEach((vaga, indice) => {
    const vagaVisual = criarVaga(vaga);
    (indice < limiteLinhaSuperior ? linhaSuperior : linhaInferior).append(
      vagaVisual,
    );
  });

  atualizarResumo();
}

function selecionarSetor(indice) {
  const setor = pisoAtual.setores[indice];
  if (!setor) {
    return;
  }

  opcoesSetor.querySelectorAll(".sector-button").forEach((botao, posicao) => {
    const selecionado = posicao === indice;
    botao.classList.toggle("is-active", selecionado);
    botao.setAttribute("aria-pressed", String(selecionado));
  });

  vagasDoSetor = Array.isArray(setor.vagas) ? setor.vagas : [];
  renderizarVagas();
  mensagemMapa.textContent = `${vagasDoSetor.length} ${
    vagasDoSetor.length === 1 ? "vaga cadastrada" : "vagas cadastradas"
  } neste setor.`;
}

function carregarSetores() {
  opcoesSetor.replaceChildren();
  linhaSuperior.replaceChildren();
  linhaInferior.replaceChildren();
  vagasDoSetor = [];

  const setores = Array.isArray(pisoAtual.setores) ? pisoAtual.setores : [];
  setores.forEach((setor, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "sector-button";
    botao.textContent = setor.identificador;
    botao.setAttribute("aria-pressed", "false");
    botao.addEventListener("click", () => selecionarSetor(indice));
    opcoesSetor.append(botao);
  });

  if (setores.length === 0) {
    mensagemMapa.textContent = "Este piso ainda não possui setores cadastrados.";
    atualizarResumo();
    return;
  }

  selecionarSetor(0);
}

function selecionarPiso(indice) {
  pisoAtual = estacionamentoAtual.pisos[indice];
  if (!pisoAtual) {
    return;
  }

  carregarSetores();
}

function carregarPisos() {
  seletorPiso.replaceChildren();
  estacionamentoAtual.pisos.forEach((piso, indice) => {
    const opcao = document.createElement("option");
    opcao.value = String(indice);
    opcao.textContent = piso.identificador;
    seletorPiso.append(opcao);
  });

  if (estacionamentoAtual.pisos.length === 0) {
    const opcaoVazia = document.createElement("option");
    opcaoVazia.value = "";
    opcaoVazia.textContent = "Nenhum piso cadastrado";
    seletorPiso.append(opcaoVazia);
    seletorPiso.disabled = true;
    mensagemMapa.textContent =
      "Este estacionamento ainda não possui pisos cadastrados.";
    return;
  }

  seletorPiso.disabled = false;
  selecionarPiso(0);
}

function atualizarBusca() {
  const consulta = normalizarTexto(campoBusca.value.trim());
  const dadosEstacionamento = [
    estacionamentoAtual?.nome,
    estacionamentoAtual?.endereco,
    ...(estacionamentoAtual?.pisos || []).flatMap((piso) => [
      piso.identificador,
      ...(piso.setores || []).map((setor) => setor.identificador),
    ]),
  ]
    .filter(Boolean)
    .join(" ");
  const encontrou =
    !consulta || normalizarTexto(dadosEstacionamento).includes(consulta);

  conteudoEstacionamento.hidden = !encontrou;
  mensagemBusca.textContent = !consulta
    ? "Busque pelo nome, endereço, piso ou setor."
    : encontrou
      ? `${estacionamentoAtual.nome} · ${estacionamentoAtual.endereco}`
      : "Nenhum estacionamento encontrado. Confira sua busca.";
}

function mostrarErroDeCarregamento(erro) {
  console.error("Erro ao carregar estacionamento:", erro);
  seletorPiso.replaceChildren();
  const opcaoVazia = document.createElement("option");
  opcaoVazia.value = "";
  opcaoVazia.textContent =
    erro.status === 404
      ? "Nenhum estacionamento cadastrado"
      : "Não foi possível carregar os pisos";
  seletorPiso.append(opcaoVazia);
  seletorPiso.disabled = true;
  mensagemMapa.textContent =
    erro.status === 404
      ? "Nenhum estacionamento cadastrado ou disponível para consulta."
      : "Não foi possível carregar os dados. Verifique se a API está em execução e tente novamente.";
}

// Carrega os dados reais sem oferecer ações administrativas nesta tela.
async function carregarEstacionamento() {
  try {
    const resposta = await fetch(
      "http://localhost:8080/estacioNatal/estacionamentos/1",
    );
    if (!resposta.ok) {
      const erro = new Error("Falha ao consultar o estacionamento.");
      erro.status = resposta.status;
      throw erro;
    }

    estacionamentoAtual = await resposta.json();
    if (!Array.isArray(estacionamentoAtual.pisos)) {
      throw new Error("A resposta da API não contém uma lista de pisos.");
    }

    localEstacionamento.textContent =
      estacionamentoAtual.endereco || "Endereço não informado";
    document.querySelector("#parking-options").replaceChildren(
      ...[estacionamentoAtual.nome, estacionamentoAtual.endereco]
        .filter(Boolean)
        .map((valor) => {
          const opcao = document.createElement("option");
          opcao.value = valor;
          return opcao;
        }),
    );
    carregarPisos();
    atualizarBusca();
  } catch (erro) {
    mostrarErroDeCarregamento(erro);
  }
}

campoBusca.addEventListener("input", atualizarBusca);

seletorPiso.addEventListener("change", () => {
  selecionarPiso(Number(seletorPiso.value));
});

filtroAcessibilidade.addEventListener("click", () => {
  const ativado = filtroAcessibilidade.getAttribute("aria-pressed") === "true";
  filtroAcessibilidade.setAttribute("aria-pressed", String(!ativado));
  renderizarVagas();
});

document.addEventListener("keydown", (evento) => {
  if ((evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === "k") {
    evento.preventDefault();
    campoBusca.focus();
  }
});

atualizarBusca();
carregarEstacionamento();
