const API_URL = "http://localhost:8080/estacioNatal/vagas"; 
//fica mais fácil de colcoar rota e organizado ao separar uma referência na memória

const filtroStatus = document.querySelector("#filtro-status");
const filtroTipo = document.querySelector("#filtro-tipo");
const listaVagas = document.querySelector("#lista-vagas");

async function carregarVagas() {

    try {

        const resposta = await fetch(API_URL);

        const vagas = await resposta.json();

        exibirVagas(vagas);

    } catch (erro) {

        console.error("Erro ao carregar vagas:", erro);

        listaVagas.textContent = "Não foi possível carregar as vagas.";

    }

}

function exibirVagas(vagas) {

    listaVagas.innerHTML = "";

    if (vagas.length === 0) {
        listaVagas.textContent = "Nenhuma vaga encontrada.";
        return;
    }

    vagas.forEach(vaga => {

        const elemento = document.createElement("div");

        elemento.innerHTML = `
            <h3>Vaga ${vaga.identificador}</h3>
            <p>ID: ${vaga.id}</p>
            <p>Status: ${vaga.status}</p>
            <p>Tipo: ${vaga.tipo}</p>
        `;

        listaVagas.appendChild(elemento);

    });

}

async function filtrarVagas() {

    const status = filtroStatus.value;
    const tipo = filtroTipo.value;

    let url = API_URL;

    if (status !== "") {
        url += `?status=${status}`;
    } 
    else if (tipo !== "") {
        url += `?tipo=${tipo}`;
    }

    try {

        const resposta = await fetch(url);

        const vagas = await resposta.json();

        exibirVagas(vagas);

    } catch (erro) {

        console.error("Erro ao filtrar vagas:", erro);

        listaVagas.textContent = "Erro ao filtrar vagas.";

    }

}

filtroStatus.addEventListener("change", filtrarVagas);

filtroTipo.addEventListener("change", filtrarVagas);

carregarVagas();