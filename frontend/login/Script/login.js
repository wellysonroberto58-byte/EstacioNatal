const formularioLogin = document.querySelector(".login-form");
const linkRecuperarSenha = document.querySelector("#forgot-password");
const mensagemLogin = document.querySelector("#login-message");
const textoErro = document.querySelector("#texto-mensagem");
const sobreposicaoErro = document.querySelector("#overlay-login");
let temporizadorErro;

function mostrarMensagemLogin(mensagem, estado) {
  mensagemLogin.textContent = mensagem;
  mensagemLogin.dataset.state = estado;
  mensagemLogin.hidden = false;
}

function mostrarErroDeAutenticacao(mensagem) {
  textoErro.textContent = mensagem;
  sobreposicaoErro.classList.add("ativa");
  clearTimeout(temporizadorErro);
  temporizadorErro = setTimeout(() => {
    sobreposicaoErro.classList.remove("ativa");
  }, 3000);
}

// Exibe os erros nativos do formulário em uma mensagem acessível.
formularioLogin.addEventListener(
  "invalid",
  () => {
    mostrarMensagemLogin(
      "Confira os campos destacados e corrija os dados.",
      "error",
    );
  },
  true,
);

formularioLogin.addEventListener("input", () => {
  if (
    mensagemLogin.dataset.state === "error" &&
    formularioLogin.querySelector(":invalid") === null
  ) {
    mensagemLogin.hidden = true;
  }
});

// Envia as credenciais ao serviço e apresenta erros sem duplicar o envio.
formularioLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagemLogin.hidden = true;

  const dadosLogin = {
    email: document.querySelector("#identifier").value.trim(),
    senha: document.querySelector("#password").value,
  };

  try {
    const resposta = await fetch(
      "http://localhost:8080/estacioNatal/login/motorista",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosLogin),
      },
    );

    if (resposta.status === 401) {
      throw new Error("E-mail ou senha incorretos.");
    }
    if (!resposta.ok) {
      throw new Error("Não foi possível realizar o acesso.");
    }

    const retorno = await resposta.text();
    console.log("Acesso realizado:", retorno);
    mostrarMensagemLogin("Acesso realizado com sucesso.", "success");
    window.location.href = "../homeMotorista/motorista.html";
  } catch (erro) {
    console.error("Erro ao realizar acesso:", erro);
    const mensagem =
      erro.message || "Não foi possível conectar ao serviço de autenticação.";
    mostrarMensagemLogin(mensagem, "error");
    mostrarErroDeAutenticacao(mensagem);
  }
});

linkRecuperarSenha.addEventListener("click", (evento) => {
  evento.preventDefault();
  mostrarMensagemLogin(
    "A recuperação de senha ainda não está configurada.",
    "warning",
  );
});
