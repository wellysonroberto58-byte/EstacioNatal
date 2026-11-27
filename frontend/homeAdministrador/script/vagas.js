
const API_URL = "http://localhost:8080/estacioNatal/vagas";

// Elementos do mapa
const parkingGrid = document.querySelector("#parking-grid");

// Elementos do editor
const selectedTitle = document.querySelector("#selected-title");
const spotActions = document.querySelector("#spot-actions");
const spotStatus = document.querySelector("#spot-status");
const spotType = document.querySelector("#spot-type");

// Botões e mensagens
const btnRecarregar = document.querySelector("#btn-recarregar");
const btnSalvar = document.querySelector("#btn-salvar-vaga");
const mensagemVaga = document.querySelector("#mensagem-vaga");

// Indicadores
const totalVagas = document.querySelector("#total-vagas");
const totalDisponiveis = document.querySelector("#total-disponiveis");
const totalOcupadas = document.querySelector("#total-ocupadas");
const totalManutencao = document.querySelector("#total-manutencao");

// Dados
let vagas = [];
let vagaSelecionada = null;



async function carregarVagas() {

    try {

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar vagas.");
        }

        vagas = await resposta.json();

        renderizarMapa();
        atualizarResumo();

    } catch (erro) {

        console.error(erro);

        parkingGrid.textContent = "Não foi possível carregar as vagas.";

    }

}


function renderizarMapa() {

    parkingGrid.innerHTML = "";

    if (vagas.length === 0) {
        parkingGrid.textContent = "Nenhuma vaga cadastrada.";
        return;
    }

    vagas.forEach(vaga => {

        const elemento = document.createElement("button");

        elemento.type = "button";
        elemento.classList.add("parking-spot");

        // Identificação da vaga
        elemento.textContent = vaga.identificador;

        // Classe visual conforme o status
        elemento.classList.add(vaga.status.toLowerCase());

        // Destaque para vagas acessíveis
        if (vaga.tipo === "ACESSIVEL") {
            elemento.classList.add("accessible");
        }

        // Identifica a vaga selecionada
        if (vagaSelecionada && vagaSelecionada.id === vaga.id) {
            elemento.classList.add("selected");
        }

        // Evento de seleção
        elemento.addEventListener("click", () => {
            selecionarVaga(vaga.id);
        });

        parkingGrid.appendChild(elemento);

    });

}


function atualizarResumo() {

    totalVagas.textContent = vagas.length;

    totalDisponiveis.textContent = vagas.filter(
        vaga => vaga.status === "DISPONIVEL"
    ).length;

    totalOcupadas.textContent = vagas.filter(
        vaga => vaga.status === "OCUPADO"
    ).length;

    totalManutencao.textContent = vagas.filter(
        vaga => vaga.status === "MANUTENCAO"
    ).length;

}


function selecionarVaga(id) {

    // Procura a vaga pelo ID
    vagaSelecionada = vagas.find(vaga => vaga.id === id);

    if (!vagaSelecionada) {
        return;
    }

    // Exibe a identificação da vaga
    selectedTitle.textContent =
        `Vaga ${vagaSelecionada.identificador}`;

    // Preenche os campos com os dados atuais
    spotStatus.value = vagaSelecionada.status;
    spotType.value = vagaSelecionada.tipo;

    // Mostra o painel de edição
    spotActions.hidden = false;

    // Atualiza o destaque visual no mapa
    renderizarMapa();

    // Limpa mensagens anteriores
    mensagemVaga.textContent = "";

}


btnRecarregar.addEventListener("click", carregarVagas);

// Carrega as vagas quando a página abrir
carregarVagas();


async function salvarAlteracoes() {

    if (!vagaSelecionada) {
        return;
    }

    const id = vagaSelecionada.id;

    const dadosAtualizados = {
        identificador: vagaSelecionada.identificador,
        status: spotStatus.value,
        tipo: spotType.value
    };

    try {

        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao atualizar a vaga.");
        }

        mensagemVaga.textContent = "Vaga atualizada com sucesso!";

        await carregarVagas();

        selecionarVaga(id);

    } catch (erro) {

        console.error(erro);
        mensagemVaga.textContent = "Não foi possível atualizar a vaga.";

    }
}

btnSalvar.addEventListener("click", salvarAlteracoes);


