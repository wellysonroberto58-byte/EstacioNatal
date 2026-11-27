// Inicializa o editor da estrutura e mantém seu estado isolado nesta página.
function iniciarPaginaEstrutura(raiz) {
  function exigirElemento(seletor) {
    const elemento = raiz.querySelector(seletor);
    if (!elemento) {
      throw new Error(
        `Elemento obrigatório não encontrado na página de estrutura: ${seletor}`,
      );
    }
    return elemento;
  }

  const elementos = {
    conteudoEstrutura: exigirElemento("[data-structure-content]"),
    formularioEstrutura: exigirElemento("#structure-form"),
    nomeEstrutura: exigirElemento("#structure-name"),
    enderecoEstrutura: exigirElemento("#structure-address"),
    quantidadePisos: exigirElemento("#floor-count"),
    abasPisos: exigirElemento("#floor-tabs"),
    nomePiso: exigirElemento("#floor-name"),
    identificadorSetor: exigirElemento("#sector-id"),
    quantidadeVagasSetor: exigirElemento("#sector-spot-count"),
    botaoAdicionarSetor: exigirElemento("#add-sector-button"),
    listaSetores: exigirElemento("#sectors-list"),
    contadorPisos: exigirElemento("#floor-counter"),
    botaoCancelarEstrutura: exigirElemento("#cancel-structure"),
    mensagemEstrutura: exigirElemento("#structure-message"),
  };

  const MAXIMO_PISOS = 20;
  const MAXIMO_VAGAS_POR_SETOR = 999;

  function criarPiso(indice) {
    return {
      identificador: `Piso ${indice + 1}`,
      setores: [],
    };
  }

  let pisos = [criarPiso(0)];
  let indicePisoAtivo = 0;
  let nomeEstacionamento = "";
  let enderecoEstacionamento = "";

  function mostrarMensagemEstrutura(mensagem, estado = "error") {
    elementos.mensagemEstrutura.textContent = mensagem;
    elementos.mensagemEstrutura.dataset.state = estado;
    elementos.mensagemEstrutura.hidden = false;
  }

  function limparMensagemEstrutura() {
    elementos.mensagemEstrutura.textContent = "";
    elementos.mensagemEstrutura.hidden = true;
    delete elementos.mensagemEstrutura.dataset.state;
  }

  function criarElementoTexto(tag, classe, texto) {
    const elemento = document.createElement(tag);
    elemento.className = classe;
    elemento.textContent = texto;
    return elemento;
  }

  function obterPisoAtivo() {
    return pisos[indicePisoAtivo];
  }

  // Atualiza as abas e o contador a partir do estado atual dos pisos.
  function renderizarAbasPisos() {
    elementos.abasPisos.replaceChildren();

    pisos.forEach((piso, indice) => {
      const botao = document.createElement("button");
      botao.className = "floor-tab";
      botao.type = "button";
      botao.dataset.floorIndex = String(indice);
      botao.setAttribute("aria-pressed", String(indice === indicePisoAtivo));
      botao.append(
        criarElementoTexto(
          "span",
          "floor-tab-number",
          String(indice + 1).padStart(2, "0"),
        ),
        criarElementoTexto(
          "span",
          "floor-tab-name",
          piso.identificador || `Piso ${indice + 1}`,
        ),
        criarElementoTexto(
          "span",
          "floor-tab-count",
          String(piso.setores.length),
        ),
      );
      elementos.abasPisos.append(botao);
    });

    elementos.contadorPisos.textContent = `${pisos.length} ${
      pisos.length === 1 ? "piso" : "pisos"
    }`;
  }

  function criarCartaoSetor(setor, indiceSetor) {
    const cartao = document.createElement("article");
    cartao.className = "sector-card";

    const conteudo = document.createElement("div");
    conteudo.className = "sector-card-content";

    const titulo = document.createElement("div");
    titulo.className = "sector-card-title";
    titulo.append(
      criarElementoTexto("strong", "", `Setor ${setor.identificador}`),
      criarElementoTexto(
        "span",
        "",
        `${setor.quantidadeVaga} ${setor.quantidadeVaga === 1 ? "vaga" : "vagas"}`,
      ),
    );
    conteudo.append(titulo);

    const botaoRemover = document.createElement("button");
    botaoRemover.className = "remove-sector-button";
    botaoRemover.type = "button";
    botaoRemover.dataset.removeSector = String(indiceSetor);
    botaoRemover.setAttribute(
      "aria-label",
      `Remover setor ${setor.identificador}`,
    );
    botaoRemover.textContent = "×";

    cartao.append(conteudo, botaoRemover);
    return cartao;
  }

  function renderizarSetores() {
    const setores = obterPisoAtivo().setores;
    elementos.listaSetores.replaceChildren();

    if (setores.length === 0) {
      const estadoVazio = document.createElement("div");
      estadoVazio.className = "empty-sectors";
      const icone = criarElementoTexto("span", "empty-sectors-icon", "+");
      icone.setAttribute("aria-hidden", "true");
      const texto = document.createElement("span");
      texto.append(
        criarElementoTexto("strong", "", "Nenhum setor neste piso"),
        criarElementoTexto(
          "small",
          "",
          "Adicione o primeiro setor para começar a distribuir as vagas.",
        ),
      );
      estadoVazio.append(icone, texto);
      elementos.listaSetores.append(estadoVazio);
      return;
    }

    setores.forEach((setor, indice) => {
      elementos.listaSetores.append(criarCartaoSetor(setor, indice));
    });
  }

  function renderizarEditor() {
    elementos.nomeEstrutura.value = nomeEstacionamento;
    elementos.enderecoEstrutura.value = enderecoEstacionamento;
    elementos.quantidadePisos.value = String(pisos.length);
    elementos.nomePiso.value = obterPisoAtivo().identificador;
    renderizarAbasPisos();
    renderizarSetores();
  }

  function definirPisoAtivo(indice) {
    if (!Number.isInteger(indice) || !pisos[indice]) {
      return;
    }

    indicePisoAtivo = indice;
    elementos.nomePiso.value = obterPisoAtivo().identificador;
    renderizarAbasPisos();
    renderizarSetores();
    limparMensagemEstrutura();
  }

  // Confirma antes de descartar setores quando a quantidade de pisos diminui.
  function ajustarQuantidadePisos() {
    const novaQuantidade = Number(elementos.quantidadePisos.value);
    const quantidadeAnterior = pisos.length;

    if (
      !Number.isInteger(novaQuantidade) ||
      novaQuantidade < 1 ||
      novaQuantidade > MAXIMO_PISOS
    ) {
      mostrarMensagemEstrutura(
        `Informe uma quantidade entre 1 e ${MAXIMO_PISOS} pisos.`,
      );
      elementos.quantidadePisos.value = String(quantidadeAnterior);
      return;
    }

    const pisosRemovidos = pisos.slice(novaQuantidade);
    const possuiSetores = pisosRemovidos.some(
      (piso) => piso.setores.length > 0,
    );
    if (
      novaQuantidade < quantidadeAnterior &&
      possuiSetores &&
      !window.confirm(
        "Os pisos removidos e seus setores serão descartados. Deseja continuar?",
      )
    ) {
      elementos.quantidadePisos.value = String(quantidadeAnterior);
      return;
    }

    while (pisos.length < novaQuantidade) {
      pisos.push(criarPiso(pisos.length));
    }
    pisos.length = novaQuantidade;
    indicePisoAtivo = Math.min(indicePisoAtivo, novaQuantidade - 1);
    renderizarEditor();
    limparMensagemEstrutura();
  }

  function adicionarSetor() {
    const piso = obterPisoAtivo();
    const identificador = elementos.identificadorSetor.value.trim().toUpperCase();
    const quantidadeVagas = Number(elementos.quantidadeVagasSetor.value);

    elementos.identificadorSetor.setCustomValidity("");
    elementos.quantidadeVagasSetor.setCustomValidity("");

    if (!/^[A-Z0-9]{1,6}$/.test(identificador)) {
      elementos.identificadorSetor.setCustomValidity(
        "Use de 1 a 6 letras ou números, sem espaços.",
      );
      elementos.identificadorSetor.reportValidity();
      return;
    }

    if (
      !Number.isInteger(quantidadeVagas) ||
      quantidadeVagas < 1 ||
      quantidadeVagas > MAXIMO_VAGAS_POR_SETOR
    ) {
      elementos.quantidadeVagasSetor.setCustomValidity(
        `Informe uma quantidade entre 1 e ${MAXIMO_VAGAS_POR_SETOR} vagas.`,
      );
      elementos.quantidadeVagasSetor.reportValidity();
      return;
    }

    if (piso.setores.some((setor) => setor.identificador === identificador)) {
      elementos.identificadorSetor.setCustomValidity(
        "Este identificador já está cadastrado neste piso.",
      );

      elementos.identificadorSetor.reportValidity();
      return;
    }

    piso.setores.push({
      identificador,
      quantidadeVaga: quantidadeVagas,
    });
    elementos.identificadorSetor.value = "";
    elementos.quantidadeVagasSetor.value = "12";
    renderizarAbasPisos();
    renderizarSetores();
    limparMensagemEstrutura();
  }

  function reiniciarEditor() {
    pisos = [criarPiso(0)];
    indicePisoAtivo = 0;
    nomeEstacionamento = "";
    enderecoEstacionamento = "";
    elementos.identificadorSetor.value = "";
    elementos.quantidadeVagasSetor.value = "12";
    elementos.nomePiso.setCustomValidity("");
    elementos.identificadorSetor.setCustomValidity("");
    elementos.quantidadeVagasSetor.setCustomValidity("");
    renderizarEditor();
  }

  function cancelarAlteracoes() {
    reiniciarEditor();
    mostrarMensagemEstrutura("Alterações descartadas nesta prévia.", "info");
  }

  // Valida o modelo completo antes de enviá-lo à API.
  async function enviarFormulario(evento) {
    evento.preventDefault();
    elementos.nomeEstrutura.value = elementos.nomeEstrutura.value.trim();
    elementos.enderecoEstrutura.value = elementos.enderecoEstrutura.value.trim();
    elementos.nomePiso.value = elementos.nomePiso.value.trim();

    if (!elementos.formularioEstrutura.reportValidity()) {
      return;
    }

    const indicePisoSemNome = pisos.findIndex(
      (piso) => !piso.identificador.trim(),
    );
    if (indicePisoSemNome !== -1) {
      definirPisoAtivo(indicePisoSemNome);
      elementos.nomePiso.setCustomValidity("Informe um nome para este piso.");
      elementos.nomePiso.reportValidity();
      return;
    }

    const novoEstacionamento = {
      nome: elementos.nomeEstrutura.value,
      endereco: elementos.enderecoEstrutura.value,
      pisos,
    };

    obterPisoAtivo().identificador = elementos.nomePiso.value;
    try {
      const resposta = await fetch(
        "http://localhost:8080/estacioNatal/estacionamentos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoEstacionamento),
        },
      );
      if (!resposta.ok) {
        throw new Error("Não foi possível cadastrar o estacionamento.");
      }

      elementos.formularioEstrutura.reset();
      reiniciarEditor();
      mostrarMensagemEstrutura("Estacionamento cadastrado com sucesso.", "success");
    } catch (erro) {
      console.error("Erro ao cadastrar estacionamento:", erro);
      mostrarMensagemEstrutura(
        erro.message || "Não foi possível cadastrar o estacionamento.",
      );
    }
  }

  function tratarCliqueNaEstrutura(evento) {
    if (!(evento.target instanceof Element)) {
      return;
    }

    const botaoPiso = evento.target.closest("[data-floor-index]");
    if (botaoPiso && elementos.abasPisos.contains(botaoPiso)) {
      definirPisoAtivo(Number(botaoPiso.dataset.floorIndex));
      return;
    }

    const botaoRemover = evento.target.closest("[data-remove-sector]");
    if (botaoRemover && elementos.listaSetores.contains(botaoRemover)) {
      const indiceSetor = Number(botaoRemover.dataset.removeSector);
      obterPisoAtivo().setores.splice(indiceSetor, 1);
      renderizarAbasPisos();
      renderizarSetores();
      limparMensagemEstrutura();
    }
  }

  elementos.quantidadePisos.addEventListener("change", ajustarQuantidadePisos);
  elementos.nomePiso.addEventListener("input", () => {
    elementos.nomePiso.setCustomValidity("");
    obterPisoAtivo().identificador = elementos.nomePiso.value;
    const nomeAba = elementos.abasPisos.querySelector(
      `[data-floor-index="${indicePisoAtivo}"] .floor-tab-name`,
    );
    if (nomeAba) {
      nomeAba.textContent =
        elementos.nomePiso.value || `Piso ${indicePisoAtivo + 1}`;
    }
    limparMensagemEstrutura();
  });
  elementos.nomeEstrutura.addEventListener("input", () => {
    nomeEstacionamento = elementos.nomeEstrutura.value;
    limparMensagemEstrutura();
  });
  elementos.enderecoEstrutura.addEventListener("input", () => {
    enderecoEstacionamento = elementos.enderecoEstrutura.value;
    limparMensagemEstrutura();
  });
  elementos.identificadorSetor.addEventListener("input", () => {
    elementos.identificadorSetor.setCustomValidity("");
  });
  elementos.quantidadeVagasSetor.addEventListener("input", () => {
    elementos.quantidadeVagasSetor.setCustomValidity("");
  });
  elementos.botaoAdicionarSetor.addEventListener("click", adicionarSetor);
  elementos.formularioEstrutura.addEventListener("submit", enviarFormulario);
  elementos.botaoCancelarEstrutura.addEventListener(
    "click",
    cancelarAlteracoes,
  );
  elementos.conteudoEstrutura.addEventListener(
    "click",
    tratarCliqueNaEstrutura,
  );
  renderizarEditor();
}

iniciarPaginaEstrutura(document);
