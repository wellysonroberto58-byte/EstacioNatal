
const listaMotoristas = document.querySelector("#lista-motoristas");
const totalMotoristas = document.querySelector("#total-motoristas");
const pesquisaMotorista = document.querySelector("#pesquisa-motorista");
const mensagemUsuarios = document.querySelector("#mensagem-usuarios");

let motoristas = [];

// Busca os motoristas cadastrados na API
async function carregarMotoristas() {
  try {
    mensagemUsuarios.textContent = "Carregando motoristas...";

    const resposta = await fetch(
      "http://localhost:8080/estacioNatal/motoristas"
    );

    if (!resposta.ok) {
      throw new Error("Erro ao buscar motoristas.");
    }

    motoristas = await resposta.json();

    renderizarMotoristas(motoristas);

    totalMotoristas.textContent = motoristas.length;

  } catch (erro) {
    console.error("Erro:", erro);

    mensagemUsuarios.textContent =
      "Não foi possível carregar os motoristas.";
  }
}

function renderizarMotoristas(lista) {
    listaMotoristas.replaceChildren();

    if (lista.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 4;
        celula.textContent = "Nenhum motorista encontrado.";

        linha.appendChild(celula);
        listaMotoristas.appendChild(linha);

        return;
    }

    lista.forEach(motorista => {
        const linha = document.createElement("tr");

        const dados = [
            motorista.id,
            motorista.nome,
            motorista.email,
            motorista.placa
        ];

        dados.forEach(valor => {
            const celula = document.createElement("td");

            celula.textContent = valor ?? "-";

            linha.appendChild(celula);
        });

        listaMotoristas.appendChild(linha);
    });
}

function pesquisarMotoristas() {
    const termo = pesquisaMotorista.value.toLowerCase().trim();

    const motoristasFiltrados = motoristas.filter(motorista => {
        return (
            motorista.nome.toLowerCase().includes(termo) ||
            motorista.email.toLowerCase().includes(termo) ||
            motorista.placa.toLowerCase().includes(termo)
        );
    });

    renderizarMotoristas(motoristasFiltrados);
}

// Inicializa a listagem
carregarMotoristas();

console.log("USUARIO CARREGADO");

pesquisaMotorista.addEventListener("input", pesquisarMotoristas);


