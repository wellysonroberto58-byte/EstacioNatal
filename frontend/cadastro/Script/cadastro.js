const formularioCadastro = document.querySelector(".signup-form");
const campoSenha = document.querySelector("#password");
const confirmacaoSenha = document.querySelector("#confirm-password");
const mensagemCadastro = document.querySelector(".form-message");

function validarConfirmacaoSenha() {
  confirmacaoSenha.setCustomValidity(
    confirmacaoSenha.value === campoSenha.value
      ? ""
      : "As senhas não coincidem.",
  );
}

function mostrarMensagemCadastro(mensagem, estado) {
  mensagemCadastro.textContent = mensagem;
  mensagemCadastro.dataset.state = estado;
  mensagemCadastro.hidden = false;
}

campoSenha.addEventListener("input", validarConfirmacaoSenha);
confirmacaoSenha.addEventListener("input", validarConfirmacaoSenha);

// Mantém a validação do navegador e informa como corrigir os campos.
formularioCadastro.addEventListener(
  "invalid",
  () => {
    mostrarMensagemCadastro(
      "Confira os campos destacados e corrija os dados.",
      "error",
    );
  },
  true,
);

formularioCadastro.addEventListener("input", () => {
  if (
    mensagemCadastro.dataset.state === "error" &&
    formularioCadastro.querySelector(":invalid") === null
  ) {
    mensagemCadastro.hidden = true;
  }
});

formularioCadastro.addEventListener("reset", () => {
  confirmacaoSenha.setCustomValidity("");
  mensagemCadastro.textContent = "";
  mensagemCadastro.hidden = true;
  delete mensagemCadastro.dataset.state;
});

// Envia ao backend somente os dados esperados pelo cadastro de motorista.
formularioCadastro.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const novoMotorista = {
    nome: document.querySelector("#name").value.trim(),
    email: document.querySelector("#email").value.trim(),
    placa: document.querySelector("#placa").value.trim(),
    cpf: document.querySelector("#cpf").value.trim(),
    senhaHash: campoSenha.value,
  };

  try {
    const resposta = await fetch(
      "http://localhost:8080/estacioNatal/motoristas",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoMotorista),
      },
    );
    if (!resposta.ok) {
      throw new Error("Não foi possível cadastrar o motorista.");
    }

    await resposta.text();
    formularioCadastro.reset();
    mostrarMensagemCadastro("Cadastro realizado com sucesso.", "success");
  } catch (erro) {
    console.error("Erro ao cadastrar motorista:", erro);
    mostrarMensagemCadastro(
      erro.message || "Não foi possível conectar ao serviço de cadastro.",
      "error",
    );
  }
});
